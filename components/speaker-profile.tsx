"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Linkedin, Globe, Mail, ArrowLeft, Play, Quote } from "lucide-react"
import type { Speaker } from "@/lib/speakers-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SpeakerProfileProps {
  speaker: Speaker
}

const SpeakerProfile: React.FC<SpeakerProfileProps> = ({ speaker }) => {
  const imageUrl = speaker.image || "/placeholder.svg?height=400&width=500&text=Speaker+Image"
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">("loading")
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3
  const [activeTab, setActiveTab] = useState("about")

  // Use speaker videos or empty array (no samples)
  const videos = speaker.videos || []

  // Log for debugging
  // Enhanced logging for debugging
  console.log("Speaker profile data:", {
    name: speaker.name,
    hasVideos: Boolean(speaker.videos),
    videosCount: speaker.videos?.length || 0,
    videosData: speaker.videos || "No videos data",
    rawVideosData: JSON.stringify(speaker.videos),
  })

  // Sample testimonials data if none provided
  const testimonials = speaker.testimonials || [
    {
      quote: `${speaker.name}'s keynote was the highlight of our conference. Their insights on AI were both profound and practical.`,
      author: "Jane Smith",
      position: "Event Director",
      company: "Tech Innovation Summit",
      event: "Annual Technology Conference 2024",
    },
    {
      quote:
        "Our audience was captivated from start to finish. The presentation perfectly balanced technical depth with accessibility.",
      author: "Michael Johnson",
      position: "CEO",
      company: "Future Technologies Inc.",
      event: "Executive Leadership Forum",
    },
    {
      quote:
        "We've received overwhelmingly positive feedback from attendees. The practical takeaways were exactly what our organization needed.",
      author: "Sarah Williams",
      position: "Head of Learning & Development",
      company: "Global Enterprises",
      event: "Digital Transformation Workshop",
    },
  ]

  const handleImageError = () => {
    if (retryCount < maxRetries && speaker.image) {
      setRetryCount((prev) => prev + 1)
      setTimeout(
        () => {
          setImageState("loading")
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => setImageState("loaded")
          img.onerror = () => {
            if (retryCount + 1 >= maxRetries) {
              setImageState("error")
            } else {
              handleImageError()
            }
          }
          img.src = `${speaker.image}?retry=${retryCount + 1}&t=${Date.now()}`
        },
        1000 * (retryCount + 1),
      )
    } else {
      setImageState("error")
    }
  }

  const handleImageLoad = () => {
    setImageState("loaded")
    setRetryCount(0)
  }

  useEffect(() => {
    if (speaker.image && speaker.image.includes("blob.vercel-storage.com")) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = handleImageLoad
      img.onerror = handleImageError
      img.src = speaker.image
    } else if (speaker.image) {
      setImageState("loaded")
    } else {
      setImageState("error")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speaker.image])

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/speakers" className="inline-flex items-center text-[#1E68C6] hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Speakers
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
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
                    {imageState === "error" && !speaker.image && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
                        <div className="text-gray-400 text-center px-4">
                          <div className="mb-2 text-4xl">📷</div>
                          <div>Speaker image unavailable</div>
                        </div>
                      </div>
                    )}
                    {imageState === "error" && speaker.image && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
                        <div className="text-gray-400 text-center px-4">
                          <div className="mb-2 text-4xl">📷</div>
                          <div>Image temporarily unavailable</div>
                          <div className="text-sm mt-1">Please try refreshing the page</div>
                        </div>
                      </div>
                    )}
                    <img
                      src={
                        imageState === "error" && !speaker.image
                          ? "/placeholder.svg?height=400&width=500&text=Speaker+Image"
                          : imageUrl
                      }
                      alt={speaker.name}
                      className={`w-full h-96 rounded-t-lg transition-opacity duration-300 ${imageState === "loaded" ? "opacity-100" : "opacity-0"}`}
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      loading="eager"
                      crossOrigin="anonymous"
                      style={{
                        objectFit: "cover",
                        objectPosition:
                          speaker.imagePosition === "top" ? `center ${speaker.imageOffsetY || "0%"}` : "center",
                        display: imageState === "error" && speaker.image ? "none" : "block",
                      }}
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                    {speaker.fee}
                  </div>
                  {process.env.NODE_ENV === "development" &&
                    ((imageState === "error" && speaker.image) || retryCount > 0) && (
                      <div className="absolute bottom-2 left-2 right-2 bg-yellow-100 border border-yellow-300 rounded p-2 text-xs text-yellow-800">
                        <strong>Debug:</strong>{" "}
                        {imageState === "error" && speaker.image
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
                  <div className="space-y-3">
                    <Button
                      asChild
                      variant="gold"
                      className="w-full font-montserrat transition-all duration-300 hover:shadow-xl"
                    >
                      <Link
                        href={`/contact?source=speaker_profile&speakerName=${encodeURIComponent(speaker.name)}`}
                        className="!text-white !no-underline hover:!text-white"
                      >
                        Book Speaker Today
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="about" className="text-base font-montserrat">
                  Biography & Programs
                </TabsTrigger>
                <TabsTrigger value="media" className="text-base font-montserrat">
                  Videos & Testimonials
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 font-neue-haas">Biography</h2>
                  <div className="prose prose-lg max-w-none font-montserrat">
                    {speaker.bio.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-600 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {speaker.programs && speaker.programs.length > 0 && (
                  <div>
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

                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 font-neue-haas">Areas of Expertise</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {speaker.expertise.map((skill, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <span className="font-semibold text-gray-900 font-montserrat">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-8">
                {/* Videos Section */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 font-neue-haas">Videos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((video) => (
                      <a
                        key={video.id}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <div className="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl">
                          <div className="aspect-video bg-gray-100 relative">
                            <img
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all duration-300">
                              <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Play className="w-8 h-8 text-[#1E68C6] ml-1" />
                              </div>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                              {video.duration}
                            </div>
                          </div>
                          <div className="p-4 bg-white">
                            <h3 className="font-semibold text-gray-900 group-hover:text-[#1E68C6] transition-colors duration-300 font-montserrat">
                              {video.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 font-montserrat">{video.source}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Testimonials Section */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 font-neue-haas">Testimonials</h2>
                  <div className="space-y-6">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#1E68C6] relative">
                        <Quote className="absolute top-4 right-4 w-8 h-8 text-gray-200" />
                        <p className="text-gray-700 italic mb-4 font-montserrat relative z-10">"{testimonial.quote}"</p>
                        <div>
                          <p className="font-semibold text-gray-900 font-montserrat">{testimonial.author}</p>
                          <p className="text-sm text-gray-600 font-montserrat">
                            {testimonial.position}, {testimonial.company}
                          </p>
                          {testimonial.event && (
                            <p className="text-xs text-gray-500 mt-1 font-montserrat">{testimonial.event}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="bg-[#1E68C6] rounded-lg p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-4 font-neue-haas">Ready to Book {speaker.name}?</h3>
              <p className="text-white text-opacity-90 mb-6 font-montserrat">
                Contact us for availability, speaking fees, and custom program development.
              </p>
              <Button
                asChild
                size="lg"
                variant="gold"
                className="font-montserrat transition-all duration-300 hover:shadow-xl"
              >
                <Link
                  href={`/contact?source=speaker_profile_cta&speakerName=${encodeURIComponent(speaker.name)}`}
                  className="!text-white !no-underline hover:!text-white"
                >
                  Book Speaker Today
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpeakerProfile
