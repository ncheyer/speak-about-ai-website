import { neon } from '@neondatabase/serverless'

// Initialize Neon client with error handling
let sql: any = null
try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL)
  }
} catch (error) {
  console.error('Failed to initialize Neon client for wishlist:', error)
}

export interface WishlistItem {
  id: number
  sessionId: string
  visitorId?: string
  speakerId: number
  addedAt: string
  speaker?: {
    id: number
    name: string
    headshot_url: string
    one_liner?: string
    speaking_fee_range?: string
  }
}

/**
 * Add speaker to wishlist
 */
export async function addToWishlist(sessionId: string, speakerId: number, visitorId?: string): Promise<boolean> {
  if (!sql) {
    console.warn('Wishlist database not available')
    return false
  }

  try {
    await sql`
      INSERT INTO wishlists (session_id, visitor_id, speaker_id)
      VALUES (${sessionId}, ${visitorId || null}, ${speakerId})
      ON CONFLICT (session_id, speaker_id) DO NOTHING
    `
    return true
  } catch (error) {
    console.error('Failed to add to wishlist:', error)
    return false
  }
}

/**
 * Remove speaker from wishlist
 */
export async function removeFromWishlist(sessionId: string, speakerId: number): Promise<boolean> {
  if (!sql) {
    console.warn('Wishlist database not available')
    return false
  }

  try {
    const result = await sql`
      DELETE FROM wishlists 
      WHERE session_id = ${sessionId} AND speaker_id = ${speakerId}
    `
    return result.length > 0 || result.count > 0
  } catch (error) {
    console.error('Failed to remove from wishlist:', error)
    return false
  }
}

/**
 * Get all wishlist items for a session
 */
export async function getWishlist(sessionId: string): Promise<WishlistItem[]> {
  if (!sql) {
    console.warn('Wishlist database not available')
    return []
  }

  try {
    const result = await sql`
      SELECT 
        w.id,
        w.session_id,
        w.visitor_id,
        w.speaker_id,
        w.added_at,
        s.name,
        s.headshot_url,
        s.one_liner,
        s.speaking_fee_range
      FROM wishlists w
      JOIN speakers s ON w.speaker_id = s.id
      WHERE w.session_id = ${sessionId}
      ORDER BY w.added_at DESC
    `

    return result.map((item: any) => ({
      id: item.id,
      sessionId: item.session_id,
      visitorId: item.visitor_id,
      speakerId: item.speaker_id,
      addedAt: item.added_at,
      speaker: {
        id: item.speaker_id,
        name: item.name,
        headshot_url: item.headshot_url,
        one_liner: item.one_liner,
        speaking_fee_range: item.speaking_fee_range
      }
    }))
  } catch (error) {
    console.error('Failed to get wishlist:', error)
    return []
  }
}

/**
 * Check if speaker is in wishlist
 */
export async function isInWishlist(sessionId: string, speakerId: number): Promise<boolean> {
  if (!sql) return false

  try {
    const result = await sql`
      SELECT 1 FROM wishlists 
      WHERE session_id = ${sessionId} AND speaker_id = ${speakerId}
      LIMIT 1
    `
    return result.length > 0
  } catch (error) {
    console.error('Failed to check wishlist:', error)
    return false
  }
}

/**
 * Get wishlist count for session
 */
export async function getWishlistCount(sessionId: string): Promise<number> {
  if (!sql) return 0

  try {
    const result = await sql`
      SELECT COUNT(*) as count 
      FROM wishlists 
      WHERE session_id = ${sessionId}
    `
    return parseInt(result[0]?.count || '0')
  } catch (error) {
    console.error('Failed to get wishlist count:', error)
    return 0
  }
}

/**
 * Clear entire wishlist for session
 */
export async function clearWishlist(sessionId: string): Promise<boolean> {
  if (!sql) {
    console.warn('Wishlist database not available')
    return false
  }

  try {
    await sql`
      DELETE FROM wishlists 
      WHERE session_id = ${sessionId}
    `
    return true
  } catch (error) {
    console.error('Failed to clear wishlist:', error)
    return false
  }
}

/**
 * Transfer wishlist from session to visitor (when user provides email)
 */
export async function transferWishlistToVisitor(sessionId: string, visitorId: string): Promise<boolean> {
  if (!sql) return false

  try {
    await sql`
      UPDATE wishlists 
      SET visitor_id = ${visitorId}
      WHERE session_id = ${sessionId} AND visitor_id IS NULL
    `
    return true
  } catch (error) {
    console.error('Failed to transfer wishlist to visitor:', error)
    return false
  }
}