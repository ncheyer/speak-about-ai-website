import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { getAllSpeakers } from '@/lib/speakers-data'

// Initialize Neon client
let sql: any = null
try {
  if (process.env.DATABASE_URL) {
    console.log('Admin speakers: Initializing Neon client...')
    sql = neon(process.env.DATABASE_URL)
    console.log('Admin speakers: Neon client initialized successfully')
  } else {
    console.log('Admin speakers: No DATABASE_URL found')
  }
} catch (error) {
  console.error('Failed to initialize Neon client for admin speakers:', error)
}

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError
    
    console.log('Admin speakers: DATABASE_URL available:', !!process.env.DATABASE_URL)
    console.log('Admin speakers: sql client initialized:', !!sql)
    
    // Check if database is available
    if (!sql) {
      console.warn('Admin speakers: DATABASE_URL not configured, loading speakers from Google Sheets')
      try {
        const googleSheetsSpeakers = await getAllSpeakers()
        // Convert Google Sheets speakers to admin format
        const adminSpeakers = googleSheetsSpeakers.map((speaker, index) => ({
          id: index + 1, // Generate a simple ID
          name: speaker.name,
          email: `${speaker.slug}@example.com`, // Placeholder email
          bio: speaker.bio || '',
          short_bio: speaker.bio?.substring(0, 200) || '',
          one_liner: speaker.title || '',
          headshot_url: speaker.image || '',
          website: speaker.website || '',
          location: speaker.location || '',
          programs: speaker.programs || [],
          topics: speaker.topics || [],
          industries: speaker.industries || [],
          videos: speaker.videos || [],
          testimonials: speaker.testimonials || [],
          speaking_fee_range: speaker.feeRange || speaker.fee || '',
          travel_preferences: '',
          technical_requirements: '',
          dietary_restrictions: '',
          featured: speaker.featured || false,
          active: true,
          listed: speaker.listed !== false,
          ranking: speaker.ranking || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
        
        return NextResponse.json({
          success: true,
          speakers: adminSpeakers,
          message: 'Speakers loaded from Google Sheets'
        })
      } catch (error) {
        console.error('Failed to load Google Sheets speakers:', error)
        return NextResponse.json({
          success: true,
          speakers: [],
          message: 'Failed to load speakers from Google Sheets'
        })
      }
    }
    
    // Test basic connection first
    console.log('Admin speakers: Testing database connection...')
    try {
      await sql`SELECT 1 as test`
      console.log('Admin speakers: Database connection successful')
    } catch (connError) {
      console.error('Admin speakers: Database connection failed:', connError)
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connError instanceof Error ? connError.message : 'Unknown connection error'
      }, { status: 500 })
    }
    
    // Get all speakers with full details
    console.log('Admin speakers: Querying speakers table...')
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
    
    console.log(`Admin speakers: Found ${speakers.length} speakers`)

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