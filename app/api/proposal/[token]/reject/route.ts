import { NextResponse } from "next/server"
import { getProposalByToken, updateProposalStatus } from "@/lib/proposals-db"

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const data = await request.json()
    
    // Get proposal by token
    const proposal = await getProposalByToken(params.token)
    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      )
    }
    
    // Check if proposal can be rejected
    if (proposal.status === "accepted") {
      return NextResponse.json(
        { error: "Proposal has already been accepted" },
        { status: 400 }
      )
    }
    
    if (proposal.status === "rejected") {
      return NextResponse.json(
        { error: "Proposal has already been rejected" },
        { status: 400 }
      )
    }
    
    // Update proposal status
    const success = await updateProposalStatus(proposal.id, "rejected", {
      rejected_by: data.rejected_by,
      rejection_reason: data.rejection_reason
    })
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to update proposal status" },
        { status: 500 }
      )
    }
    
    // Send notification email to admin about rejection
    try {
      const { getProposalRejectedEmailTemplate } = await import("@/lib/email-templates/proposal-rejected")
      const { sendEmail } = await import("@/lib/email")
      
      const emailTemplate = getProposalRejectedEmailTemplate({
        proposalNumber: proposal.proposal_number,
        proposalTitle: proposal.title || `Speaking Engagement - ${proposal.event_title}`,
        clientName: proposal.client_name,
        clientCompany: proposal.client_company,
        rejectedBy: data.rejected_by,
        rejectionReason: data.rejection_reason,
        totalAmount: proposal.total_investment
      })
      
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'hello@speakaboutai.com',
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      })
    } catch (emailError) {
      console.error("Failed to send rejection notification:", emailError)
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Feedback sent successfully"
    })
  } catch (error) {
    console.error("Error rejecting proposal:", error)
    return NextResponse.json(
      { error: "Failed to send feedback" },
      { status: 500 }
    )
  }
}