import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Workshop {
  id: number
  title: string
  slug: string
  speaker_id: number | null
  description: string | null
  short_description: string | null
  duration_minutes: number | null
  format: string | null
  max_participants: number | null
  price_range: string | null
  learning_objectives: string[] | null
  target_audience: string | null
  prerequisites: string | null
  materials_included: string[] | null
  agenda: string | null
  key_takeaways: string[] | null
  topics: string[] | null
  thumbnail_url: string | null
  video_url: string | null
  image_urls: string[] | null
  customizable: boolean
  custom_options: string | null
  meta_title: string | null
  meta_description: string | null
  keywords: string[] | null
  active: boolean
  featured: boolean
  popularity_score: number
  category: string | null
  display_order: number
  badge_text: string | null
  roi_stats: Record<string, string> | null
  created_at: string
  updated_at: string
}

export interface WorkshopWithSpeaker extends Workshop {
  speaker_name?: string
  speaker_slug?: string
  speaker_headshot?: string
}

export interface CreateWorkshopInput {
  title: string
  slug: string
  speaker_id?: number | null
  description?: string
  short_description?: string
  duration_minutes?: number
  format?: string
  max_participants?: number
  price_range?: string
  learning_objectives?: string[]
  target_audience?: string
  prerequisites?: string
  materials_included?: string[]
  agenda?: string
  key_takeaways?: string[]
  topics?: string[]
  thumbnail_url?: string
  video_url?: string
  image_urls?: string[]
  customizable?: boolean
  custom_options?: string
  meta_title?: string
  meta_description?: string
  keywords?: string[]
  active?: boolean
  featured?: boolean
  popularity_score?: number
}

export type UpdateWorkshopInput = Partial<CreateWorkshopInput>

/**
 * Get all workshops
 */
export async function getAllWorkshops(): Promise<WorkshopWithSpeaker[]> {
  try {
    const workshops = await sql`
      SELECT
        w.*,
        s.name as speaker_name,
        s.slug as speaker_slug,
        s.headshot_url as speaker_headshot
      FROM workshops w
      LEFT JOIN speakers s ON w.speaker_id = s.id
      ORDER BY w.featured DESC, w.popularity_score DESC, w.created_at DESC
    `
    return workshops as WorkshopWithSpeaker[]
  } catch (error) {
    console.error("Error fetching all workshops:", error)
    throw error
  }
}

/**
 * Get active workshops only
 */
export async function getActiveWorkshops(): Promise<WorkshopWithSpeaker[]> {
  try {
    const workshops = await sql`
      SELECT
        w.*,
        s.name as speaker_name,
        s.slug as speaker_slug,
        s.headshot_url as speaker_headshot
      FROM workshops w
      LEFT JOIN speakers s ON w.speaker_id = s.id
      WHERE w.active = true
      ORDER BY w.featured DESC, w.popularity_score DESC, w.created_at DESC
    `
    return workshops as WorkshopWithSpeaker[]
  } catch (error) {
    console.error("Error fetching active workshops:", error)
    throw error
  }
}

/**
 * Get workshop by ID
 */
export async function getWorkshopById(id: number): Promise<WorkshopWithSpeaker | null> {
  try {
    const workshops = await sql`
      SELECT
        w.*,
        s.name as speaker_name,
        s.slug as speaker_slug,
        s.headshot_url as speaker_headshot,
        s.bio as speaker_bio,
        s.one_liner as speaker_one_liner
      FROM workshops w
      LEFT JOIN speakers s ON w.speaker_id = s.id
      WHERE w.id = ${id}
    `
    return workshops[0] as WorkshopWithSpeaker || null
  } catch (error) {
    console.error("Error fetching workshop by ID:", error)
    throw error
  }
}

/**
 * Get workshop by slug
 */
export async function getWorkshopBySlug(slug: string): Promise<WorkshopWithSpeaker | null> {
  try {
    const workshops = await sql`
      SELECT
        w.*,
        s.name as speaker_name,
        s.slug as speaker_slug,
        s.headshot_url as speaker_headshot,
        s.bio as speaker_bio,
        s.one_liner as speaker_one_liner
      FROM workshops w
      LEFT JOIN speakers s ON w.speaker_id = s.id
      WHERE w.slug = ${slug}
    `
    return workshops[0] as WorkshopWithSpeaker || null
  } catch (error) {
    console.error("Error fetching workshop by slug:", error)
    throw error
  }
}

/**
 * Get workshops by speaker ID
 */
export async function getWorkshopsBySpeaker(speakerId: number): Promise<Workshop[]> {
  try {
    const workshops = await sql`
      SELECT * FROM workshops
      WHERE speaker_id = ${speakerId} AND active = true
      ORDER BY display_order ASC, category ASC, featured DESC, popularity_score DESC
    `
    return workshops as Workshop[]
  } catch (error) {
    console.error("Error fetching workshops by speaker:", error)
    throw error
  }
}

/**
 * Get workshops by speaker with category grouping
 */
