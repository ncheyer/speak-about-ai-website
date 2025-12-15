import { NextResponse } from 'next/server'
import { getActiveWorkshops, getAllWorkshops } from '@/lib/workshops-db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const workshops = includeInactive ? await getAllWorkshops() : await getActiveWorkshops()

    // Return full workshop data (used by both directory and contact form)
    return NextResponse.json({
      success: true,
      workshops: workshops
    })
  } catch (error) {
    console.error('Get workshops error:', error)
    return NextResponse.json({
      success: false,
      workshops: [],
      error: 'Failed to fetch workshops'
    })
  }
}
