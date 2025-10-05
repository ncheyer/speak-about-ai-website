import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'contentful-management'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { Document, BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types'

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
  author?: string
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

// Convert HTML to Contentful Rich Text format
function htmlToRichText(html: string): Document {
  // This is a simplified conversion - you may want to use a proper HTML to Rich Text converter
  // For now, we'll create a basic rich text document with the HTML as a paragraph
  return {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: 'text',
            value: html.replace(/<[^>]*>/g, ''), // Strip HTML tags for now
            marks: [],
            data: {}
          }
        ]
      }
    ]
  }
}

// Convert markdown to Contentful Rich Text format
function markdownToRichText(markdown: string): Document {
  // This is a simplified conversion
  // For production, consider using a proper markdown to rich text converter
  const lines = markdown.split('\n')
  const content: any[] = []
  
  for (const line of lines) {
    if (line.trim()) {
      if (line.startsWith('# ')) {
        content.push({
          nodeType: BLOCKS.HEADING_1,
          data: {},
          content: [{
            nodeType: 'text',
            value: line.substring(2),
            marks: [],
            data: {}
          }]
        })
      } else if (line.startsWith('## ')) {
        content.push({
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [{
            nodeType: 'text',
            value: line.substring(3),
            marks: [],
            data: {}
          }]
        })
      } else {
        content.push({
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{
            nodeType: 'text',
            value: line,
            marks: [],
            data: {}
          }]
        })
      }
    }
  }
  
  return {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: content.length > 0 ? content : [{
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [{
        nodeType: 'text',
        value: markdown,
        marks: [],
        data: {}
      }]
    }]
  }
}

export async function POST(request: NextRequest) {
  console.log('=== Outrank Webhook Received ===')
  
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.OUTRANK_WEBHOOK_SECRET
    
    if (!expectedSecret) {
      console.error('OUTRANK_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }
    
    if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
      console.error('Invalid authorization header')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Parse the webhook payload
    const payload: OutrankWebhookPayload = await request.json()
    console.log(`Event Type: ${payload.event_type}`)
    console.log(`Timestamp: ${payload.timestamp}`)
    
    if (!payload.data?.articles || !Array.isArray(payload.data.articles)) {
      console.error('Invalid payload structure')
      return NextResponse.json(
        { error: 'Invalid payload structure' },
        { status: 400 }
      )
    }
    
    // Initialize Contentful Management Client
    const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN
    if (!managementToken) {
      console.error('CONTENTFUL_MANAGEMENT_TOKEN not configured')
      return NextResponse.json(
        { error: 'Contentful management token not configured' },
        { status: 500 }
      )
    }
    
    const client = createClient({
      accessToken: managementToken
    })
    
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!)
    const environment = await space.getEnvironment('master')
    
    const results = {
      processed: 0,
      created: 0,
      updated: 0,
      failed: 0,
      errors: [] as any[]
    }
    
    // Process each article
    for (const article of payload.data.articles) {
      console.log(`Processing article: ${article.title} (${article.slug})`)
      
      // Validate article
      const validation = validateArticle(article)
      if (!validation.valid) {
        console.error(`Validation failed for article ${article.id}:`, validation.errors)
        results.errors.push({ article_id: article.id, errors: validation.errors })
        results.failed++
        continue
      }
      
      try {
        // Check if blog post already exists by slug
        const existingEntries = await environment.getEntries({
          content_type: 'blogPost',
          'fields.slug': article.slug,
          limit: 1
        })
        
        // Convert content to Rich Text format
        const richTextContent = article.content_markdown 
          ? markdownToRichText(article.content_markdown)
          : htmlToRichText(article.content_html)
        
        // Prepare the entry data
        const entryData = {
          fields: {
            title: {
              'en-US': article.title
            },
            slug: {
              'en-US': article.slug
            },
            content: {
              'en-US': richTextContent
            },
            excerpt: {
              'en-US': article.meta_description || article.content_markdown?.substring(0, 160) || ''
            },
            publishedDate: {
              'en-US': article.created_at
            },
            featured: {
              'en-US': false
            },
            outrank_id: {
              'en-US': article.id
            }
          }
        }
        
        let entry
        
        if (existingEntries.items.length > 0) {
          // Update existing entry
          console.log(`Updating existing entry for slug: ${article.slug}`)
          entry = existingEntries.items[0]
          
          // Update fields
          Object.keys(entryData.fields).forEach(key => {
            entry.fields[key] = entryData.fields[key]
          })
          
          entry = await entry.update()
          results.updated++
        } else {
          // Create new entry
          console.log(`Creating new entry for slug: ${article.slug}`)
          entry = await environment.createEntry('blogPost', entryData)
          results.created++
        }
        
        // Publish the entry
        await entry.publish()
        console.log(`Successfully published: ${article.title}`)
        
        results.processed++
        
      } catch (error) {
        console.error(`Failed to process article ${article.id}:`, error)
        results.errors.push({
          article_id: article.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        results.failed++
      }
    }
    
    console.log('=== Webhook Processing Complete ===')
    console.log(`Processed: ${results.processed}`)
    console.log(`Created: ${results.created}`)
    console.log(`Updated: ${results.updated}`)
    console.log(`Failed: ${results.failed}`)
    
    return NextResponse.json({
      success: true,
      message: `Processed ${results.processed} articles successfully`,
      details: results
    })
    
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}