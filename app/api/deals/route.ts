import { type NextRequest, NextResponse } from "next/server"
import { getAllDeals, createDeal } from "@/lib/deals-db"

export async function GET() {
  try {
    const deals = await getAllDeals()
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
      },
      { status: statusCode },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const dealData = await request.json()

    // Validate required fields
    if (!dealData.client_name || !dealData.event_title) {
      return NextResponse.json(
        {
          error: "Missing required fields: client_name and event_title are required",
        },
        { status: 400 },
      )
    }

    const deal = await createDeal(dealData)

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
