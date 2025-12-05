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

    // Get SQL client
    const sql = getSqlClient()
    let speakers: any[] = []

    if (sql && foundKeywords.length > 0) {
      try {
        // Build search pattern for multiple keywords
        const searchPatterns = foundKeywords.slice(0, 5).map(kw => `%${kw}%`)

        // Search speakers using multiple keywords
        speakers = await sql`
          SELECT DISTINCT
            id, name, bio, short_bio, one_liner, title, topics, industries, website, slug
          FROM speakers
          WHERE listed = true
            AND (
              ${sql.unsafe(searchPatterns.map((_, i) => `
                LOWER(bio) LIKE $${i + 1}
                OR LOWER(short_bio) LIKE $${i + 1}
                OR LOWER(one_liner) LIKE $${i + 1}
                OR LOWER(title) LIKE $${i + 1}
                OR EXISTS (
                  SELECT 1 FROM jsonb_array_elements_text(topics) topic
                  WHERE LOWER(topic) LIKE $${i + 1}
                )
              `).join(' OR '), ...searchPatterns)}
            )
          ORDER BY featured DESC, ranking DESC
          LIMIT 8
        `
      } catch (sqlError) {
        console.error('SQL query error, trying simpler query:', sqlError)
        // Fallback to simpler query if the complex one fails
        const primaryKeyword = `%${foundKeywords[0]}%`
        speakers = await sql`
          SELECT
            id, name, bio, short_bio, one_liner, title, topics, industries, website, slug
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
      }
    }

    // Format speakers for response
    const formattedSpeakers = speakers.map(s => ({
      id: s.id,
      name: s.name,
      title: s.title || '',
      bio: s.short_bio || s.one_liner || (s.bio ? s.bio.substring(0, 200) : ''),
      topics: Array.isArray(s.topics) ? s.topics.join(', ') : '',
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
      keywords: foundKeywords
    })

  } catch (error) {
    console.error('Content preview error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}
