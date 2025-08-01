import { type NextRequest, NextResponse } from "next/server"
import { getAllDeals, createDeal, searchDeals, getDealsByStatus } from "@/lib/deals-db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    let deals
    if (search) {
      deals = await searchDeals(search)
    } else if (status) {
      deals = await getDealsByStatus(status)
    } else {
      deals = await getAllDeals()
    }

    return NextResponse.json({ deals })
  } catch (error) {
    console.error("Error in GET /api/deals:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch deals",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "client_name",
      "client_email",
      "company",
      "event_title",
      "event_date",
      "event_location",
      "event_type",
      "attendee_count",
      "budget_range",
      "deal_value",
      "status",
      "priority",
      "source",
      "notes",
      "last_contact",
    ]

    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const deal = await createDeal(body)

    if (!deal) {
      return NextResponse.json({ error: "Failed to create deal" }, { status: 500 })
    }

    return NextResponse.json({ deal }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/deals:", error)
    return NextResponse.json(
      {
        error: "Failed to create deal",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
