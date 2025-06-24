import { getSpeakerBySlug, getAllSpeakers } from "@/lib/speakers-data"
import SpeakerProfile from "@/components/speaker-profile"
import ScrollToTop from "./scroll-to-top"
import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

interface Props {
  params: { slug: string }
}

// Generate dynamic metadata for each speaker page
export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const speaker = await getSpeakerBySlug(params.slug)

  if (!speaker) {
    return {
      title: "Speaker Not Found",
      description: "The requested speaker could not be found.",
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  // Construct a concise title
  const title = `${speaker.name} | AI Speaker | Speak About AI`

  // Construct a concise description
  let description =
    speaker.shortBio ||
    `Book ${speaker.name}, leading AI keynote speaker on ${speaker.expertise?.[0] || "various AI topics"}. Explore topics & availability with Speak About AI.`
  if (description.length > 160) {
    description =
      `Book AI keynote speaker ${speaker.name}. Discover their expertise & topics for your event with Speak About AI. Check availability.`.substring(
        0,
        157,
      ) + "..."
  }
  if (description.length > 160) {
    // Final check if the fallback was still too long
    description = description.substring(0, 157) + "..."
  }

  return {
    title: title.length > 60 ? `${speaker.name} | Speak About AI` : title, // Fallback for long names
    description: description,
    alternates: {
      canonical: `/speakers/${speaker.slug}`,
    },
    openGraph: {
      title: `${speaker.name} | Speak About AI`,
      description: description, // Use the same optimized description
      images: speaker.headshotUrl ? [speaker.headshotUrl, ...previousImages] : previousImages,
    },
  }
}

export default async function SpeakerPage({ params }: Props) {
  const speaker = await getSpeakerBySlug(params.slug)

  if (!speaker) {
    notFound()
  }

  return (
    <>
      <ScrollToTop />
      <SpeakerProfile speaker={speaker} />
    </>
  )
}

// Generate static paths for all speakers at build time
export async function generateStaticParams() {
  const speakers = await getAllSpeakers()
  return speakers.map((speaker) => ({
    slug: speaker.slug,
  }))
}
