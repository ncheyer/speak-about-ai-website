"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Percent,
  Edit,
  Save,
  X,
  Loader2,
  Download,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart,
  FileText,
  Building,
  User,
  CreditCard,
  Banknote,
  ExternalLink,
  Link2,
  FileSignature
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface FinancialDeal {
  id: number
  client_name: string
  client_email: string
  company: string
  event_title: string
  event_date: string
  deal_value: number
  commission_percentage?: number
  commission_amount?: number
  payment_status?: 'pending' | 'partial' | 'paid'
  payment_date?: string
  partial_payment_amount?: number
  invoice_number?: string
  notes?: string
  won_date: string
  contract_link?: string
  invoice_link_1?: string
  invoice_link_2?: string
  contract_signed_date?: string
  invoice_1_sent_date?: string
  invoice_2_sent_date?: string
  project?: {
    id: number
    project_name: string
    budget: number
    speaker_fee: number
    status: string
  }
}

interface FinancialStats {
  totalRevenue: number
  totalCommission: number
  averageCommission: number
  paidAmount: number
  pendingAmount: number
  dealsCount: number
  projectsCount: number
  // New fields for full revenue tracking
  totalPendingRevenue: number  // Full deal values pending collection
  totalSpeakerPayouts: number  // Amount owed to speakers
  netProfit: number            // Commission after speaker payouts
  collectedRevenue: number     // Total revenue actually collected
}

