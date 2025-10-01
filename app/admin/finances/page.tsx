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

    // Calculate net profit (commission after speaker payouts)
    stats.netProfit = stats.totalCommission - stats.totalSpeakerPayouts

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
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.totalCommission - stats.totalSpeakerPayouts)}
                </div>
                <p className="text-xs text-muted-foreground">After speaker payouts</p>
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

            {/* Other tabs content would go here */}
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