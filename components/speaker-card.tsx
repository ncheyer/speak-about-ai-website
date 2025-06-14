"use client"

import type React from "react"
import { useState } from "react"

interface Speaker {
  name: string
  title: string
  company: string
  bio: string
  image: string
}

interface SpeakerCardProps {
  speaker: Speaker
}

const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Add this style tag at the top of the component, right after the imports
  const styles = `
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`

  return (
    <>
      <style jsx>{styles}</style>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
        <img className="w-full h-56 object-cover" src={speaker.image || "/placeholder.svg"} alt={speaker.name} />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 font-montserrat group-hover:text-[#1E68C6] transition-colors duration-300">
            {speaker.name}
          </h3>
          <h4 className="text-md font-medium text-gray-700 font-montserrat">{speaker.title}</h4>
          <h5 className="text-sm text-gray-500 font-montserrat mb-2">{speaker.company}</h5>

          {/* Bio section with proper truncation */}
          <div className="mb-4">
            <p
              className={`text-gray-600 text-sm leading-relaxed font-montserrat transition-all duration-300 ${
                isExpanded ? "" : "line-clamp-3"
              }`}
            >
              {speaker.bio}
            </p>
            {speaker.bio.length > 150 && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsExpanded(!isExpanded)
                }}
                className="text-[#1E68C6] text-sm font-medium hover:underline mt-2 focus:outline-none focus:ring-2 focus:ring-[#1E68C6] focus:ring-opacity-50 rounded"
              >
                {isExpanded ? "Show less" : "Read more..."}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SpeakerCard