export default function FinancesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [deals, setDeals] = useState<FinancialDeal[]>([])
  const [stats, setStats] = useState<FinancialStats>({
    totalRevenue: 0,
    totalCommission: 0,
    averageCommission: 0,
    paidAmount: 0,
    pendingAmount: 0,
    dealsCount: 0,
    projectsCount: 0,
    totalPendingRevenue: 0,
    totalSpeakerPayouts: 0,
    netProfit: 0,
    collectedRevenue: 0
  })
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  
  // Edit states
  const [editingDeal, setEditingDeal] = useState<FinancialDeal | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Tab state
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    loadFinancialData()
  }, [router])

  const loadFinancialData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("adminSessionToken")
      
      const response = await fetch("/api/admin/finances", {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDeals(data.deals || [])
        calculateStats(data.deals || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to load financial data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading financial data:", error)
      toast({
        title: "Error",
        description: "Failed to load financial data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (dealsData: FinancialDeal[]) => {
    const stats: FinancialStats = {
      totalRevenue: 0,
      totalCommission: 0,
      averageCommission: 0,
      paidAmount: 0,
      pendingAmount: 0,
      dealsCount: dealsData.length,
      projectsCount: 0,
      totalPendingRevenue: 0,
      totalSpeakerPayouts: 0,
      netProfit: 0,
      collectedRevenue: 0
    }

    dealsData.forEach(deal => {
      const dealValue = Number(deal.deal_value) || 0
      stats.totalRevenue += dealValue
      
      // Calculate commission: use commission_amount if set, otherwise calculate from percentage
      let commission = 0
      if (deal.commission_amount !== null && deal.commission_amount !== undefined && deal.commission_amount !== 0) {
        commission = Number(deal.commission_amount)
      } else {
        // If no commission_amount is set, calculate it from deal value and percentage
        const percentage = deal.commission_percentage || 20
        commission = (dealValue * percentage) / 100
      }
      
      stats.totalCommission += commission
      
      // Track FULL revenue based on payment status
      if (deal.payment_status === 'paid') {
        stats.paidAmount += commission
        stats.collectedRevenue += dealValue  // Full amount collected
      } else if (deal.payment_status === 'partial') {
        // For partial payments, track the full amount as pending
        stats.pendingAmount += commission
        stats.totalPendingRevenue += dealValue
        // Could track partial amount separately if needed
      } else {
        // 'pending' or any other status - full amount is pending collection
        stats.pendingAmount += commission
        stats.totalPendingRevenue += dealValue
      }
      
      // Track speaker payouts for projects
      if (deal.project) {
        stats.projectsCount++
        const speakerFee = Number(deal.project.speaker_fee) || 0
        
        // Only count speaker payouts for pending/unpaid deals
        if (deal.payment_status !== 'paid') {
          stats.totalSpeakerPayouts += speakerFee
        }
      }
    })

    // Calculate net profit - for commission-based model, our commission IS our profit
    // since speaker fees are typically pass-through costs
    stats.netProfit = stats.totalCommission

    if (dealsData.length > 0 && stats.totalRevenue > 0) {
      stats.averageCommission = (stats.totalCommission / stats.totalRevenue) * 100
    }

    setStats(stats)
  }

  const handleEditDeal = (deal: FinancialDeal) => {
    setEditingDeal(deal)
    setShowEditDialog(true)
  }

  const handleSaveDeal = async () => {
    if (!editingDeal) return

    try {
      setSaving(true)
      const token = localStorage.getItem("adminSessionToken")
      
      const response = await fetch(`/api/admin/finances/deals/${editingDeal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          deal_value: editingDeal.deal_value,
          commission_percentage: editingDeal.commission_percentage,
          commission_amount: editingDeal.commission_amount,
          payment_status: editingDeal.payment_status,
          payment_date: editingDeal.payment_date,
          partial_payment_amount: editingDeal.partial_payment_amount,
          invoice_number: editingDeal.invoice_number,
          notes: editingDeal.notes,
          contract_link: editingDeal.contract_link,
          invoice_link_1: editingDeal.invoice_link_1,
          invoice_link_2: editingDeal.invoice_link_2,
          contract_signed_date: editingDeal.contract_signed_date,
          invoice_1_sent_date: editingDeal.invoice_1_sent_date,
          invoice_2_sent_date: editingDeal.invoice_2_sent_date
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Deal updated successfully",
        })
        setShowEditDialog(false)
        loadFinancialData()
      } else {
        toast({
          title: "Error",
          description: "Failed to update deal",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving deal:", error)
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['Client', 'Company', 'Event', 'Date', 'Deal Value', 'Commission %', 'Commission Amount', 'Payment Status', 'Invoice']
    const rows = filteredDeals.map(deal => [
      deal.client_name,
      deal.company,
      deal.event_title,
      formatDate(deal.event_date),
      deal.deal_value,
      deal.commission_percentage || 20,
      deal.commission_amount || (deal.deal_value * (deal.commission_percentage || 20) / 100),
      deal.payment_status || 'pending',
      deal.invoice_number || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = searchQuery === "" || 
      deal.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.event_title.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesPayment = paymentFilter === "all" || 
      (paymentFilter === "paid" && deal.payment_status === "paid") ||
      (paymentFilter === "pending" && (!deal.payment_status || deal.payment_status === "pending")) ||
      (paymentFilter === "partial" && deal.payment_status === "partial")
    
    let matchesDate = true
    if (dateRange !== "all") {
      const wonDate = new Date(deal.won_date)
      const now = new Date()
      
      switch (dateRange) {
        case "month":
          matchesDate = wonDate >= new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case "quarter":
          matchesDate = wonDate >= new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
          break
        case "year":
          matchesDate = wonDate >= new Date(now.getFullYear(), 0, 1)
          break
      }
    }
    
    return matchesSearch && matchesPayment && matchesDate
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 ml-72 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading financial data...</span>
        </div>
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
              <p className="mt-2 text-gray-600">Track revenue, commissions, and payments</p>
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Stats Cards - First Row: Revenue Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Collection</CardTitle>
                <Banknote className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalPendingRevenue)}</div>
                <p className="text-xs text-muted-foreground">Full revenue to collect</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collected Revenue</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.collectedRevenue)}</div>
                <p className="text-xs text-muted-foreground">Total collected</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">From {stats.dealsCount} deals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.projectsCount}</div>
                <p className="text-xs text-muted-foreground">Active</p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards - Second Row: Payouts & Commission */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Speaker Payouts Due</CardTitle>
                <User className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(stats.totalSpeakerPayouts)}</div>
                <p className="text-xs text-muted-foreground">Owed to speakers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gross Commission</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalCommission)}</div>
                <p className="text-xs text-muted-foreground">Avg {stats.averageCommission.toFixed(1)}%</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Commission</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.totalCommission)}
                </div>
                <p className="text-xs text-muted-foreground">Our revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commission Status</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-600">Paid:</span>
                    <span className="text-sm font-semibold text-green-600">{formatCurrency(stats.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-yellow-600">Pending:</span>
                    <span className="text-sm font-semibold text-yellow-600">{formatCurrency(stats.pendingAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="deals">Deals & Commissions</TabsTrigger>
              <TabsTrigger value="payouts">Speaker Payouts</TabsTrigger>
              <TabsTrigger value="projects">Project Finances</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search by client, company, or event..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Payment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Payments</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Deals Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Closed Deals</CardTitle>
                  <CardDescription>All won deals with financial details</CardDescription>
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
                        <TableHead>Status</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeals.map((deal) => {
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
                              ) : deal.payment_status === 'partial' ? (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Partial
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {deal.contract_link && (
                                  <a
                                    href={deal.contract_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                    title="View Contract"
                                  >
                                    <FileSignature className="h-4 w-4" />
                                  </a>
                                )}
                                {deal.invoice_link_1 && (
                                  <a
                                    href={deal.invoice_link_1}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-800"
                                    title="View Invoice 1"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </a>
                                )}
                                {deal.invoice_link_2 && (
                                  <a
                                    href={deal.invoice_link_2}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-800"
                                    title="View Invoice 2"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </a>
                                )}
                                {!deal.contract_link && !deal.invoice_link_1 && !deal.invoice_link_2 && '-'}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditDeal(deal)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Speaker Payouts Tab */}
            <TabsContent value="payouts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Speaker Payouts Management</CardTitle>
                  <CardDescription>Track speaker fees and payment obligations for active projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Event Date</TableHead>
                        <TableHead className="text-right">Deal Value</TableHead>
                        <TableHead className="text-right">Speaker Fee</TableHead>
                        <TableHead className="text-right">Our Commission</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Speaker Paid</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeals
                        .filter(deal => deal.project && deal.payment_status !== 'paid')
                        .map((deal) => {
                          const speakerFee = Number(deal.project?.speaker_fee) || 0
                          const commissionPercentage = deal.commission_percentage || 20
                          const commissionAmount = deal.commission_amount || (deal.deal_value * commissionPercentage / 100)
                          
                          return (
                            <TableRow key={deal.id}>
                              <TableCell className="font-medium">
                                {deal.project?.project_name || deal.event_title}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{deal.client_name}</p>
                                  <p className="text-sm text-gray-500">{deal.company}</p>
                                </div>
                              </TableCell>
                              <TableCell>{formatDate(deal.event_date)}</TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(deal.deal_value)}
                              </TableCell>
                              <TableCell className="text-right font-semibold text-orange-600">
                                {formatCurrency(speakerFee)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div>
                                  <p className="font-medium">{formatCurrency(commissionAmount)}</p>
                                  <p className="text-sm text-gray-500">{commissionPercentage}%</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                {deal.payment_status === 'partial' ? (
                                  <Badge className="bg-yellow-100 text-yellow-800">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Partial Collection
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending Collection
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-orange-600 border-orange-300">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Pending
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                  
                  {/* Summary Section */}
                  <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-orange-900">Total Speaker Payouts Due:</span>
                      </div>
                      <span className="text-2xl font-bold text-orange-600">
                        {formatCurrency(stats.totalSpeakerPayouts)}
                      </span>
                    </div>
                    <p className="text-sm text-orange-700 mt-2">
                      This amount needs to be paid to speakers once client payments are collected.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Paid Speakers Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Completed Payouts</CardTitle>
                  <CardDescription>Speakers who have been paid for completed events</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Event Date</TableHead>
                        <TableHead className="text-right">Speaker Fee Paid</TableHead>
                        <TableHead className="text-right">Net Profit</TableHead>
                        <TableHead>Paid Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeals
                        .filter(deal => deal.project && deal.payment_status === 'paid')
                        .map((deal) => {
                          const speakerFee = Number(deal.project?.speaker_fee) || 0
                          const commissionAmount = deal.commission_amount || (deal.deal_value * (deal.commission_percentage || 20) / 100)
                          const netProfit = commissionAmount - speakerFee
                          
                          return (
                            <TableRow key={deal.id}>
                              <TableCell className="font-medium">
                                {deal.project?.project_name || deal.event_title}
                              </TableCell>
                              <TableCell>{deal.client_name}</TableCell>
                              <TableCell>{formatDate(deal.event_date)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(speakerFee)}</TableCell>
                              <TableCell className="text-right font-medium text-green-600">
                                {formatCurrency(netProfit)}
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {formatDate(deal.payment_date || deal.won_date)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Deals & Commissions Tab */}
            <TabsContent value="deals" className="space-y-6">
              {/* Commission Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Deal Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(stats.dealsCount > 0 ? stats.totalRevenue / stats.dealsCount : 0)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalCommission)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg Commission Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.averageCommission.toFixed(1)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalRevenue > 0 ? 
                        ((stats.collectedRevenue / stats.totalRevenue) * 100).toFixed(1) : 0}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Deals & Commission Details</CardTitle>
                  <CardDescription>Complete breakdown of deals, commissions, and payment tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Deal Details</TableHead>
                        <TableHead>Event Info</TableHead>
                        <TableHead className="text-right">Deal Value</TableHead>
                        <TableHead className="text-right">Commission</TableHead>
                        <TableHead>Collection Status</TableHead>
                        <TableHead>Invoice Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeals.map((deal) => {
                        const commissionPercentage = deal.commission_percentage || 20
                        const commissionAmount = deal.commission_amount || (deal.deal_value * commissionPercentage / 100)
                        
                        return (
                          <TableRow key={deal.id}>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">{deal.client_name}</p>
                                <p className="text-sm text-gray-500">{deal.company}</p>
                                <p className="text-xs text-gray-400">Won: {formatDate(deal.won_date)}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium text-sm">{deal.event_title}</p>
                                <p className="text-xs text-gray-500">Date: {formatDate(deal.event_date)}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <p className="font-bold">{formatCurrency(deal.deal_value)}</p>
                            </TableCell>
                            <TableCell className="text-right">
                              <div>
                                <p className="font-medium">{formatCurrency(commissionAmount)}</p>
                                <p className="text-xs text-gray-500">({commissionPercentage}%)</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                {deal.payment_status === 'paid' ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Collected
                                  </Badge>
                                ) : deal.payment_status === 'partial' ? (
                                  <Badge className="bg-yellow-100 text-yellow-800">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Partial
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                                {deal.payment_date && (
                                  <p className="text-xs text-gray-500">
                                    Paid: {formatDate(deal.payment_date)}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                {deal.invoice_link_1 && (
                                  <Badge variant="outline" className="text-xs">
                                    Invoice 1 (50%)
                                  </Badge>
                                )}
                                {deal.invoice_link_2 && (
                                  <Badge variant="outline" className="text-xs">
                                    Invoice 2 (50%)
                                  </Badge>
                                )}
                                {deal.invoice_number && (
                                  <span className="text-xs text-gray-500">
                                    #{deal.invoice_number}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditDeal(deal)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Project Finances Tab */}
            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Financial Overview</CardTitle>
                  <CardDescription>Detailed financial breakdown by project including expenses and profitability</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Budget</TableHead>
                        <TableHead className="text-right">Speaker Fee</TableHead>
                        <TableHead className="text-right">Our Commission</TableHead>
                        <TableHead className="text-right">Gross Margin</TableHead>
                        <TableHead className="text-right">Commission %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeals
                        .filter(deal => deal.project)
                        .map((deal) => {
                          const speakerFee = Number(deal.project?.speaker_fee) || 0
                          const budget = Number(deal.project?.budget) || deal.deal_value
                          const ourCommission = deal.commission_amount || (deal.deal_value * (deal.commission_percentage || 20) / 100)
                          const grossMargin = deal.deal_value - speakerFee
                          const commissionRate = deal.commission_percentage || 20
                          
                          return (
                            <TableRow key={deal.id}>
                              <TableCell className="font-medium">
                                {deal.project?.project_name || deal.event_title}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{deal.client_name}</p>
                                  <p className="text-sm text-gray-500">{deal.company}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  deal.project?.status === 'completed' ? 'default' :
                                  deal.project?.status === 'invoicing' ? 'secondary' : 
                                  'outline'
                                }>
                                  {deal.project?.status || 'pending'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(budget)}
                              </TableCell>
                              <TableCell className="text-right text-orange-600">
                                {formatCurrency(speakerFee)}
                              </TableCell>
                              <TableCell className="text-right font-bold text-green-600">
                                {formatCurrency(ourCommission)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(grossMargin)}
                              </TableCell>
                              <TableCell className="text-right">
                                <span className={commissionRate >= 25 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                  {commissionRate}%
                                </span>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>

                  {/* Project Summary */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">Total Project Value</span>
                        <span className="text-xl font-bold text-blue-600">
                          {formatCurrency(
                            filteredDeals
                              .filter(d => d.project)
                              .reduce((sum, d) => sum + (Number(d.project?.budget) || d.deal_value), 0)
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-orange-900">Total Speaker Costs</span>
                        <span className="text-xl font-bold text-orange-600">
                          {formatCurrency(
                            filteredDeals
                              .filter(d => d.project)
                              .reduce((sum, d) => sum + (Number(d.project?.speaker_fee) || 0), 0)
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-900">Total Commission</span>
                        <span className="text-xl font-bold text-green-600">
                          {formatCurrency(
                            filteredDeals
                              .filter(d => d.project)
                              .reduce((sum, d) => {
                                const commission = d.commission_amount || (d.deal_value * (d.commission_percentage || 20) / 100)
                                return sum + commission
                              }, 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cash Flow Projection */}
              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow Projection</CardTitle>
                  <CardDescription>Expected incoming and outgoing payments based on project timelines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredDeals
                      .filter(deal => deal.project && deal.payment_status !== 'paid')
                      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
                      .map((deal) => {
                        const speakerFee = Number(deal.project?.speaker_fee) || 0
                        
                        return (
                          <div key={deal.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium">{deal.project?.project_name}</h4>
                                <p className="text-sm text-gray-500">Event: {formatDate(deal.event_date)}</p>
                              </div>
                              <div className="text-right space-y-2">
                                <div>
                                  <p className="text-sm text-gray-500">Expected In</p>
                                  <p className="font-bold text-green-600">+{formatCurrency(deal.deal_value)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Expected Out</p>
                                  <p className="font-bold text-orange-600">-{formatCurrency(speakerFee)}</p>
                                </div>
                                <div className="pt-2 border-t">
                                  <p className="text-sm text-gray-500">Our Commission</p>
                                  <p className="font-bold text-green-600">
                                    {formatCurrency(deal.commission_amount || (deal.deal_value * (deal.commission_percentage || 20) / 100))}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Collection Progress</span>
                          <span className="text-sm font-medium">
                            {stats.totalRevenue > 0 ? 
                              ((stats.collectedRevenue / stats.totalRevenue) * 100).toFixed(0) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ 
                              width: `${stats.totalRevenue > 0 ? 
                                (stats.collectedRevenue / stats.totalRevenue) * 100 : 0}%` 
                            }}
                          />
                        </div>
                      </div>
                      <div className="pt-3 border-t">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Pipeline</span>
                          <span className="font-medium">{formatCurrency(stats.totalRevenue)}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm text-gray-500">Collected</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(stats.collectedRevenue)}
                          </span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm text-gray-500">Outstanding</span>
                          <span className="font-medium text-yellow-600">
                            {formatCurrency(stats.totalPendingRevenue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Commission Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-3xl font-bold">{stats.averageCommission.toFixed(1)}%</p>
                        <p className="text-sm text-gray-500">Average Commission Rate</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">20% Rate</span>
                          <span className="text-sm font-medium">
                            {deals.filter(d => d.commission_percentage === 20).length} deals
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">25% Rate</span>
                          <span className="text-sm font-medium">
                            {deals.filter(d => d.commission_percentage === 25).length} deals
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">30% Rate</span>
                          <span className="text-sm font-medium">
                            {deals.filter(d => d.commission_percentage === 30).length} deals
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Other Rates</span>
                          <span className="text-sm font-medium">
                            {deals.filter(d => 
                              d.commission_percentage !== 20 && 
                              d.commission_percentage !== 25 && 
                              d.commission_percentage !== 30
                            ).length} deals
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Deal Pipeline Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-2xl font-bold">{stats.dealsCount}</p>
                          <p className="text-sm text-gray-500">Total Deals</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{stats.projectsCount}</p>
                          <p className="text-sm text-gray-500">Active Projects</p>
                        </div>
                      </div>
                      <div className="space-y-2 pt-3 border-t">
                        <div className="flex justify-between">
                          <span className="text-sm">Avg Deal Size</span>
                          <span className="font-medium">
                            {formatCurrency(stats.dealsCount > 0 ? stats.totalRevenue / stats.dealsCount : 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Avg Commission</span>
                          <span className="font-medium">
                            {formatCurrency(stats.dealsCount > 0 ? stats.totalCommission / stats.dealsCount : 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Payment Success Rate</span>
                          <span className="font-medium text-green-600">
                            {deals.length > 0 ? 
                              ((deals.filter(d => d.payment_status === 'paid').length / deals.length) * 100).toFixed(0) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue Breakdown</CardTitle>
                  <CardDescription>Revenue and commission trends by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      // Group deals by month
                      const monthlyData = deals.reduce((acc, deal) => {
                        const date = new Date(deal.won_date)
                        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                        
                        if (!acc[monthKey]) {
                          acc[monthKey] = {
                            revenue: 0,
                            commission: 0,
                            deals: 0,
                            collected: 0,
                            pending: 0
                          }
                        }
                        
                        acc[monthKey].revenue += deal.deal_value
                        acc[monthKey].commission += deal.commission_amount || (deal.deal_value * (deal.commission_percentage || 20) / 100)
                        acc[monthKey].deals += 1
                        
                        if (deal.payment_status === 'paid') {
                          acc[monthKey].collected += deal.deal_value
                        } else {
                          acc[monthKey].pending += deal.deal_value
                        }
                        
                        return acc
                      }, {} as Record<string, any>)
                      
                      // Sort by month and show last 6 months
                      const sortedMonths = Object.entries(monthlyData)
                        .sort(([a], [b]) => b.localeCompare(a))
                        .slice(0, 6)
                      
                      return sortedMonths.map(([month, data]) => {
                        const [year, monthNum] = month.split('-')
                        const monthName = new Date(Number(year), Number(monthNum) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        
                        return (
                          <div key={month} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-lg">{monthName}</h4>
                              <Badge variant="outline">{data.deals} deals</Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Revenue</p>
                                <p className="font-bold">{formatCurrency(data.revenue)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Commission</p>
                                <p className="font-bold">{formatCurrency(data.commission)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Collected</p>
                                <p className="font-bold text-green-600">{formatCurrency(data.collected)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="font-bold text-yellow-600">{formatCurrency(data.pending)}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Clients by Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(() => {
                        const clientRevenue = deals.reduce((acc, deal) => {
                          if (!acc[deal.company]) {
                            acc[deal.company] = { revenue: 0, deals: 0 }
                          }
                          acc[deal.company].revenue += deal.deal_value
                          acc[deal.company].deals += 1
                          return acc
                        }, {} as Record<string, any>)
                        
                        return Object.entries(clientRevenue)
                          .sort(([,a], [,b]) => b.revenue - a.revenue)
                          .slice(0, 5)
                          .map(([company, data], index) => (
                            <div key={company} className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                                <div>
                                  <p className="font-medium">{company}</p>
                                  <p className="text-xs text-gray-500">{data.deals} deals</p>
                                </div>
                              </div>
                              <span className="font-bold">{formatCurrency(data.revenue)}</span>
                            </div>
                          ))
                      })()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Event Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(() => {
                        const eventTypes = deals.reduce((acc, deal) => {
                          // Simple categorization based on event title
                          let type = 'Other'
                          if (deal.event_title.toLowerCase().includes('keynote')) type = 'Keynote'
                          else if (deal.event_title.toLowerCase().includes('workshop')) type = 'Workshop'
                          else if (deal.event_title.toLowerCase().includes('panel')) type = 'Panel'
                          else if (deal.event_title.toLowerCase().includes('recording')) type = 'Recording'
                          else if (deal.event_title.toLowerCase().includes('course')) type = 'Course'
                          
                          if (!acc[type]) {
                            acc[type] = { revenue: 0, count: 0 }
                          }
                          acc[type].revenue += deal.deal_value
                          acc[type].count += 1
                          return acc
                        }, {} as Record<string, any>)
                        
                        return Object.entries(eventTypes)
                          .sort(([,a], [,b]) => b.revenue - a.revenue)
                          .map(([type, data]) => (
                            <div key={type} className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{type}</p>
                                <p className="text-xs text-gray-500">{data.count} events</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{formatCurrency(data.revenue)}</p>
                                <p className="text-xs text-gray-500">
                                  Avg: {formatCurrency(data.revenue / data.count)}
                                </p>
                              </div>
                            </div>
                          ))
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Financial Details</DialogTitle>
            <DialogDescription>
              Update commission and payment information for this deal
            </DialogDescription>
          </DialogHeader>
          
          {editingDeal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client</Label>
                  <p className="text-sm text-gray-600">{editingDeal.client_name}</p>
                </div>
                <div>
                  <Label>Company</Label>
                  <p className="text-sm text-gray-600">{editingDeal.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deal_value">Deal Value</Label>
                  <Input
                    id="deal_value"
                    type="number"
                    value={editingDeal.deal_value}
                    onChange={(e) => setEditingDeal({
                      ...editingDeal,
                      deal_value: parseFloat(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="commission_percentage">Commission %</Label>
                  <Input
                    id="commission_percentage"
                    type="number"
                    value={editingDeal.commission_percentage || 20}
                    onChange={(e) => setEditingDeal({
                      ...editingDeal,
                      commission_percentage: parseFloat(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment_status">Payment Status</Label>
                  <Select
                    value={editingDeal.payment_status || 'pending'}
                    onValueChange={(value: any) => setEditingDeal({
                      ...editingDeal,
                      payment_status: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="payment_date">Payment Date</Label>
                  <Input
                    id="payment_date"
                    type="date"
                    value={editingDeal.payment_date || ''}
                    onChange={(e) => setEditingDeal({
                      ...editingDeal,
                      payment_date: e.target.value
                    })}
                  />
                </div>
              </div>

              {editingDeal.payment_status === 'partial' && (
                <div>
                  <Label htmlFor="partial_payment_amount">Amount Paid So Far ($)</Label>
                  <Input
                    id="partial_payment_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter amount received"
                    value={editingDeal.partial_payment_amount || ''}
                    onChange={(e) => setEditingDeal({
                      ...editingDeal,
                      partial_payment_amount: parseFloat(e.target.value) || 0
                    })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Remaining: ${((editingDeal.deal_value || 0) - (editingDeal.partial_payment_amount || 0)).toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="invoice_number">Invoice Number</Label>
                <Input
                  id="invoice_number"
                  value={editingDeal.invoice_number || ''}
                  onChange={(e) => setEditingDeal({
                    ...editingDeal,
                    invoice_number: e.target.value
                  })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editingDeal.notes || ''}
                  onChange={(e) => setEditingDeal({
                    ...editingDeal,
                    notes: e.target.value
                  })}
                  rows={3}
                />
              </div>

              {/* Contract and Invoice Links Section */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium text-lg">Documents</h3>
                
                <div>
                  <Label htmlFor="contract_link">Contract Link (Google Drive)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="contract_link"
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={editingDeal.contract_link || ''}
                      onChange={(e) => setEditingDeal({
                        ...editingDeal,
                        contract_link: e.target.value
                      })}
                      className="flex-1"
                    />
                    {editingDeal.contract_link && (
                      <a
                        href={editingDeal.contract_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoice_link_1">Invoice 1 Link (50% Upfront)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="invoice_link_1"
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={editingDeal.invoice_link_1 || ''}
                        onChange={(e) => setEditingDeal({
                          ...editingDeal,
                          invoice_link_1: e.target.value
                        })}
                        className="flex-1"
                      />
                      {editingDeal.invoice_link_1 && (
                        <a
                          href={editingDeal.invoice_link_1}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-green-600 hover:text-green-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="invoice_1_sent_date">Invoice 1 Sent Date</Label>
                    <Input
                      id="invoice_1_sent_date"
                      type="date"
                      value={editingDeal.invoice_1_sent_date || ''}
                      onChange={(e) => setEditingDeal({
                        ...editingDeal,
                        invoice_1_sent_date: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoice_link_2">Invoice 2 Link (50% on Completion)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="invoice_link_2"
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={editingDeal.invoice_link_2 || ''}
                        onChange={(e) => setEditingDeal({
                          ...editingDeal,
                          invoice_link_2: e.target.value
                        })}
                        className="flex-1"
                      />
                      {editingDeal.invoice_link_2 && (
                        <a
                          href={editingDeal.invoice_link_2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-green-600 hover:text-green-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="invoice_2_sent_date">Invoice 2 Sent Date</Label>
                    <Input
                      id="invoice_2_sent_date"
                      type="date"
                      value={editingDeal.invoice_2_sent_date || ''}
                      onChange={(e) => setEditingDeal({
                        ...editingDeal,
                        invoice_2_sent_date: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contract_signed_date">Contract Signed Date</Label>
                  <Input
                    id="contract_signed_date"
                    type="date"
                    value={editingDeal.contract_signed_date || ''}
                    onChange={(e) => setEditingDeal({
                      ...editingDeal,
                      contract_signed_date: e.target.value
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDeal} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}