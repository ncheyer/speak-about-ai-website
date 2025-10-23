import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface UseAdminSessionOptions {
  inactivityTimeout?: number // milliseconds (default: 1 hour)
  warningTime?: number // milliseconds before timeout to show warning (default: 5 minutes)
  checkInterval?: number // how often to check for inactivity (default: 30 seconds)
}

interface SessionState {
  isActive: boolean
  timeUntilLogout: number | null
  showWarning: boolean
}

export function useAdminSession(options: UseAdminSessionOptions = {}) {
  const router = useRouter()
  const {
    inactivityTimeout = 60 * 60 * 1000, // 1 hour
    warningTime = 5 * 60 * 1000, // 5 minutes
    checkInterval = 30 * 1000 // 30 seconds
  } = options

  const [sessionState, setSessionState] = useState<SessionState>({
    isActive: true,
    timeUntilLogout: null,
    showWarning: false
  })

  const lastActivityRef = useRef<number>(Date.now())
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const refreshCooldownRef = useRef<number>(0)

  // Update last activity time
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now()

    // Clear any existing logout timeout
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current)
      logoutTimeoutRef.current = null
    }

    // Reset warning state
    setSessionState(prev => ({
      ...prev,
      showWarning: false,
      timeUntilLogout: null
    }))

    // Refresh session token if we haven't refreshed in the last 5 minutes
    const now = Date.now()
    if (now - refreshCooldownRef.current > 5 * 60 * 1000) {
      refreshSession()
      refreshCooldownRef.current = now
    }
  }, [])

  // Refresh session token
  const refreshSession = async () => {
    try {
      const token = localStorage.getItem('adminSessionToken')
      if (!token) return

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.sessionToken) {
          localStorage.setItem('adminSessionToken', data.sessionToken)
        }
      } else {
        // Token is invalid, logout
        console.warn('Session refresh failed, logging out')
        await performLogout()
      }
    } catch (error) {
      console.error('Failed to refresh session:', error)
    }
  }

  // Perform logout
  const performLogout = useCallback(async () => {
    try {
      // Clear local storage
      localStorage.removeItem('adminLoggedIn')
      localStorage.removeItem('adminSessionToken')
      localStorage.removeItem('adminUser')

      // Call logout endpoint to clear cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      // Redirect to login
      router.push('/admin')
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect even if API call fails
      router.push('/admin')
    }
  }, [router])

  // Extend session (called when user clicks "Stay logged in")
  const extendSession = useCallback(() => {
    updateActivity()
  }, [updateActivity])

  // Check for inactivity
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now()
      const timeSinceActivity = now - lastActivityRef.current
      const timeUntilTimeout = inactivityTimeout - timeSinceActivity

      // If we've exceeded the timeout, logout
      if (timeSinceActivity >= inactivityTimeout) {
        console.log('Session timed out due to inactivity')
        performLogout()
        return
      }

      // If we're within warning time, show warning
      if (timeUntilTimeout <= warningTime) {
        setSessionState({
          isActive: true,
          showWarning: true,
          timeUntilLogout: Math.ceil(timeUntilTimeout / 1000) // in seconds
        })

        // Set a timeout to logout when time expires
        if (!logoutTimeoutRef.current) {
          logoutTimeoutRef.current = setTimeout(() => {
            console.log('Session timed out after warning')
            performLogout()
          }, timeUntilTimeout)
        }
      } else {
        setSessionState({
          isActive: true,
          showWarning: false,
          timeUntilLogout: null
        })
      }
    }

    // Start checking for inactivity
    checkIntervalRef.current = setInterval(checkInactivity, checkInterval)

    // Initial check
    checkInactivity()

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current)
      }
    }
  }, [inactivityTimeout, warningTime, checkInterval, performLogout])

  // Track user activity
  useEffect(() => {
    // Only track if we're in a browser environment
    if (typeof window === 'undefined') return

    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ]

    // Throttled activity handler to avoid excessive calls
    let throttleTimeout: NodeJS.Timeout | null = null
    const throttledUpdateActivity = () => {
      if (!throttleTimeout) {
        updateActivity()
        throttleTimeout = setTimeout(() => {
          throttleTimeout = null
        }, 1000) // Throttle to once per second
      }
    }

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, throttledUpdateActivity, { passive: true })
    })

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, throttledUpdateActivity)
      })
      if (throttleTimeout) {
        clearTimeout(throttleTimeout)
      }
    }
  }, [updateActivity])

  // Validate session on mount
  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('adminSessionToken')
      if (!token) {
        performLogout()
        return
      }

      // Try to refresh the session
      await refreshSession()
    }

    validateSession()
  }, [performLogout])

  return {
    ...sessionState,
    extendSession,
    logout: performLogout
  }
}
