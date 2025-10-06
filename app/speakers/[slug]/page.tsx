import { notFound } from "next/navigation"
import { getSpeakerBySlug, getAllSpeakers } from "@/lib/speakers-data"
import SpeakerProfile from "@/components/speaker-profile"
import ScrollToTop from "./scroll-to-top"
import { generateSpeakerStructuredData } from "./structured-data"
import Script from "next/script"

interface SpeakerPageProps {
  params: Promise<{ slug: string }>
}

export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const { slug } = await params
  const speaker = await getSpeakerBySlug(slug)

  if (!speaker) {
    notFound()
  }

  // Generate structured data for Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": speaker.name,
    "jobTitle": speaker.title || "AI Keynote Speaker",
    "description": speaker.bio || speaker.title || "",
    "image": speaker.image?.startsWith('http') 
      ? speaker.image 
      : `https://speakabout.ai${speaker.image || '/placeholder.jpg'}`,
    "url": `https://speakabout.ai/speakers/${slug}`,
    "sameAs": [
      speaker.linkedin && `https://linkedin.com/in/${speaker.linkedin}`,
      speaker.twitter && `https://twitter.com/${speaker.twitter}`,
      speaker.website
    ].filter(Boolean),
    "worksFor": {
      "@type": "Organization",
      "name": "Speak About AI",
      "url": "https://speakabout.ai"
    },
    "knowsAbout": [...(speaker.topics || []), ...(speaker.expertise || [])].filter(Boolean),
    "alumniOf": speaker.education || undefined,
    "award": speaker.awards || undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SpeakerProfile speaker={speaker} />
      <ScrollToTop />
    </>
  )
}

export async function generateStaticParams() {
  try {
    const speakers = await getAllSpeakers()
    return speakers
      .filter((speaker) => speaker.slug && typeof speaker.slug === 'string')
      .map((speaker) => ({
        slug: speaker.slug,
      }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

// Enable ISR for speaker pages
export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata({ params }: SpeakerPageProps) {
  const { slug } = await params
  const speaker = await getSpeakerBySlug(slug)

  if (!speaker) {
    return {
      title: "Speaker Not Found | Speak About AI",
      description: "The requested speaker profile could not be found.",
      openGraph: {
        title: "Speaker Not Found | Speak About AI",
        description: "The requested speaker profile could not be found.",
        images: [
          {
            url: "/hero-image.jpg",
            width: 1200,
            height: 630,
            alt: "Speak About AI",
          },
        ],
      },
    }
  }

  // Create a rich description using bio and expertise
  const bioText = speaker.bio || speaker.title || ""
  const description = bioText.length > 155
    ? `${bioText.substring(0, 152)}...`
    : bioText || `Book ${speaker.name} for your next event. ${speaker.title || 'Expert AI keynote speaker'} specializing in ${speaker.topics?.slice(0, 3).join(', ') || 'artificial intelligence and technology'}.`

  // Build comprehensive keywords
  const keywords = [
    speaker.name,
    `${speaker.name} speaker`,
    `${speaker.name} keynote`,
    "AI speaker",
    "keynote speaker",
    "artificial intelligence speaker",
    ...(speaker.topics || []),
    ...(speaker.expertise || []),
    ...(speaker.industries || []),
    ...(speaker.programs || []),
  ].filter(Boolean)

  // Ensure image URL is absolute
  const imageUrl = speaker.image
    ? (speaker.image.startsWith('http') 
        ? speaker.image 
        : `https://speakabout.ai${speaker.image}`)
    : "https://speakabout.ai/hero-image.jpg"

  // Generate title with better SEO
  const pageTitle = speaker.title 
    ? `${speaker.name} - ${speaker.title} | AI Speaker`
    : `${speaker.name} - AI Keynote Speaker | Speak About AI`

  return {
    title: pageTitle,
    description,
    keywords: keywords.slice(0, 20), // Limit to 20 keywords
    openGraph: {
      title: `${speaker.name} - ${speaker.title || 'AI Keynote Speaker'}`,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${speaker.name} - ${speaker.title || 'AI Keynote Speaker'}`,
        },
      ],
      type: "profile",
      profile: {
        firstName: speaker.name.split(' ')[0],
        lastName: speaker.name.split(' ').slice(1).join(' '),
      },
    },
    twitter: {
      card: "summary_large_image",
      title: `${speaker.name} - ${speaker.title || 'AI Keynote Speaker'}`,
      description,
      images: [imageUrl],
      creator: speaker.twitter || undefined,
    },
    alternates: {
      canonical: `https://speakabout.ai/speakers/${slug}`,
    },
  }
}
