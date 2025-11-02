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
    title: "AI Keynote Speakers | 50+ Expert Speakers | Speak About AI",
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
      canonical: "https://speakabout.ai/speakers",
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

  // Generate structured data for the speakers directory
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AI Keynote Speakers Directory",
    "description": "Browse our comprehensive directory of AI keynote speakers and artificial intelligence experts available for booking.",
    "numberOfItems": allSpeakers.length,
    "itemListElement": allSpeakers.slice(0, 10).map((speaker, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Person",
        "name": speaker.name,
        "jobTitle": speaker.title || "AI Keynote Speaker",
        "url": `https://speakabout.ai/speakers/${speaker.slug}`,
        "image": speaker.image?.startsWith('http')
          ? speaker.image
          : `https://speakabout.ai${speaker.image || '/placeholder.jpg'}`,
        "description": speaker.short_bio || speaker.bio || "",
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SpeakerDirectory initialSpeakers={allSpeakers} />
    </>
  )
}
