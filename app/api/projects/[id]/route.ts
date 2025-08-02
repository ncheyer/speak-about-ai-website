import { type NextRequest, NextResponse } from "next/server"
import { updateProject, deleteProject, getAllProjects } from "@/lib/projects-db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
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