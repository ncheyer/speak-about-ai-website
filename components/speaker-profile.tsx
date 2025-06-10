import type React from "react"
import Image from "next/image"

interface SpeakerProfileProps {
  speaker: {
    name: string
    title: string
    company: string
    image: string
    imagePosition?: "top" | "center"
    bio: string
  }
}

const SpeakerProfile: React.FC<SpeakerProfileProps> = ({ speaker }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-64">
        <Image
          src={speaker.image || "/placeholder.svg"}
          alt={speaker.name}
          fill
          className={`object-cover ${speaker.imagePosition === "top" ? "object-top" : "object-center"}`}
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{speaker.name}</h2>
        <p className="text-gray-600">
          {speaker.title}, {speaker.company}
        </p>
        <p className="mt-2 text-gray-700">{speaker.bio}</p>
      </div>
    </div>
  )
}

export default SpeakerProfile
