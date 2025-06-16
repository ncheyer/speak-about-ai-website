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
    position?: string
    company?: string
    event?: string
    date?: string
    logo?: string
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

function fixBrokenJsonString(str: string): string {
  let s = str.trim()
  s = s.replace(/[“”]/g, '"')
  s = s.replace(/[‘’]/g, "'")
  s = s.replace(/(\r\n|\n|\r)+/gm, " ")
  const firstBracket = s.indexOf("[")
  const firstBrace = s.indexOf("{")
  let startIndex = -1
  if (firstBracket === -1 && firstBrace === -1) return s
  if (firstBracket !== -1 && firstBrace !== -1) {
    startIndex = Math.min(firstBracket, firstBrace)
  } else {
    startIndex = firstBracket !== -1 ? firstBracket : firstBrace
  }
  const lastBracket = s.lastIndexOf("]")
  const lastBrace = s.lastIndexOf("}")
  let endIndex = -1
  if (lastBracket !== -1 && lastBrace !== -1) {
    endIndex = Math.max(lastBracket, lastBrace)
  } else {
    endIndex = lastBracket !== -1 ? lastBracket : lastBrace
  }
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return s
  }
  let coreJson = s.substring(startIndex, endIndex + 1)
  coreJson = coreJson.replace(/""/g, '"')
  return coreJson
}

function mapGoogleSheetDataToSpeakers(data: any[][]): Speaker[] {
  if (!data || data.length < 2) {
    console.warn("mapGoogleSheetDataToSpeakers: No data or only header row found.")
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
        const originalString = columnData.trim()
        try {
          const parsed = JSON.parse(originalString)
          return Array.isArray(parsed) ? parsed : []
        } catch (e1) {
          // Failed, try fixing
        }
        try {
          const fixedJson = fixBrokenJsonString(originalString)
          const parsed = JSON.parse(fixedJson)
          return Array.isArray(parsed) ? parsed : []
        } catch (e2) {
          console.error(
            `CRITICAL PARSE ERROR for ${columnName} for ${name}. Original: "${originalString.substring(0, 150)}...". Error: ${(e2 as Error).message}`,
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
            : [],
          industries: speakerData.industries
            ? String(speakerData.industries)
                .split(",")
                .map((s: string) => s.trim())
            : [],
          fee: speakerData.fee?.trim() || "Inquire for Fee",
          location: speakerData.location?.trim() || "N/A",
          linkedin: speakerData.linkedin?.trim() || undefined,
          website: speakerData.website?.trim() || undefined,
          featured: String(speakerData.featured).toLowerCase() === "true",
          videos: videos,
          testimonials: testimonials,
          listed: String(speakerData.listed).toLowerCase() !== "false",
          expertise: speakerData.expertise
            ? String(speakerData.expertise)
                .split(",")
                .map((s: string) => s.trim())
            : [],
          ranking: speakerData.ranking ? Number.parseInt(String(speakerData.ranking), 10) : 0,
        } as Speaker
      } catch (mappingError) {
        console.error(`Error mapping general speaker data for ${name}:`, mappingError)
        return null
      }
    })
    .filter((speaker): speaker is Speaker => speaker !== null)
}

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
    fee: "Please Inquire",
    location: "San Francisco, California",
    linkedin: "https://www.linkedin.com/in/adamcheyer/",
    website: "http://adam.cheyer.com/site/home",
    listed: true,
    featured: true, // MODIFIED: Adam Cheyer is now featured in local fallback
    expertise: ["Conversational AI", "Virtual Assistants", "Voice Technology", "AI Product Development"],
    industries: ["Technology", "Consumer Electronics", "Mobile"],
    ranking: 99,
    testimonials: [{ quote: "Adam is a visionary!", author: "A Top CEO" }],
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
    fee: "$25k to $50k plus travel",
    location: "California, United States",
    linkedin: "https://www.linkedin.com/in/pnorvig/",
    website: "https://norvig.com/",
    listed: true,
    featured: false, // Explicitly not featured or omit
    expertise: ["Artificial Intelligence", "Machine Learning", "Search Algorithms", "AI Education"],
    industries: ["Technology", "Education", "Research"],
    ranking: 100,
  },
]

