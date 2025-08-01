import { type NextRequest, NextResponse } from "next/server"
import { updateDeal, deleteDeal } from "@/lib/deals-db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const dealData = await request.json()

    const deal = await updateDeal(id, dealData)

    if (!deal) {
      return NextResponse.json({ error: "Deal not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(deal)
  } catch (error) {
    console.error("Error in PUT /api/deals/[id]:", error)
    return NextResponse.json({ error: "Failed to update deal" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const success = await deleteDeal(id)

    if (!success) {
      return NextResponse.json({ error: "Deal not found or delete failed" }, { status: 404 })
    }

    return NextResponse.json({ message: "Deal deleted successfully" })
  } catch (error) {
    console.error("Error in DELETE /api/deals/[id]:", error)
    return NextResponse.json({ error: "Failed to delete deal" }, { status: 500 })
  }
}
