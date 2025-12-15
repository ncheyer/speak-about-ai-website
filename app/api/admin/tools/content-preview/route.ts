import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { requireAdminAuth } from '@/lib/auth-middleware'
import * as cheerio from 'cheerio'

const getSqlClient = () => {
  if (!process.env.DATABASE_URL) {
    console.log('Content preview: No DATABASE_URL found')
    return null
  }
  try {
    return neon(process.env.DATABASE_URL)
  } catch (error) {
    console.error('Failed to initialize Neon client:', error)
    return null
  }
}

// Keywords for speaker matching
const AI_KEYWORDS = [
  'artificial intelligence', 'ai', 'machine learning', 'ml', 'deep learning',
  'neural network', 'nlp', 'natural language', 'computer vision', 'robotics',
  'automation', 'data science', 'analytics', 'predictive', 'generative ai',
  'chatgpt', 'gpt', 'llm', 'large language model', 'transformer',
  'tensorflow', 'pytorch', 'algorithm', 'cognitive', 'intelligent',
  'digital transformation', 'innovation', 'tech', 'technology',
  'blockchain', 'crypto', 'web3', 'metaverse', 'virtual reality', 'vr',
  'augmented reality', 'ar', 'iot', 'internet of things', 'cloud',
  'cybersecurity', 'privacy', 'ethics', 'bias', 'responsible ai',
  'future of work', 'workforce', 'productivity', 'enterprise'
]

// Location keywords mapping to database patterns
const LOCATION_KEYWORDS: Record<string, string[]> = {
  'new york': ['new york', 'nyc', 'manhattan', 'brooklyn'],
  'san francisco': ['san francisco', 'sf', 'bay area', 'silicon valley'],
  'los angeles': ['los angeles', 'la', 'hollywood'],
  'chicago': ['chicago'],
  'boston': ['boston', 'massachusetts'],
  'seattle': ['seattle', 'washington'],
  'austin': ['austin', 'texas'],
  'miami': ['miami', 'florida'],
  'atlanta': ['atlanta', 'georgia'],
  'denver': ['denver', 'colorado'],
  'london': ['london', 'uk', 'united kingdom'],
  'toronto': ['toronto', 'canada'],
  'berlin': ['berlin', 'germany'],
  'paris': ['paris', 'france'],
  'dublin': ['dublin', 'ireland'],
  'detroit': ['detroit', 'michigan'],
  'philadelphia': ['philadelphia', 'philly'],
  'washington dc': ['washington', 'dc', 'washington dc'],
  'puerto rico': ['puerto rico'],
  'europe': ['europe', 'european'],
}

