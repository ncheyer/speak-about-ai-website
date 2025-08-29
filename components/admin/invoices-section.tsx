"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Receipt,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Send,
  Eye,
  Download,
  DollarSign
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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

interface Project {
  id: number
  project_name?: string
  event_name?: string
  event_title?: string
  client_name: string
  status: string
  speaker_fee?: number
  budget?: number
}

const INVOICE_STATUSES = {
  draft: { label: "Draft", color: "bg-gray-500" },
  sent: { label: "Sent", color: "bg-blue-500" },
  paid: { label: "Paid", color: "bg-green-500" },
  overdue: { label: "Overdue", color: "bg-red-500" }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function InvoicesSection() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingInvoice, setCreatingInvoice] = useState(false)
  const { toast } = useToast()

  const [invoiceFormData, setInvoiceFormData] = useState({
    project_id: "",
    invoice_type: "",
    amount: "",
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [invoicesRes, projectsRes] = await Promise.all([
        fetch("/api/invoices"),
        fetch("/api/projects")
      ])

      if (invoicesRes.ok) {
        const invoicesData = await invoicesRes.json()
        setInvoices(invoicesData)
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load invoices data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInvoiceTypeChange = (type: string, projectId?: string) => {
    const selectedProjectId = projectId || invoiceFormData.project_id
    if (!selectedProjectId) return

    const project = projects.find(p => p.id.toString() === selectedProjectId)
    if (!project) return

    const speakerFee = project.speaker_fee || project.budget || 0
    let amount = 0

    switch (type) {
      case "deposit":
        amount = Math.round(speakerFee * 0.5) // 50% deposit
        break
      case "final":
        amount = Math.round(speakerFee * 0.5) // 50% final
        break
      case "full":
        amount = speakerFee // 100% full payment
        break
    }

    setInvoiceFormData(prev => ({
      ...prev,
      invoice_type: type,
      amount: amount.toString()
    }))
  }

  const handleCreateInvoice = async () => {
    if (!invoiceFormData.project_id || !invoiceFormData.amount) {
      toast({
        title: "Error",
        description: "Please select a project and enter an amount",
        variant: "destructive"
      })
      return
    }

    setCreatingInvoice(true)
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: parseInt(invoiceFormData.project_id),
          amount: parseFloat(invoiceFormData.amount),
          type: invoiceFormData.invoice_type,
          due_date: invoiceFormData.due_date,
          status: "draft"
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Invoice created successfully"
        })
        loadData()
        setInvoiceFormData({
          project_id: "",
          invoice_type: "",
          amount: "",
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to create invoice",
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
    } finally {
      setCreatingInvoice(false)
    }
  }

  const handleSendInvoice = async (invoiceId: number) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/send`, {
        method: "POST"
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Invoice sent successfully"
        })
        loadData()
      } else {
        toast({
          title: "Error",
          description: "Failed to send invoice",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error sending invoice:", error)
      toast({
        title: "Error",
        description: "Failed to send invoice",
        variant: "destructive"
      })
    }
  }

  const handleMarkPaid = async (invoiceId: number) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Invoice marked as paid"
        })
        loadData()
      } else {
        toast({
          title: "Error",
          description: "Failed to update invoice",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Invoice Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(invoices.reduce((sum, inv) => sum + inv.amount, 0))}
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
              {formatCurrency(
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
              {formatCurrency(
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
              {formatCurrency(
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                onValueChange={(type) => handleInvoiceTypeChange(type)}
              >
                <SelectTrigger id="invoice-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposit">50% Deposit</SelectItem>
                  <SelectItem value="final">50% Final</SelectItem>
                  <SelectItem value="full">Full Payment</SelectItem>
                  <SelectItem value="custom">Custom Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="invoice-amount">Amount</Label>
              <Input
                id="invoice-amount"
                type="number"
                placeholder="0.00"
                value={invoiceFormData.amount}
                onChange={(e) => setInvoiceFormData({...invoiceFormData, amount: e.target.value})}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleCreateInvoice}
                disabled={creatingInvoice || !invoiceFormData.project_id || !invoiceFormData.amount}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>Manage and track all project invoices</CardDescription>
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
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{invoice.project_name || project?.project_name || "N/A"}</TableCell>
                    <TableCell>{invoice.client_name || project?.client_name || "N/A"}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>
                      <Badge className={INVOICE_STATUSES[invoice.status].color + " text-white"}>
                        {INVOICE_STATUSES[invoice.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(invoice.due_date)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {invoice.status === "draft" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleSendInvoice(invoice.id)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        {invoice.status !== "paid" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkPaid(invoice.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
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
    </div>
  )
}