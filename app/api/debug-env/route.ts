import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    sheetId: process.env.GOOGLE_SHEET_ID,
    apiKey: process.env.GOOGLE_SHEETS_API_KEY ? "SET" : null,
    apiKeyLength: process.env.GOOGLE_SHEETS_API_KEY?.length,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  })
}
