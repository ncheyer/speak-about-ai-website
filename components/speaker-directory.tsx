"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { searchSpeakers, type Speaker } from "@/lib/speakers-data"
import { SpeakerCard } from "@/components/speaker-card"

interface SpeakerDirectoryProps {
  initialSpeakers: Speaker[]
}

export default function SpeakerDirectory({ initialSpeakers }: SpeakerDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("all")

  const validInitialSpeakers = useMemo(
    () => (Array.isArray(initialSpeakers) ? initialSpeakers.filter((s) => s && s.slug) : []),
    [initialSpeakers],
  )

  const [filteredSpeakers, setFilteredSpeakers] = useState<Speaker[]>(validInitialSpeakers)
  const [displayedSpeakers, setDisplayedSpeakers] = useState<Speaker[]>(validInitialSpeakers.slice(0, 12))
  const [displayCount, setDisplayCount] = useState(12)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const industries = useMemo(() => {
    return Array.from(
      new Set(
        validInitialSpeakers.flatMap((speaker) => (Array.isArray(speaker?.industries) ? speaker.industries : [])),
      ),
    ).sort()
  }, [validInitialSpeakers])

  useEffect(() => {
    const applyFilters = async () => {
      setIsLoading(true)
      setError(false)
      try {
        const baseSpeakersData = await searchSpeakers(searchQuery)
        // Ensure baseSpeakersData is an array and filter for valid slugs
        const safeBaseSpeakers = Array.isArray(baseSpeakersData) ? baseSpeakersData.filter((s) => s && s.slug) : []

        let finalFilteredSpeakers = safeBaseSpeakers

        if (selectedIndustry !== "all") {
          finalFilteredSpeakers = safeBaseSpeakers.filter((speaker) =>
            (Array.isArray(speaker?.industries) ? speaker.industries : []).some((industry) =>
              industry.toLowerCase().includes(selectedIndustry.toLowerCase()),
            ),
          )
        }

        setFilteredSpeakers(finalFilteredSpeakers)
        setDisplayedSpeakers(finalFilteredSpeakers.slice(0, 12))
        setDisplayCount(12)
      } catch (err) {
        console.error("Error applying filters in SpeakerDirectory:", err)
        setError(true)
        setFilteredSpeakers([]) // Reset on error
        setDisplayedSpeakers([])
      } finally {
        setIsLoading(false)
      }
    }

    // Initial load uses validInitialSpeakers, subsequent filters use searchSpeakers
    if (searchQuery === "" && selectedIndustry === "all") {
      setFilteredSpeakers(validInitialSpeakers)
      setDisplayedSpeakers(validInitialSpeakers.slice(0, 12))
      setDisplayCount(12)
      setIsLoading(false)
    } else {
      applyFilters()
    }
  }, [searchQuery, selectedIndustry, validInitialSpeakers]) // validInitialSpeakers replaces initialSpeakers here

  const handleLoadMore = () => {
    const newCount = displayCount + 12
    setDisplayedSpeakers(filteredSpeakers.slice(0, newCount))
    setDisplayCount(newCount)
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#EAEAEE] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-neue-haas">
              All AI Keynote Speakers
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
              Browse our complete directory of world-class artificial intelligence experts, tech visionaries, and
              industry practitioners.
            </p>
          </div>

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
                    <SelectTrigger className="w-full md:w-48 font-montserrat">
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
                Showing {displayedSpeakers.length} of {filteredSpeakers.length} speakers
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && <div className="text-center py-12 font-montserrat text-gray-600">Loading speakers...</div>}
          {!isLoading && error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4 font-montserrat">
                An error occurred while loading speakers. Please try again.
              </p>
            </div>
          )}
          {!isLoading && !error && filteredSpeakers.length === 0 && (
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
          )}
          {!isLoading && !error && filteredSpeakers.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {/* displayedSpeakers array is already filtered to ensure s and s.slug exist */}
                {displayedSpeakers.map((speaker) => (
                  <SpeakerCard
                    key={speaker.slug} // slug is guaranteed here
                    speaker={speaker}
                    contactSource="speaker_directory"
                    maxTopicsToShow={3}
                  />
                ))}
              </div>

              {displayCount < filteredSpeakers.length && (
                <div className="text-center mt-12">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    className="border-[#1E68C6] text-[#1E68C6] hover:bg-[#1E68C6] hover:text-white font-montserrat"
                  >
                    Load More Speakers ({filteredSpeakers.length - displayCount} remaining)
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
