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
        d.project_id,
        p.project_name,
        p.budget as project_budget,
        p.speaker_fee,
        p.status as project_status
      FROM deals d
      LEFT JOIN projects p ON p.id = d.project_id
      WHERE d.status = 'won'
      ORDER BY d.won_date DESC
    `
    
    // Transform the data to group projects with deals
    const transformedDeals = deals.map(deal => {
      // Ensure numeric values are properly converted
      const dealValue = Number(deal.deal_value) || 0
      const commissionPercentage = Number(deal.commission_percentage) || 20
      let commissionAmount = Number(deal.commission_amount) || 0
      
      // If commission_amount is 0 or null, calculate it
      if (!commissionAmount && dealValue > 0) {
        commissionAmount = (dealValue * commissionPercentage) / 100
      }
      
      return {
        id: Number(deal.id),
        client_name: deal.client_name,
        client_email: deal.client_email,
        company: deal.company,
        event_title: deal.event_title,
        event_date: deal.event_date,
        deal_value: dealValue,
        commission_percentage: commissionPercentage,
        commission_amount: commissionAmount,
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
      }
    })
    
    // Calculate total for verification
    const totalCommission = transformedDeals.reduce((sum, deal) => sum + deal.commission_amount, 0)
    console.log(`API: Returning ${transformedDeals.length} deals with total commission: $${totalCommission}`)
    
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