// Extract location from content
function extractLocation(content: string): string | null {
  const contentLower = content.toLowerCase()
  for (const [location, keywords] of Object.entries(LOCATION_KEYWORDS)) {
    for (const keyword of keywords) {
      // Look for the keyword with word boundaries
      const regex = new RegExp(`\\b${keyword}\\b`, 'i')
      if (regex.test(contentLower)) {
        return location
      }
    }
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const authError = requireAdminAuth(request)
    if (authError) {
      return authError
    }

    const body = await request.json()
    const { semrush_url } = body

    if (!semrush_url) {
      return NextResponse.json({ error: 'Semrush URL is required' }, { status: 400 })
    }

    // Fetch article from Semrush URL
    let title = ''
    let content = ''
    let images: string[] = []

    try {
      const response = await fetch(semrush_url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)

      // Extract title
      title = $('h1').first().text().trim() || $('title').text().trim() || 'Untitled Article'

      // Extract main content
      const contentHtml = $('article').html() || $('main').html() || $('body').html() || ''
      content = $('<div>').html(contentHtml).text().trim()

      // Extract images
      $('img').each((_, elem) => {
        const src = $(elem).attr('src')
        if (src && src.startsWith('http')) {
          images.push(src)
        }
      })
    } catch (error) {
      console.error('Error fetching Semrush article:', error)
      return NextResponse.json({
        error: 'Failed to fetch article from Semrush URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }

    // Extract keywords from content for speaker matching
    const contentLower = content.toLowerCase()
    const foundKeywords = AI_KEYWORDS.filter(kw => contentLower.includes(kw))

    // Extract location from content
    const detectedLocation = extractLocation(content)
    console.log('Detected location:', detectedLocation)

    // Get SQL client
    const sql = getSqlClient()
    let speakers: any[] = []
    let locationSpeakers: any[] = []

    if (sql) {
      try {
        // First, if a location is detected, get speakers from that location
        if (detectedLocation) {
          const locationPatterns = LOCATION_KEYWORDS[detectedLocation] || [detectedLocation]
          const locationPattern = `%${locationPatterns[0]}%`

          locationSpeakers = await sql`
            SELECT
              id, name, bio, short_bio, one_liner, title, topics, industries, website, slug, location,
              1 as location_match
            FROM speakers
            WHERE listed = true
              AND LOWER(location) LIKE ${locationPattern}
            ORDER BY featured DESC, ranking DESC
            LIMIT 8
          `
          console.log(`Found ${locationSpeakers.length} speakers in ${detectedLocation}`)
        }

        // Then get keyword-matched speakers
        if (foundKeywords.length > 0) {
          const primaryKeyword = `%${foundKeywords[0]}%`
          const keywordSpeakers = await sql`
            SELECT
              id, name, bio, short_bio, one_liner, title, topics, industries, website, slug, location,
              0 as location_match
            FROM speakers
            WHERE listed = true
              AND (
                LOWER(bio) LIKE ${primaryKeyword}
                OR LOWER(short_bio) LIKE ${primaryKeyword}
                OR LOWER(one_liner) LIKE ${primaryKeyword}
                OR LOWER(title) LIKE ${primaryKeyword}
                OR EXISTS (
                  SELECT 1 FROM jsonb_array_elements_text(topics) topic
                  WHERE LOWER(topic) LIKE ${primaryKeyword}
                )
              )
            ORDER BY featured DESC, ranking DESC
            LIMIT 8
          `

          // Combine: location speakers first, then keyword speakers (deduped)
          const seenIds = new Set(locationSpeakers.map(s => s.id))
          speakers = [
            ...locationSpeakers,
            ...keywordSpeakers.filter(s => !seenIds.has(s.id))
          ].slice(0, 8)
        } else {
          speakers = locationSpeakers
        }
      } catch (sqlError) {
        console.error('SQL query error:', sqlError)
        speakers = locationSpeakers // Fall back to location speakers if any
      }
    }

    // Format speakers for response
    const formattedSpeakers = speakers.map(s => ({
      id: s.id,
      name: s.name,
      title: s.title || '',
      bio: s.short_bio || s.one_liner || (s.bio ? s.bio.substring(0, 200) : ''),
      topics: Array.isArray(s.topics) ? s.topics.join(', ') : '',
      location: s.location || '',
      locationMatch: s.location_match === 1,
      website: `https://speakabout.ai/speakers/${s.slug}`,
      slug: s.slug
    }))

    // Fetch existing blog posts from Contentful
    let blogPosts: any[] = []
    try {
      const contentful = require('contentful')
      if (process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN) {
        const client = contentful.createClient({
          space: process.env.CONTENTFUL_SPACE_ID,
          accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
        })

        const entries = await client.getEntries({
          content_type: 'blogPost',
          limit: 15,
          order: '-sys.createdAt'
        })

        blogPosts = entries.items.map((item: any) => ({
          title: item.fields.title,
          slug: item.fields.slug,
          url: `https://speakabout.ai/blog/${item.fields.slug}`
        }))
      }
    } catch (error) {
      console.log('Could not fetch Contentful posts:', error)
    }

    return NextResponse.json({
      title,
      content: content.substring(0, 2000), // Truncate for preview
      speakers: formattedSpeakers,
      blogPosts,
      images,
      keywords: foundKeywords,
      detectedLocation
    })

  } catch (error) {
    console.error('Content preview error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}
