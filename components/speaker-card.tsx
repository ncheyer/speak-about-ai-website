"use client"

import type React from "react"
import { useState } from "react"

interface Speaker {
  id: number
  name: string
  bio: string
  imageUrl: string
  imagePosition: "top" | "bottom"
  imageOffsetY?: string
  expertise?: string[]
}

interface SpeakerCardProps {
  speaker: Speaker
}

const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker }) => {
  console.log(
    `SpeakerCard: ${speaker.name} - imagePosition: ${speaker.imagePosition}, imageOffsetY: ${speaker.imageOffsetY}, imageUrl: ${speaker.imageUrl}`,
  )
  console.log(`SpeakerCard for ${speaker.name}: Expertise received: ${JSON.stringify(speaker.expertise)}`)
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">("loading")

  const handleImageLoad = () => {
    setImageState("loaded")
  }

  const handleImageError = () => {
    setImageState("error")
  }

  const imageUrl = speaker.imageUrl

  return (
    <div className="speaker-card">
      <img
        src={imageUrl || "/placeholder.svg"}
        alt={speaker.name}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          objectPosition: speaker.imagePosition === "top" ? `center ${speaker.imageOffsetY || "0%"}` : "center",
          display: imageState === "error" ? "none" : "block",
        }}
      />
      <h3>{speaker.name}</h3>
      <p>{speaker.bio}</p>
    </div>
  )
}

export default SpeakerCard
