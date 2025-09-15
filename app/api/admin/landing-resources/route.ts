import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { emailResources } from '@/lib/email-resources-config'

// For now, we'll use the static config file
// In the future, this could be stored in the database

export async function GET() {
  try {
    // Return the current resources from the config file
    // Convert to a format that includes all fields
    const resources = emailResources.map(resource => ({
      urlPatterns: resource.urlPatterns || [],
      titlePatterns: resource.titlePatterns || [],
      subject: resource.subject,
      resourceContent: resource.resourceContent,
      isActive: true
    }))
    
    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newResource = await request.json()
    
    // In a production environment, you would:
    // 1. Validate the resource data
    // 2. Save to database
    // 3. Update the config file or cache
    
    // For now, we'll just return success
    // The actual implementation would require file system access
    // or database storage
    
    return NextResponse.json({ 
      success: true, 
      message: 'Resource added successfully (Note: Requires manual update to email-resources-config.ts for persistence)' 
    })
  } catch (error) {
    console.error('Error adding resource:', error)
    return NextResponse.json({ error: 'Failed to add resource' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { resource, index } = await request.json()
    
    // In production, update the resource in database
    // For now, return success with a note
    
    return NextResponse.json({ 
      success: true, 
      message: 'Resource updated successfully (Note: Requires manual update to email-resources-config.ts for persistence)' 
    })
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 })
  }
}