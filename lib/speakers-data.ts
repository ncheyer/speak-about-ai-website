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
 * @param rawJsonString The potentially broken JSON string.
 * @param speakerName For logging purposes.
 * @param fieldName For logging purposes.
 * @returns A cleaner string that is more likely to be valid JSON.
 */
function sanitizePotentiallyCorruptJsonString(rawJsonString: string): string {
  if (!rawJsonString || typeof rawJsonString !== "string") {
    return "" // Return empty string; JSON.parse will fail, caught by caller
  }

  let s = rawJsonString.trim()

  // 1. Normalize smart quotes and newlines
  s = s.replace(/[“”]/g, '"') // Smart double quotes to standard
  s = s.replace(/[‘’]/g, "'") // Smart single quotes to standard (JSON prefers double, but this helps clean)
  s = s.replace(/(\r\n|\n|\r)+/gm, " ") // Replace newlines with space

  // 2. Attempt to strip common non-JSON prefixes like "json" if they appear before structure
  if (s.toLowerCase().startsWith("json") && (s.charAt(4) === '"' || s.charAt(4) === "[" || s.charAt(4) === "{")) {
    s = s.substring(4).trim()
  }

  // 3. Iteratively remove outer quotes if the whole string is wrapped.
  //    Example: `"""[...]"""` becomes `[...]`
  let prevStringLength
  do {
    prevStringLength = s.length
    if (s.startsWith('"') && s.endsWith('"') && s.length > 1) {
      const inner = s.substring(1, s.length - 1).trim()
      // Only unwrap if the inner content looks like a plausible JSON structure or is itself quoted
      if (
        (inner.startsWith("[") && inner.endsWith("]")) ||
        (inner.startsWith("{") && inner.endsWith("}")) ||
        (inner.startsWith('"') && inner.endsWith('"')) || // Handles nested quoting like """value"""
        !inner.includes('"')
      ) {
        // Or if inner has no quotes, it might be a simple value that was over-quoted
        s = inner
      } else {
        // If inner content is complex and not clearly structured, stop unwrapping
        break
      }
    }
  } while (s.length < prevStringLength && s.length > 1)

  // 4. Handle Google Sheets' common way of escaping quotes: "" -> \"
  //    This is crucial for content like {""key"": ""value""} or {"text": "value with ""quotes"" inside"}
  s = s.replace(/""/g, '\\"')

  // 5. Basic structural check: if it's not empty, it should ideally start/end with brackets/braces.
  //    This is a weak check; deeper validation happens at parse time.
  if (s.length > 0 && !((s.startsWith("[") && s.endsWith("]")) || (s.startsWith("{") && s.endsWith("}")))) {
    // If it doesn't look like an array or object after initial cleaning,
    // it might be a simple string value or still be malformed.
    // We'll let JSON.parse attempt it. If it's a valid simple string like "text", parse will fail.
    // If it was supposed to be an object/array but is broken, parse will also fail.
  }

  if (s.length === 0) return "[]" // Default to empty array string if it becomes empty

  // 6. Attempt to fix common missing comma issues. Applied to the cleaned string.
  let coreJson = s
  // Between objects: {}{ } -> {},{}
  coreJson = coreJson.replace(/}\s*{/g, "},{")
  // Between arrays: [][] -> [],[]
  coreJson = coreJson.replace(/]\s*\[/g, "],[")
  // Object then array: {}[] -> {},[]
  coreJson = coreJson.replace(/}\s*\[/g, "},[")
  // Array then object: []{} -> [],{}
  coreJson = coreJson.replace(/]\s*{/g, "],{")

  // After a string value, before another string key: "value" "key": -> "value", "key":
  coreJson = coreJson.replace(/("(?:\\[\s\S]|[^"])*")\s+("(?:\\[\s\S]|[^"])*"\s*:)/g, "$1, $2")
  // After a number, boolean, or null, before a string key: 123 "key": -> 123, "key":
  coreJson = coreJson.replace(
    /(\b(?:[0-9]+(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?|true|false|null)\b)\s+("(?:\\[\s\S]|[^"])*"\s*:)/g,
    "$1, $2",
  )
  // After a closing brace or bracket, before a string key: } "key": -> }, "key":
  coreJson = coreJson.replace(/([}\]])\s+("(?:\\[\s\S]|[^"])*"\s*:)/g, "$1, $2")

  // Fix trailing commas before closing brace/bracket (JSON5 allows them, but standard JSON doesn't)
  coreJson = coreJson.replace(/,\s*}/g, "}")
  coreJson = coreJson.replace(/,\s*]/g, "]")

  // Attempt to ensure outer structure is an array if it looks like a list of objects/values not wrapped in []
  // This is heuristic: if it contains '},{' but doesn't start/end with '[', ']', wrap it.
  if (coreJson.includes("},{") && !coreJson.startsWith("[")) {
    coreJson = "[" + coreJson + "]"
  }

  // Fix for unterminated strings: if a string seems to end prematurely before a comma or closing bracket/brace
  // This is very heuristic. Example: {"text": "unterminated, "key": "value"}
  // We can try to add a quote if a comma or brace/bracket immediately follows an odd number of quotes.
  // This is complex and risky. For now, we rely on JSON.parse to report unterminated strings.

  return coreJson
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

        // Attempt 1: Parse the string directly (if it's already valid JSON)
        try {
          // Quick check: if it doesn't start with [ or {, it's unlikely to be a JSON array/object string.
          if (originalString.length > 0 && !originalString.startsWith("[") && !originalString.startsWith("{")) {
            // console.warn(
            //   `Skipping non-JSON-like string for ${columnName} for ${name} (Row ${rowIndex + 2}). Value: "${originalString.substring(0,100)}..."`
            // );
            return [] // Not a JSON array/object
          }
          if (originalString === "[]" || originalString === "{}") return [] // Empty valid JSON

          const parsed = JSON.parse(originalString)
          if (Array.isArray(parsed)) return parsed
          if (typeof parsed === "object" && parsed !== null) return [parsed] // Wrap single object in array
          return [] // Parsed to something else (e.g. null, string, number)
        } catch (e1) {
          // Failed direct parse, proceed to sanitize and retry
        }

        // Attempt 2: Sanitize and then parse.
        let sanitizedJson = ""
        try {
          sanitizedJson = sanitizePotentiallyCorruptJsonString(originalString)
          if (sanitizedJson === "[]" || sanitizedJson === "{}") return [] // Empty valid JSON after sanitization

          const parsed = JSON.parse(sanitizedJson)
          if (Array.isArray(parsed)) return parsed
          if (typeof parsed === "object" && parsed !== null) return [parsed] // Wrap single object
          return []
        } catch (e2) {
          console.error(
            `CRITICAL JSON PARSE ERROR for ${columnName} for ${name} (Row ${rowIndex + 2}). Failed after sanitization. Error: ${(e2 as Error).message}. Original: "${originalString.substring(0, 150)}...". Sanitized: "${sanitizedJson.substring(0, 150)}..."`,
          )
          return [] // Return empty array on final failure
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
