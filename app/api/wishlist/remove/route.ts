import { NextRequest, NextResponse } from 'next/server'
import { removeFromWishlist } from '@/lib/wishlist-utils'

export async function POST(request: NextRequest) {
  try {
    const { speakerId } = await request.json()

    if (!speakerId || typeof speakerId !== 'number') {
      return NextResponse.json(
        { error: 'Speaker ID is required' },
        { status: 400 }
      )
    }

    // Get session ID from cookies
    const sessionId = request.cookies.get('session_id')?.value

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 400 }
      )
    }

    const success = await removeFromWishlist(sessionId, speakerId)

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