import { createClient, type EntryCollection } from "contentful"
import type { LandingPageEventChecklist } from "@/types/contentful-checklist"

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
})

export async function getChecklistLandingPage(): Promise<LandingPageEventChecklist | null> {
  try {
    const entries: EntryCollection<LandingPageEventChecklist> = await client.getEntries({
      content_type: "landingPageEventChecklist",
      "fields.slug": "event-planning-checklist",
      limit: 1,
      include: 10, // Include linked entries up to 10 levels deep
    })

    if (entries.items && entries.items.length > 0) {
      return entries.items[0].fields
    }

    return null
  } catch (error) {
    console.error("Error fetching Contentful landing page:", error)
    return null
  }
}
