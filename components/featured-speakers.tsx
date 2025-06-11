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

  // Function to get the best available image source
  const getImageSrc = () => {
    if (imageError) {
      return "/placeholder.svg?height=300&width=300"
    }

    // If the image URL is a Vercel Blob URL and we're having issues, try the local version
    if (speaker.image?.includes("blob.vercel-storage.com")) {
      // Extract the original filename and try to find it locally
      const filename = speaker.image.split("/").pop()?.split("-").slice(0, -1).join("-") + ".jpg"
      return `/speakers/${filename}` || speaker.image
    }

    return speaker.image || "/placeholder.svg?height=300&width=300"
  }

  const handleImageError = () => {
    console.error(`Failed to load image for ${speaker.name}: ${speaker.image}`)
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
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
              src={getImageSrc() || "/placeholder.svg"}
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

          {imageError && (
            <div className="absolute bottom-2 left-2 right-2 bg-yellow-100 border border-yellow-300 rounded p-1 text-xs text-yellow-800">
              Using placeholder
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
