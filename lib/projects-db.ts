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
  status: "2plus_months" | "1to2_months" | "less_than_month" | "final_week" | "completed" | "cancelled"
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
  // Event-specific fields
  event_date?: string
  event_location?: string
  event_type?: string
  attendee_count?: number
  speaker_fee?: number
  travel_required?: boolean
  accommodation_required?: boolean
  av_requirements?: string
  catering_requirements?: string
  special_requirements?: string
  event_agenda?: any // JSONB
  marketing_materials?: any // JSONB
  contact_person?: string
  venue_contact?: string
  contract_signed?: boolean
  invoice_sent?: boolean
  payment_received?: boolean
  presentation_ready?: boolean
  materials_sent?: boolean
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
        team_members, deliverables, milestones, notes, tags,
        event_date, event_location, event_type, attendee_count, speaker_fee,
        travel_required, accommodation_required, av_requirements, catering_requirements,
        special_requirements, event_agenda, marketing_materials, contact_person,
        venue_contact, contract_signed, invoice_sent, payment_received,
        presentation_ready, materials_sent
      ) VALUES (
        ${projectData.project_name}, ${projectData.client_name}, ${projectData.client_email || null}, 
        ${projectData.client_phone || null}, ${projectData.company || null},
        ${projectData.project_type}, ${projectData.description || null}, ${projectData.status}, 
        ${projectData.priority}, ${projectData.start_date},
        ${projectData.end_date || null}, ${projectData.deadline || null}, ${projectData.budget}, 
        ${projectData.spent}, ${projectData.completion_percentage},
        ${projectData.team_members || null}, ${projectData.deliverables || null}, 
        ${projectData.milestones || null}, ${projectData.notes || null}, ${projectData.tags || null},
        ${projectData.event_date || null}, ${projectData.event_location || null}, 
        ${projectData.event_type || null}, ${projectData.attendee_count || null}, ${projectData.speaker_fee || null},
        ${projectData.travel_required || false}, ${projectData.accommodation_required || false},
        ${projectData.av_requirements || null}, ${projectData.catering_requirements || null},
        ${projectData.special_requirements || null}, ${projectData.event_agenda || null},
        ${projectData.marketing_materials || null}, ${projectData.contact_person || null},
        ${projectData.venue_contact || null}, ${projectData.contract_signed || false},
        ${projectData.invoice_sent || false}, ${projectData.payment_received || false},
        ${projectData.presentation_ready || false}, ${projectData.materials_sent || false}
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
        event_date = COALESCE(${projectData.event_date || null}, event_date),
        event_location = COALESCE(${projectData.event_location || null}, event_location),
        event_type = COALESCE(${projectData.event_type || null}, event_type),
        attendee_count = COALESCE(${projectData.attendee_count || null}, attendee_count),
        speaker_fee = COALESCE(${projectData.speaker_fee || null}, speaker_fee),
        travel_required = COALESCE(${projectData.travel_required !== undefined ? projectData.travel_required : null}, travel_required),
        accommodation_required = COALESCE(${projectData.accommodation_required !== undefined ? projectData.accommodation_required : null}, accommodation_required),
        av_requirements = COALESCE(${projectData.av_requirements || null}, av_requirements),
        catering_requirements = COALESCE(${projectData.catering_requirements || null}, catering_requirements),
        special_requirements = COALESCE(${projectData.special_requirements || null}, special_requirements),
        event_agenda = COALESCE(${projectData.event_agenda || null}, event_agenda),
        marketing_materials = COALESCE(${projectData.marketing_materials || null}, marketing_materials),
        contact_person = COALESCE(${projectData.contact_person || null}, contact_person),
        venue_contact = COALESCE(${projectData.venue_contact || null}, venue_contact),
        contract_signed = COALESCE(${projectData.contract_signed !== undefined ? projectData.contract_signed : null}, contract_signed),
        invoice_sent = COALESCE(${projectData.invoice_sent !== undefined ? projectData.invoice_sent : null}, invoice_sent),
        payment_received = COALESCE(${projectData.payment_received !== undefined ? projectData.payment_received : null}, payment_received),
        presentation_ready = COALESCE(${projectData.presentation_ready !== undefined ? projectData.presentation_ready : null}, presentation_ready),
        materials_sent = COALESCE(${projectData.materials_sent !== undefined ? projectData.materials_sent : null}, materials_sent),
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