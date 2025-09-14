import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_2KsQRpzJ8yji@ep-icy-bonus-afhpjby9-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require'

export async function GET() {
  try {
    const sql = neon(databaseUrl)
    
    const submissions = await sql`
      SELECT 
        id,
        submission_type,
        source_url,
        name,
        email,
        phone,
        organization_name,
        specific_speaker,
        event_date,
        event_location,
        event_budget,
        message,
        additional_info,
        newsletter_opt_in,
        status,
        admin_notes,
        created_at,
        updated_at
      FROM form_submissions
      ORDER BY created_at DESC
      LIMIT 500
    `
    
    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching form submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}