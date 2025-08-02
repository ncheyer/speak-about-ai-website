import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // For MVP, we'll use a simple email-based authentication
    // In production, implement proper password hashing and verification
    const speakers = await sql`
      SELECT id, email, name, active
      FROM speakers
      WHERE email = ${email} AND active = true
      LIMIT 1
    `

    if (speakers.length === 0) {
      return NextResponse.json(
        { error: 'Speaker not found or inactive' },
        { status: 404 }
      )
    }

    const speaker = speakers[0]

    // Generate a simple session token (in production, use proper JWT or session management)
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