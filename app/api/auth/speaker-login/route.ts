import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { verifyPassword } from '@/lib/password-utils'

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Add small delay to prevent brute force attacks
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Get speaker with password hash
    const speakers = await sql`
      SELECT id, email, name, active, password_hash, email_verified
      FROM speakers
      WHERE email = ${email.toLowerCase()} AND active = true
      LIMIT 1
    `

    if (speakers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const speaker = speakers[0]

    // Check if speaker has set a password
    if (!speaker.password_hash) {
      return NextResponse.json(
        { error: 'Please set your password first. Contact admin for assistance.' },
        { status: 401 }
      )
    }

    // Verify password
    if (!verifyPassword(password, speaker.password_hash)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check email verification
    if (!speaker.email_verified) {
      return NextResponse.json(
        { error: 'Please verify your email address first' },
        { status: 401 }
      )
    }

    // Generate session token
    const sessionToken = Buffer.from(`speaker:${speaker.id}:${Date.now()}`).toString('base64')

    return NextResponse.json({
      success: true,
      speaker: {
        id: speaker.id,
        email: speaker.email,
        name: speaker.name
      },
      sessionToken
    })

  } catch (error) {
    console.error('Speaker login error:', error)
    return NextResponse.json(
      { error: 'Failed to authenticate speaker' },
      { status: 500 }
    )
  }
}