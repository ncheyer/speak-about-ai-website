import { neon } from '@neondatabase/serverless'
import { notFound } from 'next/navigation'
import { FirmOfferClientPage } from './client-page'

const sql = neon(process.env.DATABASE_URL!)

interface Props {
  params: Promise<{ token: string }>
}

export default async function FirmOfferPage({ params }: Props) {
  const { token } = await params

  // Find firm offer by speaker access token or create from proposal
  let firmOffer = null
  let proposal = null

  // First check if this is a firm offer token
  const [existingOffer] = await sql`
    SELECT fo.*, p.title as proposal_title, p.client_name, p.client_email,
           p.speakers, p.event_title, p.event_date, p.total_investment
    FROM firm_offers fo
    JOIN proposals p ON p.id = fo.proposal_id
    WHERE fo.speaker_access_token = ${token}
  `

  if (existingOffer) {
    firmOffer = existingOffer
    proposal = {
      id: firmOffer.proposal_id,
      title: firmOffer.proposal_title,
      client_name: firmOffer.client_name,
      client_email: firmOffer.client_email,
      speakers: firmOffer.speakers,
      event_title: firmOffer.event_title,
      event_date: firmOffer.event_date,
      total_investment: firmOffer.total_investment
    }
  } else {
    // Check if this is a proposal access token
    const [proposalData] = await sql`
      SELECT * FROM proposals WHERE access_token = ${token}
    `

    if (!proposalData) {
      notFound()
    }

    proposal = proposalData

    // Check if firm offer already exists for this proposal
    const [existingFirmOffer] = await sql`
      SELECT * FROM firm_offers WHERE proposal_id = ${proposal.id}
    `

    if (existingFirmOffer) {
      firmOffer = existingFirmOffer
    }
  }

  // Get speaker info
  const speakers = proposal.speakers || []
  const primarySpeaker = speakers[0] || { name: 'Speaker', fee: 0 }

  return (
    <FirmOfferClientPage
      token={token}
      proposal={proposal}
      firmOffer={firmOffer}
      speakerName={primarySpeaker.name}
      speakerFee={primarySpeaker.fee || proposal.total_investment || 0}
    />
  )
}
