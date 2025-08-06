import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { requireAdminAuth } from "@/lib/auth-middleware"
import crypto from 'crypto'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const body = await request.json()
    const { first_name, last_name, email, personal_message, type } = body

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Check if speaker already exists
    const existingSpeaker = await sql`
      SELECT id FROM speakers 
      WHERE LOWER(email) = ${email.toLowerCase()}
    `

    if (existingSpeaker.length > 0) {
      return NextResponse.json(
        { error: "A speaker with this email already exists" },
        { status: 400 }
      )
    }

    // Check if there's already a pending application or invitation
    const existingApplication = await sql`
      SELECT id, status FROM speaker_applications 
      WHERE LOWER(email) = ${email.toLowerCase()}
    `

    if (existingApplication.length > 0) {
      const status = existingApplication[0].status
      if (status === 'invited') {
        return NextResponse.json(
          { error: "An invitation has already been sent to this email" },
          { status: 400 }
        )
      } else if (status === 'pending' || status === 'under_review') {
        return NextResponse.json(
          { error: "There is already a pending application from this email" },
          { status: 400 }
        )
      }
    }

    // Generate unique invitation token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Token expires in 7 days

    // Create a new speaker application with invited status
    const [application] = await sql`
      INSERT INTO speaker_applications (
        first_name,
        last_name,
        email,
        status,
        bio,
        speaking_topics,
        location,
        title,
        company,
        invitation_token,
        invitation_sent_at,
        invitation_expires_at,
        admin_notes,
        reviewed_by,
        reviewed_at
      ) VALUES (
        ${first_name},
        ${last_name},
        ${email.toLowerCase()},
        'invited',
        ${type === 'direct_invite' ? 'Direct invitation from admin' : 'Invited to join platform'},
        'To be provided',
        'To be provided',
        'To be provided',
        'To be provided',
        ${token},
        CURRENT_TIMESTAMP,
        ${expiresAt.toISOString()},
        ${personal_message || `Direct invitation sent by admin`},
        'admin',
        CURRENT_TIMESTAMP
      )
      RETURNING id, email, first_name, last_name, invitation_token
    `

    // Send invitation email
    await sendInvitationEmail({
      ...application,
      personal_message
    })

    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
      applicationId: application.id,
      token: token // For testing, remove in production
    })

  } catch (error) {
    console.error("Error sending speaker invitation:", error)
    return NextResponse.json(
      { 
        error: "Failed to send invitation",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

async function sendInvitationEmail(data: any) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/create-account?token=${data.invitation_token}`
  
  // TODO: Implement actual email sending using Resend or similar service
  console.log(`Sending invitation email to ${data.email}`)
  console.log(`Invitation URL: ${inviteUrl}`)
  
  // For now, just log the email content
  const emailContent = `
    Dear ${data.first_name} ${data.last_name},

    You've been invited to join Speak About AI as a speaker!

    We're excited to welcome you to our exclusive network of AI and technology thought leaders.

    ${data.personal_message ? `Personal message:\n${data.personal_message}\n` : ''}

    Please click the link below to create your speaker account:
    ${inviteUrl}

    This invitation link will expire in 7 days.

    If you have any questions, please don't hesitate to reach out.

    Best regards,
    The Speak About AI Team
  `
  
  console.log(emailContent)
  
  // In production, use Resend API:
  // const { data, error } = await resend.emails.send({
  //   from: 'Speak About AI <hello@speakabout.ai>',
  //   to: data.email,
  //   subject: 'You're Invited to Join Speak About AI',
  //   html: emailContent
  // })
}