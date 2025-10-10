import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const payload = await request.json()

    const { event, data } = payload

    // Validate webhook
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.KONDO_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      })
    }

    console.log('Kondo webhook received:', event.type, data.contact_first_name, data.contact_last_name)

    // Map Kondo labels to deal priority and status
    const labels = data.kondo_labels?.map((l: any) => l.kondo_label_name) || []

    let dealStatus: string = 'lead'
    let priority: string = 'medium'

    if (labels.includes('SQL')) dealStatus = 'negotiation'
    else if (labels.includes('MQL - High')) { dealStatus = 'qualified'; priority = 'high' }
    else if (labels.includes('MQL - Medium')) { dealStatus = 'qualified'; priority = 'medium' }
    else if (labels.includes('MQL - Low')) { dealStatus = 'qualified'; priority = 'low' }
    else if (labels.includes('Disqualified')) dealStatus = 'lost'

    // Upsert Kondo contact
    await sql`
      INSERT INTO kondo_contacts (
        kondo_id,
        first_name,
        last_name,
        email,
        linkedin_url,
        linkedin_uid,
        headline,
        location,
        picture_url,
        conversation_status,
        conversation_state,
        latest_message,
        latest_message_at,
        kondo_url,
        kondo_note,
        labels,
        raw_data,
        created_at,
        updated_at
      ) VALUES (
        ${data.contact_linkedin_uid},
        ${data.contact_first_name},
        ${data.contact_last_name},
        ${event.email},
        ${data.contact_linkedin_url},
        ${data.contact_linkedin_uid},
        ${data.contact_headline},
        ${data.contact_location},
        ${data.contact_picture},
        ${data.conversation_status},
        ${data.conversation_state},
        ${data.conversation_latest_content},
        ${data.conversation_latest_timestamp ? new Date(data.conversation_latest_timestamp) : null},
        ${data.kondo_url},
        ${data.kondo_note},
        ${JSON.stringify(data.kondo_labels)},
        ${JSON.stringify(payload)},
        NOW(),
        NOW()
      )
      ON CONFLICT (kondo_id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        email = EXCLUDED.email,
        linkedin_url = EXCLUDED.linkedin_url,
        headline = EXCLUDED.headline,
        location = EXCLUDED.location,
        picture_url = EXCLUDED.picture_url,
        conversation_status = EXCLUDED.conversation_status,
        conversation_state = EXCLUDED.conversation_state,
        latest_message = EXCLUDED.latest_message,
        latest_message_at = EXCLUDED.latest_message_at,
        kondo_url = EXCLUDED.kondo_url,
        kondo_note = EXCLUDED.kondo_note,
        labels = EXCLUDED.labels,
        raw_data = EXCLUDED.raw_data,
        updated_at = NOW()
      RETURNING id
    `

    // Check if this contact should create/update a deal
    const shouldCreateDeal = labels.some((l: string) =>
      ['SQL', 'MQL - High', 'MQL - Medium', 'MQL - Low', 'Client'].includes(l)
    )

    if (shouldCreateDeal) {
      // Check if deal already exists for this contact
      const existingDeal = await sql`
        SELECT id FROM deals
        WHERE client_email = ${event.email}
        OR (client_name = ${data.contact_first_name + ' ' + data.contact_last_name} AND company = ${data.contact_headline?.split(' at ')[1] || ''})
        LIMIT 1
      `

      if (existingDeal.length > 0) {
        // Update existing deal
        await sql`
          UPDATE deals SET
            status = ${dealStatus},
            priority = ${priority},
            notes = COALESCE(notes, '') || E'\n\nKondo Update: ' || ${data.conversation_latest_content || 'No message'},
            last_contact = ${data.conversation_latest_timestamp ? new Date(data.conversation_latest_timestamp) : new Date()},
            updated_at = NOW()
          WHERE id = ${existingDeal[0].id}
        `
      } else {
        // Create new deal
        const company = data.contact_headline?.split(' at ')[1]?.trim() || 'Unknown Company'

        await sql`
          INSERT INTO deals (
            client_name,
            client_email,
            company,
            event_title,
            event_date,
            event_location,
            event_type,
            attendee_count,
            deal_value,
            budget_range,
            status,
            priority,
            source,
            notes,
            last_contact,
            created_at,
            updated_at
          ) VALUES (
            ${data.contact_first_name + ' ' + data.contact_last_name},
            ${event.email},
            ${company},
            ${'Potential Event - ' + company},
            ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()},
            ${data.contact_location || 'TBD'},
            'Conference',
            100,
            25000,
            '$20k-$30k',
            ${dealStatus},
            ${priority},
            'kondo_linkedin',
            ${data.conversation_latest_content || 'Contact from Kondo LinkedIn integration'},
            ${data.conversation_latest_timestamp ? new Date(data.conversation_latest_timestamp) : new Date()},
            NOW(),
            NOW()
          )
        `
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      shouldCreateDeal
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })

  } catch (error) {
    console.error('Kondo webhook error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
}
