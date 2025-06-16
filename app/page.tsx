import type { Metadata } from "next"
import Hero from "@/components/hero"
import ClientLogos from "@/components/client-logos"
import FeaturedSpeakers from "@/components/featured-speakers"
import WhyChooseUs from "@/components/why-choose-us"
import BookingCTA from "@/components/booking-cta"
import { getFeaturedSpeakers, type Speaker } from "@/lib/speakers-data" // Ensure Speaker type is imported

export const metadata: Metadata = {
  title: "Book Top AI Keynote Speakers 2025 | The Only AI-Exclusive Speaker Bureau",
  description:
    "Book world-class AI keynote speakers for your next event. The only speaker bureau exclusively focused on artificial intelligence experts. Trusted by Fortune 500 companies.",
  keywords:
    "AI keynote speakers, book AI speakers, artificial intelligence speakers, AI conference speakers, machine learning speakers, tech keynote speakers",
  openGraph: {
    title: "Book Top AI Keynote Speakers 2025 | Speak About AI",
    description:
      "The world's only AI-exclusive speaker bureau. Book top artificial intelligence experts for your next event.",
    type: "website",
  },
}

export default async function HomePage() {
  let featuredSpeakers: Speaker[] = [] // Default to empty array
  try {
    featuredSpeakers = await getFeaturedSpeakers(6)
    if (featuredSpeakers.length === 0) {
      console.warn(
        "HomePage: getFeaturedSpeakers returned an empty array. This might be due to a fetch error or no featured speakers.",
      )
    }
  } catch (error) {
    console.error("HomePage: Failed to load featured speakers:", error)
    // featuredSpeakers remains an empty array, FeaturedSpeakers component should handle this
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
