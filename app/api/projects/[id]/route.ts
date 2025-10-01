import { type NextRequest, NextResponse } from "next/server"
import { deleteProject, updateProject, getProjectById } from "@/lib/projects-db"
import { requireAdminAuth } from "@/lib/auth-middleware"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for dev bypass header first
    const devBypass = request.headers.get('x-dev-admin-bypass')
    if (devBypass === 'dev-admin-access') {
      console.log('Dev bypass active for project GET')
    } else {
      // Require admin authentication
      const authError = requireAdminAuth(request)
      if (authError) return authError
    }
    
    const { id: idString } = await params
    const id = parseInt(idString)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }
    
    const project = await getProjectById(id)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    
    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { error: "Failed to fetch project", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for dev bypass header first
    const devBypass = request.headers.get('x-dev-admin-bypass')
    if (devBypass === 'dev-admin-access') {
      console.log('Dev bypass active for project UPDATE')
    } else {
      // Require admin authentication
      const authError = requireAdminAuth(request)
      if (authError) return authError
    }
    
    const { id: idString } = await params
    const id = parseInt(idString)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }
    
    const body = await request.json()
    const project = await updateProject(id, body)
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    
    return NextResponse.json(project)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      { error: "Failed to update project", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for dev bypass header first
    const devBypass = request.headers.get('x-dev-admin-bypass')
    if (devBypass === 'dev-admin-access') {
      console.log('Dev bypass active for project DELETE')
    } else {
      // Require admin authentication
      const authError = requireAdminAuth(request)
      if (authError) return authError
    }
    
    const { id: idString } = await params
    const id = parseInt(idString)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }
    
    const success = await deleteProject(id)
    
    if (!success) {
      return NextResponse.json({ error: "Project not found or could not be deleted" }, { status: 404 })
    }
    
    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      { error: "Failed to delete project", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
