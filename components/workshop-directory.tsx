"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, Users, ChevronRight, Loader2 } from "lucide-react"
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

    if (selectedFormat !== "all") {
      filtered = filtered.filter((w) => w.format === selectedFormat)
    }

    setFilteredWorkshops(filtered)
  }, [workshops, searchQuery, selectedFormat])

  // Filter workshops when search/format changes
  useEffect(() => {
    filterWorkshops()
  }, [filterWorkshops])

  const formats = ["all", ...Array.from(new Set(workshops.map((w) => w.format).filter(Boolean)))]

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
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
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
                <div className="flex gap-2 flex-wrap">
                  {formats.map((format) => (
                    <Button
                      key={format}
                      variant={selectedFormat === format ? "default" : "outline"}
                      onClick={() => setSelectedFormat(format)}
                      className="capitalize font-montserrat"
                    >
                      {format === "all" ? "All Formats" : format}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600 font-montserrat">
                Showing {filteredWorkshops.length} of {workshops.length} workshops
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
                      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                        <Image src={workshop.thumbnail_url} alt={workshop.title} fill className="object-cover" />
                      </div>
                    )}
                    <CardTitle className="text-xl font-bold font-neue-haas">{workshop.title}</CardTitle>
                    {workshop.speaker_name && (
                      <CardDescription className="flex items-center gap-2 mt-2 font-montserrat">
                        <Users className="w-4 h-4" />
                        Led by {workshop.speaker_name}
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

                    <Link href={`/ai-workshops/${workshop.slug}`}>
                      <Button className="w-full mt-4 font-montserrat" variant="default">
                        Learn More
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
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
