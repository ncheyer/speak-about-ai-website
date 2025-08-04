"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { WishlistItem } from '@/lib/wishlist-utils'
import { getSessionId } from '@/lib/client-session'

interface WishlistContextType {
  wishlist: WishlistItem[]
  wishlistCount: number
  isLoading: boolean
  addToWishlist: (speakerId: number) => Promise<boolean>
  removeFromWishlist: (speakerId: number) => Promise<boolean>
  clearWishlist: () => Promise<boolean>
  isInWishlist: (speakerId: number) => boolean
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Load wishlist on component mount
  useEffect(() => {
    refreshWishlist()
  }, [])

  const refreshWishlist = async () => {
    try {
      setIsLoading(true)
      const sessionId = getSessionId()
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      if (response.ok) {
        const data = await response.json()
        setWishlist(data.wishlist || [])
        setWishlistCount(data.count || 0)
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToWishlist = async (speakerId: number): Promise<boolean> => {
    try {
      const sessionId = getSessionId()
      console.log('Adding to wishlist:', { speakerId, sessionId })
      
      const response = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speakerId, sessionId })
      })

      console.log('Add response:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Add to wishlist failed:', errorData)
      }

      if (response.ok) {
        await refreshWishlist()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
      return false
    }
  }

  const removeFromWishlist = async (speakerId: number): Promise<boolean> => {
    try {
      const sessionId = getSessionId()
      const response = await fetch('/api/wishlist/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speakerId, sessionId })
      })

      if (response.ok) {
        await refreshWishlist()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      return false
    }
  }

  const clearWishlist = async (): Promise<boolean> => {
    try {
      const sessionId = getSessionId()
      const response = await fetch('/api/wishlist/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })

      if (response.ok) {
        setWishlist([])
        setWishlistCount(0)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to clear wishlist:', error)
      return false
    }
  }

  const isInWishlist = (speakerId: number): boolean => {
    return wishlist.some(item => item.speakerId === speakerId)
  }

  const value: WishlistContextType = {
    wishlist,
    wishlistCount,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    refreshWishlist
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}