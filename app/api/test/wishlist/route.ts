import { NextRequest, NextResponse } from 'next/server'
import { addToWishlist, getWishlist } from '@/lib/wishlist-utils'

export async function POST(request: NextRequest) {
  try {
    console.log('TEST: Wishlist test endpoint called')
    
    const { sessionId } = await request.json()
    console.log('TEST: Session ID received:', sessionId)
    
    if (!sessionId) {
      return NextResponse.json({ 
        error: 'Session ID required for test',
        received: { sessionId }
      }, { status: 400 })
    }

    // Test adding speaker ID 1 to wishlist
    const testSpeakerId = 1
    console.log('TEST: Attempting to add speaker', testSpeakerId, 'to wishlist')
    
    const addResult = await addToWishlist(sessionId, testSpeakerId)
    console.log('TEST: Add result:', addResult)
    
    // Test getting wishlist
    console.log('TEST: Getting wishlist for session:', sessionId)
    const wishlist = await getWishlist(sessionId)
    console.log('TEST: Wishlist retrieved:', wishlist)
    
    return NextResponse.json({
      success: true,
      test: {
        sessionId,
        addResult,
        wishlistCount: wishlist.length,
        wishlist: wishlist.map(item => ({
          id: item.id,
          speakerId: item.speakerId,
          addedAt: item.addedAt
        }))
      },
      database: {
        hasUrl: !!process.env.DATABASE_URL,
        urlLength: process.env.DATABASE_URL?.length || 0
      }
    })
    
  } catch (error) {
    console.error('TEST: Error in wishlist test:', error)
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}