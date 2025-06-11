"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Linkedin, Globe, Mail, ArrowLeft } from "lucide-react"
import type { Speaker } from "@/lib/speakers-data"

interface SpeakerProfileProps {
  speaker: Speaker
}

const SpeakerProfile: React.FC<SpeakerProfileProps> = ({ speaker }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Function to get the best available image source
  const getImageSrc = () => {
    if (imageError) {
      return "/placeholder.svg?height=400&width=500"
    }

    // If the image URL is a Vercel Blob URL and we're having issues, try the local version
    if (speaker.image?.includes("blob.vercel-storage.com")) {
      // Extract the original filename and try to find it locally
      const filename = speaker.image.split("/").pop()?.split("-").slice(0, -1).join("-") + ".jpg"
      return `/speakers/${filename}` || speaker.image
    }

    return speaker.image || "/placeholder.svg?height=400&width=500"
  }

  const handleImageError = () => {
    console.error(`Failed to load image: ${speaker.image}`)
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

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
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-gray-500">Loading image...</div>
                      </div>
                    )}

                    <img
                      src={getImageSrc() || "/placeholder.svg"}
                      alt={speaker.name}
                      className={`w-full h-96 rounded-t-lg transition-opacity duration-300 ${
                        speaker.imagePosition === "top" ? "object-top object-cover" : "object-center object-cover"
                      } ${imageLoading ? "opacity-0" : "opacity-100"}`}
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      loading="eager"
                    />
                  </div>

                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                    {speaker.fee}
                  </div>

                  {imageError && (
                    <div className="absolute bottom-2 left-2 right-2 bg-yellow-100 border border-yellow-300 rounded p-2 text-xs text-yellow-800">
                      <strong>Note:</strong> Using placeholder image. Original image may be temporarily unavailable.
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
                    <Button asChild className="w-full bg-[#1E68C6] hover:bg-[#5084C6] font-montserrat">
                      <Link href="/contact">Check Availability</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full font-montserrat">
                      <Link href="/contact">Request Speaker Kit</Link>
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

            {/* Debug Information (only in development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-8 p-4 bg-gray-100 rounded">
                <h3 className="font-bold mb-2">Debug Info:</h3>
                <p>
                  <strong>Original Image URL:</strong> {speaker.image}
                </p>
                <p>
                  <strong>Current Image Source:</strong> {getImageSrc()}
                </p>
                <p>
                  <strong>Image Error:</strong> {imageError ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Image Loading:</strong> {imageLoading ? "Yes" : "No"}
                </p>
              </div>
            )}

            {/* Contact CTA */}
            <div className="bg-[#1E68C6] rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4 font-neue-haas">Ready to Book {speaker.name}?</h3>
              <p className="text-white text-opacity-90 mb-6 font-montserrat">
                Contact us for availability, speaking fees, and custom program development.
              </p>
              <Button asChild size="lg" className="bg-white text-[#1E68C6] hover:bg-gray-100 font-montserrat">
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
