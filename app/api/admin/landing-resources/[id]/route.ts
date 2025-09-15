import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const index = parseInt(id)
    
    // In production, delete from database
    // For now, return success with a note
    
    return NextResponse.json({ 
      success: true, 
      message: 'Resource deleted successfully (Note: Requires manual update to email-resources-config.ts for persistence)' 
    })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 })
  }
}