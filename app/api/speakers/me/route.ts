import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Get session token from Authorization header
    const authHeader = request.headers.get('authorization')
    const sessionToken = authHeader?.replace('Bearer ', '')

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No session token provided' },
        { status: 401 }
      )
    }

    // Decode session token to get speaker ID
    try {
      const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8')
      const [type, speakerId, timestamp] = decoded.split(':')
      
      if (type !== 'speaker' || !speakerId) {
        throw new Error('Invalid token format')
      }

      // Get speaker data
      const speakers = await sql`
        SELECT 
          id, email, name, bio, short_bio, one_liner, headshot_url, website,
          location, programs, social_media, topics, industries, videos, testimonials,
          speaking_fee_range, travel_preferences, technical_requirements, 
          dietary_restrictions, emergency_contact, active, email_verified, 
          created_at, updated_at
        FROM speakers
        WHERE id = ${parseInt(speakerId)} AND active = true
        LIMIT 1
      `

      if (speakers.length === 0) {
        return NextResponse.json(
          { error: 'Speaker not found' },
          { status: 404 }
        )
      }

      const speaker = speakers[0]

      return NextResponse.json({
        success: true,
        speaker: {
          id: speaker.id,
          email: speaker.email,
          name: speaker.name,
          bio: speaker.bio,
          short_bio: speaker.short_bio,
          one_liner: speaker.one_liner,
          headshot_url: speaker.headshot_url,
          website: speaker.website,
          location: speaker.location,
          programs: speaker.programs,
          social_media: speaker.social_media || {},
          topics: speaker.topics || [],
          industries: speaker.industries || [],
          videos: speaker.videos || [],
          testimonials: speaker.testimonials || [],
          speaking_fee_range: speaker.speaking_fee_range,
          travel_preferences: speaker.travel_preferences,
          technical_requirements: speaker.technical_requirements,
          dietary_restrictions: speaker.dietary_restrictions,
          emergency_contact: speaker.emergency_contact || {},
          active: speaker.active,
          email_verified: speaker.email_verified,
          created_at: speaker.created_at,
          updated_at: speaker.updated_at
        }
      })

    } catch (decodeError) {
      return NextResponse.json(
        { error: 'Invalid session token' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Get speaker profile error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch speaker profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get session token from Authorization header
    const authHeader = request.headers.get('authorization')
    const sessionToken = authHeader?.replace('Bearer ', '')

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No session token provided' },
        { status: 401 }
      )
    }

    // Decode session token to get speaker ID
    try {
      const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8')
      const [type, speakerId, timestamp] = decoded.split(':')
      
      if (type !== 'speaker' || !speakerId) {
        throw new Error('Invalid token format')
      }

      const updateData = await request.json()

      // Update speaker profile
      const [updatedSpeaker] = await sql`
        UPDATE speakers SET
          name = COALESCE(${updateData.name || null}, name),
          bio = COALESCE(${updateData.bio || null}, bio),
          short_bio = COALESCE(${updateData.short_bio || null}, short_bio),
          one_liner = COALESCE(${updateData.one_liner || null}, one_liner),
          headshot_url = COALESCE(${updateData.headshot_url || null}, headshot_url),
          website = COALESCE(${updateData.website || null}, website),
          location = COALESCE(${updateData.location || null}, location),
          programs = COALESCE(${updateData.programs || null}, programs),
          social_media = COALESCE(${JSON.stringify(updateData.social_media) || null}, social_media),
          topics = COALESCE(${JSON.stringify(updateData.topics) || null}, topics),
          industries = COALESCE(${JSON.stringify(updateData.industries) || null}, industries),
          videos = COALESCE(${JSON.stringify(updateData.videos) || null}, videos),
          testimonials = COALESCE(${JSON.stringify(updateData.testimonials) || null}, testimonials),
          speaking_fee_range = COALESCE(${updateData.speaking_fee_range || null}, speaking_fee_range),
          travel_preferences = COALESCE(${updateData.travel_preferences || null}, travel_preferences),
          technical_requirements = COALESCE(${updateData.technical_requirements || null}, technical_requirements),
          dietary_restrictions = COALESCE(${updateData.dietary_restrictions || null}, dietary_restrictions),
          emergency_contact = COALESCE(${JSON.stringify(updateData.emergency_contact) || null}, emergency_contact),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${parseInt(speakerId)} AND active = true
        RETURNING 
          id, email, name, bio, short_bio, one_liner, headshot_url, website,
          location, programs, social_media, topics, industries, videos, testimonials,
          speaking_fee_range, travel_preferences, technical_requirements, 
          dietary_restrictions, emergency_contact, active, email_verified, updated_at
      `

      if (!updatedSpeaker) {
        return NextResponse.json(
          { error: 'Speaker not found or update failed' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        speaker: {
          id: updatedSpeaker.id,
          email: updatedSpeaker.email,
          name: updatedSpeaker.name,
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
          emergency_contact: updatedSpeaker.emergency_contact || {},
          active: updatedSpeaker.active,
          email_verified: updatedSpeaker.email_verified,
          updated_at: updatedSpeaker.updated_at
        }
      })

    } catch (decodeError) {
      return NextResponse.json(
        { error: 'Invalid session token' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Update speaker profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update speaker profile' },
      { status: 500 }
    )
  }
}