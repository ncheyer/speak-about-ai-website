import type { Metadata } from "next"
import SpeakerDirectory from "@/components/speaker-directory"
import { getAllSpeakers, type Speaker } from "@/lib/speakers-data" // Ensure Speaker type is imported

export const metadata: Metadata = {
  title: "All AI Keynote Speakers | Browse World-Class AI Experts",
  description:
    "Browse our complete directory of world-class artificial intelligence experts, tech visionaries, and industry practitioners. Book the perfect AI speaker for your event.",
  keywords:
    "AI keynote speakers, artificial intelligence experts, tech visionaries, AI conference speakers, machine learning speakers, AI industry practitioners",
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
