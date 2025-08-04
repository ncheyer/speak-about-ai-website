import { NextRequest, NextResponse } from 'next/server'
import { clearWishlist } from '@/lib/wishlist-utils'

export async function POST(request: NextRequest) {
  try {
    // Get session ID from request body first, fallback to cookies
    const body = await request.json().catch(() => ({}))
    let sessionId = body.sessionId
    
    if (!sessionId) {
      sessionId = request.cookies.get('session_id')?.value
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 400 }
      )
    }

    const success = await clearWishlist(sessionId)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Failed to clear wishlist' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Clear wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to clear wishlist' },
      { status: 500 }
    )
  }
}