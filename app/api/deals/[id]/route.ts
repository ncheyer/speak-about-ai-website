import { type NextRequest, NextResponse } from "next/server"
import { updateDeal, deleteDeal } from "@/lib/deals-db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid deal ID" }, { status: 400 })
    }

    const body = await request.json()
    const deal = await updateDeal(id, body)

    if (!deal) {
      return NextResponse.json({ error: "Deal not found or failed to update" }, { status: 404 })
    }

    return NextResponse.json({ deal })
  } catch (error) {
    console.error("Error in PUT /api/deals/[id]:", error)
    return NextResponse.json(
      {
        error: "Failed to update deal",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid deal ID" }, { status: 400 })
    }

    const success = await deleteDeal(id)

    if (!success) {
      return NextResponse.json({ error: "Deal not found or failed to delete" }, { status: 404 })
    }

    return NextResponse.json({ message: "Deal deleted successfully" })
  } catch (error) {
    console.error("Error in DELETE /api/deals/[id]:", error)
    return NextResponse.json(
      {
        error: "Failed to delete deal",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
