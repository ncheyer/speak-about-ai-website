import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Generate contract number
function generateContractNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `CTR-${date}-${random}`
}

// Generate secure token
function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Simple contract creation - body:", JSON.stringify(body, null, 2))
    
    // Check database availability
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }
    
    const sql = neon(process.env.DATABASE_URL)
    
    // Extract values from the template data
    const values = body.values || {}
    const contractNumber = generateContractNumber()
    const clientSigningToken = generateSecureToken(40)
    const speakerSigningToken = generateSecureToken(40)
    const accessToken = generateSecureToken(40)
    
    // Set expiration date (90 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 90)
    
    // Build contract content from template values
    const contractContent = JSON.stringify(values)
    
    console.log("Inserting contract with number:", contractNumber)
    
    try {
      // Build party objects in JSONB format
      const agencyParty = {
        name: values.agent_name || 'Speak About AI',
        email: values.agency_email || 'contracts@speakaboutai.com',
        role: values.agency_signer_title || 'Representative',
        company: 'Speak About AI, a division of Strong Entertainment, LLC'
      }
      
      const speakerParty = values.speaker_name ? {
        name: values.speaker_name,
        email: values.speaker_email || '',
        role: 'Speaker',
        company: ''
      } : null
      
      const clientParty = {
        name: values.client_signer_name || values.client_contact_name || 'Client',
        email: values.client_email || 'client@example.com',
        role: values.client_signer_title || 'Representative',
        company: values.client_company || 'Client Company'
      }
      
      const eventDetails = {
        title: values.event_title || 'Event',
        date: values.event_date || new Date().toISOString(),
        location: values.event_location || 'TBD',
        type: values.event_type || 'conference',
        attendees: parseInt(values.attendee_count) || 0
      }
      
      const financialTerms = {
        fee: parseFloat(values.speaker_fee) || 0,
        payment_terms: values.payment_terms || 'Net 30 days',
        currency: 'USD',
        travel_stipend: parseFloat(values.travel_stipend) || 0
      }
      
      // Insert the contract using the v2 table structure
      const result = await sql`
        INSERT INTO contracts (
          contract_number,
          type,
          category,
          template_id,
          title,
          status,
          agency_party,
          speaker_party,
          client_party,
          event_details,
          financial_terms,
          terms_and_conditions,
          created_by,
          metadata
        ) VALUES (
          ${contractNumber},
          ${body.type || 'client_speaker'},
          ${body.category || 'external'},
          ${null}, -- template_id can be null for now
          ${values.event_title ? `Contract - ${values.event_title}` : 'Contract Draft'},
          'draft',
          ${JSON.stringify(agencyParty)},
          ${speakerParty ? JSON.stringify(speakerParty) : null},
          ${JSON.stringify(clientParty)},
          ${JSON.stringify(eventDetails)},
          ${JSON.stringify(financialTerms)},
          ${contractContent},
          ${body.created_by || 'admin'},
          ${JSON.stringify(values)}
        )
        RETURNING *
      `
      
      console.log("Contract created successfully:", result[0].id)
      
      return NextResponse.json(result[0], { status: 201 })
    } catch (dbError: any) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        { 
          error: "Database error", 
          details: dbError.message,
          code: dbError.code,
          hint: dbError.hint
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Error in simple contract creation:", error)
    return NextResponse.json(
      { 
        error: "Failed to create contract", 
        details: error.message 
      },
      { status: 500 }
    )
  }
}