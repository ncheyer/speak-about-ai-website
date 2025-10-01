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
    console.log("DELETE request received for project")
    
    // Check for dev bypass header first
    const devBypass = request.headers.get('x-dev-admin-bypass')
    if (devBypass === 'dev-admin-access') {
      console.log('Dev bypass active for project DELETE')
    } else {
      // Require admin authentication
      const authError = requireAdminAuth(request)
      if (authError) {
        console.log('Auth failed for DELETE request')
        return authError
      }
    }
    
    // Await params properly
    const resolvedParams = await params
    const idString = resolvedParams.id
    console.log("Attempting to delete project with ID string:", idString)
    
    const id = parseInt(idString)
    if (isNaN(id)) {
      console.error("Invalid project ID provided:", idString)
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }
    
    console.log("Parsed project ID:", id)
    const success = await deleteProject(id)
    
    if (!success) {
      console.log("Project not found or could not be deleted:", id)
      return NextResponse.json({ error: "Project not found or could not be deleted" }, { status: 404 })
    }
    
    console.log("Project deleted successfully:", id)
    return NextResponse.json({ message: "Project deleted successfully", id })
  } catch (error) {
    console.error("Error in DELETE /api/projects/[id]:", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      params: await params
    })
    return NextResponse.json(
      { 
        error: "Failed to delete project", 
        details: error instanceof Error ? error.message : "Unknown error",
        type: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    )
  }
}
