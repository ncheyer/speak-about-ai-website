import { type NextRequest, NextResponse } from "next/server"
import { getContractById, updateContractStatus, deleteContract, generateContractHTML } from "@/lib/contracts-db"
import { requireAdminAuth } from "@/lib/auth-middleware"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const contractId = parseInt(params.id)
    if (isNaN(contractId)) {
      return NextResponse.json({ error: "Invalid contract ID" }, { status: 400 })
    }

    const contract = await getContractById(contractId)
    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 })
    }

    return NextResponse.json(contract)
  } catch (error) {
    console.error("Error in GET /api/contracts/[id]:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch contract",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const contractId = parseInt(params.id)
    if (isNaN(contractId)) {
      return NextResponse.json({ error: "Invalid contract ID" }, { status: 400 })
    }

    const body = await request.json()

    // Currently only supporting status updates
    if (body.status) {
      const validStatuses = ['draft', 'sent', 'partially_signed', 'fully_executed', 'cancelled']
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
      }

      const contract = await updateContractStatus(contractId, body.status, body.updated_by)
      if (!contract) {
        return NextResponse.json({ error: "Failed to update contract" }, { status: 500 })
      }

      return NextResponse.json(contract)
    }

    return NextResponse.json({ error: "No valid updates provided" }, { status: 400 })
  } catch (error) {
    console.error("Error in PUT /api/contracts/[id]:", error)
    return NextResponse.json(
      {
        error: "Failed to update contract",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const contractId = parseInt(params.id)
    if (isNaN(contractId)) {
      return NextResponse.json({ error: "Invalid contract ID" }, { status: 400 })
    }

    const success = await deleteContract(contractId)
    if (!success) {
      return NextResponse.json({ error: "Failed to delete contract" }, { status: 500 })
    }

    return NextResponse.json({ message: "Contract deleted successfully" })
  } catch (error) {
    console.error("Error in DELETE /api/contracts/[id]:", error)
    return NextResponse.json(
      {
        error: "Failed to delete contract",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}