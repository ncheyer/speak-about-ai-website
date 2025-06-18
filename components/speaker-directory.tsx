"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import type { Speaker } from "@/lib/speakers-data"
import { SpeakerCard } from "@/components/speaker-card"

// Define the 7 industry buckets and their associated keywords
const INDUSTRY_BUCKETS: Record<string, string[]> = {
  "Technology & AI": [
    "technology",
    "ai",
    "artificial intelligence",
    "software",
    "saas",
    "cybersecurity",
    "data science",
    "tech",
    "enterprise technology",
    "innovation",
  ],
  "Healthcare & Life Sciences": [
    "healthcare",
    "medical",
    "biotech",
    "pharmaceuticals",
    "health",
    "life sciences",
    "digital health",
    "wellness",
  ],
  "Financial Services": [
    "finance",
    "financial services",
    "fintech",
    "banking",
    "venture capital",
    "vc",
    "investment",
    "private equity",
    "insurance",
    "wall street",
  ],
  "Leadership & Business": [
    "leadership",
    "business strategy",
    "strategy",
    "management",
    "consulting",
    "executive",
    "corporate culture",
    "future of work",
    "entrepreneurship",
  ],
  "Sales, Marketing & Retail": [
    "sales",
    "marketing",
    "advertising",
    "digital marketing",
    "e-commerce",
    "ecommerce",
    "retail",
    "consumer goods",
    "cpg",
    "fashion",
    "customer experience",
    "cx",
  ],
  "Industrial & Automotive": [
    "manufacturing",
    "automotive",
    "industrial",
    "supply chain",
    "logistics",
    "energy",
    "aerospace",
  ],
  "Government & Education": ["government", "public sector", "policy", "education", "academia", "non-profit"],
}

const industryBucketKeys = Object.keys(INDUSTRY_BUCKETS)

interface SpeakerDirectoryProps {
  initialSpeakers: Speaker[]
}

export default function SpeakerDirectory({ initialSpeakers }: SpeakerDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("all")

  const validInitialSpeakers = useMemo(() => {
    if (!Array.isArray(initialSpeakers)) {
      return []
    }
    return initialSpeakers.filter((s) => s && s.slug && s.name)
  }, [initialSpeakers])

  const [filteredSpeakers, setFilteredSpeakers] = useState<Speaker[]>(validInitialSpeakers)
  const [displayedSpeakers, setDisplayedSpeakers] = useState<Speaker[]>(validInitialSpeakers.slice(0, 12))
  const [displayCount, setDisplayCount] = useState(12)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const applyFilters = () => {
      setIsLoading(true)
      setError(false)

      try {
        if (searchQuery.trim() === "" && selectedIndustry === "all") {
          setFilteredSpeakers(validInitialSpeakers)
          setDisplayedSpeakers(validInitialSpeakers.slice(0, 12))
          setDisplayCount(12)
          setIsLoading(false)
          return
        }

        let searchResults: Speaker[] = []

        if (searchQuery.trim()) {
          const searchTerm = searchQuery.toLowerCase().trim()
          const speakersWithScores = validInitialSpeakers.map((speaker) => {
            let score = 0
            const matchedFields: string[] = []

            const checkAndScore = (field: string | string[] | undefined, weight: number, fieldName: string) => {
              if (!field) return
              let isMatch = false
              if (typeof field === "string") {
                if (field.toLowerCase().includes(searchTerm)) isMatch = true
              } else if (Array.isArray(field)) {
                if (field.some((item) => typeof item === "string" && item.toLowerCase().includes(searchTerm)))
                  isMatch = true
              }
              if (isMatch) {
                score += weight
                if (!matchedFields.includes(fieldName)) {
                  matchedFields.push(fieldName)
                }
              }
            }

            checkAndScore(speaker.expertise, 4, "expertise")
            checkAndScore(speaker.industries, 3, "industries")
            checkAndScore(speaker.programs, 2, "programs")
            checkAndScore(speaker.name, 1, "name")
            checkAndScore(speaker.title, 1, "title")
            checkAndScore(speaker.bio, 1, "bio")
            checkAndScore(speaker.location, 1, "location")
            checkAndScore(speaker.tags, 1, "tags")

            return { speaker, score, matchedFields }
          })

          searchResults = speakersWithScores
            .filter((item) => item.score > 0)
            .sort((a, b) => {
              if (b.score !== a.score) return b.score - a.score
              return a.speaker.name.localeCompare(b.speaker.name)
            })
            .map((item) => item.speaker)
        } else {
          searchResults = validInitialSpeakers
        }

        let finalFilteredSpeakers = searchResults
        if (selectedIndustry !== "all") {
          const keywords = INDUSTRY_BUCKETS[selectedIndustry]
          if (keywords) {
            finalFilteredSpeakers = searchResults.filter((speaker) => {
              if (!speaker.industries) return false

              const speakerIndustries = (
                typeof speaker.industries === "string" ? speaker.industries.split(",") : speaker.industries
              ).map((i) => i.trim().toLowerCase())

              return speakerIndustries.some((ind) => keywords.some((kw) => ind.includes(kw)))
            })
          }
        }

        setFilteredSpeakers(finalFilteredSpeakers)
        setDisplayedSpeakers(finalFilteredSpeakers.slice(0, 12))
        setDisplayCount(12)
      } catch (err) {
        console.error("Error applying filters in SpeakerDirectory:", err)
        setError(true)
        setFilteredSpeakers(validInitialSpeakers)
        setDisplayedSpeakers(validInitialSpeakers.slice(0, 12))
      } finally {
        setIsLoading(false)
      }
    }

    applyFilters()
  }, [searchQuery, selectedIndustry, validInitialSpeakers])

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
                      {industryBucketKeys.map((bucket) => (
                        <SelectItem key={bucket} value={bucket}>
                          {bucket}
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
                className="bg-blue-600 hover:bg-blue-700 font-montserrat"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {!isLoading && !error && filteredSpeakers.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayedSpeakers.map((speaker) => (
                  <SpeakerCard key={speaker.slug} speaker={speaker} contactSource="speaker_directory" />
                ))}
              </div>

              {displayCount < filteredSpeakers.length && (
                <div className="text-center mt-12">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-montserrat"
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
