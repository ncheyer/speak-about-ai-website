import { type NextRequest, NextResponse } from "next/server"
import { getAllContracts, createContractFromDeal } from "@/lib/contracts-db"
import { getDealById } from "@/lib/deals-db"
import { requireAdminAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError

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
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError
    
    const body = await request.json()

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

    const contract = await createContractFromDeal(
      deal,
      speakerInfo,
      body.additional_terms,
      body.created_by || 'admin'
    )

    if (!contract) {
      return NextResponse.json({ error: "Failed to create contract" }, { status: 500 })
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