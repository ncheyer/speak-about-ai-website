import { NextRequest, NextResponse } from "next/server"
import { getWorkshopById, updateWorkshop, deleteWorkshop } from "@/lib/workshops-db"
import { requireAdminAuth } from "@/lib/auth-middleware"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params
    const id = parseInt(idString)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid workshop ID" }, { status: 400 })
    }

    const workshop = await getWorkshopById(id)

    if (!workshop) {
      return NextResponse.json({ error: "Workshop not found" }, { status: 404 })
    }

    return NextResponse.json(workshop)
  } catch (error) {
    console.error("Error in GET /api/workshops/[id]:", error)
    return NextResponse.json(
      { error: "Failed to fetch workshop", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    const devBypass = request.headers.get('x-dev-admin-bypass')
    if (devBypass !== 'dev-admin-access') {
      const authError = requireAdminAuth(request)
      if (authError) return authError
    }

    const { id: idString } = await params
    const id = parseInt(idString)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid workshop ID" }, { status: 400 })
    }

    const body = await request.json()
    const workshop = await updateWorkshop(id, body)

    if (!workshop) {
      return NextResponse.json({ error: "Workshop not found" }, { status: 404 })
    }

    return NextResponse.json(workshop)
  } catch (error) {
    console.error("Error in PUT /api/workshops/[id]:", error)
    return NextResponse.json(
      { error: "Failed to update workshop", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    const devBypass = request.headers.get('x-dev-admin-bypass')
    if (devBypass !== 'dev-admin-access') {
      const authError = requireAdminAuth(request)
      if (authError) return authError
    }

    const { id: idString } = await params
    const id = parseInt(idString)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid workshop ID" }, { status: 400 })
    }

    const success = await deleteWorkshop(id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete workshop" }, { status: 404 })
    }

    return NextResponse.json({ message: "Workshop deleted successfully" })
  } catch (error) {
    console.error("Error in DELETE /api/workshops/[id]:", error)
    return NextResponse.json(
      { error: "Failed to delete workshop", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
