import { NextRequest, NextResponse } from 'next/server'
import { addToWishlist } from '@/lib/wishlist-utils'

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
    const visitorId = request.cookies.get('visitor_id')?.value

    if (!sessionId) {
      // Debug: Check all cookies
      const allCookies = request.cookies.getAll()
      console.log('Debug - All cookies:', allCookies.map(c => c.name))
      
      return NextResponse.json(
        { 
          error: 'Session not found',
          debug: {
            message: 'No session_id cookie found',
            cookieNames: allCookies.map(c => c.name),
            hint: 'Session cookie may not be set properly in this environment'
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