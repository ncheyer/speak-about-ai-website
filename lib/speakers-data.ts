import { google } from "googleapis"

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
  videos?: string[]
  testimonials?: { quote: string; author: string }[]
  tags?: string[]
  lastUpdated?: string
  pronouns?: string
  languages?: string[]
  availability?: string
  isVirtual?: boolean
  travelsFrom?: string
  topics?: string[] // Consolidate programs/keynotes here if needed
  listed?: boolean
  expertise?: string[]
  ranking?: number
  // Add structured fields for videos
  // videos?: {
  //   id: string // Unique identifier for the video
  //   title: string // Title of the video
  //   url: string // YouTube or other video platform URL
  //   thumbnail?: string // Optional custom thumbnail URL (if not provided, can use YouTube thumbnail)
  //   source?: string // Source platform (e.g., "YouTube", "Vimeo")
  //   duration?: string // Duration in format "MM:SS"
  //   description?: string // Optional description of the video content
  //   date?: string // Optional recording date
  // }[]
  // // Add structured fields for testimonials
  // testimonials?: {
  //   quote: string // The testimonial text
  //   author: string // Name of the person giving the testimonial
  //   position: string // Job title of the person
  //   company: string // Company or organization
  //   event?: string // Optional event where the speaker presented
  //   date?: string // Optional date of the testimonial
  //   logo?: string // Optional company logo URL
  // }[]
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY
const SHEET_NAME = "Speakers" // Assuming your sheet name is "Speakers"

const sheets = google.sheets({ version: "v4", auth: API_KEY })

// More defensive mapping with defaults for ALL fields
function mapGoogleSheetDataToSpeakers(data: any[][]): Speaker[] {
  if (!data || data.length < 2) {
    console.warn("No data or only header row found in Google Sheet.")
    return []
  }

  const headers = data[0].map((header) => header.toLowerCase().trim().replace(/\s+/g, "_")) // Normalize headers
  const speakerRows = data.slice(1)

  return speakerRows
    .map((row, rowIndex) => {
      const speakerData: any = {}
      headers.forEach((header, index) => {
        speakerData[header] = row[index] !== undefined && row[index] !== null ? String(row[index]).trim() : undefined
      })

      // Ensure essential fields have fallbacks to prevent crashes
      const slug =
        speakerData.slug ||
        (speakerData.name ? speakerData.name.toLowerCase().replace(/\s+/g, "-") : `speaker-${rowIndex}`)
      const name = speakerData.name || "Unnamed Speaker"
      const title = speakerData.title || "N/A"

      try {
        return {
          slug: slug,
          name: name,
          title: title,
          bio: speakerData.bio || "",
          image: speakerData.image || undefined, // Let placeholder handle if undefined
          imagePosition: speakerData.image_position || "center",
          imageOffsetY: speakerData.image_offset_y || "0%",
          programs: speakerData.programs ? speakerData.programs.split(",").map((s: string) => s.trim()) : [],
          industries: speakerData.industries ? speakerData.industries.split(",").map((s: string) => s.trim()) : [],
          fee: speakerData.fee || "Inquire for Fee",
          feeRange: speakerData.fee_range || undefined,
          location: speakerData.location || "N/A",
          linkedin: speakerData.linkedin || undefined,
          twitter: speakerData.twitter || undefined,
          website: speakerData.website || undefined,
          featured: speakerData.featured ? speakerData.featured.toLowerCase() === "true" : false,
          videos: speakerData.videos ? speakerData.videos.split(",").map((s: string) => s.trim()) : [],
          testimonials: speakerData.testimonials ? JSON.parse(speakerData.testimonials) : [], // Assuming testimonials are stored as JSON string
          tags: speakerData.tags ? speakerData.tags.split(",").map((s: string) => s.trim()) : [],
          lastUpdated: speakerData.last_updated || new Date().toISOString(),
          pronouns: speakerData.pronouns || undefined,
          languages: speakerData.languages ? speakerData.languages.split(",").map((s: string) => s.trim()) : [],
          availability: speakerData.availability || "Contact for availability",
          isVirtual: speakerData.is_virtual ? speakerData.is_virtual.toLowerCase() === "true" : true,
          travelsFrom: speakerData.travels_from || "N/A",
          topics: speakerData.topics ? speakerData.topics.split(",").map((s: string) => s.trim()) : [], // Added topics
        } as Speaker // Type assertion
      } catch (parseError) {
        console.error(`Error parsing speaker data for row ${rowIndex + 1} (Name: ${name}):`, parseError)
        console.error("Problematic row data:", speakerData)
        return null // Skip this speaker if there's a critical parsing error
      }
    })
    .filter((speaker): speaker is Speaker => speaker !== null) // Filter out nulls from parsing errors
}

