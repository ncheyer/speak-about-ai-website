import { NextResponse } from "next/server"
import { getProposalById, updateProposalStatus } from "@/lib/proposals-db"
import { getProposalSentEmailTemplate } from "@/lib/email-templates/proposal-sent"
import { sendEmail } from "@/lib/email"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const proposalId = parseInt(params.id)
    
    // Get proposal details
    const proposal = await getProposalById(proposalId)
    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      )
    }
    
    // Update status to sent
    const success = await updateProposalStatus(proposalId, "sent")
    if (!success) {
      return NextResponse.json(
        { error: "Failed to update proposal status" },
        { status: 500 }
      )
    }
    
    // Send email to client with proposal link
    const proposalLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/proposal/${proposal.access_token}`
    
    const emailTemplate = getProposalSentEmailTemplate({
      clientName: proposal.client_name,
      clientCompany: proposal.client_company,
      proposalTitle: proposal.title || `Speaking Engagement Proposal - ${proposal.event_title}`,
      proposalNumber: proposal.proposal_number,
      proposalLink,
      validUntil: proposal.valid_until,
      senderName: proposal.created_by,
      senderTitle: "Business Development"
    })
    
    try {
      await sendEmail({
        to: proposal.client_email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      })
      
      console.log("Proposal email sent successfully to", proposal.client_email)
    } catch (emailError) {
      console.error("Failed to send proposal email:", emailError)
      // Don't fail the entire request if email fails
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Proposal sent successfully",
      link: proposalLink
    })
  } catch (error) {
    console.error("Error sending proposal:", error)
    return NextResponse.json(
      { error: "Failed to send proposal" },
      { status: 500 }
    )
  }
}