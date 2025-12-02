import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { requireAdminAuth } from "@/lib/auth-middleware"

const sql = neon(process.env.DATABASE_URL!)

// Public endpoint for submitting applications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify Cloudflare Turnstile CAPTCHA token
    const turnstileToken = body.turnstileToken || body['cf-turnstile-response']
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "CAPTCHA verification is required" },
        { status: 400 }
      )
    }

    // Verify the turnstile token with Cloudflare
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
    if (turnstileSecret) {
      const turnstileResponse = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: turnstileToken,
            remoteip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          }),
        }
      )

      const turnstileData = await turnstileResponse.json()
      if (!turnstileData.success) {
        return NextResponse.json(
          { error: "CAPTCHA verification failed. Please try again." },
          { status: 400 }
        )
      }
    }

    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'email', 'bio', 'location', 'title', 'company', 'speaking_topics']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field.replace('_', ' ')} is required` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existing = await sql`
      SELECT id FROM speaker_applications 
      WHERE email = ${body.email.toLowerCase()}
    `

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An application with this email already exists" },
        { status: 400 }
      )
    }

    // Insert application with all fields
    const [application] = await sql`
      INSERT INTO speaker_applications (
        first_name,
        last_name,
        email,
        phone,
        website,
        linkedin_url,
        location,
        timezone,
        headshot_url,
        title,
        company,
        bio,
        short_bio,
        achievements,
        education,
        certifications,
        expertise_areas,
        speaking_topics,
        signature_talks,
        industries_experience,
        case_studies,
        years_speaking,
        total_engagements,
        previous_engagements,
        client_testimonials,
        video_links,
        media_coverage,
        twitter_url,
        youtube_url,
        instagram_url,
        blog_url,
        published_content,
        podcast_appearances,
        reference_contacts,
        past_client_references,
        speaker_bureau_experience,
        speaking_fee_range,
        travel_requirements,
        available_formats,
        booking_lead_time,
        availability_constraints,
        technical_requirements,
        speaking_experience,
        notable_organizations,
        ai_expertise,
        unique_perspective,
        audience_size_preference,
        why_speak_about_ai,
        additional_info,
        agree_to_terms,
        status
      ) VALUES (
        ${body.first_name},
        ${body.last_name},
        ${body.email.toLowerCase()},
        ${body.phone || null},
        ${body.website || null},
        ${body.linkedin_url || null},
        ${body.location},
        ${body.timezone || null},
        ${body.headshot_url || null},
        ${body.title},
        ${body.company},
        ${body.bio},
        ${body.short_bio || null},
        ${body.achievements || null},
        ${body.education || null},
        ${body.certifications || null},
        ${body.expertise_areas || []},
        ${body.speaking_topics},
        ${body.signature_talks || null},
        ${body.industries_experience || []},
        ${body.case_studies || null},
        ${body.years_speaking || null},
        ${body.total_engagements || null},
        ${body.previous_engagements || null},
        ${body.client_testimonials || null},
        ${body.video_links || []},
        ${body.media_coverage || null},
        ${body.twitter_url || null},
        ${body.youtube_url || null},
        ${body.instagram_url || null},
        ${body.blog_url || null},
        ${body.published_content || null},
        ${body.podcast_appearances || null},
        ${body.reference_contacts || null},
        ${body.past_client_references || null},
        ${body.speaker_bureau_experience || null},
        ${body.speaking_fee_range || null},
        ${body.travel_requirements || null},
        ${body.available_formats || []},
        ${body.booking_lead_time || null},
        ${body.availability_constraints || null},
        ${body.technical_requirements || null},
        ${body.speaking_experience || null},
        ${body.notable_organizations || null},
        ${body.ai_expertise || null},
        ${body.unique_perspective || null},
        ${body.audience_size_preference || null},
        ${body.why_speak_about_ai || null},
        ${body.additional_info || null},
        ${body.agree_to_terms || false},
        'pending'
      )
      RETURNING id, email, first_name, last_name
    `

    // TODO: Send notification email to admin about new application

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId: application.id
    })

  } catch (error) {
    console.error("Error submitting speaker application:", error)
    return NextResponse.json(
      { 
        error: "Failed to submit application",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// Admin endpoint to get all applications (requires auth)
export async function GET(request: NextRequest) {
  try {
    // Check for admin authentication
    const authError = requireAdminAuth(request)
    if (authError) {
      return authError
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build query with proper parameterization to prevent SQL injection
    let applications

    if (status && status !== 'all' && search) {
      // Both status and search filters
      const searchPattern = `%${search}%`
      applications = await sql`
        SELECT * FROM speaker_applications
        WHERE status = ${status}
        AND (
          LOWER(first_name) LIKE LOWER(${searchPattern}) OR
          LOWER(last_name) LIKE LOWER(${searchPattern}) OR
          LOWER(email) LIKE LOWER(${searchPattern}) OR
          LOWER(company) LIKE LOWER(${searchPattern})
        )
        ORDER BY created_at DESC
      `
    } else if (status && status !== 'all') {
      // Only status filter
      applications = await sql`
        SELECT * FROM speaker_applications
        WHERE status = ${status}
        ORDER BY created_at DESC
      `
    } else if (search) {
      // Only search filter
      const searchPattern = `%${search}%`
      applications = await sql`
        SELECT * FROM speaker_applications
        WHERE
          LOWER(first_name) LIKE LOWER(${searchPattern}) OR
          LOWER(last_name) LIKE LOWER(${searchPattern}) OR
          LOWER(email) LIKE LOWER(${searchPattern}) OR
          LOWER(company) LIKE LOWER(${searchPattern})
        ORDER BY created_at DESC
      `
    } else {
      // No filters
      applications = await sql`
        SELECT * FROM speaker_applications
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json({
      applications,
      total: applications.length
    })

  } catch (error) {
    console.error("Error fetching speaker applications:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch applications",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}