let allSpeakersCache: Speaker[] | null = null
let lastFetchTime: number | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchAllSpeakersFromSheet(): Promise<Speaker[]> {
  console.log("fetchAllSpeakersFromSheet: Initiating fetch.")
  if (!SPREADSHEET_ID || !API_KEY) {
    console.error(
      "fetchAllSpeakersFromSheet: Google Sheets API Key or Spreadsheet ID is not configured. Falling back to local data.",
    )
    console.log(`fetchAllSpeakersFromSheet: Returning ${localSpeakers.length} local speakers due to config issue.`)
    return localSpeakers
  }
  const range = `${SHEET_NAME}!A:Z` // Assuming data up to column Z
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`
  try {
    const response = await fetch(url, { next: { revalidate: 300 } }) // Revalidate every 5 minutes
    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `fetchAllSpeakersFromSheet: Error fetching from Google Sheets API: ${response.status} ${response.statusText}`,
        {
          error: errorText,
        },
      )
      console.log(`fetchAllSpeakersFromSheet: Returning ${localSpeakers.length} local speakers due to API error.`)
      return localSpeakers
    }
    const data = await response.json()
    const values = data.values
    if (!values || values.length < 2) {
      // Need at least header + 1 data row
      console.warn(
        "fetchAllSpeakersFromSheet: No data or only header row returned from Google Sheet. Falling back to local data.",
      )
      console.log(
        `fetchAllSpeakersFromSheet: Returning ${localSpeakers.length} local speakers due to no data in sheet.`,
      )
      return localSpeakers
    }
    const mappedSpeakers = mapGoogleSheetDataToSpeakers(values)
    console.log(`fetchAllSpeakersFromSheet: Mapped ${mappedSpeakers.length} speakers from sheet data.`)
    if (mappedSpeakers.length === 0 && values.length > 1) {
      console.warn(
        "fetchAllSpeakersFromSheet: Mapping Google Sheet data resulted in zero speakers, though sheet had data. Check mapping logic and sheet structure. Falling back to local data.",
      )
      console.log(`fetchAllSpeakersFromSheet: Returning ${localSpeakers.length} local speakers due to mapping issue.`)
      return localSpeakers
    }
    console.log(
      `fetchAllSpeakersFromSheet: Successfully fetched and mapped ${mappedSpeakers.length} speakers from Google Sheet.`,
    )
    return mappedSpeakers
  } catch (error) {
    console.error(
      "fetchAllSpeakersFromSheet: A critical error occurred during the fetch or mapping from Google Sheets. Falling back to local data.",
      error,
    )
    console.log(`fetchAllSpeakersFromSheet: Returning ${localSpeakers.length} local speakers due to critical error.`)
    return localSpeakers
  }
}

export async function getAllSpeakers(): Promise<Speaker[]> {
  const now = Date.now()
  console.log("getAllSpeakers: Attempting to fetch speakers.")
  if (allSpeakersCache && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
    const listedSpeakers = allSpeakersCache.filter((speaker) => speaker.listed !== false)
    console.log(
      `getAllSpeakers: Cache hit. Returning ${listedSpeakers.length} listed speakers out of ${allSpeakersCache.length} total cached.`,
    )
    return listedSpeakers
  }
  try {
    console.log("getAllSpeakers: Cache miss or expired. Fetching from sheet/fallback.")
    const fetchedSpeakers = await fetchAllSpeakersFromSheet()
    console.log(`getAllSpeakers: Fetched ${fetchedSpeakers.length} speakers from sheet/fallback.`)
    allSpeakersCache = fetchedSpeakers
    lastFetchTime = now
    const listedSpeakers = allSpeakersCache.filter((speaker) => speaker.listed !== false)
    console.log(
      `getAllSpeakers: Stored in cache. Returning ${listedSpeakers.length} listed speakers out of ${allSpeakersCache.length} total.`,
    )
    return listedSpeakers
  } catch (error) {
    console.error("getAllSpeakers: Critical error during fetch. Falling back to local listed speakers:", error)
    if (!allSpeakersCache) {
      console.log("getAllSpeakers: Cache was empty, assigning localSpeakers.")
      allSpeakersCache = localSpeakers // Use the module-level localSpeakers
      lastFetchTime = now
    }
    // Fallback to the module-level localSpeakers if an error occurs
    const listedLocalSpeakers = localSpeakers.filter((speaker) => speaker.listed !== false)
    console.log(`getAllSpeakers: Error fallback. Returning ${listedLocalSpeakers.length} listed local speakers.`)
    return listedLocalSpeakers
  }
}

export async function getFeaturedSpeakers(limit = 8): Promise<Speaker[]> {
  try {
    console.log("getFeaturedSpeakers: Attempting to get all speakers.")
    const speakers = await getAllSpeakers()
    console.log(`getFeaturedSpeakers: Received ${speakers.length} speakers from getAllSpeakers.`)

    if (speakers.length === 0) {
      console.warn("getFeaturedSpeakers: getAllSpeakers returned an empty array. No speakers to filter for featured.")
      return []
    }

    const featured = speakers.filter((speaker) => speaker.featured === true)
    console.log(`getFeaturedSpeakers: Found ${featured.length} featured speakers before limit.`)

    if (featured.length === 0 && speakers.length > 0) {
      console.warn("getFeaturedSpeakers: No speakers are marked as featured from the available list.")
      speakers
        .slice(0, 5)
        .forEach((s) =>
          console.log(
            `getFeaturedSpeakers Sample speaker: ${s.name}, featured status: ${s.featured}, listed status: ${s.listed}`,
          ),
        )
    }

    return featured.slice(0, limit)
  } catch (error) {
    console.error("getFeaturedSpeakers: Error while trying to get featured speakers. Returning empty array:", error)
    return []
  }
}

export async function getSpeakerBySlug(slug: string): Promise<Speaker | undefined> {
  try {
    console.log(`getSpeakerBySlug: Attempting to get speaker: ${slug}`)
    // Ensure cache is populated if it's stale or empty
    if (!allSpeakersCache || !(lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION)) {
      console.log(`getSpeakerBySlug: Cache miss/stale for ${slug}, refreshing all speakers.`)
      await getAllSpeakers()
    } else {
      console.log(`getSpeakerBySlug: Cache hit for ${slug}.`)
    }

    const speaker = allSpeakersCache ? allSpeakersCache.find((s) => s.slug === slug) : undefined

    if (speaker) {
      console.log(`getSpeakerBySlug: Found speaker ${speaker.name} for slug ${slug}. Listed: ${speaker.listed}`)
      if (speaker.listed !== false) {
        return speaker
      } else {
        console.warn(`getSpeakerBySlug: Speaker found for slug ${slug} but is not listed: ${speaker.name}`)
        return undefined
      }
    } else {
      console.log(`getSpeakerBySlug: Speaker not found for slug ${slug}.`)
      return undefined
    }
  } catch (error) {
    console.error(`getSpeakerBySlug: Failed to get speaker by slug ${slug}:`, error)
    return undefined
  }
}

export async function searchSpeakers(query: string): Promise<Speaker[]> {
  try {
    const speakers = await getAllSpeakers()
    if (!query || query.trim() === "") {
      return speakers
    }
    const lowerQuery = query.toLowerCase().trim()
    // ... (rest of search logic)
    return speakers.filter((speaker) => {
      // Ensure you return the filtered list
      return (
        speaker.name.toLowerCase().includes(lowerQuery) ||
        speaker.title.toLowerCase().includes(lowerQuery) ||
        (speaker.bio && speaker.bio.toLowerCase().includes(lowerQuery)) ||
        (speaker.industries && speaker.industries.some((ind) => ind.toLowerCase().includes(lowerQuery))) ||
        (speaker.programs && speaker.programs.some((prog) => prog.toLowerCase().includes(lowerQuery))) ||
        (speaker.topics && speaker.topics.some((topic) => topic.toLowerCase().includes(lowerQuery))) ||
        (speaker.expertise && speaker.expertise.some((exp) => exp.toLowerCase().includes(lowerQuery))) ||
        (speaker.tags && speaker.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)))
      )
    })
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
    const allListedSpeakers = await getAllSpeakers() // ensure it gets listed speakers
    if (!industry || industry.trim() === "") {
      return []
    }
    const lowerIndustry = industry.toLowerCase().trim()
    return allListedSpeakers.filter(
      // ensure you return the filtered list
      (speaker) => speaker.industries && speaker.industries.some((ind) => ind.toLowerCase().includes(lowerIndustry)),
    )
  } catch (error) {
    console.error(`Error in getSpeakersByIndustry for industry "${industry}":`, error)
    return []
  }
}
