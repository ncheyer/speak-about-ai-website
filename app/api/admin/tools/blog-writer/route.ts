import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { requireAdminAuth } from '@/lib/auth-middleware'
import * as cheerio from 'cheerio'

const getSqlClient = () => {
  if (!process.env.DATABASE_URL) {
    console.log('Blog writer: No DATABASE_URL found')
    return null
  }
  try {
    return neon(process.env.DATABASE_URL)
  } catch (error) {
    console.error('Failed to initialize Neon client for blog writer:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const authError = requireAdminAuth(request)
    if (authError) {
      return authError
    }

    // Check for Anthropic API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        error: 'Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your environment variables.'
      }, { status: 500 })
    }

    // Get SQL client
    const sql = getSqlClient()
    if (!sql) {
      return NextResponse.json({
        error: 'Database connection failed'
      }, { status: 500 })
    }

    // Parse request body
    const body = await request.json()
    const { semrush_url, style, selected_speakers, selected_blog_posts } = body

    if (!semrush_url) {
      return NextResponse.json({
        error: 'SEMrush URL is required'
      }, { status: 400 })
    }

    console.log('Blog writer received:', {
      semrush_url,
      style,
      selected_speakers: selected_speakers?.length || 0,
      selected_blog_posts: selected_blog_posts?.length || 0
    })

    // Fetch article from SEMrush URL
    let article = ''
    let images: string[] = []

    try {
      const response = await fetch(semrush_url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      })

      if (!response.ok) {
        console.error('SEMrush fetch failed:', response.status, response.statusText)
        throw new Error(`Failed to fetch SEMrush article: ${response.status} ${response.statusText}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)

      // Extract title
      const title = $('h1').first().text() || $('title').text()

      // Extract main content (adjust selectors based on SEMrush HTML structure)
      const content = $('article').html() || $('main').html() || $('body').html()

      // Extract images
      $('img').each((_, elem) => {
        const src = $(elem).attr('src')
        if (src && src.startsWith('http')) {
          images.push(src)
        }
      })

      // Build article text
      article = `# ${title}\n\n${$('<div>').html(content).text()}`

    } catch (error) {
      console.error('Error fetching SEMrush article:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return NextResponse.json({
        error: 'Failed to fetch article from SEMrush URL',
        details: errorMessage
      }, { status: 500 })
    }

    // Get speakers - prioritize user selections, fall back to keyword search
    let allSpeakers: any[] = []

    // If user selected specific speakers, fetch those
    if (selected_speakers && selected_speakers.length > 0) {
      console.log('Fetching user-selected speakers:', selected_speakers)
      // Convert string IDs to numbers for the query
      const speakerIds = selected_speakers.map((id: string | number) =>
        typeof id === 'string' ? parseInt(id, 10) : id
      ).filter((id: number) => !isNaN(id))

      if (speakerIds.length > 0) {
        allSpeakers = await sql`
          SELECT
            id, name, bio, short_bio, one_liner, title, topics, industries, website, slug
          FROM speakers
          WHERE id = ANY(${speakerIds})
          ORDER BY featured DESC, ranking DESC
        `
        console.log(`Found ${allSpeakers.length} selected speakers`)
      }
    }

    // Fall back to keyword search if no speakers selected or found
    if (allSpeakers.length === 0) {
      const articleText = article.toLowerCase()
      const keywords = ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural', 'automation', 'robotics', 'nlp', 'computer vision', 'data science', 'tech', 'innovation', 'digital transformation', 'blockchain', 'crypto', 'web3']
      const articleKeywords = keywords.filter(kw => articleText.includes(kw))

      if (articleKeywords.length > 0) {
        const searchPattern = `%${articleKeywords[0]}%`
        allSpeakers = await sql`
          SELECT
            id, name, bio, short_bio, one_liner, title, topics, industries, website, slug
          FROM speakers
          WHERE active = true
            AND (
              LOWER(bio) LIKE ${searchPattern}
              OR LOWER(short_bio) LIKE ${searchPattern}
              OR LOWER(one_liner) LIKE ${searchPattern}
              OR LOWER(title) LIKE ${searchPattern}
              OR EXISTS (
                SELECT 1 FROM jsonb_array_elements_text(topics) topic
                WHERE LOWER(topic) LIKE ${searchPattern}
              )
            )
          ORDER BY featured DESC, ranking DESC
          LIMIT 5
        `
      }
    }

    // Build speaker context for all relevant speakers
    const speakersContext = allSpeakers.map(s => ({
      name: s.name,
      title: s.title || '',
      bio: s.short_bio || s.one_liner || s.bio?.substring(0, 200) || '',
      topics: Array.isArray(s.topics) ? s.topics.join(', ') : '',
      website: `https://speakabout.ai/speakers/${s.slug}` || s.website || ''
    }))

    // Fetch blog posts from Contentful - prioritize user selections
    let existingPosts: any[] = []
    try {
      const contentful = require('contentful')
      if (process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN) {
        const client = contentful.createClient({
          space: process.env.CONTENTFUL_SPACE_ID,
          accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
        })

        // If user selected specific blog posts, fetch those
        if (selected_blog_posts && selected_blog_posts.length > 0) {
          console.log('Fetching user-selected blog posts:', selected_blog_posts)
          // Fetch entries that match the selected slugs
          const entries = await client.getEntries({
            content_type: 'blogPost',
            'fields.slug[in]': selected_blog_posts.join(','),
            limit: 20
          })

          existingPosts = entries.items.map((item: any) => ({
            title: item.fields.title,
            slug: item.fields.slug,
            url: `https://speakabout.ai/blog/${item.fields.slug}`
          }))
          console.log(`Found ${existingPosts.length} selected blog posts`)
        }

        // Fall back to recent posts if no selections or none found
        if (existingPosts.length === 0) {
          const entries = await client.getEntries({
            content_type: 'blogPost',
            limit: 10,
            order: '-sys.createdAt'
          })

          existingPosts = entries.items.map((item: any) => ({
            title: item.fields.title,
            slug: item.fields.slug,
            url: `https://speakabout.ai/blog/${item.fields.slug}`
          }))
        }
      }
    } catch (error) {
      console.log('Could not fetch Contentful posts:', error)
      // Continue without blog posts if Contentful fails
    }

    // Define writing style instructions
    const styleInstructions = {
      'professional': 'Write in a professional and technical tone. Use industry terminology, data-driven insights, and maintain a formal voice. Focus on credibility and expertise.',
      'conversational': 'Write in a friendly, conversational tone. Use simple language, personal anecdotes, and engaging storytelling. Make complex topics accessible.',
      'thought-leadership': 'Write as a thought leader establishing authority. Use bold statements, future predictions, and industry insights. Challenge conventional thinking.',
      'educational': 'Write in an instructive, educational tone. Break down complex concepts, use examples, and provide actionable takeaways. Focus on teaching.',
      'simple': 'Write at an 8th grade reading level. Use short sentences, simple words, and a friendly approachable tone. Avoid jargon and technical terms - explain concepts simply. Make it easy for anyone to understand.'
    }

    const styleInstruction = styleInstructions[style as keyof typeof styleInstructions] || styleInstructions.professional

    // Determine if user made specific selections
    const userSelectedSpeakers = selected_speakers && selected_speakers.length > 0
    const userSelectedPosts = selected_blog_posts && selected_blog_posts.length > 0

    // Build the prompt for Claude
    const userPrompt = `Enhance the following article with internal links to our speakers and blog posts.

ORIGINAL ARTICLE:
${article}

${images.length > 0 ? `ORIGINAL IMAGES (MUST INCLUDE THESE in markdown format):
${images.map((img, i) => `${i + 1}. ![Image ${i + 1}](${img})`).join('\n')}

