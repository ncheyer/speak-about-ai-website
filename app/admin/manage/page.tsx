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
import { Progress } from "@/components/ui/progress"
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
  TrendingDown,
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
  MoreHorizontal,
  Receipt,
  ShoppingCart,
  Wallet,
  PieChart,
  ArrowRight,
  Target,
  AlertCircle,
  Banknote,
  CreditCard,
  FileSignature,
  CalendarDays,
  UserCheck,
  Percent,
  Award,
  Trophy,
  Timer,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { DealsKanban } from "@/components/deals-kanban"
import { ProjectsKanban } from "@/components/projects-kanban"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getPSTTimezoneLabel } from "@/lib/date-utils"
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
  client_phone?: string
  company: string
  event_title: string
  event_date: string
  event_location: string
  event_type?: string
  speaker_requested?: string
  attendee_count: number
  budget_range?: string
  deal_value: number
  travel_required?: boolean
  travel_stipend?: number
  flight_required?: boolean
  hotel_required?: boolean
  travel_notes?: string
  status: "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
  priority: "low" | "medium" | "high" | "urgent"
  source?: string
  notes?: string
  created_at: string
  last_contact?: string
  next_follow_up?: string
  updated_at?: string
  commission_percentage?: number
  commission_amount?: number
  payment_status?: string
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
  speaker_fee?: number
  completion_percentage: number
  start_date: string
  deadline?: string
  event_date?: string
}

