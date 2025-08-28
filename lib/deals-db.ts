import { neon } from "@neondatabase/serverless"

// Lazy initialize Neon client to avoid build-time errors
let sql: any = null
let databaseAvailable = false
let initialized = false

function initializeDatabase() {
  if (initialized) return
  initialized = true
  
  try {
    if (process.env.DATABASE_URL) {
      console.log("Deals DB: Initializing Neon client...")
      sql = neon(process.env.DATABASE_URL)
      databaseAvailable = true
      console.log("Deals DB: Neon client initialized successfully")
    } else {
      console.warn("DATABASE_URL environment variable is not set - deals database unavailable")
    }
  } catch (error) {
    console.error("Failed to initialize Neon client for deals:", error)
  }
}

export interface Deal {
  id: number
  client_name: string
  client_email: string
  client_phone: string
  company: string
  event_title: string
  event_date: string
  event_location: string
  event_type: string
  speaker_id?: number
  speaker_requested?: string
  attendee_count: number
  budget_range: string
  deal_value: number
  status: "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
  priority: "low" | "medium" | "high" | "urgent"
  source: string
  notes: string
  created_at: string
  last_contact: string
  next_follow_up?: string
  updated_at: string
  // Travel fields
  travel_required?: boolean
  flight_required?: boolean
  hotel_required?: boolean
  travel_stipend?: number
  travel_notes?: string
}

export async function getAllDeals(): Promise<Deal[]> {
  initializeDatabase()
  if (!databaseAvailable || !sql) {
    console.warn("getAllDeals: Database not available")
    return []
  }
  
  try {
    console.log("Fetching all deals from database...")
    const deals = await sql`
      SELECT * FROM deals 
      ORDER BY created_at DESC
    `
    console.log(`Successfully fetched ${deals.length} deals`)
    return deals as Deal[]
  } catch (error) {
    console.error("Error fetching deals:", error)

    // Check if it's a table doesn't exist error
    if (error instanceof Error && error.message.includes('relation "deals" does not exist')) {
      console.error("The deals table doesn't exist. Please run the create-deals-table.sql script.")
      throw new Error("Database table 'deals' does not exist. Please run the setup script.")
    }

    throw error
  }
}

export async function getDealById(id: number): Promise<Deal | null> {
  initializeDatabase()
  if (!databaseAvailable || !sql) {
    console.warn("getDealById: Database not available")
    return null
  }
  
  try {
    console.log("Fetching deal by ID:", id)
    const [deal] = await sql`
      SELECT * FROM deals 
      WHERE id = ${id}
    `
    return deal as Deal || null
  } catch (error) {
    console.error("Error fetching deal by ID:", error)
    return null
  }
}

export async function createDeal(dealData: Omit<Deal, "id" | "created_at" | "updated_at">): Promise<Deal | null> {
  initializeDatabase()
  if (!databaseAvailable || !sql) {
    console.warn("createDeal: Database not available")
    return null
  }
  try {
    console.log("Creating new deal:", dealData.event_title)
    const [deal] = await sql`
      INSERT INTO deals (
        client_name, client_email, client_phone, company,
        event_title, event_date, event_location, event_type,
        speaker_requested, attendee_count, budget_range, deal_value,
        status, priority, source, notes, last_contact, next_follow_up,
        travel_required, flight_required, hotel_required, travel_stipend, travel_notes
      ) VALUES (
        ${dealData.client_name}, ${dealData.client_email}, ${dealData.client_phone}, ${dealData.company},
        ${dealData.event_title}, ${dealData.event_date}, ${dealData.event_location}, ${dealData.event_type},
        ${dealData.speaker_requested || null}, ${dealData.attendee_count}, ${dealData.budget_range}, ${dealData.deal_value},
        ${dealData.status}, ${dealData.priority}, ${dealData.source}, ${dealData.notes}, 
        ${dealData.last_contact}, ${dealData.next_follow_up || null},
        ${dealData.travel_required || false}, ${dealData.flight_required || false}, 
        ${dealData.hotel_required || false}, ${dealData.travel_stipend || 0}, ${dealData.travel_notes || null}
      )
      RETURNING *
    `
    console.log("Successfully created deal with ID:", deal.id)
    return deal as Deal
  } catch (error) {
    console.error("Error creating deal:", error)
    return null
  }
}

