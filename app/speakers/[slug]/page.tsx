import { getSpeakerBySlug } from "@/lib/speakers-data"

interface Params {
  slug: string
}

interface Props {
  params: Params
}

export default async function SpeakerPage({ params }: Props) {
  const speaker = await getSpeakerBySlug(params.slug)
  console.log(`[slug] page.tsx: Speaker data fetched for ${speaker?.name}: Expertise =`, speaker?.expertise)

  if (!speaker) {
    return <div>Speaker not found</div>
  }

  return (
    <div>
      <h1>{speaker.name}</h1>
      <p>{speaker.bio}</p>
      <p>Expertise: {speaker.expertise}</p>
    </div>
  )
}
