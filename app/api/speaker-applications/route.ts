import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Public endpoint for submitting applications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

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

    // Insert application
    const [application] = await sql`
      INSERT INTO speaker_applications (
        first_name,
        last_name,
        email,
        phone,
        website,
        linkedin_url,
        location,
        title,
        company,
        bio,
        expertise_areas,
        speaking_topics,
        years_speaking,
        previous_engagements,
        video_links,
        reference_contacts,
        speaking_fee_range,
        travel_requirements,
        available_formats,
        status
      ) VALUES (
        ${body.first_name},
        ${body.last_name},
        ${body.email.toLowerCase()},
        ${body.phone || null},
        ${body.website || null},
        ${body.linkedin_url || null},
        ${body.location},
        ${body.title},
        ${body.company},
        ${body.bio},
        ${body.expertise_areas || []},
        ${body.speaking_topics},
        ${body.years_speaking || null},
        ${body.previous_engagements || null},
        ${body.video_links || []},
        ${body.reference_contacts || null},
        ${body.speaking_fee_range || null},
        ${body.travel_requirements || null},
        ${body.available_formats || []},
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
    // Check for admin auth
    const authHeader = request.headers.get('x-dev-admin-bypass')
    if (authHeader !== 'dev-admin-access') {
      // In production, use proper auth check:
      // const authError = requireAdminAuth(request)
      // if (authError) return authError
      
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let query = sql`
      SELECT 
        id,
        first_name,
        last_name,
        email,
        phone,
        website,
        linkedin_url,
        location,
        title,
        company,
        bio,
        expertise_areas,
        speaking_topics,
        years_speaking,
        previous_engagements,
        video_links,
        reference_contacts,
        speaking_fee_range,
        travel_requirements,
        available_formats,
        status,
        admin_notes,
        rejection_reason,
        invitation_sent_at,
        account_created_at,
        created_at,
        updated_at,
        reviewed_at,
        reviewed_by
      FROM speaker_applications
    `

    let conditions = []
    
    if (status && status !== 'all') {
      conditions.push(`status = '${status}'`)
    }

    if (search) {
      conditions.push(`
        (LOWER(first_name) LIKE '%${search.toLowerCase()}%' OR
         LOWER(last_name) LIKE '%${search.toLowerCase()}%' OR
         LOWER(email) LIKE '%${search.toLowerCase()}%' OR
         LOWER(company) LIKE '%${search.toLowerCase()}%')
      `)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    
    const applications = await sql`
      SELECT * FROM speaker_applications
      ${sql.unsafe(whereClause)}
      ORDER BY created_at DESC
    `

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