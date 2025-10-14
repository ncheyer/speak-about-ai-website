import { NextRequest, NextResponse } from "next/server"
import { getAllWorkshops, getActiveWorkshops, createWorkshop, searchWorkshops } from "@/lib/workshops-db"
import { requireAdminAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const includeInactive = searchParams.get("includeInactive") === "true"

    let workshops

    if (query) {
      // Search workshops
      workshops = await searchWorkshops(query)
    } else if (includeInactive) {
      // Get all workshops (requires admin)
      const devBypass = request.headers.get('x-dev-admin-bypass')
      if (devBypass !== 'dev-admin-access') {
        const authError = requireAdminAuth(request)
        if (authError) return authError
      }
      workshops = await getAllWorkshops()
    } else {
      // Get active workshops only
      workshops = await getActiveWorkshops()
    }

    return NextResponse.json(workshops)
  } catch (error) {
    console.error("Error in GET /api/workshops:", error)
    return NextResponse.json(
      { error: "Failed to fetch workshops", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const devBypass = request.headers.get('x-dev-admin-bypass')
    if (devBypass !== 'dev-admin-access') {
      const authError = requireAdminAuth(request)
      if (authError) return authError
    }

    const body = await request.json()
    const workshop = await createWorkshop(body)

    return NextResponse.json(workshop, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/workshops:", error)
    return NextResponse.json(
      { error: "Failed to create workshop", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
