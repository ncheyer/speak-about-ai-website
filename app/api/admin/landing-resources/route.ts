import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    const sql = neon(databaseUrl)
    
    // First, ensure the table exists
    await sql`
      CREATE TABLE IF NOT EXISTS landing_page_resources (
        id SERIAL PRIMARY KEY,
        url_patterns TEXT[],
        title_patterns TEXT[],
        subject VARCHAR(255) NOT NULL,
        resource_content TEXT NOT NULL,
        priority INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(255),
        times_used INTEGER DEFAULT 0,
        last_used_at TIMESTAMP WITH TIME ZONE
      )
    `

    // Fetch all resources
    const resources = await sql`
      SELECT * FROM landing_page_resources 
      WHERE is_active = true 
      ORDER BY priority DESC, created_at DESC
    `
    
    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    const sql = neon(databaseUrl)
    const newResource = await request.json()
    
    // Insert the new resource
    const result = await sql`
      INSERT INTO landing_page_resources (
        url_patterns,
        title_patterns,
        subject,
        resource_content,
        priority,
        is_active,
        created_by
      ) VALUES (
        ${newResource.urlPatterns || []},
        ${newResource.titlePatterns || []},
        ${newResource.subject},
        ${newResource.resourceContent},
        ${newResource.priority || 0},
        ${newResource.isActive !== false},
        'admin'
      )
      RETURNING *
    `
    
    return NextResponse.json({ 
      success: true, 
      message: 'Resource added successfully',
      resource: result[0]
    })
  } catch (error) {
    console.error('Error adding resource:', error)
    return NextResponse.json({ error: 'Failed to add resource' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    const sql = neon(databaseUrl)
    const { resource, index } = await request.json()
    
    // If index is provided, use it as the ID
    // Otherwise, try to match by subject
    let result
    if (index !== undefined) {
      result = await sql`
        UPDATE landing_page_resources 
        SET 
          url_patterns = ${resource.urlPatterns || []},
          title_patterns = ${resource.titlePatterns || []},
          subject = ${resource.subject},
          resource_content = ${resource.resourceContent},
          priority = ${resource.priority || 0},
          is_active = ${resource.isActive !== false},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${index + 1}
        RETURNING *
      `
    } else {
      // Insert as new if no ID provided
      result = await sql`
        INSERT INTO landing_page_resources (
          url_patterns,
          title_patterns,
          subject,
          resource_content,
          priority,
          is_active,
          created_by
        ) VALUES (
          ${resource.urlPatterns || []},
          ${resource.titlePatterns || []},
          ${resource.subject},
          ${resource.resourceContent},
          ${resource.priority || 0},
          ${resource.isActive !== false},
          'admin'
        )
        RETURNING *
      `
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Resource updated successfully',
      resource: result[0]
    })
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 })
  }
}