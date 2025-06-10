"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MapPin } from "lucide-react"
import Link from "next/link"
import { getAllSpeakers, searchSpeakers, type Speaker } from "@/lib/speakers-data"

export default function SpeakerDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [expertiseFilter, setExpertiseFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(true)

  // Load speakers on component mount
  useEffect(() => {
    const allSpeakers = getAllSpeakers()
    setSpeakers(allSpeakers)
    setLoading(false)
  }, [])

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const searchResults = searchSpeakers(searchQuery)
      setSpeakers(searchResults)
    } else {
      const allSpeakers = getAllSpeakers()
      setSpeakers(allSpeakers)
    }
  }, [searchQuery])

  const filteredSpeakers = useMemo(() => {
    let filtered = speakers

    if (industryFilter !== "all") {
      filtered = filtered.filter((speaker) =>
        speaker.industries.some((industry) => industry.toLowerCase().includes(industryFilter.toLowerCase())),
      )
    }

    if (expertiseFilter !== "all") {
      filtered = filtered.filter((speaker) =>
        speaker.expertise.some((skill) => skill.toLowerCase().includes(expertiseFilter.toLowerCase())),
      )
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((speaker) => speaker.location?.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    return filtered
  }, [speakers, industryFilter, expertiseFilter, locationFilter])

  const uniqueIndustries = Array.from(new Set(speakers.flatMap((speaker) => speaker.industries))).sort()
  const uniqueExpertise = Array.from(new Set(speakers.flatMap((speaker) => speaker.expertise))).sort()
  const uniqueLocations = Array.from(
    new Set(
      speakers
        .map((speaker) => {
          if (!speaker.location) return null
          if (speaker.location.includes(",")) {
            return speaker.location.split(",")[1]?.trim() || speaker.location
          }
          return speaker.location
        })
        .filter(Boolean),
    ),
  ).sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E68C6] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading speakers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#EAEAEE] to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">All AI Speakers</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our complete directory of {speakers.length}+ world-class artificial intelligence experts, machine
              learning pioneers, and tech visionaries.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search speakers by name, expertise, or industry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg border-gray-300 focus:border-[#1E68C6] focus:ring-[#1E68C6]"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {uniqueIndustries.map((industry) => (
                        <SelectItem key={industry} value={industry.toLowerCase()}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
                  <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Expertise</SelectItem>
                      {uniqueExpertise.map((expertise) => (
                        <SelectItem key={expertise} value={expertise.toLowerCase()}>
                          {expertise}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {uniqueLocations.map((location) => (
                        <SelectItem key={location} value={location.toLowerCase()}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear Filters */}
              {(searchQuery || industryFilter !== "all" || expertiseFilter !== "all" || locationFilter !== "all") && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setIndustryFilter("all")
                      setExpertiseFilter("all")
                      setLocationFilter("all")
                    }}
                    className="text-[#1E68C6] border-[#1E68C6] hover:bg-[#1E68C6] hover:text-white"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-black">
              {filteredSpeakers.length} Speaker{filteredSpeakers.length !== 1 ? "s" : ""} Found
            </h2>
            {searchQuery && <p className="text-gray-600">Results for "{searchQuery}"</p>}
          </div>

          {filteredSpeakers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No speakers found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or clearing the filters.</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setIndustryFilter("all")
                  setExpertiseFilter("all")
                  setLocationFilter("all")
                }}
                className="bg-[#1E68C6] hover:bg-[#5084C6]"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSpeakers.map((speaker) => (
                <SpeakerCard key={speaker.slug} speaker={speaker} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="relative">
          <img
            src={speaker.image || "/placeholder.svg?height=300&width=300"}
            alt={speaker.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded text-sm font-semibold text-gray-900">
            {speaker.fee || "Please Inquire"}
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-black mb-2">{speaker.name}</h3>
          <p className="text-[#5084C6] font-semibold mb-3 text-sm">{speaker.title}</p>

          <div className="mb-4 flex-1">
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{speaker.bio}</p>

            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">Expertise:</h4>
              <div className="flex flex-wrap gap-1">
                {speaker.expertise.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {speaker.expertise.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{speaker.expertise.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {speaker.location && (
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                {speaker.location}
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-auto">
            <Button asChild className="flex-1 bg-[#1E68C6] hover:bg-[#5084C6] text-sm">
              <Link href={`/speakers/${speaker.slug}`}>View Profile</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 text-sm">
              <Link href="/contact">Book Now</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
