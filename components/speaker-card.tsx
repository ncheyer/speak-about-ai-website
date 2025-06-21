"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Speaker } from "@/lib/speakers-data"
import { CalendarCheck, User, ChevronDown, ChevronUp } from "lucide-react"

interface UnifiedSpeakerCardProps {
  speaker: Speaker
  contactSource: string
  maxTopicsToShow?: number
}

export function SpeakerCard({ speaker, contactSource, maxTopicsToShow = 2 }: UnifiedSpeakerCardProps) {
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">("loading")
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("")
  const [showFeeDetail, setShowFeeDetail] = useState(false)
  const isInitialMount = useRef(true)

  if (!speaker || !speaker.slug) {
    return null
  }

  const {
    name = "Unnamed Speaker",
    title = "N/A",
    image,
    imagePosition = "center",
    imageOffsetY = "0%",
    industries = [],
    programs = [],
    slug,
    fee = "Inquire for Fee",
    feeRange,
  } = speaker

  const placeholderImg = `/placeholder.svg?width=400&height=300&text=${encodeURIComponent(name)}`

  useEffect(() => {
    setCurrentImageUrl(image || placeholderImg)
  }, [image, placeholderImg])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      if (currentImageUrl && currentImageUrl !== placeholderImg) {
        setImageState("loading")
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => setImageState("loaded")
        img.onerror = () => {
          setImageState("error")
          if (currentImageUrl !== placeholderImg) {
            setCurrentImageUrl(placeholderImg)
          }
        }
        img.src = currentImageUrl
      } else if (currentImageUrl === placeholderImg) {
        setImageState("loaded")
      }
    }
  }, [currentImageUrl, placeholderImg])

  const handleImageError = () => {
    setImageState("error")
    if (currentImageUrl !== placeholderImg) {
      setCurrentImageUrl(placeholderImg)
    }
  }

  const handleImageLoad = () => setImageState("loaded")

  const profileLink = `/speakers/${slug}`
  const safeContactSource = contactSource || "unknown_source"
  const contactLink = `/contact?source=${safeContactSource}&speakerName=${encodeURIComponent(name)}`

  const commonButtonClasses =
    "w-full text-xs sm:text-sm px-3 h-auto py-3 whitespace-normal flex items-center justify-center gap-2"

  const safePrograms = Array.isArray(programs) ? programs : []
  const safeIndustries = Array.isArray(industries) ? industries : []

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border-0 bg-white group transform hover:-translate-y-1.5">
      <Link href={profileLink} className="block">
        <div className="relative w-full aspect-square sm:aspect-[4/5] md:aspect-[3/4] bg-gray-100 overflow-hidden rounded-t-xl cursor-pointer">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500 z-20 group-hover:opacity-100 opacity-75 transition-opacity duration-300"></div>
          {imageState === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
                <div className="text-gray-500 text-sm">Loading image...</div>
              </div>
            </div>
          )}
          {imageState === "error" && currentImageUrl === placeholderImg && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
              <div className="text-gray-400 text-sm text-center px-4">
                <div className="mb-2">📷</div>
                <div>Image unavailable</div>
              </div>
            </div>
          )}
          <img
            key={currentImageUrl}
            src={currentImageUrl || "/placeholder.svg"}
            alt={name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out ${
              imageState === "loaded" ? "opacity-100" : "opacity-0"
            }`}
            style={{ objectPosition: imagePosition === "top" ? `center ${imageOffsetY}` : "center" }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="eager"
            crossOrigin="anonymous"
          />
          {feeRange && (
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 bg-black/75 text-white backdrop-blur-sm text-xs px-2.5 py-1.5 font-montserrat rounded-md shadow-md"
            >
              {feeRange}
            </Badge>
          )}
          {safeIndustries.length > 0 && safeIndustries[0] && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-montserrat text-xs px-2.5 py-1.5 rounded-md shadow-md">
              {safeIndustries[0]}
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4 sm:p-5 flex flex-col flex-grow relative">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-b-xl -z-1"></div>
        <div className="relative z-0">
          <Link href={profileLink} className="block">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-neue-haas leading-tight mb-1 group-hover:text-blue-600 transition-colors duration-300">
              {name}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-blue-700 font-semibold font-montserrat mb-3.5 leading-snug">{title}</p>
          {safePrograms.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-600 mb-1.5 font-montserrat">Keynote Options:</h4>
              <div className="flex flex-wrap gap-1.5">
                {safePrograms.slice(0, maxTopicsToShow).map((topic, index) => (
                  <Badge
                    key={`${slug}-topic-${index}`}
                    // Removed variant="outline" to use custom background and text color
                    className="text-xs font-montserrat text-white bg-blue-600 px-2 py-0.5 rounded-full"
                  >
                    {topic}
                  </Badge>
                ))}
                {safePrograms.length > maxTopicsToShow && (
                  <Badge
                    // Removed variant="outline"
                    className="text-xs font-montserrat text-white bg-blue-600 px-2 py-0.5 rounded-full"
                  >
                    +{safePrograms.length - maxTopicsToShow} more
                  </Badge>
                )}
              </div>
            </div>
          )}
          {fee && (
            <div className="mb-4">
              <button
                onClick={() => setShowFeeDetail(!showFeeDetail)}
                className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-800 mb-1 font-montserrat hover:text-blue-600 transition-colors"
              >
                Speaker Fee
                {showFeeDetail ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
              </button>
              {showFeeDetail && (
                <div className="bg-sky-50/70 p-3 rounded-lg mt-1 border border-sky-200 shadow-sm">
                  <div className="text-md font-bold text-blue-700 font-montserrat">{fee}</div>
                  <div className="text-xs text-gray-600 font-montserrat mt-0.5">
                    Fee varies depending on format, location, and commitment. Contact us for a specific quote and to
                    check availability.
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="mt-auto pt-4">
            <div className="w-full flex flex-col space-y-3">
              <Button asChild variant="gold" className={commonButtonClasses}>
                <Link href={contactLink}>
                  <CalendarCheck size={16} />
                  <span>Book Speaker Today</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className={commonButtonClasses}>
                <Link href={profileLink}>
                  <User size={16} />
                  <span>View Profile</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
