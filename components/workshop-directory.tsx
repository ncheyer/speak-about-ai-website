"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Clock, Users, ChevronRight, Loader2, MapPin, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Workshop {
  id: number
  title: string
  slug: string
  speaker_id: number | null
  speaker_name?: string
  speaker_slug?: string
  speaker_headshot?: string
  speaker_location?: string
  short_description: string | null
  duration_minutes: number | null
  format: string | null
  target_audience: string | null
  price_range: string | null
  topics: string[] | null
  thumbnail_url: string | null
  featured: boolean
  active: boolean
}

export default function WorkshopDirectory() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFormat, setSelectedFormat] = useState<string>("all")
  const [selectedDuration, setSelectedDuration] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedAudience, setSelectedAudience] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const loadWorkshops = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/workshops")
      if (response.ok) {
        const data = await response.json()
        setWorkshops(data)
        setFilteredWorkshops(data)
      }
    } catch (error) {
      console.error("Error loading workshops:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load workshops on mount
  useEffect(() => {
    loadWorkshops()
  }, [loadWorkshops])

  const filterWorkshops = useCallback(() => {
    let filtered = workshops

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(
        (w) =>
          w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.short_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.speaker_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.target_audience?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.topics?.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Format filter (case-insensitive matching)
    if (selectedFormat !== "all") {
      filtered = filtered.filter((w) =>
        w.format?.toLowerCase().replace(/[-_\s]/g, '') === selectedFormat.toLowerCase().replace(/[-_\s]/g, '')
      )
    }

    // Duration filter
    if (selectedDuration !== "all") {
      filtered = filtered.filter((w) => {
        if (!w.duration_minutes) return false
        switch (selectedDuration) {
          case "short": // Under 1 hour
            return w.duration_minutes <= 60
          case "medium": // 1-2 hours
            return w.duration_minutes > 60 && w.duration_minutes <= 120
          case "long": // Over 2 hours
            return w.duration_minutes > 120
          default:
            return true
        }
      })
    }

    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter((w) =>
        w.speaker_location?.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    // Audience filter
    if (selectedAudience !== "all") {
      filtered = filtered.filter((w) =>
        w.target_audience?.toLowerCase().includes(selectedAudience.toLowerCase())
      )
    }

    setFilteredWorkshops(filtered)
  }, [workshops, searchQuery, selectedFormat, selectedDuration, selectedLocation, selectedAudience])

  // Filter workshops when search/format changes
  useEffect(() => {
    filterWorkshops()
  }, [filterWorkshops])

  // Fixed format options
  const formatOptions = [
    { value: "all", label: "All Formats" },
    { value: "virtual", label: "Virtual" },
    { value: "in-person", label: "In-Person" },
    { value: "hybrid", label: "Hybrid" }
  ]

  // Extract unique values for other filters
  const locations = ["all", ...Array.from(new Set(workshops.map((w) => w.speaker_location).filter(Boolean)))]
  const audiences = ["all", ...Array.from(new Set(workshops.map((w) => w.target_audience).filter(Boolean)))]

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#EAEAEE] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-neue-haas">
              AI Workshops
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
              Discover hands-on AI workshops led by industry experts. Interactive training programs covering machine
              learning, generative AI, and practical implementation strategies for your team.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search workshops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 font-montserrat"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="font-montserrat flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                  {/* Format Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block font-montserrat">
                      Format
                    </label>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger className="font-montserrat">
                        <SelectValue placeholder="All Formats" />
                      </SelectTrigger>
                      <SelectContent>
                        {formatOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block font-montserrat">
                      Length
                    </label>
                    <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                      <SelectTrigger className="font-montserrat">
                        <SelectValue placeholder="All Lengths" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Lengths</SelectItem>
                        <SelectItem value="short">Short (&lt; 1 hour)</SelectItem>
                        <SelectItem value="medium">Medium (1-2 hours)</SelectItem>
                        <SelectItem value="long">Long (&gt; 2 hours)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block font-montserrat">
                      Instructor Location
                    </label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="font-montserrat">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.filter(l => l !== "all").map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Audience Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block font-montserrat">
                      Target Audience
                    </label>
                    <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                      <SelectTrigger className="font-montserrat">
                        <SelectValue placeholder="All Audiences" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Audiences</SelectItem>
                        {audiences.filter(a => a !== "all").map((audience) => (
                          <SelectItem key={audience} value={audience}>
                            {audience}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Results Count and Clear Filters */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600 font-montserrat">
                  Showing {filteredWorkshops.length} of {workshops.length} workshops
                </div>
                {(selectedFormat !== "all" || selectedDuration !== "all" || selectedLocation !== "all" || selectedAudience !== "all" || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedFormat("all")
                      setSelectedDuration("all")
                      setSelectedLocation("all")
                      setSelectedAudience("all")
                    }}
                    className="font-montserrat text-[#1E68C6] hover:text-blue-700"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#1E68C6]" />
            </div>
          ) : filteredWorkshops.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg font-montserrat">
                No workshops found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkshops.map((workshop) => (
                <Card key={workshop.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    {workshop.thumbnail_url && (
                      <div className="relative w-full aspect-[4/3] mb-4 rounded-lg overflow-hidden bg-gray-50">
                        <Image
                          src={workshop.thumbnail_url}
                          alt={workshop.title}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <CardTitle className="text-xl font-bold font-neue-haas">{workshop.title}</CardTitle>
                    {workshop.speaker_name && (
                      <CardDescription className="flex items-center gap-2 mt-2 font-montserrat">
                        <Users className="w-4 h-4" />
                        Led by {workshop.speaker_name}
                        {workshop.speaker_location && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {workshop.speaker_location}
                          </span>
                        )}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {workshop.short_description && (
                      <p className="text-gray-600 text-sm font-montserrat">{workshop.short_description}</p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {workshop.format && (
                        <Badge variant="secondary" className="font-montserrat">
                          {workshop.format}
                        </Badge>
                      )}
                      {workshop.duration_minutes && (
                        <Badge variant="outline" className="flex items-center gap-1 font-montserrat">
                          <Clock className="w-3 h-3" />
                          {workshop.duration_minutes} min
                        </Badge>
                      )}
                    </div>

                    {workshop.topics && workshop.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {workshop.topics.slice(0, 3).map((topic, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs font-montserrat">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col gap-3 mt-4">
                      <Link href={`/contact?workshop=${workshop.id}`}>
                        <Button className="w-full font-montserrat font-bold" variant="gold">
                          Inquire About Workshop
                        </Button>
                      </Link>
                      <Link href={`/ai-workshops/${workshop.slug}`}>
                        <Button className="w-full font-montserrat" variant="outline">
                          View Details
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
