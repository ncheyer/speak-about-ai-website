import { NextRequest, NextResponse } from 'next/server'
import { addToWishlist } from '@/lib/wishlist-utils'

export async function POST(request: NextRequest) {
  try {
    const { speakerId, sessionId: bodySessionId } = await request.json()
    console.log('API: Add to wishlist request:', { speakerId, sessionId: bodySessionId })

    if (!speakerId) {
      console.log('API: Speaker ID is missing')
      return NextResponse.json(
        { error: 'Speaker ID is required' },
        { status: 400 }
      )
    }

    // Convert speakerId to number if it's not already
    let numericSpeakerId: number
    if (typeof speakerId === 'number') {
      numericSpeakerId = speakerId
    } else if (typeof speakerId === 'string' && !isNaN(Number(speakerId))) {
      numericSpeakerId = Number(speakerId)
    } else {
      console.log('API: Invalid speaker ID format:', typeof speakerId, speakerId)
      return NextResponse.json(
        { error: 'Speaker ID must be a valid number' },
        { status: 400 }
      )
    }

    console.log('API: Using numeric speaker ID:', numericSpeakerId)

    // Get session ID from request body first, fallback to cookies
    let sessionId = bodySessionId
    const visitorId = request.cookies.get('visitor_id')?.value

    // If no session ID in body, try cookies
    if (!sessionId) {
      sessionId = request.cookies.get('session_id')?.value
      console.log('API: Using cookie session ID:', sessionId)
    } else {
      console.log('API: Using body session ID:', sessionId)
    }

    if (!sessionId) {
      console.log('API: No session ID found')
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

    console.log('API: Calling addToWishlist with:', { sessionId, speakerId: numericSpeakerId, visitorId })
    const success = await addToWishlist(sessionId, numericSpeakerId, visitorId)
    console.log('API: addToWishlist result:', success)

    if (success) {
      console.log('API: Successfully added to wishlist')
      return NextResponse.json({ success: true })
    } else {
      // Add more context for debugging
      const hasDatabase = !!process.env.DATABASE_URL
      console.log('API: Failed to add to wishlist, hasDatabase:', hasDatabase)
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