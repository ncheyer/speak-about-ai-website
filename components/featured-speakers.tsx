"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getFeaturedSpeakers, type Speaker } from "@/lib/speakers-data"

interface FeaturedSpeakersProps {
  initialSpeakers?: Speaker[]
}

export default function FeaturedSpeakers({ initialSpeakers }: FeaturedSpeakersProps) {
  const [speakers, setSpeakers] = useState<Speaker[]>(initialSpeakers || [])
  const [loading, setLoading] = useState(!initialSpeakers)
  const [error, setError] = useState(false)

  // Load speakers if not provided as props
  useState(() => {
    if (!initialSpeakers) {
      getFeaturedSpeakers(8)
        .then((data) => {
          setSpeakers(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Failed to load featured speakers:", err)
          setError(true)
          setLoading(false)
        })
    }
  })

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-4 font-neue-haas">Featured AI Keynote Speakers</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat mb-8">
            Loading our world-class speakers...
          </p>
        </div>
      </section>
    )
  }

  if (error || speakers.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-4 font-neue-haas">Featured AI Keynote Speakers</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat mb-8">
            Unable to load speakers at the moment. Please try again later.
          </p>
          <Link
            href="/speakers"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-11 px-8 border border-[#1E68C6] text-[#1E68C6] hover:bg-[#1E68C6] hover:text-white transition-colors"
          >
            View All Speakers
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4 font-neue-haas">Featured AI Keynote Speakers</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
            World-class artificial intelligence experts, machine learning pioneers, and tech visionaries who are shaping
            the future of AI across every industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {speakers.map((speaker) => (
            <SpeakerCard key={speaker.slug} speaker={speaker} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/speakers"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-11 px-8 border border-[#1E68C6] text-[#1E68C6] hover:bg-[#1E68C6] hover:text-white transition-colors font-montserrat"
          >
            View All {speakers.length > 0 ? `${speakers.length}+` : ""} AI Speakers
          </Link>
        </div>
      </div>
    </section>
  )
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [currentImageSrc, setCurrentImageSrc] = useState("")

  // Function to get fallback image sources in order of preference
  const getImageSources = () => {
    const sources = []

    // 1. Original image (could be Blob URL or local)
    if (speaker.image && !imageError) {
      sources.push(speaker.image)
    }

    // 2. Try to derive local filename from speaker name
    const localFilename = speaker.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
    sources.push(`/speakers/${localFilename}-headshot.png`)
    sources.push(`/speakers/${localFilename}-headshot.jpg`)
    sources.push(`/speakers/${localFilename}-headshot.jpeg`)

    // 3. Try slug-based filenames
    if (speaker.slug) {
      sources.push(`/speakers/${speaker.slug}-headshot.png`)
      sources.push(`/speakers/${speaker.slug}-headshot.jpg`)
      sources.push(`/speakers/${speaker.slug}-headshot.jpeg`)
      sources.push(`/speakers/${speaker.slug}.png`)
      sources.push(`/speakers/${speaker.slug}.jpg`)
    }

    // 4. Final fallback
    sources.push("/placeholder.svg?height=300&width=300")

    return sources
  }

  const [imageSources] = useState(getImageSources())
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0)

  // Initialize the first image source
  useState(() => {
    if (imageSources.length > 0) {
      setCurrentImageSrc(imageSources[0])
    }
  })

  const handleImageError = () => {
    const nextIndex = currentSourceIndex + 1

    if (nextIndex < imageSources.length) {
      console.log(
        `Image failed for ${speaker.name}: ${imageSources[currentSourceIndex]}, trying: ${imageSources[nextIndex]}`,
      )
      setCurrentSourceIndex(nextIndex)
      setCurrentImageSrc(imageSources[nextIndex])
      setImageLoading(true) // Reset loading state for next attempt
    } else {
      console.error(`All image sources failed for ${speaker.name}`)
      setImageError(true)
      setImageLoading(false)
    }
  }

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
      <CardContent className="p-0">
        <div className="relative">
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center relative overflow-hidden rounded-t-lg">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-gray-500 text-sm">Loading...</div>
              </div>
            )}

            <img
              src={currentImageSrc || "/placeholder.svg"}
              alt={speaker.name}
              className={`w-full h-64 rounded-t-lg transition-all duration-300 group-hover:scale-105 ${
                speaker.imagePosition === "top" ? "object-top object-cover" : "object-cover object-center"
              } ${imageLoading ? "opacity-0" : "opacity-100"}`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          </div>

          <Badge className="absolute top-4 left-4 bg-[#1E68C6] text-white font-montserrat">
            {speaker.industries[0] || "AI Expert"}
          </Badge>

          {/* Show debug info in development */}
          {process.env.NODE_ENV === "development" && (imageError || currentSourceIndex > 0) && (
            <div className="absolute bottom-2 left-2 right-2 bg-yellow-100 border border-yellow-300 rounded p-1 text-xs text-yellow-800">
              {imageError ? "All sources failed" : `Using source ${currentSourceIndex + 1}/${imageSources.length}`}
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-black mb-2 font-neue-haas">{speaker.name}</h3>
          <p className="text-[#5084C6] font-semibold mb-3 font-montserrat text-sm">{speaker.title}</p>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 font-montserrat">{speaker.bio}</p>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-black mb-2 font-montserrat">Speaking Topics:</h4>
            <div className="flex flex-wrap gap-1">
              {speaker.expertise.slice(0, 2).map((topic, index) => (
                <Badge key={index} variant="secondary" className="text-xs font-montserrat">
                  {topic}
                </Badge>
              ))}
              {speaker.expertise.length > 2 && (
                <Badge variant="secondary" className="text-xs font-montserrat">
                  +{speaker.expertise.length - 2} more
                </Badge>
              )}
            </div>
          </div>

          <Link
            href="/contact"
            className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-[#1E68C6] text-white hover:bg-[#5084C6] transition-colors font-montserrat"
          >
            Check Availability
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
