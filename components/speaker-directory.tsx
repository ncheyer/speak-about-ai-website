"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import Link from "next/link"
import { searchSpeakers, type Speaker } from "@/lib/speakers-data"

interface SpeakerDirectoryProps {
  initialSpeakers: Speaker[]
}

export default function SpeakerDirectory({ initialSpeakers }: SpeakerDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [displayedSpeakers, setDisplayedSpeakers] = useState<Speaker[]>(initialSpeakers.slice(0, 12))
  const [allFilteredSpeakers, setAllFilteredSpeakers] = useState<Speaker[]>(initialSpeakers)
  const [displayCount, setDisplayCount] = useState(12)

  // Effect to re-filter speakers when search query or industry changes
  useEffect(() => {
    const filterAndSetSpeakers = async () => {
      let filtered = await searchSpeakers(searchQuery)
      if (selectedIndustry !== "all") {
        filtered = filtered.filter((speaker) =>
          speaker.industries.some((industry) => industry.toLowerCase().includes(selectedIndustry.toLowerCase())),
        )
      }
      setAllFilteredSpeakers(filtered)
      setDisplayedSpeakers(filtered.slice(0, 12))
      setDisplayCount(12)
    }
    filterAndSetSpeakers()
  }, [searchQuery, selectedIndustry])

  // Get unique industries for filter dropdown
  const industries = Array.from(new Set(initialSpeakers.flatMap((speaker) => speaker.industries))).sort()

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 12)
    setDisplayedSpeakers(allFilteredSpeakers.slice(0, displayCount + 12))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#EAEAEE] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-neue-haas">
              All AI Keynote Speakers
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
              Browse our complete directory of {initialSpeakers.length}+ world-class artificial intelligence experts,
              machine learning pioneers, and tech visionaries.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search speakers by name, expertise, or industry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 font-montserrat"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400 w-5 h-5" />
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger className="w-48 font-montserrat">
                      <SelectValue placeholder="Filter by industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry.toLowerCase()}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600 font-montserrat">
                Showing {displayedSpeakers.length} of {allFilteredSpeakers.length} speakers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {allFilteredSpeakers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4 font-montserrat">
                No speakers found matching your criteria. Try adjusting your search or filters.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedIndustry("all")
                }}
                className="bg-[#1E68C6] hover:bg-[#5084C6] font-montserrat"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayedSpeakers.map((speaker) => (
                  <SpeakerCard key={speaker.slug} speaker={speaker} />
                ))}
              </div>

              {/* Load More Button */}
              {displayCount < allFilteredSpeakers.length && (
                <div className="text-center mt-12">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    className="border-[#1E68C6] text-[#1E68C6] hover:bg-[#1E68C6] hover:text-white font-montserrat"
                  >
                    Load More Speakers ({allFilteredSpeakers.length - displayCount} remaining)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">("loading")
  const [retryCount, setRetryCount] = useState(0)
  const [imageUrl, setImageUrl] = useState<string>("")
  const maxRetries = 2

  // Initialize image URL and handle different formats
  useEffect(() => {
    const url = speaker.image || "/placeholder.svg?height=300&width=300&text=Speaker+Image"

    // Log the original URL for debugging
    console.log(`Loading image for ${speaker.name}:`, url)

    setImageUrl(url)
    setImageState("loading")
    setRetryCount(0)
  }, [speaker.slug, speaker.image])

  const handleImageError = () => {
    console.error(`Image load failed for ${speaker.name}: ${imageUrl} (attempt ${retryCount + 1})`)

    if (retryCount < maxRetries && speaker.image && speaker.image.includes("blob.vercel-storage.com")) {
      const nextRetry = retryCount + 1
      console.log(`Retrying image load for ${speaker.name} (attempt ${nextRetry}/${maxRetries})`)

      setRetryCount(nextRetry)

      // Add cache-busting parameters and retry with delay
      setTimeout(() => {
        const retryUrl = `${speaker.image}?retry=${nextRetry}&t=${Date.now()}&cache=false`
        console.log(`Retry URL for ${speaker.name}:`, retryUrl)
        setImageUrl(retryUrl)
        setImageState("loading")
      }, 1000 * nextRetry) // Progressive delay
    } else {
      console.error(`All retries failed for ${speaker.name}`)
      setImageState("error")
    }
  }

  const handleImageLoad = () => {
    console.log(`Image loaded successfully for ${speaker.name}:`, imageUrl)
    setImageState("loaded")
  }

  // Preload image when URL changes
  useEffect(() => {
    if (imageUrl && imageUrl.includes("blob.vercel-storage.com")) {
      console.log(`Preloading image for ${speaker.name}:`, imageUrl)

      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        console.log(`Preload successful for ${speaker.name}`)
        setImageState("loaded")
      }

      img.onerror = (e) => {
        console.error(`Preload failed for ${speaker.name}:`, e)
        handleImageError()
      }

      // Add a small delay to ensure the blob URL is ready
      setTimeout(() => {
        img.src = imageUrl
      }, 100)
    }
  }, [imageUrl])

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
      <CardContent className="p-0">
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
              className={`w-full h-64 rounded-t-lg transition-all duration-300 group-hover:scale-105 ${
                speaker.imagePosition === "top" ? "object-top object-cover" : "object-cover object-center"
              } ${imageState === "loaded" ? "opacity-100" : "opacity-0"}`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
              crossOrigin="anonymous"
              style={{ display: imageState === "error" ? "none" : "block" }}
            />
          </div>

          <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded text-sm font-semibold text-gray-900 font-montserrat">
            {speaker.fee}
          </div>
          {speaker.industries[0] && (
            <Badge className="absolute top-4 left-4 bg-[#1E68C6] text-white font-montserrat">
              {speaker.industries[0]}
            </Badge>
          )}

          {/* Debug info for development and production to help diagnose */}
          {(process.env.NODE_ENV === "development" || imageState === "error") && (
            <div className="absolute bottom-2 left-2 right-2 bg-yellow-100 border border-yellow-300 rounded p-1 text-xs text-yellow-800">
              <div>
                <strong>Status:</strong> {imageState}
              </div>
              <div>
                <strong>Retries:</strong> {retryCount}/{maxRetries}
              </div>
              <div>
                <strong>URL:</strong> {imageUrl.substring(0, 50)}...
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 font-neue-haas">{speaker.name}</h3>
          <p className="text-[#5084C6] font-semibold mb-3 font-montserrat text-sm">{speaker.title}</p>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 font-montserrat">{speaker.bio}</p>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 font-montserrat">Expertise:</h4>
            <div className="flex flex-wrap gap-1">
              {speaker.expertise.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs font-montserrat">
                  {skill}
                </Badge>
              ))}
              {speaker.expertise.length > 3 && (
                <Badge variant="secondary" className="text-xs font-montserrat">
                  +{speaker.expertise.length - 3}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild className="flex-1 bg-[#1E68C6] hover:bg-[#5084C6] font-montserrat">
              <Link href={`/speakers/${speaker.slug}`}>View Profile</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 font-montserrat">
              <Link href="/contact">Book Now</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
