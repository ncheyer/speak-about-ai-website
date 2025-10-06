import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

const searchconsole = google.searchconsole('v1')

interface IntegratedData {
  searchPerformance: {
    queries: any[]
    pages: any[]
    totals: any
  }
  userBehavior: {
    pageViews: number
    uniqueVisitors: number
    bounceRate: number
    avgSessionDuration: number
    topPages: any[]
  }
  correlations: {
    searchToVisit: any[]
    queryToConversion: any[]
    landingPagePerformance: any[]
  }
  insights: {
    highImpressionsLowTraffic: any[]
    highTrafficLowSearch: any[]
    conversionOpportunities: any[]
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin request
    const isAdmin = request.headers.get('x-admin-request') === 'true'
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '7')
    const startDate = searchParams.get('startDate') || 
      new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const endDate = searchParams.get('endDate') || 
      new Date().toISOString().split('T')[0]

    // Fetch data from both sources in parallel
    const [searchConsoleData, umamiData] = await Promise.all([
      fetchSearchConsoleData(startDate, endDate),
      fetchUmamiAnalytics(startDate, endDate)
    ])

    // Correlate the data
    const correlations = correlateData(searchConsoleData, umamiData)
    
    // Generate insights
    const insights = generateInsights(searchConsoleData, umamiData, correlations)

    const integratedData: IntegratedData = {
      searchPerformance: {
        queries: searchConsoleData.queries || [],
        pages: searchConsoleData.pages || [],
        totals: searchConsoleData.totals || {}
      },
      userBehavior: {
        pageViews: umamiData.pageViews || 0,
        uniqueVisitors: umamiData.visitors || 0,
        bounceRate: umamiData.bounceRate || 0,
        avgSessionDuration: umamiData.avgDuration || 0,
        topPages: umamiData.pages || []
      },
      correlations,
      insights
    }

    return NextResponse.json(integratedData)
  } catch (error) {
    console.error('Error fetching integrated analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch integrated analytics' },
      { status: 500 }
    )
  }
}

async function fetchSearchConsoleData(startDate: string, endDate: string) {
  try {
    const clientEmail = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL
    const privateKey = process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY
    const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || 'https://speakabout.ai'

    if (!clientEmail || !privateKey) {
      return { queries: [], pages: [], totals: {} }
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    })

    // Fetch queries
    const queryResponse = await searchconsole.searchanalytics.query({
      auth,
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 100
      }
    })

    // Fetch pages
    const pageResponse = await searchconsole.searchanalytics.query({
      auth,
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: 100
      }
    })

    // Calculate totals
    const totals = {
      clicks: queryResponse.data.rows?.reduce((sum, row) => sum + (row.clicks || 0), 0) || 0,
      impressions: queryResponse.data.rows?.reduce((sum, row) => sum + (row.impressions || 0), 0) || 0,
      ctr: 0,
      position: 0
    }

    if (totals.impressions > 0) {
      totals.ctr = totals.clicks / totals.impressions
      totals.position = (queryResponse.data.rows?.reduce((sum, row) => 
        sum + (row.position || 0) * (row.impressions || 0), 0) || 0) / totals.impressions
    }

    return {
      queries: queryResponse.data.rows || [],
      pages: pageResponse.data.rows || [],
      totals
    }
  } catch (error) {
    console.error('Search Console error:', error)
    return { queries: [], pages: [], totals: {} }
  }
}

