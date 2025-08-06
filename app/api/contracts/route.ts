import { type NextRequest, NextResponse } from "next/server"
import { getAllContracts, createContractFromDeal, updateContractStatus } from "@/lib/contracts-db"
import { getDealById } from "@/lib/deals-db"
import { requireAdminAuth } from "@/lib/auth-middleware"
import { generateContractContent } from "@/lib/contract-template"
import { sendSpeakerContractEmail, sendClientContractEmail } from "@/lib/email-service"

export async function GET(request: NextRequest) {
  try {
    // Skip auth for now to match the simple localStorage pattern used elsewhere
    // TODO: Implement proper JWT auth across all admin APIs
    // const authError = requireAdminAuth(request)
    // if (authError) return authError

    const contracts = await getAllContracts()
    return NextResponse.json(contracts)
  } catch (error) {
    console.error("Error in GET /api/contracts:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch contracts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Skip auth for now to match the simple localStorage pattern used elsewhere
    // TODO: Implement proper JWT auth across all admin APIs
    // const authError = requireAdminAuth(request)
    // if (authError) {
    //   console.log("Auth error in contracts POST:", authError)
    //   return authError
    // }
    
    const body = await request.json()
    
    // Check if this is a preview request
    const { searchParams } = new URL(request.url)
    const isPreview = searchParams.get("preview") === "true"
    
    if (isPreview) {
      // Handle preview request
      if (!body.deal_id) {
        return NextResponse.json({ error: "deal_id is required" }, { status: 400 })
      }

      const deal = await getDealById(body.deal_id)
      if (!deal) {
        return NextResponse.json({ error: "Deal not found" }, { status: 404 })
      }

      // Build contract data with all required fields
      const contractData = {
        ...deal,
        contract_number: `CNT-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        speaker_name: body.speaker_info?.name || deal.speaker_requested || 'To be determined',
        speaker_email: body.speaker_info?.email || '',
        speaker_fee: parseFloat(body.speaker_info?.fee) || (typeof deal.deal_value === 'string' ? parseFloat(deal.deal_value) : deal.deal_value) || 0,
        payment_terms: body.payment_terms || "Net 30 days after event completion",
        additional_terms: body.additional_terms || '',
        deal_value: typeof deal.deal_value === 'string' ? parseFloat(deal.deal_value) || 0 : deal.deal_value
      }

      // Generate contract content
      let contractContent
      try {
        contractContent = generateContractContent(contractData)
      } catch (genError) {
        console.error("Error generating contract content:", genError)
        return NextResponse.json(
          {
            error: "Failed to generate contract content",
            details: genError instanceof Error ? genError.message : "Unknown error",
          },
          { status: 500 }
        )
      }

      const formattedContent = contractContent + `
---

**Contract Status:** DRAFT - Not yet sent for signatures`

      return NextResponse.json({ 
        content: formattedContent,
        metadata: {
          template: deal.event_type === "virtual" ? "virtual" : "in-person",
          deal_value: contractData.speaker_fee || contractData.deal_value,
          event_date: deal.event_date,
          speaker_name: contractData.speaker_name
        }
      })
    }

    // Validate required fields
    if (!body.deal_id) {
      return NextResponse.json({ error: "deal_id is required" }, { status: 400 })
    }

    // Get the deal information
    const deal = await getDealById(body.deal_id)
    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    // Check if deal is in won status
    if (deal.status !== 'won') {
      return NextResponse.json(
        { error: "Can only create contracts for won deals" }, 
        { status: 400 }
      )
    }

    // Extract speaker information and additional terms from body
    const speakerInfo = body.speaker_info ? {
      name: body.speaker_info.name,
      email: body.speaker_info.email,
      fee: body.speaker_info.fee
    } : undefined
    
    // Extract client signer information
    const clientSignerInfo = body.client_signer_info ? {
      name: body.client_signer_info.name,
      email: body.client_signer_info.email
    } : {
      name: deal.client_name,
      email: deal.client_email
    }

    const contract = await createContractFromDeal(
      deal,
      speakerInfo,
      body.additional_terms,
      body.created_by || 'admin',
      clientSignerInfo
    )

    if (!contract) {
      return NextResponse.json({ error: "Failed to create contract" }, { status: 500 })
    }
    
    // Send contract emails to both parties
    try {
      // Send to speaker
      if (contract.speaker_email && contract.speaker_signing_token) {
        await sendSpeakerContractEmail({
          speakerEmail: contract.speaker_email,
          speakerName: contract.speaker_name || 'Speaker',
          contractNumber: contract.contract_number,
          eventTitle: contract.event_title,
          eventDate: contract.event_date,
          eventLocation: contract.event_location,
          speakerFee: contract.speaker_fee || contract.total_amount,
          contractId: contract.id,
          signingToken: contract.speaker_signing_token
        })
      }
      
      // Send to client
      if (contract.client_signer_email && contract.client_signing_token) {
        const ccEmails = contract.client_signer_email !== contract.client_email ? [contract.client_email] : []
        
        await sendClientContractEmail({
          signerEmail: contract.client_signer_email,
          signerName: contract.client_signer_name || contract.client_name,
          clientCompany: contract.client_company || '',
          speakerName: contract.speaker_name || 'Speaker',
          contractNumber: contract.contract_number,
          eventTitle: contract.event_title,
          eventDate: contract.event_date,
          eventLocation: contract.event_location,
          totalAmount: contract.total_amount,
          contractId: contract.id,
          signingToken: contract.client_signing_token,
          ccEmails
        })
      }
      
      // Update contract status to 'sent'
      await updateContractStatus(contract.id, 'sent')
    } catch (emailError) {
      console.error("Failed to send contract emails:", emailError)
      // Don't fail the contract creation, but log the error
    }

    return NextResponse.json(contract, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/contracts:", error)
    return NextResponse.json(
      {
        error: "Failed to create contract",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}