IMPORTANT: Include these images at appropriate places throughout the article using markdown image syntax: ![alt text](url)

` : ''}${userSelectedSpeakers ? '⭐ USER-SELECTED SPEAKERS (MUST INCLUDE THESE):' : 'RELEVANT SPEAKERS FROM OUR ROSTER:'}
${speakersContext.map((s, i) => `${i + 1}. ${s.name} - ${s.title}
   Bio: ${s.bio}
   Topics: ${s.topics}
   Profile: ${s.website}`).join('\n\n')}

${userSelectedPosts ? '⭐ USER-SELECTED BLOG POSTS (MUST LINK TO THESE):' : 'EXISTING BLOG POSTS (link to if relevant):'}
${existingPosts.map(p => `- ${p.title}: ${p.url}`).join('\n')}

SPEAK ABOUT AI:
- Main site: https://speakabout.ai
- Roster: 70+ AI pioneers (Siri Co-Founders, OpenAI Staff, Stanford Researchers)
- Contact: https://speakabout.ai/contact

YOUR TASK:
1. **Keep original content intact** - Only add links and mentions where natural
2. **${userSelectedSpeakers ? 'REQUIRED: Include ALL user-selected speakers' : 'Speaker mentions'}**:
   ${userSelectedSpeakers
     ? `- The user has specifically chosen ${speakersContext.length} speaker(s) - YOU MUST mention each one
   - Find natural places to mention their expertise and link to their profiles
   - Create a brief mention or quote using their bio information`
     : `- Only mention speakers whose expertise DIRECTLY matches the article
   - Use 0-2 speaker mentions maximum`}
   - NEVER make up names or invent quotes
   - Only use information from their actual bio
3. **${userSelectedPosts ? 'REQUIRED: Link to ALL user-selected blog posts' : 'Blog post links'}**:
   ${userSelectedPosts
     ? `- The user has specifically chosen ${existingPosts.length} blog post(s) - YOU MUST link to each one
   - Find natural places in the article to add these links
   - Use the post title or relevant anchor text`
     : `- Link to blog posts if they relate to the article content`}
4. **Add internal links**:
   - Link to https://speakabout.ai when mentioning speaker bureaus or AI experts
   - Link to https://speakabout.ai/contact for booking inquiries
5. **Subtle Speak About AI branding**:
   - Add ONE natural mention of Speak About AI in the conclusion
   - Include CTA: "To book an AI expert for your event, visit [Speak About AI](https://speakabout.ai/contact)"
6. **Maintain SEO**:
   - Keep all original headings and structure
   - Preserve markdown formatting

Return the enhanced article. ${userSelectedSpeakers || userSelectedPosts ? 'The user has made specific selections - make sure to include them all.' : 'Be subtle and accurate - never force mentions.'}`

    // Call Anthropic Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 8000,
        system: `You are a professional content editor for Speak About AI, the #1 AI speaker bureau. Your job is to add intelligent internal links to articles - NOT to rewrite them or add fake information.

CRITICAL RULES:
- NEVER make up speaker names (no "Jane Doe", "John Smith", or any fictional names)
- NEVER invent quotes, perspectives, or information not provided in the speaker bio
- Only use real information from speaker bios provided

${userSelectedSpeakers || userSelectedPosts ? `IMPORTANT - USER SELECTIONS:
- Items marked with ⭐ were SPECIFICALLY CHOSEN by the user
- You MUST include ALL user-selected speakers with mentions and profile links
- You MUST include links to ALL user-selected blog posts
- Find natural places to integrate these - the user expects them to appear` : '- When in doubt, just add internal links and subtle branding'}

When enhancing articles:
- Maintain 100% of the original article's content, structure, and SEO
- PRESERVE ALL IMAGES from the original article - include them using markdown syntax ![alt](url)
- Add smart internal links to https://speakabout.ai and relevant speaker pages
- Add subtle Speak About AI branding in the conclusion
- Preserve all markdown formatting (headings, lists, emphasis, images)

Style instruction: ${styleInstruction}`,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Anthropic API error:', error)
      return NextResponse.json({
        error: 'Failed to generate blog post'
      }, { status: 500 })
    }

    const data = await response.json()
    const blogContent = data.content[0]?.text || 'Sorry, I could not generate a blog post.'

    return NextResponse.json({
      blog: blogContent,
      images: images,
      semrush_url: semrush_url,
      speakers_mentioned: allSpeakers.length
    })

  } catch (error) {
    console.error('Blog writer error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}
