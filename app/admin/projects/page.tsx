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
  Trash2,
  AlertCircle
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useToast } from "@/hooks/use-toast"
import { InvoicePDFDialog } from "@/components/invoice-pdf-viewer"

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
  budget: string
  speaker_fee?: string
  spent?: string
  invoice_sent?: boolean
  payment_received?: boolean
  description?: string
  notes?: string
  created_at: string
  updated_at: string
  
  // Event logistics
  venue_details?: string
  av_requirements?: string
  travel_arrangements?: string
  accommodation_details?: string
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
      client_contacts_documented?: boolean
      project_folder_created?: boolean
      internal_team_briefed?: boolean
      event_details_confirmed?: boolean
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
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [selectedInvoiceForPDF, setSelectedInvoiceForPDF] = useState<{id: number, number: string} | null>(null)
  const [newProjectData, setNewProjectData] = useState({
    project_name: "",
    event_date: "",
    client_name: "",
    client_email: "",
    company: "",
    speaker_fee: "",
    event_location: "",
    event_type: "in-person",
    event_classification: "travel" as "virtual" | "local" | "travel",
    travel_required: false,
    travel_stipend: "",
    flight_required: false,
    hotel_required: false,
    travel_notes: "",
    description: ""
  })
  const [invoiceFormData, setInvoiceFormData] = useState({
    project_id: "",
    invoice_type: "",
    amount: "",
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    payment_terms: "net-30",
    notes: ""
  })

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
        fetch("/api/projects", { 
          credentials: 'include',
          headers: {
            'x-dev-admin-bypass': 'dev-admin-access'
          }
        }),
        fetch("/api/invoices", { 
          credentials: 'include',
          headers: {
            'x-dev-admin-bypass': 'dev-admin-access'
          }
        })
      ])

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData)
      }

      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json()
        setInvoices(invoicesData)
      } else {
        // Handle case where invoices API is not working yet
        console.log("Invoices API not available yet, using empty array")
        setInvoices([])
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

  const formatEventDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return date.toLocaleDateString()
    } catch {
      return 'N/A'
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
        headers: { 
          "Content-Type": "application/json",
          'x-dev-admin-bypass': 'dev-admin-access'
        },
        credentials: 'include',
        body: JSON.stringify({
          stage,
          task,
          completed
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Task ${completed ? "completed" : "unmarked"}`
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
        headers: { 
          "Content-Type": "application/json",
          'x-dev-admin-bypass': 'dev-admin-access'
        },
        credentials: 'include',
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

  const handleCreateProject = async () => {
    try {
      // Validate required fields
      if (!newProjectData.project_name || !newProjectData.event_date || !newProjectData.client_name || 
          !newProjectData.client_email || !newProjectData.company || !newProjectData.speaker_fee ||
          !newProjectData.event_location || !newProjectData.event_type) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        })
        return
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'x-dev-admin-bypass': 'dev-admin-access'
        },
        credentials: 'include',
        body: JSON.stringify({
          project_name: newProjectData.project_name,
          event_date: newProjectData.event_date,
          client_name: newProjectData.client_name,
          client_email: newProjectData.client_email,
          company: newProjectData.company,
          speaker_fee: parseFloat(newProjectData.speaker_fee),
          budget: parseFloat(newProjectData.speaker_fee), // Set budget same as speaker fee
          event_location: newProjectData.event_location,
          event_type: newProjectData.event_type,
          event_classification: newProjectData.event_classification,
          description: newProjectData.description,
          project_type: newProjectData.event_type,
          status: "invoicing", // Will be set automatically by backend
          priority: "medium",
          start_date: new Date().toISOString(),
          spent: 0,
          completion_percentage: 0,
          travel_required: newProjectData.travel_required,
          travel_expenses_amount: parseFloat(newProjectData.travel_stipend) || 0,
          flight_required: newProjectData.flight_required,
          accommodation_required: newProjectData.hotel_required,
          additional_notes: newProjectData.travel_notes,
          contract_signed: true // Assuming contract is signed when creating project
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Project created successfully"
        })
        setShowCreateProject(false)
        setNewProjectData({
          project_name: "",
          event_date: "",
          client_name: "",
          client_email: "",
          company: "",
          speaker_fee: "",
          event_location: "",
          event_type: "in-person",
          event_classification: "travel",
          travel_required: false,
          travel_stipend: "",
          flight_required: false,
          hotel_required: false,
          travel_notes: "",
          description: ""
        })
        loadData()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to create project",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive"
      })
    }
  }

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          'x-dev-admin-bypass': 'dev-admin-access'
        },
        credentials: 'include'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Project deleted successfully"
        })
        loadData()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete project",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      })
    }
  }

  const handleCreateNewInvoice = async () => {
    try {
      // Validate form
      if (!invoiceFormData.project_id || !invoiceFormData.amount) {
        toast({
          title: "Validation Error",
          description: "Please select a project and enter an amount",
          variant: "destructive"
        })
        return
      }

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'x-dev-admin-bypass': 'dev-admin-access'
        },
        credentials: 'include',
        body: JSON.stringify({
          project_id: parseInt(invoiceFormData.project_id),
          amount: parseFloat(invoiceFormData.amount),
          due_date: invoiceFormData.due_date,
          notes: invoiceFormData.notes || `Payment terms: ${invoiceFormData.payment_terms}`,
          status: "sent" // Automatically mark as sent
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Invoice created successfully"
        })
        // Reset form
        setInvoiceFormData({
          project_id: "",
          invoice_type: "",
          amount: "",
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          payment_terms: "net-30",
          notes: ""
        })
        loadData()
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

  const handleInvoiceTypeChange = (value: string, projectId: string) => {
    if (!projectId) return
    
    const project = projects.find(p => p.id.toString() === projectId)
    if (!project) return
    
    const speakerFee = parseFloat(project.speaker_fee || project.budget || "0")
    const travelExpenses = parseFloat(project.travel_expenses_amount || "0")
    const totalAmount = speakerFee + travelExpenses
    let amount = ""
    
    switch (value) {
      case "initial":
        amount = (totalAmount * 0.5).toString()
        break
      case "final":
        amount = (totalAmount * 0.5).toString()
        break
      case "full":
        amount = totalAmount.toString()
        break
      case "full-speaker-only":
        amount = speakerFee.toString()
        break
      case "travel-only":
        amount = travelExpenses.toString()
        break
      case "custom":
        amount = ""
        break
    }
    
    setInvoiceFormData({
      ...invoiceFormData,
      invoice_type: value,
      amount: amount
    })
  }

  const handleUpdateInvoiceStatus = async (invoiceId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          'x-dev-admin-bypass': 'dev-admin-access'
        },
        credentials: 'include',
        body: JSON.stringify({
          status: newStatus,
          payment_date: newStatus === "paid" ? new Date().toISOString() : null
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Invoice marked as ${newStatus}`
        })
        loadData()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to update invoice",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error updating invoice:", error)
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive"
      })
    }
  }

  const handleDeleteInvoice = async (invoiceId: number) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return
    
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "DELETE",
        headers: { 
          'x-dev-admin-bypass': 'dev-admin-access'
        },
        credentials: 'include'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Invoice deleted successfully"
        })
        loadData()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete invoice",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error deleting invoice:", error)
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive"
      })
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      (project.project_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (project.client_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (project.event_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (project.event_title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (project.event_location?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (project.requested_speaker_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    
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
  const totalRevenue = projects.reduce((sum, p) => {
    // If payment_received is true, count the speaker_fee as revenue
    return sum + (p.payment_received ? parseFloat(p.speaker_fee || p.budget || "0") : 0)
  }, 0)
  const pendingRevenue = projects.reduce((sum, p) => {
    // If payment not received and project is active (not completed/cancelled), it's pending revenue
    if (!p.payment_received && !["completed", "cancelled"].includes(p.status)) {
      return sum + parseFloat(p.speaker_fee || p.budget || "0")
    }
    return sum
  }, 0)
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
            <TabsList className="grid w-full grid-cols-6 max-w-4xl">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
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
                              <div className="font-medium">{project.event_name || project.event_title || project.project_name}</div>
                              <div className="text-sm text-gray-500">{project.client_name}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {formatEventDate(project.event_date)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {getTimeUntilEvent(project.event_date).text}
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
                                <CardTitle className="text-lg">{project.event_name || project.event_title || project.project_name}</CardTitle>
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
                                {formatEventDate(project.event_date)}
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
              {/* Filters and Actions */}
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
                    <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          New Project
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Create New Project</DialogTitle>
                          <DialogDescription>Add a new event project to the system</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="new-project-name">Project Name *</Label>
                              <Input 
                                id="new-project-name" 
                                placeholder="Event name or project title"
                                value={newProjectData.project_name}
                                onChange={(e) => setNewProjectData({...newProjectData, project_name: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-event-date">Event Date *</Label>
                              <Input 
                                id="new-event-date" 
                                type="date"
                                value={newProjectData.event_date}
                                onChange={(e) => setNewProjectData({...newProjectData, event_date: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="new-client-name">Client Name *</Label>
                              <Input 
                                id="new-client-name" 
                                placeholder="Client full name"
                                value={newProjectData.client_name}
                                onChange={(e) => setNewProjectData({...newProjectData, client_name: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-client-email">Client Email *</Label>
                              <Input 
                                id="new-client-email" 
                                type="email" 
                                placeholder="client@example.com"
                                value={newProjectData.client_email}
                                onChange={(e) => setNewProjectData({...newProjectData, client_email: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="new-company">Company *</Label>
                              <Input 
                                id="new-company" 
                                placeholder="Client company name"
                                value={newProjectData.company}
                                onChange={(e) => setNewProjectData({...newProjectData, company: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-speaker-fee">Speaker Fee *</Label>
                              <Input 
                                id="new-speaker-fee" 
                                type="number" 
                                placeholder="25000"
                                value={newProjectData.speaker_fee}
                                onChange={(e) => setNewProjectData({...newProjectData, speaker_fee: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="new-event-location">Event Location *</Label>
                              <Input 
                                id="new-event-location" 
                                placeholder="City, State/Country"
                                value={newProjectData.event_location}
                                onChange={(e) => setNewProjectData({...newProjectData, event_location: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="new-event-type">Event Type *</Label>
                              <Select value={newProjectData.event_type} onValueChange={(value) => setNewProjectData({...newProjectData, event_type: value})}>
                                <SelectTrigger id="new-event-type">
                                  <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Keynote">Keynote</SelectItem>
                                  <SelectItem value="Workshop">Workshop</SelectItem>
                                  <SelectItem value="Panel">Panel</SelectItem>
                                  <SelectItem value="Conference">Conference</SelectItem>
                                  <SelectItem value="Corporate Event">Corporate Event</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          {/* Event Format and Travel */}
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="new-event-format">Event Format *</Label>
                                <Select 
                                  value={newProjectData.event_classification} 
                                  onValueChange={(value: "virtual" | "local" | "travel") => {
                                    setNewProjectData({
                                      ...newProjectData, 
                                      event_classification: value,
                                      travel_required: value === "travel",
                                      flight_required: value === "travel",
                                      hotel_required: value === "travel"
                                    })
                                  }}
                                >
                                  <SelectTrigger id="new-event-format">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="virtual">Virtual</SelectItem>
                                    <SelectItem value="local">Local (No Travel)</SelectItem>
                                    <SelectItem value="travel">Travel Required</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              {newProjectData.event_classification === "travel" && (
                                <div>
                                  <Label htmlFor="new-travel-stipend">Travel Stipend ($)</Label>
                                  <Input 
                                    id="new-travel-stipend" 
                                    type="number" 
                                    placeholder="0"
                                    value={newProjectData.travel_stipend}
                                    onChange={(e) => setNewProjectData({...newProjectData, travel_stipend: e.target.value})}
                                  />
                                </div>
                              )}
                            </div>
                            
                            {newProjectData.event_classification === "travel" && (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="new-flight-required"
                                    className="rounded"
                                    checked={newProjectData.flight_required}
                                    onChange={(e) => setNewProjectData({...newProjectData, flight_required: e.target.checked})}
                                  />
                                  <Label htmlFor="new-flight-required">Flight Required</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="new-hotel-required"
                                    className="rounded"
                                    checked={newProjectData.hotel_required}
                                    onChange={(e) => setNewProjectData({...newProjectData, hotel_required: e.target.checked})}
                                  />
                                  <Label htmlFor="new-hotel-required">Hotel Required</Label>
                                </div>
                              </div>
                            )}
                            
                            {newProjectData.event_classification === "travel" && (
                              <div>
                                <Label htmlFor="new-travel-notes">Travel Notes</Label>
                                <Textarea
                                  id="new-travel-notes"
                                  placeholder="Special travel requirements, preferences, or notes..."
                                  rows={2}
                                  value={newProjectData.travel_notes}
                                  onChange={(e) => setNewProjectData({...newProjectData, travel_notes: e.target.value})}
                                />
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="new-description">Description</Label>
                            <Textarea 
                              id="new-description" 
                              placeholder="Event details, special requirements, notes..."
                              rows={4}
                              value={newProjectData.description}
                              onChange={(e) => setNewProjectData({...newProjectData, description: e.target.value})}
                            />
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-6">
                            <Button variant="outline" type="button" onClick={() => setShowCreateProject(false)}>
                              Cancel
                            </Button>
                            <Button type="button" onClick={handleCreateProject}>
                              <Plus className="h-4 w-4 mr-2" />
                              Create Project
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
                        <TableHead>Speaker</TableHead>
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
                              <div className="font-medium">{project.event_name || project.event_title || project.project_name}</div>
                              <div className="text-sm text-gray-500">
                                {project.event_location || "Location TBD"}
                                {project.event_classification && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {project.event_classification === "virtual" ? "Virtual" : 
                                     project.event_classification === "local" ? "Local" : "Travel"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{project.client_name}</div>
                              <div className="text-sm text-gray-500">{project.company}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mic className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {project.requested_speaker_name || "TBD"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={(PROJECT_STATUSES[project.status]?.color || "bg-gray-500") + " text-white"}>
                              {PROJECT_STATUSES[project.status]?.label || project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {project.event_date ? new Date(project.event_date + 'T00:00:00').toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                ${new Intl.NumberFormat('en-US').format(project.payment_received ? parseFloat(project.speaker_fee || project.budget || "0") : 0)}
                              </div>
                              <div className="text-sm text-gray-500">
                                of ${new Intl.NumberFormat('en-US').format(parseFloat(project.speaker_fee || project.budget || "0"))}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedProject(project)}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                                title="Edit Project"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCreateInvoice(project.id, parseFloat(project.speaker_fee || project.budget || "0"))}
                              >
                                <Receipt className="h-4 w-4 mr-1" />
                                Invoice
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteProject(project.id)}
                                title="Delete Project"
                              >
                                <Trash2 className="h-4 w-4" />
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

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Task Manager</CardTitle>
                      <CardDescription>All pending tasks across projects, sorted by priority and due date</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Tasks</SelectItem>
                          <SelectItem value="urgent">Urgent Only</SelectItem>
                          <SelectItem value="today">Due Today</SelectItem>
                          <SelectItem value="week">Due This Week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Generate task list from all projects */}
                  {(() => {
                    // Collect all tasks from all projects
                    const allTasks = []
                    
                    projects.forEach(project => {
                      if (["completed", "cancelled"].includes(project.status)) return
                      
                      const stageCompletion = project.stage_completion || {}
                      const currentStage = project.status
                      
                      // Define task priorities based on stage
                      const stagePriorities = {
                        invoicing: 5,
                        logistics_planning: 4,
                        pre_event: 3,
                        event_week: 2,
                        follow_up: 1
                      }
                      
                      // Define tasks for each stage
                      const stageTasks = {
                        invoicing: {
                          initial_invoice_sent: "Send initial invoice (Net 30)",
                          final_invoice_sent: "Send final invoice",
                          kickoff_meeting_planned: "Schedule kickoff meeting with client",
                          client_contacts_documented: "Document all client contacts & roles",
                          project_folder_created: "Create project folder & documentation",
                          internal_team_briefed: "Brief internal team on project details",
                          event_details_confirmed: "Confirm & document all event specifications"
                        },
                        logistics_planning: {
                          details_confirmed: "Confirm event details",
                          av_requirements_gathered: "Gather A/V requirements",
                          press_pack_sent: "Send press pack to client",
                          calendar_confirmed: "Confirm speaker calendar",
                          client_contact_obtained: "Obtain client contact info",
                          speaker_materials_ready: "Prepare speaker materials",
                          vendor_onboarding_complete: "Complete vendor onboarding"
                        },
                        pre_event: {
                          logistics_confirmed: "Confirm all logistics",
                          speaker_prepared: "Ensure speaker is prepared",
                          client_materials_sent: "Send materials to client",
                          ready_for_execution: "Ready for event execution"
                        },
                        event_week: {
                          final_preparations_complete: "Complete final preparations",
                          event_executed: "Execute event",
                          support_provided: "Provide event support"
                        },
                        follow_up: {
                          follow_up_sent: "Send follow-up communications",
                          client_feedback_requested: "Request client feedback",
                          speaker_feedback_requested: "Request speaker feedback",
                          lessons_documented: "Document lessons learned"
                        }
                      }
                      
                      // Calculate days until event
                      const daysUntilEvent = project.event_date 
                        ? Math.ceil((new Date(project.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                        : null
                      
                      // Add tasks from current stage
                      if (stageTasks[currentStage]) {
                        Object.entries(stageTasks[currentStage]).forEach(([taskKey, taskName]) => {
                          const isCompleted = stageCompletion[currentStage]?.[taskKey] || false
                          if (!isCompleted) {
                            allTasks.push({
                              id: project.id + "-" + taskKey,
                              projectId: project.id,
                              projectName: project.event_name || project.event_title || project.project_name,
                              clientName: project.client_name,
                              stage: currentStage,
                              taskKey: taskKey,
                              taskName: taskName,
                              priority: stagePriorities[currentStage] || 0,
                              urgency: (() => {
                                // For invoicing tasks, they should be done 2 months (60 days) before event
                                if (currentStage === "invoicing" && daysUntilEvent !== null) {
                                  if (daysUntilEvent < 60) return "high" // Less than 2 months - urgent!
                                  if (daysUntilEvent < 90) return "medium" // Less than 3 months
                                  return "low"
                                }
                                // For other stages, use standard urgency
                                return daysUntilEvent !== null && daysUntilEvent < 30 ? "high" : 
                                       daysUntilEvent !== null && daysUntilEvent < 60 ? "medium" : "low"
                              })(),
                              daysUntilEvent: daysUntilEvent,
                              eventDate: project.event_date
                            })
                          }
                        })
                      }
                    })
                    
                    // Sort tasks by urgency, priority, and days until event
                    allTasks.sort((a, b) => {
                      // First sort by urgency
                      const urgencyOrder = { high: 3, medium: 2, low: 1 }
                      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
                        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
                      }
                      
                      // Then by priority
                      if (a.priority !== b.priority) {
                        return b.priority - a.priority
                      }
                      
                      // Finally by days until event (sooner first)
                      if (a.daysUntilEvent !== null && b.daysUntilEvent !== null) {
                        return a.daysUntilEvent - b.daysUntilEvent
                      }
                      
                      return 0
                    })
                    
                    if (allTasks.length === 0) {
                      return (
                        <div className="text-center py-12 text-gray-500">
                          <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                          <p>All tasks completed! Great job!</p>
                        </div>
                      )
                    }
                    
                    return (
                      <div className="space-y-4">
                        {/* Task summary */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold">{allTasks.length}</div>
                            <div className="text-sm text-gray-600">Total Tasks</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                              {allTasks.filter(t => t.urgency === "high").length}
                            </div>
                            <div className="text-sm text-gray-600">Urgent</div>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">
                              {allTasks.filter(t => t.urgency === "medium").length}
                            </div>
                            <div className="text-sm text-gray-600">Soon</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {allTasks.filter(t => t.daysUntilEvent !== null && t.daysUntilEvent <= 7).length}
                            </div>
                            <div className="text-sm text-gray-600">Within 7 Days</div>
                          </div>
                        </div>
                        
                        {/* Task list */}
                        {allTasks.map((task) => (
                          <div 
                            key={task.id} 
                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{task.taskName}</h4>
                                  <Badge 
                                    variant={task.urgency === "high" ? "destructive" : 
                                            task.urgency === "medium" ? "warning" : "secondary"}
                                    className="text-xs"
                                  >
                                    {task.urgency === "high" ? "Urgent" : 
                                     task.urgency === "medium" ? "Soon" : "Normal"}
                                  </Badge>
                                  <Badge className={(PROJECT_STATUSES[task.stage]?.color || "bg-gray-500") + " text-white text-xs"}>
                                    {PROJECT_STATUSES[task.stage]?.label || task.stage}
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">{task.projectName}</span> • {task.clientName}
                                </div>
                                {task.daysUntilEvent !== null && (
                                  <div className="text-sm text-gray-500">
                                    <CalendarDays className="inline h-3 w-3 mr-1" />
                                    {task.daysUntilEvent === 0 ? "Event today!" :
                                     task.daysUntilEvent === 1 ? "Event tomorrow" :
                                     task.daysUntilEvent < 0 ? Math.abs(task.daysUntilEvent) + " days ago" :
                                     task.daysUntilEvent + " days until event"}
                                  </div>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStageCompletion(
                                  task.projectId, 
                                  task.stage, 
                                  task.taskKey, 
                                  true
                                )}
                                className="ml-4"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Complete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Invoicing Tab */}
            <TabsContent value="invoicing" className="space-y-6">
              {/* Invoice Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${new Intl.NumberFormat('en-US').format(
                        invoices.reduce((sum, inv) => sum + inv.amount, 0)
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {invoices.length} total invoices
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Paid</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      ${new Intl.NumberFormat('en-US').format(
                        invoices.filter(i => i.status === "paid").reduce((sum, inv) => sum + inv.amount, 0)
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {invoices.filter(i => i.status === "paid").length} paid
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      ${new Intl.NumberFormat('en-US').format(
                        invoices.filter(i => ["sent", "overdue"].includes(i.status)).reduce((sum, inv) => sum + inv.amount, 0)
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {invoices.filter(i => ["sent", "overdue"].includes(i.status)).length} pending
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      ${new Intl.NumberFormat('en-US').format(
                        invoices.filter(i => i.status === "overdue").reduce((sum, inv) => sum + inv.amount, 0)
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {invoices.filter(i => i.status === "overdue").length} overdue
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Create Invoice Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Create New Invoice</CardTitle>
                      <CardDescription>Generate invoices for your projects</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="invoice-project">Select Project</Label>
                      <Select 
                        value={invoiceFormData.project_id} 
                        onValueChange={(value) => {
                          setInvoiceFormData({...invoiceFormData, project_id: value})
                          if (invoiceFormData.invoice_type) {
                            handleInvoiceTypeChange(invoiceFormData.invoice_type, value)
                          }
                        }}
                      >
                        <SelectTrigger id="invoice-project">
                          <SelectValue placeholder="Choose a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects
                            .filter(p => !["completed", "cancelled"].includes(p.status))
                            .map(project => (
                              <SelectItem key={project.id} value={project.id.toString()}>
                                {project.event_name || project.event_title || project.project_name} - {project.client_name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="invoice-type">Invoice Type</Label>
                      <Select 
                        value={invoiceFormData.invoice_type}
                        onValueChange={(value) => handleInvoiceTypeChange(value, invoiceFormData.project_id)}
                      >
                        <SelectTrigger id="invoice-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="initial">Initial Invoice (50% of Total)</SelectItem>
                          <SelectItem value="final">Final Invoice (50% of Total)</SelectItem>
                          <SelectItem value="full">Full Amount (Speaker Fee + Travel)</SelectItem>
                          <SelectItem value="full-speaker-only">Speaker Fee Only</SelectItem>
                          <SelectItem value="travel-only">Travel Expenses Only</SelectItem>
                          <SelectItem value="custom">Custom Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="invoice-amount">Amount</Label>
                      <Input 
                        id="invoice-amount" 
                        type="number" 
                        placeholder="25000"
                        value={invoiceFormData.amount}
                        onChange={(e) => setInvoiceFormData({...invoiceFormData, amount: e.target.value})}
                        disabled={invoiceFormData.invoice_type !== "custom" && invoiceFormData.invoice_type !== ""}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="invoice-due-date">Due Date</Label>
                      <Input 
                        id="invoice-due-date" 
                        type="date"
                        value={invoiceFormData.due_date}
                        onChange={(e) => setInvoiceFormData({...invoiceFormData, due_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="invoice-terms">Payment Terms</Label>
                      <Select 
                        value={invoiceFormData.payment_terms}
                        onValueChange={(value) => setInvoiceFormData({...invoiceFormData, payment_terms: value})}
                      >
                        <SelectTrigger id="invoice-terms">
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="net-30">Net 30</SelectItem>
                          <SelectItem value="net-15">Net 15</SelectItem>
                          <SelectItem value="due-on-receipt">Due on Receipt</SelectItem>
                          <SelectItem value="net-60">Net 60</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="invoice-notes">Notes / Description</Label>
                    <Textarea 
                      id="invoice-notes" 
                      placeholder="Additional notes or description for the invoice..."
                      rows={3}
                      value={invoiceFormData.notes}
                      onChange={(e) => setInvoiceFormData({...invoiceFormData, notes: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" disabled={!invoiceFormData.project_id || !invoiceFormData.amount}>
                          <FileText className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Invoice Preview</DialogTitle>
                          <DialogDescription>Review your invoice before sending</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          {/* Invoice preview content */}
                          <div className="border rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Project</p>
                                <p className="font-medium">
                                  {projects.find(p => p.id.toString() === invoiceFormData.project_id)?.project_name || ""}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Amount</p>
                                <p className="font-medium">${invoiceFormData.amount}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Due Date</p>
                                <p className="font-medium">{new Date(invoiceFormData.due_date).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Payment Terms</p>
                                <p className="font-medium">{invoiceFormData.payment_terms.replace("-", " ").toUpperCase()}</p>
                              </div>
                            </div>
                            {/* Show breakdown if project has travel expenses */}
                            {(() => {
                              const project = projects.find(p => p.id.toString() === invoiceFormData.project_id)
                              if (project && parseFloat(project.travel_expenses_amount || "0") > 0) {
                                const speakerFee = parseFloat(project.speaker_fee || project.budget || "0")
                                const travelExpenses = parseFloat(project.travel_expenses_amount || "0")
                                return (
                                  <div className="mt-4 p-3 bg-gray-50 rounded">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Amount Breakdown:</p>
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-sm">
                                        <span>Speaker Fee:</span>
                                        <span>${speakerFee.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>Travel Expenses:</span>
                                        <span>${travelExpenses.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between text-sm font-medium pt-1 border-t">
                                        <span>Total:</span>
                                        <span>${(speakerFee + travelExpenses).toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                              return null
                            })()}
                            {invoiceFormData.notes && (
                              <div className="mt-4">
                                <p className="text-sm text-gray-600">Notes</p>
                                <p className="font-medium">{invoiceFormData.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button onClick={handleCreateNewInvoice} disabled={!invoiceFormData.project_id || !invoiceFormData.amount}>
                      <Send className="h-4 w-4 mr-2" />
                      Create & Send Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Existing Invoices */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Invoice History</CardTitle>
                      <CardDescription>Track and manage all invoices</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Invoices</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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
                              <div className="flex gap-1">
                                {invoice.status !== "paid" && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => handleUpdateInvoiceStatus(invoice.id, "paid")}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                {invoice.status === "draft" && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-blue-600 hover:text-blue-700"
                                    onClick={() => handleUpdateInvoiceStatus(invoice.id, "sent")}
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => setSelectedInvoiceForPDF({id: invoice.id, number: invoice.invoice_number})}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteInvoice(invoice.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
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
                            <span>Schedule kickoff meeting</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Document client contacts</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Create project folder</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Brief internal team</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Confirm event details</span>
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
                          <CardTitle className="text-lg">{project.event_name || project.event_title || project.project_name}</CardTitle>
                          <CardDescription>{project.client_name}</CardDescription>
                          <Badge className={(PROJECT_STATUSES[project.status]?.color || "bg-gray-500") + " text-white w-fit"}>
                            {PROJECT_STATUSES[project.status]?.label || project.status}
                          </Badge>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            {project.event_date ? new Date(project.event_date + 'T00:00:00').toLocaleDateString() : 'N/A'}
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
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle>Task Management - {selectedProject.event_title}</DialogTitle>
                  <DialogDescription>
                    Manage stage completion for {selectedProject.client_name} ({formatEventDate(selectedProject.event_date)})
                  </DialogDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    router.push(`/admin/projects/${selectedProject.id}/edit`)
                    setSelectedProject(null)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
              </div>
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
                          { key: "kickoff_meeting_planned", label: "Schedule kickoff meeting with client" },
                          { key: "client_contacts_documented", label: "Document all client contacts & roles" },
                          { key: "project_folder_created", label: "Create project folder & documentation" },
                          { key: "internal_team_briefed", label: "Brief internal team on project details" },
                          { key: "event_details_confirmed", label: "Confirm & document all event specifications" }
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

      {/* Invoice PDF Dialog */}
      <InvoicePDFDialog
        invoiceId={selectedInvoiceForPDF?.id || null}
        invoiceNumber={selectedInvoiceForPDF?.number || ""}
        open={!!selectedInvoiceForPDF}
        onOpenChange={(open) => !open && setSelectedInvoiceForPDF(null)}
      />
    </div>
  )
}