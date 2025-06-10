"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getAllSpeakers, type Speaker } from "@/lib/speakers-data"

export default function FeaturedSpeakers() {
  // Get featured speakers from static data
  const allSpeakers = getAllSpeakers()
  const featuredSpeakers = allSpeakers.slice(0, 8) // Show first 8 speakers

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4 font-neue-haas">Featured AI Keynote Speakers</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
            World-class artificial intelligence experts, machine learning pioneers, and tech visionaries who are shaping
            the future of AI across every industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {featuredSpeakers.map((speaker) => (
            <SpeakerCard key={speaker.slug} speaker={speaker} />
          ))}
        </div>

        <div className="text-center">
          <button
            className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-11 px-8 border border-[#1E68C6] hover:bg-[#1E68C6] hover:bg-opacity-10 font-montserrat transition-colors"
            data-button="primary"
            style={{
              borderColor: "#1E68C6",
              color: "#1E68C6",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1E68C6"
              e.currentTarget.style.color = "white"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
              e.currentTarget.style.color = "#1E68C6"
            }}
          >
            <Link href="/speakers" className="no-underline">
              View All {allSpeakers.length}+ AI Speakers
            </Link>
          </button>
        </div>
      </div>
    </section>
  )
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={speaker.image || "/placeholder.svg?height=300&width=300"}
            alt={speaker.name}
            className={`w-full h-64 rounded-t-lg transition-transform duration-300 group-hover:scale-105 ${
              speaker.imagePosition === "top" ? "object-top object-cover" : "object-cover object-center"
            }`}
          />
          <Badge className="absolute top-4 left-4 bg-[#1E68C6] text-white font-montserrat">
            {speaker.industries[0] || "AI Expert"}
          </Badge>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-black mb-2 font-neue-haas">{speaker.name}</h3>
          <p className="text-[#5084C6] font-semibold mb-3 font-montserrat text-sm">{speaker.title}</p>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 font-montserrat">{speaker.bio}</p>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-black mb-2 font-montserrat">Speaking Topics:</h4>
            <div className="flex flex-wrap gap-1">
              {speaker.expertise.slice(0, 2).map((topic, index) => (
                <Badge key={index} variant="secondary" className="text-xs font-montserrat">
                  {topic}
                </Badge>
              ))}
              {speaker.expertise.length > 2 && (
                <Badge variant="secondary" className="text-xs font-montserrat">
                  +{speaker.expertise.length - 2} more
                </Badge>
              )}
            </div>
          </div>

          <button
            className="btn-primary w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 font-montserrat"
            data-button="primary"
            style={{
              backgroundColor: "#1E68C6",
              color: "white",
              border: "none",
            }}
          >
            <Link href="/contact" className="text-white no-underline">
              Check Availability
            </Link>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
