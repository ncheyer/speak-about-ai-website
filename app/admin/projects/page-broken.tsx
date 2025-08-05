"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Eye,
  Edit,
  Target,
  Loader2,
  DollarSign,
  FileText,
  Send,
  Download,
  Receipt,
  Users,
  MapPin,
  Plane,
  Camera,
  Mic,
  RefreshCw,
  CheckSquare,
  Mail,
  Clock as ClockIcon,
  Calendar as CalendarDays,
  Timer,
  Check,
  X,
  AlertCircle
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useToast } from "@/hooks/use-toast"

interface Project {
  id: number
  contract_id?: number
  project_name: string
  client_name: string
  client_email: string
  client_phone?: string
  company?: string
  speaker_name?: string
  speaker_email?: string
  event_title: string
  event_date: string
  event_location: string
  event_type: string
  attendee_count?: number
  status: "invoicing" | "logistics_planning" | "pre_event" | "event_week" | "follow_up" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  budget: number
  invoiced_amount: number
  paid_amount: number
  description?: string
  notes?: string
  created_at: string
  updated_at: string
  
  // Event logistics
  venue_details?: string
  av_requirements?: string
  travel_arrangements?: string
  accommodation_details?: string
  speaker_fee?: number
  expenses_budget?: number
  
  // Timeline milestones
  contracts_due?: string
  speaker_confirmation_due?: string
  av_check_due?: string
  final_details_due?: string
  
  // Stage completion tracking
  stage_completion?: {
    invoicing?: {
      initial_invoice_sent?: boolean
      final_invoice_sent?: boolean
      kickoff_meeting_planned?: boolean
      project_setup_complete?: boolean
    }
    logistics_planning?: {
      details_confirmed?: boolean
      av_requirements_gathered?: boolean
      press_pack_sent?: boolean
      calendar_confirmed?: boolean
      client_contact_obtained?: boolean
      speaker_materials_ready?: boolean
      vendor_onboarding_complete?: boolean
    }
    pre_event?: {
      logistics_confirmed?: boolean
      speaker_prepared?: boolean
      client_materials_sent?: boolean
      ready_for_execution?: boolean
    }
    event_week?: {
      final_preparations_complete?: boolean
      event_executed?: boolean
      support_provided?: boolean
    }
    follow_up?: {
      follow_up_sent?: boolean
      client_feedback_requested?: boolean
      speaker_feedback_requested?: boolean
      lessons_documented?: boolean
    }
  }
}

interface Invoice {
  id: number
  project_id: number
  invoice_number: string
  amount: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  issue_date: string
  due_date: string
  payment_date?: string
  notes?: string
}

const PROJECT_STATUSES = {
  invoicing: { 
    label: "Invoicing & Setup", 
    color: "bg-blue-500", 
    description: "Send invoices (net 30 & final), plan kickoff meeting"
  },
  logistics_planning: { 
    label: "Logistics Planning", 
    color: "bg-purple-500", 
    description: "Confirm details, A/V requirements, press pack, calendar, vendor onboarding"
  },
  pre_event: { 
    label: "Pre-Event Ready", 
    color: "bg-yellow-500", 
    description: "All logistics confirmed, speaker prepared"
  },
  event_week: { 
    label: "Event Week", 
    color: "bg-orange-500", 
    description: "Final preparations and event execution"
  },
  follow_up: { 
    label: "Event Follow-up", 
    color: "bg-indigo-500", 
    description: "Send follow-up communications and request feedback"
  },
  completed: { 
    label: "Completed", 
    color: "bg-green-500", 
    description: "Event successfully completed with all follow-up done" 
  },
  cancelled: { 
    label: "Cancelled", 
    color: "bg-red-500", 
    description: "Project cancelled"
  },
  
  // Legacy status values for backward compatibility
  "2plus_months": { label: "2+ Months Out", color: "bg-blue-500" },
  "1to2_months": { label: "1-2 Months Out", color: "bg-yellow-500" },
  "less_than_month": { label: "Less Than Month", color: "bg-orange-500" },
  "final_week": { label: "Final Week", color: "bg-red-500" },
  planning: { label: "Planning", color: "bg-blue-500" },
  contracts_signed: { label: "Contracts Signed", color: "bg-green-500" }
}

