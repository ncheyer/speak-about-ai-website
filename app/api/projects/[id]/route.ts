import { type NextRequest, NextResponse } from "next/server"
import { updateProject, deleteProject, getAllProjects } from "@/lib/projects-db"
import { requireAdminAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const projects = await getAllProjects()
    const project = projects.find(p => p.id === id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error in GET /api/projects/[id]:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const body = await request.json()

    // Convert numeric fields if they're strings
    if (body.budget !== undefined) {
      body.budget = parseFloat(body.budget)
    }
    if (body.spent !== undefined) {
      body.spent = parseFloat(body.spent)
    }
    if (body.completion_percentage !== undefined) {
      body.completion_percentage = parseInt(body.completion_percentage)
    }
    
    // Convert additional numeric fields from the offer sheet
    if (body.audience_size !== undefined) {
      body.audience_size = parseInt(body.audience_size)
    }
    if (body.program_length !== undefined) {
      body.program_length = parseInt(body.program_length)
    }
    if (body.qa_length !== undefined) {
      body.qa_length = parseInt(body.qa_length)
    }
    if (body.total_program_length !== undefined) {
      body.total_program_length = parseInt(body.total_program_length)
    }
    if (body.speaker_fee !== undefined) {
      body.speaker_fee = parseFloat(body.speaker_fee)
    }
    if (body.travel_expenses_amount !== undefined) {
      body.travel_expenses_amount = parseFloat(body.travel_expenses_amount)
    }
    
    // Convert boolean fields
    const booleanFields = [
      'recording_allowed', 'live_streaming', 'photography_allowed', 'travel_required',
      'airport_transport_provided', 'venue_transport_provided', 'accommodation_required',
      'green_room_available', 'marketing_use_allowed', 'press_media_present',
      'prep_call_requested', 'contract_signed', 'invoice_sent', 'payment_received',
      'presentation_ready', 'materials_sent'
    ]
    
    booleanFields.forEach(field => {
      if (body[field] !== undefined) {
        body[field] = body[field] === 'true' || body[field] === true
      }
    })

    const project = await updateProject(id, body)

    if (!project) {
      return NextResponse.json({ error: "Failed to update project or project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error in PUT /api/projects/[id]:", error)
    return NextResponse.json(
      {
        error: "Failed to update project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const success = await deleteProject(id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete project or project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error in DELETE /api/projects/[id]:", error)
    return NextResponse.json(
      {
        error: "Failed to delete project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}