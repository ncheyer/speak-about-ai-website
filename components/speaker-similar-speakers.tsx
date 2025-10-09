"use client"

import { useEffect, useState } from "react"
import { Users } from "lucide-react"
import { getSpeakerBySlug, type Speaker } from "@/lib/speakers-data"
import { SpeakerCard } from "@/components/speaker-card"

interface SpeakerSimilarSpeakersProps {
  similarSpeakerSlugs: string[]
  currentSpeakerName: string
  limit?: number
}

export function SpeakerSimilarSpeakers({ similarSpeakerSlugs, currentSpeakerName, limit = 3 }: SpeakerSimilarSpeakersProps) {
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSpeakers() {
      try {
        // Fetch all similar speakers
        const speakerPromises = similarSpeakerSlugs.slice(0, limit).map(slug => getSpeakerBySlug(slug))
        const results = await Promise.all(speakerPromises)

        // Filter out undefined/null results
        const validSpeakers = results.filter((s): s is Speaker => s !== undefined && s !== null)

        setSpeakers(validSpeakers)
      } catch (error) {
        console.error("Failed to fetch similar speakers:", error)
        setSpeakers([])
      } finally {
        setLoading(false)
      }
    }

    if (similarSpeakerSlugs && similarSpeakerSlugs.length > 0) {
      fetchSpeakers()
    } else {
      setLoading(false)
    }
  }, [similarSpeakerSlugs, limit])

  // Don't render anything if loading or no speakers
  if (loading || speakers.length === 0) {
    return null
  }

  return (
    <section className="mb-12 mt-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
          <Users className="w-8 h-8 mr-3 text-[#1E68C6]" />
          You May Also Like
        </h2>
        <p className="text-gray-600 mt-2">
          Other exceptional AI speakers you might be interested in
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {speakers.map((speaker) => (
          <SpeakerCard
            key={speaker.slug}
            speaker={speaker}
            contactSource={`similar-to-${currentSpeakerName.toLowerCase().replace(/\s+/g, '-')}`}
          />
        ))}
      </div>
    </section>
  )
}
