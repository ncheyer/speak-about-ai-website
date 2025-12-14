import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth-middleware'

const contentful = require('contentful-management')

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const authError = requireAdminAuth(request)
    if (authError) {
      return authError
    }

    // Check for Contentful Management Token
    if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN || !process.env.CONTENTFUL_SPACE_ID) {
      return NextResponse.json({
        error: 'Contentful credentials not configured'
      }, { status: 500 })
    }

    // Parse request body
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json({
        error: 'Content is required'
      }, { status: 400 })
    }

    // Extract title from markdown content (first # heading)
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : 'Untitled Article'

    // Remove title from content body
    const contentBody = content.replace(/^#\s+.+$/m, '').trim()

    // Initialize Contentful Management client
    const client = contentful.createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
    })

    // Get space and environment
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
    const environment = await space.getEnvironment('master')

    // Create a new blog post entry as draft
    const entry = await environment.createEntry('blogPost', {
      fields: {
        title: {
          'en-US': title
        },
        body: {
          'en-US': contentBody
        },
        publishDate: {
          'en-US': new Date().toISOString()
        }
      }
    })

    // Return success with entry details
    return NextResponse.json({
      success: true,
      entryId: entry.sys.id,
      url: `https://app.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/entries/${entry.sys.id}`,
      message: 'Article created as draft in Contentful'
    })

  } catch (error) {
    console.error('Push to Contentful error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to push to Contentful'
    }, { status: 500 })
  }
}