// Enhanced local fallback data with working local images
const localSpeakers: Speaker[] = [
  {
    slug: "adam-cheyer",
    name: "Adam Cheyer",
    title:
      "VP of AI Experience at Airbnb, Co-Founder of Siri, Gameplanner.ai, Viv Labs, Sentient, and Founding Member of Change.org",
    image: "/speakers/adam-cheyer-headshot.png",
    imagePosition: "top",
    imageOffsetY: "-10px", // Adjusted slightly upwards
    bio: "Adam is an expert in entrepreneurship, artificial intelligence, and scaling startups. With over ten years of experience founding and exiting companies, he was a co-founder of Siri, which Apple acquired, co-founded Viv Labs, which was acquired by Samsung, and Gameplanner.AI, which was Airbnb's first acquisition since going public. Through Siri and Bixby (Apple & Samsung's voice assistants), Adam has created key technology in over 1.5 billion devices.\n\nA founding developer of Change.org, he's helped unite 500M+ members to create social change across the globe. After his most recent acquisition, he leads all AI efforts at Airbnb as the VP of AI Experience.\n\nAdam is a 30+ year veteran in Artificial Intelligence, initially starting as a researcher at SRI International. With 39 patents and 60+ publications, his technical expertise and visionary approach to entrepreneurship are widely recognized across the globe.",
    programs: [
      "ChatGPT and The Rise of Conversational AI",
      "The Future of AI and Businesses",
      '"Hey SIRI": A Founding Story',
    ],
    fee: "Please Inquire",
    location: "San Francisco, California",
    linkedin: "https://www.linkedin.com/in/adamcheyer/",
    website: "http://adam.cheyer.com/site/home",
    email: "adam.cheyer@gmail.com",
    contact: "Direct",
    listed: true,
    expertise: ["Conversational AI", "Virtual Assistants", "Voice Technology", "AI Product Development"],
    industries: ["Technology", "Consumer Electronics", "Mobile"],
    ranking: 99,
  },
  {
    slug: "peter-norvig",
    name: "Peter Norvig",
    title: "Former Head of Computational Science at NASA and Director of Research and Search Quality at Google",
    image: "/speakers/peter-norvig-headshot.jpg",
    bio: 'Peter Norvig, a distinguished American computer scientist, is widely recognized for his profound contributions to artificial intelligence and education. As a Distinguished Education Fellow at the Stanford Institute for Human-Centered AI and a former director at Google, Norvig has been instrumental in shaping the field of AI.\n\nHis co-authorship of "Artificial Intelligence: A Modern Approach," the most widely used textbook in AI, used in over 1,500 universities worldwide, highlights his academic influence. Norvig\'s career spans various pivotal roles, including leading the Computational Sciences Division at NASA Ames Research Center.',
    programs: [
      "The Pursuit of Machine Learning",
      "The Crossroads Between AI and Space",
      "The Challenge & Promise of Artificial Intelligence",
    ],
    fee: "$25k to $50k plus travel",
    location: "California, United States",
    linkedin: "https://www.linkedin.com/in/pnorvig/",
    website: "https://norvig.com/",
    email: "peter@norvig.com",
    contact: "Direct",
    listed: true,
    expertise: ["Artificial Intelligence", "Machine Learning", "Search Algorithms", "AI Education"],
    industries: ["Technology", "Education", "Research"],
    ranking: 100,
  },
  {
    slug: "cassie-kozyrkov",
    name: "Cassie Kozyrkov",
    title: "CEO of Kozyr, AI Luminary, Former Chief Decision Scientist at Google, and Pioneer of Decision Intelligence",
    image: "/speakers/cassie-kozyrkov-headshot.jpg",
    imagePosition: "top",
    bio: "Cassie Kozyrkov, CEO of Kozyr, is a renowned leader in artificial intelligence. She is best known for founding the field of Decision Intelligence and serving as Google's first Chief Decision Scientist, where she spearheaded Google's transformation into an AI-first company.\n\nToday, Cassie is a sought-after AI advisor and speaker who has transformed how organizations like Gucci, NASA, Spotify, Meta, and GSK approach AI strategy.",
    programs: [
      "The Future is AI-First: Are You Ready to Lead?",
      "AI Won't Steal Your Job, But It Will Steal Your Excuses",
      "Why Businesses Fail at AI Adoption: From Buzzwords to Business Strategy",
    ],
    fee: "Please Inquire",
    location: "Miami, Florida",
    linkedin: "https://www.linkedin.com/in/kozyrkov/",
    website: "https://kozyr.com/",
    email: "speaking@kozyr.com",
    contact: "Peter",
    listed: true,
    expertise: ["AI Strategy", "Decision Intelligence", "Data Science", "Business AI"],
    industries: ["Technology", "Finance", "Healthcare", "Consulting"],
    ranking: 92,
  },
  {
    slug: "katie-mcmahon",
    name: "Katie McMahon",
    title: "Former VP of Global Marketing at Apple, Founding Executive of Apple Retail, and Author",
    image: "/speakers/Katie-McMahon-Headshot.jpeg",
    imagePosition: "top", // Set to top
    imageOffsetY: "-10px", // Adjusted slightly upwards
    bio: "Katie McMahon is a dynamic marketing executive and author known for her pivotal role in Apple's global marketing and retail initiatives. As a founding executive of Apple Retail, she helped shape the customer experience that became a benchmark for the industry. Her expertise spans brand building, consumer engagement, and creating memorable customer journeys. Katie is also an accomplished author, sharing insights on innovation and leadership.",
    programs: [
      "Building Iconic Brands in the Age of AI",
      "The Future of Retail: AI-Powered Customer Experiences",
      "Innovation Lessons from Apple",
    ],
    fee: "Please Inquire",
    location: "San Francisco, California",
    linkedin: "https://www.linkedin.com/in/katiemcmahon/",
    website: "",
    email: "",
    contact: "Direct",
    listed: true,
    expertise: ["Brand Strategy", "Retail Innovation", "Consumer Marketing", "Leadership"],
    industries: ["Technology", "Retail", "Marketing"],
    ranking: 95, // Assign a ranking
  },
  {
    slug: "gopi-kallayil",
    name: "Gopi Kallayil",
    title: "Chief Evangelist of Brand Marketing at Google",
    image: "/speakers/gopi-kallayil-headshot.jpg",
    imagePosition: "top",
    imageOffsetY: "-10px",
    bio: "Gopi Kallayil is the Chief Evangelist of Brand Marketing at Google. In his role, he works with Google's marketing teams and helps evangelize Google's brand marketing vision, strategy, and execution. He is also a passionate advocate for mindfulness and well-being in the workplace.",
    programs: [
      "The Future of Brand Marketing",
      "Innovation and Creativity at Google",
      "Mindfulness and Well-being in the Workplace",
    ],
    fee: "Please Inquire",
    location: "San Francisco, California",
    linkedin: "https://www.linkedin.com/in/gopikallayil/",
    website: "http://gopikallayil.com/",
    email: "gopi.kallayil@gmail.com",
    contact: "Direct",
    listed: true,
    expertise: ["Brand Marketing", "Innovation", "Mindfulness"],
    industries: ["Technology", "Marketing"],
    ranking: 88,
  },
  {
    slug: "jamie-metzl",
    name: "Jamie Metzl",
    title: "Technology and Healthcare Futurist, Author, and Geopolitical Expert",
    image: "/speakers/jamie-metzl-headshot.jpg",
    imagePosition: "top",
    imageOffsetY: "-10px",
    bio: "Jamie Metzl is a leading technology and healthcare futurist, author, and geopolitical expert. He explores the intersection of emerging technologies, healthcare, and global politics. Jamie is a sought-after speaker and advisor on the future of humanity.",
    programs: [
      "The Future of Healthcare",
      "The Geopolitics of Technology",
      "Hacking Darwin: Genetic Engineering and the Future of Humanity",
    ],
    fee: "Please Inquire",
    location: "New York, New York",
    linkedin: "https://www.linkedin.com/in/jamiemetzl/",
    website: "https://jamiemetzl.com/",
    email: "jamie@jamiemetzl.com",
    contact: "Direct",
    listed: true,
    expertise: ["Technology", "Healthcare", "Geopolitics"],
    industries: ["Technology", "Healthcare", "Government"],
    ranking: 90,
  },
  {
    slug: "david-ewing-duncan",
    name: "David Ewing Duncan",
    title: "Science Journalist, Author, and Commentator",
    image: "/speakers/david-ewing-duncan-headshot.jpg",
    imagePosition: "top",
    imageOffsetY: "-10px",
    bio: "David Ewing Duncan is a renowned science journalist, author, and commentator. He covers a wide range of topics, including genetics, neuroscience, and the future of humanity. David is known for his engaging and thought-provoking presentations.",
    programs: ["The Future of Genetics", "The Power of the Brain", "When I Die: Lessons From the Death Zone"],
    fee: "Please Inquire",
    location: "New York, New York",
    linkedin: "https://www.linkedin.com/in/david-ewing-duncan-0a77451/",
    website: "http://www.davideduncan.com/",
    email: "david@davideduncan.com",
    contact: "Direct",
    listed: true,
    expertise: ["Genetics", "Neuroscience", "Science Journalism"],
    industries: ["Science", "Journalism", "Healthcare"],
    ranking: 85,
  },
]

