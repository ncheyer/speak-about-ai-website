import { NextRequest, NextResponse } from 'next/server'
import { addToWishlist } from '@/lib/wishlist-utils'

export async function POST(request: NextRequest) {
  try {
    const { speakerId, sessionId: bodySessionId } = await request.json()

    if (!speakerId || typeof speakerId !== 'number') {
      return NextResponse.json(
        { error: 'Speaker ID is required' },
        { status: 400 }
      )
    }

    // Get session ID from request body first, fallback to cookies
    let sessionId = bodySessionId
    const visitorId = request.cookies.get('visitor_id')?.value

    // If no session ID in body, try cookies
    if (!sessionId) {
      sessionId = request.cookies.get('session_id')?.value
    }

    if (!sessionId) {
      return NextResponse.json(
        { 
          error: 'Session not found',
          debug: {
            message: 'No session ID provided in request body or cookies',
            hint: 'Session ID should be passed in request body'
          }
        },
        { status: 400 }
      )
    }

    const success = await addToWishlist(sessionId, speakerId, visitorId)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      // Add more context for debugging
      const hasDatabase = !!process.env.DATABASE_URL
      return NextResponse.json(
        { 
          error: 'Failed to add to wishlist',
          debug: {
            hasDatabase,
            message: hasDatabase 
              ? 'Database connection failed - check credentials' 
              : 'DATABASE_URL not configured'
          }
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Add to wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}