async function fetchUmamiAnalytics(startDate: string, endDate: string) {
  try {
    const UMAMI_API_KEY = process.env.UMAMI_API_KEY
    const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID
    
    if (!UMAMI_API_KEY || !UMAMI_WEBSITE_ID) {
      return { pageViews: 0, visitors: 0, bounceRate: 0, avgDuration: 0, pages: [] }
    }

    const umamiResponse = await fetch(
      `https://cloud.umami.is/api/websites/${UMAMI_WEBSITE_ID}/stats?startAt=${new Date(startDate).getTime()}&endAt=${new Date(endDate).getTime()}`,
      {
        headers: {
          'x-umami-api-key': UMAMI_API_KEY,
        }
      }
    )

    if (!umamiResponse.ok) {
      throw new Error('Umami API error')
    }

    const stats = await umamiResponse.json()

    // Get page metrics
    const pagesResponse = await fetch(
      `https://cloud.umami.is/api/websites/${UMAMI_WEBSITE_ID}/metrics?type=url&startAt=${new Date(startDate).getTime()}&endAt=${new Date(endDate).getTime()}`,
      {
        headers: {
          'x-umami-api-key': UMAMI_API_KEY,
        }
      }
    )

    const pages = pagesResponse.ok ? await pagesResponse.json() : []

    return {
      pageViews: stats.pageviews?.value || 0,
      visitors: stats.visitors?.value || 0,
      bounceRate: stats.bounces?.value || 0,
      avgDuration: stats.totaltime?.value || 0,
      pages: pages.slice(0, 20) // Top 20 pages
    }
  } catch (error) {
    console.error('Umami error:', error)
    return { pageViews: 0, visitors: 0, bounceRate: 0, avgDuration: 0, pages: [] }
  }
}

function correlateData(searchData: any, umamiData: any) {
  const correlations = {
    searchToVisit: [],
    queryToConversion: [],
    landingPagePerformance: []
  }

  // Match search console pages with Umami pages
  if (searchData.pages && umamiData.pages) {
    searchData.pages.forEach((searchPage: any) => {
      const url = searchPage.keys?.[0]?.replace('https://speakabout.ai', '') || ''
      const umamiPage = umamiData.pages.find((p: any) => p.x === url || p.x === url + '/')
      
      if (umamiPage) {
        correlations.searchToVisit.push({
          url,
          searchClicks: searchPage.clicks || 0,
          searchImpressions: searchPage.impressions || 0,
          searchCTR: searchPage.ctr || 0,
          searchPosition: searchPage.position || 0,
          actualVisits: umamiPage.y || 0,
          conversionRate: calculateConversionRate(searchPage.clicks, umamiPage.y)
        })
      }
    })
  }

  // Landing page performance
  correlations.landingPagePerformance = correlations.searchToVisit
    .filter(item => item.searchClicks > 0)
    .sort((a, b) => b.actualVisits - a.actualVisits)
    .slice(0, 10)

  return correlations
}

function calculateConversionRate(searchClicks: number, actualVisits: number) {
  if (searchClicks === 0) return 0
  return Math.min((actualVisits / searchClicks) * 100, 100)
}

function generateInsights(searchData: any, umamiData: any, correlations: any) {
  const insights = {
    highImpressionsLowTraffic: [],
    highTrafficLowSearch: [],
    conversionOpportunities: []
  }

  // Find pages with high impressions but low actual traffic
  if (searchData.pages) {
    insights.highImpressionsLowTraffic = searchData.pages
      .filter((page: any) => 
        page.impressions > 100 && 
        page.ctr < 0.02
      )
      .map((page: any) => ({
        url: page.keys?.[0],
        impressions: page.impressions,
        ctr: page.ctr,
        position: page.position,
        recommendation: page.position < 10 
          ? 'Improve meta description and title tags'
          : 'Focus on improving search ranking'
      }))
      .slice(0, 5)
  }

  // Find pages with high traffic but not appearing in search
  if (umamiData.pages && searchData.pages) {
    const searchUrls = new Set(searchData.pages.map((p: any) => p.keys?.[0]))
    insights.highTrafficLowSearch = umamiData.pages
      .filter((page: any) => {
        const fullUrl = `https://speakabout.ai${page.x}`
        return page.y > 50 && !searchUrls.has(fullUrl)
      })
      .map((page: any) => ({
        url: page.x,
        visits: page.y,
        recommendation: 'Optimize for search - add meta tags, improve content'
      }))
      .slice(0, 5)
  }

  // Conversion opportunities
  insights.conversionOpportunities = correlations.searchToVisit
    .filter((item: any) => 
      item.searchImpressions > 50 && 
      item.conversionRate < 50 &&
      item.searchPosition < 20
    )
    .map((item: any) => ({
      url: item.url,
      currentConversion: item.conversionRate,
      potential: 'High',
      searchPosition: item.searchPosition,
      recommendation: item.searchPosition < 5
        ? 'Already ranking well - improve click appeal'
        : 'Improve ranking to increase visibility'
    }))
    .slice(0, 5)

  return insights
}