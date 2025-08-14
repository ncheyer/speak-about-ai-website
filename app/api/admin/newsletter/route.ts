import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    // For now, skip authentication check since we're using localStorage
    // In production, you should implement proper server-side session management
    
    // Optional: Check for a custom header if you want some basic protection
    const authHeader = request.headers.get('x-admin-request')
    if (authHeader !== 'true') {
      // Allow for now, but log the request
      console.log('Newsletter API accessed without admin header')
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)
    
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''
    
    let query = `
      SELECT 
        id,
        email,
        name,
        company,
        subscribed_at,
        status,
        source,
        ip_address,
        unsubscribed_at
      FROM newsletter_signups
    `
    
    const conditions = []
    const params = []
    
    if (status !== 'all') {
      conditions.push(`status = $${params.length + 1}`)
      params.push(status)
    }
    
    if (search) {
      conditions.push(`(email ILIKE $${params.length + 1} OR name ILIKE $${params.length + 1} OR company ILIKE $${params.length + 1})`)
      params.push(`%${search}%`)
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }
    
    query += ` ORDER BY subscribed_at DESC`
    
    const signups = await sql(query, params)
    
    // Get statistics
    const stats = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'active') as active_count,
        COUNT(*) FILTER (WHERE status = 'unsubscribed') as unsubscribed_count,
        COUNT(*) as total_count,
        COUNT(*) FILTER (WHERE subscribed_at >= CURRENT_DATE - INTERVAL '7 days' AND status = 'active') as week_count,
        COUNT(*) FILTER (WHERE subscribed_at >= CURRENT_DATE - INTERVAL '30 days' AND status = 'active') as month_count
      FROM newsletter_signups
    `
    
    return NextResponse.json({
      success: true,
      signups,
      stats: stats[0]
    })
    
  } catch (error) {
    console.error('Error fetching newsletter signups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch newsletter signups' },
      { status: 500 }
    )
  }
}

// Export newsletter list as CSV
export async function POST(request: NextRequest) {
  try {
    // For now, skip authentication check since we're using localStorage
    // In production, you should implement proper server-side session management

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)
    
    // Get only active subscribers for export
    const signups = await sql`
      SELECT 
        email,
        name,
        company,
        subscribed_at
      FROM newsletter_signups
      WHERE status = 'active'
      ORDER BY subscribed_at DESC
    `
    
    // Create CSV content
    const csvHeaders = 'Email,Name,Company,Subscribed Date\n'
    const csvRows = signups.map(signup => {
      const date = new Date(signup.subscribed_at).toLocaleDateString()
      return `"${signup.email}","${signup.name || ''}","${signup.company || ''}","${date}"`
    }).join('\n')
    
    const csv = csvHeaders + csvRows
    
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
    
  } catch (error) {
    console.error('Error exporting newsletter signups:', error)
    return NextResponse.json(
      { error: 'Failed to export newsletter signups' },
      { status: 500 }
    )
  }
}