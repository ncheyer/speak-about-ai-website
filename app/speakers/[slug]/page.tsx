import { notFound } from "next/navigation"
import { getSpeakerBySlug, getAllSpeakers } from "@/lib/speakers-data"
import SpeakerProfile from "@/components/speaker-profile"
import ScrollToTop from "./scroll-to-top"

interface SpeakerPageProps {
  params: Promise<{ slug: string }>
}

export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const { slug } = await params
  const speaker = await getSpeakerBySlug(slug)

  if (!speaker) {
    notFound()
  }

  return (
    <>
      <SpeakerProfile speaker={speaker} />
      <ScrollToTop />
    </>
  )
}

export async function generateStaticParams() {
  const speakers = await getAllSpeakers()
  return speakers.map((speaker) => ({
    slug: speaker.slug,
  }))
}

export async function generateMetadata({ params }: SpeakerPageProps) {
  const { slug } = await params
  const speaker = await getSpeakerBySlug(slug)

  if (!speaker) {
    return {
      title: "Speaker Not Found | Speak About AI",
      description: "The requested speaker profile could not be found.",
    }
  }

  const description = speaker.bio
    ? `${speaker.bio.substring(0, 155)}...`
    : `Book ${speaker.name} for your next event. Expert AI keynote speaker specializing in artificial intelligence and technology.`

  return {
    title: `${speaker.name} - AI Keynote Speaker | Speak About AI`,
    description,
    keywords: [
      speaker.name,
      "AI speaker",
      "keynote speaker",
      "artificial intelligence",
      ...(speaker.topics || []),
      ...(speaker.expertise || []),
    ],
    openGraph: {
      title: `${speaker.name} - AI Keynote Speaker`,
      description,
      images: speaker.image
        ? [
            {
              url: speaker.image,
              width: 800,
              height: 600,
              alt: `${speaker.name} - AI Keynote Speaker`,
            },
          ]
        : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${speaker.name} - AI Keynote Speaker`,
      description,
      images: speaker.image ? [speaker.image] : [],
    },
    alternates: {
      canonical: `/speakers/${slug}`,
    },
  }
}
