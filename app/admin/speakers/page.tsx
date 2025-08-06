"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Users,
  Search,
  Edit,
  Eye,
  LogOut,
  ArrowLeft,
  Star,
  MapPin,
  Mail,
  Globe,
  Loader2,
  AlertTriangle,
  Plus,
  Filter,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { AdminSidebar } from "@/components/admin-sidebar"

interface Speaker {
  id: number
  name: string
  email: string
  bio: string
  short_bio: string
  one_liner: string
  headshot_url: string
  website: string
  location: string
  programs: string
  topics: string[]
  industries: string[]
  videos: Array<{
    id: string
    title: string
    url: string
    thumbnail?: string
  }>
  testimonials: Array<{
    quote: string
    author: string
    position?: string
    company?: string
  }>
  speaking_fee_range: string
  featured: boolean
  active: boolean
  listed: boolean
  ranking: number
  created_at: string
  updated_at: string
}

export default function AdminSpeakersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [featuredFilter, setFeaturedFilter] = useState("all")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check authentication and load speakers
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
    loadSpeakers()
  }, [router])

  const handleDeleteSpeaker = async (speakerId: number, speakerName: string) => {
    if (!confirm(`Are you sure you want to delete ${speakerName}? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/speakers/${speakerId}`, {
        method: 'DELETE',
        headers: {
          'x-dev-admin-bypass': 'dev-admin-access'
        },
        credentials: 'include'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `${speakerName} has been deleted successfully`,
        })
        // Reload speakers list
        loadSpeakers()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete speaker",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting speaker:", error)
      toast({
        title: "Error",
        description: "Failed to delete speaker. Please try again.",
        variant: "destructive",
      })
    }
  }

  const loadSpeakers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/speakers")

      if (response.ok) {
        const speakersData = await response.json()
        setSpeakers(speakersData.speakers || [])
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to load speakers",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading speakers:", error)
      toast({
        title: "Error",
        description: "Failed to load speakers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("adminLoggedIn")
      localStorage.removeItem("adminSessionToken")
      localStorage.removeItem("adminUser")
      router.push("/admin")
    }
  }

  const filteredSpeakers = speakers.filter((speaker) => {
    const matchesSearch =
      speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
      speaker.industries.some(industry => industry.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesActive = activeFilter === "all" || 
      (activeFilter === "active" && speaker.active) ||
      (activeFilter === "inactive" && !speaker.active)

    const matchesFeatured = featuredFilter === "all" ||
      (featuredFilter === "featured" && speaker.featured) ||
      (featuredFilter === "not-featured" && !speaker.featured)

    return matchesSearch && matchesActive && matchesFeatured
  })

  if (!isLoggedIn) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading speakers...</span>
      </div>
    )
  }

  const totalSpeakers = speakers.length
  const activeSpeakers = speakers.filter(s => s.active).length
  const featuredSpeakers = speakers.filter(s => s.featured).length
  const speakersWithVideos = speakers.filter(s => s.videos && s.videos.length > 0).length

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-[60]">
        <AdminSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-72 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Speaker Management</h1>
              <p className="mt-2 text-gray-600">Manage speaker profiles and information</p>
            </div>
          </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Speakers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSpeakers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Speakers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSpeakers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((activeSpeakers / totalSpeakers) * 100)}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured Speakers</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{featuredSpeakers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Videos</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{speakersWithVideos}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((speakersWithVideos / totalSpeakers) * 100)}% have videos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search speakers by name, email, bio, topics, or industries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Speakers</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Speakers</SelectItem>
                  <SelectItem value="featured">Featured Only</SelectItem>
                  <SelectItem value="not-featured">Not Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredSpeakers.length} of {totalSpeakers} speakers
          </p>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpeakers.map((speaker) => (
            <Card key={speaker.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={speaker.headshot_url} alt={speaker.name} />
                      <AvatarFallback>{speaker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{speaker.name}</CardTitle>
                      <div className="flex gap-1 mt-1">
                        {speaker.featured && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="mr-1 h-3 w-3" />
                            Featured
                          </Badge>
                        )}
                        <Badge variant={speaker.active ? "default" : "secondary"} className="text-xs">
                          {speaker.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{speaker.email}</span>
                  </div>
                  {speaker.location && (
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{speaker.location}</span>
                    </div>
                  )}
                  {speaker.website && (
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="h-3 w-3" />
                      <span className="truncate">{speaker.website}</span>
                    </div>
                  )}
                </div>

                {speaker.one_liner && (
                  <p className="text-sm text-gray-700 line-clamp-2">{speaker.one_liner}</p>
                )}

                {speaker.topics.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Topics:</p>
                    <div className="flex flex-wrap gap-1">
                      {speaker.topics.slice(0, 3).map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {speaker.topics.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{speaker.topics.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-gray-500">
                    {speaker.videos?.length || 0} videos • {speaker.testimonials?.length || 0} testimonials
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/speakers/${speaker.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/speakers/${speaker.id}/edit`}>
                      <Button size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteSpeaker(speaker.id, speaker.name)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSpeakers.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No speakers found</h3>
              <p className="text-gray-500">
                {searchTerm ? "Try adjusting your search terms or filters." : "No speakers match the current filters."}
              </p>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </div>
  )
}