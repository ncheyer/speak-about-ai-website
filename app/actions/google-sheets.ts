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
    console.log("Headers found in Google Sheet:", JSON.stringify(headers))
    console.log("Total headers count:", headers.length)

    // Log each header with its index for debugging
    headers.forEach((header: string, index: number) => {
      console.log(`Header ${index}: "${header}" (normalized: "${header.replace(/\s/g, "").toLowerCase()}")`)
    })

    const rows = values.slice(1)

    // Map rows to Speaker objects, handling type conversions
    const speakers: Speaker[] = rows
      .map((row: string[], rowIndex: number) => {
        try {
          const speaker: Partial<Speaker> = {}
          const nameIndex = headers.findIndex((header) => header.replace(/\s/g, "").toLowerCase() === "name")
          const speakerName = row[nameIndex] || `Row ${rowIndex + 2}`

          console.log(`\n--- Processing speaker: ${speakerName} ---`)

          headers.forEach((header: string, index: number) => {
            const key = header.replace(/\s/g, "").toLowerCase()
            let value: any = row[index]

            console.log(`Processing column "${header}" (key: "${key}") with value: "${value}"`)

            // Type conversions
            if (value === "TRUE") {
              value = true
            } else if (value === "FALSE") {
              value = false
            } else if (key === "ranking") {
              value = Number.parseInt(value, 10) || 0
            }
            // Handle 'expertise' column
            else if (key === "expertise") {
              value = value ? value.split(",").map((s: string) => s.trim()) : []
              ;(speaker as any)["expertise"] = value
              console.log(`Set expertise for ${speakerName}:`, value)
              return
            }
            // Handle 'topics' column, map to 'programs'
            else if (key === "topics") {
              value = value ? value.split(",").map((s: string) => s.trim()) : []
              ;(speaker as any)["programs"] = value
              console.log(`Set programs for ${speakerName}:`, value)
              return
            } else if (key.includes("industries")) {
              console.log(`Processing industries: raw value = "${value}"`)
              value = value ? value.split(",").map((s: string) => s.trim()) : []
              console.log(`Processed industries: array value = ${JSON.stringify(value)}`)
              ;(speaker as any)["industries"] = value
              return // Skip the generic assignment below
            } else if (key.includes("programs")) {
              console.log(`Processing programs: raw value = "${value}"`)
              value = value ? value.split(",").map((s: string) => s.trim()) : []
              console.log(`Processed programs: array value = ${JSON.stringify(value)}`)
              ;(speaker as any)["programs"] = value
              return // Skip the generic assignment below
            }
            // Handle videos column - try multiple possible column names
            else if (key === "videos" || key === "video" || key.includes("video")) {
              console.log(`*** FOUND VIDEOS COLUMN for ${speakerName} ***`)
              console.log(`Column header: "${header}", key: "${key}", raw value: "${value}"`)

              try {
                // Parse videos JSON if it exists
                if (value && typeof value === "string" && value.trim() !== "") {
                  console.log(`Attempting to parse videos JSON for ${speakerName}`)

                  try {
                    // First, try to fix common Google Sheets JSON issues
                    let cleanedValue = value.trim()

                    // Handle double quotes issue
                    if (cleanedValue.includes('""')) {
                      console.log(`Fixing double quotes in JSON for ${speakerName}`)
                      cleanedValue = cleanedValue.replace(/""/g, '"')
                    }

                    // Remove wrapping quotes if present
                    if (cleanedValue.startsWith('"') && cleanedValue.endsWith('"')) {
                      console.log(`Removing wrapping quotes for ${speakerName}`)
                      cleanedValue = cleanedValue.slice(1, -1)
                    }

                    console.log(`Cleaned JSON for ${speakerName}:`, cleanedValue)

                    const parsedVideos = JSON.parse(cleanedValue)
                    console.log(`Successfully parsed videos for ${speakerName}:`, parsedVideos)

                    if (Array.isArray(parsedVideos)) {
                      // Process YouTube thumbnails if missing
                      value = parsedVideos.map((video) => {
                        if (
                          video.url &&
                          video.url.includes("youtube.com/watch?v=") &&
                          (!video.thumbnail || video.thumbnail === video.url)
                        ) {
                          const videoId = video.url.split("v=")[1]?.split("&")[0]
                          if (videoId) {
                            video.thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
                            console.log(`Generated thumbnail for ${speakerName}:`, video.thumbnail)
                          }
                        }
                        return video
                      })
                      console.log(`Final processed videos for ${speakerName}:`, value)
                    } else {
                      console.warn(`Videos for ${speakerName} is not an array:`, parsedVideos)
                      value = []
                    }
                  } catch (jsonError) {
                    console.error(`Error parsing videos JSON for ${speakerName}:`, jsonError)
                    console.error("Raw JSON value:", value)
                    value = []
                  }
                } else {
                  console.log(`No videos data found for ${speakerName} (empty or null value)`)
                  value = []
                }
                ;(speaker as any)["videos"] = value
                console.log(`Set videos for ${speakerName}:`, value)
                return
              } catch (error) {
                console.error(`Error processing videos for ${speakerName}:`, error)
                ;(speaker as any)["videos"] = []
                return
              }
            }
            // Handle testimonials column - try multiple possible column names
            else if (key === "testimonials" || key === "testimonial" || key.includes("testimonial")) {
              console.log(`*** FOUND TESTIMONIALS COLUMN for ${speakerName} ***`)
              console.log(`Column header: "${header}", key: "${key}", raw value: "${value}"`)

              try {
                // Parse testimonials JSON if it exists
                if (value && typeof value === "string" && value.trim() !== "") {
                  console.log(`Attempting to parse testimonials JSON for ${speakerName}`)

                  try {
                    // Clean the JSON similar to videos
                    let cleanedValue = value.trim()

                    if (cleanedValue.includes('""')) {
                      cleanedValue = cleanedValue.replace(/""/g, '"')
                    }

                    if (cleanedValue.startsWith('"') && cleanedValue.endsWith('"')) {
                      cleanedValue = cleanedValue.slice(1, -1)
                    }

                    console.log(`Cleaned testimonials JSON for ${speakerName}:`, cleanedValue)

                    const parsedTestimonials = JSON.parse(cleanedValue)
                    console.log(`Successfully parsed testimonials for ${speakerName}:`, parsedTestimonials)

                    if (Array.isArray(parsedTestimonials)) {
                      value = parsedTestimonials
                    } else {
                      console.warn(`Testimonials for ${speakerName} is not an array:`, parsedTestimonials)
                      value = []
                    }
                  } catch (jsonError) {
                    console.error(`Error parsing testimonials JSON for ${speakerName}:`, jsonError)
                    console.error("Raw JSON value:", value)
                    value = []
                  }
                } else {
                  console.log(`No testimonials data found for ${speakerName} (empty or null value)`)
                  value = []
                }
                ;(speaker as any)["testimonials"] = value
                console.log(`Set testimonials for ${speakerName}:`, value)
                return
              } catch (error) {
                console.error(`Error processing testimonials for ${speakerName}:`, error)
                ;(speaker as any)["testimonials"] = []
                return
              }
            }
            // Generic assignment for other fields
            ;(speaker as any)[key] = value
          })

          // Ensure all required fields are present, providing defaults if necessary
          const finalSpeaker = {
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
            imageOffsetY: speaker.imageoffsety || "0%", // Handle 'imageOffsetY' from sheet
            videos: speaker.videos || [],
            testimonials: speaker.testimonials || [],
          } as Speaker

          console.log(`Final speaker object for ${finalSpeaker.name}:`)
          console.log(`- Videos: ${finalSpeaker.videos?.length || 0}`)
          console.log(`- Testimonials: ${finalSpeaker.testimonials?.length || 0}`)

          return finalSpeaker
        } catch (rowError) {
          console.error("Error processing speaker row:", rowError)
          return null
        }
      })
      .filter((speaker): speaker is Speaker => speaker !== null) // Remove any null entries

    // Sort speakers by ranking (highest first)
    const sortedSpeakers = speakers.sort((a, b) => b.ranking - a.ranking)
    console.log(`Successfully fetched ${sortedSpeakers.length} speakers from Google Sheet`)

    // Log summary of videos/testimonials found
    const speakersWithVideos = sortedSpeakers.filter((s) => s.videos && s.videos.length > 0)
    const speakersWithTestimonials = sortedSpeakers.filter((s) => s.testimonials && s.testimonials.length > 0)
    console.log(`Speakers with videos: ${speakersWithVideos.length}`)
    console.log(`Speakers with testimonials: ${speakersWithTestimonials.length}`)

    return sortedSpeakers
  } catch (error) {
    console.error("Error fetching speakers from Google Sheet:", error)
    return []
  }
}
