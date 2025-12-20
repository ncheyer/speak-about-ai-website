import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const result = await sql`
      SELECT fo.*, d.event_title as deal_title, d.company as deal_company, d.speaker_requested as speaker_name
      FROM firm_offers fo
      LEFT JOIN deals d ON fo.id = d.firm_offer_id
      ORDER BY fo.created_at DESC
    `
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching firm offers:", error)
    return NextResponse.json({ error: "Failed to fetch firm offers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const accessToken = uuidv4().replace(/-/g, '').slice(0, 32)

    // Build JSONB objects for each section
    const eventOverview = {
      event_classification: data.event_classification || 'travel',
      company_name: data.company_name || '',
      end_client_name: data.end_client_name || '',
      event_name: data.event_name || '',
      event_date: data.event_date || '',
      event_location: data.event_location || '',
      event_website: data.event_website || '',
      billing_contact: {
        name: data.billing_contact_name || '',
        title: data.billing_contact_title || '',
        email: data.billing_contact_email || '',
        phone: data.billing_contact_phone || '',
        address: data.billing_address || ''
      },
      logistics_contact: {
        name: data.logistics_contact_name || '',
        email: data.logistics_contact_email || '',
        phone: data.logistics_contact_phone || ''
      }
    }

    const speakerProgram = {
      speaker_name: data.speaker_name || '',
      program_topic: data.program_topic || '',
      program_type: data.program_type || 'keynote',
      audience_size: data.audience_size ? parseInt(data.audience_size) : null,
      audience_demographics: data.audience_demographics || '',
      speaker_attire: data.speaker_attire || 'business_casual'
    }

    const eventSchedule = {
      event_start_time: data.event_start_time || '',
      event_end_time: data.event_end_time || '',
      speaker_arrival_time: data.speaker_arrival_time || '',
      program_start_time: data.program_start_time || '',
      program_length_minutes: data.program_length_minutes ? parseInt(data.program_length_minutes) : null,
      qa_length_minutes: data.qa_length_minutes ? parseInt(data.qa_length_minutes) : null,
      timezone: data.timezone || 'America/Los_Angeles'
    }

    const technicalRequirements = {
      recording_allowed: data.recording_allowed || false,
      recording_purpose: data.recording_purpose || '',
      live_streaming: data.live_streaming || false,
      photography_allowed: data.photography_allowed || false
    }

    const travelAccommodation = {
      fly_in_date: data.fly_in_date || '',
      fly_out_date: data.fly_out_date || '',
      nearest_airport: data.nearest_airport || '',
      airport_transport_provided: data.airport_transport_provided || false,
      hotel_name: data.hotel_name || '',
      hotel_dates_needed: data.hotel_dates_needed || ''
    }

    const financialDetails = {
      speaker_fee: data.speaker_fee ? parseFloat(data.speaker_fee) : null,
      travel_expenses_type: data.travel_expenses_type || 'flat_buyout',
      travel_expenses_amount: data.travel_expenses_amount ? parseFloat(data.travel_expenses_amount) : null,
      payment_terms: data.payment_terms || 'net_30'
    }

    const additionalInfo = {
      green_room_available: data.green_room_available || false,
      special_requests: data.additional_notes || ''
    }

    const confirmation = {
      prep_call_requested: data.prep_call_requested || false
    }

    const result = await sql`
      INSERT INTO firm_offers (
        status,
        speaker_access_token,
        event_overview,
        speaker_program,
        event_schedule,
        technical_requirements,
        travel_accommodation,
        additional_info,
        financial_details,
        confirmation,
        created_at,
        updated_at
      ) VALUES (
        'draft',
        ${accessToken},
        ${JSON.stringify(eventOverview)},
        ${JSON.stringify(speakerProgram)},
        ${JSON.stringify(eventSchedule)},
        ${JSON.stringify(technicalRequirements)},
        ${JSON.stringify(travelAccommodation)},
        ${JSON.stringify(additionalInfo)},
        ${JSON.stringify(financialDetails)},
        ${JSON.stringify(confirmation)},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    // Update the deal with the firm offer id
    if (data.deal_id) {
      await sql`
        UPDATE deals SET firm_offer_id = ${result[0].id}, updated_at = NOW()
        WHERE id = ${data.deal_id}
      `
    }

    return NextResponse.json({
      ...result[0],
      share_url: `/firm-offer/${accessToken}`
    })
  } catch (error) {
    console.error("Error creating firm offer:", error)
    return NextResponse.json({ error: "Failed to create firm offer" }, { status: 500 })
  }
}
