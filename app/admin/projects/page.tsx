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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  AlertCircle,
  MoreHorizontal,
  LayoutGrid,
  List
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useToast } from "@/hooks/use-toast"
import { InvoicePDFDialog } from "@/components/invoice-pdf-viewer"
import { InvoiceEditorModal } from "@/components/invoice-editor-modal"
import { TASK_DEFINITIONS, calculateTaskUrgency, getTaskOwnerLabel, getPriorityColor } from "@/lib/task-definitions"
import { ProjectDetailsManager } from "@/components/project-details-manager"
import { ProjectDetails } from "@/lib/project-details-schema"
import { authGet, authPost, authPut, authDelete, authFetch } from "@/lib/auth-fetch"

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
  status: "planning" | "contracts_signed" | "invoicing" | "logistics_planning" | "pre_event" | "event_week" | "follow_up" | "completed" | "cancelled"
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

  // Payment Tracking
  payment_status?: "pending" | "partial" | "paid"
  payment_date?: string
  speaker_payment_status?: "pending" | "paid"
  speaker_payment_date?: string
  travel_buyout?: number
  
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
  invoice_type?: "deposit" | "final" | "standard"
  amount: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  issue_date: string
  due_date: string
  payment_date?: string
  notes?: string
}

const PROJECT_STATUSES: Record<string, { label: string; color: string; description?: string }> = {
  planning: {
    label: "Planning",
    color: "bg-slate-500",
    description: "Initial planning and scoping"
  },
  contracts_signed: {
    label: "Contracts Signed",
    color: "bg-emerald-500",
    description: "Contracts finalized and signed"
  },
  invoicing: {
    label: "Invoicing",
    color: "bg-blue-500",
    description: "Send invoices (deposit & final)"
  },
  logistics_planning: {
    label: "Logistics",
    color: "bg-purple-500",
    description: "Confirm details, A/V, travel, vendor onboarding"
  },
  pre_event: {
    label: "Pre-Event",
    color: "bg-yellow-500",
    description: "All logistics confirmed, speaker prepared"
  },
  event_week: {
    label: "Event Week",
    color: "bg-orange-500",
    description: "Final preparations and event execution"
  },
  follow_up: {
    label: "Follow-up",
    color: "bg-indigo-500",
    description: "Post-event communications and feedback"
  },
  completed: {
    label: "Completed",
    color: "bg-green-500",
    description: "Event successfully completed"
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500",
    description: "Project cancelled"
  }
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
  const [customTasks, setCustomTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [quickFilter, setQuickFilter] = useState<"all" | "this_week" | "urgent" | "overdue">("all")
  const [activeTab, setActiveTab] = useState("projects")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<Project | null>(null)
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [selectedInvoiceForPDF, setSelectedInvoiceForPDF] = useState<{id: number, number: string} | null>(null)
  const [selectedInvoiceForEdit, setSelectedInvoiceForEdit] = useState<number | null>(null)
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
        authGet("/api/projects"),
        authGet("/api/invoices")
      ])

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData)
        
        // Load custom tasks for all projects
        const allCustomTasks = []
        for (const project of projectsData) {
          try {
            const tasksRes = await authGet(`/api/projects/${project.id}/tasks`)
            if (tasksRes.ok) {
              const tasks = await tasksRes.json()
              allCustomTasks.push(...tasks.map(task => ({
                ...task,
                projectId: project.id,
                projectName: project.project_name,
                clientName: project.client_name,
                eventDate: project.event_date
              })))
            }
          } catch (error) {
            console.error(`Error loading tasks for project ${project.id}:`, error)
          }
        }
        setCustomTasks(allCustomTasks)
      } else {
        // Log the error for debugging
        console.error('Failed to load projects:', {
          status: projectsResponse.status,
          statusText: projectsResponse.statusText
        })
        
        try {
          const errorData = await projectsResponse.json()
          console.error('Error details:', errorData)
          
          toast({
            title: "Error Loading Projects",
            description: errorData.error || "Failed to load projects from database",
            variant: "destructive"
          })
        } catch (parseError) {
          console.error('Could not parse error response:', parseError)
          toast({
            title: "Error Loading Projects",
            description: `Server error: ${projectsResponse.status} ${projectsResponse.statusText}`,
            variant: "destructive"
          })
        }
        
        setProjects([])
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
      // Handle both ISO strings and date-only strings
      let date: Date
      
      // If it's a date-only string (YYYY-MM-DD), parse it as local date
      if (dateString.length === 10 && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-').map(Number)
        date = new Date(year, month - 1, day)
      } else {
        // For ISO strings with time, extract just the date part to avoid timezone issues
        const datePart = dateString.split('T')[0]
        const [year, month, day] = datePart.split('-').map(Number)
        date = new Date(year, month - 1, day)
      }
      
      if (isNaN(date.getTime())) return 'N/A'
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Error formatting date:', dateString, error)
      return 'N/A'
    }
  }

  const getTimeUntilEvent = (eventDate: string) => {
    if (!eventDate) return { text: 'No date', color: 'text-gray-500', urgency: 'unknown' }

    // Parse date the same way as formatEventDate to be consistent
    let event: Date
    if (eventDate.length === 10 && eventDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = eventDate.split('-').map(Number)
      event = new Date(year, month - 1, day)
    } else {
      const datePart = eventDate.split('T')[0]
      const [year, month, day] = datePart.split('-').map(Number)
      event = new Date(year, month - 1, day)
    }

    const now = new Date()
    now.setHours(0, 0, 0, 0) // Reset time to start of day for accurate day calculation
    event.setHours(0, 0, 0, 0) // Reset time to start of day

    const diffTime = event.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Format as months and days
    const formatTimeText = (days: number): string => {
      if (days < 0) {
        const absDays = Math.abs(days)
        const months = Math.floor(absDays / 30)
        const remainingDays = absDays % 30
        if (months > 0 && remainingDays > 0) {
          return `${months}mo ${remainingDays}d ago`
        } else if (months > 0) {
          return `${months}mo ago`
        }
        return `${absDays}d ago`
      }

      const months = Math.floor(days / 30)
      const remainingDays = days % 30
      if (months > 0 && remainingDays > 0) {
        return `${months}mo ${remainingDays}d`
      } else if (months > 0) {
        return `${months}mo`
      }
      return `${days}d`
    }

    if (diffDays < 0) {
      return { text: formatTimeText(diffDays), color: "text-red-600", urgency: "past" }
    } else if (diffDays === 0) {
      return { text: "Today", color: "text-red-600", urgency: "today" }
    } else if (diffDays === 1) {
      return { text: "Tomorrow", color: "text-orange-600", urgency: "urgent" }
    } else if (diffDays <= 7) {
      return { text: `${diffDays}d`, color: "text-orange-600", urgency: "urgent" }
    } else if (diffDays <= 30) {
      return { text: formatTimeText(diffDays), color: "text-yellow-600", urgency: "soon" }
    } else {
      return { text: formatTimeText(diffDays), color: "text-green-600", urgency: "future" }
    }
  }

  const handleUpdateStageCompletion = async (projectId: number, stage: string, task: string, completed: boolean) => {
    try {
      const response = await authFetch(`/api/projects/${projectId}/stage-completion`, {
        method: "PATCH",
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
        return true // Return true for success
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to update task",
          variant: "destructive"
        })
        return false // Return false for failure
      }
    } catch (error) {
      console.error("Error updating stage completion:", error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      })
      return false // Return false for error
    }
  }

  const handleCreateInvoice = async (projectId: number, amount: number) => {
    try {
      const response = await authPost("/api/invoices", {
        project_id: projectId,
        amount: amount,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
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

      const response = await authPost("/api/projects", {
          project_name: newProjectData.project_name,
          event_date: newProjectData.event_date,
          client_name: newProjectData.client_name,
          client_email: newProjectData.client_email,
          company: newProjectData.company,
          speaker_fee: parseFloat(newProjectData.speaker_fee)
      })

      if (response.ok) {
        const newProject = await response.json()
        
        // Auto-generate deposit and final invoices
        try {
          const invoiceResponse = await authPost("/api/invoices/generate-pair", {
            projectId: newProject.id
          })
          
          if (invoiceResponse.ok) {
            toast({
              title: "Success",
              description: "Project created and invoices generated successfully"
            })
          } else {
            toast({
              title: "Partial Success",
              description: "Project created but failed to generate invoices. You can create them manually.",
              variant: "default"
            })
          }
        } catch (error) {
          console.error("Error generating invoices:", error)
          toast({
            title: "Partial Success",
            description: "Project created but failed to generate invoices. You can create them manually.",
            variant: "default"
          })
        }
        
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

      const response = await authPost("/api/invoices", {
        project_id: parseInt(invoiceFormData.project_id),
        amount: parseFloat(invoiceFormData.amount),
        due_date: invoiceFormData.due_date,
        notes: invoiceFormData.notes || `Payment terms: ${invoiceFormData.payment_terms}`,
        status: "sent" // Automatically mark as sent
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
      const response = await authPut(`/api/invoices/${invoiceId}`, {
          status: newStatus,
          payment_date: newStatus === "paid" ? new Date() : null
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
      const response = await authDelete(`/api/invoices/${invoiceId}`)

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

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return
    
    try {
      const response = await authDelete(`/api/projects/${projectId}`)

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

  const handleCreateCalendarEvent = async (project: Project) => {
    if (!project.event_date) {
      toast({
        title: "Error",
        description: "Project must have an event date to create a calendar event",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch("/api/calendar/create-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          projectId: project.id
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: "Calendar event created and invitations sent!",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to create calendar event",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error creating calendar event:", error)
      toast({
        title: "Error",
        description: "Failed to create calendar event",
        variant: "destructive"
      })
    }
  }

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      (project.project_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (project.client_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (project.event_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (project.event_title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (project.event_location?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (project.requested_speaker_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || project.status === statusFilter

    // Apply quick filter based on time until event
    let matchesQuickFilter = true
    if (quickFilter !== "all" && project.event_date) {
      const timeInfo = getTimeUntilEvent(project.event_date)
      if (quickFilter === "this_week") {
        matchesQuickFilter = timeInfo.urgency === "urgent" || timeInfo.urgency === "today"
      } else if (quickFilter === "urgent") {
        matchesQuickFilter = timeInfo.urgency === "urgent" || timeInfo.urgency === "today" || timeInfo.urgency === "soon"
      } else if (quickFilter === "overdue") {
        matchesQuickFilter = timeInfo.urgency === "past"
      }
    }

    return matchesSearch && matchesStatus && matchesQuickFilter
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
              <Button onClick={() => {
                const invoiceSection = document.getElementById('invoice-creation-section')
                if (invoiceSection) {
                  invoiceSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}>
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
              <TabsTrigger value="logistics">Logistics</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
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
                        .filter(([status]) => !["cancelled"].includes(status))
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
                                    .filter(([status]) => !["cancelled"].includes(status))
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
                        <SelectItem value="all">All Stages</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="contracts_signed">Contracts Signed</SelectItem>
                        <SelectItem value="invoicing">Invoicing</SelectItem>
                        <SelectItem value="logistics_planning">Logistics</SelectItem>
                        <SelectItem value="pre_event">Pre-Event</SelectItem>
                        <SelectItem value="event_week">Event Week</SelectItem>
                        <SelectItem value="follow_up">Follow-up</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-1">
                      <Button
                        variant={quickFilter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setQuickFilter("all")}
                      >
                        All
                      </Button>
                      <Button
                        variant={quickFilter === "this_week" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setQuickFilter("this_week")}
                        className={quickFilter === "this_week" ? "" : "text-orange-600 border-orange-300 hover:bg-orange-50"}
                      >
                        🔥 This Week
                      </Button>
                      <Button
                        variant={quickFilter === "urgent" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setQuickFilter("urgent")}
                        className={quickFilter === "urgent" ? "" : "text-yellow-600 border-yellow-300 hover:bg-yellow-50"}
                      >
                        ⚡ Within 30 Days
                      </Button>
                      <Button
                        variant={quickFilter === "overdue" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setQuickFilter("overdue")}
                        className={quickFilter === "overdue" ? "" : "text-gray-600 border-gray-300 hover:bg-gray-50"}
                      >
                        📍 Past Events
                      </Button>
                    </div>
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
                        <TableHead>Event Date</TableHead>
                        <TableHead>Time Until</TableHead>
                        <TableHead>Invoices</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project) => {
                        // Calculate urgency for row color
                        const timeInfo = getTimeUntilEvent(project.event_date)
                        const rowUrgencyClasses: Record<string, string> = {
                          past: "bg-gray-50",
                          today: "bg-red-100 border-l-4 border-l-red-500",
                          urgent: "bg-orange-50 border-l-4 border-l-orange-500",
                          soon: "bg-yellow-50 border-l-4 border-l-yellow-400",
                          future: "",
                          unknown: ""
                        }
                        return (
                        <TableRow key={project.id} className={rowUrgencyClasses[timeInfo.urgency] || ""}>
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
                            <Select 
                              value={project.status} 
                              onValueChange={async (newStatus) => {
                                try {
                                  const response = await authPut(`/api/projects/${project.id}`, { status: newStatus })
                                  
                                  if (response.ok) {
                                    toast({
                                      title: "Success",
                                      description: "Project stage updated"
                                    })
                                    loadData()
                                  } else {
                                    toast({
                                      title: "Error",
                                      description: "Failed to update stage",
                                      variant: "destructive"
                                    })
                                  }
                                } catch (error) {
                                  console.error("Error updating stage:", error)
                                  toast({
                                    title: "Error",
                                    description: "Failed to update stage",
                                    variant: "destructive"
                                  })
                                }
                              }}
                            >
                              <SelectTrigger className="w-[140px] h-8 border-0">
                                <SelectValue>
                                  <Badge className={(PROJECT_STATUSES[project.status]?.color || "bg-gray-500") + " text-white"}>
                                    {PROJECT_STATUSES[project.status]?.label || project.status}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="planning">
                                  <Badge className="bg-slate-500 text-white">Planning</Badge>
                                </SelectItem>
                                <SelectItem value="contracts_signed">
                                  <Badge className="bg-emerald-500 text-white">Contracts</Badge>
                                </SelectItem>
                                <SelectItem value="invoicing">
                                  <Badge className="bg-blue-500 text-white">Invoicing</Badge>
                                </SelectItem>
                                <SelectItem value="logistics_planning">
                                  <Badge className="bg-purple-500 text-white">Logistics</Badge>
                                </SelectItem>
                                <SelectItem value="pre_event">
                                  <Badge className="bg-yellow-500 text-white">Pre-Event</Badge>
                                </SelectItem>
                                <SelectItem value="event_week">
                                  <Badge className="bg-orange-500 text-white">Event Week</Badge>
                                </SelectItem>
                                <SelectItem value="follow_up">
                                  <Badge className="bg-indigo-500 text-white">Follow Up</Badge>
                                </SelectItem>
                                <SelectItem value="completed">
                                  <Badge className="bg-green-500 text-white">Completed</Badge>
                                </SelectItem>
                                <SelectItem value="cancelled">
                                  <Badge className="bg-red-500 text-white">Cancelled</Badge>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {formatEventDate(project.event_date)}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const timeInfo = getTimeUntilEvent(project.event_date)
                              const urgencyColors: Record<string, string> = {
                                past: "bg-gray-100 text-gray-600 border-gray-300",
                                today: "bg-red-100 text-red-700 border-red-300",
                                urgent: "bg-orange-100 text-orange-700 border-orange-300",
                                soon: "bg-yellow-100 text-yellow-700 border-yellow-300",
                                future: "bg-green-100 text-green-700 border-green-300",
                                unknown: "bg-gray-100 text-gray-500 border-gray-300"
                              }
                              return (
                                <div className="flex flex-col gap-1">
                                  <Badge variant="outline" className={urgencyColors[timeInfo.urgency] + " text-xs font-medium"}>
                                    <Timer className="h-3 w-3 mr-1" />
                                    {timeInfo.text}
                                  </Badge>
                                  {timeInfo.urgency === "urgent" && (
                                    <span className="text-xs text-orange-600 font-medium">🔥 Urgent</span>
                                  )}
                                  {timeInfo.urgency === "today" && (
                                    <span className="text-xs text-red-600 font-medium">⚡ Event Today!</span>
                                  )}
                                </div>
                              )
                            })()}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {(() => {
                                const projectInvoices = invoices.filter(inv => inv.project_id === project.id)
                                const depositInvoice = projectInvoices.find(inv => inv.invoice_type === 'deposit')
                                const finalInvoice = projectInvoices.find(inv => inv.invoice_type === 'final')
                                
                                if (!depositInvoice && !finalInvoice) {
                                  return (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs"
                                      onClick={async () => {
                                        try {
                                          const response = await authPost("/api/invoices/generate-pair", { projectId: project.id })
                                          
                                          if (response.ok) {
                                            toast({
                                              title: "Success",
                                              description: "Invoices generated successfully"
                                            })
                                            loadData()
                                          } else {
                                            toast({
                                              title: "Error",
                                              description: "Failed to generate invoices",
                                              variant: "destructive"
                                            })
                                          }
                                        } catch (error) {
                                          console.error("Error:", error)
                                          toast({
                                            title: "Error",
                                            description: "Failed to generate invoices",
                                            variant: "destructive"
                                          })
                                        }
                                      }}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Generate
                                    </Button>
                                  )
                                }
                                
                                return (
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1">
                                        <span className="text-xs font-medium">50%:</span>
                                        {depositInvoice ? (
                                          <Badge 
                                            variant={depositInvoice.status === 'paid' ? 'default' : 'outline'}
                                            className={`text-xs cursor-pointer ${
                                              depositInvoice.status === 'paid' ? 'bg-green-500 hover:bg-green-600' :
                                              depositInvoice.status === 'sent' ? 'bg-blue-500 hover:bg-blue-600' :
                                              depositInvoice.status === 'overdue' ? 'bg-red-500 hover:bg-red-600' :
                                              'bg-gray-400 hover:bg-gray-500'
                                            } text-white`}
                                            onClick={() => setSelectedInvoiceForPDF({id: depositInvoice.id, number: depositInvoice.invoice_number})}
                                          >
                                            {depositInvoice.status === 'paid' ? '✓ Paid' : 
                                             depositInvoice.status === 'sent' ? 'Sent' :
                                             depositInvoice.status === 'overdue' ? 'Overdue' : 'Draft'}
                                          </Badge>
                                        ) : (
                                          <span className="text-xs text-gray-400">-</span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1">
                                        <span className="text-xs font-medium">50%:</span>
                                        {finalInvoice ? (
                                          <Badge 
                                            variant={finalInvoice.status === 'paid' ? 'default' : 'outline'}
                                            className={`text-xs cursor-pointer ${
                                              finalInvoice.status === 'paid' ? 'bg-green-500 hover:bg-green-600' :
                                              finalInvoice.status === 'sent' ? 'bg-blue-500 hover:bg-blue-600' :
                                              finalInvoice.status === 'overdue' ? 'bg-red-500 hover:bg-red-600' :
                                              'bg-gray-400 hover:bg-gray-500'
                                            } text-white`}
                                            onClick={() => setSelectedInvoiceForPDF({id: finalInvoice.id, number: finalInvoice.invoice_number})}
                                          >
                                            {finalInvoice.status === 'paid' ? '✓ Paid' : 
                                             finalInvoice.status === 'sent' ? 'Sent' :
                                             finalInvoice.status === 'overdue' ? 'Overdue' : 'Draft'}
                                          </Badge>
                                        ) : (
                                          <span className="text-xs text-gray-400">-</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                ${new Intl.NumberFormat('en-US').format(
                                  invoices
                                    .filter(inv => inv.project_id === project.id && inv.status === 'paid')
                                    .reduce((sum, inv) => sum + inv.amount, 0)
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                of ${new Intl.NumberFormat('en-US').format(parseFloat(project.speaker_fee || project.budget || "0"))}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500">Client:</span>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    project.payment_status === 'paid'
                                      ? 'bg-green-100 text-green-700 border-green-300'
                                      : project.payment_status === 'partial'
                                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                                      : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                  }`}
                                >
                                  {project.payment_status === 'paid' ? '✓ Paid' :
                                   project.payment_status === 'partial' ? 'Partial' : 'Pending'}
                                </Badge>
                              </div>
                              {parseFloat(project.speaker_fee || "0") > 0 && (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500">Speaker:</span>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      project.speaker_payment_status === 'paid'
                                        ? 'bg-green-100 text-green-700 border-green-300'
                                        : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                    }`}
                                  >
                                    {project.speaker_payment_status === 'paid' ? '✓ Paid' : 'Due'}
                                  </Badge>
                                </div>
                              )}
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
                                variant="ghost"
                                onClick={() => handleCreateCalendarEvent(project)}
                                title="Create Calendar Event"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <CalendarDays className="h-4 w-4" />
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
                        );
                      })}
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
                    
                    // First, add custom generated tasks
                    customTasks.forEach(task => {
                      if (!task.completed) {
                        const project = projects.find(p => p.id === task.projectId)
                        if (project && !["completed", "cancelled"].includes(project.status)) {
                          const daysUntilEvent = project.event_date 
                            ? Math.ceil((new Date(project.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                            : null
                          
                          // Parse requirements and deliverables from notes field
                          let taskRequirements = []
                          let taskDeliverables = []
                          try {
                            if (task.notes) {
                              const details = typeof task.notes === 'string' ? JSON.parse(task.notes) : task.notes
                              taskRequirements = details.requirements || []
                              taskDeliverables = details.deliverables || []
                            }
                          } catch (e) {
                            console.error('Error parsing task details:', e)
                          }
                          
                          allTasks.push({
                            id: `custom-${task.id}`,
                            projectId: task.projectId,
                            projectName: task.projectName,
                            clientName: task.clientName,
                            stage: task.stage || 'logistics_planning',
                            taskKey: `custom_${task.id}`,
                            taskName: task.task_name,
                            taskDescription: task.description,
                            taskRequirements: taskRequirements,
                            taskDeliverables: taskDeliverables,
                            taskOwner: task.assigned_to || 'Team',
                            estimatedTime: null,
                            priority: task.priority || 'medium',
                            urgency: task.priority === 'critical' ? 'critical' : 
                                    task.priority === 'high' ? 'high' : 
                                    task.priority === 'medium' ? 'medium' : 'low',
                            daysUntilEvent: daysUntilEvent,
                            eventDate: task.eventDate,
                            isCustom: true,
                            customTaskId: task.id
                          })
                        }
                      }
                    })
                    
                    // Then add predefined tasks
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
                      
                      // Use detailed task definitions
                      const stageTasks = TASK_DEFINITIONS
                      
                      // Calculate days until event
                      const daysUntilEvent = project.event_date 
                        ? Math.ceil((new Date(project.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                        : null
                      
                      // Add tasks from current stage
                      if (stageTasks[currentStage]) {
                        Object.entries(stageTasks[currentStage]).forEach(([taskKey, taskDefinition]) => {
                          const isCompleted = stageCompletion[currentStage]?.[taskKey] || false
                          if (!isCompleted) {
                            const urgency = calculateTaskUrgency(currentStage, daysUntilEvent, taskKey)
                            allTasks.push({
                              id: project.id + "-" + taskKey,
                              projectId: project.id,
                              projectName: project.event_name || project.event_title || project.project_name,
                              clientName: project.client_name,
                              stage: currentStage,
                              taskKey: taskKey,
                              taskName: taskDefinition.name,
                              taskDescription: taskDefinition.description,
                              taskRequirements: taskDefinition.requirements,
                              taskDeliverables: taskDefinition.deliverables,
                              taskOwner: taskDefinition.owner,
                              estimatedTime: taskDefinition.estimatedTime,
                              priority: taskDefinition.priority,
                              urgency: urgency,
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
                      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 }
                      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
                        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
                      }
                      
                      // Then by priority
                      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
                      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                        return priorityOrder[b.priority] - priorityOrder[a.priority]
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
                        <div className="grid grid-cols-5 gap-4 mb-6">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold">{allTasks.length}</div>
                            <div className="text-sm text-gray-600">Total Tasks</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                              {allTasks.filter(t => t.urgency === "critical").length}
                            </div>
                            <div className="text-sm text-gray-600">Critical</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
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
                            <div className="text-sm text-gray-600">This Week</div>
                          </div>
                        </div>
                        
                        {/* Task list */}
                        {allTasks.map((task) => (
                          <div 
                            key={task.id} 
                            className="border rounded-lg overflow-hidden hover:shadow-md transition-all"
                          >
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold text-lg">{task.taskName}</h4>
                                    <Badge 
                                      className={`text-xs ${
                                        task.urgency === "critical" ? "bg-red-100 text-red-700" :
                                        task.urgency === "high" ? "bg-orange-100 text-orange-700" : 
                                        task.urgency === "medium" ? "bg-yellow-100 text-yellow-700" : 
                                        "bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      {task.urgency === "critical" ? "🔴 Critical" :
                                       task.urgency === "high" ? "🟠 Urgent" : 
                                       task.urgency === "medium" ? "🟡 Soon" : "Normal"}
                                    </Badge>
                                    <Badge className={(PROJECT_STATUSES[task.stage]?.color || "bg-gray-500") + " text-white text-xs"}>
                                      {PROJECT_STATUSES[task.stage]?.label || task.stage}
                                    </Badge>
                                    {task.taskOwner && (
                                      <Badge variant="outline" className="text-xs">
                                        <Users className="h-3 w-3 mr-1" />
                                        {getTaskOwnerLabel(task.taskOwner)}
                                      </Badge>
                                    )}
                                    {task.estimatedTime && (
                                      <Badge variant="outline" className="text-xs">
                                        <Timer className="h-3 w-3 mr-1" />
                                        {task.estimatedTime}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{task.taskDescription}</p>
                                  <div className="text-sm text-gray-500 space-y-1">
                                    <div>
                                      <span className="font-medium text-gray-700">{task.projectName}</span> • {task.clientName}
                                    </div>
                                    {task.daysUntilEvent !== null && (
                                      <div className={task.daysUntilEvent <= 7 ? "text-red-600 font-medium" : ""}>
                                        <CalendarDays className="inline h-3 w-3 mr-1" />
                                        {task.daysUntilEvent === 0 ? "🚨 Event today!" :
                                         task.daysUntilEvent === 1 ? "⚠️ Event tomorrow" :
                                         task.daysUntilEvent < 0 ? `${Math.abs(task.daysUntilEvent)} days ago` :
                                         `${task.daysUntilEvent} days until event`}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={async () => {
                                    if (task.isCustom) {
                                      // Handle custom task completion
                                      try {
                                        const response = await authPut(`/api/projects/${task.projectId}/tasks`, {
                                            taskId: task.customTaskId,
                                            completed: true,
                                            status: 'completed'
                                          })
                                        
                                        if (response.ok) {
                                          toast({
                                            title: "Task Completed",
                                            description: task.taskName
                                          })
                                          loadData() // Refresh to update task list
                                        }
                                      } catch (error) {
                                        console.error('Error completing custom task:', error)
                                        toast({
                                          title: "Error",
                                          description: "Failed to complete task",
                                          variant: "destructive"
                                        })
                                      }
                                    } else {
                                      // Handle predefined task completion
                                      await handleUpdateStageCompletion(
                                        task.projectId, 
                                        task.stage, 
                                        task.taskKey, 
                                        true
                                      )
                                    }
                                  }}
                                  className="ml-4 min-w-[100px]"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Complete
                                </Button>
                              </div>
                              
                              {/* Expandable details section */}
                              <details className="mt-3 border-t pt-3">
                                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                                  View Requirements & Deliverables
                                </summary>
                                <div className="mt-3 grid md:grid-cols-2 gap-4">
                                  {task.taskRequirements && task.taskRequirements.length > 0 && (
                                    <div>
                                      <h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Requirements:</h5>
                                      <ul className="space-y-1">
                                        {task.taskRequirements.map((req, idx) => (
                                          <li key={idx} className="text-xs text-gray-600 flex items-start">
                                            <CheckSquare className="h-3 w-3 mr-1 mt-0.5 text-gray-400" />
                                            {req}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {task.taskDeliverables && task.taskDeliverables.length > 0 && (
                                    <div>
                                      <h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Deliverables:</h5>
                                      <ul className="space-y-1">
                                        {task.taskDeliverables.map((del, idx) => (
                                          <li key={idx} className="text-xs text-gray-600 flex items-start">
                                            <Target className="h-3 w-3 mr-1 mt-0.5 text-gray-400" />
                                            {del}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </details>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
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
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pre-Event */}
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          Pre-Event
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Review talk & get approval</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Join all prep calls</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Review session document</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-gray-400" />
                            <span>Final prep meeting with speaker</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details Management</CardTitle>
                  <CardDescription>
                    Select a project to manage comprehensive event details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Project selector */}
                  <div className="mb-6">
                    <Label>Select Project</Label>
                    <Select
                      value={selectedProjectForDetails?.id?.toString() || ""}
                      onValueChange={(value) => {
                        const project = projects.find(p => p.id === parseInt(value))
                        setSelectedProjectForDetails(project || null)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a project to manage details" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.project_name} - {project.client_name} ({new Date(project.event_date).toLocaleDateString()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Project Details Manager */}
                  {selectedProjectForDetails && (
                    <ProjectDetailsManager
                      projectId={selectedProjectForDetails.id}
                      projectName={selectedProjectForDetails.project_name}
                      onGenerateTasks={async (tasks) => {
                        // Create tasks in the database
                        try {
                          // Map task categories to stages
                          const tasksWithStages = tasks.map(task => {
                            let stage = 'logistics_planning' // default stage
                            if (task.category === 'overview' || task.category === 'contacts') {
                              stage = 'invoicing'
                            } else if (task.category === 'travel' || task.category === 'venue') {
                              stage = 'logistics_planning'
                            } else if (task.category === 'event_details' || task.category === 'audience') {
                              stage = 'pre_event'
                            } else if (task.category === 'speaker_requirements') {
                              stage = 'pre_event'
                            }
                            
                            return {
                              ...task,
                              stage
                            }
                          })
                          
                          // Create tasks via API
                          const response = await authPost(`/api/projects/${selectedProjectForDetails.id}/tasks`, {
                              tasks: tasksWithStages
                            })
                          
                          if (response.ok) {
                            const result = await response.json()
                            
                            if (result.count > 0) {
                              toast({
                                title: "Tasks Generated",
                                description: `${result.count} new tasks created${result.skipped > 0 ? ` (${result.skipped} already existed)` : ''}`
                              })
                              
                              // Switch to tasks tab to show the new tasks
                              setActiveTab('tasks')
                              
                              // Refresh data to show new tasks
                              loadData()
                            } else if (result.skipped > 0) {
                              toast({
                                title: "No New Tasks",
                                description: `All ${result.skipped} tasks already exist for this project`,
                                variant: "default"
                              })
                            } else {
                              toast({
                                title: "No Tasks Needed",
                                description: "No missing information found that requires tasks",
                                variant: "default"
                              })
                            }
                          } else {
                            throw new Error('Failed to save tasks')
                          }
                        } catch (error) {
                          console.error('Error creating tasks:', error)
                          toast({
                            title: "Error",
                            description: "Failed to create generated tasks",
                            variant: "destructive"
                          })
                        }
                      }}
                    />
                  )}
                  
                  {!selectedProjectForDetails && (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Select a project to view and manage its details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create Project Dialog */}
      <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Add a new event project to the system</DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <p>Project creation form would go here</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Management Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Tasks - {selectedProject?.project_name || selectedProject?.event_name}</DialogTitle>
            <DialogDescription>
              {selectedProject?.client_name} • {selectedProject?.event_date ? new Date(selectedProject.event_date).toLocaleDateString() : 'No date set'}
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4 mt-4">
              {/* Task stages */}
              {Object.entries(TASK_DEFINITIONS).map(([stage, tasks]) => {
                const stageConfig = PROJECT_STATUSES[stage]
                const isCurrentStage = selectedProject.status === stage
                const stageCompletion = selectedProject.stage_completion?.[stage] || {}
                const completedCount = Object.values(stageCompletion).filter(Boolean).length
                const totalCount = Object.keys(tasks).length
                
                return (
                  <Card key={stage} className={isCurrentStage ? "border-blue-500 shadow-md" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={(stageConfig?.color || "bg-gray-500") + " text-white"}>
                            {stageConfig?.label || stage}
                          </Badge>
                          {isCurrentStage && (
                            <Badge variant="outline" className="text-blue-600 border-blue-600">
                              Current Stage
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {completedCount} of {totalCount} completed
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.entries(tasks).map(([taskKey, taskDef]) => {
                        const isCompleted = stageCompletion[taskKey] || false
                        const daysUntilEvent = selectedProject.event_date 
                          ? Math.ceil((new Date(selectedProject.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                          : null
                        const urgency = calculateTaskUrgency(stage, daysUntilEvent, taskKey)
                        
                        return (
                          <div 
                            key={taskKey}
                            className={`p-3 rounded-lg border ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <div className="h-5 w-5 rounded border-2 border-gray-300" />
                                  )}
                                  <span className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                                    {taskDef.name}
                                  </span>
                                  {!isCompleted && (
                                    <>
                                      <Badge 
                                        className={`text-xs ${
                                          urgency === "critical" ? "bg-red-100 text-red-700" :
                                          urgency === "high" ? "bg-orange-100 text-orange-700" : 
                                          urgency === "medium" ? "bg-yellow-100 text-yellow-700" : 
                                          "bg-gray-100 text-gray-700"
                                        }`}
                                      >
                                        {urgency === "critical" ? "Critical" :
                                         urgency === "high" ? "Urgent" : 
                                         urgency === "medium" ? "Soon" : "Normal"}
                                      </Badge>
                                      {taskDef.estimatedTime && (
                                        <span className="text-xs text-gray-500">
                                          <Clock className="inline h-3 w-3 mr-1" />
                                          {taskDef.estimatedTime}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 ml-7">{taskDef.description}</p>
                              </div>
                              {!isCompleted && isCurrentStage && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={async () => {
                                    const success = await handleUpdateStageCompletion(selectedProject.id, stage, taskKey, true)
                                    // Only update local state if API call was successful
                                    if (success) {
                                      setSelectedProject({
                                        ...selectedProject,
                                        stage_completion: {
                                          ...selectedProject.stage_completion,
                                          [stage]: {
                                            ...stageCompletion,
                                            [taskKey]: true
                                          }
                                        }
                                      })
                                    }
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                  Complete
                                </Button>
                              )}
                              {isCompleted && isCurrentStage && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={async () => {
                                    const success = await handleUpdateStageCompletion(selectedProject.id, stage, taskKey, false)
                                    // Only update local state if API call was successful
                                    if (success) {
                                      setSelectedProject({
                                        ...selectedProject,
                                        stage_completion: {
                                          ...selectedProject.stage_completion,
                                          [stage]: {
                                            ...stageCompletion,
                                            [taskKey]: false
                                          }
                                        }
                                      })
                                    }
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                  Undo
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
