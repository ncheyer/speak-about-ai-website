"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, Users, Star, MapPin, ChevronRight, Loader2 } from "lucide-react"
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
  featured: boolean
  active: boolean
}

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFormat, setSelectedFormat] = useState<string>("all")

  useEffect(() => {
    loadWorkshops()
  }, [])

  useEffect(() => {
    filterWorkshops()
  }, [searchQuery, selectedFormat, workshops])

  const loadWorkshops = async () => {
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
  }

  const filterWorkshops = () => {
    let filtered = workshops

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (w) =>
          w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.short_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.speaker_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.target_audience?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.topics?.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by format
    if (selectedFormat !== "all") {
      filtered = filtered.filter((w) => w.format === selectedFormat)
    }

    setFilteredWorkshops(filtered)
  }

  const featuredWorkshops = filteredWorkshops.filter((w) => w.featured)
  const regularWorkshops = filteredWorkshops.filter((w) => !w.featured)

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI Workshops & Training
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Hands-on learning experiences led by world-class AI experts. Transform your team's understanding of artificial intelligence.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search workshops by topic, speaker, or audience..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="h-12 px-4 border border-gray-300 rounded-md text-base"
              >
                <option value="all">All Formats</option>
                <option value="virtual">Virtual</option>
                <option value="in-person">In-Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 max-w-xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-blue-600">{workshops.length}+</div>
                <div className="text-sm text-gray-600 mt-1">Workshops</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">Expert</div>
                <div className="text-sm text-gray-600 mt-1">Instructors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">Custom</div>
                <div className="text-sm text-gray-600 mt-1">Options</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Workshops */}
      {featuredWorkshops.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-900">Featured Workshops</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Workshops */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {searchQuery || selectedFormat !== "all" ? "Search Results" : "All Workshops"}
            </h2>
            <p className="text-gray-600">{filteredWorkshops.length} workshops</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
              <p className="mt-4 text-gray-600">Loading workshops...</p>
            </div>
          ) : filteredWorkshops.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No workshops found matching your criteria.</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedFormat("all")
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Can't Find the Right Workshop?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            We offer fully customizable workshops tailored to your organization's needs and goals.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="font-semibold">
              Request Custom Workshop
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}

function WorkshopCard({ workshop, featured = false }: { workshop: Workshop; featured?: boolean }) {
  return (
    <Link href={`/workshops/${workshop.slug}`}>
      <Card className={`h-full hover:shadow-xl transition-all duration-300 ${featured ? "border-yellow-400 border-2" : ""}`}>
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <Badge variant={workshop.format === "virtual" ? "default" : "outline"} className="capitalize">
              {workshop.format || "TBD"}
            </Badge>
            {featured && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Star className="h-3 w-3 mr-1 fill-yellow-800" />
                Featured
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl line-clamp-2">{workshop.title}</CardTitle>
          <CardDescription className="line-clamp-2 min-h-[2.5rem]">
            {workshop.short_description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Speaker Info */}
          {workshop.speaker_name && (
            <div className="flex items-center gap-3 pb-4 border-b">
              {workshop.speaker_headshot && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={workshop.speaker_headshot}
                    alt={workshop.speaker_name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">{workshop.speaker_name}</p>
                <p className="text-xs text-gray-500">Instructor</p>
              </div>
            </div>
          )}

          {/* Workshop Details */}
          <div className="space-y-2">
            {workshop.duration_minutes && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                {workshop.duration_minutes} minutes
              </div>
            )}
            {workshop.target_audience && (
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                {workshop.target_audience}
              </div>
            )}
          </div>

          {/* Topics */}
          {workshop.topics && workshop.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {workshop.topics.slice(0, 3).map((topic, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          )}

          {/* View Details */}
          <Button variant="outline" className="w-full group">
            View Details
            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
