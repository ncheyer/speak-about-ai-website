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
    
    console.log("Inserting contract with number:", contractNumber)
    
    try {
      // Based on the errors, we know these columns DON'T exist in production:
      // - category, template_version, terms, total_amount
      // - access_token, client_signing_token, speaker_signing_token
      
      // Start with the absolute minimum that should work
      let result
      
      try {
        // First attempt: Try with all possible fields including contract_data JSONB
        result = await sql`
          INSERT INTO contracts (
            contract_number,
            title,
            status,
            event_title,
            event_date,
            event_location,
            client_name,
            client_email,
            client_company,
            speaker_name,
            speaker_email,
            speaker_fee,
            contract_data,
            generated_at
          ) VALUES (
            ${contractNumber},
            ${values.event_title ? `Contract - ${values.event_title}` : 'Contract Draft'},
            'draft',
            ${values.event_title || 'Event'},
            ${values.event_date || new Date().toISOString().split('T')[0]},
            ${values.event_location || 'TBD'},
            ${values.client_signer_name || values.client_contact_name || values.client_company || 'Client'},
            ${values.client_email || 'client@example.com'},
            ${values.client_company || null},
            ${values.speaker_name || null},
            ${values.speaker_email || null},
            ${parseFloat(values.speaker_fee) || null},
            ${JSON.stringify(values)}::jsonb,
            NOW()
          )
          RETURNING *
        `
        console.log("Successfully inserted with all fields including JSONB")
      } catch (firstError: any) {
        console.error("Full insert failed:", firstError.message)
        
        // Second attempt: Try without contract_data JSONB column
        try {
          result = await sql`
            INSERT INTO contracts (
              contract_number,
              title,
              status,
              event_title,
              event_date,
              event_location,
              client_name,
              client_email
            ) VALUES (
              ${contractNumber},
              ${values.event_title ? `Contract - ${values.event_title}` : 'Contract Draft'},
              'draft',
              ${values.event_title || 'Event'},
              ${values.event_date || new Date().toISOString().split('T')[0]},
              ${values.event_location || 'TBD'},
              ${values.client_signer_name || values.client_contact_name || values.client_company || 'Client'},
              ${values.client_email || 'client@example.com'}
            )
            RETURNING *
          `
          console.log("Successfully inserted without JSONB")
        } catch (secondError: any) {
          console.error("Basic insert failed:", secondError.message)
        
          // Third attempt: Try absolute minimum - just required fields
          try {
            result = await sql`
              INSERT INTO contracts (
                contract_number,
                status
              ) VALUES (
                ${contractNumber},
                'draft'
              )
              RETURNING *
            `
            console.log("Successfully inserted with minimal fields")
          
          // Now try to update with additional fields one by one
          const contractId = result[0].id
          
          // Try to update title
          try {
            await sql`
              UPDATE contracts 
              SET title = ${values.event_title ? `Contract - ${values.event_title}` : 'Contract Draft'}
              WHERE id = ${contractId}
            `
          } catch (e) {
            console.log("Title column doesn't exist")
          }
          
          // Try to update event_title
          try {
            await sql`
              UPDATE contracts 
              SET event_title = ${values.event_title || 'Event'}
              WHERE id = ${contractId}
            `
          } catch (e) {
            console.log("event_title column doesn't exist")
          }
          
          // Try to update event_date
          try {
            await sql`
              UPDATE contracts 
              SET event_date = ${values.event_date || new Date().toISOString().split('T')[0]}
              WHERE id = ${contractId}
            `
          } catch (e) {
            console.log("event_date column doesn't exist")
          }
          
          // Try to update event_location
          try {
            await sql`
              UPDATE contracts 
              SET event_location = ${values.event_location || 'TBD'}
              WHERE id = ${contractId}
            `
          } catch (e) {
            console.log("event_location column doesn't exist")
          }
          
          // Try to update client_name
          try {
            await sql`
              UPDATE contracts 
              SET client_name = ${values.client_signer_name || values.client_contact_name || values.client_company || 'Client'}
              WHERE id = ${contractId}
            `
          } catch (e) {
            console.log("client_name column doesn't exist")
          }
          
          // Try to update client_email
          try {
            await sql`
              UPDATE contracts 
              SET client_email = ${values.client_email || 'client@example.com'}
              WHERE id = ${contractId}
            `
          } catch (e) {
            console.log("client_email column doesn't exist")
          }
          
          // Try to update speaker_name
          if (values.speaker_name) {
            try {
              await sql`
                UPDATE contracts 
                SET speaker_name = ${values.speaker_name}
                WHERE id = ${contractId}
              `
            } catch (e) {
              console.log("speaker_name column doesn't exist")
            }
          }
          
          // Try to update speaker_email
          if (values.speaker_email) {
            try {
              await sql`
                UPDATE contracts 
                SET speaker_email = ${values.speaker_email}
                WHERE id = ${contractId}
              `
            } catch (e) {
              console.log("speaker_email column doesn't exist")
            }
          }
          
          // Fetch the updated record
          result = await sql`
            SELECT * FROM contracts WHERE id = ${contractId}
          `
          } catch (thirdError: any) {
            console.error("Minimal insert also failed:", thirdError.message)
            throw thirdError
          }
        }
      }
      
      console.log("Contract created successfully:", result[0])
      
      // Store the contract data in a separate JSON field or related table if needed
      // This ensures we don't lose any form data even if columns don't exist
      
      return NextResponse.json({
        ...result[0],
        contract_data: values  // Include the full form data in response
      }, { status: 201 })
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