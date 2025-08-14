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
  MousePointer,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Link as LinkIcon,
  ExternalLink,
  Download,
  Copy,
  Trash2,
  MoreHorizontal
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { DealsKanban } from "@/components/deals-kanban"
import { ProjectsKanban } from "@/components/projects-kanban"
import { AdminSidebar } from "@/components/admin-sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Proposal } from "@/lib/proposals-db"

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
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [realTimeData, setRealTimeData] = useState<any>(null)
  
  // Loading states
  const [speakersLoading, setSpeakersLoading] = useState(true)
  const [dealsLoading, setDealsLoading] = useState(true)
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [proposalsLoading, setProposalsLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  
  // Filter states
  const [speakerSearch, setSpeakerSearch] = useState("")
  const [speakerActiveFilter, setSpeakerActiveFilter] = useState("all")
  const [speakerFeaturedFilter, setSpeakerFeaturedFilter] = useState("all")
  
  const [dealSearch, setDealSearch] = useState("")
  const [dealStatusFilter, setDealStatusFilter] = useState("all")
  
  const [projectSearch, setProjectSearch] = useState("")
  const [projectStatusFilter, setProjectStatusFilter] = useState("all")
  
  const [proposalSearch, setProposalSearch] = useState("")
  const [proposalStatusFilter, setProposalStatusFilter] = useState("all")

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
    loadProposals()
    loadAnalytics()
  }, [router])

  const loadSpeakers = async () => {
    try {
      setSpeakersLoading(true)
      console.log('Admin: Loading speakers...')
      const response = await fetch("/api/admin/speakers")
      console.log('Admin: Speakers response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Admin: Speakers data received:', { 
          success: data.success, 
          speakerCount: data.speakers?.length || 0,
          firstSpeaker: data.speakers?.[0] || null
        })
        setSpeakers(data.speakers || [])
      } else {
        try {
          const errorData = await response.json()
          console.error('Admin: Speakers API error:', response.status, errorData)
          toast({
            title: "Speakers Loading Error",
            description: `${errorData.error || 'Failed to load speakers'} (${response.status})`,
            variant: "destructive",
          })
        } catch (parseError) {
          const errorText = await response.text()
          console.error('Admin: Speakers API error (non-JSON):', response.status, errorText)
          toast({
            title: "Speakers Loading Error",
            description: `Server error (${response.status}): ${errorText.substring(0, 100)}...`,
            variant: "destructive",
          })
        }
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
      const token = localStorage.getItem("adminSessionToken")
      
      const response = await fetch("/api/deals", {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'x-dev-admin-bypass': 'dev-admin-access'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const dealsArray = Array.isArray(data) ? data : data.deals || []
        console.log('Deals loaded:', dealsArray.length, 'deals')
        console.log('Sample deal:', dealsArray[0])
        setDeals(dealsArray)
      } else {
        const error = await response.json()
        console.error("Deals API error:", error)
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Session expired. Please log in again.",
            variant: "destructive",
          })
          router.push("/admin")
        }
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
      const token = localStorage.getItem("adminSessionToken")
      
      const headers: HeadersInit = {
        'Authorization': token ? `Bearer ${token}` : '',
        'x-dev-admin-bypass': 'dev-admin-access'
      }
      
      console.log('Fetching projects with headers:', headers)
      
      const response = await fetch("/api/projects", { headers })
      
      if (response.ok) {
        const data = await response.json()
        setProjects(Array.isArray(data) ? data : data.projects || [])
      } else {
        const error = await response.json()
        console.error("Projects API error:", error)
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Session expired. Please log in again.",
            variant: "destructive",
          })
          router.push("/admin")
        }
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

  const loadProposals = async () => {
    try {
      setProposalsLoading(true)
      const token = localStorage.getItem("adminSessionToken")
      
      const response = await fetch("/api/proposals", {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'x-dev-admin-bypass': 'dev-admin-access'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setProposals(Array.isArray(data) ? data : [])
      } else {
        const error = await response.json()
        console.error("Proposals API error:", error)
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Session expired. Please log in again.",
            variant: "destructive",
          })
          router.push("/admin")
        }
      }
    } catch (error) {
      console.error("Error loading proposals:", error)
      toast({
        title: "Error",
        description: "Failed to load proposals",
        variant: "destructive",
      })
    } finally {
      setProposalsLoading(false)
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
    console.log('Filtering speaker:', speaker.name, { topics: speaker.topics, active: speaker.active, featured: speaker.featured })
    
    // Handle topics that might be string, array, or null
    let topicsMatch = false
    if (speaker.topics) {
      if (Array.isArray(speaker.topics)) {
        topicsMatch = speaker.topics.some(topic => topic.toLowerCase().includes(speakerSearch.toLowerCase()))
      } else if (typeof speaker.topics === 'string') {
        topicsMatch = speaker.topics.toLowerCase().includes(speakerSearch.toLowerCase())
      }
    }
    
    const matchesSearch = !speakerSearch || 
      speaker.name.toLowerCase().includes(speakerSearch.toLowerCase()) ||
      speaker.email.toLowerCase().includes(speakerSearch.toLowerCase()) ||
      topicsMatch
    
    const matchesActive = speakerActiveFilter === "all" || 
      (speakerActiveFilter === "active" && speaker.active) ||
      (speakerActiveFilter === "inactive" && !speaker.active)
    
    const matchesFeatured = speakerFeaturedFilter === "all" ||
      (speakerFeaturedFilter === "featured" && speaker.featured) ||
      (speakerFeaturedFilter === "not-featured" && !speaker.featured)
    
    const result = matchesSearch && matchesActive && matchesFeatured
    console.log('Filter result for', speaker.name, ':', result, { matchesSearch, matchesActive, matchesFeatured })
    
    return result
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

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch = 
      proposal.client_name.toLowerCase().includes(proposalSearch.toLowerCase()) ||
      (proposal.client_company?.toLowerCase().includes(proposalSearch.toLowerCase()) || false) ||
      proposal.title.toLowerCase().includes(proposalSearch.toLowerCase()) ||
      proposal.proposal_number.toLowerCase().includes(proposalSearch.toLowerCase())
    
    const matchesStatus = proposalStatusFilter === "all" || proposal.status === proposalStatusFilter
    
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
    totalValue: deals.reduce((sum, deal) => sum + (Number(deal.deal_value) || 0), 0),
    wonDeals: deals.filter(d => d.status === "won").length,
    pipelineValue: deals.filter(d => !["won", "lost"].includes(d.status)).reduce((sum, deal) => sum + (Number(deal.deal_value) || 0), 0)
  }
  
  // Log pipeline value for debugging
  console.log('Pipeline value calculation:', {
    totalDeals: deals.length,
    pipelineDeals: deals.filter(d => !["won", "lost"].includes(d.status)).length,
    pipelineValue: dealStats.pipelineValue
  })

  const projectStats = {
    total: projects.length,
    active: projects.filter(p => !["completed", "cancelled"].includes(p.status)).length,
    completed: projects.filter(p => p.status === "completed").length,
    totalBudget: projects.reduce((sum, project) => sum + project.budget, 0)
  }

  const proposalStats = {
    total: proposals.length,
    sent: proposals.filter(p => ["sent", "viewed", "accepted", "rejected"].includes(p.status)).length,
    accepted: proposals.filter(p => p.status === "accepted").length,
    totalValue: proposals
      .filter(p => p.status === "accepted")
      .reduce((sum, p) => sum + p.total_investment, 0),
    conversionRate: proposals.filter(p => ["sent", "viewed", "accepted", "rejected"].includes(p.status)).length > 0 
      ? (proposals.filter(p => p.status === "accepted").length / proposals.filter(p => ["sent", "viewed", "accepted", "rejected"].includes(p.status)).length) * 100 
      : 0
  }

  const analyticsStats = {
    totalPageViews: analyticsData?.overview?.total_page_views || 0,
    uniqueVisitors: analyticsData?.overview?.unique_visitors || 0,
    activeVisitors: realTimeData?.stats?.active_visitors || 0,
    avgDuration: analyticsData?.overview?.avg_duration || 0
  }

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
              <h1 className="text-3xl font-bold text-gray-900">Master Admin Panel</h1>
              <p className="mt-2 text-gray-600">Manage speakers, deals, and projects from one place</p>
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
                ${new Intl.NumberFormat('en-US', { 
                  notation: 'compact',
                  maximumFractionDigits: 1
                }).format(dealStats.pipelineValue)} pipeline • {dealStats.wonDeals} won
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
          <TabsList className="grid w-full grid-cols-5">
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
            <TabsTrigger value="proposals" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Proposals ({proposalStats.total})
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
              <div>
                <div className="mb-4 text-sm text-gray-600">
                  Debug: Total speakers: {speakers.length}, Filtered: {filteredSpeakers.length}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSpeakers.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No speakers found matching current filters</p>
                      <div className="mt-2 text-sm text-gray-400">
                        Search: "{speakerSearch}", Active: {speakerActiveFilter}, Featured: {speakerFeaturedFilter}
                      </div>
                    </div>
                  ) : (
                    filteredSpeakers.slice(0, 9).map((speaker) => (
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
                    ))
                  )}
                </div>
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

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Proposal Management</h2>
              <Button onClick={() => router.push("/admin/proposals/new")}>
                <Plus className="h-4 w-4 mr-2" />
                New Proposal
              </Button>
            </div>

            {/* Proposal Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Proposals</p>
                    <p className="text-2xl font-bold">{proposalStats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Sent</p>
                    <p className="text-2xl font-bold">{proposalStats.sent}</p>
                  </div>
                  <Send className="h-8 w-8 text-blue-400" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Accepted</p>
                    <p className="text-2xl font-bold">{proposalStats.accepted}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold">{proposalStats.conversionRate.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(proposalStats.totalValue)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by client, company, title, or proposal number..."
                  value={proposalSearch}
                  onChange={(e) => setProposalSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={proposalStatusFilter} onValueChange={setProposalStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Proposals Table */}
            <Card>
              {proposalsLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Loading proposals...</p>
                </div>
              ) : filteredProposals.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No proposals found</p>
                  <Button onClick={() => router.push("/admin/proposals/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Proposal
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proposal</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProposals.map((proposal) => (
                      <TableRow key={proposal.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{proposal.proposal_number}</p>
                            <p className="text-sm text-gray-500">{proposal.title}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{proposal.client_name}</p>
                            <p className="text-sm text-gray-500">{proposal.client_company}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{proposal.event_title}</p>
                            {proposal.event_date && (
                              <p className="text-xs text-gray-500">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                {formatDate(proposal.event_date)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(proposal.total_investment)}</TableCell>
                        <TableCell>
                          {(() => {
                            switch (proposal.status) {
                              case "draft":
                                return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Draft</Badge>
                              case "sent":
                                return <Badge className="bg-blue-100 text-blue-800"><Send className="h-3 w-3 mr-1" />Sent</Badge>
                              case "viewed":
                                return <Badge className="bg-purple-100 text-purple-800"><Eye className="h-3 w-3 mr-1" />Viewed</Badge>
                              case "accepted":
                                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Accepted</Badge>
                              case "rejected":
                                return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
                              case "expired":
                                return <Badge variant="secondary" className="bg-gray-100"><Clock className="h-3 w-3 mr-1" />Expired</Badge>
                              default:
                                return null
                            }
                          })()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {proposal.views}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(proposal.created_at)}</TableCell>
                        <TableCell>
                          {proposal.valid_until ? (
                            <span className={new Date(proposal.valid_until) < new Date() ? "text-red-600" : ""}>
                              {formatDate(proposal.valid_until)}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/admin/proposals/${proposal.id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/proposals/${proposal.id}/edit`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={async () => {
                                const link = `${window.location.origin}/proposal/${proposal.access_token}`
                                await navigator.clipboard.writeText(link)
                                toast({
                                  title: "Link copied",
                                  description: "Proposal link copied to clipboard"
                                })
                              }}>
                                <LinkIcon className="h-4 w-4 mr-2" />
                                Copy Link
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => window.open(`/proposal/${proposal.access_token}`, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {proposal.status === "draft" && (
                                <DropdownMenuItem onClick={async () => {
                                  try {
                                    const response = await fetch(`/api/proposals/${proposal.id}/send`, {
                                      method: "POST"
                                    })
                                    if (response.ok) {
                                      await loadProposals()
                                      toast({
                                        title: "Success",
                                        description: "Proposal sent to client"
                                      })
                                    }
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description: "Failed to send proposal",
                                      variant: "destructive"
                                    })
                                  }
                                }}>
                                  <Send className="h-4 w-4 mr-2" />
                                  Send to Client
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
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
    </div>
  )
}