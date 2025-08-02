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
  
  // Event Overview - Billing Contact
  billing_contact_name?: string
  billing_contact_title?: string
  billing_contact_email?: string
  billing_contact_phone?: string
  billing_address?: string
  
  // Event Overview - Logistics Contact
  logistics_contact_name?: string
  logistics_contact_email?: string
  logistics_contact_phone?: string
  
  // Event Overview - Additional Fields
  end_client_name?: string
  event_name?: string
  event_date?: string
  event_website?: string
  venue_name?: string
  venue_address?: string
  venue_contact_name?: string
  venue_contact_email?: string
  venue_contact_phone?: string
  
  // Speaker Program Details
  requested_speaker_name?: string
  program_topic?: string
  program_type?: string
  audience_size?: number
  audience_demographics?: string
  speaker_attire?: string
  
  // Event Schedule
  event_start_time?: string
  event_end_time?: string
  speaker_arrival_time?: string
  program_start_time?: string
  program_length?: number
  qa_length?: number
  total_program_length?: number
  speaker_departure_time?: string
  event_timeline?: string
  event_timezone?: string
  
  // Technical Requirements
  av_requirements?: string
  recording_allowed?: boolean
  recording_purpose?: string
  live_streaming?: boolean
  photography_allowed?: boolean
  tech_rehearsal_date?: string
  tech_rehearsal_time?: string
  
  // Travel & Accommodation
  travel_required?: boolean
  fly_in_date?: string
  fly_out_date?: string
  flight_number_in?: string
  flight_number_out?: string
  nearest_airport?: string
  airport_transport_provided?: boolean
  airport_transport_details?: string
  venue_transport_provided?: boolean
  venue_transport_details?: string
  accommodation_required?: boolean
  hotel_name?: string
  hotel_reservation_number?: string
  hotel_dates_needed?: string
  hotel_tier_preference?: string
  guest_list_details?: string
  
  // Speaker Information (Speaker Portal Provided)
  speaker_bio?: string
  speaker_headshot?: string
  speaker_presentation_title?: string
  speaker_av_requirements?: string
  
  // Additional Information
  green_room_available?: boolean
  meet_greet_opportunities?: string
  marketing_use_allowed?: boolean
  press_media_present?: boolean
  media_interview_requests?: string
  special_requests?: string
  
  // Financial Details
  speaker_fee?: number
  travel_expenses_type?: string
  travel_expenses_amount?: number
  payment_terms?: string
  invoice_number?: string
  purchase_order_number?: string
  
  // Confirmation Details
  prep_call_requested?: boolean
  prep_call_date?: string
  prep_call_time?: string
  additional_notes?: string
  
  // Status Tracking
  contract_signed?: boolean
  invoice_sent?: boolean
  payment_received?: boolean
  presentation_ready?: boolean
  materials_sent?: boolean
  
  // Event Classification
  event_classification?: "virtual" | "local" | "travel"
  
  // Legacy fields (keeping for backward compatibility)
  event_location?: string
  event_type?: string
  attendee_count?: number
  event_agenda?: any // JSONB
  marketing_materials?: any // JSONB
  contact_person?: string
  venue_contact?: string
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
        travel_required, accommodation_required, av_requirements, meals_provided,
        special_requests, event_agenda, marketing_materials, contact_person,
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
        ${projectData.av_requirements || null}, ${projectData.meals_provided || null},
        ${projectData.special_requests || null}, ${projectData.event_agenda || null},
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
        
        -- Event Overview - Billing Contact
        billing_contact_name = COALESCE(${projectData.billing_contact_name || null}, billing_contact_name),
        billing_contact_title = COALESCE(${projectData.billing_contact_title || null}, billing_contact_title),
        billing_contact_email = COALESCE(${projectData.billing_contact_email || null}, billing_contact_email),
        billing_contact_phone = COALESCE(${projectData.billing_contact_phone || null}, billing_contact_phone),
        billing_address = COALESCE(${projectData.billing_address || null}, billing_address),
        
        -- Event Overview - Logistics Contact
        logistics_contact_name = COALESCE(${projectData.logistics_contact_name || null}, logistics_contact_name),
        logistics_contact_email = COALESCE(${projectData.logistics_contact_email || null}, logistics_contact_email),
        logistics_contact_phone = COALESCE(${projectData.logistics_contact_phone || null}, logistics_contact_phone),
        
        -- Event Overview - Additional Fields
        end_client_name = COALESCE(${projectData.end_client_name || null}, end_client_name),
        event_name = COALESCE(${projectData.event_name || null}, event_name),
        event_date = COALESCE(${projectData.event_date || null}, event_date),
        event_website = COALESCE(${projectData.event_website || null}, event_website),
        venue_name = COALESCE(${projectData.venue_name || null}, venue_name),
        venue_address = COALESCE(${projectData.venue_address || null}, venue_address),
        venue_contact_name = COALESCE(${projectData.venue_contact_name || null}, venue_contact_name),
        venue_contact_email = COALESCE(${projectData.venue_contact_email || null}, venue_contact_email),
        venue_contact_phone = COALESCE(${projectData.venue_contact_phone || null}, venue_contact_phone),
        
        -- Speaker Program Details
        requested_speaker_name = COALESCE(${projectData.requested_speaker_name || null}, requested_speaker_name),
        program_topic = COALESCE(${projectData.program_topic || null}, program_topic),
        program_type = COALESCE(${projectData.program_type || null}, program_type),
        audience_size = COALESCE(${projectData.audience_size || null}, audience_size),
        audience_demographics = COALESCE(${projectData.audience_demographics || null}, audience_demographics),
        speaker_attire = COALESCE(${projectData.speaker_attire || null}, speaker_attire),
        
        -- Event Schedule
        event_start_time = COALESCE(${projectData.event_start_time || null}, event_start_time),
        event_end_time = COALESCE(${projectData.event_end_time || null}, event_end_time),
        speaker_arrival_time = COALESCE(${projectData.speaker_arrival_time || null}, speaker_arrival_time),
        program_start_time = COALESCE(${projectData.program_start_time || null}, program_start_time),
        program_length = COALESCE(${projectData.program_length || null}, program_length),
        qa_length = COALESCE(${projectData.qa_length || null}, qa_length),
        total_program_length = COALESCE(${projectData.total_program_length || null}, total_program_length),
        speaker_departure_time = COALESCE(${projectData.speaker_departure_time || null}, speaker_departure_time),
        event_timeline = COALESCE(${projectData.event_timeline || null}, event_timeline),
        event_timezone = COALESCE(${projectData.event_timezone || null}, event_timezone),
        
        -- Technical Requirements
        av_requirements = COALESCE(${projectData.av_requirements || null}, av_requirements),
        recording_allowed = COALESCE(${projectData.recording_allowed !== undefined ? projectData.recording_allowed : null}, recording_allowed),
        recording_purpose = COALESCE(${projectData.recording_purpose || null}, recording_purpose),
        live_streaming = COALESCE(${projectData.live_streaming !== undefined ? projectData.live_streaming : null}, live_streaming),
        photography_allowed = COALESCE(${projectData.photography_allowed !== undefined ? projectData.photography_allowed : null}, photography_allowed),
        tech_rehearsal_date = COALESCE(${projectData.tech_rehearsal_date || null}, tech_rehearsal_date),
        tech_rehearsal_time = COALESCE(${projectData.tech_rehearsal_time || null}, tech_rehearsal_time),
        
        -- Travel & Accommodation
        travel_required = COALESCE(${projectData.travel_required !== undefined ? projectData.travel_required : null}, travel_required),
        fly_in_date = COALESCE(${projectData.fly_in_date || null}, fly_in_date),
        fly_out_date = COALESCE(${projectData.fly_out_date || null}, fly_out_date),
        flight_number_in = COALESCE(${projectData.flight_number_in || null}, flight_number_in),
        flight_number_out = COALESCE(${projectData.flight_number_out || null}, flight_number_out),
        nearest_airport = COALESCE(${projectData.nearest_airport || null}, nearest_airport),
        airport_transport_provided = COALESCE(${projectData.airport_transport_provided !== undefined ? projectData.airport_transport_provided : null}, airport_transport_provided),
        airport_transport_details = COALESCE(${projectData.airport_transport_details || null}, airport_transport_details),
        venue_transport_provided = COALESCE(${projectData.venue_transport_provided !== undefined ? projectData.venue_transport_provided : null}, venue_transport_provided),
        venue_transport_details = COALESCE(${projectData.venue_transport_details || null}, venue_transport_details),
        accommodation_required = COALESCE(${projectData.accommodation_required !== undefined ? projectData.accommodation_required : null}, accommodation_required),
        hotel_name = COALESCE(${projectData.hotel_name || null}, hotel_name),
        hotel_reservation_number = COALESCE(${projectData.hotel_reservation_number || null}, hotel_reservation_number),
        hotel_dates_needed = COALESCE(${projectData.hotel_dates_needed || null}, hotel_dates_needed),
        hotel_tier_preference = COALESCE(${projectData.hotel_tier_preference || null}, hotel_tier_preference),
        guest_list_details = COALESCE(${projectData.guest_list_details || null}, guest_list_details),
        
        -- Speaker Information (Speaker Portal Provided)
        speaker_bio = COALESCE(${projectData.speaker_bio || null}, speaker_bio),
        speaker_headshot = COALESCE(${projectData.speaker_headshot || null}, speaker_headshot),
        speaker_presentation_title = COALESCE(${projectData.speaker_presentation_title || null}, speaker_presentation_title),
        speaker_av_requirements = COALESCE(${projectData.speaker_av_requirements || null}, speaker_av_requirements),
        
        -- Additional Information
        green_room_available = COALESCE(${projectData.green_room_available !== undefined ? projectData.green_room_available : null}, green_room_available),
        meet_greet_opportunities = COALESCE(${projectData.meet_greet_opportunities || null}, meet_greet_opportunities),
        marketing_use_allowed = COALESCE(${projectData.marketing_use_allowed !== undefined ? projectData.marketing_use_allowed : null}, marketing_use_allowed),
        press_media_present = COALESCE(${projectData.press_media_present !== undefined ? projectData.press_media_present : null}, press_media_present),
        media_interview_requests = COALESCE(${projectData.media_interview_requests || null}, media_interview_requests),
        special_requests = COALESCE(${projectData.special_requests || null}, special_requests),
        
        -- Financial Details
        speaker_fee = COALESCE(${projectData.speaker_fee || null}, speaker_fee),
        travel_expenses_type = COALESCE(${projectData.travel_expenses_type || null}, travel_expenses_type),
        travel_expenses_amount = COALESCE(${projectData.travel_expenses_amount || null}, travel_expenses_amount),
        payment_terms = COALESCE(${projectData.payment_terms || null}, payment_terms),
        invoice_number = COALESCE(${projectData.invoice_number || null}, invoice_number),
        purchase_order_number = COALESCE(${projectData.purchase_order_number || null}, purchase_order_number),
        
        -- Confirmation Details
        prep_call_requested = COALESCE(${projectData.prep_call_requested !== undefined ? projectData.prep_call_requested : null}, prep_call_requested),
        prep_call_date = COALESCE(${projectData.prep_call_date || null}, prep_call_date),
        prep_call_time = COALESCE(${projectData.prep_call_time || null}, prep_call_time),
        additional_notes = COALESCE(${projectData.additional_notes || null}, additional_notes),
        
        -- Status Tracking
        contract_signed = COALESCE(${projectData.contract_signed !== undefined ? projectData.contract_signed : null}, contract_signed),
        invoice_sent = COALESCE(${projectData.invoice_sent !== undefined ? projectData.invoice_sent : null}, invoice_sent),
        payment_received = COALESCE(${projectData.payment_received !== undefined ? projectData.payment_received : null}, payment_received),
        presentation_ready = COALESCE(${projectData.presentation_ready !== undefined ? projectData.presentation_ready : null}, presentation_ready),
        materials_sent = COALESCE(${projectData.materials_sent !== undefined ? projectData.materials_sent : null}, materials_sent),
        
        -- Event Classification
        event_classification = COALESCE(${projectData.event_classification || null}, event_classification),
        
        -- Legacy fields (keeping for backward compatibility)
        event_location = COALESCE(${projectData.event_location || null}, event_location),
        event_type = COALESCE(${projectData.event_type || null}, event_type),
        attendee_count = COALESCE(${projectData.attendee_count || null}, attendee_count),
        event_agenda = COALESCE(${projectData.event_agenda || null}, event_agenda),
        marketing_materials = COALESCE(${projectData.marketing_materials || null}, marketing_materials),
        contact_person = COALESCE(${projectData.contact_person || null}, contact_person),
        venue_contact = COALESCE(${projectData.venue_contact || null}, venue_contact),
        
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