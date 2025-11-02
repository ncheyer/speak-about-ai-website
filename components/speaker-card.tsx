"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Speaker } from "@/lib/speakers-data"
import { CalendarCheck, User, MapPin, Lightbulb } from "lucide-react"

interface UnifiedSpeakerCardProps {
  speaker: Speaker
  contactSource: string
  maxTopicsToShow?: number
}

export function SpeakerCard({ speaker, contactSource, maxTopicsToShow = 3 }: UnifiedSpeakerCardProps) {
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">("loading")
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("")
  const isInitialMount = useRef(true)
  const [didCancelRef, setDidCancelRef] = useState(false)

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
    location,
  } = speaker

  const placeholderImg = `/placeholder.svg?width=400&height=300&text=${encodeURIComponent(name)}`

  useEffect(() => {
    setCurrentImageUrl(image || placeholderImg)
  }, [image, placeholderImg])

  useEffect(() => {
    let didCancel = false
    setDidCancelRef(false)

    const loadImage = async () => {
      if (currentImageUrl && currentImageUrl !== placeholderImg) {
        setImageState("loading")
        const img = new Image()
        img.crossOrigin = "anonymous"

        img.onload = () => {
          if (!didCancelRef) {
            setImageState("loaded")
          }
        }

        img.onerror = () => {
          if (!didCancelRef) {
            setImageState("error")
            if (currentImageUrl !== placeholderImg) {
              setCurrentImageUrl(placeholderImg)
            }
          }
        }

        img.src = currentImageUrl
      } else if (currentImageUrl === placeholderImg) {
        setImageState("loaded")
      }
    }

    loadImage()

    return () => {
      setDidCancelRef(true)
      didCancel = true
    }
  }, [currentImageUrl, placeholderImg, didCancelRef])

  const handleImageError = () => {
    if (imageState !== "error" && currentImageUrl !== placeholderImg) {
      setImageState("error")
      setCurrentImageUrl(placeholderImg)
    }
  }

  const handleImageLoad = () => {
    if (imageState !== "loaded") setImageState("loaded")
  }

  const profileLink = `/speakers/${slug}`
  const safeContactSource = contactSource || "unknown_source"
  const contactLink = `/contact?source=${safeContactSource}&speakerName=${encodeURIComponent(name)}`

  const commonButtonClasses =
    "w-full text-xs sm:text-sm px-3 h-auto py-3 whitespace-normal flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg transition-all duration-300"

  // Use programs array for keynote topics
  let safePrograms = Array.isArray(programs) ? programs : []
  
  // Fix for single-element arrays containing multiple items
  if (safePrograms.length === 1 && typeof safePrograms[0] === 'string') {
    // Check if it contains multiple items separated by comma or newline
    const singleItem = safePrograms[0];
    if (singleItem.includes(',') || singleItem.includes('\n')) {
      safePrograms = singleItem.split(/[,\n]+/).map(p => p.trim()).filter(p => p && p !== '');
    }
  }
  
  const safeIndustries = Array.isArray(industries) ? industries : []

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out border-l-4 border-l-[#1E68C6] bg-gradient-to-br from-white via-white to-blue-50/30 group transform hover:-translate-y-2 hover:border-l-[#D4AF37]">
      <Link href={profileLink} className="block">
        <div className="relative w-full aspect-square sm:aspect-[4/5] md:aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-xl cursor-pointer">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1E68C6] via-blue-500 to-[#D4AF37] z-20 group-hover:h-3 transition-all duration-300"></div>
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
              className="absolute top-4 right-4 bg-gradient-to-r from-gray-900 to-black text-white backdrop-blur-sm text-xs px-3 py-2 font-montserrat font-bold rounded-lg shadow-lg border border-white/20 z-10"
            >
              {feeRange}
            </Badge>
          )}
          {safeIndustries.length > 0 && safeIndustries[0] && (
            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-[#1E68C6] to-blue-600 text-white font-montserrat text-xs px-3 py-2 font-bold rounded-lg shadow-lg max-w-[40%] break-words whitespace-normal border border-white/30">
              {safeIndustries[0]}
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-5 sm:p-6 flex flex-col flex-grow relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #1E68C6 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-xl"></div>

        <div className="relative z-0">
          {/* Name and Title Section */}
          <Link href={profileLink} className="block mb-5 pb-5 border-b-2 border-blue-100 group-hover:border-[#1E68C6] transition-colors duration-300">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-neue-haas leading-tight mb-2 group-hover:text-[#1E68C6] transition-colors duration-300">
              {name}
            </h3>
            <p className="text-sm text-gray-600 font-medium font-montserrat leading-snug">{title}</p>
          </Link>

          {/* Location Section */}
          {location && (
            <div className="mb-5 pb-5 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-700 bg-blue-50/50 rounded-lg p-2.5 group-hover:bg-blue-50 transition-colors duration-300">
                <div className="flex-shrink-0 w-7 h-7 bg-[#1E68C6] rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium font-montserrat">{location}</span>
              </div>
            </div>
          )}

          {/* Keynote Topics Section */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3 bg-gradient-to-r from-blue-50 to-transparent p-2.5 rounded-lg -mx-1">
              <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-[#1E68C6] to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900 font-montserrat">Keynote Topics</span>
            </div>
            {safePrograms.length > 0 ? (
              <div className="space-y-2.5 bg-gradient-to-br from-blue-50/80 to-blue-50/40 rounded-lg p-4 border border-blue-100/50 shadow-inner">
                {safePrograms.slice(0, maxTopicsToShow).map((program, index) => (
                  <div key={`${slug}-program-${index}`} className="flex items-start gap-2.5 group/item">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-br from-[#1E68C6] to-blue-600 mt-1.5 shadow-sm"></span>
                    <span className="text-sm text-gray-800 font-montserrat leading-relaxed line-clamp-2 group-hover/item:text-gray-900 group-hover/item:font-medium transition-all">
                      {String(program).trim()}
                    </span>
                  </div>
                ))}
                {safePrograms.length > maxTopicsToShow && (
                  <div className="text-xs text-[#1E68C6] font-montserrat font-bold pl-4 pt-1 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#1E68C6]"></span>
                    +{safePrograms.length - maxTopicsToShow} more topics
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-500 font-montserrat italic bg-gray-50 rounded-lg p-3 border border-gray-200">No topics listed</div>
            )}
          </div>
          <div className="mt-auto pt-6 border-t-2 border-blue-100">
            <div className="w-full flex flex-col space-y-3">
              <Button asChild variant="gold" className={`${commonButtonClasses} group-hover:scale-[1.02] active:scale-[0.98]`}>
                <Link href={contactLink}>
                  <CalendarCheck size={16} />
                  <span>Book Speaker Today</span>
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button asChild variant="default" className={`${commonButtonClasses} flex-1 hover:bg-[#1E68C6] hover:border-[#1E68C6]`}>
                  <Link href={profileLink}>
                    <User size={16} />
                    <span>View Profile</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
