export interface Speaker {
  slug: string
  name: string
  title: string
  bio?: string
  image?: string
  imagePosition?: string
  imageOffsetY?: string
  programs?: string[]
  industries?: string[]
  fee?: string
  feeRange?: string
  location?: string
  linkedin?: string
  twitter?: string
  website?: string
  featured?: boolean
  videos?: {
    id: string
    title: string
    url: string
    thumbnail?: string
    source?: string
    duration?: string
  }[]
  testimonials?: {
    quote: string
    author: string
    position?: string // Added from your example, ensure it's in your actual data/needs
    company?: string
    event?: string
    date?: string
    logo?: string
    // title?: string // From your example, if 'position' is not it.
  }[]
  tags?: string[]
  lastUpdated?: string
  pronouns?: string
  languages?: string[]
  availability?: string
  isVirtual?: boolean
  travelsFrom?: string
  topics?: string[]
  listed?: boolean
  expertise?: string[]
  ranking?: number
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY
const SHEET_NAME = "Speakers"

/**
 * Sanitizes a string that is supposed to be JSON but might be corrupted
 * due to manual entry, copy-pasting, or spreadsheet export issues.
 */
function sanitizePotentiallyCorruptJsonString(rawJsonString: string): string {
  if (!rawJsonString || typeof rawJsonString !== "string") {
    return "[]" // Return empty array string for safety
  }

  let s = rawJsonString.trim()

  // Early return for obviously empty cases
  if (s === "" || s === "null" || s === "undefined") {
    return "[]"
  }

  try {
    // Step 1: Handle common Google Sheets export issues
    // Remove BOM and other invisible characters
    s = s.replace(/^\uFEFF/, "") // Remove BOM
    s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // Remove control characters

    // Step 2: Normalize quotes and line breaks
    s = s.replace(/[""]/g, '"') // Smart quotes to standard
    s = s.replace(/['']/g, "'") // Smart single quotes
    s = s.replace(/(\r\n|\n|\r)/g, " ") // Replace line breaks with spaces
    s = s.replace(/\s+/g, " ") // Collapse multiple spaces

    // Step 3: Handle Google Sheets double-quote escaping
    // In Google Sheets, quotes are often escaped as ""
    s = s.replace(/""/g, '\\"')

    // Step 4: Remove outer wrapping quotes if present
    let iterations = 0
    while (s.startsWith('"') && s.endsWith('"') && iterations < 5) {
      const inner = s.slice(1, -1)
      if (inner.startsWith("[") || inner.startsWith("{")) {
        s = inner
        iterations++
      } else {
        break
      }
    }

    // Step 5: Basic structure validation and repair
    if (!s.startsWith("[") && !s.startsWith("{")) {
      // If it doesn't look like JSON, return empty array
      return "[]"
    }

    // Step 6: Attempt to fix common structural issues
    // Fix missing commas between objects
    s = s.replace(/}\s*{/g, "},{")
    s = s.replace(/]\s*\[/g, "],[")

    // Fix trailing commas
    s = s.replace(/,\s*}/g, "}")
    s = s.replace(/,\s*]/g, "]")

    // Step 7: Handle truncated JSON by attempting to close it
    if (s.startsWith("[") && !s.endsWith("]")) {
      // Count open/close brackets to determine how many we need
      const openBrackets = (s.match(/\[/g) || []).length
      const closeBrackets = (s.match(/\]/g) || []).length
      const openBraces = (s.match(/\{/g) || []).length
      const closeBraces = (s.match(/\}/g) || []).length

      // Add missing closing braces first
      for (let i = 0; i < openBraces - closeBraces; i++) {
        s += "}"
      }

      // Add missing closing brackets
      for (let i = 0; i < openBrackets - closeBrackets; i++) {
        s += "]"
      }
    }

