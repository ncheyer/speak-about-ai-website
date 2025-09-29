import { neon } from "@neondatabase/serverless"
import { getAutomaticProjectStatus, type ProjectStatus } from "./project-status-utils"
import { ProjectDetails } from "./project-details-schema"

// Initialize Neon client with error handling
let sql: any = null
let databaseAvailable = false

try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL)
    databaseAvailable = true
  } else {
    console.warn("DATABASE_URL environment variable is not set - projects database unavailable")
  }
} catch (error) {
  console.error("Failed to initialize Neon client for projects:", error)
}

// Simplified Project interface using centralized project_details
export interface Project {
  id: number
  project_name: string
  client_name: string
  client_email?: string
  client_phone?: string
  company?: string
  project_type: string
  description?: string
  status: "invoicing" | "logistics_planning" | "pre_event" | "event_week" | "follow_up" | "completed" | "cancelled" | "2plus_months" | "1to2_months" | "less_than_month" | "final_week"
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
  
  // Centralized details
  project_details: ProjectDetails
  details_completion_percentage: number
  has_critical_missing_info: boolean
  
  // Stage completion tracking (stays separate as it's workflow-related)
  stage_completion?: any // JSONB
  
  // Financial tracking (stays separate for reporting)
  actual_revenue?: number
  commission_percentage?: number
  commission_amount?: number
  payment_status?: "pending" | "partial" | "paid"
  payment_date?: string
  financial_notes?: string
  
  // Client portal fields (stays separate for access control)
  client_portal_enabled?: boolean
  client_portal_token?: string
  client_portal_expires_at?: string
  client_portal_invited_at?: string
  client_portal_last_accessed?: string
  client_editable_fields?: string[]
  client_view_only_fields?: string[]
  
  // System fields
  created_at: string
  updated_at: string
  completed_at?: string
  
  // Legacy support - these will be mapped from project_details
  event_date?: string
  event_location?: string
  event_type?: string
  speaker_fee?: number
  speaker_id?: number
}

// Helper function to extract commonly used fields from project_details
function extractLegacyFields(project: any): any {
  const details = project.project_details || {}
  return {
    ...project,
    // Map frequently accessed fields for backward compatibility
    event_date: details.overview?.event_date || project.event_date,
    event_location: details.overview?.event_location || project.event_location,
    event_type: details.event_details?.event_type || project.event_type,
    speaker_fee: details.billing?.speaker_fee || project.speaker_fee,
    speaker_name: details.overview?.speaker_name,
    venue_name: details.venue?.name,
    attendee_count: details.audience?.expected_size
  }
}

