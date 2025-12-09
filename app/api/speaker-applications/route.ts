import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { sendEmail } from "@/lib/email"

const sql = neon(process.env.DATABASE_URL!)

const ADMIN_EMAIL = 'noah@speakabout.ai'

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

    // Send notification email to admin about new application
    try {
      const adminHtml = `
        <!DOCTYPE html>
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>🎤 New Speaker Application Received</h2>
              <p>A new speaker has applied to join the Speak About AI roster.</p>

              <h3>Applicant Details:</h3>
              <ul>
                <li><strong>Name:</strong> ${body.first_name} ${body.last_name}</li>
                <li><strong>Email:</strong> ${body.email}</li>
                <li><strong>Title:</strong> ${body.title}</li>
                <li><strong>Company:</strong> ${body.company}</li>
                <li><strong>Location:</strong> ${body.location}</li>
                ${body.phone ? `<li><strong>Phone:</strong> ${body.phone}</li>` : ''}
                ${body.website ? `<li><strong>Website:</strong> <a href="${body.website}">${body.website}</a></li>` : ''}
                ${body.linkedin_url ? `<li><strong>LinkedIn:</strong> <a href="${body.linkedin_url}">${body.linkedin_url}</a></li>` : ''}
              </ul>

              <h3>Speaking Topics:</h3>
              <p>${body.speaking_topics}</p>

              <h3>Bio:</h3>
              <p>${body.bio}</p>

              ${body.years_speaking ? `<p><strong>Years Speaking:</strong> ${body.years_speaking}</p>` : ''}
              ${body.speaking_fee_range ? `<p><strong>Fee Range:</strong> ${body.speaking_fee_range}</p>` : ''}

              <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://speakabout.ai'}/admin/speakers"
                   style="color: #3b82f6; text-decoration: none; font-weight: bold;">
                  Review Application in Admin Panel →
                </a>
              </div>
            </div>
          </body>
        </html>
      `

      const adminText = `
New Speaker Application Received

Name: ${body.first_name} ${body.last_name}
Email: ${body.email}
Title: ${body.title}
Company: ${body.company}
Location: ${body.location}
${body.phone ? `Phone: ${body.phone}` : ''}
${body.website ? `Website: ${body.website}` : ''}
${body.linkedin_url ? `LinkedIn: ${body.linkedin_url}` : ''}

Speaking Topics: ${body.speaking_topics}

Bio: ${body.bio}

${body.years_speaking ? `Years Speaking: ${body.years_speaking}` : ''}
${body.speaking_fee_range ? `Fee Range: ${body.speaking_fee_range}` : ''}

Review Application: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://speakabout.ai'}/admin/speakers
      `.trim()

      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `🎤 New Speaker Application: ${body.first_name} ${body.last_name}`,
        html: adminHtml,
        text: adminText
      })
    } catch (emailError) {
      // Log but don't fail the application submission if email fails
      console.error('Failed to send admin notification email:', emailError)
    }

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