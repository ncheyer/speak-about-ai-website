import { type NextRequest, NextResponse } from "next/server"
import { createClientInvitation } from "@/lib/client-portal-auth"
import { requireAdminAuth } from "@/lib/auth-middleware"
import { getProjectById } from "@/lib/projects-db"

// Email functionality commented out until Resend is installed
// import { Resend } from 'resend'
// const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const body = await request.json()
    const { projectId, clientEmail, adminEmail } = body

    if (!projectId || !clientEmail) {
      return NextResponse.json({ 
        error: "Missing required fields: projectId and clientEmail" 
      }, { status: 400 })
    }

    // Get project details
    const project = await getProjectById(projectId)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Create invitation
    const { token, invitationId } = await createClientInvitation(
      projectId,
      clientEmail,
      adminEmail || 'admin@speakaboutai.com'
    )

    // Generate invitation URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${request.headers.get('host')}`
    const invitationUrl = `${baseUrl}/portal/client/accept-invite?token=${token}`

    // Email functionality commented out until Resend is installed
    // if (resend) {
    //   try {
    //     await resend.emails.send({
    //       from: 'Speak About AI <hello@speakaboutai.com>',
    //       to: clientEmail,
    //       subject: `You're invited to manage your event: ${project.event_name || project.project_name}`,
    //       html: emailHtml
    //     })
    //   } catch (emailError) {
    //     console.error('Error sending invitation email:', emailError)
    //   }
    // }
    
    console.log('📧 Email would be sent to:', clientEmail)
    console.log('🔗 Invitation URL:', invitationUrl)

    return NextResponse.json({
      success: true,
      invitationId,
      invitationUrl,
      message: "Invitation created successfully (email will be sent when Resend is configured)"
    })

  } catch (error) {
    console.error("Error creating client invitation:", error)
    return NextResponse.json(
      {
        error: "Failed to create invitation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}