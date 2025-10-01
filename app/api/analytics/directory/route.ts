import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = searchParams.get('days') || '7'

    // Get vendor statistics
    const vendorStats = await sql`
      SELECT 
        COUNT(DISTINCT id) as total_vendors,
        COUNT(DISTINCT CASE WHEN status = 'approved' THEN id END) as approved_vendors,
        COUNT(DISTINCT CASE WHEN featured = true THEN id END) as featured_vendors,
        COUNT(DISTINCT CASE WHEN verified = true THEN id END) as verified_vendors
      FROM vendors
    `

    // Get category distribution
    const categoryStats = await sql`
      SELECT 
        c.name as category,
        COUNT(v.id) as count
      FROM vendors v
      LEFT JOIN vendor_categories c ON v.category_id = c.id
      WHERE v.status = 'approved'
      GROUP BY c.name
      ORDER BY count DESC
    `

    // Get recent vendor activity
    const recentActivity = await sql`
      SELECT 
        company_name,
        status,
        created_at
      FROM vendors
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Get subscriber statistics
    const subscriberStats = await sql`
      SELECT 
        COUNT(DISTINCT id) as total_subscribers,
        COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN id END) as new_this_week,
        COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN id END) as new_this_month
      FROM directory_subscribers
    `

    // Since we don't have a dedicated events table, we'll return mock data for now
    // In production, this would query actual event tracking data from Umami or a custom events table
    const mockEventData = {
      totalSearches: Math.floor(Math.random() * 500) + 100,
      topSearchTerms: [
        { term: "catering", count: 45 },
        { term: "photography", count: 38 },
        { term: "venue", count: 32 },
        { term: "wedding", count: 28 },
        { term: "corporate", count: 25 }
      ],
      categoryFilters: categoryStats.map(cat => ({
        category: cat.category || 'Uncategorized',
        count: Math.floor(Math.random() * 50) + 10
      })),
      vendorViews: [
        { vendorName: "Elite Catering Services", views: 89 },
        { vendorName: "Sunset Photography", views: 76 },
        { vendorName: "Grand Ballroom Venue", views: 65 },
        { vendorName: "DJ Entertainment Pro", views: 58 },
        { vendorName: "Floral Designs Studio", views: 52 }
      ],
      contactMethods: {
        email: Math.floor(Math.random() * 100) + 50,
        phone: Math.floor(Math.random() * 50) + 20,
        website: Math.floor(Math.random() * 80) + 30,
        quote: Math.floor(Math.random() * 60) + 25
      },
      conversionFunnel: {
        directoryVisits: Math.floor(Math.random() * 1000) + 500,
        vendorPageViews: Math.floor(Math.random() * 500) + 200,
        contactInitiated: Math.floor(Math.random() * 100) + 50,
        quoteRequested: Math.floor(Math.random() * 50) + 20
      }
    }

    return NextResponse.json({
      ...mockEventData,
      totalVendors: vendorStats[0]?.total_vendors || 0,
      approvedVendors: vendorStats[0]?.approved_vendors || 0,
      featuredVendors: vendorStats[0]?.featured_vendors || 0,
      verifiedVendors: vendorStats[0]?.verified_vendors || 0,
      totalSubscribers: subscriberStats[0]?.total_subscribers || 0,
      newSubscribersThisWeek: subscriberStats[0]?.new_this_week || 0,
      newSubscribersThisMonth: subscriberStats[0]?.new_this_month || 0,
      recentActivity: recentActivity.map(activity => ({
        vendor: activity.company_name,
        action: `Status: ${activity.status}`,
        timestamp: activity.created_at
      }))
    })

  } catch (error) {
    console.error("Error fetching directory analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch directory analytics" },
      { status: 500 }
    )
  }
}