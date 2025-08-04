"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  DollarSign,
  Briefcase,
  ArrowLeft,
  LogOut,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Star,
  MapPin,
  Mail,
  Globe,
  Loader2,
  TrendingUp,
  CheckSquare,
  Calendar,
  AlertTriangle,
  BarChart3,
  Activity,
  MousePointer
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { DealsKanban } from "@/components/deals-kanban"
import { ProjectsKanban } from "@/components/projects-kanban"

// Type definitions
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
  topics: string[]
  industries: string[]
  videos: Array<{ id: string; title: string; url: string }>
  testimonials: Array<{ quote: string; author: string }>
  speaking_fee_range: string
  featured: boolean
  active: boolean
  created_at: string
}

interface Deal {
  id: number
  client_name: string
  client_email: string
  company: string
  event_title: string
  event_date: string
  event_location: string
  deal_value: number
  status: "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
  priority: "low" | "medium" | "high" | "urgent"
  created_at: string
}

interface Project {
  id: number
  project_name: string
  client_name: string
  company?: string
  project_type: string
  status: "2plus_months" | "1to2_months" | "less_than_month" | "final_week" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  budget: number
  completion_percentage: number
  start_date: string
  deadline?: string
}

const STATUS_COLORS = {
  // Deal statuses
  lead: "bg-gray-500",
  qualified: "bg-blue-500", 
  proposal: "bg-yellow-500",
  negotiation: "bg-orange-500",
  won: "bg-green-500",
  lost: "bg-red-500",
  // Project statuses
  "2plus_months": "bg-green-500",
  "1to2_months": "bg-blue-500",
  "less_than_month": "bg-yellow-500",
  "final_week": "bg-orange-500",
  "completed": "bg-green-600",
  "cancelled": "bg-red-500"
}

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
}

