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
const SHEET_NAME = "Speakers" // The name of the sheet/tab within your spreadsheet

function sanitizePotentiallyCorruptJsonString(rawJsonString: string): string {
  if (!rawJsonString || typeof rawJsonString !== "string") {
    return "[]" // Default to empty array string if input is invalid
  }
  let s = rawJsonString.trim()
  if (s === "" || s === "null" || s === "undefined") {
    return "[]"
  }
  try {
    s = s.replace(/^\uFEFF/, "")
    s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    s = s.replace(/[""]/g, '"')
    s = s.replace(/['']/g, "'")
    s = s.replace(/(\r\n|\n|\r)/g, " ")
    s = s.replace(/\s+/g, " ")
    if (s.startsWith('""') && s.endsWith('""')) {
      s = s.slice(2, -2).replace(/""/g, '"')
    } else {
      s = s.replace(/""/g, '"')
    }
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
    if (!s.startsWith("[") && !s.startsWith("{")) {
      return "[]"
    }
    s = s.replace(/}\s*{/g, "},{")
    s = s.replace(/]\s*\[/g, "],[")
    s = s.replace(/,\s*}/g, "}")
    s = s.replace(/,\s*]/g, "]")
    if (s.startsWith("[") && !s.endsWith("]")) {
      const openBrackets = (s.match(/\[/g) || []).length
      const closeBrackets = (s.match(/\]/g) || []).length
      const openBraces = (s.match(/\{/g) || []).length
      const closeBraces = (s.match(/\}/g) || []).length
      for (let i = 0; i < openBraces - closeBraces; i++) {
        s += "}"
      }
      for (let i = 0; i < openBrackets - closeBrackets; i++) {
        s += "]"
      }
    }
    try {
      JSON.parse(s) // Tries to parse the sanitized string
      return s
    } catch (parseError) {
      const lastCommaIndex = s.lastIndexOf(",")
      if (lastCommaIndex > 0) {
        const beforeComma = s.substring(0, lastCommaIndex)
        const afterComma = s.substring(lastCommaIndex + 1).trim()
        if (!afterComma.includes("}") && !afterComma.includes("]")) {
          s = beforeComma
          if (s.startsWith("[")) s += "]"
          if (s.startsWith("{")) s += "}"
        }
      }
      return s // Returns the string even if still unparsable, relying on caller's error handling
    }
  } catch (error) {
    console.warn("Error in JSON sanitization:", error)
    return "[]"
  }
}

function mapGoogleSheetDataToSpeakers(data: any[][]): Speaker[] {
  console.log("🔧 mapGoogleSheetDataToSpeakers called with data length:", data?.length)

  if (!data || data.length < 2) {
    return []
  }
  const headers = data[0].map((header) => header.toLowerCase().trim().replace(/\s+/g, "_"))
  console.log("📋 Headers found:", headers)

  const speakerRows = data.slice(1)
  console.log("👥 Processing", speakerRows.length, "speaker rows")

  return speakerRows
    .map((row, rowIndex) => {
      const speakerData: any = {}
      headers.forEach((header, index) => {
        speakerData[header] = row[index] !== undefined && row[index] !== null ? String(row[index]) : undefined
      })
      const name = speakerData.name?.trim() || `Unnamed Speaker (Row ${rowIndex + 2})`

      // Debug for Adam Cheyer specifically - check raw data
      if (name.toLowerCase().includes("adam cheyer")) {
        console.log("🎯 Found Adam Cheyer - Raw sheet data:", {
          name: speakerData.name,
          videosRaw: speakerData.videos,
          videosType: typeof speakerData.videos,
          videosLength: speakerData.videos?.length,
          rowIndex: rowIndex + 2,
          allSpeakerData: Object.keys(speakerData),
        })
      }
      const processJsonColumn = (columnData: any, columnName: string): any[] => {
        if (!columnData || typeof columnData !== "string" || columnData.trim() === "") {
          return []
        }
        const originalString = String(columnData).trim()

        // Debug logging for Adam Cheyer specifically
        if (name.toLowerCase().includes("adam cheyer") && columnName === "VIDEOS") {
          console.log("🔍 Adam Cheyer Video Processing Debug:", {
            originalLength: originalString.length,
            originalSample: originalString.substring(0, 200) + "...",
            startsWithBracket: originalString.startsWith("["),
            startsWithQuoteBracket: originalString.startsWith('"['),
            hasDoubleQuotes: originalString.includes('""'),
          })
        }

        if (
          originalString.length > 0 &&
          !originalString.startsWith("[") &&
          !originalString.startsWith("{") &&
          !originalString.startsWith('"[') &&
          !originalString.startsWith('"{')
        ) {
          return []
        }
        if (originalString === "[]" || originalString === "{}" || originalString === '""') {
          return []
        }

        // Try direct parsing first
        try {
          const parsed = JSON.parse(originalString)
          if (name.toLowerCase().includes("adam cheyer") && columnName === "VIDEOS") {
            console.log("✅ Direct parse successful for Adam Cheyer:", {
              parsedCount: Array.isArray(parsed) ? parsed.length : 1,
              parsedData: parsed,
            })
          }
          if (Array.isArray(parsed)) return parsed
          if (typeof parsed === "object" && parsed !== null) return [parsed]
          return []
        } catch (directParseError) {
          if (name.toLowerCase().includes("adam cheyer") && columnName === "VIDEOS") {
            console.log("❌ Direct parse failed for Adam Cheyer:", directParseError.message)
          }
        }

        // Try sanitized parsing
        try {
          const sanitized = sanitizePotentiallyCorruptJsonString(originalString)
          if (name.toLowerCase().includes("adam cheyer") && columnName === "VIDEOS") {
            console.log("🧹 Sanitized string for Adam Cheyer:", {
              sanitizedLength: sanitized.length,
              sanitizedSample: sanitized.substring(0, 200) + "...",
              originalVsSanitized:
                originalString.substring(0, 100) + "..." + " VS " + sanitized.substring(0, 100) + "...",
            })
          }

          const parsed = JSON.parse(sanitized)
          if (name.toLowerCase().includes("adam cheyer") && columnName === "VIDEOS") {
            console.log("✅ Sanitized parse successful for Adam Cheyer:", {
              parsedCount: Array.isArray(parsed) ? parsed.length : 1,
              parsedData: parsed,
            })
          }
          if (Array.isArray(parsed)) return parsed
          if (typeof parsed === "object" && parsed !== null) return [parsed]
          return []
        } catch (sanitizedParseError) {
          if (name.toLowerCase().includes("adam cheyer") && columnName === "VIDEOS") {
            console.log("❌ Sanitized parse also failed for Adam Cheyer:", sanitizedParseError.message)
          }

          try {
            const objectMatches = originalString.match(/\{[^{}]*\}/g)
            if (objectMatches && objectMatches.length > 0) {
              const validObjects = []
              for (const match of objectMatches) {
                try {
                  const obj = JSON.parse(match)
                  validObjects.push(obj)
                } catch (objError) {
                  /* skip */
                }
              }
              if (validObjects.length > 0) return validObjects
            }
          } catch (extractError) {
            /* fallback */
          }
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

      // Final debug for Adam Cheyer
      if (name.toLowerCase().includes("adam cheyer")) {
        console.log("🎬 Adam Cheyer Final Video Processing Result:", {
          videosCount: videos.length,
          videos: videos,
          hasSecondVideo: videos.length > 1,
          secondVideoThumbnail: videos[1]?.thumbnail,
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
        })
      }

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
            ? Array.isArray(speakerData.programs)
              ? speakerData.programs
              : String(speakerData.programs)
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter((s) => s)
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

let allSpeakersCache: Speaker[] | null = null
let lastFetchTime: number | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchAllSpeakersFromDatabase(): Promise<Speaker[]> {
  try {
    // For server-side rendering and static generation, try to fetch from database directly
    if (typeof window === 'undefined') {
      // We're on the server - try to import the database function directly
      try {
        const { getAllSpeakers: getAllSpeakersFromDB } = await import('./speakers-db')
        const dbSpeakers = await getAllSpeakersFromDB()
        if (dbSpeakers && dbSpeakers.length > 0) {
          console.log(`Fetched ${dbSpeakers.length} speakers from database directly`)
          // Transform database speakers to match our Speaker interface
          const transformedSpeakers = dbSpeakers.map((speaker: any) => ({
            slug: speaker.slug || speaker.name?.toLowerCase().replace(/\s+/g, '-') || `speaker-${speaker.id}`,
            name: speaker.name,
            title: speaker.title || speaker.one_liner || '',
            bio: speaker.bio || speaker.short_bio || '',
            image: speaker.headshot_url || speaker.profile_photo_url,
            imagePosition: speaker.image_position || 'center',
            imageOffsetY: speaker.image_offset || '0%',
            programs: Array.isArray(speaker.programs) && speaker.programs.length > 0 
              ? speaker.programs 
              : (speaker.primary_topics || []),
            industries: speaker.industries || speaker.industries_served || [],
            fee: speaker.speaking_fee_range || 'Please Inquire',
            feeRange: speaker.speaking_fee_range,
            location: speaker.location || speaker.travel_preferences,
            linkedin: speaker.social_media?.linkedin,
            twitter: speaker.social_media?.twitter,
            website: speaker.website,
            featured: speaker.featured || speaker.preferred_partner || false,
            videos: speaker.videos || [],
            testimonials: speaker.testimonials || [],
            tags: speaker.keywords || [],
            topics: speaker.topics || speaker.primary_topics || [],
            listed: speaker.listed !== false && speaker.active !== false,
            expertise: speaker.expertise || speaker.primary_topics || [],
            ranking: speaker.ranking || speaker.internal_rating || 0,
          }))
          return transformedSpeakers
        }
        console.log("No speakers found in database")
        return localSpeakers
      } catch (dbError) {
        console.log("Could not fetch from database directly, using local speakers:", dbError)
        return localSpeakers
      }
    }
    
    // Client-side: fetch from API
    const baseUrl = window.location.origin
    
    const response = await fetch(`${baseUrl}/api/speakers`, {
      next: { revalidate: 3600 } // Cache for 1 hour instead of no-store
    })

    if (!response.ok) {
      console.error("Failed to fetch speakers from database API. " + 
                   `Status: ${response.status}, ${response.statusText}.`)
      return localSpeakers
    }

    const data = await response.json()
    
    if (!data.success || !data.speakers) {
      console.warn("Invalid response format from speakers API. Falling back to local speakers.")
      return localSpeakers
    }

    // Convert API response to Speaker interface format
    const speakers: Speaker[] = data.speakers.map((speaker: any) => ({
      slug: speaker.slug,
      name: speaker.name,
      title: speaker.title,
      bio: speaker.bio,
      image: speaker.image,
      imagePosition: speaker.imagePosition,
      imageOffsetY: speaker.imageOffsetY,
      programs: speaker.programs || [],
      industries: speaker.industries || [],
      fee: speaker.fee,
      feeRange: speaker.feeRange,
      location: speaker.location,
      website: speaker.website,
      featured: speaker.featured,
      videos: speaker.videos || [],
      testimonials: speaker.testimonials || [],
      topics: speaker.topics || [],
      listed: speaker.listed,
      expertise: speaker.expertise || [],
      ranking: speaker.ranking || 0,
      // Additional fields that might be useful
      linkedin: speaker.socialMedia?.linkedin,
      twitter: speaker.socialMedia?.twitter,
    }))

    console.log(`🎯 Fetched ${speakers.length} speakers from database`)
    return speakers

  } catch (error) {
    console.error("Error fetching speakers from database:", error)
    return localSpeakers
  }
}

export async function getAllSpeakers(): Promise<Speaker[]> {
  console.log("🔄 getAllSpeakers called - fetching from database")

  try {
    const fetchedSpeakers = await fetchAllSpeakersFromDatabase()
    allSpeakersCache = fetchedSpeakers
    lastFetchTime = Date.now()
    return allSpeakersCache
      .filter((speaker) => speaker.listed !== false) // Filters out unlisted speakers
      .sort((a, b) => (b.ranking || 0) - (a.ranking || 0)) // Sorts by ranking
  } catch (error) {
    console.error("Critical error during fetch. Falling back to local listed speakers:", error)
    if (!allSpeakersCache) allSpeakersCache = localSpeakers
    return localSpeakers.filter((speaker) => speaker.listed !== false)
  }
}

export async function getFeaturedSpeakers(limit = 8): Promise<Speaker[]> {
  try {
    const speakers = await getAllSpeakers()
    if (speakers.length === 0) return []
    const featured = speakers
      .filter((speaker) => speaker.featured === true)
      .sort((a, b) => (b.ranking || 0) - (a.ranking || 0))
    return featured.slice(0, limit)
  } catch (error) {
    console.error("getFeaturedSpeakers: Error. Returning empty array:", error)
    return []
  }
}

export async function getSpeakerBySlug(slug: string): Promise<Speaker | undefined> {
  try {
    if (!allSpeakersCache || !(lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION)) {
      await getAllSpeakers()
    }
    const speaker = allSpeakersCache ? allSpeakersCache.find((s) => s.slug === slug) : undefined
    if (speaker && speaker.listed !== false) return speaker
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
    return speakers
      .filter(
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
      .sort((a, b) => (b.ranking || 0) - (a.ranking || 0))
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

    const normalizedIndustry = industry.toLowerCase().trim()

    const filteredSpeakers = allListedSpeakers.filter((speaker) => {
      if (!speaker.industries || speaker.industries.length === 0) return false

      // Get the primary industry (first tag) - this is what shows in the top-left badge
      const primaryIndustry = speaker.industries[0].toLowerCase().trim()

      switch (normalizedIndustry) {
        case "technology":
          return (
            primaryIndustry === "technology" ||
            primaryIndustry === "enterprise technology" ||
            primaryIndustry === "tech" ||
            primaryIndustry === "software" ||
            primaryIndustry === "artificial intelligence" ||
            primaryIndustry === "ai" ||
            primaryIndustry.includes("technology") ||
            primaryIndustry.includes("tech") ||
            primaryIndustry.includes("software") ||
            primaryIndustry.includes("ai")
          )

        case "healthcare":
          return (
            primaryIndustry === "healthcare" ||
            primaryIndustry === "medical" ||
            primaryIndustry === "health" ||
            primaryIndustry.includes("healthcare") ||
            primaryIndustry.includes("medical") ||
            primaryIndustry.includes("health")
          )

        case "finance":
          return (
            primaryIndustry === "finance" ||
            primaryIndustry === "financial services" ||
            primaryIndustry === "banking" ||
            primaryIndustry === "venture capital" ||
            primaryIndustry === "vc" ||
            primaryIndustry === "investment" ||
            primaryIndustry === "private equity" ||
            primaryIndustry.includes("finance") ||
            primaryIndustry.includes("banking") ||
            primaryIndustry.includes("venture") ||
            primaryIndustry.includes("investment")
          )

        case "leadership":
          return (
            primaryIndustry === "leadership" ||
            primaryIndustry === "business strategy" ||
            primaryIndustry === "executive" ||
            primaryIndustry === "consulting" ||
            primaryIndustry === "management consulting" ||
            primaryIndustry === "strategy consulting" ||
            primaryIndustry.includes("leadership") ||
            primaryIndustry.includes("strategy") ||
            primaryIndustry.includes("consulting") ||
            primaryIndustry.includes("executive")
          )

        case "sales":
          return (
            primaryIndustry === "sales" ||
            primaryIndustry === "marketing" ||
            primaryIndustry === "e-commerce" ||
            primaryIndustry === "ecommerce" ||
            primaryIndustry === "online retail" ||
            primaryIndustry.includes("sales") ||
            primaryIndustry.includes("marketing") ||
            primaryIndustry.includes("e-commerce") ||
            primaryIndustry.includes("ecommerce") ||
            primaryIndustry.includes("retail")
          )

        default:
          // For other industries, use exact match or starts with
          return primaryIndustry === normalizedIndustry || primaryIndustry.startsWith(normalizedIndustry + " ")
      }
    })

    return filteredSpeakers
  } catch (error) {
    console.error(`Error in getSpeakersByIndustry for industry "${industry}":`, error)
    return []
  }
}
