import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    // Get all won deals with their associated projects
    const deals = await sql`
      SELECT 
        d.*,
        d.commission_percentage,
        d.commission_amount,
        d.payment_status,
        d.payment_date,
        d.invoice_number,
        d.financial_notes,
        d.contract_link,
        d.invoice_link_1,
        d.invoice_link_2,
        d.contract_signed_date,
        d.invoice_1_sent_date,
        d.invoice_2_sent_date,
        p.id as project_id,
        p.project_name,
        p.budget as project_budget,
        p.speaker_fee,
        p.status as project_status
      FROM deals d
      LEFT JOIN projects p ON p.client_email = d.client_email 
        AND p.event_date = d.event_date
      WHERE d.status = 'won'
      ORDER BY d.won_date DESC
    `
    
    // Transform the data to group projects with deals
    const transformedDeals = deals.map(deal => ({
      id: deal.id,
      client_name: deal.client_name,
      client_email: deal.client_email,
      company: deal.company,
      event_title: deal.event_title,
      event_date: deal.event_date,
      deal_value: deal.deal_value,
      commission_percentage: deal.commission_percentage || 20, // Default 20%
      commission_amount: deal.commission_amount,
      payment_status: deal.payment_status || 'pending',
      payment_date: deal.payment_date,
      invoice_number: deal.invoice_number,
      notes: deal.financial_notes,
      won_date: deal.won_date,
      contract_link: deal.contract_link,
      invoice_link_1: deal.invoice_link_1,
      invoice_link_2: deal.invoice_link_2,
      contract_signed_date: deal.contract_signed_date,
      invoice_1_sent_date: deal.invoice_1_sent_date,
      invoice_2_sent_date: deal.invoice_2_sent_date,
      project: deal.project_id ? {
        id: deal.project_id,
        project_name: deal.project_name,
        budget: deal.project_budget,
        speaker_fee: deal.speaker_fee,
        status: deal.project_status
      } : null
    }))
    
    return NextResponse.json({ 
      deals: transformedDeals,
      success: true 
    })
    
  } catch (error) {
    console.error('Error fetching financial data:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch financial data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}