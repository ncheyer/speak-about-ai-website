import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    // Update Noah's basic information
    const result = await sql`
      UPDATE speakers 
      SET 
        name = 'Noah Cheyer',
        email = 'noah@speakabout.ai',
        bio = 'Co-Founder and Head of Marketing & Operations at Speak About AI. Passionate about connecting organizations with world-class AI speakers.',
        short_bio = 'Co-Founder at Speak About AI',
        one_liner = 'Co-Founder, Head of Marketing & Operations at Speak About AI',
        location = 'San Francisco, CA',
        website = 'https://speakabout.ai',
        social_media = '{"linkedin_url": "https://linkedin.com/in/noahcheyer"}',
        topics = '["AI Strategy", "Speaker Bureau Management", "Event Planning", "Marketing"]',
        industries = '["Events", "Marketing", "Technology"]',
        programs = '["The Future of AI Speaking", "Building World-Class Events", "Marketing in the AI Era"]',
        videos = '[]',
        active = true,
        listed = true
      WHERE id = 85
      RETURNING id, name, email
    `
    
    if (result.length === 0) {
      // Noah doesn't exist with ID 85, create him
      const insertResult = await sql`
        INSERT INTO speakers (
          id, name, email, bio, short_bio, one_liner, location,
          website, social_media, topics, industries, programs,
          videos, active, listed
        ) VALUES (
          85,
          'Noah Cheyer',
          'noah@speakabout.ai',
          'Co-Founder and Head of Marketing & Operations at Speak About AI. Passionate about connecting organizations with world-class AI speakers.',
          'Co-Founder at Speak About AI',
          'Co-Founder, Head of Marketing & Operations at Speak About AI',
          'San Francisco, CA',
          'https://speakabout.ai',
          '{"linkedin_url": "https://linkedin.com/in/noahcheyer"}',
          '["AI Strategy", "Speaker Bureau Management", "Event Planning", "Marketing"]',
          '["Events", "Marketing", "Technology"]',
          '["The Future of AI Speaking", "Building World-Class Events", "Marketing in the AI Era"]',
          '[]',
          true,
          true
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          bio = EXCLUDED.bio,
          short_bio = EXCLUDED.short_bio,
          one_liner = EXCLUDED.one_liner,
          location = EXCLUDED.location,
          website = EXCLUDED.website,
          social_media = EXCLUDED.social_media,
          topics = EXCLUDED.topics,
          industries = EXCLUDED.industries,
          programs = EXCLUDED.programs,
          videos = EXCLUDED.videos,
          active = EXCLUDED.active,
          listed = EXCLUDED.listed
        RETURNING id, name, email
      `
      
      return NextResponse.json({ 
        success: true, 
        message: 'Noah created/updated successfully',
        speaker: insertResult[0] 
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Noah updated successfully',
      speaker: result[0] 
    })
    
  } catch (error) {
    console.error('Error updating Noah:', error)
    return NextResponse.json({ 
      error: 'Failed to update Noah',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}