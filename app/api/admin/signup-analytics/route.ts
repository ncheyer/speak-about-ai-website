import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    const sql = neon(databaseUrl)
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('range') || '30' // Default to 30 days
    
    // Get signup counts by landing page
    const signupsByPage = await sql`
      SELECT 
        COALESCE(source_url, 'Direct/Unknown') as page_url,
        COALESCE(landing_page_title, 'Untitled Page') as page_title,
        COUNT(*) as total_signups,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '${timeRange} days' THEN 1 END) as recent_signups,
        MAX(created_at) as last_signup,
        MIN(created_at) as first_signup
      FROM form_submissions
      GROUP BY source_url, landing_page_title
      ORDER BY total_signups DESC
    `

    // Get total statistics
    const totalStats = await sql`
      SELECT 
        COUNT(*) as total_signups,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as week_signups,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as month_signups,
        COUNT(CASE WHEN newsletter_opt_out = false OR newsletter_opt_out IS NULL THEN 1 END) as newsletter_subscribers
      FROM form_submissions
    `

    // Get recent signups for activity feed
    const recentSignups = await sql`
      SELECT 
        email,
        name,
        company,
        source_url,
        landing_page_title,
        created_at
      FROM form_submissions
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Get daily signup trend for the selected time range
    const dailyTrend = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as signups
      FROM form_submissions
      WHERE created_at >= CURRENT_DATE - INTERVAL '${timeRange} days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `
    
    return NextResponse.json({
      signupsByPage,
      totalStats: totalStats[0] || {
        total_signups: 0,
        week_signups: 0,
        month_signups: 0,
        newsletter_subscribers: 0
      },
      recentSignups,
      dailyTrend
    })
  } catch (error) {
    console.error('Error fetching signup analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}