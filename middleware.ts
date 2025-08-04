import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { extractAnalyticsFromRequest, extractUTMParams, generateVisitorId, generateSessionId, shouldTrackRequest } from './lib/analytics-utils'
import { recordPageView, updateSession } from './lib/analytics-db'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Extract analytics data from the request
  const analyticsData = extractAnalyticsFromRequest(request)
  
  // Check if we should track this request
  if (!shouldTrackRequest(request, analyticsData)) {
    return response
  }

  try {
    // Get or generate visitor ID from cookies
    let visitorId = request.cookies.get('visitor_id')?.value
    if (!visitorId) {
      visitorId = generateVisitorId()
      response.cookies.set('visitor_id', visitorId, {
        maxAge: 365 * 24 * 60 * 60, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }

    // Get or generate session ID from cookies
    let sessionId = request.cookies.get('session_id')?.value
    let isNewSession = false
    if (!sessionId) {
      sessionId = generateSessionId()
      isNewSession = true
      response.cookies.set('session_id', sessionId, {
        maxAge: 30 * 60, // 30 minutes
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }

    // Extract UTM parameters
    const utmParams = extractUTMParams(request.url)

    // Get page title from headers if available (would be set by client-side script)
    const pageTitle = request.headers.get('x-page-title') || undefined

    // Record the page view
    await recordPageView({
      sessionId,
      visitorId,
      pagePath: request.nextUrl.pathname,
      pageTitle,
      ...analyticsData,
      ...utmParams
    })

    // Update session information
    await updateSession(sessionId, {
      visitorId,
      firstPage: isNewSession ? request.nextUrl.pathname : undefined,
      lastPage: request.nextUrl.pathname,
      pageCount: isNewSession ? 1 : undefined,
      referrer: analyticsData.referrer,
      ...utmParams,
      deviceType: analyticsData.deviceType,
      browser: analyticsData.browser
    })

  } catch (error) {
    // Don't let analytics errors break the website
    console.error('Analytics tracking error:', error)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
}