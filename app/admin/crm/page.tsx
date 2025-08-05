"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Plus,
  Search,
  Edit,
  Eye,
  Phone,
  Mail,
  MapPin,
  Clock,
  BarChart3,
  CheckSquare,
  Loader2,
  AlertTriangle,
  Database,
  ExternalLink,
  FileText,
  List,
  Kanban,
  Send,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { DealsKanban } from "@/components/deals-kanban"
import { AdminSidebar } from "@/components/admin-sidebar"

interface Deal {
  id: number
  client_name: string
  client_email: string
  client_phone: string
  company: string
  event_title: string
  event_date: string
  event_location: string
  event_type: string
  speaker_requested?: string
  attendee_count: number
  budget_range: string
  deal_value: number
  status: "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
  priority: "low" | "medium" | "high" | "urgent"
  source: string
  notes: string
  created_at: string
  last_contact: string
  next_follow_up?: string
  updated_at: string
}

interface Contract {
  id: number
  deal_id: number
  contract_number: string
  title: string
  status: "draft" | "sent" | "partially_signed" | "fully_executed" | "cancelled"
  total_amount: number
  event_title: string
  event_date: string
  client_name: string
  speaker_name?: string
  generated_at: string
  sent_at?: string
  completed_at?: string
}

const DEAL_STATUSES = {
  lead: { label: "New Lead", color: "bg-gray-500" },
  qualified: { label: "Qualified", color: "bg-blue-500" },
  proposal: { label: "Proposal Sent", color: "bg-yellow-500" },
  negotiation: { label: "Negotiating", color: "bg-orange-500" },
  won: { label: "Won", color: "bg-green-500" },
  lost: { label: "Lost", color: "bg-red-500" },
}

const CONTRACT_STATUSES = {
  draft: { label: "Draft", color: "bg-gray-500", icon: FileText },
  sent: { label: "Sent", color: "bg-blue-500", icon: Send },
  partially_signed: { label: "Partially Signed", color: "bg-yellow-500", icon: Clock },
  fully_executed: { label: "Fully Executed", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-500", icon: AlertTriangle }
}

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

export default function AdminCRMPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [deals, setDeals] = useState<Deal[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [viewMode, setViewMode] = useState<"pipeline" | "list">("pipeline")
  const [activeTab, setActiveTab] = useState("deals")

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    company: "",
    eventTitle: "",
    eventDate: "",
    eventLocation: "",
    eventType: "",
    speakerRequested: "",
    attendeeCount: "",
    budgetRange: "",
    dealValue: "",
    status: "lead" as Deal["status"],
    priority: "medium" as Deal["priority"],
    source: "",
    notes: "",
    nextFollowUp: "",
  })

  // Check authentication and load data
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
      
      // Load deals and contracts in parallel
      const [dealsResponse, contractsResponse] = await Promise.all([
        fetch("/api/deals"),
        fetch("/api/contracts")
      ])

      if (dealsResponse.ok) {
        const dealsData = await dealsResponse.json()
        setDeals(Array.isArray(dealsData) ? dealsData : dealsData.deals || [])
      }

      if (contractsResponse.ok) {
        const contractsData = await contractsResponse.json()
        setContracts(contractsData)
      }
    } catch (error) {
      console.error("Error loading CRM data:", error)
      toast({
        title: "Error",
        description: "Failed to load CRM data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateContract = async (dealId: number) => {
    try {
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deal_id: dealId })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Contract created successfully",
        })
        loadData() // Reload to show new contract
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to create contract",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating contract:", error)
      toast({
        title: "Error",
        description: "Failed to create contract",
        variant: "destructive",
      })
    }
  }

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.event_title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || deal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredContracts = contracts.filter((contract) => {
    return (
      contract.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.event_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contract_number.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (!isLoggedIn) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading CRM data...</span>
      </div>
    )
  }

  // Calculate statistics
  const totalDeals = deals.length
  const totalValue = deals.reduce((sum, deal) => sum + deal.deal_value, 0)
  const wonDeals = deals.filter((d) => d.status === "won").length
  const pipelineValue = deals
    .filter((d) => !["won", "lost"].includes(d.status))
    .reduce((sum, deal) => sum + deal.deal_value, 0)

  const totalContracts = contracts.length
  const executedContracts = contracts.filter(c => c.status === "fully_executed").length
  const pendingContracts = contracts.filter(c => ["draft", "sent", "partially_signed"].includes(c.status)).length

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
              <h1 className="text-3xl font-bold text-gray-900">CRM - Customer Relationship Management</h1>
              <p className="mt-2 text-gray-600">Manage deals, contracts, and client relationships</p>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Deal
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDeals}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${new Intl.NumberFormat('en-US', { 
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0 
                  }).format(pipelineValue)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wonDeals}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalContracts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Executed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{executedContracts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingContracts}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="deals" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Deals Pipeline
              </TabsTrigger>
              <TabsTrigger value="contracts" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Contracts
              </TabsTrigger>
            </TabsList>

            {/* Deals Tab */}
            <TabsContent value="deals" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search deals..."
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
                        <SelectItem value="lead">New Leads</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="proposal">Proposal Sent</SelectItem>
                        <SelectItem value="negotiation">Negotiating</SelectItem>
                        <SelectItem value="won">Won</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* View Toggle */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Active Deals</h2>
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "pipeline" | "list")}>
                  <TabsList>
                    <TabsTrigger value="pipeline" className="flex items-center gap-2">
                      <Kanban className="h-4 w-4" />
                      Pipeline
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex items-center gap-2">
                      <List className="h-4 w-4" />
                      List
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Deals Content */}
              {viewMode === "pipeline" ? (
                <Card>
                  <CardContent className="p-6 overflow-x-auto">
                    <div className="min-w-[1200px]">
                      <DealsKanban />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Event</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDeals.map((deal) => (
                          <TableRow key={deal.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{deal.client_name}</div>
                                <div className="text-sm text-gray-500">{deal.company}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{deal.event_title}</div>
                                <div className="text-sm text-gray-500">{deal.event_location}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              ${new Intl.NumberFormat('en-US').format(deal.deal_value)}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${DEAL_STATUSES[deal.status].color} text-white`}>
                                {DEAL_STATUSES[deal.status].label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={PRIORITY_COLORS[deal.priority]}>
                                {deal.priority.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(deal.event_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={() => setSelectedDeal(deal)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {deal.status === "won" && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleCreateContract(deal.id)}
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    Contract
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Contracts Tab */}
            <TabsContent value="contracts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Management</CardTitle>
                  <CardDescription>
                    Manage contracts generated from won deals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contract #</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Generated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell className="font-mono">
                            {contract.contract_number}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{contract.client_name}</div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{contract.event_title}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(contract.event_date).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            ${new Intl.NumberFormat('en-US').format(contract.total_amount)}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${CONTRACT_STATUSES[contract.status].color} text-white`}>
                              {CONTRACT_STATUSES[contract.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(contract.generated_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Link href={`/admin/contracts/${contract.id}`}>
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              {contract.status === "draft" && (
                                <Button size="sm" variant="outline">
                                  <Send className="h-4 w-4 mr-1" />
                                  Send
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
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