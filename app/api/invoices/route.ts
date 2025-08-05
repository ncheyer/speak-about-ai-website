import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { requireAdminAuth } from "@/lib/auth-middleware"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const invoices = await sql`
      SELECT 
        i.*,
        p.event_title as project_title,
        p.client_name
      FROM invoices i
      LEFT JOIN projects p ON i.project_id = p.id
      ORDER BY i.created_at DESC
    `

    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Invoices API error:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch invoices",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const body = await request.json()
    
    // Validate required fields
    if (!body.project_id || !body.amount) {
      return NextResponse.json(
        { error: "project_id and amount are required" },
        { status: 400 }
      )
    }

    // Generate invoice number
    const invoiceCount = await sql`SELECT COUNT(*) as count FROM invoices`
    const invoiceNumber = `INV-${String(Date.now()).slice(-6)}-${String(invoiceCount[0].count + 1).padStart(3, '0')}`

    const result = await sql`
      INSERT INTO invoices (
        project_id,
        invoice_number,
        amount,
        status,
        issue_date,
        due_date,
        notes
      ) VALUES (
        ${body.project_id},
        ${invoiceNumber},
        ${body.amount},
        ${body.status || 'draft'},
        ${new Date().toISOString()},
        ${body.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()},
        ${body.notes || ''}
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Create invoice error:", error)
    return NextResponse.json(
      { 
        error: "Failed to create invoice",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}