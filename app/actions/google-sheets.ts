"use server"

import type { Speaker } from "@/lib/speakers-data"

export async function fetchSpeakersFromSheet(): Promise<Speaker[]> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY

  // Early return if environment variables are not set
  if (!spreadsheetId || !apiKey) {
    console.warn("Google Sheet ID or API Key is not set. Falling back to local data.")
    return []
  }

  const range = "Speakers!A:Z" // Assumes your sheet is named 'Speakers' and you want all columns
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`

  try {
    console.log("Attempting to fetch data from Google Sheet...")

    // Revalidate data every hour (3600 seconds)
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch data from Google Sheet: ${response.status} - ${errorText}`)
      return []
    }

    const data = await response.json()
    const values = data.values

    if (!values || values.length === 0) {
      console.log("No data found in Google Sheet.")
      return []
    }

    const headers = values[0]
    const rows = values.slice(1)

    // Map rows to Speaker objects, handling type conversions
    const speakers: Speaker[] = rows
      .map((row: string[]) => {
        try {
          const speaker: Partial<Speaker> = {}
          headers.forEach((header: string, index: number) => {
            // Convert header to a consistent key format (e.g., remove spaces, lowercase first letter)
            const key = header
              .replace(/\s(.)/g, (match, p1) => p1.toUpperCase())
              .replace(/\s/g, "")
              .toLowerCase()
            let value: any = row[index]

            // Type conversions
            if (value === "TRUE") {
              value = true
            } else if (value === "FALSE") {
              value = false
            } else if (key === "ranking") {
              value = Number.parseInt(value, 10) || 0
            } else if (["expertise", "industries", "programs"].includes(key)) {
              value = value ? value.split(",").map((s: string) => s.trim()) : []
            }
            ;(speaker as any)[key] = value
          })

          // Ensure all required fields are present, providing defaults if necessary
          return {
            slug: speaker.slug || "",
            name: speaker.name || "Unknown Speaker",
            title: speaker.title || "",
            image: speaker.image || "/placeholder.svg",
            bio: speaker.bio || "",
            programs: speaker.programs || [],
            fee: speaker.fee || "Please Inquire",
            location: speaker.location || "",
            linkedin: speaker.linkedin || "",
            website: speaker.website || "",
            email: speaker.email || "",
            contact: speaker.contact || "",
            listed: speaker.listed !== undefined ? speaker.listed : true,
            expertise: speaker.expertise || [],
            industries: speaker.industries || [],
            ranking: speaker.ranking || 0,
            imagePosition: speaker.imageposition || "center", // Handle 'imagePosition' from sheet
          } as Speaker
        } catch (rowError) {
          console.error("Error processing speaker row:", rowError)
          return null
        }
      })
      .filter((speaker): speaker is Speaker => speaker !== null) // Remove any null entries

    // Sort speakers by ranking (highest first)
    const sortedSpeakers = speakers.sort((a, b) => b.ranking - a.ranking)
    console.log(`Successfully fetched ${sortedSpeakers.length} speakers from Google Sheet`)
    return sortedSpeakers
  } catch (error) {
    console.error("Error fetching speakers from Google Sheet:", error)
    return []
  }
}