export default function MasterAdminPanel() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("speakers")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // Data states
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [realTimeData, setRealTimeData] = useState<any>(null)
  
  // Loading states
  const [speakersLoading, setSpeakersLoading] = useState(true)
  const [dealsLoading, setDealsLoading] = useState(true)
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  
  // Filter states
  const [speakerSearch, setSpeakerSearch] = useState("")
  const [speakerActiveFilter, setSpeakerActiveFilter] = useState("all")
  const [speakerFeaturedFilter, setSpeakerFeaturedFilter] = useState("all")
  
  const [dealSearch, setDealSearch] = useState("")
  const [dealStatusFilter, setDealStatusFilter] = useState("all")
  
  const [projectSearch, setProjectSearch] = useState("")
  const [projectStatusFilter, setProjectStatusFilter] = useState("all")

  // Check authentication
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
    
    // Load all data
    loadSpeakers()
    loadDeals()
    loadProjects()
    loadAnalytics()
  }, [router])

  const loadSpeakers = async () => {
    try {
      setSpeakersLoading(true)
      const response = await fetch("/api/admin/speakers")
      if (response.ok) {
        const data = await response.json()
        setSpeakers(data.speakers || [])
      }
    } catch (error) {
      console.error("Error loading speakers:", error)
      toast({
        title: "Error",
        description: "Failed to load speakers",
        variant: "destructive",
      })
    } finally {
      setSpeakersLoading(false)
    }
  }

  const loadDeals = async () => {
    try {
      setDealsLoading(true)
      const response = await fetch("/api/deals")
      if (response.ok) {
        const data = await response.json()
        setDeals(Array.isArray(data) ? data : data.deals || [])
      }
    } catch (error) {
      console.error("Error loading deals:", error)
      toast({
        title: "Error",
        description: "Failed to load deals",
        variant: "destructive",
      })
    } finally {
      setDealsLoading(false)
    }
  }

  const loadProjects = async () => {
    try {
      setProjectsLoading(true)
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(Array.isArray(data) ? data : data.projects || [])
      }
    } catch (error) {
      console.error("Error loading projects:", error)
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      })
    } finally {
      setProjectsLoading(false)
    }
  }

  const loadAnalytics = async () => {
    try {
      setAnalyticsLoading(true)
      
      // Load overview data
      const overviewResponse = await fetch("/api/analytics/overview?days=30")
      if (overviewResponse.ok) {
        const overviewData = await overviewResponse.json()
        setAnalyticsData(overviewData.data)
      }
      
      // Load real-time data
      const realTimeResponse = await fetch("/api/analytics/realtime")
      if (realTimeResponse.ok) {
        const realTimeData = await realTimeResponse.json()
        setRealTimeData(realTimeData.data)
      }
    } catch (error) {
      console.error("Error loading analytics:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      })
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // Filter functions
  const filteredSpeakers = speakers.filter((speaker) => {
    const matchesSearch = speaker.name.toLowerCase().includes(speakerSearch.toLowerCase()) ||
      speaker.email.toLowerCase().includes(speakerSearch.toLowerCase()) ||
      speaker.topics.some(topic => topic.toLowerCase().includes(speakerSearch.toLowerCase()))
    
    const matchesActive = speakerActiveFilter === "all" || 
      (speakerActiveFilter === "active" && speaker.active) ||
      (speakerActiveFilter === "inactive" && !speaker.active)
    
    const matchesFeatured = speakerFeaturedFilter === "all" ||
      (speakerFeaturedFilter === "featured" && speaker.featured) ||
      (speakerFeaturedFilter === "not-featured" && !speaker.featured)
    
    return matchesSearch && matchesActive && matchesFeatured
  })

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch = deal.client_name.toLowerCase().includes(dealSearch.toLowerCase()) ||
      deal.company.toLowerCase().includes(dealSearch.toLowerCase()) ||
      deal.event_title.toLowerCase().includes(dealSearch.toLowerCase())
    
    const matchesStatus = dealStatusFilter === "all" || deal.status === dealStatusFilter
    
    return matchesSearch && matchesStatus
  })

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.project_name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      project.client_name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      (project.company && project.company.toLowerCase().includes(projectSearch.toLowerCase()))
    
    const matchesStatus = projectStatusFilter === "all" || project.status === projectStatusFilter
    
    return matchesSearch && matchesStatus
  })

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  // Calculate stats
  const speakerStats = {
    total: speakers.length,
    active: speakers.filter(s => s.active).length,
    featured: speakers.filter(s => s.featured).length,
    withVideos: speakers.filter(s => s.videos && s.videos.length > 0).length
  }

  const dealStats = {
    total: deals.length,
    totalValue: deals.reduce((sum, deal) => sum + deal.deal_value, 0),
    wonDeals: deals.filter(d => d.status === "won").length,
    pipelineValue: deals.filter(d => !["won", "lost"].includes(d.status)).reduce((sum, deal) => sum + deal.deal_value, 0)
  }

  const projectStats = {
    total: projects.length,
    active: projects.filter(p => !["completed", "cancelled"].includes(p.status)).length,
    completed: projects.filter(p => p.status === "completed").length,
    totalBudget: projects.reduce((sum, project) => sum + project.budget, 0)
  }

  const analyticsStats = {
    totalPageViews: analyticsData?.overview?.total_page_views || 0,
    uniqueVisitors: analyticsData?.overview?.unique_visitors || 0,
    activeVisitors: realTimeData?.stats?.active_visitors || 0,
    avgDuration: analyticsData?.overview?.avg_duration || 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Master Admin Panel</h1>
              <p className="mt-2 text-gray-600">Manage speakers, deals, and projects from one place</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className={`cursor-pointer transition-all ${activeTab === 'speakers' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`} 
                onClick={() => setActiveTab('speakers')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Speakers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{speakerStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {speakerStats.active} active • {speakerStats.featured} featured
              </p>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer transition-all ${activeTab === 'deals' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
                onClick={() => setActiveTab('deals')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deals</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dealStats.total}</div>
              <p className="text-xs text-muted-foreground">
                ${(dealStats.pipelineValue / 1000).toFixed(0)}K pipeline • {dealStats.wonDeals} won
              </p>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer transition-all ${activeTab === 'projects' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
                onClick={() => setActiveTab('projects')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {projectStats.active} active • {projectStats.completed} completed
              </p>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer transition-all ${activeTab === 'analytics' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
                onClick={() => setActiveTab('analytics')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analytics</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsStats.uniqueVisitors}</div>
              <p className="text-xs text-muted-foreground">
                {analyticsStats.totalPageViews} views • {analyticsStats.activeVisitors} active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="speakers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Speakers ({speakerStats.total})
            </TabsTrigger>
            <TabsTrigger value="deals" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Deals ({dealStats.total})
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Projects ({projectStats.total})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Speakers Tab */}
          <TabsContent value="speakers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Speaker Management</h2>
              <Link href="/admin/speakers">
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Full Speaker Panel
                </Button>
              </Link>
            </div>

            {/* Speaker Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search speakers..."
                        value={speakerSearch}
                        onChange={(e) => setSpeakerSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={speakerActiveFilter} onValueChange={setSpeakerActiveFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Speakers</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={speakerFeaturedFilter} onValueChange={setSpeakerFeaturedFilter}>
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

            {/* Speaker Grid */}
            {speakersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading speakers...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpeakers.slice(0, 9).map((speaker) => (
                  <Card key={speaker.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
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
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredSpeakers.length > 9 && (
              <div className="text-center">
                <Link href="/admin/speakers">
                  <Button variant="outline">
                    View All {filteredSpeakers.length} Speakers
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Deals Tab */}
          <TabsContent value="deals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Deal Management</h2>
              <Link href="/admin/dashboard">
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Full Deals Panel
                </Button>
              </Link>
            </div>

            {/* Deal Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dealStats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${new Intl.NumberFormat('en-US', { 
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0 
                    }).format(dealStats.pipelineValue)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dealStats.wonDeals}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${new Intl.NumberFormat('en-US', { 
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0 
                    }).format(dealStats.totalValue)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deals Kanban */}
            {dealsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading deals...</span>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Deal Pipeline</CardTitle>
                  <CardDescription>Drag and drop deals to update their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <DealsKanban />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Project Management</h2>
              <Link href="/admin/projects">
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Full Projects Panel
                </Button>
              </Link>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projectStats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projectStats.active}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projectStats.completed}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${new Intl.NumberFormat('en-US', { 
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0 
                    }).format(projectStats.totalBudget)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects Kanban */}
            {projectsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading projects...</span>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Project Pipeline</CardTitle>
                  <CardDescription>Track project progress and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectsKanban />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Website Analytics</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={loadAnalytics}>
                  <Activity className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {analyticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading analytics...</span>
              </div>
            ) : (
              <>
                {/* Real-time Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Real-time Overview
                    </CardTitle>
                    <CardDescription>Live visitor activity in the last hour</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {realTimeData?.stats?.active_visitors || 0}
                        </div>
                        <p className="text-sm text-gray-600">Active Visitors</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {realTimeData?.stats?.page_views_last_hour || 0}
                        </div>
                        <p className="text-sm text-gray-600">Page Views (1h)</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                          {realTimeData?.stats?.pages_viewed || 0}
                        </div>
                        <p className="text-sm text-gray-600">Pages Viewed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                      <MousePointer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {new Intl.NumberFormat('en-US').format(analyticsStats.totalPageViews)}
                      </div>
                      <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {new Intl.NumberFormat('en-US').format(analyticsStats.uniqueVisitors)}
                      </div>
                      <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Math.round(analyticsStats.avgDuration / 60)}m
                      </div>
                      <p className="text-xs text-muted-foreground">Average time on site</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {new Intl.NumberFormat('en-US').format(analyticsData?.overview?.total_sessions || 0)}
                      </div>
                      <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Pages and Traffic Sources */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Pages</CardTitle>
                      <CardDescription>Most visited pages in the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analyticsData?.topPages?.slice(0, 5).map((page: any, index: number) => (
                          <div key={page.page_path} className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium truncate">{page.page_path}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{page.views}</p>
                              <p className="text-xs text-gray-500">views</p>
                            </div>
                          </div>
                        )) || (
                          <p className="text-gray-500 text-center py-4">No page data available</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Traffic Sources</CardTitle>
                      <CardDescription>Where your visitors are coming from</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analyticsData?.trafficSources?.slice(0, 5).map((source: any, index: number) => (
                          <div key={source.source} className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium capitalize">{source.source}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{source.visits}</p>
                              <p className="text-xs text-gray-500">visits</p>
                            </div>
                          </div>
                        )) || (
                          <p className="text-gray-500 text-center py-4">No traffic source data available</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Device Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Device Types</CardTitle>
                    <CardDescription>Breakdown of visitor devices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6">
                      {analyticsData?.deviceBreakdown?.map((device: any) => (
                        <div key={device.device_type} className="text-center">
                          <div className="text-2xl font-bold">
                            {device.count}
                          </div>
                          <p className="text-sm text-gray-600 capitalize">{device.device_type}</p>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4 col-span-3">No device data available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Active Pages */}
                {realTimeData?.recentPages && realTimeData.recentPages.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Currently Popular Pages</CardTitle>
                      <CardDescription>Pages with recent activity (last hour)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {realTimeData.recentPages.map((page: any, index: number) => (
                          <div key={page.page_path} className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium truncate">{page.page_path}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary">{page.views} views</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}