export async function getWorkshopsBySpeakerGrouped(speakerId: number): Promise<Record<string, Workshop[]>> {
  try {
    const workshops = await sql`
      SELECT * FROM workshops
      WHERE speaker_id = ${speakerId} AND active = true
      ORDER BY display_order ASC, featured DESC
    `

    // Group by category
    const grouped: Record<string, Workshop[]> = {}
    for (const workshop of workshops as Workshop[]) {
      const category = workshop.category || 'Other Workshops'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(workshop)
    }

    return grouped
  } catch (error) {
    console.error("Error fetching grouped workshops by speaker:", error)
    throw error
  }
}

/**
 * Search workshops
 */
export async function searchWorkshops(query: string): Promise<WorkshopWithSpeaker[]> {
  try {
    const searchTerm = `%${query}%`
    const workshops = await sql`
      SELECT
        w.*,
        s.name as speaker_name,
        s.slug as speaker_slug,
        s.headshot_url as speaker_headshot
      FROM workshops w
      LEFT JOIN speakers s ON w.speaker_id = s.id
      WHERE w.active = true
        AND (
          w.title ILIKE ${searchTerm}
          OR w.description ILIKE ${searchTerm}
          OR w.short_description ILIKE ${searchTerm}
          OR w.target_audience ILIKE ${searchTerm}
          OR EXISTS (SELECT 1 FROM unnest(w.topics) topic WHERE topic ILIKE ${searchTerm})
          OR EXISTS (SELECT 1 FROM unnest(w.keywords) keyword WHERE keyword ILIKE ${searchTerm})
        )
      ORDER BY w.featured DESC, w.popularity_score DESC
    `
    return workshops as WorkshopWithSpeaker[]
  } catch (error) {
    console.error("Error searching workshops:", error)
    throw error
  }
}

/**
 * Create a new workshop
 */
export async function createWorkshop(input: CreateWorkshopInput): Promise<Workshop> {
  try {
    const workshops = await sql`
      INSERT INTO workshops (
        title, slug, speaker_id, description, short_description,
        duration_minutes, format, max_participants, price_range,
        learning_objectives, target_audience, prerequisites, materials_included,
        agenda, key_takeaways, topics,
        thumbnail_url, video_url, image_urls,
        customizable, custom_options,
        meta_title, meta_description, keywords,
        active, featured, popularity_score
      ) VALUES (
        ${input.title},
        ${input.slug},
        ${input.speaker_id ?? null},
        ${input.description ?? null},
        ${input.short_description ?? null},
        ${input.duration_minutes ?? null},
        ${input.format ?? null},
        ${input.max_participants ?? null},
        ${input.price_range ?? null},
        ${input.learning_objectives ?? null},
        ${input.target_audience ?? null},
        ${input.prerequisites ?? null},
        ${input.materials_included ?? null},
        ${input.agenda ?? null},
        ${input.key_takeaways ?? null},
        ${input.topics ?? null},
        ${input.thumbnail_url ?? null},
        ${input.video_url ?? null},
        ${input.image_urls ?? null},
        ${input.customizable ?? true},
        ${input.custom_options ?? null},
        ${input.meta_title ?? null},
        ${input.meta_description ?? null},
        ${input.keywords ?? null},
        ${input.active ?? true},
        ${input.featured ?? false},
        ${input.popularity_score ?? 0}
      )
      RETURNING *
    `
    return workshops[0] as Workshop
  } catch (error) {
    console.error("Error creating workshop:", error)
    throw error
  }
}

/**
 * Update a workshop
 */
export async function updateWorkshop(id: number, input: UpdateWorkshopInput): Promise<Workshop | null> {
  try {
    // Build dynamic update query
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    Object.entries(input).forEach(([key, value]) => {
      updates.push(`${key} = $${paramCount}`)
      values.push(value)
      paramCount++
    })

    if (updates.length === 0) {
      // No updates to perform
      return getWorkshopById(id) as Promise<Workshop | null>
    }

    values.push(id) // Add id as last parameter

    const query = `
      UPDATE workshops
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await sql(query, values)
    return result[0] as Workshop || null
  } catch (error) {
    console.error("Error updating workshop:", error)
    throw error
  }
}

/**
 * Delete a workshop
 */
export async function deleteWorkshop(id: number): Promise<boolean> {
  try {
    await sql`DELETE FROM workshops WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Error deleting workshop:", error)
    return false
  }
}

/**
 * Get featured workshops
 */
export async function getFeaturedWorkshops(limit: number = 6): Promise<WorkshopWithSpeaker[]> {
  try {
    const workshops = await sql`
      SELECT
        w.*,
        s.name as speaker_name,
        s.slug as speaker_slug,
        s.headshot_url as speaker_headshot
      FROM workshops w
      LEFT JOIN speakers s ON w.speaker_id = s.id
      WHERE w.active = true AND w.featured = true
      ORDER BY w.popularity_score DESC
      LIMIT ${limit}
    `
    return workshops as WorkshopWithSpeaker[]
  } catch (error) {
    console.error("Error fetching featured workshops:", error)
    throw error
  }
}

/**
 * Increment workshop popularity score
 */
export async function incrementWorkshopPopularity(id: number): Promise<void> {
  try {
    await sql`
      UPDATE workshops
      SET popularity_score = popularity_score + 1
      WHERE id = ${id}
    `
  } catch (error) {
    console.error("Error incrementing workshop popularity:", error)
  }
}
