import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// GET: Get single firm offer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const [offer] = await sql`
      SELECT fo.*, p.title as proposal_title, p.client_name, p.client_email,
             p.speakers, p.event_title, p.event_date, p.total_investment
      FROM firm_offers fo
      JOIN proposals p ON p.id = fo.proposal_id
      WHERE fo.id = ${id}
    `

    if (!offer) {
      return NextResponse.json(
        { error: 'Firm offer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(offer)
  } catch (error) {
    console.error('Error fetching firm offer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch firm offer' },
      { status: 500 }
    )
  }
}

// PATCH: Update firm offer
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Build dynamic update query
    const updates: string[] = []
    const values: any[] = []

    if (body.status !== undefined) {
      updates.push('status')
      values.push(body.status)

      // Set timestamps based on status
      if (body.status === 'submitted') {
        updates.push('submitted_at')
        values.push(new Date().toISOString())
      } else if (body.status === 'sent_to_speaker') {
        updates.push('sent_to_speaker_at')
        values.push(new Date().toISOString())
      }
    }

    if (body.event_overview !== undefined) {
      updates.push('event_overview')
      values.push(JSON.stringify(body.event_overview))
    }
    if (body.speaker_program !== undefined) {
      updates.push('speaker_program')
      values.push(JSON.stringify(body.speaker_program))
    }
    if (body.event_schedule !== undefined) {
      updates.push('event_schedule')
      values.push(JSON.stringify(body.event_schedule))
    }
    if (body.technical_requirements !== undefined) {
      updates.push('technical_requirements')
      values.push(JSON.stringify(body.technical_requirements))
    }
    if (body.travel_accommodation !== undefined) {
      updates.push('travel_accommodation')
      values.push(JSON.stringify(body.travel_accommodation))
    }
    if (body.additional_info !== undefined) {
      updates.push('additional_info')
      values.push(JSON.stringify(body.additional_info))
    }
    if (body.financial_details !== undefined) {
      updates.push('financial_details')
      values.push(JSON.stringify(body.financial_details))
    }
    if (body.confirmation !== undefined) {
      updates.push('confirmation')
      values.push(JSON.stringify(body.confirmation))
    }
    if (body.speaker_notes !== undefined) {
      updates.push('speaker_notes')
      values.push(body.speaker_notes)
    }
    if (body.speaker_confirmed !== undefined) {
      updates.push('speaker_confirmed')
      values.push(body.speaker_confirmed)
      updates.push('speaker_response_at')
      values.push(new Date().toISOString())
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    // Use tagged template literal for Neon
    const [updated] = await sql`
      UPDATE firm_offers
      SET
        status = COALESCE(${body.status}, status),
        event_overview = COALESCE(${body.event_overview ? JSON.stringify(body.event_overview) : null}::jsonb, event_overview),
        speaker_program = COALESCE(${body.speaker_program ? JSON.stringify(body.speaker_program) : null}::jsonb, speaker_program),
        event_schedule = COALESCE(${body.event_schedule ? JSON.stringify(body.event_schedule) : null}::jsonb, event_schedule),
        technical_requirements = COALESCE(${body.technical_requirements ? JSON.stringify(body.technical_requirements) : null}::jsonb, technical_requirements),
        travel_accommodation = COALESCE(${body.travel_accommodation ? JSON.stringify(body.travel_accommodation) : null}::jsonb, travel_accommodation),
        additional_info = COALESCE(${body.additional_info ? JSON.stringify(body.additional_info) : null}::jsonb, additional_info),
        financial_details = COALESCE(${body.financial_details ? JSON.stringify(body.financial_details) : null}::jsonb, financial_details),
        confirmation = COALESCE(${body.confirmation ? JSON.stringify(body.confirmation) : null}::jsonb, confirmation),
        speaker_notes = COALESCE(${body.speaker_notes}, speaker_notes),
        speaker_confirmed = COALESCE(${body.speaker_confirmed}, speaker_confirmed),
        submitted_at = CASE WHEN ${body.status} = 'submitted' THEN CURRENT_TIMESTAMP ELSE submitted_at END,
        sent_to_speaker_at = CASE WHEN ${body.status} = 'sent_to_speaker' THEN CURRENT_TIMESTAMP ELSE sent_to_speaker_at END,
        speaker_response_at = CASE WHEN ${body.speaker_confirmed} IS NOT NULL THEN CURRENT_TIMESTAMP ELSE speaker_response_at END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (!updated) {
      return NextResponse.json(
        { error: 'Firm offer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating firm offer:', error)
    return NextResponse.json(
      { error: 'Failed to update firm offer', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE: Delete firm offer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const [deleted] = await sql`
      DELETE FROM firm_offers
      WHERE id = ${id}
      RETURNING id
    `

    if (!deleted) {
      return NextResponse.json(
        { error: 'Firm offer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, id: deleted.id })
  } catch (error) {
    console.error('Error deleting firm offer:', error)
    return NextResponse.json(
      { error: 'Failed to delete firm offer' },
      { status: 500 }
    )
  }
}
