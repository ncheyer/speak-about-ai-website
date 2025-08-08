import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import jwt from 'jsonwebtoken'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify and decode token
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const speakerId = decoded.speakerId
    
    // Fetch speaker data from database - only query existing columns
    const speakers = await sql`
      SELECT 
        id, email, name, bio, short_bio, one_liner,
        headshot_url, website, 
        topics, industries, programs,
        speaking_fee_range, 
        travel_preferences, technical_requirements, dietary_restrictions,
        location,
        featured, active, listed, ranking,
        created_at, updated_at
      FROM speakers
      WHERE id = ${speakerId}
      LIMIT 1
    `

    if (speakers.length === 0) {
      return NextResponse.json({ error: 'Speaker not found' }, { status: 404 })
    }

    const speaker = speakers[0]
    
    // Parse name into first and last
    const nameParts = speaker.name ? speaker.name.split(' ') : ['', '']
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    
    // Transform data to match frontend expectations
    const profile = {
      id: speaker.id,
      first_name: firstName,
      last_name: lastName,
      email: speaker.email,
      phone: '', // Not in current database
      title: speaker.one_liner || '', // Use one_liner as title since title column doesn't exist
      company: '', // Not in current database
      location: speaker.location || '',
      timezone: 'PST', // Default, not in current database
      
      bio: speaker.bio || '',
      short_bio: speaker.short_bio || '',
      one_liner: speaker.one_liner || '',
      
      headshot_url: speaker.headshot_url || '',
      banner_url: '', // Not in current database
      
      // Parse topics if they're in JSON format
      expertise_areas: speaker.industries || [],
      speaking_topics: speaker.topics || [],
      programs: speaker.programs || [],
      
      signature_talks: [], // Not in current database
      achievements: [], // Not in current database
      
      education: [], // Not in current database
      certifications: [], // Not in current database
      
      languages: ['English'], // Default, not in current database
      
      speaking_fee_range: speaker.speaking_fee_range || '',
      available_formats: ['keynote', 'panel', 'fireside', 'virtual', 'executive'], // Default
      
      travel_preferences: speaker.travel_preferences || '',
      booking_requirements: '', // Not in current database
      technical_requirements: speaker.technical_requirements || '',
      dietary_restrictions: speaker.dietary_restrictions || '',
      
      website: speaker.website || '',
      linkedin_url: '', // Not in current database
      twitter_url: '', // Not in current database
      youtube_url: '', // Not in current database
      instagram_url: '', // Not in current database
      
      videos: [], // Not in current database
      publications: [], // Not in current database
      testimonials: [], // Not in current database
      
      featured: speaker.featured,
      active: speaker.active,
      listed: speaker.listed,
      ranking: speaker.ranking,
      
      created_at: speaker.created_at,
      updated_at: speaker.updated_at
    }

    return NextResponse.json({ 
      success: true,
      profile 
    })

  } catch (error) {
    console.error('Error fetching speaker profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify and decode token
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const speakerId = decoded.speakerId
    const data = await request.json()
    
    // Combine first and last name
    const fullName = `${data.first_name || ''} ${data.last_name || ''}`.trim()
    
    // Update speaker in database
    const result = await sql`
      UPDATE speakers
      SET 
        name = ${fullName},
        email = ${data.email},
        title = ${data.title || null},
        company = ${data.company || null},
        location = ${data.location || null},
        bio = ${data.bio || null},
        short_bio = ${data.short_bio || null},
        one_liner = ${data.one_liner || null},
        headshot_url = ${data.headshot_url || null},
        website = ${data.website || null},
        topics = ${JSON.stringify(data.speaking_topics || [])},
        industries = ${JSON.stringify(data.expertise_areas || [])},
        programs = ${JSON.stringify(data.programs || [])},
        speaking_fee_range = ${data.speaking_fee_range || null},
        travel_preferences = ${data.travel_preferences || null},
        technical_requirements = ${data.technical_requirements || null},
        dietary_restrictions = ${data.dietary_restrictions || null},
        linkedin_url = ${data.linkedin_url || null},
        twitter_url = ${data.twitter_url || null},
        instagram_url = ${data.instagram_url || null},
        youtube_url = ${data.youtube_url || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${speakerId}
      RETURNING id, email, name, updated_at
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Speaker not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      speaker: result[0]
    })

  } catch (error) {
    console.error('Error updating speaker profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}