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
  CheckSquare
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
  status: "invoicing" | "logistics_planning" | "pre_event" | "event_week" | "completed" | "cancelled"
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
    stage: 1,
    description: "Send invoices (net 30 & final), plan kickoff meeting"
  },
  logistics_planning: { 
    label: "Logistics Planning", 
    color: "bg-purple-500", 
    stage: 2,
    description: "Confirm details, A/V requirements, press pack, calendar, vendor onboarding"
  },
  pre_event: { 
    label: "Pre-Event Ready", 
    color: "bg-yellow-500", 
    stage: 3,
    description: "All logistics confirmed, speaker prepared"
  },
  event_week: { 
    label: "Event Week", 
    color: "bg-orange-500", 
    stage: 4,
    description: "Final preparations and event execution"
  },
  completed: { 
    label: "Completed", 
    color: "bg-green-500", 
    stage: 5,
    description: "Event successfully completed" 
  },
  cancelled: { 
    label: "Cancelled", 
    color: "bg-red-500", 
    stage: 0,
    description: "Project cancelled"
  },
  
  // Legacy status values for backward compatibility
  "2plus_months": { label: "2+ Months Out", color: "bg-blue-500", stage: 1 },
  "1to2_months": { label: "1-2 Months Out", color: "bg-yellow-500", stage: 2 },
  "less_than_month": { label: "Less Than Month", color: "bg-orange-500", stage: 3 },
  "final_week": { label: "Final Week", color: "bg-red-500", stage: 4 },
  planning: { label: "Planning", color: "bg-blue-500", stage: 1 },
  contracts_signed: { label: "Contracts Signed", color: "bg-green-500", stage: 2 }
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
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
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
                                <Badge className={`${config?.color || "bg-gray-500"} text-white`}>
                                  {config?.label || status}
                                </Badge>
                                <span className="text-sm text-gray-600">Stage {config?.stage || 0}</span>
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
                            <Badge className={`${PROJECT_STATUSES[project.status]?.color || "bg-gray-500"} text-white`}>
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
                              <Badge className={`${INVOICE_STATUSES[invoice.status].color} text-white`}>
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Stage 1: Invoicing & Setup */}
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Badge className="bg-blue-500 text-white">Stage 1</Badge>
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

                    {/* Stage 2: Logistics Planning */}
                    <Card className="border-l-4 border-l-purple-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Badge className="bg-purple-500 text-white">Stage 2</Badge>
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

                    {/* Stage 3: Pre-Event Ready */}
                    <Card className="border-l-4 border-l-yellow-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Badge className="bg-yellow-500 text-white">Stage 3</Badge>
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

                    {/* Stage 4: Event Week */}
                    <Card className="border-l-4 border-l-orange-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Badge className="bg-orange-500 text-white">Stage 4</Badge>
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
                      <Card key={project.id} className={`border-l-4 ${PROJECT_STATUSES[project.status]?.color?.replace('bg-', 'border-l-') || 'border-l-gray-500'}`}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{project.event_title}</CardTitle>
                          <CardDescription>{project.client_name}</CardDescription>
                          <Badge className={`${PROJECT_STATUSES[project.status]?.color || "bg-gray-500"} text-white w-fit`}>
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
    </div>
  )
}