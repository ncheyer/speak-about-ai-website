import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          error: "DATABASE_URL environment variable is not set",
          availableEnvVars: Object.keys(process.env).filter(
            (key) => key.includes("DATABASE") || key.includes("POSTGRES") || key.includes("NEON"),
          ),
        },
        { status: 500 },
      )
    }

    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL)
    console.log("DATABASE_URL starts with:", process.env.DATABASE_URL?.substring(0, 20))

    // Try to create the SQL client
    const sql = neon(process.env.DATABASE_URL)

    // Test basic connection
    const result = await sql`SELECT NOW() as current_time, version() as postgres_version`

    // Test if deals table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'deals'
      ) as table_exists
    `

    return NextResponse.json({
      success: true,
      connection: "Connected successfully",
      currentTime: result[0]?.current_time,
      postgresVersion: result[0]?.postgres_version,
      dealsTableExists: tableCheck[0]?.table_exists,
      databaseUrl: process.env.DATABASE_URL ? "Set (hidden for security)" : "Not set",
    })
  } catch (error) {
    console.error("Neon connection error:", error)

    return NextResponse.json(
      {
        error: "Failed to connect to Neon database",
        details: error instanceof Error ? error.message : "Unknown error",
        databaseUrl: process.env.DATABASE_URL ? "Set (hidden for security)" : "Not set",
        availableEnvVars: Object.keys(process.env).filter(
          (key) => key.includes("DATABASE") || key.includes("POSTGRES") || key.includes("NEON"),
        ),
      },
      { status: 500 },
    )
  }
}