let _cachedSpeakers: Speaker[] | null = null
let _lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Function to validate and normalize image URLs
function validateImageUrl(imageUrl: string, speakerName?: string): string {
  if (!imageUrl) {
    console.warn(`No image URL provided for ${speakerName}`)
    return "/placeholder.svg"
  }

  // Log all image URLs for debugging
  console.log(`Image URL for ${speakerName}: ${imageUrl}`)

  // If it's already a full URL (http/https), validate it
  if (imageUrl.startsWith("http")) {
    if (imageUrl.includes("blob.vercel-storage.com")) {
      console.log(`Using Blob URL for ${speakerName}: ${imageUrl}`)

      // Validate blob URL format
      if (!imageUrl.match(/^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/.+/)) {
        console.error(`Invalid Blob URL format for ${speakerName}: ${imageUrl}`)
        return "/placeholder.svg"
      }
    }
    return imageUrl
  }

  // If it starts with /, it's already a proper path
  if (imageUrl.startsWith("/")) {
    return imageUrl
  }

  // Otherwise, assume it's a filename and prepend the speakers path
  const normalizedUrl = `/speakers/${imageUrl}`
  console.log(`Normalized local path for ${speakerName}: ${normalizedUrl}`)
  return normalizedUrl
}

async function loadSpeakers(): Promise<Speaker[]> {
  const now = Date.now()

  // Return cached speakers if available and not expired
  if (_cachedSpeakers && now - _lastFetchTime < CACHE_DURATION) {
    console.log("Using cached speakers data")
    return _cachedSpeakers
  }

  let allSpeakers: Speaker[] = []

  try {
    console.log("Attempting to load speakers from Google Sheet...")
    // const sheetSpeakers = await fetchSpeakersFromSheet()
    const sheetSpeakers = await fetchAllSpeakersFromSheet()

    if (Array.isArray(sheetSpeakers) && sheetSpeakers.length > 0) {
      console.log(`Successfully loaded ${sheetSpeakers.length} speakers from Google Sheet.`)
      allSpeakers = sheetSpeakers.map((speaker) => ({
        ...speaker,
        // image: validateImageUrl(speaker.image, speaker.name),
      }))
    } else {
      console.log("No speakers returned from Google Sheet or an error occurred. Falling back to local data.")
      allSpeakers = localSpeakers.map((speaker) => ({
        ...speaker,
        // image: validateImageUrl(speaker.image, speaker.name),
      }))
    }
  } catch (error) {
    console.error("Error fetching speakers from Google Sheet, falling back to local data:", error)
    allSpeakers = localSpeakers.map((speaker) => ({
      ...speaker,
      // image: validateImageUrl(speaker.image, speaker.name),
    }))
  }

  // Deduplicate speakers by slug, prioritizing the first occurrence (e.g., from sheet if loaded)
  const uniqueSpeakersMap = new Map<string, Speaker>()
  for (const speaker of allSpeakers) {
    if (!uniqueSpeakersMap.has(speaker.slug)) {
      uniqueSpeakersMap.set(speaker.slug, speaker)
    }
  }

  _cachedSpeakers = Array.from(uniqueSpeakersMap.values()).sort((a, b) => b.ranking - a.ranking)
  _lastFetchTime = now
  console.log(`Total unique speakers loaded: ${_cachedSpeakers.length}`)
  const sampleSpeaker = _cachedSpeakers.find((s) => s.slug === "adam-cheyer" || s.slug === "peter-norvig")
  if (sampleSpeaker) {
    console.log(`Sample speaker (${sampleSpeaker.name}) expertise: ${JSON.stringify(sampleSpeaker.expertise)}`)
  }
  // Add a specific log for Adam Cheyer's expertise here
  const adamCheyer = _cachedSpeakers.find((s) => s.slug === "adam-cheyer")
  if (adamCheyer) {
    console.log(`lib/speakers-data.ts: Adam Cheyer's expertise before caching: ${JSON.stringify(adamCheyer.expertise)}`)
  }
  return _cachedSpeakers
}

