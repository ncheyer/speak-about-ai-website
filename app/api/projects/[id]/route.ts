import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { requireAdminAuth } from "@/lib/auth-middleware"

const sql = neon(process.env.DATABASE_URL!)

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

    // Delete the project (will cascade delete related records due to foreign key constraints)
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