    // Step 8: Final validation attempt
    try {
      JSON.parse(s)
      return s
    } catch (parseError) {
      // If still invalid, try one more repair attempt
      // Remove any trailing incomplete elements
      const lastCommaIndex = s.lastIndexOf(",")
      if (lastCommaIndex > 0) {
        const beforeComma = s.substring(0, lastCommaIndex)
        const afterComma = s.substring(lastCommaIndex + 1).trim()

        // If what comes after the comma looks incomplete, remove it
        if (!afterComma.includes("}") && !afterComma.includes("]")) {
          s = beforeComma

          // Add proper closing
          if (s.startsWith("[")) s += "]"
          if (s.startsWith("{")) s += "}"
        }
      }

      return s
    }
  } catch (error) {
    console.warn("Error in JSON sanitization:", error)
    return "[]"
  }
}

function mapGoogleSheetDataToSpeakers(data: any[][]): Speaker[] {
  if (!data || data.length < 2) {
    // console.warn("mapGoogleSheetDataToSpeakers: No data or only header row found.")
    return []
  }

  const headers = data[0].map((header) => header.toLowerCase().trim().replace(/\s+/g, "_"))
  const speakerRows = data.slice(1)

  return speakerRows
    .map((row, rowIndex) => {
      const speakerData: any = {}
      headers.forEach((header, index) => {
        speakerData[header] = row[index] !== undefined && row[index] !== null ? String(row[index]) : undefined
      })

      const name = speakerData.name?.trim() || `Unnamed Speaker (Row ${rowIndex + 2})`

      const processJsonColumn = (columnData: any, columnName: string): any[] => {
        if (!columnData || typeof columnData !== "string" || columnData.trim() === "") {
          return []
        }

        const originalString = String(columnData).trim()

        // Skip obviously non-JSON content
        if (
          originalString.length > 0 &&
          !originalString.startsWith("[") &&
          !originalString.startsWith("{") &&
          !originalString.startsWith('"[') &&
          !originalString.startsWith('"{')
        ) {
          return []
        }

        // Handle empty JSON cases
        if (originalString === "[]" || originalString === "{}" || originalString === '""') {
          return []
        }

        // Strategy 1: Try parsing directly
        try {
          const parsed = JSON.parse(originalString)
          if (Array.isArray(parsed)) return parsed
          if (typeof parsed === "object" && parsed !== null) return [parsed]
          return []
        } catch (directParseError) {
          // Continue to sanitization
        }

        // Strategy 2: Sanitize and parse
        try {
          const sanitized = sanitizePotentiallyCorruptJsonString(originalString)
          const parsed = JSON.parse(sanitized)
          if (Array.isArray(parsed)) return parsed
          if (typeof parsed === "object" && parsed !== null) return [parsed]
          return []
        } catch (sanitizedParseError) {
          // Strategy 3: Try to extract valid JSON objects manually
          try {
            const objectMatches = originalString.match(/\{[^{}]*\}/g)
            if (objectMatches && objectMatches.length > 0) {
              const validObjects = []
              for (const match of objectMatches) {
                try {
                  const obj = JSON.parse(match)
                  validObjects.push(obj)
                } catch (objError) {
                  // Skip invalid objects
                }
              }
              if (validObjects.length > 0) {
                return validObjects
              }
            }
          } catch (extractError) {
            // Final fallback
          }

          // Log the error for debugging but don't crash the build
          console.warn(
            `JSON parsing failed for ${columnName} for ${name} (Row ${rowIndex + 2}). ` +
              `Original length: ${originalString.length}. ` +
              `Error: ${sanitizedParseError.message}. ` +
              `Sample: "${originalString.substring(0, 100)}..."`,
          )

          return []
        }
      }

      const videos = processJsonColumn(speakerData.videos, "VIDEOS")
      const testimonials = processJsonColumn(speakerData.testimonials, "TESTIMONIALS")

      try {
        return {
          slug:
            speakerData.slug?.trim() ||
            (speakerData.name
              ? speakerData.name.trim().toLowerCase().replace(/\s+/g, "-")
              : `speaker-row-${rowIndex + 2}`),
          name: name,
          title: speakerData.title?.trim() || "N/A",
          bio: speakerData.bio?.trim() || "",
          image: speakerData.image?.trim() || undefined,
          imagePosition: speakerData.image_position?.trim() || "center",
          imageOffsetY: speakerData.image_offset_y?.trim() || "0%",
          programs: speakerData.programs
            ? String(speakerData.programs)
                .split(",")
                .map((s: string) => s.trim())
                .filter((s) => s) // Remove empty strings
            : [],
          industries: speakerData.industries
            ? String(speakerData.industries)
                .split(",")
                .map((s: string) => s.trim())
                .filter((s) => s)
            : [],
          fee: speakerData.fee?.trim() || "Inquire for Fee",
          feeRange: speakerData.fee_range?.trim() || undefined,
          location: speakerData.location?.trim() || "N/A",
          linkedin: speakerData.linkedin?.trim() || undefined,
          twitter: speakerData.twitter?.trim() || undefined,
          website: speakerData.website?.trim() || undefined,
          featured: String(speakerData.featured).toLowerCase() === "true",
          videos: videos,
          testimonials: testimonials,
          tags: speakerData.tags
            ? String(speakerData.tags)
                .split(",")
                .map((s: string) => s.trim())
                .filter((s) => s)
            : [],
          lastUpdated: speakerData.last_updated?.trim() || undefined,
          pronouns: speakerData.pronouns?.trim() || undefined,
          languages: speakerData.languages
            ? String(speakerData.languages)
                .split(",")
                .map((s: string) => s.trim())
                .filter((s) => s)
            : [],
          availability: speakerData.availability?.trim() || undefined,
          isVirtual: String(speakerData.is_virtual).toLowerCase() === "true",
          travelsFrom: speakerData.travels_from?.trim() || undefined,
          topics: speakerData.topics
            ? String(speakerData.topics)
                .split(",")
                .map((s: string) => s.trim())
                .filter((s) => s)
            : [],
          listed: String(speakerData.listed).toLowerCase() !== "false",
          expertise: speakerData.expertise
            ? String(speakerData.expertise)
                .split(",")
                .map((s: string) => s.trim())
                .filter((s) => s)
            : [],
          ranking: speakerData.ranking ? Number.parseInt(String(speakerData.ranking), 10) : 0,
        } as Speaker
      } catch (mappingError) {
        console.error(`Error mapping general speaker data for ${name} (Row ${rowIndex + 2}):`, mappingError)
        return null
      }
    })
    .filter((speaker): speaker is Speaker => speaker !== null)
}

