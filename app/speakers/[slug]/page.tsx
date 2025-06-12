import { getSpeakerBySlug } from "@/lib/speakers-data"
import SpeakerProfile from "@/components/speaker-profile" // Ensure this import is present

interface Params {
  slug: string
}

interface Props {
  params: Params
}

export default async function SpeakerPage({ params }: Props) {
  const speaker = await getSpeakerBySlug(params.slug)

  // This log will appear in your server-side terminal/Vercel logs
  console.log(
    `[slug] page.tsx: Speaker data fetched for ${speaker?.name}: Expertise = ${JSON.stringify(speaker?.expertise)}`,
  )

  if (!speaker) {
    // Using notFound() for proper Next.js 404 handling
    // If you want a custom message, you can render it here before calling notFound()
    return <div>Speaker not found. Please check the URL.</div>
  }

  return <SpeakerProfile speaker={speaker} />
}
