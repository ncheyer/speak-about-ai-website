import { NextRequest, NextResponse } from "next/server"
import { verifyToken, createToken } from "@/lib/jwt-utils"

export async function POST(request: NextRequest) {
  try {
    // Get the current session token
    const authHeader = request.headers.get('authorization')
    let token: string | null = null

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      token = request.cookies.get('adminSessionToken')?.value || null
    }

    if (!token) {
      return NextResponse.json(
        { error: 'No session token provided', code: 'NO_TOKEN' },
        { status: 401 }
      )
    }

    // Verify the current token
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Invalid or expired session', code: 'INVALID_TOKEN' },
        { status: 401 }
      )
    }

    // Create a new token with refreshed expiration (1 hour from now)
    const newToken = createToken({
      email: payload.email,
      role: 'admin'
    }, 1) // 1 hour expiration

    // Return the new token
    const response = NextResponse.json({
      success: true,
      sessionToken: newToken,
      expiresIn: 3600 // seconds
    })

    // Update the cookie
    response.cookies.set('adminSessionToken', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/'
    })

    response.cookies.set('adminLoggedIn', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/'
    })

    return response

  } catch (error) {
    console.error("Session refresh error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
