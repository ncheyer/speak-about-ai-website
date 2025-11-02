import { NextRequest, NextResponse } from 'next/server'
import {
  getPublishedConferences,
  getAllConferences,
  getConferenceCategories,
  searchConferences
} from '@/lib/conferences-db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Check if requesting categories
    if (searchParams.get('categories') === 'true') {
      const categories = await getConferenceCategories()
      return NextResponse.json({ categories })
    }

    // Check if this is an admin request (should get all conferences)
    const isAdmin = request.cookies.get('adminLoggedIn')?.value === 'true'

    // Build filter object
    const filters: any = {}

    const search = searchParams.get('search')
    if (search) filters.search = search

    const category = searchParams.get('category')
    if (category && category !== 'all') filters.category = category

    const location = searchParams.get('location')
    if (location) filters.location = location

    const cfpOpen = searchParams.get('cfp_open')
    if (cfpOpen) filters.cfp_open = cfpOpen === 'true'

    const status = searchParams.get('status')
    if (status) filters.status = status

    const startDateFrom = searchParams.get('start_date_from')
    if (startDateFrom) filters.start_date_from = startDateFrom

    const startDateTo = searchParams.get('start_date_to')
    if (startDateTo) filters.start_date_to = startDateTo

    // Get conferences based on filters
    let conferences
    if (Object.keys(filters).length > 0) {
      conferences = await searchConferences(filters)
    } else if (isAdmin) {
      conferences = await getAllConferences()
    } else {
      conferences = await getPublishedConferences()
    }

    return NextResponse.json({
      conferences,
      count: conferences.length
    })
  } catch (error) {
    console.error('Error fetching conferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conferences' },
      { status: 500 }
    )
  }
}
