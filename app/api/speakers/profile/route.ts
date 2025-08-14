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
    
    if (!speakerId) {
      return NextResponse.json({ error: 'Invalid token - no speaker ID' }, { status: 401 })
    }
    
    // Fetch speaker data from database - only query existing columns
    const speakers = await sql`
      SELECT 
        id, email, name, bio, short_bio, one_liner,
        headshot_url, website, social_media,
        topics, industries, programs, videos, testimonials,
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
    const nameParts = speaker.name ? speaker.name.trim().split(' ') : ['', '']
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    
    // Transform data to match frontend expectations
    const profile = {
      id: speaker.id,
      first_name: firstName,
      last_name: lastName,
      email: speaker.email,
      phone: '', // Not in current database
      // Store title and company in one_liner field separated by ' at '
      // Parse them back out for display
      title: speaker.one_liner?.includes(' at ') ? speaker.one_liner.split(' at ')[0] : (speaker.one_liner || ''),
      company: speaker.one_liner?.includes(' at ') ? speaker.one_liner.split(' at ')[1] : '',
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
      linkedin_url: speaker.social_media?.linkedin_url || '',
      twitter_url: speaker.social_media?.twitter_url || '',
      youtube_url: speaker.social_media?.youtube_url || '',
      instagram_url: speaker.social_media?.instagram_url || '',
      
      videos: speaker.videos || [],
      publications: [], // Column doesn't exist yet
      testimonials: speaker.testimonials || [],
      
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
    const speakerEmail = decoded.email
    const data = await request.json()
    
    // Fetch current speaker data for comparison
    const currentData = await sql`
      SELECT * FROM speakers WHERE id = ${speakerId}
    `
    
    if (currentData.length === 0) {
      return NextResponse.json({ error: 'Speaker not found' }, { status: 404 })
    }
    
    const current = currentData[0]
    
    // Combine first and last name
    const fullName = `${data.first_name || ''} ${data.last_name || ''}`.trim()
    
    // Prepare social media data
    const socialMedia = {
      linkedin_url: data.linkedin_url || null,
      twitter_url: data.twitter_url || null,
      youtube_url: data.youtube_url || null,
      instagram_url: data.instagram_url || null
    }

    // Update speaker in database - only update columns that exist
    const result = await sql`
      UPDATE speakers
      SET 
        name = ${fullName},
        email = ${data.email},
        location = ${data.location || null},
        bio = ${data.bio || null},
        short_bio = ${data.short_bio || null},
        one_liner = ${data.title && data.company ? `${data.title} at ${data.company}` : (data.one_liner || data.title || null)},
        headshot_url = ${data.headshot_url || null},
        website = ${data.website || null},
        social_media = ${JSON.stringify(socialMedia)},
        topics = ${JSON.stringify(data.speaking_topics || [])},
        industries = ${JSON.stringify(data.expertise_areas || [])},
        programs = ${JSON.stringify(data.programs || [])},
        videos = ${JSON.stringify(data.videos || [])},
        testimonials = ${JSON.stringify(data.testimonials || [])},
        speaking_fee_range = ${data.speaking_fee_range || null},
        travel_preferences = ${data.travel_preferences || null},
        technical_requirements = ${data.technical_requirements || null},
        dietary_restrictions = ${data.dietary_restrictions || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${speakerId}
      RETURNING id, email, name, updated_at
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Speaker not found' }, { status: 404 })
    }
    
    // Log changes to speaker_updates table
    const changes = []
    const fieldsToTrack = [
      { field: 'name', old: current.name, new: fullName },
      { field: 'email', old: current.email, new: data.email },
      { field: 'location', old: current.location, new: data.location },
      { field: 'bio', old: current.bio, new: data.bio },
      { field: 'short_bio', old: current.short_bio, new: data.short_bio },
      { field: 'one_liner', old: current.one_liner, new: data.one_liner || data.title },
      { field: 'headshot_url', old: current.headshot_url, new: data.headshot_url },
      { field: 'website', old: current.website, new: data.website },
      { field: 'topics', old: current.topics, new: JSON.stringify(data.speaking_topics || []) },
      { field: 'industries', old: current.industries, new: JSON.stringify(data.expertise_areas || []) },
      { field: 'programs', old: current.programs, new: JSON.stringify(data.programs || []) },
      { field: 'speaking_fee_range', old: current.speaking_fee_range, new: data.speaking_fee_range },
      { field: 'travel_preferences', old: current.travel_preferences, new: data.travel_preferences },
      { field: 'technical_requirements', old: current.technical_requirements, new: data.technical_requirements },
      { field: 'dietary_restrictions', old: current.dietary_restrictions, new: data.dietary_restrictions }
    ]
    
    // Insert update logs for changed fields
    for (const item of fieldsToTrack) {
      // Skip if values are the same (considering null/undefined as equal to empty string)
      const oldVal = item.old || ''
      const newVal = item.new || ''
      
      if (oldVal !== newVal) {
        await sql`
          INSERT INTO speaker_updates (
            speaker_id,
            speaker_name,
            speaker_email,
            field_name,
            old_value,
            new_value,
            changed_by,
            change_type,
            metadata
          ) VALUES (
            ${speakerId},
            ${fullName},
            ${data.email},
            ${item.field},
            ${oldVal.toString()},
            ${newVal.toString()},
            ${speakerEmail || 'self'},
            'update',
            ${JSON.stringify({ source: 'speaker_profile_update' })}
          )
        `
        changes.push(item.field)
      }
    }

    return NextResponse.json({ 
      success: true,
      speaker: result[0],
      changes_logged: changes
    })

  } catch (error) {
    console.error('Error updating speaker profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}