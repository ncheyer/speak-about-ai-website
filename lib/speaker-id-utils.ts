/**
 * Utility functions for converting between speaker slugs and numeric IDs
 * Since the speaker data comes from Google Sheets without database IDs,
 * we need to generate consistent numeric IDs for the wishlist system.
 */

/**
 * Generate a consistent numeric ID from a speaker slug
 * This ensures the same slug always produces the same ID
 */
export function slugToId(slug: string): number {
  if (!slug) return 0
  
  // Simple hash function to convert string to number
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    const char = slug.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Ensure positive number and reasonable range
  return Math.abs(hash) % 100000 + 1
}

/**
 * Get speaker ID from speaker object
 * This handles both database speakers (with numeric id) and Google Sheets speakers (with slug)
 */
export function getSpeakerId(speaker: any): number {
  // If speaker already has a numeric id, use it
  if (typeof speaker.id === 'number') {
    return speaker.id
  }
  
  // If speaker has a string id that's numeric, convert it
  if (typeof speaker.id === 'string' && !isNaN(Number(speaker.id))) {
    return Number(speaker.id)
  }
  
  // Otherwise, generate ID from slug
  if (speaker.slug) {
    return slugToId(speaker.slug)
  }
  
  // Fallback: generate from name
  if (speaker.name) {
    return slugToId(speaker.name.toLowerCase().replace(/\s+/g, '-'))
  }
  
  return 0
}