import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id)
    
    const result = await sql`
      SELECT 
        id,
        project_name,
        project_details
      FROM projects 
      WHERE id = ${projectId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({
      projectId: result[0].id,
      projectName: result[0].project_name,
      details: result[0].project_details || {}
    })
  } catch (error) {
    console.error('Error fetching project details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project details' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id)
    const details = await request.json()

    // Calculate completion percentage
    let totalFields = 0
    let completedFields = 0

    function countFields(obj: any) {
      for (const key in obj) {
        if (obj[key] !== undefined && obj[key] !== null) {
          if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            countFields(obj[key])
          } else {
            totalFields++
            if (obj[key] && obj[key] !== '') {
              completedFields++
            }
          }
        }
      }
    }

    countFields(details)
    const completionPercentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0

    // Check for critical missing fields
    const criticalFields = [
      'overview.speaker_name',
      'overview.company_name',
      'overview.event_location',
      'overview.event_date',
      'venue.name',
      'venue.address',
      'contacts.on_site',
      'audience.expected_size',
      'event_details.event_title'
    ]

    let hasCriticalMissing = false
    for (const fieldPath of criticalFields) {
      const keys = fieldPath.split('.')
      let current: any = details
      let isMissing = false
      
      for (const key of keys) {
        if (!current || !current[key]) {
          isMissing = true
          break
        }
        current = current[key]
      }
      
      if (isMissing) {
        hasCriticalMissing = true
        break
      }
    }

    // Update the project with details and completion tracking
    const result = await sql`
      UPDATE projects 
      SET 
        project_details = ${JSON.stringify(details)}::jsonb,
        details_completion_percentage = ${completionPercentage},
        has_critical_missing_info = ${hasCriticalMissing},
        updated_at = NOW()
      WHERE id = ${projectId}
      RETURNING id, project_name, project_details, details_completion_percentage, has_critical_missing_info
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      projectId: result[0].id,
      completionPercentage: result[0].details_completion_percentage,
      hasCriticalMissing: result[0].has_critical_missing_info
    })
  } catch (error) {
    console.error('Error updating project details:', error)
    return NextResponse.json(
      { error: 'Failed to update project details' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id)
    const { path, value } = await request.json()

    // Update a specific field in the project details
    const result = await sql`
      UPDATE projects 
      SET 
        project_details = jsonb_set(
          COALESCE(project_details, '{}'::jsonb),
          ${`{${path.split('.').join(',')}}}`},
          ${JSON.stringify(value)}::jsonb,
          true
        ),
        updated_at = NOW()
      WHERE id = ${projectId}
      RETURNING id, project_details
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Recalculate completion after update
    const details = result[0].project_details
    let totalFields = 0
    let completedFields = 0

    function countFields(obj: any) {
      for (const key in obj) {
        if (obj[key] !== undefined && obj[key] !== null) {
          if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            countFields(obj[key])
          } else {
            totalFields++
            if (obj[key] && obj[key] !== '') {
              completedFields++
            }
          }
        }
      }
    }

    countFields(details)
    const completionPercentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0

    // Update completion percentage
    await sql`
      UPDATE projects 
      SET details_completion_percentage = ${completionPercentage}
      WHERE id = ${projectId}
    `

    return NextResponse.json({
      success: true,
      projectId: result[0].id,
      completionPercentage
    })
  } catch (error) {
    console.error('Error updating project detail field:', error)
    return NextResponse.json(
      { error: 'Failed to update project detail field' },
      { status: 500 }
    )
  }
}