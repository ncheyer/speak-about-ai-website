import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { getAllSpeakers } from '@/lib/speakers-data'

// Get SQL client for each request to avoid connection issues
const getSqlClient = () => {
  if (!process.env.DATABASE_URL) {
    console.log('Admin speakers: No DATABASE_URL found')
    return null
  }
  try {
    return neon(process.env.DATABASE_URL)
  } catch (error) {
    console.error('Failed to initialize Neon client for admin speakers:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  let sql: ReturnType<typeof getSqlClient> = null
  
  try {
    // Temporarily bypass authentication for debugging
    console.log('Admin speakers: BYPASSING authentication for debugging...')
    
    // Uncomment this when ready to re-enable auth:
    // const authError = requireAdminAuth(request)
    // if (authError) {
    //   console.log('Admin speakers: Authentication failed')
    //   return authError
    // }
    console.log('Admin speakers: Authentication bypassed')
    
    // Get SQL client
    sql = getSqlClient()
    
    console.log('Admin speakers: DATABASE_URL available:', !!process.env.DATABASE_URL)
    console.log('Admin speakers: sql client initialized:', !!sql)
    
    // Check if database is available
    if (!sql) {
      console.log('Admin speakers: Database not available, using fallback data')
      
      // Use the static speaker data as fallback
      const fallbackSpeakers = await getAllSpeakers()
      
      // Transform the data to match the expected format from database
      const speakers = fallbackSpeakers.map((speaker, index) => ({
        id: index + 1,
        name: speaker.name,
        email: `${speaker.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        bio: speaker.bio || '',
        short_bio: speaker.bio ? speaker.bio.substring(0, 200) : '',
        one_liner: speaker.title || '',
        headshot_url: speaker.image || '',
        website: speaker.website || '',
        location: speaker.location || '',
        topics: speaker.topics || [],
        industries: speaker.industries || [],
        videos: speaker.videos || [],
        testimonials: speaker.testimonials || [],
        speaking_fee_range: speaker.feeRange || speaker.fee || '',
        featured: speaker.featured || false,
        active: speaker.listed !== false,
        listed: speaker.listed !== false,
        ranking: speaker.ranking || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
      
      console.log(`Admin speakers: Returning ${speakers.length} speakers from fallback data`)
      
      return NextResponse.json({
        success: true,
        speakers: speakers,
        source: 'fallback'
      })
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
    
    // Get all speakers with only existing columns
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
    
    // Provide detailed error information
    let errorMessage = 'Failed to fetch speakers'
    let errorDetails = 'Unknown error'
    
    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack || error.message
      
      // Check for specific error types
      if (error.message.includes('relation "speakers" does not exist')) {
        errorMessage = 'Speakers table not found in database'
        errorDetails = 'The speakers table may not exist. Please check your database schema.'
      } else if (error.message.includes('permission denied')) {
        errorMessage = 'Database permission denied'
        errorDetails = 'The database connection may not have proper permissions.'
      } else if (error.message.includes('connect')) {
        errorMessage = 'Database connection failed'
        errorDetails = 'Unable to connect to the database. Check DATABASE_URL and network.'
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        hasDatabase: !!process.env.DATABASE_URL,
        hasSqlClient: !!sql
      },
      { status: 500 }
    )
  }
}