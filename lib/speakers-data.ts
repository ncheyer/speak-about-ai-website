import { fetchSpeakersFromSheet } from "@/app/actions/google-sheets"

export interface Speaker {
  slug: string
  name: string
  title: string
  image: string
  imagePosition?: string
  imageOffsetY?: string // New property for vertical offset, e.g., "-10px" or "-5%"
  bio: string
  programs: string[]
  fee: string
  location: string
  linkedin?: string
  website?: string
  email: string
  contact: string
  listed: boolean
  expertise: string[]
  industries: string[]
  ranking: number
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

  try {
    console.log("Loading speakers data from Google Sheet...")
    const sheetSpeakers = await fetchSpeakersFromSheet()

    if (Array.isArray(sheetSpeakers) && sheetSpeakers.length > 0) {
      console.log(`Successfully loaded ${sheetSpeakers.length} speakers from Google Sheet`)

      // Process and validate each speaker's image URL
      _cachedSpeakers = sheetSpeakers.map((speaker) => {
        const processedSpeaker = {
          ...speaker,
          image: validateImageUrl(speaker.image, speaker.name),
        }

        // Log each speaker for debugging
        console.log(`Processed speaker: ${speaker.name} - Image: ${processedSpeaker.image}`)

        return processedSpeaker
      })

      _lastFetchTime = now
      return _cachedSpeakers
    } else {
      console.log("No speakers returned from Google Sheet, using local fallback")
    }
  } catch (error) {
    console.error("Error fetching speakers from Google Sheet:", error)
  }

  // Fallback to local data
  console.log("Using local speaker data as fallback")
  _cachedSpeakers = localSpeakers
    .map((speaker) => ({
      ...speaker,
      image: validateImageUrl(speaker.image, speaker.name),
    }))
    .sort((a, b) => b.ranking - a.ranking)
  _lastFetchTime = now
  return _cachedSpeakers
}

export async function getAllSpeakers(): Promise<Speaker[]> {
  try {
    const speakers = await loadSpeakers()
    const listedSpeakers = speakers.filter((speaker) => speaker.listed)
    console.log(`Returning ${listedSpeakers.length} listed speakers`)
    return listedSpeakers
  } catch (error) {
    console.error("Error in getAllSpeakers:", error)
    return localSpeakers.filter((speaker) => speaker.listed)
  }
}

export async function getSpeakerBySlug(slug: string): Promise<Speaker | undefined> {
  try {
    const speakers = await loadSpeakers()
    const speaker = speakers.find((speaker) => speaker.slug === slug)
    if (speaker) {
      console.log(`Found speaker by slug ${slug}: ${speaker.name}`)
    } else {
      console.warn(`No speaker found for slug: ${slug}`)
    }
    return speaker
  } catch (error) {
    console.error("Error in getSpeakerBySlug:", error)
    return localSpeakers.find((speaker) => speaker.slug === slug)
  }
}

export async function searchSpeakers(query: string): Promise<Speaker[]> {
  try {
    const speakers = await loadSpeakers()
    const lowercaseQuery = query.toLowerCase().trim()

    if (!lowercaseQuery) {
      return speakers.filter((speaker) => speaker.listed)
    }

    return speakers.filter((speaker) => {
      if (!speaker.listed) return false

      const nameMatch = speaker.name.toLowerCase().includes(lowercaseQuery)
      const titleMatch = speaker.title.toLowerCase().includes(lowercaseQuery)
      const expertiseMatch = speaker.expertise.some((skill) => skill.toLowerCase().includes(lowercaseQuery))
      const industryMatch = speaker.industries.some((industry) => industry.toLowerCase().includes(lowercaseQuery))
      const bioMatch = lowercaseQuery.length >= 4 && speaker.bio.toLowerCase().includes(lowercaseQuery)

      return nameMatch || titleMatch || expertiseMatch || industryMatch || bioMatch
    })
  } catch (error) {
    console.error("Error in searchSpeakers:", error)
    return []
  }
}

export async function getSpeakersByIndustry(industry: string): Promise<Speaker[]> {
  try {
    const speakers = await loadSpeakers()
    return speakers.filter(
      (speaker) =>
        speaker.listed && speaker.industries.some((ind) => ind.toLowerCase().includes(industry.toLowerCase())),
    )
  } catch (error) {
    console.error("Error in getSpeakersByIndustry:", error)
    return []
  }
}

export async function getFeaturedSpeakers(count = 8): Promise<Speaker[]> {
  try {
    const speakers = await getAllSpeakers()
    console.log(`Returning ${Math.min(count, speakers.length)} featured speakers`)
    return speakers.slice(0, count)
  } catch (error) {
    console.error("Error in getFeaturedSpeakers:", error)
    return localSpeakers.filter((speaker) => speaker.listed).slice(0, count)
  }
}

export async function getTopSpeakers(count = 6): Promise<Speaker[]> {
  try {
    const speakers = await getAllSpeakers()
    return speakers.slice(0, count)
  } catch (error) {
    console.error("Error in getTopSpeakers:", error)
    return localSpeakers.filter((speaker) => speaker.listed).slice(0, count)
  }
}
