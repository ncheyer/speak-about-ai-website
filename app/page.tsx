import type { Metadata } from "next"
import Hero from "@/components/hero"
import ClientLogos from "@/components/client-logos"
import FeaturedSpeakers from "@/components/featured-speakers"
import WhyChooseUs from "@/components/why-choose-us"
import BookingCTA from "@/components/booking-cta"
import { getFeaturedSpeakers, type Speaker } from "@/lib/speakers-data"

export const metadata: Metadata = {
  title: "Book Top AI Keynote Speakers | Speak About AI",
  description:
    "Book world-class AI keynote speakers for your event. Speak About AI is the only AI-exclusive bureau, trusted by Fortune 500s.", // 128 chars
  keywords:
    "AI keynote speakers, book AI speakers, artificial intelligence speakers, AI conference speakers, machine learning speakers, tech keynote speakers",
  openGraph: {
    title: "Book Top AI Keynote Speakers | Speak About AI",
    description:
      "Book world-class AI keynote speakers with Speak About AI, the AI-exclusive bureau trusted by Fortune 500s. Find your expert for your next event.",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
}

export default async function HomePage() {
  let featuredSpeakers: Speaker[] = []
  try {
    featuredSpeakers = await getFeaturedSpeakers(6)
    if (featuredSpeakers.length === 0) {
      console.warn(
        "HomePage: getFeaturedSpeakers returned an empty array. This might be due to a fetch error or no featured speakers.",
      )
    }
  } catch (error) {
    console.error("HomePage: Failed to load featured speakers:", error)
  }

  return (
    <main className="min-h-screen">
      <Hero />
      <ClientLogos />
      <FeaturedSpeakers initialSpeakers={featuredSpeakers} />
      <WhyChooseUs />
      <BookingCTA />
    </main>
  )
}