export async function getAllProjects(): Promise<Project[]> {
  if (!databaseAvailable || !sql) {
    console.warn("getAllProjects: Database not available")
    return []
  }
  
  try {
    console.log("Fetching all projects from database...")
    const projects = await sql`
      SELECT 
        id, project_name, client_name, client_email, client_phone, company,
        project_type, description, status, priority, start_date, end_date,
        deadline, budget, spent, completion_percentage, team_members,
        deliverables, milestones, notes, tags,
        project_details, details_completion_percentage, has_critical_missing_info,
        stage_completion, actual_revenue, commission_percentage, commission_amount,
        payment_status, payment_date, financial_notes,
        client_portal_enabled, client_portal_token, client_portal_expires_at,
        client_portal_invited_at, client_portal_last_accessed,
        client_editable_fields, client_view_only_fields,
        created_at, updated_at, completed_at,
        speaker_id
      FROM projects 
      ORDER BY created_at DESC
    `
    console.log(`Successfully fetched ${projects.length} projects`)
    return projects.map(extractLegacyFields) as Project[]
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

export async function getProjectById(id: number): Promise<Project | null> {
  if (!databaseAvailable || !sql) {
    console.warn("getProjectById: Database not available")
    return null
  }
  
  try {
    const [project] = await sql`
      SELECT 
        id, project_name, client_name, client_email, client_phone, company,
        project_type, description, status, priority, start_date, end_date,
        deadline, budget, spent, completion_percentage, team_members,
        deliverables, milestones, notes, tags,
        project_details, details_completion_percentage, has_critical_missing_info,
        stage_completion, actual_revenue, commission_percentage, commission_amount,
        payment_status, payment_date, financial_notes,
        client_portal_enabled, client_portal_token, client_portal_expires_at,
        client_portal_invited_at, client_portal_last_accessed,
        client_editable_fields, client_view_only_fields,
        created_at, updated_at, completed_at,
        speaker_id
      FROM projects 
      WHERE id = ${id}
    `
    return project ? extractLegacyFields(project) as Project : null
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error)
    return null
  }
}

export async function createProject(projectData: Partial<Project>): Promise<Project | null> {
  if (!databaseAvailable || !sql) {
    console.error("createProject: Database not available")
    return null
  }
  
  try {
    console.log("Creating new project with data:", JSON.stringify(projectData, null, 2))
    
    // Initialize project_details from the provided data
    const projectDetails: ProjectDetails = projectData.project_details || {
      overview: {
        speaker_name: projectData.speaker_name || '',
        company_name: projectData.company || '',
        event_location: projectData.event_location || '',
        event_date: projectData.event_date || '',
        event_classification: projectData.event_classification
      },
      venue: {
        name: projectData.venue_name || ''
      },
      contacts: {
        on_site: {
          name: projectData.client_name || '',
          email: projectData.client_email || '',
          cell_phone: projectData.client_phone || '',
          company: projectData.company || ''
        }
      },
      event_details: {
        event_title: projectData.project_name || '',
        event_type: projectData.event_type || ''
      },
      audience: {
        expected_size: projectData.attendee_count || 0
      },
      billing: {
        speaker_fee: projectData.speaker_fee || 0
      },
      logistics: {
        travel_required: projectData.travel_required || false,
        flight_required: projectData.flight_required || false,
        hotel_required: projectData.hotel_required || false
      }
    }
    
    // Initialize stage_completion for new projects
    const initialStageCompletion = {
      invoicing: {
        initial_invoice_sent: false,
        final_invoice_sent: false,
        kickoff_meeting_planned: false,
        client_contacts_documented: false,
        project_folder_created: false,
        internal_team_briefed: false,
        event_details_confirmed: false
      }
    }
    
    // Insert the project
    const [project] = await sql`
      INSERT INTO projects (
        project_name, client_name, client_email, client_phone, company,
        project_type, description, status, priority, start_date,
        deadline, budget, spent, completion_percentage, notes,
        project_details, details_completion_percentage, has_critical_missing_info,
        stage_completion
      ) VALUES (
        ${projectData.project_name || 'New Project'},
        ${projectData.client_name || ''},
        ${projectData.client_email || null},
        ${projectData.client_phone || null},
        ${projectData.company || null},
        ${projectData.project_type || 'speaking_engagement'},
        ${projectData.description || null},
        ${projectData.status || 'invoicing'},
        ${projectData.priority || 'medium'},
        ${projectData.start_date || new Date().toISOString()},
        ${projectData.deadline || null},
        ${projectData.budget || 0},
        ${projectData.spent || 0},
        ${projectData.completion_percentage || 0},
        ${projectData.notes || null},
        ${JSON.stringify(projectDetails)},
        ${0}, -- Will be calculated
        ${true}, -- Will be calculated
        ${JSON.stringify(initialStageCompletion)}
      ) RETURNING *
    `
    
    console.log("Project created successfully:", project.id)
    
    // Calculate and update completion percentage
    await updateProjectCompletion(project.id)
    
    return await getProjectById(project.id)
  } catch (error) {
    console.error("Error creating project:", error)
    return null
  }
}

export async function updateProject(id: number, updates: Partial<Project>): Promise<Project | null> {
  if (!databaseAvailable || !sql) {
    console.warn("updateProject: Database not available")
    return null
  }
  
  try {
    // If updating project_details, merge with existing
    if (updates.project_details) {
      const existing = await getProjectById(id)
      if (existing) {
        updates.project_details = {
          ...existing.project_details,
          ...updates.project_details
        }
      }
    }
    
    // Build update query dynamically
    const updateFields = []
    const values = []
    let paramIndex = 1
    
    // Map of field names to their SQL parameter placeholders
    const fieldMappings: Record<string, any> = {
      project_name: updates.project_name,
      client_name: updates.client_name,
      client_email: updates.client_email,
      client_phone: updates.client_phone,
      company: updates.company,
      project_type: updates.project_type,
      description: updates.description,
      status: updates.status,
      priority: updates.priority,
      start_date: updates.start_date,
      end_date: updates.end_date,
      deadline: updates.deadline,
      budget: updates.budget,
      spent: updates.spent,
      completion_percentage: updates.completion_percentage,
      notes: updates.notes,
      project_details: updates.project_details ? JSON.stringify(updates.project_details) : undefined,
      stage_completion: updates.stage_completion ? JSON.stringify(updates.stage_completion) : undefined
    }
    
    // Build the SET clause
    for (const [field, value] of Object.entries(fieldMappings)) {
      if (value !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    }
    
    if (updateFields.length === 0) {
      return await getProjectById(id)
    }
    
    // Add the ID parameter
    values.push(id)
    
    const query = `
      UPDATE projects 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING *
    `
    
    const [project] = await sql(query, values)
    
    if (project && updates.project_details) {
      await updateProjectCompletion(id)
    }
    
    return project ? extractLegacyFields(project) as Project : null
  } catch (error) {
    console.error(`Error updating project ${id}:`, error)
    return null
  }
}

// Helper function to update project completion based on project_details
async function updateProjectCompletion(projectId: number): Promise<void> {
  if (!databaseAvailable || !sql) return
  
  try {
    // Get the project details
    const [project] = await sql`
      SELECT project_details FROM projects WHERE id = ${projectId}
    `
    
    if (!project) return
    
    const details = project.project_details || {}
    
    // Calculate completion percentage based on critical fields
    const criticalFields = [
      details.overview?.speaker_name,
      details.overview?.company_name,
      details.overview?.event_location,
      details.overview?.event_date,
      details.venue?.name,
      details.venue?.address,
      details.contacts?.on_site?.name,
      details.audience?.expected_size,
      details.event_details?.event_title
    ]
    
    const completedFields = criticalFields.filter(field => field && field !== '').length
    const completionPercentage = Math.round((completedFields / criticalFields.length) * 100)
    const hasCriticalMissing = completedFields < criticalFields.length
    
    // Update the project
    await sql`
      UPDATE projects 
      SET 
        details_completion_percentage = ${completionPercentage},
        has_critical_missing_info = ${hasCriticalMissing}
      WHERE id = ${projectId}
    `
  } catch (error) {
    console.error(`Error updating project completion for ${projectId}:`, error)
  }
}

// Export additional functions as needed
export async function searchProjects(searchTerm: string): Promise<Project[]> {
  if (!databaseAvailable || !sql) return []
  
  try {
    const projects = await sql`
      SELECT * FROM projects 
      WHERE 
        project_name ILIKE ${'%' + searchTerm + '%'} OR
        client_name ILIKE ${'%' + searchTerm + '%'} OR
        company ILIKE ${'%' + searchTerm + '%'} OR
        project_details::text ILIKE ${'%' + searchTerm + '%'}
      ORDER BY created_at DESC
    `
    return projects.map(extractLegacyFields) as Project[]
  } catch (error) {
    console.error("Error searching projects:", error)
    return []
  }
}

export async function getProjectsByStatus(status: string): Promise<Project[]> {
  if (!databaseAvailable || !sql) return []
  
  try {
    const projects = await sql`
      SELECT * FROM projects 
      WHERE status = ${status}
      ORDER BY created_at DESC
    `
    return projects.map(extractLegacyFields) as Project[]
  } catch (error) {
    console.error("Error fetching projects by status:", error)
    return []
  }
}

export async function getActiveProjects(): Promise<Project[]> {
  if (!databaseAvailable || !sql) return []
  
  try {
    const projects = await sql`
      SELECT * FROM projects 
      WHERE status NOT IN ('completed', 'cancelled')
      ORDER BY priority DESC, created_at DESC
    `
    return projects.map(extractLegacyFields) as Project[]
  } catch (error) {
    console.error("Error fetching active projects:", error)
    return []
  }
}

export async function getProjectsByPriority(priority: string): Promise<Project[]> {
  if (!databaseAvailable || !sql) return []
  
  try {
    const projects = await sql`
      SELECT * FROM projects 
      WHERE priority = ${priority}
      ORDER BY created_at DESC
    `
    return projects.map(extractLegacyFields) as Project[]
  } catch (error) {
    console.error("Error fetching projects by priority:", error)
    return []
  }
}

export async function getOverdueProjects(): Promise<Project[]> {
  if (!databaseAvailable || !sql) return []
  
  try {
    const projects = await sql`
      SELECT * FROM projects 
      WHERE deadline < NOW() AND status NOT IN ('completed', 'cancelled')
      ORDER BY deadline ASC
    `
    return projects.map(extractLegacyFields) as Project[]
  } catch (error) {
    console.error("Error fetching overdue projects:", error)
    return []
  }
}