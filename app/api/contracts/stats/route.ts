import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const db = getDb()
    
    // Get contract statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft,
        COUNT(CASE WHEN status = 'sent' OR status = 'sent_for_signature' THEN 1 END) as sent,
        COUNT(CASE WHEN status = 'partially_signed' THEN 1 END) as partially_signed,
        COUNT(CASE WHEN status = 'fully_executed' THEN 1 END) as fully_executed,
        COALESCE(SUM(
          CASE 
            WHEN financial_terms IS NOT NULL 
            THEN (financial_terms->>'fee')::numeric 
            ELSE 0 
          END
        ), 0) as total_value
      FROM contracts
    `
    
    const result = await db.query(statsQuery)
    const stats = result.rows[0]
    
    return NextResponse.json({
      total: parseInt(stats.total) || 0,
      draft: parseInt(stats.draft) || 0,
      sent: parseInt(stats.sent) || 0,
      partially_signed: parseInt(stats.partially_signed) || 0,
      fully_executed: parseInt(stats.fully_executed) || 0,
      total_value: parseFloat(stats.total_value) || 0
    })
  } catch (error) {
    console.error("Error fetching contract stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch contract statistics" },
      { status: 500 }
    )
  }
}