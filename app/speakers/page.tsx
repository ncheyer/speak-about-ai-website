import type { Metadata } from "next"
import SpeakerDirectory from "@/components/speaker-directory"
import { getAllSpeakers, getFeaturedSpeakers, type Speaker } from "@/lib/speakers-data"

export async function generateMetadata(): Promise<Metadata> {
  // Get featured speakers for dynamic metadata
  let featuredSpeakers: Speaker[] = []
  try {
    featuredSpeakers = await getFeaturedSpeakers(3)
  } catch (error) {
    console.error("Failed to fetch featured speakers for metadata:", error)
  }

  // Create dynamic description with featured speaker names
  const speakerNames = featuredSpeakers
    .slice(0, 3)
    .map(s => s.name)
    .filter(Boolean)
    .join(", ")
  
  const description = speakerNames
    ? `Browse 50+ AI keynote speakers including ${speakerNames}. Book artificial intelligence experts and technology leaders for your event.`
    : "Browse our directory of 50+ top AI keynote speakers. Find artificial intelligence experts and technology leaders for your event."

  // Use the first featured speaker's image if available
  const ogImage = featuredSpeakers[0]?.image 
    ? (featuredSpeakers[0].image.startsWith('http') 
        ? featuredSpeakers[0].image 
        : `https://speakabout.ai${featuredSpeakers[0].image}`)
    : "/hero-image.jpg"

  return {
    title: "AI Keynote Speakers Directory | 50+ Expert Speakers | Speak About AI",
    description,
    keywords:
      "AI speakers directory, keynote speakers, artificial intelligence experts, machine learning speakers, technology speakers, AI conference speakers, book AI speaker",
    openGraph: {
      title: "AI Keynote Speakers Directory | Speak About AI",
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "AI Keynote Speakers Directory",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Keynote Speakers Directory",
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: "/speakers",
    },
  }
}

export default async function SpeakersPage() {
  let allSpeakers: Speaker[] = []
  try {
    allSpeakers = await getAllSpeakers()
    if (allSpeakers.length === 0) {
      console.warn(
        "SpeakersPage: getAllSpeakers returned an empty array. This might be due to a fetch error or no data.",
      )
    }
  } catch (error) {
    console.error("SpeakersPage: Failed to load speakers:", error)
  }

  return (
    <div className="min-h-screen bg-white">
      <SpeakerDirectory initialSpeakers={allSpeakers} />
    </div>
  )
}
