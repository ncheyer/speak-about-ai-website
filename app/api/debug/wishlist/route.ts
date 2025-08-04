import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET() {
  const results: any = {
    database: {
      hasUrl: !!process.env.DATABASE_URL,
      urlLength: process.env.DATABASE_URL?.length || 0,
    },
    connection: {
      status: 'not_tested',
      error: null
    },
    tables: {
      speakers: false,
      wishlists: false,
      deals: false
    },
    wishlistTest: {
      canConnect: false,
      error: null
    }
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      ...results,
      error: 'DATABASE_URL not configured'
    })
  }

  try {
    const sql = neon(process.env.DATABASE_URL)
    
    // Test basic connection
    await sql`SELECT 1 as test`
    results.connection.status = 'connected'
    
    // Check if tables exist
    const tableChecks = await sql`
      SELECT 
        table_name,
        EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = t.table_name
        ) as exists
      FROM (
        VALUES ('speakers'), ('wishlists'), ('deals')
      ) AS t(table_name)
    `
    
    tableChecks.forEach((check: any) => {
      results.tables[check.table_name] = check.exists
    })
    
    // If wishlists table exists, try to count rows
    if (results.tables.wishlists) {
      try {
        const countResult = await sql`SELECT COUNT(*) as count FROM wishlists`
        results.wishlistTest = {
          canConnect: true,
          rowCount: parseInt(countResult[0].count),
          error: null
        }
      } catch (e: any) {
        results.wishlistTest.error = e.message
      }
    } else {
      results.wishlistTest.error = 'Wishlists table does not exist'
    }
    
    // If speakers table exists, check count
    if (results.tables.speakers) {
      const speakerCount = await sql`SELECT COUNT(*) as count FROM speakers`
      results.speakerCount = parseInt(speakerCount[0].count)
    }
    
  } catch (error: any) {
    results.connection.status = 'error'
    results.connection.error = error.message
  }

  return NextResponse.json({
    ...results,
    recommendation: !results.tables.wishlists 
      ? 'Run the wishlist migration script to create tables' 
      : !results.tables.speakers
      ? 'Run the speakers migration script first'
      : 'Tables exist - check API error details'
  })
}