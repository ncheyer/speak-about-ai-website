import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

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
}

export async function getAllDeals(): Promise<Deal[]> {
  try {
    const deals = await sql`
      SELECT * FROM deals 
      ORDER BY created_at DESC
    `
    return deals as Deal[]
  } catch (error) {
    console.error("Error fetching deals:", error)
    return []
  }
}

export async function createDeal(dealData: Omit<Deal, "id" | "created_at" | "updated_at">): Promise<Deal | null> {
  try {
    const [deal] = await sql`
      INSERT INTO deals (
        client_name, client_email, client_phone, company,
        event_title, event_date, event_location, event_type,
        speaker_requested, attendee_count, budget_range, deal_value,
        status, priority, source, notes, last_contact, next_follow_up
      ) VALUES (
        ${dealData.client_name}, ${dealData.client_email}, ${dealData.client_phone}, ${dealData.company},
        ${dealData.event_title}, ${dealData.event_date}, ${dealData.event_location}, ${dealData.event_type},
        ${dealData.speaker_requested}, ${dealData.attendee_count}, ${dealData.budget_range}, ${dealData.deal_value},
        ${dealData.status}, ${dealData.priority}, ${dealData.source}, ${dealData.notes}, 
        ${dealData.last_contact}, ${dealData.next_follow_up}
      )
      RETURNING *
    `
    return deal as Deal
  } catch (error) {
    console.error("Error creating deal:", error)
    return null
  }
}

export async function updateDeal(id: number, dealData: Partial<Deal>): Promise<Deal | null> {
  try {
    const [deal] = await sql`
      UPDATE deals SET
        client_name = COALESCE(${dealData.client_name}, client_name),
        client_email = COALESCE(${dealData.client_email}, client_email),
        client_phone = COALESCE(${dealData.client_phone}, client_phone),
        company = COALESCE(${dealData.company}, company),
        event_title = COALESCE(${dealData.event_title}, event_title),
        event_date = COALESCE(${dealData.event_date}, event_date),
        event_location = COALESCE(${dealData.event_location}, event_location),
        event_type = COALESCE(${dealData.event_type}, event_type),
        speaker_requested = COALESCE(${dealData.speaker_requested}, speaker_requested),
        attendee_count = COALESCE(${dealData.attendee_count}, attendee_count),
        budget_range = COALESCE(${dealData.budget_range}, budget_range),
        deal_value = COALESCE(${dealData.deal_value}, deal_value),
        status = COALESCE(${dealData.status}, status),
        priority = COALESCE(${dealData.priority}, priority),
        source = COALESCE(${dealData.source}, source),
        notes = COALESCE(${dealData.notes}, notes),
        last_contact = COALESCE(${dealData.last_contact}, last_contact),
        next_follow_up = COALESCE(${dealData.next_follow_up}, next_follow_up),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return deal as Deal
  } catch (error) {
    console.error("Error updating deal:", error)
    return null
  }
}

export async function deleteDeal(id: number): Promise<boolean> {
  try {
    await sql`DELETE FROM deals WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Error deleting deal:", error)
    return false
  }
}

export async function getDealsByStatus(status: string): Promise<Deal[]> {
  try {
    const deals = await sql`
      SELECT * FROM deals 
      WHERE status = ${status}
      ORDER BY created_at DESC
    `
    return deals as Deal[]
  } catch (error) {
    console.error("Error fetching deals by status:", error)
    return []
  }
}

export async function searchDeals(searchTerm: string): Promise<Deal[]> {
  try {
    const deals = await sql`
      SELECT * FROM deals 
      WHERE 
        client_name ILIKE ${"%" + searchTerm + "%"} OR
        company ILIKE ${"%" + searchTerm + "%"} OR
        event_title ILIKE ${"%" + searchTerm + "%"}
      ORDER BY created_at DESC
    `
    return deals as Deal[]
  } catch (error) {
    console.error("Error searching deals:", error)
    return []
  }
}
