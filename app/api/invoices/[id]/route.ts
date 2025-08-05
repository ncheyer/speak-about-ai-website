import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { requireAdminAuth } from "@/lib/auth-middleware"

const sql = neon(process.env.DATABASE_URL!)

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const { id } = await params
    const invoiceId = parseInt(id)
    
    if (isNaN(invoiceId)) {
      return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 })
    }

    const body = await request.json()
    const { status, paid_date } = body

    // Validate status
    const validStatuses = ["draft", "sent", "paid", "overdue", "cancelled"]
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: "Invalid status. Must be one of: draft, sent, paid, overdue, cancelled" 
      }, { status: 400 })
    }

    // Check if invoice exists
    const [invoice] = await sql`
      SELECT id FROM invoices WHERE id = ${invoiceId}
    `

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Update invoice
    let updateQuery
    if (status === "paid" && paid_date) {
      updateQuery = sql`
        UPDATE invoices 
        SET 
          status = ${status},
          paid_date = ${paid_date},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${invoiceId}
        RETURNING *
      `
    } else {
      updateQuery = sql`
        UPDATE invoices 
        SET 
          status = ${status},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${invoiceId}
        RETURNING *
      `
    }

    const [updatedInvoice] = await updateQuery

    return NextResponse.json(updatedInvoice)

  } catch (error) {
    console.error("Error updating invoice:", error)
    return NextResponse.json(
      { 
        error: "Failed to update invoice",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    const authError = requireAdminAuth(request)
    if (authError) return authError

    const { id } = await params
    const invoiceId = parseInt(id)
    
    if (isNaN(invoiceId)) {
      return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 })
    }

    // Check if invoice exists
    const [invoice] = await sql`
      SELECT id FROM invoices WHERE id = ${invoiceId}
    `

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Delete the invoice
    await sql`DELETE FROM invoices WHERE id = ${invoiceId}`

    return NextResponse.json({ 
      success: true, 
      message: "Invoice deleted successfully" 
    })

  } catch (error) {
    console.error("Error deleting invoice:", error)
    return NextResponse.json(
      { 
        error: "Failed to delete invoice",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}