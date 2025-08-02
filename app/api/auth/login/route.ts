import { NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"

// Admin credentials
const ADMIN_EMAIL = "human@speakabout.ai"
const ADMIN_PASSWORD = "StrongCheyer2025!"

// Simple hash function for password verification
function hashPassword(password: string): string {
  return createHash('sha256').update(password + 'admin_salt_2025').digest('hex')
}

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

    // Add small delay to prevent brute force attacks
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check credentials
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate session token
    const sessionToken = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    // Return success response
    return NextResponse.json({
      success: true,
      user: {
        email: ADMIN_EMAIL,
        name: "Adam Cheyer",
        role: "admin"
      },
      sessionToken
    })

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}