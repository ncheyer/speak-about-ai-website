import { fetchSpeakersFromSheet } from "@/app/actions/google-sheets"

export interface Speaker {
  slug: string
  name: string
  title: string
  image: string
  imagePosition?: string // Add this new optional property
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
  ranking: number // New ranking field (1-100, higher = more prominent)
}

// Local fallback data (existing 'speakers' array)
const localSpeakers: Speaker[] = [
  {
    slug: "adam-cheyer",
    name: "Adam Cheyer",
    title:
      "VP of AI Experience at Airbnb, Co-Founder of Siri, Gameplanner.ai, Viv Labs, Sentient, and Founding Member of Change.org",
    image: "/speakers/adam-cheyer-headshot.png",
    imagePosition: "top",
    bio: "Adam is an expert in entrepreneurship, artificial intelligence, and scaling startups. With over ten years of experience founding and exiting companies, he was a co-founder of Siri, which Apple acquired, co-founded Viv Labs, which was acquired by Samsung, and Gameplanner.AI, which was Airbnb's first acquisition since going public. Through Siri and Bixby (Apple & Samsung's voice assistants), Adam has created key technology in over 1.5 billion devices. A founding developer of Change.org, he's helped unite 500M+ members to create social change across the globe. After his most recent acquisition, he leads all AI efforts at Airbnb as the VP of AI Experience.\n\nAdam is a 30+ year veteran in Artificial Intelligence, initially starting as a researcher at SRI International. With 39 patents and 60+ publications, his technical expertise and visionary approach to entrepreneurship are widely recognized across the globe. Before Siri, he co-founded Sentient Technologies, which applies distributed machine learning algorithms to discover novel solutions to complex problems.\n\nBeyond his success in technology, Adam is also an award-winning magician. He's performed on some of the most prestigious stages in magic, including the Magic Castle in Los Angeles and the hit TV show \"Penn and Teller Fool Us.\" As a bonus, Adam usually includes a magic trick as a way to entertain and delight during his keynotes.",
    programs: [
      "ChatGPT and The Rise of Conversational AI",
      "The Future of AI and Businesses",
      '"Hey SIRI": A Founding Story',
    ],
    fee: "Please Inquire",
    location: "San Franscisco, California",
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
    bio: 'Peter Norvig, a distinguished American computer scientist, is widely recognized for his profound contributions to artificial intelligence and education. As a Distinguished Education Fellow at the Stanford Institute for Human-Centered AI and a former director at Google, Norvig has been instrumental in shaping the field of AI. His co-authorship of "Artificial Intelligence: A Modern Approach," the most widely used textbook in AI, used in over 1,500 universities worldwide, highlights his academic influence.\n\nNorvig\'s career spans various pivotal roles, including leading the Computational Sciences Division at NASA Ames Research Center and contributing to advancements at companies like Junglee and Sun Microsystems Laboratories. His academic tenure includes positions at the University of Southern California and Berkeley, enhancing his reputation as a scholar and educator. His publications in AI, natural language processing, and information retrieval, notably "Paradigms of AI Programming" and "Intelligent Help Systems for UNIX," have been seminal in the field.\n\nA pioneer in online education, Norvig\'s collaboration with Sebastian Thrun to develop an online AI course attracted over 160,000 students, demonstrating his commitment to accessible, high-quality education. His influential publications, like the "Teach Yourself Programming in Ten Years" article and "The Unreasonable Effectiveness of Data," have significantly impacted how we understand programming and data\'s role in AI.\n\nAs a sought-after speaker, Norvig has shared his expertise globally, including notable presentations for the University of British Columbia and in his TED Talk. His work has not only advanced the technical aspects of AI but also its educational and ethical dimensions. Peter Norvig remains a pivotal figure in AI, influencing academic circles and the broader public understanding of this transformative technology.',
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
    bio: "Cassie Kozyrkov, CEO of Kozyr, is a renowned leader in artificial intelligence. She is best known for founding the field of Decision Intelligence and serving as Google's first Chief Decision Scientist, where she spearheaded Google's transformation into an AI-first company.\n\nToday, Cassie is a sought-after AI advisor and speaker who has transformed how organizations like Gucci, NASA, Spotify, Meta, and GSK approach AI strategy. Passionate about elevating human potential through the responsible adoption of complex technology, she also serves on the Innovation Advisory Council of the Federal Reserve Bank of New York and an investor in emerging product companies.\n\nHer influence on Google's culture is legendary; no matter how big the auditorium, Google had to use lotteries to manage the demand to participate in one of her live workshops. Her work, which included personally training over 20,000 Googlers in AI and data-driven decision-making, impacted more than 500 company initiatives.\n\nCombining deep technical knowledge with theater-trained charisma, Cassie is a captivating keynote speaker with the rare ability to make complex concepts accessible, engaging, and actionable for executive and general audiences alike. Her humor, wit, and vivid analogies ensure that people of all stripes leave her talks inspired and equipped to drive innovation. Cassie has delighted live audiences in more than 40 countries and on all seven continents, including stages at the United Nations, World Economic Forum, Web Summit, and SXSW.\n\nCassie has appeared on the cover of Forbes AI and featured in Harvard Business Review, Fortune, Fast Company, WIRED, Success, Entrepreneur, as well as a recent documentary on the AI revolution. Her online courses and more than 200+ published articles have reached millions and cemented her position as a LinkedIn Top Voice and the #1 Writer in AI on Medium for many years. She is followed by more than 24,000 CxOs.\n\nHailing from South Africa, Cassie began her undergraduate studies at the age of 15 at Nelson Mandela University and earned degrees in economics, mathematical statistics, psychology and neuroscience from the University of Chicago, NCSU, and Duke University, which honored her as a Few-Glasson Distinguished Alumna for her significant contributions to the fields of AI and Decision Intelligence.",
    programs: [
      "The Future is AI-First: Are You Ready to Lead?",
      "AI Won't Steal Your Job, But It Will Steal Your Excuses",
      "Why Businesses Fail at AI Adoption: From Buzzwords to Business Strategy",
      "Mind The Gap: Digital Trust Habits For The AI Era",
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
    slug: "rana-el-kaliouby",
    name: "Rana el Kaliouby",
    title:
      "Co-Founder and General Partner of Blue Tulip Ventures, Former Deputy CEO of Smart Eye, Co-Founder of Affectiva, and Author",
    image: "/speakers/rana-el-kaliouby-headshot.jpg",
    imagePosition: "top",
    bio: "Rana el Kaliouby is a distinguished figure in the realm of emotion AI, renowned for her groundbreaking work in bringing emotional intelligence to technology. Born and raised in Cairo, Egypt, she embarked on an academic journey that led her to earn her bachelor's and master's degrees from the American University in Cairo and a Ph.D. from Newnham College, Cambridge. \n\nRana's career began with a pivotal role at the MIT Media Lab's Affective Computing group where she was integral to the team that developed the innovative \"emotional hearing aid,\" a pioneering set of emotion-reading wearable glasses. This invention gained recognition as one of the New York Times' Top 100 Innovations of 2006. \n\nHer vision for humanizing technology led her to co-found Affectiva, a spin-off from the MIT Media Lab. As the CEO of Affectiva, Rana has been at the forefront of leveraging facial and vocal recognition software to bridge the gap between humans and machines. Under her leadership, Affectiva has grown its facial emotion repository to nearly 6 million faces analyzed across 75 countries. \n\nBeyond her role in Affectiva, Rana has made her mark as a World Economic Forum Young Global Leader. She has also co-hosted the PBS NOVA Wonders series, further demonstrating her ability to make complex technological concepts accessible to a wider audience. \n\nRana's journey and insights into the world of AI and emotion recognition are eloquently captured in her memoir, \"Girl Decoded.\" Additionally, she has contributed a chapter to \"Architects of Intelligence: The Truth About AI from the People Building It\" by Martin Ford, solidifying her position as a thought leader in the AI community.",
    programs: ["The Ethics Behind Smarter AI", "The Future of Emotional AI"],
    fee: "Please Inquire",
    location: "Boston, MA",
    linkedin: "https://www.linkedin.com/in/kaliouby/",
    website: "https://smarteye.ai/",
    email: "kaliouby@smarteye.ai",
    contact: "Adam",
    listed: true,
    expertise: ["Emotion AI", "Computer Vision", "Facial Recognition", "AI Startups"],
    industries: ["Automotive", "Healthcare", "Advertising", "Technology"],
    ranking: 90,
  },
  {
    slug: "allie-k-miller",
    name: "Allie Miller",
    title: "Former Global Head of Machine Learning For Startups and Venture Capital at Amazon (AWS)",
    image: "/speakers/allie-k-miller-fireside.jpg",
    bio: "Allie K. Miller stands out as a preeminent leader in artificial intelligence, merging her roles as an advisor, investor, and influencer in the AI sphere. Her journey includes a pivotal role as the Global Head of Machine Learning Business Development for Startups and Venture Capital at Amazon (AWS), where she not only advised world-leading ML researchers and founders but also transformed her division into a 100-person, 10-figure organization. Prior to Amazon, Allie was the youngest-ever woman at IBM to spearhead the development of an AI product, impacting thousands of companies across domains like computer vision and data regulation.\n\nBeyond her corporate achievements, Allie is a formidable force in shaping the AI landscape. She has addressed global platforms, including the European Commission, and has authored over 10 guidebooks on AI, focusing on empowering businesses to harness AI successfully. Her contributions to AI have earned her numerous accolades, including AIconic's \"AI Innovator of the Year\" in 2019, LinkedIn Top Voice for Technology and AI for five consecutive years, and recognition by Award Magazine, Chief in Tech, and ReadWrite as a leading woman in tech and a global thought leader.\n\nAllie's commitment extends to promoting diversity and education in AI, as evidenced by her founding The AI Pipeline and co-founding Girls of the Future. She also serves as a national ambassador for AAAS and an ambassador for Advancing Women in Product. Her investment acumen is showcased through her role as an angel investor in machine learning startups and winning the Grand Prize in three national innovation competitions.\n\nHolding a double-major MBA from The Wharton School and a BA in Cognitive Science from Dartmouth College, Allie's academic background is as impressive as her professional journey. Her expertise in cognitive science, encompassing computer science, linguistics, and psychology, complements her extensive practical experience in the field of artificial intelligence. Allie K. Miller represents the epitome of innovation, leadership, and advocacy in the rapidly evolving world of AI.",
    programs: ["The Future of AI"],
    fee: "Please Inquire",
    location: "New York City, New York",
    linkedin: "https://www.linkedin.com/in/alliekmiller/",
    website: "https://alliekmiller.com/",
    email: "hello@alliekmiller.com",
    contact: "Adam",
    listed: true,
    expertise: ["AI Strategy", "Machine Learning", "Business Development", "AI Diversity"],
    industries: ["Technology", "Finance", "Retail", "Healthcare"],
    ranking: 88,
  },
  // Add more speakers as needed for a good fallback dataset
]

let _cachedSpeakers: Speaker[] | null = null

async function loadSpeakers(): Promise<Speaker[]> {
  // Return cached speakers if available
  if (_cachedSpeakers) {
    return _cachedSpeakers
  }

  try {
    console.log("Loading speakers data...")
    const sheetSpeakers = await fetchSpeakersFromSheet()

    if (Array.isArray(sheetSpeakers) && sheetSpeakers.length > 0) {
      console.log(`Successfully loaded ${sheetSpeakers.length} speakers from Google Sheet`)
      _cachedSpeakers = sheetSpeakers
      return sheetSpeakers
    } else {
      console.log("No speakers returned from Google Sheet, using local fallback")
    }
  } catch (error) {
    console.error("Error fetching speakers from Google Sheet:", error)
  }

  // Fallback to local data if sheet fetch fails or returns no data
  console.log("Using local speaker data as fallback")
  _cachedSpeakers = localSpeakers.sort((a, b) => b.ranking - a.ranking)
  return _cachedSpeakers
}

export async function getAllSpeakers(): Promise<Speaker[]> {
  try {
    const speakers = await loadSpeakers()
    const listedSpeakers = Array.isArray(speakers) ? speakers.filter((speaker) => speaker.listed) : []
    console.log(`Returning ${listedSpeakers.length} listed speakers`)
    return listedSpeakers
  } catch (error) {
    console.error("Error in getAllSpeakers:", error)
    // Return local speakers as final fallback
    const fallbackSpeakers = localSpeakers.filter((speaker) => speaker.listed).sort((a, b) => b.ranking - a.ranking)
    console.log(`Using local fallback: ${fallbackSpeakers.length} speakers`)
    return fallbackSpeakers
  }
}

export async function getSpeakerBySlug(slug: string): Promise<Speaker | undefined> {
  try {
    const speakers = await loadSpeakers()
    return Array.isArray(speakers) ? speakers.find((speaker) => speaker.slug === slug) : undefined
  } catch (error) {
    console.error("Error in getSpeakerBySlug:", error)
    // Return from local speakers as fallback
    return localSpeakers.find((speaker) => speaker.slug === slug)
  }
}

export async function searchSpeakers(query: string): Promise<Speaker[]> {
  try {
    const speakers = await loadSpeakers()
    if (!Array.isArray(speakers)) {
      console.log("Speakers data is not an array, returning empty array")
      return []
    }

    const lowercaseQuery = query.toLowerCase().trim()

    if (!lowercaseQuery) {
      return speakers.filter((speaker) => speaker.listed)
    }

    return speakers.filter((speaker) => {
      if (!speaker.listed) return false

      const nameWords = speaker.name.toLowerCase().split(/\s+/)
      const titleWords = speaker.title.toLowerCase().split(/\s+/)

      const nameMatch = nameWords.some((word) => word.includes(lowercaseQuery))
      const titleMatch = titleWords.some((word) => word.includes(lowercaseQuery))

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
    if (!Array.isArray(speakers)) {
      console.log("Speakers data is not an array, returning empty array")
      return []
    }

    const filteredSpeakers = speakers.filter(
      (speaker) =>
        speaker.listed && speaker.industries.some((ind) => ind.toLowerCase().includes(industry.toLowerCase())),
    )

    console.log(`Found ${filteredSpeakers.length} speakers for industry: ${industry}`)
    return filteredSpeakers
  } catch (error) {
    console.error("Error in getSpeakersByIndustry:", error)
    return []
  }
}

export async function getFeaturedSpeakers(count = 8): Promise<Speaker[]> {
  try {
    const speakers = await getAllSpeakers()
    const featuredSpeakers = Array.isArray(speakers) ? speakers.slice(0, count) : []
    console.log(`Returning ${featuredSpeakers.length} featured speakers`)
    return featuredSpeakers
  } catch (error) {
    console.error("Error in getFeaturedSpeakers:", error)
    const fallbackSpeakers = localSpeakers.filter((speaker) => speaker.listed).slice(0, count)
    console.log(`Using local fallback: ${fallbackSpeakers.length} featured speakers`)
    return fallbackSpeakers
  }
}

export async function getTopSpeakers(count = 6): Promise<Speaker[]> {
  try {
    const speakers = await getAllSpeakers()
    const topSpeakers = Array.isArray(speakers) ? speakers.slice(0, count) : []
    console.log(`Returning ${topSpeakers.length} top speakers`)
    return topSpeakers
  } catch (error) {
    console.error("Error in getTopSpeakers:", error)
    const fallbackSpeakers = localSpeakers.filter((speaker) => speaker.listed).slice(0, count)
    console.log(`Using local fallback: ${fallbackSpeakers.length} top speakers`)
    return fallbackSpeakers
  }
}
