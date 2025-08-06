import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { requireAdminAuth } from "@/lib/auth-middleware"
import { getProjectById, updateProject } from "@/lib/projects-db"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const { id } = await params
    const projectId = parseInt(id)
    
    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const project = await getProjectById(projectId)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)

  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch project",
        details: error instanceof Error ? error.message : "Unknown error"
      },
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
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const { id } = await params
    const projectId = parseInt(id)
    
    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const body = await request.json()
    const updatedProject = await updateProject(projectId, body)

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(updatedProject)

  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      { 
        error: "Failed to update project",
        details: error instanceof Error ? error.message : "Unknown error"
      },
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
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const { id } = await params
    const projectId = parseInt(id)
    
    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Check if project exists
    const [project] = await sql`
      SELECT id FROM projects WHERE id = ${projectId}
    `

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Delete related records first to avoid foreign key constraint violations
    // Delete client portal audit logs
    await sql`DELETE FROM client_portal_audit_log WHERE project_id = ${projectId}`
    
    // Delete client portal invitations
    await sql`DELETE FROM client_portal_invitations WHERE project_id = ${projectId}`
    
    // Now delete the project
    await sql`DELETE FROM projects WHERE id = ${projectId}`

    return NextResponse.json({ 
      success: true, 
      message: "Project deleted successfully" 
    })

  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      { 
        error: "Failed to delete project",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}