import { neon } from "@neondatabase/serverless"

// Check if DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set")
  throw new Error("DATABASE_URL environment variable is required")
}

const sql = neon(process.env.DATABASE_URL)

export interface Project {
  id: number
  project_name: string
  client_name: string
  client_email?: string
  client_phone?: string
  company?: string
  project_type: string
  description?: string
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  start_date: string
  end_date?: string
  deadline?: string
  budget: number
  spent: number
  completion_percentage: number
  team_members?: string[]
  deliverables?: string
  milestones?: any // JSONB
  notes?: string
  tags?: string[]
  created_at: string
  updated_at: string
  completed_at?: string
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    console.log("Fetching all projects from database...")
    const projects = await sql`
      SELECT * FROM projects 
      ORDER BY created_at DESC
    `
    console.log(`Successfully fetched ${projects.length} projects`)
    return projects as Project[]
  } catch (error) {
    console.error("Error fetching projects:", error)

    // Check if it's a table doesn't exist error
    if (error instanceof Error && error.message.includes('relation "projects" does not exist')) {
      console.error("The projects table doesn't exist. Please run the create-projects-table.sql script.")
      throw new Error("Database table 'projects' does not exist. Please run the setup script.")
    }

    throw error
  }
}

export async function createProject(projectData: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project | null> {
  try {
    console.log("Creating new project:", projectData.project_name)
    const [project] = await sql`
      INSERT INTO projects (
        project_name, client_name, client_email, client_phone, company,
        project_type, description, status, priority, start_date,
        end_date, deadline, budget, spent, completion_percentage,
        team_members, deliverables, milestones, notes, tags
      ) VALUES (
        ${projectData.project_name}, ${projectData.client_name}, ${projectData.client_email || null}, 
        ${projectData.client_phone || null}, ${projectData.company || null},
        ${projectData.project_type}, ${projectData.description || null}, ${projectData.status}, 
        ${projectData.priority}, ${projectData.start_date},
        ${projectData.end_date || null}, ${projectData.deadline || null}, ${projectData.budget}, 
        ${projectData.spent}, ${projectData.completion_percentage},
        ${projectData.team_members || null}, ${projectData.deliverables || null}, 
        ${projectData.milestones || null}, ${projectData.notes || null}, ${projectData.tags || null}
      )
      RETURNING *
    `
    console.log("Successfully created project with ID:", project.id)
    return project as Project
  } catch (error) {
    console.error("Error creating project:", error)
    return null
  }
}

export async function updateProject(id: number, projectData: Partial<Project>): Promise<Project | null> {
  try {
    console.log("Updating project ID:", id)
    const [project] = await sql`
      UPDATE projects SET
        project_name = COALESCE(${projectData.project_name || null}, project_name),
        client_name = COALESCE(${projectData.client_name || null}, client_name),
        client_email = COALESCE(${projectData.client_email || null}, client_email),
        client_phone = COALESCE(${projectData.client_phone || null}, client_phone),
        company = COALESCE(${projectData.company || null}, company),
        project_type = COALESCE(${projectData.project_type || null}, project_type),
        description = COALESCE(${projectData.description || null}, description),
        status = COALESCE(${projectData.status || null}, status),
        priority = COALESCE(${projectData.priority || null}, priority),
        start_date = COALESCE(${projectData.start_date || null}, start_date),
        end_date = COALESCE(${projectData.end_date || null}, end_date),
        deadline = COALESCE(${projectData.deadline || null}, deadline),
        budget = COALESCE(${projectData.budget || null}, budget),
        spent = COALESCE(${projectData.spent || null}, spent),
        completion_percentage = COALESCE(${projectData.completion_percentage || null}, completion_percentage),
        team_members = COALESCE(${projectData.team_members || null}, team_members),
        deliverables = COALESCE(${projectData.deliverables || null}, deliverables),
        milestones = COALESCE(${projectData.milestones || null}, milestones),
        notes = COALESCE(${projectData.notes || null}, notes),
        tags = COALESCE(${projectData.tags || null}, tags),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    console.log("Successfully updated project ID:", id)
    return project as Project
  } catch (error) {
    console.error("Error updating project:", error)
    return null
  }
}

export async function deleteProject(id: number): Promise<boolean> {
  try {
    console.log("Deleting project ID:", id)
    await sql`DELETE FROM projects WHERE id = ${id}`
    console.log("Successfully deleted project ID:", id)
    return true
  } catch (error) {
    console.error("Error deleting project:", error)
    return false
  }
}

export async function getProjectsByStatus(status: string): Promise<Project[]> {
  try {
    console.log("Fetching projects by status:", status)
    const projects = await sql`
      SELECT * FROM projects 
      WHERE status = ${status}
      ORDER BY created_at DESC
    `
    console.log(`Found ${projects.length} projects with status: ${status}`)
    return projects as Project[]
  } catch (error) {
    console.error("Error fetching projects by status:", error)
    return []
  }
}

export async function searchProjects(searchTerm: string): Promise<Project[]> {
  try {
    console.log("Searching projects for term:", searchTerm)
    const projects = await sql`
      SELECT * FROM projects 
      WHERE 
        project_name ILIKE ${"%" + searchTerm + "%"} OR
        client_name ILIKE ${"%" + searchTerm + "%"} OR
        company ILIKE ${"%" + searchTerm + "%"} OR
        description ILIKE ${"%" + searchTerm + "%"}
      ORDER BY created_at DESC
    `
    console.log(`Found ${projects.length} projects matching search term: ${searchTerm}`)
    return projects as Project[]
  } catch (error) {
    console.error("Error searching projects:", error)
    return []
  }
}

// Get active projects (not completed or cancelled)
export async function getActiveProjects(): Promise<Project[]> {
  try {
    console.log("Fetching active projects...")
    const projects = await sql`
      SELECT * FROM projects 
      WHERE status NOT IN ('completed', 'cancelled')
      ORDER BY deadline ASC, priority DESC
    `
    console.log(`Found ${projects.length} active projects`)
    return projects as Project[]
  } catch (error) {
    console.error("Error fetching active projects:", error)
    return []
  }
}

// Get projects by priority
export async function getProjectsByPriority(priority: string): Promise<Project[]> {
  try {
    console.log("Fetching projects by priority:", priority)
    const projects = await sql`
      SELECT * FROM projects 
      WHERE priority = ${priority}
      ORDER BY deadline ASC
    `
    console.log(`Found ${projects.length} projects with priority: ${priority}`)
    return projects as Project[]
  } catch (error) {
    console.error("Error fetching projects by priority:", error)
    return []
  }
}

// Get overdue projects
export async function getOverdueProjects(): Promise<Project[]> {
  try {
    console.log("Fetching overdue projects...")
    const projects = await sql`
      SELECT * FROM projects 
      WHERE deadline < CURRENT_DATE AND status NOT IN ('completed', 'cancelled')
      ORDER BY deadline ASC
    `
    console.log(`Found ${projects.length} overdue projects`)
    return projects as Project[]
  } catch (error) {
    console.error("Error fetching overdue projects:", error)
    return []
  }
}