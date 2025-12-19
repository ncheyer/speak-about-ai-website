import { neon } from '@neondatabase/serverless'
import { notFound } from 'next/navigation'
import { SpeakerReviewClient } from './client-page'

const sql = neon(process.env.DATABASE_URL!)

interface Props {
  params: Promise<{ token: string }>
}

export default async function SpeakerReviewPage({ params }: Props) {
  const { token } = await params

  // Find firm offer by speaker access token
  const [firmOffer] = await sql`
    SELECT fo.*, p.title as proposal_title, p.client_name, p.client_email,
           p.client_company, p.speakers, p.event_title, p.event_date,
           p.event_location, p.total_investment
    FROM firm_offers fo
    JOIN proposals p ON p.id = fo.proposal_id
    WHERE fo.speaker_access_token = ${token}
  `

  if (!firmOffer) {
    notFound()
  }

  // Mark as viewed if not already
  if (!firmOffer.speaker_viewed_at) {
    await sql`
      UPDATE firm_offers
      SET speaker_viewed_at = CURRENT_TIMESTAMP
      WHERE id = ${firmOffer.id}
    `
  }

  // Get speaker info from proposal
  const speakers = firmOffer.speakers || []
  const primarySpeaker = speakers[0] || { name: 'Speaker', fee: 0 }

  return (
    <SpeakerReviewClient
      token={token}
      firmOffer={firmOffer}
      speakerName={primarySpeaker.name}
    />
  )
}
