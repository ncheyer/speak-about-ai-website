"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
          <Button
            asChild
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-11 px-8 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-montserrat"
          >
            <Link href="/speakers" className="text-white no-underline">
              View All AI Speakers
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">("loading")
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  const imageUrl = speaker.image || "/placeholder.svg?height=300&width=300&text=Speaker+Image"

  const handleImageError = () => {
    if (retryCount < maxRetries && speaker.image) {
      // Retry loading the same image with a small delay
      console.log(`Retrying image load for ${speaker.name} (attempt ${retryCount + 1}/${maxRetries})`)
      setRetryCount((prev) => prev + 1)

      // Add a small delay before retry to handle temporary network issues
      setTimeout(
        () => {
          setImageState("loading")
          // Force reload by adding a cache-busting parameter
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => setImageState("loaded")
          img.onerror = () => {
            if (retryCount + 1 >= maxRetries) {
              console.error(`Failed to load image for ${speaker.name} after ${maxRetries} attempts: ${speaker.image}`)
              setImageState("error")
            } else {
              handleImageError()
            }
          }
          img.src = `${speaker.image}?retry=${retryCount + 1}&t=${Date.now()}`
        },
        1000 * (retryCount + 1),
      ) // Exponential backoff
    } else {
      console.error(`Failed to load image for ${speaker.name}: ${speaker.image}`)
      setImageState("error")
    }
  }

  const handleImageLoad = () => {
    setImageState("loaded")
    setRetryCount(0) // Reset retry count on successful load
  }

  // Reset image state when speaker changes
  useEffect(() => {
    setImageState("loading")
    setRetryCount(0)
  }, [speaker.slug])

  // Preload the image to handle CORS and caching issues
  useEffect(() => {
    if (speaker.image && speaker.image.includes("blob.vercel-storage.com")) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => setImageState("loaded")
      img.onerror = handleImageError
      img.src = speaker.image
    }
  }, [speaker.image])

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg flex flex-col">
      <CardContent className="p-0 flex flex-col flex-grow">
        <div className="relative">
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center relative overflow-hidden rounded-t-lg">
            {imageState === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <div className="text-gray-500 text-sm">
                  {retryCount > 0 ? `Retrying... (${retryCount}/${maxRetries})` : "Loading..."}
                </div>
              </div>
            )}

            {imageState === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
                <div className="text-gray-400 text-sm text-center px-4">
                  <div className="mb-2">📷</div>
                  <div>Image temporarily unavailable</div>
                  <div className="text-xs mt-1">Please try refreshing</div>
                </div>
              </div>
            )}

            <img
              src={imageUrl || "/placeholder.svg"}
              alt={speaker.name}
              className={`w-full h-64 rounded-t-lg transition-all duration-300 group-hover:scale-105 object-cover ${imageState === "loaded" ? "opacity-100" : "opacity-0"}`}
              style={{
                objectPosition: speaker.imagePosition === "top" ? `center ${speaker.imageOffsetY || "0%"}` : "center",
                display: imageState === "error" ? "none" : "block",
              }}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
              crossOrigin="anonymous"
            />
            <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded text-sm font-semibold text-gray-900 font-montserrat">
              {speaker.fee}
            </div>
          </div>

          <Badge className="absolute top-4 left-4 bg-[#1E68C6] text-white font-montserrat">
            {speaker.industries[0] || "AI Expert"}
          </Badge>

          {/* Debug info for development */}
          {process.env.NODE_ENV === "development" && (imageState === "error" || retryCount > 0) && (
            <div className="absolute bottom-2 left-2 right-2 bg-yellow-100 border border-yellow-300 rounded p-1 text-xs text-yellow-800">
              {imageState === "error" ? `Failed after ${maxRetries} retries` : `Retry ${retryCount}/${maxRetries}`}
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-black mb-2 font-neue-haas">{speaker.name}</h3>
          <p className="text-[#5084C6] font-semibold mb-3 font-montserrat text-sm">{speaker.title}</p>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 font-montserrat flex-grow">{speaker.bio}</p>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-black mb-2 font-montserrat">Speaking Topics:</h4>
            <div className="flex flex-wrap gap-1">
              {speaker.programs.slice(0, 2).map((topic, index) => (
                <Badge key={index} variant="secondary" className="text-xs font-montserrat">
                  {topic}
                </Badge>
              ))}
              {speaker.programs.length > 2 && (
                <Badge variant="secondary" className="text-xs font-montserrat">
                  +{speaker.programs.length - 2} more
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row gap-2">
            <Button
              asChild
              variant="outline"
              className="flex-1 border-[#1E68C6] text-[#1E68C6] hover:bg-[#1E68C6] hover:text-white font-montserrat text-xs sm:text-sm px-2 h-auto py-2"
            >
              <Link href={`/speakers/${speaker.slug}`}>View Profile</Link>
            </Button>
            <Button
              asChild
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-montserrat text-xs sm:text-sm px-2 h-auto py-2 whitespace-normal"
            >
              <Link
                href={`/contact?source=featured_speakers&speakerName=${encodeURIComponent(speaker.name)}`}
                className="text-white no-underline"
              >
                Check Availability
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
