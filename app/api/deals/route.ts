import { type NextRequest, NextResponse } from "next/server"
import { getAllDeals, createDeal, searchDeals, getDealsByStatus } from "@/lib/deals-db"
import { requireAdminAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError
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

    return NextResponse.json(deals)
  } catch (error) {
    console.error("Error in GET /api/deals:", error)

    let errorMessage = "Failed to fetch deals"
    let statusCode = 500

    if (error instanceof Error) {
      if (error.message.includes("does not exist")) {
        errorMessage = "Database table not found. Please run the setup script."
        statusCode = 503
      } else if (error.message.includes("DATABASE_URL")) {
        errorMessage = "Database configuration error"
        statusCode = 503
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
        tableExists: false,
      },
      { status: statusCode },
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

    return NextResponse.json(deal, { status: 201 })
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
