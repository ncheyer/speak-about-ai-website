import { NextRequest, NextResponse } from 'next/server'
import { createGmailClient } from '@/lib/gmail-client'

export async function GET(request: NextRequest) {
  try {
    const gmailClient = createGmailClient()
    const authUrl = gmailClient.getAuthUrl('gmail-auth')

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Error generating Gmail auth URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    )
  }
}