export async function updateDeal(id: number, dealData: Partial<Deal>): Promise<Deal | null> {
  initializeDatabase()
  if (!databaseAvailable || !sql) {
    console.warn("updateDeal: Database not available")
    return null
  }
  try {
    console.log("Updating deal ID:", id)
    console.log("Update data received:", JSON.stringify(dealData, null, 2))
    const [deal] = await sql`
      UPDATE deals SET
        client_name = COALESCE(${dealData.client_name || null}, client_name),
        client_email = COALESCE(${dealData.client_email || null}, client_email),
        client_phone = COALESCE(${dealData.client_phone || null}, client_phone),
        company = COALESCE(${dealData.company || null}, company),
        event_title = COALESCE(${dealData.event_title || null}, event_title),
        event_date = COALESCE(${dealData.event_date || null}, event_date),
        event_location = COALESCE(${dealData.event_location || null}, event_location),
        event_type = COALESCE(${dealData.event_type || null}, event_type),
        speaker_requested = COALESCE(${dealData.speaker_requested || null}, speaker_requested),
        attendee_count = COALESCE(${dealData.attendee_count || null}, attendee_count),
        budget_range = COALESCE(${dealData.budget_range || null}, budget_range),
        deal_value = COALESCE(${dealData.deal_value || null}, deal_value),
        status = COALESCE(${dealData.status || null}, status),
        priority = COALESCE(${dealData.priority || null}, priority),
        source = COALESCE(${dealData.source || null}, source),
        notes = COALESCE(${dealData.notes || null}, notes),
        last_contact = COALESCE(${dealData.last_contact || null}, last_contact),
        next_follow_up = COALESCE(${dealData.next_follow_up || null}, next_follow_up),
        travel_required = ${dealData.travel_required !== undefined ? dealData.travel_required : sql`travel_required`},
        flight_required = ${dealData.flight_required !== undefined ? dealData.flight_required : sql`flight_required`},
        hotel_required = ${dealData.hotel_required !== undefined ? dealData.hotel_required : sql`hotel_required`},
        travel_stipend = ${dealData.travel_stipend !== undefined ? dealData.travel_stipend : sql`travel_stipend`},
        travel_notes = COALESCE(${dealData.travel_notes || null}, travel_notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    console.log("Successfully updated deal ID:", id)
    return deal as Deal
  } catch (error) {
    console.error("Error updating deal:", error)
    return null
  }
}

export async function deleteDeal(id: number): Promise<boolean> {
  initializeDatabase()
  if (!databaseAvailable || !sql) {
    console.warn("deleteDeal: Database not available")
    return false
  }
  try {
    console.log("Deleting deal ID:", id)
    await sql`DELETE FROM deals WHERE id = ${id}`
    console.log("Successfully deleted deal ID:", id)
    return true
  } catch (error) {
    console.error("Error deleting deal:", error)
    return false
  }
}

export async function getDealsByStatus(status: string): Promise<Deal[]> {
  initializeDatabase()
  if (!databaseAvailable || !sql) {
    console.warn("getDealsByStatus: Database not available")
    return []
  }
  try {
    console.log("Fetching deals by status:", status)
    const deals = await sql`
      SELECT * FROM deals 
      WHERE status = ${status}
      ORDER BY created_at DESC
    `
    console.log(`Found ${deals.length} deals with status: ${status}`)
    return deals as Deal[]
  } catch (error) {
    console.error("Error fetching deals by status:", error)
    return []
  }
}

export async function searchDeals(searchTerm: string): Promise<Deal[]> {
  initializeDatabase()
  if (!databaseAvailable || !sql) {
    console.warn("searchDeals: Database not available")
    return []
  }
  try {
    console.log("Searching deals for term:", searchTerm)
    const deals = await sql`
      SELECT * FROM deals 
      WHERE 
        client_name ILIKE ${"%" + searchTerm + "%"} OR
        company ILIKE ${"%" + searchTerm + "%"} OR
        event_title ILIKE ${"%" + searchTerm + "%"}
      ORDER BY created_at DESC
    `
    console.log(`Found ${deals.length} deals matching search term: ${searchTerm}`)
    return deals as Deal[]
  } catch (error) {
    console.error("Error searching deals:", error)
    return []
  }
}

// Test connection function
export async function testConnection(): Promise<boolean> {
  initializeDatabase()
  if (!databaseAvailable || !sql) {
    return false
  }
  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}