// --- Local Speakers (Fallback Data) ---
const localSpeakers: Speaker[] = [
  {
    slug: "adam-cheyer",
    name: "Adam Cheyer",
    title:
      "VP of AI Experience at Airbnb, Co-Founder of Siri, Gameplanner.ai, Viv Labs, Sentient, and Founding Member of Change.org",
    image: "/speakers/adam-cheyer-headshot.png",
    imagePosition: "top",
    imageOffsetY: "-10px",
    bio: "Adam is an expert in entrepreneurship, artificial intelligence, and scaling startups...",
    programs: [
      "ChatGPT and The Rise of Conversational AI",
      "The Future of AI and Businesses",
      '"Hey SIRI": A Founding Story',
    ],
    topics: ["AI Strategy", "Innovation", "Entrepreneurship"],
    fee: "Please Inquire",
    location: "San Francisco, California",
    linkedin: "https://www.linkedin.com/in/adamcheyer/",
    website: "http://adam.cheyer.com/site/home",
    listed: true,
    featured: true,
    expertise: ["Conversational AI", "Virtual Assistants", "Voice Technology", "AI Product Development"],
    industries: ["Technology", "Consumer Electronics", "Mobile"],
    ranking: 99,
    videos: [{ id: "1", title: "Adam Cheyer on Siri", url: "https://www.youtube.com/watch?v=example" }],
    testimonials: [{ quote: "Adam is a visionary!", author: "A Top CEO", position: "CEO" }],
  },
  {
    slug: "peter-norvig",
    name: "Peter Norvig",
    title: "Former Head of Computational Science at NASA and Director of Research and Search Quality at Google",
    image: "/speakers/peter-norvig-headshot.jpg",
    bio: "Peter Norvig, a distinguished American computer scientist...",
    programs: [
      "The Pursuit of Machine Learning",
      "The Crossroads Between AI and Space",
      "The Challenge & Promise of Artificial Intelligence",
    ],
    topics: ["Machine Learning Theory", "AI Research", "Large Language Models"],
    fee: "$25k to $50k plus travel",
    location: "California, United States",
    linkedin: "https://www.linkedin.com/in/pnorvig/",
    website: "https://norvig.com/",
    listed: true,
    featured: false,
    expertise: ["Artificial Intelligence", "Machine Learning", "Search Algorithms", "AI Education"],
    industries: ["Technology", "Education", "Research"],
    ranking: 100,
    videos: [],
    testimonials: [],
  },
]

