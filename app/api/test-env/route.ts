import { NextResponse } from "next/server"

export async function GET() {
  // Test if environment variables are being read
  const envVars = {
    ENTITY_NAME: process.env.ENTITY_NAME,
    ENTITY_ADDRESS: process.env.ENTITY_ADDRESS,
    BANK_NAME: process.env.BANK_NAME,
    BANK_ADDRESS: process.env.BANK_ADDRESS,
    ACCOUNT_NUMBER: process.env.ACCOUNT_NUMBER ? 'SET (hidden)' : 'NOT SET',
    ROUTING_NUMBER: process.env.ROUTING_NUMBER ? 'SET (hidden)' : 'NOT SET',
    SWIFT_CODE: process.env.SWIFT_CODE,
    CURRENCY_TYPE: process.env.CURRENCY_TYPE,
    // Check if any banking-related env vars exist
    hasBankingVars: Object.keys(process.env).filter(k => 
      k.includes('BANK') || k.includes('ENTITY') || k.includes('ACCOUNT') || k.includes('ROUTING') || k.includes('SWIFT')
    ),
    // Check for common env var to ensure they're loading
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  }

  return NextResponse.json(envVars)
}