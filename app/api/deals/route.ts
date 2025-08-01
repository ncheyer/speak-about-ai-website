import { type NextRequest, NextResponse } from "next/server"
import { getAllDeals, createDeal } from "@/lib/deals-db"

export async function GET() {
  try {
    const deals = await getAllDeals()
    return NextResponse.json(deals)
  } catch (error) {
    console.error("Error in GET /api/deals:", error)
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const dealData = await request.json()
    const deal = await createDeal(dealData)

    if (!deal) {
      return NextResponse.json({ error: "Failed to create deal" }, { status: 500 })
    }

    return NextResponse.json(deal, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/deals:", error)
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 })
  }
}
