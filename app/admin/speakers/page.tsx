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
  Trash2,
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  FileText,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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

interface SpeakerApplication {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  website?: string
  linkedin_url?: string
  location: string
  title: string
  company: string
  bio: string
  expertise_areas: string[]
  speaking_topics: string
  years_speaking?: number
  previous_engagements?: string
  video_links: string[]
  reference_contacts?: string
  speaking_fee_range?: string
  travel_requirements?: string
  available_formats: string[]
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'invited'
  admin_notes?: string
  rejection_reason?: string
  invitation_sent_at?: string
  account_created_at?: string
  created_at: string
  updated_at: string
  reviewed_at?: string
  reviewed_by?: string
}

export default function AdminSpeakersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [applications, setApplications] = useState<SpeakerApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingApplications, setLoadingApplications] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchApplications, setSearchApplications] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [featuredFilter, setFeaturedFilter] = useState("all")
  const [applicationStatusFilter, setApplicationStatusFilter] = useState("all")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<SpeakerApplication | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'invite' | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [processingAction, setProcessingAction] = useState(false)

  // Check authentication and load data
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
    loadSpeakers()
    loadApplications()
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

  const loadApplications = async () => {
    try {
      setLoadingApplications(true)
      const response = await fetch("/api/speaker-applications", {
        headers: {
          'x-dev-admin-bypass': 'dev-admin-access'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications || [])
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to load applications",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading applications:", error)
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      })
    } finally {
      setLoadingApplications(false)
    }
  }

  const handleApplicationAction = async () => {
    if (!selectedApplication || !actionType) return

    setProcessingAction(true)
    try {
      const response = await fetch(`/api/speaker-applications/${selectedApplication.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-dev-admin-bypass': 'dev-admin-access'
        },
        body: JSON.stringify({
          action: actionType,
          admin_notes: adminNotes,
          rejection_reason: actionType === 'reject' ? rejectionReason : undefined
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.message || `Application ${actionType} successfully`,
        })
        loadApplications()
        setReviewDialogOpen(false)
        setSelectedApplication(null)
        setAdminNotes("")
        setRejectionReason("")
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || `Failed to ${actionType} application`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(`Error processing application:`, error)
      toast({
        title: "Error",
        description: `Failed to ${actionType} application`,
        variant: "destructive",
      })
    } finally {
      setProcessingAction(false)
    }
  }

  const openReviewDialog = (application: SpeakerApplication, action: 'approve' | 'reject' | 'invite') => {
    setSelectedApplication(application)
    setActionType(action)
    setReviewDialogOpen(true)
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

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.first_name.toLowerCase().includes(searchApplications.toLowerCase()) ||
      app.last_name.toLowerCase().includes(searchApplications.toLowerCase()) ||
      app.email.toLowerCase().includes(searchApplications.toLowerCase()) ||
      app.company.toLowerCase().includes(searchApplications.toLowerCase()) ||
      app.speaking_topics.toLowerCase().includes(searchApplications.toLowerCase())

    const matchesStatus = applicationStatusFilter === "all" || app.status === applicationStatusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending Review', variant: 'secondary' as const, icon: Clock },
      under_review: { label: 'Under Review', variant: 'outline' as const, icon: FileText },
      approved: { label: 'Approved', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'Rejected', variant: 'destructive' as const, icon: XCircle },
      invited: { label: 'Invited', variant: 'default' as const, icon: Send },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="text-xs">
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    )
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
              <p className="mt-2 text-gray-600">Manage speaker profiles and applications</p>
            </div>
          </div>

          <Tabs defaultValue="speakers" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="speakers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Speakers ({speakers.length})
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Applications ({applications.filter(a => a.status === 'pending').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="speakers" className="space-y-6">

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
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              {/* Application Stats */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {applications.filter(a => a.status === 'pending').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {applications.filter(a => a.status === 'under_review').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {applications.filter(a => a.status === 'approved').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Invited</CardTitle>
                    <Send className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {applications.filter(a => a.status === 'invited').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {applications.filter(a => a.status === 'rejected').length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Application Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 min-w-[300px]">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search applications..."
                          value={searchApplications}
                          onChange={(e) => setSearchApplications(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={applicationStatusFilter} onValueChange={setApplicationStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Applications</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="invited">Invited</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Applications List */}
              {loadingApplications ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading applications...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <Card key={application.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <CardTitle className="text-lg">
                                {application.first_name} {application.last_name}
                              </CardTitle>
                              {getStatusBadge(application.status)}
                            </div>
                            <CardDescription>
                              {application.title} at {application.company}
                            </CardDescription>
                          </div>
                          <div className="text-sm text-gray-500">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {new Date(application.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">Contact</p>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                {application.email}
                              </div>
                              {application.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3" />
                                  {application.phone}
                                </div>
                              )}
                              {application.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-3 w-3" />
                                  {application.location}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">Links</p>
                            <div className="space-y-1">
                              {application.website && (
                                <div className="flex items-center gap-2">
                                  <Globe className="h-3 w-3" />
                                  <a href={application.website} target="_blank" rel="noopener" className="text-blue-600 hover:underline truncate">
                                    {application.website}
                                  </a>
                                </div>
                              )}
                              {application.linkedin_url && (
                                <div className="flex items-center gap-2">
                                  <Globe className="h-3 w-3" />
                                  <a href={application.linkedin_url} target="_blank" rel="noopener" className="text-blue-600 hover:underline truncate">
                                    LinkedIn Profile
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-500 mb-1 text-sm">Bio</p>
                          <p className="text-sm line-clamp-3">{application.bio}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-500 mb-1 text-sm">Expertise Areas</p>
                            <div className="flex flex-wrap gap-1">
                              {application.expertise_areas.slice(0, 3).map((area, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {area}
                                </Badge>
                              ))}
                              {application.expertise_areas.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{application.expertise_areas.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1 text-sm">Experience</p>
                            <p className="text-sm">
                              {application.years_speaking ? `${application.years_speaking} years speaking` : 'Not specified'}
                            </p>
                          </div>
                        </div>

                        {application.admin_notes && (
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-gray-500 mb-1 text-sm">Admin Notes</p>
                            <p className="text-sm">{application.admin_notes}</p>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                          <Link href={`/admin/speakers/applications/${application.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </Link>
                          {application.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => openReviewDialog(application, 'approve')}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openReviewDialog(application, 'reject')}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {application.status === 'approved' && !application.invitation_sent_at && (
                            <Button
                              size="sm"
                              onClick={() => openReviewDialog(application, 'invite')}
                            >
                              <Send className="h-3 w-3 mr-1" />
                              Send Invitation
                            </Button>
                          )}
                          {application.status === 'invited' && (
                            <Badge variant="outline" className="text-xs">
                              Invitation sent {new Date(application.invitation_sent_at!).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredApplications.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-12">
                        <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
                        <p className="text-gray-500">
                          {searchApplications ? "Try adjusting your search terms or filters." : "No applications match the current filters."}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {actionType === 'approve' && 'Approve Application'}
                {actionType === 'reject' && 'Reject Application'}
                {actionType === 'invite' && 'Send Invitation'}
              </DialogTitle>
              <DialogDescription>
                {selectedApplication && (
                  <span>{selectedApplication.first_name} {selectedApplication.last_name} - {selectedApplication.email}</span>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="admin_notes">Admin Notes</Label>
                <Textarea
                  id="admin_notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any internal notes about this decision..."
                  rows={3}
                />
              </div>
              {actionType === 'reject' && (
                <div>
                  <Label htmlFor="rejection_reason">Rejection Reason</Label>
                  <Textarea
                    id="rejection_reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a reason for rejection (optional)..."
                    rows={3}
                  />
                </div>
              )}
              {actionType === 'invite' && (
                <Alert>
                  <Send className="h-4 w-4" />
                  <AlertTitle>Invitation Email</AlertTitle>
                  <AlertDescription>
                    An invitation email will be sent with a link to create their speaker account. The link will expire in 7 days.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleApplicationAction}
                disabled={processingAction}
                variant={actionType === 'reject' ? 'destructive' : 'default'}
              >
                {processingAction ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {actionType === 'approve' && 'Approve'}
                    {actionType === 'reject' && 'Reject'}
                    {actionType === 'invite' && 'Send Invitation'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  )
}