import { createClient, type Entry, type EntryCollection } from "contentful"
import type { LandingPage } from "@/types/contentful-landing-page"

// Ensure environment variables are present, otherwise the client will fail silently.
const space = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

if (!space || !accessToken) {
  throw new Error("Contentful Space ID and Access Token must be provided.")
}

const client = createClient({
  space,
  accessToken,
})

/**
 * Fetches a single landing page by its slug.
 */
export async function getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
  try {
    const entries: EntryCollection<LandingPage> = await client.getEntries({
      content_type: "landingPage", // CORRECTED CONTENT TYPE
      "fields.slug": slug,
      limit: 1,
      include: 10, // Include linked entries up to 10 levels deep
    })

    if (entries.items && entries.items.length > 0) {
      return entries.items[0].fields
    }

    console.warn(`No landing page found with slug: ${slug}`)
    return null
  } catch (error) {
    console.error(`Error fetching Contentful landing page with slug ${slug}:`, error)
    return null
  }
}

/**
 * Fetches all entries of the landingPage content type.
 * This is useful for creating a directory or for debugging.
 */
export async function getAllLandingPages(): Promise<Entry<LandingPage>[]> {
  try {
    const entries: EntryCollection<LandingPage> = await client.getEntries({
      content_type: "landingPage", // CORRECTED CONTENT TYPE
      include: 1, // We only need shallow data for a list
      order: ["fields.pageTitle"],
    })

    return entries.items || []
  } catch (error) {
    console.error("Error fetching all Contentful landing pages:", error)
    return []
  }
}
