import { type NextRequest, NextResponse } from "next/server"
import { getAllProjects, createProject, searchProjects, getProjectsByStatus, getActiveProjects, getProjectsByPriority, getOverdueProjects } from "@/lib/projects-db"
import { requireAdminAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const filter = searchParams.get("filter")

    let projects
    if (search) {
      projects = await searchProjects(search)
    } else if (status) {
      projects = await getProjectsByStatus(status)
    } else if (priority) {
      projects = await getProjectsByPriority(priority)
    } else if (filter === "active") {
      projects = await getActiveProjects()
    } else if (filter === "overdue") {
      projects = await getOverdueProjects()
    } else {
      projects = await getAllProjects()
    }

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error in GET /api/projects:", error)

    let errorMessage = "Failed to fetch projects"
    let statusCode = 500

    if (error instanceof Error) {
      if (error.message.includes("does not exist")) {
        errorMessage = "Database table not found. Please run the setup script."
        statusCode = 503
      } else if (error.message.includes("DATABASE_URL")) {
        errorMessage = "Database configuration error"
        statusCode = 503
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
        tableExists: false,
      },
      { status: statusCode },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError
    
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "project_name",
      "client_name",
      "project_type",
      "status",
      "priority",
      "start_date",
      "budget",
      "spent",
      "completion_percentage"
    ]

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Set default values
    const projectData = {
      ...body,
      budget: parseFloat(body.budget) || 0,
      spent: parseFloat(body.spent) || 0,
      completion_percentage: parseInt(body.completion_percentage) || 0
    }

    const project = await createProject(projectData)

    if (!project) {
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/projects:", error)
    return NextResponse.json(
      {
        error: "Failed to create project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}