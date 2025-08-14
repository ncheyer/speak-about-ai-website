import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check for admin authentication (using localStorage approach)
    const authHeader = request.headers.get('x-admin-request')
    if (authHeader !== 'true') {
      console.log('Umami Analytics API accessed without admin header')
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    
    // Check if Umami credentials are configured
    if (!process.env.UMAMI_API_KEY || !process.env.UMAMI_WEBSITE_ID) {
      return NextResponse.json(
        { error: 'Umami Analytics not configured' },
        { status: 500 }
      )
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    // Format dates for Umami API (Unix timestamps in milliseconds)
    const startAt = startDate.getTime()
    const endAt = endDate.getTime()

    const baseUrl = process.env.UMAMI_API_URL || 'https://cloud.umami.is/api'
    const websiteId = process.env.UMAMI_WEBSITE_ID
    const apiKey = process.env.UMAMI_API_KEY

    // Fetch data from Umami API endpoints
    const headers = {
      'x-umami-api-key': apiKey,
      'Content-Type': 'application/json'
    }

    // Fetch website stats
    const statsResponse = await fetch(
      `${baseUrl}/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
      { headers }
    )

    // Fetch page views
    const pageViewsResponse = await fetch(
      `${baseUrl}/websites/${websiteId}/pageviews?startAt=${startAt}&endAt=${endAt}&unit=day`,
      { headers }
    )

    // Fetch metrics (top pages, referrers, etc.)
    const metricsResponse = await fetch(
      `${baseUrl}/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=url`,
      { headers }
    )

    const referrersResponse = await fetch(
      `${baseUrl}/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=referrer`,
      { headers }
    )

    const devicesResponse = await fetch(
      `${baseUrl}/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=device`,
      { headers }
    )

    const browsersResponse = await fetch(
      `${baseUrl}/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=browser`,
      { headers }
    )

    const countriesResponse = await fetch(
      `${baseUrl}/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=country`,
      { headers }
    )

    // Check if all requests were successful
    if (!statsResponse.ok || !pageViewsResponse.ok || !metricsResponse.ok) {
      console.error('Umami API Error:', {
        stats: statsResponse.status,
        pageViews: pageViewsResponse.status,
        metrics: metricsResponse.status
      })
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch Umami analytics data',
          details: {
            stats: statsResponse.statusText,
            pageViews: pageViewsResponse.statusText,
            metrics: metricsResponse.statusText
          }
        },
        { status: 500 }
      )
    }

    const stats = await statsResponse.json()
    const pageViews = await pageViewsResponse.json()
    const topPages = await metricsResponse.json()
    const referrers = await referrersResponse.json()
    const devices = await devicesResponse.json()
    const browsers = await browsersResponse.json()
    const countries = await countriesResponse.json()

    // Transform data to match our analytics format
    const analytics = {
      // Basic stats
      totalPageViews: stats.pageviews?.value || 0,
      uniqueVisitors: stats.uniques?.value || 0,
      bounceRate: stats.bounces?.value ? (stats.bounces.value / stats.pageviews?.value * 100) : 0,
      avgSessionDuration: stats.totaltime?.value ? (stats.totaltime.value / stats.uniques?.value) : 0,
      
      // Top pages
      topPages: topPages.slice(0, 10).map((page: any) => ({
        page: page.x || page.url || 'Unknown',
        views: page.y || page.pageviews || 0
      })),
      
      // Top referrers
      topReferrers: referrers.slice(0, 10).map((ref: any) => ({
        referrer: ref.x || ref.referrer || 'Direct',
        count: ref.y || ref.pageviews || 0
      })),
      
      // Device breakdown
      deviceBreakdown: devices.map((device: any) => ({
        device: device.x || device.device || 'Unknown',
        count: device.y || device.pageviews || 0
      })),

      // Browser breakdown
      browserBreakdown: browsers.slice(0, 5).map((browser: any) => ({
        browser: browser.x || browser.browser || 'Unknown',
        count: browser.y || browser.pageviews || 0
      })),

      // Country breakdown
      countryBreakdown: countries.slice(0, 10).map((country: any) => ({
        country: country.x || country.country || 'Unknown',
        count: country.y || country.pageviews || 0
      })),
      
      // Daily stats from page views
      dailyStats: pageViews.pageviews?.map((pv: any, index: number) => ({
        date: pv.x || new Date(startDate.getTime() + (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        page_views: pv.y || 0,
        unique_visitors: pageViews.uniques?.[index]?.y || 0,
        bounce_rate: 0 // Umami doesn't provide daily bounce rate
      })) || [],
      
      // Recent events (Umami doesn't provide this by default)
      recentEvents: [],

      // Additional Umami-specific data
      totalSessions: stats.pageviews?.value || 0,
      averageTime: stats.totaltime?.value ? Math.round(stats.totaltime.value / stats.pageviews?.value) : 0,
      
      // Metadata
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days: days
      }
    }

    return NextResponse.json(analytics)
    
  } catch (error) {
    console.error('Umami Analytics API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch Umami analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}