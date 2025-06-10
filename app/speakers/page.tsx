import type { Metadata } from "next"
import SpeakerDirectory from "@/components/speaker-directory"
import { getAllSpeakers } from "@/lib/speakers-data" // Import the async function

export const metadata: Metadata = {
  title: "All AI Speakers | Complete Directory of AI Keynote Speakers | Speak About AI",
  description:
    "Browse our complete directory of 50+ AI keynote speakers. From Siri co-founders to Google executives, find the perfect artificial intelligence expert for your event.",
  keywords:
    "AI speakers directory, artificial intelligence speakers, AI keynote speakers, machine learning speakers, tech speakers",
}

export default async function SpeakersPage() {
  // Make the page component async
  const allSpeakers = await getAllSpeakers() // Await the data fetch

  return (
    <div className="min-h-screen bg-white">
      <SpeakerDirectory initialSpeakers={allSpeakers} /> {/* Pass initial data */}
    </div>
  )
}