let allSpeakersCache: Speaker[] | null = null
let lastFetchTime: number | null = null
// const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchAllSpeakersFromSheet(): Promise<Speaker[]> {
  console.log("Attempting to fetch speakers from Google Sheet...")
  if (!SPREADSHEET_ID || !API_KEY) {
    console.error("Google Sheets API Key or Spreadsheet ID is not configured.")
    // Fallback to empty array or throw error, depending on desired behavior
    // For build stability, returning empty array is safer.
    return []
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Z`, // Adjust range as needed
    })

    const values = response.data.values
    if (!values || values.length === 0) {
      console.warn("No data returned from Google Sheet.")
      return []
    }
    console.log(`Successfully fetched ${values.length - 1} speaker rows from sheet.`)
    return mapGoogleSheetDataToSpeakers(values)
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error)
    // Return empty array on error to prevent build crashes
    return []
  }
}

export async function getAllSpeakers(): Promise<Speaker[]> {
  const now = Date.now()
  if (allSpeakersCache && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
    console.log("Returning all speakers from cache.")
    return allSpeakersCache
  }

  try {
    allSpeakersCache = await fetchAllSpeakersFromSheet()
    lastFetchTime = now
    console.log(`Fetched and cached ${allSpeakersCache.length} speakers.`)
    return allSpeakersCache
  } catch (error) {
    console.error("Failed to get all speakers:", error)
    return [] // Ensure an array is always returned
  }
}

// export async function getAllSpeakers(): Promise<Speaker[]> {
//   try {
//     const speakers = await loadSpeakers()
//     const listedSpeakers = speakers.filter((speaker) => speaker.listed)
//     console.log(`Returning ${listedSpeakers.length} listed speakers`)
//     return listedSpeakers
//   } catch (error) {
//     console.error("Error in getAllSpeakers:", error)
//     return localSpeakers.filter((speaker) => speaker.listed)
//   }
// }

export async function getFeaturedSpeakers(limit = 8): Promise<Speaker[]> {
  try {
    const speakers = await getAllSpeakers()
    const featured = speakers.filter((speaker) => speaker.featured)
    console.log(`Found ${featured.length} featured speakers. Limiting to ${limit}.`)
    return featured.slice(0, limit)
  } catch (error) {
    console.error("Failed to get featured speakers:", error)
    return [] // Ensure an array is always returned
  }
}

// export async function getFeaturedSpeakers(count = 8): Promise<Speaker[]> {
//   try {
//     const speakers = await getAllSpeakers()
//     console.log(`Returning ${Math.min(count, speakers.length)} featured speakers`)
//     return speakers.slice(0, count)
//   } catch (error) {
//     console.error("Error in getFeaturedSpeakers:", error)
//     return localSpeakers.filter((speaker) => speaker.listed).slice(0, count)
//   }
// }

export async function getSpeakerBySlug(slug: string): Promise<Speaker | undefined> {
  try {
    const speakers = await getAllSpeakers()
    const speaker = speakers.find((s) => s.slug === slug)
    if (speaker) {
      console.log(`Speaker found for slug ${slug}: ${speaker.name}`)
    } else {
      console.warn(`No speaker found for slug: ${slug}`)
    }
    return speaker
  } catch (error) {
    console.error(`Failed to get speaker by slug ${slug}:`, error)
    return undefined // Ensure undefined is returned on error
  }
}

// export async function getSpeakerBySlug(slug: string): Promise<Speaker | undefined> {
//   try {
//     const speakers = await loadSpeakers()
//     const speaker = speakers.find((speaker) => speaker.slug === slug)
//     if (speaker) {
//       console.log(`Found speaker by slug ${slug}: ${speaker.name}`)
//     } else {
//       console.warn(`No speaker found for slug: ${slug}`)
//     }
//     return speaker
//   } catch (error) {
//     console.error("Error in getSpeakerBySlug:", error)
//     return localSpeakers.find((speaker) => speaker.slug === slug)
//   }
// }

export async function searchSpeakers(query: string): Promise<Speaker[]> {
  try {
    const speakers = await getAllSpeakers()
    if (!query) {
      return speakers // Return all if query is empty
    }
    const lowerQuery = query.toLowerCase()
    const results = speakers.filter((speaker) => {
      return (
        speaker.name.toLowerCase().includes(lowerQuery) ||
        speaker.title.toLowerCase().includes(lowerQuery) ||
        (speaker.bio && speaker.bio.toLowerCase().includes(lowerQuery)) ||
        (speaker.industries && speaker.industries.some((ind) => ind.toLowerCase().includes(lowerQuery))) ||
        (speaker.programs && speaker.programs.some((prog) => prog.toLowerCase().includes(lowerQuery))) ||
        (speaker.tags && speaker.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)))
      )
    })
    console.log(`Search for "${query}" found ${results.length} speakers.`)
    return results
  } catch (error) {
    console.error(`Failed to search speakers with query "${query}":`, error)
    return [] // Ensure an array is always returned
  }
}

// export async function searchSpeakers(query: string): Promise<Speaker[]> {
//   try {
//     const speakers = await loadSpeakers()
//     const lowercaseQuery = query.toLowerCase().trim()

//     if (!lowercaseQuery) {
//       return speakers.filter((speaker) => speaker.listed)
//     }

//     return speakers.filter((speaker) => {
//       if (!speaker.listed) return false

//       const nameMatch = speaker.name.toLowerCase().includes(lowercaseQuery)
//       const titleMatch = speaker.title.toLowerCase().includes(lowercaseQuery)
//       const expertiseMatch = speaker.expertise.some((skill) => skill.toLowerCase().includes(lowercaseQuery))
//       const industryMatch = speaker.industries.some((industry) => industry.toLowerCase().includes(lowercaseQuery))

//       // More precise bio matching - only match if it's a significant term or company name
//       // Avoid matching common words that might appear in passing mentions
//       const bioMatch =
//         lowercaseQuery.length >= 4 &&
//         (speaker.bio
//           .toLowerCase()
//           .includes(` ${lowercaseQuery} `) || // Whole word match
//           speaker.bio.toLowerCase().includes(`${lowercaseQuery}.`) || // End of sentence
//           speaker.bio.toLowerCase().includes(`${lowercaseQuery},`) || // In a list
//           speaker.bio.toLowerCase().includes(`${lowercaseQuery}'s`) || // Possessive
//           speaker.bio.toLowerCase().startsWith(lowercaseQuery) || // Start of bio
//           speaker.bio.toLowerCase().includes(`at ${lowercaseQuery}`) || // Company affiliation
//           speaker.bio.toLowerCase().includes(`from ${lowercaseQuery}`) || // Previous company
//           speaker.bio.toLowerCase().includes(`with ${lowercaseQuery}`)) // Partnership/collaboration

//       return nameMatch || titleMatch || expertiseMatch || industryMatch || bioMatch
//     })
//   } catch (error) {
//     console.error("Error in searchSpeakers:", error)
//     return []
//   }
// }

// Function to get unique industries for filter dropdowns
export async function getUniqueIndustries(): Promise<string[]> {
  try {
    const speakers = await getAllSpeakers()
    const allIndustries = speakers.flatMap((speaker) => speaker.industries || [])
    const unique = Array.from(new Set(allIndustries.filter((ind) => ind))) // Filter out empty strings
    console.log("Unique industries for filtering:", unique)
    return unique.sort()
  } catch (error) {
    console.error("Failed to get unique industries:", error)
    return []
  }
}

export async function getSpeakersByIndustry(industry: string): Promise<Speaker[]> {
  try {
    const allSpeakers = await getAllSpeakers() // Use the main function to get all speakers
    if (!industry) {
      // If no specific industry, return all listed speakers or just all speakers based on desired behavior
      // For now, let's assume it should return speakers matching the industry, or empty if no industry.
      // Or, if an empty industry string means "all industries", then:
      // return allSpeakers.filter(speaker => speaker.listed);
      return [] // Or handle as an error/specific case
    }
    const lowerIndustry = industry.toLowerCase()
    const results = allSpeakers.filter(
      (speaker) =>
        speaker.listed && // Ensure speaker is listed
        speaker.industries && // Ensure industries array exists
        speaker.industries.some((ind) => ind.toLowerCase().includes(lowerIndustry)),
    )
    console.log(`Found ${results.length} speakers for industry "${industry}".`)
    return results
  } catch (error) {
    console.error(`Error in getSpeakersByIndustry for industry "${industry}":`, error)
    return [] // Return empty array on error
  }
}

// export async function getSpeakersByIndustry(industry: string): Promise<Speaker[]> {
//   try {
//     const speakers = await loadSpeakers()
//     return speakers.filter(
//       (speaker) =>
//         speaker.listed && speaker.industries.some((ind) => ind.toLowerCase().includes(industry.toLowerCase())),
//     )
//   } catch (error) {
//     console.error("Error in getSpeakersByIndustry:", error)
//     return []
//   }
// }

// export async function getTopSpeakers(count = 6): Promise<Speaker[]> {
//   try {
//     const speakers = await getAllSpeakers()
//     return speakers.slice(0, count)
//   } catch (error) {
//     console.error("Error in getTopSpeakers:", error)
//     return localSpeakers.filter((speaker) => speaker.listed).slice(0, count)
//   }
// }
