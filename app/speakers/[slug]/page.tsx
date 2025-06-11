import type { Metadata } from "next"
import { notFound } from "next/navigation"
import SpeakerProfile from "@/components/speaker-profile"
import { getSpeakerBySlug, getAllSpeakers } from "@/lib/speakers-data"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params
  const speaker = await getSpeakerBySlug(slug)

  if (!speaker) {
    return {
      title: "Speaker Not Found | Speak About AI",
      description: "The requested speaker could not be found.",
    }
  }

  return {
    title: `${speaker.name} - AI Keynote Speaker | Speak About AI`,
    description: `Book ${speaker.name}, ${speaker.title}. ${speaker.bio.substring(0, 150)}...`,
    keywords: `${speaker.name}, AI keynote speaker, artificial intelligence speaker, ${speaker.title}, ${speaker.expertise.join(", ")}`,
    openGraph: {
      title: `${speaker.name} - AI Keynote Speaker`,
      description: speaker.bio.substring(0, 200),
      images: [speaker.image],
    },
  }
}

export default async function SpeakerPage({ params }: Props) {
  const { slug } = params

  // Debug logging
  console.log("Requested speaker slug:", slug)

  const speaker = await getSpeakerBySlug(slug)

  if (!speaker) {
    console.log("Speaker not found for slug:", slug)

    // Get all speakers to show available slugs in development
    if (process.env.NODE_ENV === "development") {
      const allSpeakers = await getAllSpeakers()
      console.log(
        "Available speaker slugs:",
        allSpeakers.map((s) => s.slug),
      )
    }

    notFound()
  }

  console.log("Found speaker:", speaker.name)
  return <SpeakerProfile speaker={speaker} />
}

export async function generateStaticParams() {
  try {
    const speakers = await getAllSpeakers()

    if (!Array.isArray(speakers)) {
      console.warn("getAllSpeakers did not return an array, returning empty array for generateStaticParams")
      return []
    }

    const params = speakers.map((speaker) => ({
      slug: speaker.slug,
    }))

    console.log(
      "Generated static params for speakers:",
      params.map((p) => p.slug),
    )
    return params
  } catch (error) {
    console.error("Error in generateStaticParams:", error)
    // Return empty array as fallback to prevent build failure
    return []
  }
}
