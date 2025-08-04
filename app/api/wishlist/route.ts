import { NextRequest, NextResponse } from 'next/server'
import { getWishlist, getWishlistCount } from '@/lib/wishlist-utils'

export async function GET(request: NextRequest) {
  try {
    // Get session ID from cookies
    const sessionId = request.cookies.get('session_id')?.value

    if (!sessionId) {
      return NextResponse.json({ wishlist: [], count: 0 })
    }

    const wishlist = await getWishlist(sessionId)
    const count = await getWishlistCount(sessionId)

    return NextResponse.json({
      success: true,
      wishlist,
      count
    })

  } catch (error) {
    console.error('Wishlist GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Accept session ID from request body
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ wishlist: [], count: 0 })
    }

    const wishlist = await getWishlist(sessionId)
    const count = await getWishlistCount(sessionId)

    return NextResponse.json({
      success: true,
      wishlist,
      count
    })

  } catch (error) {
    console.error('Wishlist POST error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}