import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/case-studies/[id] - Fetch a single case study
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await query(`
      SELECT
        cs.*,
        json_agg(
          json_build_object(
            'id', s.id,
            'name', s.name,
            'slug', s.slug,
            'title', s.one_liner,
            'headshot', s.headshot_url
          ) ORDER BY css.display_order
        ) FILTER (WHERE s.id IS NOT NULL) as speakers
      FROM case_studies cs
      LEFT JOIN case_study_speakers css ON cs.id = css.case_study_id
      LEFT JOIN speakers s ON css.speaker_id = s.id
      WHERE cs.id = $1
      GROUP BY cs.id
    `, [id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Case study not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error fetching case study:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch case study' },
      { status: 500 }
    )
  }
}

// PUT /api/case-studies/[id] - Update a case study
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const {
      company,
      logo_url,
      location,
      event_type,
      image_url,
      image_alt,
      testimonial,
      impact_points,
      speaker_ids,
      display_order,
      active,
      featured
    } = body

    // Update case study
    const result = await query(
      `UPDATE case_studies
       SET company = $1, logo_url = $2, location = $3, event_type = $4,
           image_url = $5, image_alt = $6, testimonial = $7, impact_points = $8,
           display_order = $9, active = $10, featured = $11
       WHERE id = $12
       RETURNING *`,
      [company, logo_url, location, event_type, image_url, image_alt, testimonial, impact_points, display_order, active, featured, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Case study not found' },
        { status: 404 }
      )
    }

    // Update speaker associations
    await query('DELETE FROM case_study_speakers WHERE case_study_id = $1', [id])

    if (speaker_ids && speaker_ids.length > 0) {
      for (let i = 0; i < speaker_ids.length; i++) {
        await query(
          `INSERT INTO case_study_speakers (case_study_id, speaker_id, display_order)
           VALUES ($1, $2, $3)`,
          [id, speaker_ids[i], i]
        )
      }
    }

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('Error updating case study:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update case study' },
      { status: 500 }
    )
  }
}

// DELETE /api/case-studies/[id] - Delete a case study
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await query('DELETE FROM case_studies WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Case study not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Case study deleted successfully' })
  } catch (error) {
    console.error('Error deleting case study:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete case study' },
      { status: 500 }
    )
  }
}
