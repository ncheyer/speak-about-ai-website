import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Check if admin is authenticated (you can implement proper auth middleware)
    const authHeader = request.headers.get('authorization')
    const adminLoggedIn = request.cookies.get('adminLoggedIn')
    
    // For now, we'll check if admin is logged in via cookie or session
    // In production, implement proper JWT validation
    
    // Get all speakers with full details
    const speakers = await sql`
      SELECT 
        id, name, email, bio, short_bio, one_liner, headshot_url, website,
        location, programs, topics, industries, videos, testimonials,
        speaking_fee_range, travel_preferences, technical_requirements, 
        dietary_restrictions, featured, active, listed, ranking,
        created_at, updated_at
      FROM speakers
      ORDER BY 
        CASE WHEN featured = true THEN 0 ELSE 1 END,
        ranking DESC,
        name ASC
    `

    return NextResponse.json({
      success: true,
      speakers: speakers
    })

  } catch (error) {
    console.error('Get admin speakers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch speakers' },
      { status: 500 }
    )
  }
}