import { type NextRequest, NextResponse } from "next/server"
import { getContractById, updateContractStatus } from "@/lib/contracts-db"
import { sendContractSigningEmail } from "@/lib/contract-email"
import { requireAdminAuth } from "@/lib/auth-middleware"

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const contractId = parseInt(params.id)
    if (isNaN(contractId)) {
      return NextResponse.json({ error: "Invalid contract ID" }, { status: 400 })
    }

    const contract = await getContractById(contractId)
    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 })
    }

    // Check if contract is in draft status
    if (contract.status !== 'draft') {
      return NextResponse.json({ 
        error: "Contract must be in draft status to send" 
      }, { status: 400 })
    }

    // Generate signing links
    const baseUrl = request.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const clientSigningLink = `${baseUrl}/contracts/sign/${contract.client_signing_token}`
    const speakerSigningLink = contract.speaker_signing_token ? 
      `${baseUrl}/contracts/sign/${contract.speaker_signing_token}` : null

    // Send emails
    const emailResults = []
    
    // Send to client
    const clientEmailSent = await sendContractSigningEmail(contract, 'client', clientSigningLink)
    emailResults.push({ recipient: 'client', sent: clientEmailSent })

    // Send to speaker if speaker info exists
    if (contract.speaker_email && speakerSigningLink) {
      const speakerEmailSent = await sendContractSigningEmail(contract, 'speaker', speakerSigningLink)
      emailResults.push({ recipient: 'speaker', sent: speakerEmailSent })
    }

    // Update contract status to 'sent'
    const updatedContract = await updateContractStatus(contractId, 'sent', 'admin')
    if (!updatedContract) {
      return NextResponse.json({ 
        error: "Failed to update contract status" 
      }, { status: 500 })
    }

    return NextResponse.json({
      message: "Contract sent successfully",
      emailResults,
      contract: updatedContract
    })
  } catch (error) {
    console.error("Error in POST /api/contracts/[id]/send:", error)
    return NextResponse.json(
      {
        error: "Failed to send contract",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}