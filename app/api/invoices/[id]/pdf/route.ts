import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { requireAdminAuth } from "@/lib/auth-middleware"

const sql = neon(process.env.DATABASE_URL!)

function generateInvoiceHTML(invoice: any): string {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #333;
          line-height: 1.6;
          padding: 40px;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }
        .company-info h1 {
          color: #1e40af;
          font-size: 32px;
          margin-bottom: 8px;
        }
        .company-info p {
          color: #6b7280;
          font-size: 14px;
        }
        .invoice-badge {
          background: #dbeafe;
          color: #1e40af;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 24px;
        }
        .invoice-details {
          text-align: right;
        }
        .invoice-details h2 {
          font-size: 20px;
          color: #111827;
          margin-bottom: 8px;
        }
        .invoice-details p {
          color: #6b7280;
          font-size: 14px;
          margin: 4px 0;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 8px;
        }
        .status-draft { background: #f3f4f6; color: #6b7280; }
        .status-sent { background: #dbeafe; color: #1e40af; }
        .status-paid { background: #d1fae5; color: #065f46; }
        .status-overdue { background: #fee2e2; color: #991b1b; }
        .billing-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin: 40px 0;
        }
        .billing-section h3 {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .billing-section p {
          color: #111827;
          margin: 4px 0;
        }
        .invoice-table {
          width: 100%;
          margin: 40px 0;
        }
        .invoice-table table {
          width: 100%;
          border-collapse: collapse;
        }
        .invoice-table th {
          background: #f9fafb;
          padding: 12px;
          text-align: left;
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #e5e7eb;
        }
        .invoice-table td {
          padding: 16px 12px;
          border-bottom: 1px solid #f3f4f6;
        }
        .invoice-table .amount {
          text-align: right;
          font-weight: 600;
        }
        .invoice-summary {
          margin-top: 40px;
          display: flex;
          justify-content: flex-end;
        }
        .summary-box {
          width: 300px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        .summary-row.total {
          border-top: 2px solid #e5e7eb;
          margin-top: 8px;
          padding-top: 16px;
          font-size: 20px;
          font-weight: bold;
          color: #1e40af;
        }
        .notes-section {
          margin-top: 40px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
        }
        .notes-section h3 {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .notes-section p {
          color: #4b5563;
        }
        .footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #9ca3af;
          font-size: 12px;
        }
        @media print {
          body { padding: 0; }
          .invoice-container { max-width: 100%; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="company-info">
            <h1>Speak About AI</h1>
            <p>Professional Speaking & Consulting Services</p>
            <p>hello@speakabout.ai</p>
          </div>
          <div class="invoice-details">
            <div class="invoice-badge">INVOICE</div>
            <h2>${invoice.invoice_number}</h2>
            <p>Issue Date: ${formatDate(invoice.issue_date)}</p>
            <p>Due Date: ${formatDate(invoice.due_date)}</p>
            ${invoice.payment_date ? `<p>Paid: ${formatDate(invoice.payment_date)}</p>` : ''}
            <div class="status-badge status-${invoice.status}">
              ${invoice.status.toUpperCase()}
            </div>
          </div>
        </div>

        <div class="billing-info">
          <div class="billing-section">
            <h3>Bill To</h3>
            <p><strong>${invoice.client_name}</strong></p>
            ${invoice.company ? `<p>${invoice.company}</p>` : ''}
            <p>${invoice.client_email}</p>
          </div>
          <div class="billing-section">
            <h3>Project Details</h3>
            ${invoice.project_title ? `<p><strong>${invoice.project_title}</strong></p>` : ''}
            ${invoice.event_date ? `<p>Event Date: ${formatDate(invoice.event_date)}</p>` : ''}
            ${invoice.event_location ? `<p>Location: ${invoice.event_location}</p>` : ''}
          </div>
        </div>

        <div class="invoice-table">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Professional Services</strong><br>
                  ${invoice.description || 'Speaking engagement and related services'}
                  ${invoice.notes ? `<br><small style="color: #6b7280">${invoice.notes}</small>` : ''}
                </td>
                <td class="amount">${formatCurrency(parseFloat(invoice.amount))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="invoice-summary">
          <div class="summary-box">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>${formatCurrency(parseFloat(invoice.amount))}</span>
            </div>
            <div class="summary-row total">
              <span>Total Due</span>
              <span>${formatCurrency(parseFloat(invoice.amount))}</span>
            </div>
          </div>
        </div>

        ${invoice.notes ? `
        <div class="notes-section">
          <h3>Notes</h3>
          <p>${invoice.notes}</p>
        </div>
        ` : ''}

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Payment terms: Net 30 days from issue date</p>
          <p>Please reference invoice number ${invoice.invoice_number} with your payment</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function GET(
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

    // Fetch invoice with project details
    const [invoice] = await sql`
      SELECT 
        i.*,
        p.project_name as project_title,
        p.event_date,
        p.event_location,
        p.event_type
      FROM invoices i
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE i.id = ${invoiceId}
    `

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Generate HTML
    const html = generateInvoiceHTML(invoice)

    // Return HTML with appropriate headers for PDF generation
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache',
      }
    })

  } catch (error) {
    console.error("Error generating invoice PDF:", error)
    return NextResponse.json(
      { 
        error: "Failed to generate invoice PDF",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}