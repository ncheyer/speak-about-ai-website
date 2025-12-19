import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        error: 'Anthropic API key not configured'
      }, { status: 500 })
    }

    const systemPrompt = `You are an AI assistant that extracts event and speaker booking details from text.
Extract the following information if present:
- company_name: The company or organization booking the speaker
- event_name: The name of the event
- event_date: The date of the event (format as YYYY-MM-DD if possible)
- event_location: The location/venue of the event
- contact_name: Primary contact person's name
- contact_email: Primary contact's email
- contact_phone: Primary contact's phone number
- speaker_name: The speaker being requested
- program_topic: The topic or theme of the presentation
- audience_size: Expected number of attendees (as a number)
- speaker_fee: The speaker fee (as a number, no currency symbols)
- event_type: One of "virtual", "local", or "travel"
- notes: Any additional relevant details

Return ONLY a valid JSON object with these fields. Use null for missing values. Do not include any explanation or markdown.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Extract event and booking details from this text:\n\n${text}`
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Anthropic API error:', error)
      return NextResponse.json({ error: 'Failed to parse with AI' }, { status: 500 })
    }

    const result = await response.json()
    const content = result.content?.[0]?.text

    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Parse the JSON response
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const parsed = JSON.parse(cleanContent)
      return NextResponse.json(parsed)
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

  } catch (error) {
    console.error('Parse event details error:', error)
    return NextResponse.json({
      error: 'Failed to parse event details',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
