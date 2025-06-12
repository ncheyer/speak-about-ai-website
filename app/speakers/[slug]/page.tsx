import { getSpeakerBySlug } from "@/lib/speakers-data"

interface Props {
  params: {
    slug: string
  }
}

export default async function SpeakerPage({ params }: Props) {
  const speaker = await getSpeakerBySlug(params.slug)

  console.log(
    `[slug] page.tsx: Speaker data fetched for ${speaker.name}: Expertise = ${JSON.stringify(speaker.expertise)}`,
  )

  return (
    <div>
      <h1>{speaker.name}</h1>
      <p>{speaker.bio}</p>
      <p>Expertise: {speaker.expertise}</p>
    </div>
  )
}
