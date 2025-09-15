import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    const { id } = await params
    const resourceId = parseInt(id) // Use ID directly
    
    const sql = neon(databaseUrl)
    
    // Delete the resource
    const result = await sql`
      DELETE FROM landing_page_resources 
      WHERE id = ${resourceId}
      RETURNING *
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Resource deleted successfully',
      resource: result[0]
    })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 })
  }
}