import { NextRequest, NextResponse } from "next/server"
import { verifyPassword } from "@/lib/password-utils"
import { createToken } from "@/lib/jwt-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Get admin credentials from environment variables
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH
    
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
      console.error("Admin credentials not configured in environment variables")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Add small delay to prevent brute force attacks
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check credentials
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() || !verifyPassword(password, ADMIN_PASSWORD_HASH)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate secure JWT token
    const sessionToken = createToken({
      email: ADMIN_EMAIL,
      role: "admin"
    }, 24) // 24 hour expiration

    // Return success response
    const response = NextResponse.json({
      success: true,
      user: {
        email: ADMIN_EMAIL,
        name: "Admin User",
        role: "admin"
      },
      sessionToken
    })

    // Set HTTP-only cookie for additional security
    response.cookies.set('adminLoggedIn', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    response.cookies.set('adminSessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}