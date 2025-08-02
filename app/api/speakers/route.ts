import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Get all active speakers for dropdown/selection purposes
    const speakers = await sql`
      SELECT 
        id, 
        name, 
        email,
        one_liner,
        speaking_fee_range,
        topics,
        active,
        email_verified
      FROM speakers
      WHERE active = true AND email_verified = true
      ORDER BY name ASC
    `

    return NextResponse.json({
      success: true,
      speakers: speakers.map(speaker => ({
        id: speaker.id,
        name: speaker.name,
        email: speaker.email,
        oneLiner: speaker.one_liner,
        speakingFeeRange: speaker.speaking_fee_range,
        topics: speaker.topics || [],
        active: speaker.active,
        emailVerified: speaker.email_verified
      }))
    })

  } catch (error) {
    console.error('Get speakers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch speakers' },
      { status: 500 }
    )
  }
}