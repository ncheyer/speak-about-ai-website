import type { Metadata } from "next"
import SpeakerDirectory from "@/components/speaker-directory"
import { getAllSpeakers, type Speaker } from "@/lib/speakers-data" // Ensure Speaker type is imported

export const metadata: Metadata = {
  title: "See Our AI Keynote Speakers | Speak About AI", // Updated: 46 chars
  description:
    "Explore our AI speaker directory. Find world-class artificial intelligence experts, tech visionaries & practitioners. Book the perfect AI speaker for your event.", // 159 chars
  keywords:
    "AI keynote speakers, artificial intelligence experts, tech visionaries, AI conference speakers, machine learning speakers, AI industry practitioners",
  alternates: {
    canonical: "/speakers",
  },
}

export default async function SpeakersPage() {
  let allSpeakers: Speaker[] = [] // Default to empty array
  try {
    allSpeakers = await getAllSpeakers()
    if (allSpeakers.length === 0) {
      console.warn(
        "SpeakersPage: getAllSpeakers returned an empty array. This might be due to a fetch error or no data.",
      )
    }
  } catch (error) {
    console.error("SpeakersPage: Failed to load speakers:", error)
    // allSpeakers remains an empty array, SpeakerDirectory should handle this
  }

  return (
    <div className="min-h-screen bg-white">
      <SpeakerDirectory initialSpeakers={allSpeakers} />
    </div>
  )
}