// --- Data Fetching and Caching Logic (largely unchanged, console logs can be removed if build issues persist) ---
let allSpeakersCache: Speaker[] | null = null
let lastFetchTime: number | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchAllSpeakersFromSheet(): Promise<Speaker[]> {
  // console.log("fetchAllSpeakersFromSheet: Initiating fetch.")
  if (!SPREADSHEET_ID || !API_KEY) {
    console.error(
      "fetchAllSpeakersFromSheet: Google Sheets API Key or Spreadsheet ID is not configured. Falling back to local data.",
    )
    return localSpeakers
  }
  const range = `${SHEET_NAME}!A:Z`
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`
  try {
    const response = await fetch(url, { next: { revalidate: 300 } })
    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `fetchAllSpeakersFromSheet: Error fetching from Google Sheets API: ${response.status} ${response.statusText}`,
        { error: errorText },
      )
      return localSpeakers
    }
    const data = await response.json()
    const values = data.values
    if (!values || values.length < 2) {
      // console.warn("fetchAllSpeakersFromSheet: No data or only header row returned from Google Sheet. Falling back to local data.")
      return localSpeakers
    }
    const mappedSpeakers = mapGoogleSheetDataToSpeakers(values)
    // console.log(`fetchAllSpeakersFromSheet: Mapped ${mappedSpeakers.length} speakers from sheet data.`)
    if (mappedSpeakers.length === 0 && values.length > 1) {
      // console.warn("fetchAllSpeakersFromSheet: Mapping Google Sheet data resulted in zero speakers, though sheet had data. Falling back to local data.")
      return localSpeakers
    }
    return mappedSpeakers
  } catch (error) {
    console.error(
      "fetchAllSpeakersFromSheet: A critical error occurred during the fetch or mapping from Google Sheets. Falling back to local data.",
      error,
    )
    return localSpeakers
  }
}

export async function getAllSpeakers(): Promise<Speaker[]> {
  const now = Date.now()
  // console.log("getAllSpeakers: Attempting to fetch speakers.")
  if (allSpeakersCache && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
    const listedSpeakers = allSpeakersCache.filter((speaker) => speaker.listed !== false)
    // console.log(`getAllSpeakers: Cache hit. Returning ${listedSpeakers.length} listed speakers.`)
    return listedSpeakers
  }
  try {
    // console.log("getAllSpeakers: Cache miss or expired. Fetching from sheet/fallback.")
    const fetchedSpeakers = await fetchAllSpeakersFromSheet()
    allSpeakersCache = fetchedSpeakers
    lastFetchTime = now
    const listedSpeakers = allSpeakersCache.filter((speaker) => speaker.listed !== false)
    // console.log(`getAllSpeakers: Stored in cache. Returning ${listedSpeakers.length} listed speakers.`)
    return listedSpeakers
  } catch (error) {
    console.error("getAllSpeakers: Critical error during fetch. Falling back to local listed speakers:", error)
    if (!allSpeakersCache) allSpeakersCache = localSpeakers
    return localSpeakers.filter((speaker) => speaker.listed !== false)
  }
}

export async function getFeaturedSpeakers(limit = 8): Promise<Speaker[]> {
  try {
    // console.log("getFeaturedSpeakers: Attempting to get all speakers.")
    const speakers = await getAllSpeakers()
    // console.log(`getFeaturedSpeakers: Received ${speakers.length} speakers.`)
    if (speakers.length === 0) return []
    const featured = speakers.filter((speaker) => speaker.featured === true)
    // console.log(`getFeaturedSpeakers: Found ${featured.length} featured speakers before limit.`)
    return featured.slice(0, limit)
  } catch (error) {
    console.error("getFeaturedSpeakers: Error. Returning empty array:", error)
    return []
  }
}

export async function getSpeakerBySlug(slug: string): Promise<Speaker | undefined> {
  try {
    // console.log(`getSpeakerBySlug: Attempting for slug: ${slug}`)
    if (!allSpeakersCache || !(lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION)) {
      await getAllSpeakers()
    }
    const speaker = allSpeakersCache ? allSpeakersCache.find((s) => s.slug === slug) : undefined
    if (speaker && speaker.listed !== false) return speaker
    if (speaker && speaker.listed === false) {
      // console.warn(`getSpeakerBySlug: Speaker found for slug ${slug} but is not listed: ${speaker.name}`)
    }
    return undefined
  } catch (error) {
    console.error(`getSpeakerBySlug: Failed for slug ${slug}:`, error)
    return undefined
  }
}

export async function searchSpeakers(query: string): Promise<Speaker[]> {
  try {
    const speakers = await getAllSpeakers()
    if (!query || query.trim() === "") return speakers
    const lowerQuery = query.toLowerCase().trim()
    return speakers.filter(
      (speaker) =>
        speaker.name.toLowerCase().includes(lowerQuery) ||
        speaker.title.toLowerCase().includes(lowerQuery) ||
        (speaker.bio && speaker.bio.toLowerCase().includes(lowerQuery)) ||
        (speaker.industries && speaker.industries.some((ind) => ind.toLowerCase().includes(lowerQuery))) ||
        (speaker.programs && speaker.programs.some((prog) => prog.toLowerCase().includes(lowerQuery))) ||
        (speaker.topics && speaker.topics.some((topic) => topic.toLowerCase().includes(lowerQuery))) ||
        (speaker.expertise && speaker.expertise.some((exp) => exp.toLowerCase().includes(lowerQuery))) ||
        (speaker.tags && speaker.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))),
    )
  } catch (error) {
    console.error(`Failed to search speakers with query "${query}":`, error)
    return []
  }
}

export async function getUniqueIndustries(): Promise<string[]> {
  try {
    const speakers = await getAllSpeakers()
    const allIndustries = speakers.flatMap((speaker) => speaker.industries || [])
    const unique = Array.from(new Set(allIndustries.filter((ind) => ind && ind.trim() !== "")))
    return unique.sort()
  } catch (error) {
    console.error("Failed to get unique industries:", error)
    return []
  }
}

export async function getSpeakersByIndustry(industry: string): Promise<Speaker[]> {
  try {
    const allListedSpeakers = await getAllSpeakers()
    if (!industry || industry.trim() === "") return []
    const lowerIndustry = industry.toLowerCase().trim()
    return allListedSpeakers.filter(
      (speaker) => speaker.industries && speaker.industries.some((ind) => ind.toLowerCase().includes(lowerIndustry)),
    )
  } catch (error) {
    console.error(`Error in getSpeakersByIndustry for industry "${industry}":`, error)
    return []
  }
}
