"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Linkedin, Globe, Mail } from "lucide-react"
import Link from "next/link"

const SpeakerProfile = ({ speaker }) => {
  const imageUrl = speaker.image || "/placeholder.svg?height=400&width=500&text=Speaker+Image"
  console.log(
    `SpeakerProfile: ${speaker.name} - imagePosition: ${speaker.imagePosition}, imageOffsetY: ${speaker.imageOffsetY}, imageUrl: ${imageUrl}`,
  )
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">("loading")
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3
  console.log(`SpeakerProfile for ${speaker.name}: Expertise received: ${JSON.stringify(speaker.expertise)}`)

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
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/speakers" className="inline-flex items-center text-[#1E68C6] hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Speakers
          </Link>
        </div>
      </div>

      {/* Speaker Profile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Speaker Image and Basic Info */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="w-full h-96 bg-gray-100 flex items-center justify-center relative overflow-hidden rounded-t-lg">
                    {imageState === "loading" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <div className="text-gray-500">
                          {retryCount > 0 ? `Retrying... (${retryCount}/${maxRetries})` : "Loading image..."}
                        </div>
                      </div>
                    )}

                    {imageState === "error" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
                        <div className="text-gray-400 text-center px-4">
                          <div className="mb-2 text-4xl">📷</div>
                          <div>Image temporarily unavailable</div>
                          <div className="text-sm mt-1">Please try refreshing the page</div>
                        </div>
                      </div>
                    )}

                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={speaker.name}
                      className={`w-full h-96 rounded-t-lg transition-opacity duration-300 ${imageState === "loaded" ? "opacity-100" : "opacity-0"}`}
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      loading="eager"
                      crossOrigin="anonymous"
                      style={{
                        objectFit: "cover", // Ensure object-fit is cover
                        objectPosition:
                          speaker.imagePosition === "top" ? `center ${speaker.imageOffsetY || "0%"}` : "center",
                        display: imageState === "error" ? "none" : "block",
                      }}
                    />
                  </div>

                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                    {speaker.fee}
                  </div>

                  {/* Debug info for development */}
                  {process.env.NODE_ENV === "development" && (imageState === "error" || retryCount > 0) && (
                    <div className="absolute bottom-2 left-2 right-2 bg-yellow-100 border border-yellow-300 rounded p-2 text-xs text-yellow-800">
                      <strong>Debug:</strong>{" "}
                      {imageState === "error"
                        ? `Failed after ${maxRetries} retries`
                        : `Retry ${retryCount}/${maxRetries}`}
                      <br />
                      <strong>URL:</strong> {speaker.image}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2 font-neue-haas">{speaker.name}</h1>
                  <p className="text-[#5084C6] font-semibold mb-4 font-montserrat">{speaker.title}</p>

                  {speaker.location && (
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="font-montserrat">{speaker.location}</span>
                    </div>
                  )}

                  {/* Industries */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 font-montserrat">Industries:</h3>
                    <div className="flex flex-wrap gap-2">
                      {speaker.industries.map((industry, index) => (
                        <Badge key={index} className="bg-[#1E68C6] text-white font-montserrat">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex space-x-4 mb-6">
                    {speaker.linkedin && (
                      <a
                        href={speaker.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-[#1E68C6]"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {speaker.website && (
                      <a
                        href={speaker.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-[#1E68C6]"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                    {speaker.email && (
                      <a href={`mailto:${speaker.email}`} className="text-gray-500 hover:text-[#1E68C6]">
                        <Mail className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    <Button
                      asChild
                      className="w-full font-montserrat"
                      style={{
                        background: "linear-gradient(to right, #F59E0B, #D97706)",
                        color: "white",
                        border: "none",
                      }}
                    >
                      <Link href={`/contact?source=speaker_profile&speakerName=${encodeURIComponent(speaker.name)}`}>
                        Check Availability
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            {/* Biography */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-neue-haas">Biography</h2>
              <div className="prose prose-lg max-w-none font-montserrat">
                {speaker.bio.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Expertise */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-neue-haas">Areas of Expertise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {speaker.expertise.map((skill, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <span className="font-semibold text-gray-900 font-montserrat">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Speaking Programs */}
            {speaker.programs && speaker.programs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 font-neue-haas">Speaking Programs</h2>
                <div className="space-y-4">
                  {speaker.programs.map((program, index) => (
                    <div key={index} className="bg-blue-50 p-6 rounded-lg border-l-4 border-[#1E68C6]">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 font-neue-haas">{program}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact CTA */}
            <div className="bg-[#1E68C6] rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4 font-neue-haas">Ready to Book {speaker.name}?</h3>
              <p className="text-white text-opacity-90 mb-6 font-montserrat">
                Contact us for availability, speaking fees, and custom program development.
              </p>
              <Button
                asChild
                size="lg"
                className="font-montserrat"
                style={{
                  background: "linear-gradient(to right, #F59E0B, #D97706)",
                  color: "white",
                  border: "none",
                }}
              >
                <Link href="/contact">Contact Us Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpeakerProfile
