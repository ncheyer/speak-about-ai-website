import { NextRequest, NextResponse } from 'next/server'
import { removeFromWishlist } from '@/lib/wishlist-utils'

export async function POST(request: NextRequest) {
  try {
    const { speakerId, sessionId: bodySessionId } = await request.json()

    if (!speakerId) {
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
      return NextResponse.json(
        { error: 'Speaker ID must be a valid number' },
        { status: 400 }
      )
    }

    // Get session ID from request body first, fallback to cookies
    let sessionId = bodySessionId
    if (!sessionId) {
      sessionId = request.cookies.get('session_id')?.value
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 400 }
      )
    }

    const success = await removeFromWishlist(sessionId, numericSpeakerId)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Failed to remove from wishlist' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Remove from wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}