import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { getAllSpeakers } from '@/lib/speakers-data'

// Get SQL client for each request to avoid connection issues
const getSqlClient = () => {
  if (!process.env.DATABASE_URL) {
    console.log('Admin speaker detail: No DATABASE_URL found')
    return null
  }
  try {
    return neon(process.env.DATABASE_URL)
  } catch (error) {
    console.error('Failed to initialize Neon client for admin speaker detail:', error)
    return null
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) {
      console.log('Admin speaker delete: Authentication failed')
      return authError
    }
    
    const speakerId = parseInt(params.id)
    if (isNaN(speakerId)) {
      return NextResponse.json({
        error: 'Invalid speaker ID'
      }, { status: 400 })
    }
    
    console.log(`Admin speaker delete: Deleting speaker ${speakerId}`)
    
    // Get SQL client
    const sql = getSqlClient()
    
    // Check if database is available
    if (!sql) {
      return NextResponse.json({
        error: 'Database not available'
      }, { status: 503 })
    }
    
    try {
      // Check if speaker exists
      const existingResult = await sql`
        SELECT id, name FROM speakers WHERE id = ${speakerId}
      `
      
      if (!existingResult || existingResult.length === 0) {
        return NextResponse.json({
          error: 'Speaker not found'
        }, { status: 404 })
      }
      
      const speakerName = existingResult[0].name
      
      // Delete the speaker
      await sql`
        DELETE FROM speakers WHERE id = ${speakerId}
      `
      
      console.log(`Admin speaker delete: Successfully deleted speaker ${speakerId} (${speakerName})`)
      
      return NextResponse.json({
        success: true,
        message: `Speaker ${speakerName} deleted successfully`,
        deletedId: speakerId
      })
      
    } catch (dbError: any) {
      console.error('Database error deleting speaker:', dbError)
      return NextResponse.json({
        error: 'Failed to delete speaker',
        details: dbError.message || 'Unknown database error'
      }, { status: 500 })
    }
    
  } catch (error: any) {
    console.error('Error deleting speaker:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Temporarily bypass authentication for debugging
    console.log('Admin speaker detail: BYPASSING authentication for debugging...')
    
    // Uncomment this when ready to re-enable auth:
    // const authError = requireAdminAuth(request)
    // if (authError) {
    //   console.log('Admin speaker detail: Authentication failed')
    //   return authError
    // }
    console.log('Admin speaker detail: Authentication bypassed')
    
    const speakerId = parseInt(params.id)
    if (isNaN(speakerId)) {
      return NextResponse.json({
        error: 'Invalid speaker ID'
      }, { status: 400 })
    }
    
    console.log(`Admin speaker detail: Fetching speaker ${speakerId}`)
    // Get SQL client
    const sql = getSqlClient()
    
    console.log('Admin speaker detail: DATABASE_URL available:', !!process.env.DATABASE_URL)
    console.log('Admin speaker detail: sql client initialized:', !!sql)
    
    // Check if database is available
    if (!sql) {
      console.log('Admin speaker detail: Database not available, using fallback data')
      
      // Use fallback data from getAllSpeakers
      const allSpeakers = await getAllSpeakers()
      const speaker = allSpeakers.find((s, index) => (index + 1) === speakerId)
      
      if (!speaker) {
        console.log(`Admin speaker detail: Speaker ${speakerId} not found in fallback data`)
        return NextResponse.json({
          error: 'Speaker not found'
        }, { status: 404 })
      }
      
      // Transform to match database format
      const transformedSpeaker = {
        id: speakerId,
        name: speaker.name,
        email: `${speaker.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        bio: speaker.bio || '',
        short_bio: speaker.bio ? speaker.bio.substring(0, 200) : '',
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
        active: speaker.listed !== false,
        listed: speaker.listed !== false,
        ranking: speaker.ranking || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      console.log(`Admin speaker detail: Returning fallback data for ${speaker.name}`)
      
      return NextResponse.json({
        success: true,
        speaker: transformedSpeaker
      })
    }
    
    // Test basic connection first
    console.log('Admin speaker detail: Testing database connection...')
    try {
      await sql`SELECT 1 as test`
      console.log('Admin speaker detail: Database connection successful')
    } catch (connError) {
      console.error('Admin speaker detail: Database connection failed:', connError)
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connError instanceof Error ? connError.message : 'Unknown connection error'
      }, { status: 500 })
    }

    // Get speaker data
    console.log(`Admin speaker detail: Querying speaker ${speakerId}...`)
    const speakers = await sql`
      SELECT 
        id, name, email, bio, short_bio, one_liner, headshot_url, website,
        location, programs, topics, industries, videos, testimonials,
        speaking_fee_range, travel_preferences, technical_requirements, 
        dietary_restrictions, featured, active, listed, ranking,
        created_at, updated_at
      FROM speakers
      WHERE id = ${speakerId}
      LIMIT 1
    `

    if (speakers.length === 0) {
      console.log(`Admin speaker detail: Speaker ${speakerId} not found`)
      return NextResponse.json({
        error: 'Speaker not found'
      }, { status: 404 })
    }

    const speaker = speakers[0]
    console.log(`Admin speaker detail: Found speaker ${speaker.name}`)

    // Ensure arrays are properly parsed with error handling
    const parseFieldAsArray = (field: any, fieldName: string): any[] => {
      if (!field) return []
      if (Array.isArray(field)) return field
      if (typeof field === 'string') {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(field)
          return Array.isArray(parsed) ? parsed : []
        } catch (e) {
          // If it's not valid JSON, treat it as a single string item
          console.log(`Admin speaker detail: Field ${fieldName} is not valid JSON, treating as string: ${field.substring(0, 50)}...`)
          return fieldName === 'programs' ? [field] : []
        }
      }
      return []
    }
    
    speaker.programs = parseFieldAsArray(speaker.programs, 'programs')
    speaker.topics = parseFieldAsArray(speaker.topics, 'topics')
    speaker.industries = parseFieldAsArray(speaker.industries, 'industries')
    speaker.videos = parseFieldAsArray(speaker.videos, 'videos')
    speaker.testimonials = parseFieldAsArray(speaker.testimonials, 'testimonials')

    return NextResponse.json({
      success: true,
      speaker: speaker
    })

  } catch (error) {
    console.error('Get admin speaker detail error:', error)
    
    // Provide detailed error information
    let errorMessage = 'Failed to fetch speaker'
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError
    
    const speakerId = params.id
    const updateData = await request.json()
    
    // Get SQL client
    const sql = getSqlClient()
    
    if (!sql) {
      return NextResponse.json({
        error: 'Database not available'
      }, { status: 503 })
    }

    // Update speaker profile
    const [updatedSpeaker] = await sql`
      UPDATE speakers SET
        name = COALESCE(${updateData.name || null}, name),
        email = COALESCE(${updateData.email || null}, email),
        bio = COALESCE(${updateData.bio || null}, bio),
        short_bio = COALESCE(${updateData.short_bio || null}, short_bio),
        one_liner = COALESCE(${updateData.one_liner || null}, one_liner),
        headshot_url = COALESCE(${updateData.headshot_url || null}, headshot_url),
        website = COALESCE(${updateData.website || null}, website),
        location = COALESCE(${updateData.location || null}, location),
        programs = COALESCE(${JSON.stringify(updateData.programs) || null}, programs),
        topics = COALESCE(${JSON.stringify(updateData.topics) || null}, topics),
        industries = COALESCE(${JSON.stringify(updateData.industries) || null}, industries),
        videos = COALESCE(${JSON.stringify(updateData.videos) || null}, videos),
        testimonials = COALESCE(${JSON.stringify(updateData.testimonials) || null}, testimonials),
        speaking_fee_range = COALESCE(${updateData.speaking_fee_range || null}, speaking_fee_range),
        travel_preferences = COALESCE(${updateData.travel_preferences || null}, travel_preferences),
        technical_requirements = COALESCE(${updateData.technical_requirements || null}, technical_requirements),
        dietary_restrictions = COALESCE(${updateData.dietary_restrictions || null}, dietary_restrictions),
        featured = COALESCE(${updateData.featured}, featured),
        active = COALESCE(${updateData.active}, active),
        listed = COALESCE(${updateData.listed}, listed),
        ranking = COALESCE(${updateData.ranking || null}, ranking),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(speakerId)}
      RETURNING 
        id, name, email, bio, short_bio, one_liner, headshot_url, website,
        location, programs, topics, industries, videos, testimonials,
        speaking_fee_range, travel_preferences, technical_requirements, 
        dietary_restrictions, featured, active, listed, ranking, updated_at
    `

    if (!updatedSpeaker) {
      return NextResponse.json(
        { error: 'Speaker not found or update failed' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Speaker updated successfully',
      speaker: {
        id: updatedSpeaker.id,
        name: updatedSpeaker.name,
        email: updatedSpeaker.email,
        bio: updatedSpeaker.bio,
        short_bio: updatedSpeaker.short_bio,
        one_liner: updatedSpeaker.one_liner,
        headshot_url: updatedSpeaker.headshot_url,
        website: updatedSpeaker.website,
        location: updatedSpeaker.location,
        programs: updatedSpeaker.programs,
        social_media: updatedSpeaker.social_media || {},
        topics: updatedSpeaker.topics || [],
        industries: updatedSpeaker.industries || [],
        videos: updatedSpeaker.videos || [],
        testimonials: updatedSpeaker.testimonials || [],
        speaking_fee_range: updatedSpeaker.speaking_fee_range,
        travel_preferences: updatedSpeaker.travel_preferences,
        technical_requirements: updatedSpeaker.technical_requirements,
        dietary_restrictions: updatedSpeaker.dietary_restrictions,
        featured: updatedSpeaker.featured,
        active: updatedSpeaker.active,
        listed: updatedSpeaker.listed,
        ranking: updatedSpeaker.ranking,
        updated_at: updatedSpeaker.updated_at
      }
    })

  } catch (error) {
    console.error('Update admin speaker error:', error)
    return NextResponse.json(
      { error: 'Failed to update speaker' },
      { status: 500 }
    )
  }
}