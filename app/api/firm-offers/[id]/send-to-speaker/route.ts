import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// POST: Send firm offer to speaker for review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { speaker_email, speaker_name } = body

    // Get the firm offer
    const [firmOffer] = await sql`
      SELECT fo.*, p.title as proposal_title, p.client_name, p.event_title, p.event_date,
             p.speakers
      FROM firm_offers fo
      JOIN proposals p ON p.id = fo.proposal_id
      WHERE fo.id = ${id}
    `

    if (!firmOffer) {
      return NextResponse.json(
        { error: 'Firm offer not found' },
        { status: 404 }
      )
    }

    // Update status to sent_to_speaker
    await sql`
      UPDATE firm_offers
      SET status = 'sent_to_speaker',
          sent_to_speaker_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    // Generate the speaker review URL
    const speakerReviewUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://speakabout.ai'}/speaker-review/${firmOffer.speaker_access_token}`

    // TODO: Send email to speaker
    // For now, we'll just return the URL
    // In production, you would integrate with your email service

    // If speaker email provided, send notification
    if (speaker_email) {
      // Here you would send an email using your email service
      // Example with SES or any email provider:
      /*
      await sendEmail({
        to: speaker_email,
        subject: `Speaking Engagement Review Request: ${firmOffer.event_title || firmOffer.proposal_title}`,
        body: `
          Hi ${speaker_name || 'there'},

          You have a new speaking engagement to review.

          Event: ${firmOffer.event_title || firmOffer.proposal_title}
          Client: ${firmOffer.client_name}
          Date: ${firmOffer.event_date || 'TBD'}

          Please review the full details and confirm your availability:
          ${speakerReviewUrl}

          Best regards,
          Speak About AI Team
        `
      })
      */
    }

    return NextResponse.json({
      success: true,
      message: 'Firm offer sent to speaker',
      speaker_review_url: speakerReviewUrl,
      firm_offer_id: id
    })
  } catch (error) {
    console.error('Error sending firm offer to speaker:', error)
    return NextResponse.json(
      { error: 'Failed to send firm offer', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
