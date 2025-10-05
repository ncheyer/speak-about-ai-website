import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

// Type definitions for the webhook payload
interface OutrankArticle {
  id: string
  title: string
  content_markdown: string
  content_html: string
  meta_description?: string
  created_at: string
  image_url?: string
  slug: string
  tags?: string[]
}

interface OutrankWebhookPayload {
  event_type: string
  timestamp: string
  data: {
    articles: OutrankArticle[]
  }
}

// Helper function to validate required fields
function validateArticle(article: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!article.title || typeof article.title !== 'string') {
    errors.push('Missing or invalid title')
  }
  if (!article.slug || typeof article.slug !== 'string') {
    errors.push('Missing or invalid slug')
  }
  if (!article.content_html && !article.content_markdown) {
    errors.push('Missing content (neither HTML nor Markdown provided)')
  }
  if (!article.created_at) {
    errors.push('Missing created_at timestamp')
  }
  
  return { valid: errors.length === 0, errors }
}

// Helper function to sanitize and prepare article data
function prepareArticleData(article: OutrankArticle) {
  return {
    title: article.title.trim(),
    slug: article.slug.toLowerCase().trim(),
    content: article.content_html || article.content_markdown,
    meta_description: article.meta_description || null,
    featured_image_url: article.image_url || null,
    published_date: article.created_at,
    tags: JSON.stringify(article.tags || []),
    status: 'published',
    outrank_id: article.id
  }
}

export async function POST(request: NextRequest) {
  console.log('[Outrank Webhook] Received POST request')
  
  try {
    // 1. Verify authorization
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.OUTRANK_WEBHOOK_SECRET
    
    if (!expectedToken) {
      console.error('[Outrank Webhook] OUTRANK_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook not configured properly' },
        { status: 500 }
      )
    }
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[Outrank Webhook] Missing or invalid authorization header')
      return NextResponse.json(
        { error: 'Unauthorized - Missing authorization header' },
        { status: 401 }
      )
    }
    
    const providedToken = authHeader.substring(7) // Remove "Bearer " prefix
    if (providedToken !== expectedToken) {
      console.warn('[Outrank Webhook] Invalid authorization token')
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }
    
    // 2. Parse and validate JSON payload
    let payload: OutrankWebhookPayload
    try {
      payload = await request.json()
    } catch (error) {
      console.error('[Outrank Webhook] Failed to parse JSON:', error)
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      )
    }
    
    // 3. Validate webhook structure
    if (!payload.event_type || payload.event_type !== 'publish_articles') {
      console.warn('[Outrank Webhook] Invalid event type:', payload.event_type)
      return NextResponse.json(
        { error: `Unsupported event type: ${payload.event_type}` },
        { status: 400 }
      )
    }
    
    if (!payload.data || !payload.data.articles || !Array.isArray(payload.data.articles)) {
      console.error('[Outrank Webhook] Invalid payload structure')
      return NextResponse.json(
        { error: 'Invalid payload structure - missing articles array' },
        { status: 400 }
      )
    }
    
    if (payload.data.articles.length === 0) {
      console.warn('[Outrank Webhook] Empty articles array')
      return NextResponse.json(
        { message: 'No articles to process' },
        { status: 200 }
      )
    }
    
    // 4. Connect to database
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      console.error('[Outrank Webhook] DATABASE_URL not configured')
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 500 }
      )
    }
    
    const sql = neon(databaseUrl)
    
    // 5. Process articles
    const results = {
      successful: [] as string[],
      failed: [] as { slug: string; error: string }[],
      duplicates: [] as string[]
    }
    
    for (const article of payload.data.articles) {
      try {
        // Validate article data
        const validation = validateArticle(article)
        if (!validation.valid) {
          console.error(`[Outrank Webhook] Invalid article ${article.slug}:`, validation.errors)
          results.failed.push({
            slug: article.slug || 'unknown',
            error: validation.errors.join(', ')
          })
          continue
        }
        
        // Prepare article data
        const articleData = prepareArticleData(article)
        
        // Check for duplicate slug or outrank_id
        const existingCheck = await sql`
          SELECT id, slug, outrank_id 
          FROM blog_posts 
          WHERE slug = ${articleData.slug} OR outrank_id = ${articleData.outrank_id}
          LIMIT 1
        `
        
        if (existingCheck.length > 0) {
          console.log(`[Outrank Webhook] Duplicate article detected: ${articleData.slug}`)
          
          // Update existing article instead of creating duplicate
          await sql`
            UPDATE blog_posts 
            SET 
              title = ${articleData.title},
              content = ${articleData.content},
              meta_description = ${articleData.meta_description},
              featured_image_url = ${articleData.featured_image_url},
              published_date = ${articleData.published_date},
              tags = ${articleData.tags}::jsonb,
              status = ${articleData.status},
              updated_at = NOW()
            WHERE slug = ${articleData.slug} OR outrank_id = ${articleData.outrank_id}
          `
          
          results.duplicates.push(articleData.slug)
          console.log(`[Outrank Webhook] Updated existing article: ${articleData.slug}`)
        } else {
          // Insert new article
          await sql`
            INSERT INTO blog_posts (
              title,
              slug,
              content,
              meta_description,
              featured_image_url,
              published_date,
              tags,
              status,
              outrank_id,
              source
            ) VALUES (
              ${articleData.title},
              ${articleData.slug},
              ${articleData.content},
              ${articleData.meta_description},
              ${articleData.featured_image_url},
              ${articleData.published_date},
              ${articleData.tags}::jsonb,
              ${articleData.status},
              ${articleData.outrank_id},
              'outrank'
            )
          `
          
          results.successful.push(articleData.slug)
          console.log(`[Outrank Webhook] Successfully inserted article: ${articleData.slug}`)
        }
      } catch (error) {
        console.error(`[Outrank Webhook] Error processing article ${article.slug}:`, error)
        results.failed.push({
          slug: article.slug || 'unknown',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    // 6. Return results
    const totalProcessed = results.successful.length + results.duplicates.length
    const hasErrors = results.failed.length > 0
    
    console.log(`[Outrank Webhook] Completed: ${results.successful.length} inserted, ${results.duplicates.length} updated, ${results.failed.length} failed`)
    
    return NextResponse.json({
      message: `Processed ${totalProcessed} of ${payload.data.articles.length} articles`,
      results: {
        inserted: results.successful.length,
        updated: results.duplicates.length,
        failed: results.failed.length,
        details: {
          successful: results.successful,
          duplicates: results.duplicates,
          failed: results.failed
        }
      }
    }, { 
      status: hasErrors ? 207 : 200 // 207 Multi-Status if some failed
    })
    
  } catch (error) {
    console.error('[Outrank Webhook] Unexpected error:', error)
    
    // Don't expose internal error details in production
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    return NextResponse.json({
      error: 'Internal server error',
      ...(isDevelopment && { 
        details: error instanceof Error ? error.message : 'Unknown error' 
      })
    }, { status: 500 })
  }
}

// Optional: Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Outrank webhook endpoint', 
      status: 'healthy',
      accepts: 'POST',
      documentation: {
        authorization: 'Bearer token required',
        contentType: 'application/json',
        eventTypes: ['publish_articles']
      }
    },
    { status: 200 }
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, GET, OPTIONS',
      'Content-Type': 'application/json'
    }
  })
}