const INVOICE_STATUSES = {
  draft: { label: "Draft", color: "bg-gray-500" },
  sent: { label: "Sent", color: "bg-blue-500" },
  paid: { label: "Paid", color: "bg-green-500" },
  overdue: { label: "Overdue", color: "bg-red-500" },
  cancelled: { label: "Cancelled", color: "bg-gray-400" }
}

export default function EnhancedProjectManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const [projectsResponse, invoicesResponse] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/invoices")
      ])

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData)
      }

      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json()
        setInvoices(invoicesData)
      }
    } catch (error) {
      console.error("Error loading project data:", error)
      toast({
        title: "Error",
        description: "Failed to load project data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getTimeUntilEvent = (eventDate: string) => {
    const now = new Date()
    const event = new Date(eventDate)
    const diffTime = event.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days ago`, color: "text-red-600", urgency: "past" }
    } else if (diffDays === 0) {
      return { text: "Today", color: "text-red-600", urgency: "today" }
    } else if (diffDays === 1) {
      return { text: "Tomorrow", color: "text-orange-600", urgency: "urgent" }
    } else if (diffDays <= 7) {
      return { text: `${diffDays} days`, color: "text-orange-600", urgency: "urgent" }
    } else if (diffDays <= 30) {
      return { text: `${diffDays} days`, color: "text-yellow-600", urgency: "soon" }
    } else {
      return { text: `${diffDays} days`, color: "text-green-600", urgency: "future" }
    }
  }

  const handleUpdateStageCompletion = async (projectId: number, stage: string, task: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/stage-completion`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage,
          task,
          completed
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Task ${completed ? "completed" : "unmarked"}"
        })
        loadData()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to update task",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error updating stage completion:", error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      })
    }
  }

  const handleCreateInvoice = async (projectId: number, amount: number) => {
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          amount: amount,
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Invoice created successfully"
        })
        loadData()
        setShowCreateInvoice(false)
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to create invoice",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error creating invoice:", error)
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive"
      })
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.event_title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!isLoggedIn) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading project data...</span>
      </div>
    )
  }

  // Calculate statistics
  const activeProjects = projects.filter(p => !["completed", "cancelled"].includes(p.status))
  const completedProjects = projects.filter(p => p.status === "completed")
  const totalRevenue = projects.reduce((sum, p) => sum + p.paid_amount, 0)
  const pendingRevenue = projects.reduce((sum, p) => sum + (p.invoiced_amount - p.paid_amount), 0)
  const overdueInvoices = invoices.filter(i => i.status === "overdue").length

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
              <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
              <p className="mt-2 text-gray-600">Manage live projects, invoicing, and event logistics</p>
            </div>
            <div className="flex gap-4">
              <Button onClick={loadData} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={() => setShowCreateInvoice(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeProjects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedProjects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${new Intl.NumberFormat('en-US').format(totalRevenue)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
                <Receipt className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  ${new Intl.NumberFormat('en-US').format(pendingRevenue)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{overdueInvoices}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-3xl">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
              <TabsTrigger value="logistics">Logistics</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Stages Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Stages</CardTitle>
                    <CardDescription>Current project distribution by stage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(PROJECT_STATUSES)
                        .filter(([status]) => !["2plus_months", "1to2_months", "less_than_month", "final_week", "planning", "contracts_signed"].includes(status))
                        .map(([status, config]) => {
                        const count = projects.filter(p => p.status === status).length
                        return (
                          <div key={status} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge className={(config?.color || "bg-gray-500") + " text-white"}>
                                  {config?.label || status}
                                </Badge>
                              </div>
                              <span className="font-semibold">{count}</span>
                            </div>
                            {config?.description && (
                              <p className="text-xs text-gray-500 ml-2">{config.description}</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Deadlines */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                    <CardDescription>Critical dates approaching</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activeProjects
                        .filter(p => p.event_date)
                        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
                        .slice(0, 5)
                        .map((project) => (
                          <div key={project.id} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{project.event_title}</div>
                              <div className="text-sm text-gray-500">{project.client_name}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {new Date(project.event_date).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {Math.ceil((new Date(project.event_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-6">
              {/* Time Until Event Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Timeline Overview</CardTitle>
                  <CardDescription>Time remaining until events and completion status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeProjects
                      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
                      .map((project) => {
                        const timeInfo = getTimeUntilEvent(project.event_date)
                        const stageCompletion = project.stage_completion || {}
                        const currentStageData = PROJECT_STATUSES[project.status]
                        
                        return (
                          <Card key={project.id} className={"border-l-4 " + (currentStageData?.color?.replace('bg-', 'border-l-') || 'border-l-gray-500')}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{project.event_title}</CardTitle>
                                <Badge className={timeInfo.color + " bg-opacity-10 border-current"}>
                                  <Timer className="h-3 w-3 mr-1" />
                                  {timeInfo.text}
                                </Badge>
                              </div>
                              <CardDescription className="flex items-center gap-2">
                                <span>{project.client_name}</span>
                                <Badge className={(currentStageData?.color || "bg-gray-500") + " text-white text-xs"}>
                                  {currentStageData?.label || project.status}
                                </Badge>
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center gap-2 text-sm">
                                <CalendarDays className="h-4 w-4 text-gray-500" />
                                {new Date(project.event_date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                {project.event_location}
                              </div>
                              
                              {/* Stage Progress */}
                              <div className="pt-2">
                                <div className="text-sm font-medium mb-2">Stage Progress</div>
                                <div className="space-y-1">
                                  {Object.entries(PROJECT_STATUSES)
                                    .filter(([status]) => !["2plus_months", "1to2_months", "less_than_month", "final_week", "planning", "contracts_signed", "cancelled"].includes(status))
                                    .map(([status, config]) => {
                                      const isCurrentStage = project.status === status
                                      const isCompleted = ["invoicing", "logistics_planning", "pre_event", "event_week", "follow_up"].indexOf(status) < ["invoicing", "logistics_planning", "pre_event", "event_week", "follow_up"].indexOf(project.status)
                                      
                                      return (
                                        <div key={status} className={"flex items-center gap-2 text-xs p-1 rounded " + (isCurrentStage ? 'bg-blue-50' : '')}>
                                          {isCompleted ? (
                                            <Check className="h-3 w-3 text-green-500" />
                                          ) : isCurrentStage ? (
                                            <ClockIcon className="h-3 w-3 text-blue-500" />
                                          ) : (
                                            <div className="h-3 w-3 rounded-full border border-gray-300" />
                                          )}
                                          <span className={isCurrentStage ? 'font-medium' : ''}>{config?.label}</span>
                                        </div>
                                      )
                                    })}
                                </div>
                              </div>
                              
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full"
                                onClick={() => setSelectedProject(project)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Manage Tasks
                              </Button>
                            </CardContent>
                          </Card>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search projects..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="invoicing">Invoicing & Setup</SelectItem>
                        <SelectItem value="logistics_planning">Logistics Planning</SelectItem>
                        <SelectItem value="pre_event">Pre-Event Ready</SelectItem>
                        <SelectItem value="event_week">Event Week</SelectItem>
                        <SelectItem value="follow_up">Event Follow-up</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Projects Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Projects</CardTitle>
                  <CardDescription>
                    Showing {filteredProjects.length} of {projects.length} projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{project.event_title}</div>
                              <div className="text-sm text-gray-500">{project.event_location}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{project.client_name}</div>
                              <div className="text-sm text-gray-500">{project.company}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={(PROJECT_STATUSES[project.status]?.color || "bg-gray-500") + " text-white"}>
                              {PROJECT_STATUSES[project.status]?.label || project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(project.event_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                ${new Intl.NumberFormat('en-US').format(project.paid_amount)}
                              </div>
                              <div className="text-sm text-gray-500">
                                of ${new Intl.NumberFormat('en-US').format(project.budget)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedProject(project)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCreateInvoice(project.id, project.budget - project.invoiced_amount)}
                              >
                                <Receipt className="h-4 w-4 mr-1" />
                                Invoice
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Invoicing Tab */}
            <TabsContent value="invoicing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Management</CardTitle>
                  <CardDescription>Track and manage project invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => {
                        const project = projects.find(p => p.id === invoice.project_id)
                        return (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-mono">
                              {invoice.invoice_number}
                            </TableCell>
                            <TableCell>
                              {project?.event_title || "Unknown Project"}
                            </TableCell>
                            <TableCell>
                              {project?.client_name || "Unknown Client"}
                            </TableCell>
                            <TableCell>
                              ${new Intl.NumberFormat('en-US').format(invoice.amount)}
                            </TableCell>
                            <TableCell>
                              <Badge className={INVOICE_STATUSES[invoice.status].color + " text-white"}>
                                {INVOICE_STATUSES[invoice.status].label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(invoice.due_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Logistics Tab */}
            <TabsContent value="logistics" className="space-y-6">
              {/* Stage Workflow Guide */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Workflow Guide</CardTitle>
                  <CardDescription>Detailed checklist for each project stage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Invoicing & Setup */}
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          Invoicing & Setup
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Send initial invoice (Net 30)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Send final invoice</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Plan kickoff meeting</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Initial project setup</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Logistics Planning */}
                    <Card className="border-l-4 border-l-purple-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          Logistics Planning
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Confirm all logistical details</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Get A/V requirements</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Send press pack to client</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Confirm event times in speaker's calendar</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Get client's contact number</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Ensure everything is on-hand for speaker</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Fill out vendor onboarding (if necessary)</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pre-Event Ready */}
                    <Card className="border-l-4 border-l-yellow-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          Pre-Event Ready
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>All logistics confirmed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Speaker fully prepared</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Client has all materials</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Ready for event execution</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Event Week */}
                    <Card className="border-l-4 border-l-orange-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          Event Week
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span>Final preparations</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span>Event execution</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span>Real-time support</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Event Follow-up */}
                    <Card className="border-l-4 border-l-indigo-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          Event Follow-up
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-indigo-500" />
                            <span>Send event follow-up</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-indigo-500" />
                            <span>Request feedback from client</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-indigo-500" />
                            <span>Request feedback from speaker</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Document lessons learned</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Completed */}
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          Completed
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Event successfully delivered</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>All follow-up completed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Feedback collected</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Project archived</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Active Projects Logistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Projects - Logistics Overview</CardTitle>
                  <CardDescription>Current project status and logistics management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeProjects.map((project) => (
                      <Card key={project.id} className={"border-l-4 " + (PROJECT_STATUSES[project.status]?.color?.replace('bg-', 'border-l-') || 'border-l-gray-500')}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{project.event_title}</CardTitle>
                          <CardDescription>{project.client_name}</CardDescription>
                          <Badge className={(PROJECT_STATUSES[project.status]?.color || "bg-gray-500") + " text-white w-fit"}>
                            {PROJECT_STATUSES[project.status]?.label || project.status}
                          </Badge>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            {new Date(project.event_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            {project.event_location}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-gray-500" />
                            {project.attendee_count || "TBD"} attendees
                          </div>
                          <div className="pt-2 space-x-2">
                            <Button size="sm" variant="outline">
                              <Plane className="h-4 w-4 mr-1" />
                              Travel
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mic className="h-4 w-4 mr-1" />
                              A/V
                            </Button>
                            <Button size="sm" variant="outline">
                              <Camera className="h-4 w-4 mr-1" />
                              Media
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Project Task Management Dialog */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Task Management - {selectedProject.event_title}</DialogTitle>
              <DialogDescription>
                Manage stage completion for {selectedProject.client_name} ({new Date(selectedProject.event_date).toLocaleDateString()})
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Time Until Event */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900">Time Until Event</h3>
                    <p className="text-blue-700">{getTimeUntilEvent(selectedProject.event_date).text}</p>
                  </div>
                  <Timer className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              {/* Stage Tasks */}
              <div className="space-y-4">
                {/* Invoicing & Setup */}
                {(selectedProject.status === "invoicing" || ["logistics_planning", "pre_event", "event_week", "follow_up", "completed"].includes(selectedProject.status)) && (
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {["logistics_planning", "pre_event", "event_week", "follow_up", "completed"].includes(selectedProject.status) ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <ClockIcon className="h-5 w-5 text-blue-500" />
                        )}
                        Invoicing & Setup
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { key: "initial_invoice_sent", label: "Send initial invoice (Net 30)" },
                          { key: "final_invoice_sent", label: "Send final invoice" },
                          { key: "kickoff_meeting_planned", label: "Plan kickoff meeting" },
                          { key: "project_setup_complete", label: "Initial project setup" }
                        ].map((task) => (
                          <div key={task.key} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={"invoicing_" + task.key}
                              checked={selectedProject.stage_completion?.invoicing?.[task.key] || false}
                              onChange={(e) => handleUpdateStageCompletion(selectedProject.id, "invoicing", task.key, e.target.checked)}
                              className="h-4 w-4 text-blue-600 rounded border-gray-300"
                            />
                            <label htmlFor={"invoicing_" + task.key} className="text-sm">
                              {task.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Logistics Planning */}
                {(selectedProject.status === "logistics_planning" || ["pre_event", "event_week", "follow_up", "completed"].includes(selectedProject.status)) && (
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {["pre_event", "event_week", "follow_up", "completed"].includes(selectedProject.status) ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <ClockIcon className="h-5 w-5 text-purple-500" />
                        )}
                        Logistics Planning
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { key: "details_confirmed", label: "Confirm all logistical details" },
                          { key: "av_requirements_gathered", label: "Get A/V requirements" },
                          { key: "press_pack_sent", label: "Send press pack to client" },
                          { key: "calendar_confirmed", label: "Confirm event times in speaker's calendar" },
                          { key: "client_contact_obtained", label: "Get client's contact number" },
                          { key: "speaker_materials_ready", label: "Ensure everything is on-hand for speaker" },
                          { key: "vendor_onboarding_complete", label: "Fill out vendor onboarding (if necessary)" }
                        ].map((task) => (
                          <div key={task.key} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={"logistics_" + task.key}
                              checked={selectedProject.stage_completion?.logistics_planning?.[task.key] || false}
                              onChange={(e) => handleUpdateStageCompletion(selectedProject.id, "logistics_planning", task.key, e.target.checked)}
                              className="h-4 w-4 text-purple-600 rounded border-gray-300"
                            />
                            <label htmlFor={"logistics_" + task.key} className="text-sm">
                              {task.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Pre-Event Ready */}
                {(selectedProject.status === "pre_event" || ["event_week", "follow_up", "completed"].includes(selectedProject.status)) && (
                  <Card className="border-l-4 border-l-yellow-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {["event_week", "follow_up", "completed"].includes(selectedProject.status) ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <ClockIcon className="h-5 w-5 text-yellow-500" />
                        )}
                        Pre-Event Ready
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { key: "logistics_confirmed", label: "All logistics confirmed" },
                          { key: "speaker_prepared", label: "Speaker fully prepared" },
                          { key: "client_materials_sent", label: "Client has all materials" },
                          { key: "ready_for_execution", label: "Ready for event execution" }
                        ].map((task) => (
                          <div key={task.key} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={"pre_event_" + task.key}
                              checked={selectedProject.stage_completion?.pre_event?.[task.key] || false}
                              onChange={(e) => handleUpdateStageCompletion(selectedProject.id, "pre_event", task.key, e.target.checked)}
                              className="h-4 w-4 text-yellow-600 rounded border-gray-300"
                            />
                            <label htmlFor={"pre_event_" + task.key} className="text-sm">
                              {task.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Event Week */}
                {(selectedProject.status === "event_week" || ["follow_up", "completed"].includes(selectedProject.status)) && (
                  <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {["follow_up", "completed"].includes(selectedProject.status) ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <ClockIcon className="h-5 w-5 text-orange-500" />
                        )}
                        Event Week
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { key: "final_preparations_complete", label: "Final preparations complete" },
                          { key: "event_executed", label: "Event executed successfully" },
                          { key: "support_provided", label: "Real-time support provided" }
                        ].map((task) => (
                          <div key={task.key} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={"event_week_" + task.key}
                              checked={selectedProject.stage_completion?.event_week?.[task.key] || false}
                              onChange={(e) => handleUpdateStageCompletion(selectedProject.id, "event_week", task.key, e.target.checked)}
                              className="h-4 w-4 text-orange-600 rounded border-gray-300"
                            />
                            <label htmlFor={"event_week_" + task.key} className="text-sm">
                              {task.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Event Follow-up */}
                {(selectedProject.status === "follow_up" || selectedProject.status === "completed") && (
                  <Card className="border-l-4 border-l-indigo-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {selectedProject.status === "completed" ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <ClockIcon className="h-5 w-5 text-indigo-500" />
                        )}
                        Event Follow-up
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { key: "follow_up_sent", label: "Send event follow-up" },
                          { key: "client_feedback_requested", label: "Request feedback from client" },
                          { key: "speaker_feedback_requested", label: "Request feedback from speaker" },
                          { key: "lessons_documented", label: "Document lessons learned" }
                        ].map((task) => (
                          <div key={task.key} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={"follow_up_" + task.key}
                              checked={selectedProject.stage_completion?.follow_up?.[task.key] || false}
                              onChange={(e) => handleUpdateStageCompletion(selectedProject.id, "follow_up", task.key, e.target.checked)}
                              className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                            />
                            <label htmlFor={"follow_up_" + task.key} className="text-sm">
                              {task.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}