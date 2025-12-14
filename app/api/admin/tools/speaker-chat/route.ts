import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { requireAdminAuth } from '@/lib/auth-middleware'

const getSqlClient = () => {
  if (!process.env.DATABASE_URL) {
    console.log('Speaker chat: No DATABASE_URL found')
    return null
  }
  try {
    return neon(process.env.DATABASE_URL)
  } catch (error) {
    console.error('Failed to initialize Neon client for speaker chat:', error)
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
    const { message, conversation } = body

    if (!message) {
      return NextResponse.json({
        error: 'Message is required'
      }, { status: 400 })
    }

    // Extract search terms from the message
    const messageLower = message.toLowerCase()

    // Remove common words to get key search terms
    const stopWords = ['who', 'what', 'where', 'when', 'why', 'how', 'is', 'are', 'was', 'were', 'the', 'a', 'an', 'in', 'on', 'at', 'for', 'about', 'can', 'you', 'find', 'me', 'show', 'tell', 'get', 'list', 'speakers', 'speaker', 'from', 'with', 'that', 'have', 'has', 'had', 'do', 'does', 'did', 'their', 'there', 'they', 'them', 'this', 'these', 'those', 'who\'s', 'what\'s', 'worked', 'work', 'works', 'working', 'been', 'be', 'being']

    // Strip punctuation and filter words
    const words = messageLower
      .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.includes(w))
      .sort((a, b) => b.length - a.length) // Prioritize longer words (usually more specific)

    // Use semantic search if we have meaningful search terms
    const shouldFilter = words.length > 0
    const searchTerm = `%${words[0] || ''}%`

    let speakers
    if (shouldFilter) {
      // Smart database search across name, bio, topics, title, and location
      speakers = await sql`
        SELECT
          id, name, email, bio, short_bio, one_liner, location,
          topics, industries, speaking_fee_range, website,
          featured, active, title, slug,
          CASE
            WHEN LOWER(name) LIKE ${searchTerm} THEN 1
            WHEN LOWER(title) LIKE ${searchTerm} THEN 2
            WHEN EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(topics) topic
              WHERE LOWER(topic) LIKE ${searchTerm}
            ) THEN 3
            WHEN LOWER(bio) LIKE ${searchTerm} THEN 4
            WHEN LOWER(short_bio) LIKE ${searchTerm} THEN 4
            ELSE 5
          END as relevance
        FROM speakers
        WHERE active = true
          AND (
            LOWER(name) LIKE ${searchTerm}
            OR LOWER(title) LIKE ${searchTerm}
            OR LOWER(bio) LIKE ${searchTerm}
            OR LOWER(short_bio) LIKE ${searchTerm}
            OR LOWER(one_liner) LIKE ${searchTerm}
            OR LOWER(location) LIKE ${searchTerm}
            OR EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(topics) topic
              WHERE LOWER(topic) LIKE ${searchTerm}
            )
            OR EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(industries) industry
              WHERE LOWER(industry) LIKE ${searchTerm}
            )
          )
        ORDER BY
          relevance,
          CASE WHEN featured = true THEN 0 ELSE 1 END,
          ranking DESC
        LIMIT 15
      `

      // If no results from search, fall back to top speakers
      if (speakers.length === 0) {
        speakers = await sql`
          SELECT
            id, name, email, bio, short_bio, one_liner, location,
            topics, industries, speaking_fee_range, website,
            featured, active, title, slug
          FROM speakers
          WHERE active = true
          ORDER BY
            CASE WHEN featured = true THEN 0 ELSE 1 END,
            ranking DESC
          LIMIT 20
        `
      }
    } else {
      // Fetch top speakers by ranking for general queries
      speakers = await sql`
        SELECT
          id, name, email, bio, short_bio, one_liner, location,
          topics, industries, speaking_fee_range, website,
          featured, active, title, slug
        FROM speakers
        WHERE active = true
        ORDER BY
          CASE WHEN featured = true THEN 0 ELSE 1 END,
          ranking DESC
        LIMIT 20
      `
    }

    // Build context about speakers
    const speakerContext = speakers.map((speaker: any) => ({
      name: speaker.name,
      title: speaker.title || '',
      location: speaker.location || '',
      bio: speaker.short_bio || speaker.one_liner || '',
      topics: Array.isArray(speaker.topics) ? speaker.topics : [],
      industries: Array.isArray(speaker.industries) ? speaker.industries : [],
      fee_range: speaker.speaking_fee_range || '',
      website: speaker.website || '',
      featured: speaker.featured
    }))

    // Build conversation history for context
    const conversationHistory = conversation?.slice(-10).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    })) || []

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
        max_tokens: 1024,
        system: `You are an AI assistant helping to query a speaker database for Speak About AI, a speaker bureau.

${shouldFilter ? `Based on the user's query, I've filtered to ${speakers.length} most relevant speakers from our database.` : `I've provided ${speakers.length} top-ranked speakers from our database.`}

Here are the relevant speakers:
${JSON.stringify(speakerContext, null, 2)}

When answering questions:
- Focus on the speakers provided above - these are the most relevant matches
- Be helpful and provide specific speaker recommendations
- Include speaker names, titles, locations, and key expertise areas
- Mention speaking fee ranges when relevant (but note these are estimates)
- Suggest 2-3 speakers when asked for recommendations
- Be conversational and professional
- Highlight featured speakers when appropriate
- Format your responses clearly with bullet points or lists when listing multiple speakers
- If none of the provided speakers match well, let the user know and suggest broadening their search`,
        messages: [
          ...conversationHistory,
          {
            role: 'user',
            content: message
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Anthropic API error:', error)
      console.error('Response status:', response.status)
      console.error('API Key present:', !!process.env.ANTHROPIC_API_KEY)
      console.error('API Key prefix:', process.env.ANTHROPIC_API_KEY?.substring(0, 20))
      return NextResponse.json({
        error: `Failed to get AI response: ${error.error?.message || 'Unknown error'}`,
        details: error
      }, { status: 500 })
    }

    const data = await response.json()
    const aiResponse = data.content[0]?.text || 'Sorry, I could not generate a response.'

    return NextResponse.json({
      response: aiResponse
    })

  } catch (error) {
    console.error('Speaker chat error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}
