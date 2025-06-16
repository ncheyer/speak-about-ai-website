"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Speaker } from "@/lib/speakers-data"
import { CalendarCheck, User, ChevronDown, ChevronUp } from "lucide-react"

interface UnifiedSpeakerCardProps {
  speaker: Speaker // Speaker object - parent components should ensure this is valid
  contactSource: string
  maxTopicsToShow?: number
}

export function SpeakerCard({ speaker, contactSource, maxTopicsToShow = 1 }: UnifiedSpeakerCardProps) {
  // If speaker prop is somehow null or undefined, render nothing or a placeholder
  // This is an extra layer of defense; parent components should filter out invalid speakers.
  if (!speaker || !speaker.slug) {
    // console.warn("SpeakerCard: Received invalid speaker data or missing slug. Skipping render.", speaker)
    // Optionally, render a minimal placeholder or null
    // For build stability, returning null is safest if this unexpected case occurs.
    return null
  }

  const {
    name = "Unnamed Speaker",
    title = "N/A",
    image,
    imagePosition = "center",
    imageOffsetY = "0%",
    industries = [], // Default to empty array
    programs = [], // Default to empty array
    slug, // Already checked for existence above
    fee = "Inquire for Fee",
    feeRange,
  } = speaker

  const placeholderImg = `/placeholder.svg?width=400&height=300&text=${encodeURIComponent(name)}`
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">("loading")
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(image || placeholderImg) // Initialize with actual or placeholder
  const [showFeeDetail, setShowFeeDetail] = useState(false)

  useEffect(() => {
    const newImageUrl = image || placeholderImg
    if (newImageUrl !== currentImageUrl) {
      // Only update if the source image changes
      setCurrentImageUrl(newImageUrl)
      setImageState("loading")
    }
  }, [image, placeholderImg, currentImageUrl, slug]) // Added slug to dependencies as image might be tied to speaker identity

  const handleImageError = () => {
    setImageState("error")
    if (currentImageUrl !== placeholderImg) {
      setCurrentImageUrl(placeholderImg)
    }
  }

  const handleImageLoad = () => {
    setImageState("loaded")
  }

  const profileLink = `/speakers/${slug}`
  const safeContactSource = contactSource || "unknown_source"
  const contactLink = `/contact?source=${safeContactSource}&speakerName=${encodeURIComponent(name)}`

  const commonButtonClasses =
    "w-full text-xs sm:text-sm px-3 h-auto py-3 whitespace-normal rounded-md font-semibold transition-all duration-300 flex items-center justify-center gap-2"

  // Ensure programs and industries are arrays before using array methods
  const safePrograms = Array.isArray(programs) ? programs : []
  const safeIndustries = Array.isArray(industries) ? industries : []

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 border-0 bg-white group">
      <div className="relative w-full aspect-square sm:aspect-[4/5] md:aspect-[3/4] bg-gray-100 overflow-hidden rounded-t-lg">
        {imageState === "loading" && currentImageUrl !== placeholderImg && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-gray-500 text-sm">Loading...</div>
          </div>
        )}
        {imageState === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
            <div className="text-gray-400 text-sm text-center px-4">
              <div className="mb-2">📷</div>
              <div>Image unavailable</div>
            </div>
          </div>
        )}
        <img
          key={currentImageUrl} // Key helps React re-render if src changes between actual and placeholder
          src={currentImageUrl || "/placeholder.svg"} // Already defaults to placeholder if image is undefined
          alt={name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out ${
            imageState === "loaded" || currentImageUrl === placeholderImg ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition: imagePosition === "top" ? `center ${imageOffsetY}` : "center" }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          crossOrigin="anonymous"
        />
        {feeRange && (
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 bg-black/70 text-white backdrop-blur-sm text-xs px-2 py-1 font-montserrat"
          >
            {feeRange}
          </Badge>
        )}
        {safeIndustries.length > 0 && safeIndustries[0] && (
          <Badge className="absolute top-3 left-3 bg-[#1E68C6] text-white font-montserrat text-xs px-2 py-1">
            {safeIndustries[0]}
          </Badge>
        )}
      </div>

      <CardContent className="p-4 sm:p-6 flex flex-col flex-grow">
        <Link href={profileLink} className="block">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-neue-haas leading-tight mb-1 hover:text-[#1E68C6] transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-xs sm:text-sm text-[#5084C6] font-semibold font-montserrat mb-3 leading-snug">{title}</p>

        {safePrograms.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-1 font-montserrat">Keynote Topic:</h4>
            <div className="flex flex-wrap gap-1">
              {safePrograms.slice(0, maxTopicsToShow).map((topic, index) => (
                <Badge
                  key={`${slug}-topic-${index}`} // slug is guaranteed here
                  variant="outline"
                  className="text-xs font-montserrat border-blue-200 text-blue-700 bg-blue-50"
                >
                  {topic}
                </Badge>
              ))}
              {safePrograms.length > maxTopicsToShow && (
                <Badge variant="outline" className="text-xs font-montserrat border-blue-200 text-blue-700 bg-blue-50">
                  +{safePrograms.length - maxTopicsToShow} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {fee && ( // Only show if fee is present (already defaults to "Inquire for Fee")
          <div className="mb-4">
            <button
              onClick={() => setShowFeeDetail(!showFeeDetail)}
              className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-900 mb-1 font-montserrat hover:text-[#1E68C6] transition-colors"
            >
              Speaker Fee
              {showFeeDetail ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>
            {showFeeDetail && (
              <div className="bg-blue-50 p-3 rounded-lg mt-1 border border-blue-200">
                <div className="text-md font-bold text-[#1E68C6] font-montserrat">{fee}</div>
                <div className="text-xs text-gray-600 font-montserrat mt-0.5">
                  Contact us for availability and booking details. Fees may vary.
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto pt-4">
          <div className="w-full flex flex-col space-y-3">
            <Button
              asChild
              className={`${commonButtonClasses} bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl`}
            >
              <Link href={contactLink}>
                <CalendarCheck size={16} />
                <span>Book Speaker Today</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className={`${commonButtonClasses} border-2 border-[#1E68C6] text-[#1E68C6] hover:bg-[#1E68C6] hover:text-white bg-white`}
            >
              <Link href={profileLink}>
                <User size={16} />
                <span>View Profile</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
