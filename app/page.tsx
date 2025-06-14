import type { Metadata } from "next"
import Hero from "@/components/hero"
import FeaturedSpeakers from "@/components/featured-speakers"
import ClientLogos from "@/components/client-logos"
import WhyChooseUs from "@/components/why-choose-us"
import BookingCTA from "@/components/booking-cta"
import { getFeaturedSpeakers } from "@/lib/speakers-data"

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
  // Pre-load featured speakers for better performance
  let featuredSpeakers = []
  try {
    featuredSpeakers = await getFeaturedSpeakers(6)
  } catch (error) {
    console.error("Failed to load featured speakers for homepage:", error)
    // Component will handle the empty array gracefully
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
