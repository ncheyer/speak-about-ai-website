'use client'

/**
 * Client-side session management using localStorage
 * This approach works better than cookies in preview environments
 */

const SESSION_KEY = 'wishlist_session_id'
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

export interface SessionData {
  id: string
  createdAt: number
  lastActivity: number
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  // Generate a random ID with timestamp for uniqueness
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${randomPart}`
}

/**
 * Get or create a session
 */
export function getOrCreateSession(): SessionData {
  if (typeof window === 'undefined') {
    // Server-side rendering - return a temporary session
    console.log('getOrCreateSession: Running on server, returning temp session')
    return {
      id: 'ssr-temp',
      createdAt: Date.now(),
      lastActivity: Date.now()
    }
  }

  try {
    // Try to get existing session from localStorage
    const stored = localStorage.getItem(SESSION_KEY)
    console.log('getOrCreateSession: Stored session:', stored ? 'exists' : 'not found')
    
    if (stored) {
      const session: SessionData = JSON.parse(stored)
      console.log('getOrCreateSession: Parsed session:', session.id)
      
      // Check if session is still valid (not expired)
      if (Date.now() - session.createdAt < SESSION_DURATION) {
        // Update last activity
        session.lastActivity = Date.now()
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
        console.log('getOrCreateSession: Using existing session:', session.id)
        return session
      } else {
        console.log('getOrCreateSession: Session expired, creating new one')
      }
    }
  } catch (error) {
    console.warn('Failed to read session from localStorage:', error)
  }

  // Create new session
  const newSession: SessionData = {
    id: generateSessionId(),
    createdAt: Date.now(),
    lastActivity: Date.now()
  }

  console.log('getOrCreateSession: Creating new session:', newSession.id)

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession))
    console.log('getOrCreateSession: Saved new session to localStorage')
  } catch (error) {
    console.warn('Failed to save session to localStorage:', error)
  }

  return newSession
}

/**
 * Clear the current session
 */
export function clearSession(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch (error) {
      console.warn('Failed to clear session:', error)
    }
  }
}

/**
 * Get current session ID
 */
export function getSessionId(): string {
  return getOrCreateSession().id
}