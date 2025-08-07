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
    const { speaker_id, first_name, last_name, email, personal_message, type } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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

    // For account creation invites, verify the speaker exists in the system
    if (type === 'account_creation') {
      if (!speaker_id) {
        return NextResponse.json(
          { error: "Speaker ID is required for account creation invitations" },
          { status: 400 }
        )
      }

      const existingSpeaker = await sql`
        SELECT id, name, email FROM speakers 
        WHERE id = ${speaker_id}
      `

      if (existingSpeaker.length === 0) {
        return NextResponse.json(
          { error: "Speaker not found in the system" },
          { status: 404 }
        )
      }

      // Verify the email matches the speaker's registered email
      if (existingSpeaker[0].email.toLowerCase() !== email.toLowerCase()) {
        return NextResponse.json(
          { error: "Email does not match the speaker's registered email address" },
          { status: 400 }
        )
      }
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
        ${first_name || 'Speaker'},
        ${last_name || ''},
        ${email.toLowerCase()},
        'invited',
        ${type === 'account_creation' ? 'Account creation invitation for existing speaker' : 'Direct invitation from admin'},
        ${type === 'account_creation' ? 'Profile already exists in system' : 'To be provided'},
        'To be provided',
        'To be provided',
        'To be provided',
        ${token},
        CURRENT_TIMESTAMP,
        ${expiresAt.toISOString()},
        ${personal_message || (type === 'account_creation' ? `Account creation invite for speaker ID: ${speaker_id}` : 'Direct invitation sent by admin')},
        'admin',
        CURRENT_TIMESTAMP
      )
      RETURNING id, email, first_name, last_name, invitation_token
    `

    // Send invitation email
    await sendInvitationEmail({
      ...application,
      personal_message,
      type
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
  console.log(`Type: ${data.type}`)
  
  const isAccountCreation = data.type === 'account_creation'
  
  // For now, just log the email content
  const emailContent = `
    Dear ${data.first_name} ${data.last_name},

    ${isAccountCreation 
      ? "Your speaker profile is already set up on Speak About AI! We're inviting you to create your account so you can manage your profile and access the speaker portal."
      : "You've been invited to join Speak About AI as a speaker!"
    }

    ${!isAccountCreation && "We're excited to welcome you to our exclusive network of AI and technology thought leaders."}

    ${data.personal_message ? `\nPersonal message:\n${data.personal_message}\n` : ''}

    Please click the link below to create your ${isAccountCreation ? 'account' : 'speaker account'}:
    ${inviteUrl}

    This invitation link will expire in 7 days.

    ${isAccountCreation 
      ? "Once you create your account, you'll be able to:\n- View and edit your speaker profile\n- Access the speaker portal\n- Manage your speaking engagements\n- Update your availability and preferences"
      : ""
    }

    If you have any questions, please don't hesitate to reach out.

    Best regards,
    The Speak About AI Team
  `
  
  console.log(emailContent)
  
  // In production, use Resend API:
  // const { data, error } = await resend.emails.send({
  //   from: 'Speak About AI <hello@speakabout.ai>',
  //   to: data.email,
  //   subject: isAccountCreation ? 'Create Your Speak About AI Account' : 'You're Invited to Join Speak About AI',
  //   html: emailContent
  // })
}