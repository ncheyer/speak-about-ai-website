import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(request: NextRequest) {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not configured')
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 503 }
      )
    }

    // Initialize Neon client
    const sql = neon(process.env.DATABASE_URL)
    // Get all active and listed speakers with full data for website display
    const speakers = await sql`
      SELECT 
        id, name, email, phone, company, title, slug,
        bio, short_bio, one_liner, headshot_url, website,
        linkedin_url, twitter_url, instagram_url, youtube_url,
        topics, speaking_fee_range, travel_preferences,
        technical_requirements, dietary_restrictions,
        active, email_verified, featured, location, programs,
        listed, industries, ranking, image_position, image_offset,
        videos, testimonials, created_at, updated_at
      FROM speakers
      WHERE active = true
      ORDER BY ranking DESC NULLS LAST, name ASC
    `

    return NextResponse.json({
      success: true,
      speakers: speakers.map(speaker => ({
        id: speaker.id,
        slug: speaker.slug,
        name: speaker.name,
        email: speaker.email,
        phone: speaker.phone,
        company: speaker.company,
        title: speaker.title || speaker.one_liner,
        bio: speaker.bio,
        shortBio: speaker.short_bio,
        oneLiner: speaker.one_liner,
        image: speaker.headshot_url,
        imagePosition: speaker.image_position || 'center',
        imageOffsetY: speaker.image_offset || '0%',
        website: speaker.website,
        linkedin: speaker.linkedin_url,
        linkedinUrl: speaker.linkedin_url,
        twitter: speaker.twitter_url,
        twitterUrl: speaker.twitter_url,
        instagram: speaker.instagram_url,
        instagramUrl: speaker.instagram_url,
        youtube: speaker.youtube_url,
        youtubeUrl: speaker.youtube_url,
        topics: speaker.topics || [],
        programs: speaker.programs || [],
        industries: speaker.industries || [],
        expertise: speaker.topics || [], // Using topics as expertise for compatibility
        fee: speaker.speaking_fee_range || 'Please Inquire',
        feeRange: speaker.speaking_fee_range,
        speakingFeeRange: speaker.speaking_fee_range,
        location: speaker.location,
        travelPreferences: speaker.travel_preferences,
        technicalRequirements: speaker.technical_requirements,
        dietaryRestrictions: speaker.dietary_restrictions,
        featured: speaker.featured || false,
        listed: speaker.listed !== false,
        ranking: speaker.ranking || 0,
        videos: speaker.videos || [],
        testimonials: speaker.testimonials || [],
        active: speaker.active,
        emailVerified: speaker.email_verified,
        createdAt: speaker.created_at,
        updatedAt: speaker.updated_at
      }))
    })

  } catch (error) {
    console.error('Get speakers error:', error)
    
    // Return empty array as fallback to prevent site from breaking
    return NextResponse.json({
      success: false,
      speakers: [],
      error: 'Database temporarily unavailable'
    })
  }
}