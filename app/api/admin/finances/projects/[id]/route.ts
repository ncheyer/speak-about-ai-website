import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const body = await request.json()
    const sql = neon(process.env.DATABASE_URL!)
    
    const {
      budget,
      speaker_fee,
      actual_revenue,
      commission_percentage,
      commission_amount,
      payment_status,
      payment_date,
      financial_notes
    } = body
    
    // Calculate commission amount if percentage is provided
    const revenue = actual_revenue || budget
    const calculatedCommission = commission_amount || (revenue * commission_percentage / 100)
    
    // Update the project with financial information
    const result = await sql`
      UPDATE projects 
      SET 
        budget = ${budget},
        speaker_fee = ${speaker_fee},
        actual_revenue = ${actual_revenue},
        commission_percentage = ${commission_percentage},
        commission_amount = ${calculatedCommission},
        payment_status = ${payment_status},
        payment_date = ${payment_date},
        financial_notes = ${financial_notes},
        updated_at = NOW()
      WHERE id = ${projectId}
      RETURNING *
    `
    
    if (result.length === 0) {
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      project: result[0],
      success: true 
    })
    
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ 
      error: 'Failed to update project',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const sql = neon(process.env.DATABASE_URL!)
    
    const result = await sql`
      SELECT 
        p.*,
        d.id as deal_id,
        d.deal_value,
        d.commission_percentage as deal_commission_percentage,
        d.commission_amount as deal_commission_amount,
        d.payment_status as deal_payment_status
      FROM projects p
      LEFT JOIN deals d ON d.client_email = p.client_email 
        AND d.event_date = p.event_date
        AND d.status = 'won'
      WHERE p.id = ${projectId}
    `
    
    if (result.length === 0) {
      return NextResponse.json({ 
        error: 'Project not found' 
      }, { status: 404 })
    }
    
    const project = result[0]
    
    return NextResponse.json({ 
      project: {
        ...project,
        deal: project.deal_id ? {
          id: project.deal_id,
          deal_value: project.deal_value,
          commission_percentage: project.deal_commission_percentage,
          commission_amount: project.deal_commission_amount,
          payment_status: project.deal_payment_status
        } : null
      },
      success: true 
    })
    
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch project',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}