import type { Metadata } from "next"
import SpeakerDirectory from "@/components/speaker-directory"
import { getAllSpeakers, type Speaker } from "@/lib/speakers-data"

export const metadata: Metadata = {
  title: "AI Keynote Speakers Directory | Speak About AI",
  description:
    "Browse our directory of top AI keynote speakers. Find artificial intelligence experts and technology leaders for your event.", // 127 chars
  keywords:
    "AI speakers directory, keynote speakers, artificial intelligence experts, machine learning speakers, technology speakers, AI conference speakers",
  alternates: {
    canonical: "/speakers",
  },
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