interface Invoice {
  id: number
  invoice_number: string
  project_id: number
  project_name?: string
  client_name?: string
  amount: number
  status: "draft" | "sent" | "paid" | "overdue"
  due_date: string
  created_at: string
  type: "deposit" | "final" | "additional"
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

const DEAL_STATUSES = {
  lead: { label: "New Lead", color: "bg-gray-500" },
  qualified: { label: "Qualified", color: "bg-blue-500" },
  proposal: { label: "Proposal Sent", color: "bg-yellow-500" },
  negotiation: { label: "Negotiating", color: "bg-orange-500" },
  won: { label: "Won", color: "bg-green-500" },
  lost: { label: "Lost", color: "bg-red-500" },
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
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  
  // Data states
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [realTimeData, setRealTimeData] = useState<any>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  
  // Loading states
  const [speakersLoading, setSpeakersLoading] = useState(true)
  const [dealsLoading, setDealsLoading] = useState(true)
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [proposalsLoading, setProposalsLoading] = useState(true)
  const [invoicesLoading, setInvoicesLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  
  // Filter states
  const [dealSearch, setDealSearch] = useState("")
  const [dealStatusFilter, setDealStatusFilter] = useState("all")
  
  const [projectSearch, setProjectSearch] = useState("")
  const [projectStatusFilter, setProjectStatusFilter] = useState("all")

  // Data loading functions
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
        // The API returns the deals array directly
        const dealsArray = Array.isArray(data) ? data : (data.deals || [])
        setDeals(dealsArray)
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

  const loadSpeakers = async () => {
    try {
      setSpeakersLoading(true)
      const token = localStorage.getItem("adminSessionToken")
      
      const headers: HeadersInit = {
        'Authorization': token ? `Bearer ${token}` : '',
        'x-dev-admin-bypass': 'dev-admin-access'
      }
      
      const response = await fetch("/api/admin/speakers", { headers })
      
      if (response.ok) {
        const data = await response.json()
        setSpeakers(data.speakers || [])
      }
    } catch (error) {
      console.error("Error loading speakers:", error)
    } finally {
      setSpeakersLoading(false)
    }
  }

  const loadProjects = async () => {
    try {
      setProjectsLoading(true)
      const token = localStorage.getItem("adminSessionToken")
      
      const response = await fetch("/api/projects", {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'x-dev-admin-bypass': 'dev-admin-access'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects(Array.isArray(data) ? data : [])
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
        setProposals(data.proposals || [])
      }
    } catch (error) {
      console.error("Error loading proposals:", error)
    } finally {
      setProposalsLoading(false)
    }
  }

  const loadInvoices = async () => {
    try {
      setInvoicesLoading(true)
      const token = localStorage.getItem("adminSessionToken")
      
      const response = await fetch("/api/invoices", {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'x-dev-admin-bypass': 'dev-admin-access'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setInvoices(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error loading invoices:", error)
    } finally {
      setInvoicesLoading(false)
    }
  }

  const loadAnalytics = async () => {
    try {
      setAnalyticsLoading(true)
      
      // Load overview data
      const overviewResponse = await fetch("/api/analytics/overview?days=30")
      if (overviewResponse.ok) {
        const overviewData = await overviewResponse.json()
        setAnalyticsData(prev => ({ ...prev, overview: overviewData }))
      }

      // Load real-time data
      const realTimeResponse = await fetch("/api/analytics/realtime")
      if (realTimeResponse.ok) {
        const rtData = await realTimeResponse.json()
        setRealTimeData(rtData)
      }
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  // Sync all data and refresh
  const syncAllData = async () => {
    if (isSyncing) return
    
    setIsSyncing(true)
    toast({
      title: "Syncing...",
      description: "Refreshing all data from the server",
    })
    
    try {
      // First sync finance-project data
      const token = localStorage.getItem("adminSessionToken")
      const syncResponse = await fetch("/api/admin/sync-finance", {
        method: "POST",
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'x-dev-admin-bypass': 'dev-admin-access'
        }
      })
      
      if (syncResponse.ok) {
        const syncResult = await syncResponse.json()
        console.log("Sync result:", syncResult)
      }
      
      // Then reload all data in parallel
      await Promise.all([
        loadDeals(),
        loadProjects(),
        loadProposals(),
        loadInvoices(),
        loadSpeakers(),
        loadAnalytics()
      ])
      
      setLastSync(new Date())
      toast({
        title: "Sync Complete",
        description: "All data has been refreshed",
      })
    } catch (error) {
      console.error("Error syncing data:", error)
      toast({
        title: "Sync Failed",
        description: "Failed to sync some data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSyncing(false)
    }
  }
  
  // Check authentication and load data on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return
    }
    
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    
    setIsLoggedIn(true)
    
    // Load all data
    loadDeals()
    loadProjects()
    loadProposals()
    loadInvoices()
    loadSpeakers()
    loadAnalytics()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Auto-sync every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden && !isSyncing) {
        syncAllData()
      }
    }, 5 * 60 * 1000) // 5 minutes
    
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSyncing])
  
  
  // Compute stats - matching CRM tab logic
  // Check for active deals (lead, qualified, proposal, negotiation)
  const activeDeals = deals.filter(d => ["lead", "qualified", "proposal", "negotiation"].includes(d.status))
  
  const dealStats = {
    total: deals.length,
    active: activeDeals.length, // Count lead, qualified, proposal, negotiation as active
    won: deals.filter(d => d.status === "won").length,
    lost: deals.filter(d => d.status === "lost").length,
    totalValue: deals.reduce((sum, d) => sum + (typeof d.deal_value === 'string' ? parseFloat(d.deal_value) || 0 : Number(d.deal_value) || 0), 0),
    wonValue: deals.filter(d => d.status === "won").reduce((sum, d) => sum + (typeof d.deal_value === 'string' ? parseFloat(d.deal_value) || 0 : Number(d.deal_value) || 0), 0),
    pipelineValue: activeDeals.reduce((sum, d) => sum + (typeof d.deal_value === 'string' ? parseFloat(d.deal_value) || 0 : Number(d.deal_value) || 0), 0),
    conversionRate: (() => {
      const wonCount = deals.filter(d => d.status === "won").length
      const closedCount = deals.filter(d => ["won", "lost"].includes(d.status)).length
      return closedCount > 0 ? ((wonCount / closedCount) * 100).toFixed(1) : "0"
    })()
  }

  const projectStats = {
    total: projects.length,
    active: projects.filter(p => !["completed", "cancelled"].includes(p.status)).length,
    completed: projects.filter(p => p.status === "completed").length,
    upcoming: projects.filter(p => {
      if (!p.event_date) return false
      const eventDate = new Date(p.event_date)
      const now = new Date()
      const thirtyDays = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
      return eventDate >= now && eventDate <= thirtyDays
    }).length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    averageCompletion: projects.filter(p => !["completed", "cancelled"].includes(p.status))
      .reduce((sum, p) => sum + p.completion_percentage, 0) / (projects.filter(p => !["completed", "cancelled"].includes(p.status)).length || 1)
  }

  const financialStats = {
    totalRevenue: deals.filter(d => d.status === "won").reduce((sum, d) => {
      const value = typeof d.deal_value === 'string' ? parseFloat(d.deal_value) || 0 : d.deal_value
      return sum + value
    }, 0),
    totalCommission: deals.filter(d => d.status === "won").reduce((sum, d) => {
      const value = typeof d.deal_value === 'string' ? parseFloat(d.deal_value) || 0 : d.deal_value
      const percentage = d.commission_percentage || 20
      const commissionAmount = typeof d.commission_amount === 'string' ? parseFloat(d.commission_amount) || 0 : d.commission_amount || 0
      return sum + (commissionAmount || (value * percentage / 100))
    }, 0),
    pendingPayments: deals.filter(d => d.status === "won" && d.payment_status !== "paid")
      .reduce((sum, d) => {
        const value = typeof d.deal_value === 'string' ? parseFloat(d.deal_value) || 0 : d.deal_value
        const percentage = d.commission_percentage || 20
        const commissionAmount = typeof d.commission_amount === 'string' ? parseFloat(d.commission_amount) || 0 : d.commission_amount || 0
        return sum + (commissionAmount || (value * percentage / 100))
      }, 0),
    averageCommissionRate: 20, // Default or calculated
    monthlyRevenue: deals.filter(d => {
      if (d.status !== "won" || !d.updated_at) return false
      const wonDate = new Date(d.updated_at)
      const now = new Date()
      return wonDate.getMonth() === now.getMonth() && wonDate.getFullYear() === now.getFullYear()
    }).reduce((sum, d) => {
      const value = typeof d.deal_value === 'string' ? parseFloat(d.deal_value) || 0 : d.deal_value
      return sum + value
    }, 0)
  }

  // Get upcoming events
  const upcomingEvents = projects
    .filter(p => p.event_date && new Date(p.event_date) >= new Date())
    .sort((a, b) => new Date(a.event_date!).getTime() - new Date(b.event_date!).getTime())
    .slice(0, 5)

  // Get recent deals
  const recentDeals = deals
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  // Get active proposals
  const activeProposals = proposals
    .filter(p => ["sent", "viewed"].includes(p.status))
    .slice(0, 5)

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    )
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
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Master Panel</h1>
                <p className="mt-2 text-gray-600">Command center for all operations</p>
                <p className="text-sm text-gray-500 mt-1">All times displayed in {getPSTTimezoneLabel()}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={syncAllData}
                  disabled={isSyncing}
                  variant="outline"
                  className="border-gray-300"
                  title={lastSync ? `Last synced: ${lastSync.toLocaleTimeString()}` : 'Never synced'}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync All'}
                </Button>
                <Button 
                  onClick={() => router.push("/admin/crm")} 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Open CRM
                </Button>
                <Button 
                  onClick={() => router.push("/admin/projects")} 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Projects
                </Button>
                <Button 
                  onClick={() => router.push("/admin/finances")} 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Finances
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Revenue Card */}
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialStats.totalRevenue)}</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">This month</p>
                    <p className="text-sm font-semibold text-green-600">
                      {formatCurrency(financialStats.monthlyRevenue)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-yellow-500" />
                    <p className="text-xs text-gray-500">{dealStats.won} deals closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pipeline Card */}
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(dealStats.pipelineValue)}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{dealStats.active} active deals</p>
                    <p className="text-sm font-semibold text-blue-600">{dealStats.conversionRate}% conv</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${dealStats.conversionRate}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Projects Card */}
            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{projectStats.active}</p>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Briefcase className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Progress value={projectStats.averageCompletion} className="flex-1" />
                    <p className="text-xs font-medium">{Math.round(projectStats.averageCompletion)}%</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Timer className="h-3 w-3 text-orange-500" />
                      <p className="text-xs text-gray-500">{projectStats.upcoming} upcoming</p>
                    </div>
                    <p className="text-xs text-green-600">{projectStats.completed} done</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commissions Card */}
            <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Commissions</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialStats.totalCommission)}</p>
                  </div>
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Percent className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">Pending</p>
                    <p className="text-sm font-semibold text-yellow-600">
                      {formatCurrency(financialStats.pendingPayments)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3 text-emerald-500" />
                    <p className="text-xs text-gray-500">Avg {financialStats.averageCommissionRate}% rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white border shadow-sm">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <PieChart className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="crm" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <ShoppingCart className="h-4 w-4" />
                CRM & Sales
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Briefcase className="h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger 
                value="finances" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Wallet className="h-4 w-4" />
                Finances
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Pipeline Summary */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Sales Pipeline</CardTitle>
                      <Button size="sm" variant="ghost" onClick={() => setActiveTab("crm")}>
                        View All <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(DEAL_STATUSES).map(([status, config]) => {
                        const count = deals.filter(d => d.status === status).length
                        const value = deals.filter(d => d.status === status).reduce((sum, d) => sum + d.deal_value, 0)
                        const percentage = deals.length > 0 ? (count / deals.length * 100) : 0
                        
                        return (
                          <div key={status} className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${config.color}`} />
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-medium">{config.label}</p>
                                <p className="text-sm text-gray-600">{count} deals</p>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                            <p className="text-sm font-semibold w-24 text-right">{formatCurrency(value)}</p>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => router.push("/admin/crm")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Deal
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => router.push("/admin/projects/new")}
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        New Project
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => router.push("/admin/proposals/new")}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Create Proposal
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => router.push("/admin/invoicing")}
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Generate Invoice
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => router.push("/admin/contracts-hub")}
                      >
                        <FileSignature className="h-4 w-4 mr-2" />
                        Create Contract
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Upcoming Events</CardTitle>
                      <Badge variant="secondary">{upcomingEvents.length} events</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {upcomingEvents.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
                    ) : (
                      <div className="space-y-3">
                        {upcomingEvents.map((project) => {
                          const daysUntil = Math.ceil((new Date(project.event_date!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                          
                          return (
                            <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{project.project_name}</p>
                                <p className="text-xs text-gray-500">{project.client_name} • {project.company}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{formatDate(project.event_date!)}</p>
                                <Badge 
                                  variant={daysUntil <= 7 ? "destructive" : daysUntil <= 30 ? "secondary" : "outline"}
                                  className="text-xs"
                                >
                                  {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                                </Badge>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Active Proposals */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Active Proposals</CardTitle>
                      <Badge variant="secondary">{activeProposals.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {activeProposals.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">No active proposals</p>
                    ) : (
                      <div className="space-y-2">
                        {activeProposals.map((proposal) => (
                          <div key={proposal.id} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium">{proposal.client_name}</p>
                                <p className="text-xs text-gray-500">{proposal.title}</p>
                              </div>
                              <Badge 
                                variant={proposal.status === "viewed" ? "secondary" : "outline"}
                                className="text-xs"
                              >
                                {proposal.status}
                              </Badge>
                            </div>
                            <p className="text-xs font-medium text-gray-600 mt-1">
                              {formatCurrency(proposal.total_investment)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity and Key Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Deal Activity</CardTitle>
                      <Button size="sm" variant="ghost" onClick={() => router.push("/admin/crm")}>
                        View All <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentDeals.slice(0, 5).map((deal) => (
                        <div key={deal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => router.push("/admin/crm")}>
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${STATUS_COLORS[deal.status]}`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{deal.client_name}</p>
                                <Badge className={`text-xs ${PRIORITY_COLORS[deal.priority]}`}>
                                  {deal.priority}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {deal.company} • {formatCurrency(deal.deal_value)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs">
                              {DEAL_STATUSES[deal.status].label}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(deal.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Key Insights and Alerts */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Insights & Alerts</CardTitle>
                      <RefreshCw className="h-4 w-4 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Conversion Performance */}
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Target className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900">Conversion Rate</p>
                            <p className="text-xs text-blue-700 mt-1">
                              {dealStats.conversionRate}% success rate ({dealStats.won} won / {dealStats.total} total)
                            </p>
                            <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${dealStats.conversionRate}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Urgent Follow-ups */}
                      {deals.filter(d => d.next_follow_up && new Date(d.next_follow_up) <= new Date()).length > 0 && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-red-900">Overdue Follow-ups</p>
                              <p className="text-xs text-red-700 mt-1">
                                {deals.filter(d => d.next_follow_up && new Date(d.next_follow_up) <= new Date()).length} deals require immediate attention
                              </p>
                              <Button size="sm" variant="outline" className="mt-2 text-xs" onClick={() => router.push("/admin/crm")}>
                                View Deals
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Pending Payments */}
                      {financialStats.pendingPayments > 0 && (
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                              <Clock className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-yellow-900">Pending Commissions</p>
                              <p className="text-xs text-yellow-700 mt-1">
                                {formatCurrency(financialStats.pendingPayments)} awaiting payment
                              </p>
                              <Button size="sm" variant="outline" className="mt-2 text-xs" onClick={() => router.push("/admin/finances")}>
                                Review Finances
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Monthly Performance */}
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-900">Monthly Revenue</p>
                            <p className="text-xs text-green-700 mt-1">
                              {formatCurrency(financialStats.monthlyRevenue)} this month
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* CRM Tab */}
            <TabsContent value="crm" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">CRM & Sales Pipeline</h2>
                <Button onClick={() => router.push("/admin/crm")}>
                  <Eye className="mr-2 h-4 w-4" />
                  Open Full CRM
                </Button>
              </div>

              {/* Deal Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Deals</p>
                      <p className="text-2xl font-bold">{dealStats.active}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-blue-400" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Won Deals</p>
                      <p className="text-2xl font-bold text-green-600">{dealStats.won}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pipeline Value</p>
                      <p className="text-2xl font-bold">{formatCurrency(dealStats.pipelineValue)}</p>
                    </div>
                    <Target className="h-8 w-8 text-yellow-400" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Won Value</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(dealStats.wonValue)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-400" />
                  </div>
                </Card>
              </div>

              {/* Deals Kanban */}
              {dealsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Loading deals...</p>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Deal Pipeline</CardTitle>
                    <CardDescription>Drag and drop deals to update their status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DealsKanban onDealClick={(deal) => router.push(`/admin/deals/${deal.id}`)} />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Project Management</h2>
                <Button onClick={() => router.push("/admin/projects")}>
                  <Eye className="mr-2 h-4 w-4" />
                  Open Project Manager
                </Button>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Projects</p>
                      <p className="text-2xl font-bold">{projectStats.active}</p>
                    </div>
                    <Briefcase className="h-8 w-8 text-orange-400" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Upcoming (30d)</p>
                      <p className="text-2xl font-bold">{projectStats.upcoming}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-400" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{projectStats.completed}</p>
                    </div>
                    <CheckSquare className="h-8 w-8 text-green-400" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Budget</p>
                      <p className="text-2xl font-bold">{formatCurrency(projectStats.totalBudget)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-emerald-400" />
                  </div>
                </Card>
              </div>

              {/* Projects Kanban */}
              {projectsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Loading projects...</p>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Project Timeline</CardTitle>
                    <CardDescription>Projects organized by timeline</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProjectsKanban />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Finances Tab */}
            <TabsContent value="finances" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Financial Overview</h2>
                <Button onClick={() => router.push("/admin/finances")}>
                  <Eye className="mr-2 h-4 w-4" />
                  Open Finance Dashboard
                </Button>
              </div>

              {/* Financial Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold">{formatCurrency(financialStats.totalRevenue)}</p>
                    </div>
                    <Banknote className="h-8 w-8 text-green-400" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Commission</p>
                      <p className="text-2xl font-bold">{formatCurrency(financialStats.totalCommission)}</p>
                    </div>
                    <Percent className="h-8 w-8 text-emerald-400" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending Payments</p>
                      <p className="text-2xl font-bold text-yellow-600">{formatCurrency(financialStats.pendingPayments)}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-400" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="text-2xl font-bold">{formatCurrency(financialStats.monthlyRevenue)}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-400" />
                  </div>
                </Card>
              </div>

              {/* Revenue Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium">Closed Won</p>
                          <p className="text-sm font-bold">{formatCurrency(financialStats.totalRevenue)}</p>
                        </div>
                        <Progress value={100} className="h-2 bg-green-100" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium">Pipeline</p>
                          <p className="text-sm font-bold">{formatCurrency(dealStats.pipelineValue)}</p>
                        </div>
                        <Progress value={dealStats.pipelineValue / (financialStats.totalRevenue + dealStats.pipelineValue) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium">Lost Deals</p>
                          <p className="text-sm font-bold text-gray-500">
                            {formatCurrency(deals.filter(d => d.status === "lost").reduce((sum, d) => sum + d.deal_value, 0))}
                          </p>
                        </div>
                        <Progress value={0} className="h-2 bg-red-100" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Commission Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Average Commission Rate</p>
                          <p className="text-xs text-gray-500">Across all deals</p>
                        </div>
                        <p className="text-2xl font-bold">{financialStats.averageCommissionRate}%</p>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Earned Commission</p>
                          <p className="text-xs text-gray-500">Total from won deals</p>
                        </div>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(financialStats.totalCommission)}</p>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Pending Collection</p>
                          <p className="text-xs text-gray-500">Awaiting payment</p>
                        </div>
                        <p className="text-xl font-bold text-yellow-600">{formatCurrency(financialStats.pendingPayments)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Won Deals</CardTitle>
                    <Badge variant="secondary">{dealStats.won} total</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Deal Value</TableHead>
                        <TableHead className="text-right">Commission</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deals
                        .filter(d => d.status === "won")
                        .slice(0, 5)
                        .map((deal) => {
                          const commissionPercentage = deal.commission_percentage || 20
                          const commissionAmount = deal.commission_amount || (deal.deal_value * commissionPercentage / 100)
                          
                          return (
                            <TableRow key={deal.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{deal.client_name}</p>
                                  <p className="text-sm text-gray-500">{deal.company}</p>
                                </div>
                              </TableCell>
                              <TableCell>{deal.event_title}</TableCell>
                              <TableCell>{formatDate(deal.event_date)}</TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(deal.deal_value)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div>
                                  <p className="font-medium">{formatCurrency(commissionAmount)}</p>
                                  <p className="text-sm text-gray-500">{commissionPercentage}%</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                {deal.payment_status === 'paid' ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Paid
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}