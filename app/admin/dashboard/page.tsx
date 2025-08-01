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
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Phone,
  Mail,
  MapPin,
  Clock,
  LogOut,
  BarChart3
} from "lucide-react"

interface Deal {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  company: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  eventType: string
  speakerRequested?: string
  attendeeCount: number
  budgetRange: string
  dealValue: number
  status: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  source: string
  notes: string
  createdAt: string
  lastContact: string
  nextFollowUp?: string
}

const DEAL_STATUSES = {
  lead: { label: 'New Lead', color: 'bg-gray-500' },
  qualified: { label: 'Qualified', color: 'bg-blue-500' },
  proposal: { label: 'Proposal Sent', color: 'bg-yellow-500' },
  negotiation: { label: 'Negotiating', color: 'bg-orange-500' },
  won: { label: 'Won', color: 'bg-green-500' },
  lost: { label: 'Lost', color: 'bg-red-500' }
}

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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
    status: "lead" as Deal['status'],
    priority: "medium" as Deal['priority'],
    source: "",
    notes: "",
    nextFollowUp: ""
  })

  // Check authentication
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)

    // Load deals from localStorage
    const savedDeals = localStorage.getItem("adminDeals")
    if (savedDeals) {
      setDeals(JSON.parse(savedDeals))
    } else {
      // Initialize with sample data
      const sampleDeals: Deal[] = [
        {
          id: "1",
          clientName: "Sarah Johnson",
          clientEmail: "sarah@techcorp.com",
          clientPhone: "+1-555-0123",
          company: "TechCorp Inc",
          eventTitle: "AI Innovation Summit 2024",
          eventDate: "2024-09-15",
          eventLocation: "San Francisco, CA",
          eventType: "Corporate Conference",
          speakerRequested: "Adam Cheyer (Siri Co-Founder)",
          attendeeCount: 500,
          budgetRange: "$50,000 - $75,000",
          dealValue: 65000,
          status: "proposal",
          priority: "high",
          source: "Website Contact Form",
          notes: "Large corporate event, very interested in AI keynote speakers. Budget confirmed.",
          createdAt: "2024-01-15",
          lastContact: "2024-01-18",
          nextFollowUp: "2024-01-22"
        },
        {
          id: "2", 
          clientName: "Michael Chen",
          clientEmail: "m.chen@startup.io",
          clientPhone: "+1-555-0456",
          company: "InnovateTech Startup",
          eventTitle: "Startup Tech Conference",
          eventDate: "2024-08-20",
          eventLocation: "Austin, TX",
          eventType: "Tech Conference",
          speakerRequested: "Machine Learning Expert",
          attendeeCount: 200,
          budgetRange: "$15,000 - $25,000",
          dealValue: 20000,
          status: "negotiation",
          priority: "medium",
          source: "LinkedIn Outreach",
          notes: "Startup looking for affordable ML speaker. Flexible on dates.",
          createdAt: "2024-01-10",
          lastContact: "2024-01-19",
          nextFollowUp: "2024-01-25"
        },
        {
          id: "3",
          clientName: "Jennifer Williams",
          clientEmail: "jwilliams@university.edu",
          clientPhone: "+1-555-0789",
          company: "Stanford University",
          eventTitle: "AI Ethics Symposium",
          eventDate: "2024-10-05",
          eventLocation: "Palo Alto, CA",
          eventType: "Academic Conference",
          speakerRequested: "AI Ethics Expert",
          attendeeCount: 150,
          budgetRange: "$10,000 - $20,000",
          dealValue: 15000,
          status: "qualified",
          priority: "medium",
          source: "Referral",
          notes: "Academic event focused on AI ethics and responsible AI development.",
          createdAt: "2024-01-08",
          lastContact: "2024-01-16",
          nextFollowUp: "2024-01-23"
        }
      ]
      setDeals(sampleDeals)
      localStorage.setItem("adminDeals", JSON.stringify(sampleDeals))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    localStorage.removeItem("adminUser")
    router.push("/admin")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newDeal: Deal = {
      id: editingDeal?.id || Date.now().toString(),
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      company: formData.company,
      eventTitle: formData.eventTitle,
      eventDate: formData.eventDate,
      eventLocation: formData.eventLocation,
      eventType: formData.eventType,
      speakerRequested: formData.speakerRequested,
      attendeeCount: parseInt(formData.attendeeCount) || 0,
      budgetRange: formData.budgetRange,
      dealValue: parseFloat(formData.dealValue) || 0,
      status: formData.status,
      priority: formData.priority,
      source: formData.source,
      notes: formData.notes,
      createdAt: editingDeal?.createdAt || new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: formData.nextFollowUp
    }

    let updatedDeals
    if (editingDeal) {
      updatedDeals = deals.map(d => d.id === editingDeal.id ? newDeal : d)
    } else {
      updatedDeals = [...deals, newDeal]
    }

    setDeals(updatedDeals)
    localStorage.setItem("adminDeals", JSON.stringify(updatedDeals))
    
    // Reset form
    setFormData({
      clientName: "", clientEmail: "", clientPhone: "", company: "",
      eventTitle: "", eventDate: "", eventLocation: "", eventType: "",
      speakerRequested: "", attendeeCount: "", budgetRange: "", dealValue: "",
      status: "lead", priority: "medium", source: "", notes: "", nextFollowUp: ""
    })
    setShowCreateForm(false)
    setEditingDeal(null)
  }

  const handleEdit = (deal: Deal) => {
    setFormData({
      clientName: deal.clientName,
      clientEmail: deal.clientEmail,
      clientPhone: deal.clientPhone,
      company: deal.company,
      eventTitle: deal.eventTitle,
      eventDate: deal.eventDate,
      eventLocation: deal.eventLocation,
      eventType: deal.eventType,
      speakerRequested: deal.speakerRequested || "",
      attendeeCount: deal.attendeeCount.toString(),
      budgetRange: deal.budgetRange,
      dealValue: deal.dealValue.toString(),
      status: deal.status,
      priority: deal.priority,
      source: deal.source,
      notes: deal.notes,
      nextFollowUp: deal.nextFollowUp || ""
    })
    setEditingDeal(deal)
    setShowCreateForm(true)
  }

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || deal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!isLoggedIn) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // Calculate statistics
  const totalDeals = deals.length
  const totalValue = deals.reduce((sum, deal) => sum + deal.dealValue, 0)
  const wonDeals = deals.filter(d => d.status === 'won').length
  const pipelineValue = deals.filter(d => !['won', 'lost'].includes(d.status)).reduce((sum, deal) => sum + deal.dealValue, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage deals and event bookings</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Deal
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <div className="text-2xl font-bold">${pipelineValue.toLocaleString()}</div>
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
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
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

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingDeal ? "Edit Deal" : "Create New Deal"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Client Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Client Name *</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail">Email</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone">Phone</Label>
                      <Input
                        id="clientPhone"
                        value={formData.clientPhone}
                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventTitle">Event Title *</Label>
                      <Input
                        id="eventTitle"
                        value={formData.eventTitle}
                        onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventType">Event Type</Label>
                      <Input
                        id="eventType"
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        placeholder="Corporate Conference, Workshop, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventDate">Event Date</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventLocation">Location</Label>
                      <Input
                        id="eventLocation"
                        value={formData.eventLocation}
                        onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="attendeeCount">Expected Attendees</Label>
                      <Input
                        id="attendeeCount"
                        type="number"
                        value={formData.attendeeCount}
                        onChange={(e) => setFormData({ ...formData, attendeeCount: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="speakerRequested">Speaker Requested</Label>
                      <Input
                        id="speakerRequested"
                        value={formData.speakerRequested}
                        onChange={(e) => setFormData({ ...formData, speakerRequested: e.target.value })}
                        placeholder="Adam Cheyer, AI Expert, etc."
                      />
                    </div>
                  </div>
                </div>

                {/* Deal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Deal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budgetRange">Budget Range</Label>
                      <Input
                        id="budgetRange"
                        value={formData.budgetRange}
                        onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                        placeholder="$10,000 - $20,000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dealValue">Deal Value ($)</Label>
                      <Input
                        id="dealValue"
                        type="number"
                        value={formData.dealValue}
                        onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value: Deal['status']) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead">New Lead</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="proposal">Proposal Sent</SelectItem>
                          <SelectItem value="negotiation">Negotiating</SelectItem>
                          <SelectItem value="won">Won</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value: Deal['priority']) => setFormData({ ...formData, priority: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="source">Lead Source</Label>
                      <Input
                        id="source"
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        placeholder="Website, LinkedIn, Referral, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="nextFollowUp">Next Follow-up Date</Label>
                      <Input
                        id="nextFollowUp"
                        type="date"
                        value={formData.nextFollowUp}
                        onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    placeholder="Add any additional notes about the deal..."
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    {editingDeal ? "Update Deal" : "Create Deal"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateForm(false)
                      setEditingDeal(null)
                      setFormData({
                        clientName: "", clientEmail: "", clientPhone: "", company: "",
                        eventTitle: "", eventDate: "", eventLocation: "", eventType: "",
                        speakerRequested: "", attendeeCount: "", budgetRange: "", dealValue: "",
                        status: "lead", priority: "medium", source: "", notes: "", nextFollowUp: ""
                      })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Deals List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Active Deals ({filteredDeals.length})</h2>
          
          {filteredDeals.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No deals found</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  Create Your First Deal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredDeals.map((deal) => (
                <Card key={deal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{deal.eventTitle}</CardTitle>
                          <Badge className={`${DEAL_STATUSES[deal.status].color} text-white`}>
                            {DEAL_STATUSES[deal.status].label}
                          </Badge>
                          <Badge className={PRIORITY_COLORS[deal.priority]}>
                            {deal.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <CardDescription>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="font-semibold text-gray-900">{deal.clientName}</p>
                              <p className="text-sm">{deal.company}</p>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Mail className="mr-1 h-3 w-3" />
                                {deal.clientEmail}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="mr-1 h-3 w-3" />
                                {deal.clientPhone}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="mr-1 h-3 w-3" />
                                {new Date(deal.eventDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <MapPin className="mr-1 h-3 w-3" />
                                {deal.eventLocation}
                              </div>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Users className="mr-1 h-3 w-3" />
                                {deal.attendeeCount} attendees
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                <strong>Deal Value:</strong> ${deal.dealValue.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Budget:</strong> {deal.budgetRange}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Source:</strong> {deal.source}
                              </p>
                              {deal.nextFollowUp && (
                                <div className="flex items-center text-sm text-orange-600 mt-1">
                                  <Clock className="mr-1 h-3 w-3" />
                                  Follow-up: {new Date(deal.nextFollowUp).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedDeal(deal)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(deal)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {deal.speakerRequested && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Speaker Requested:</strong> {deal.speakerRequested}
                      </p>
                    )}
                    {deal.notes && (
                      <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {deal.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Deal Detail Modal */}
        {selectedDeal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{selectedDeal.eventTitle}</CardTitle>
                  <Button variant="ghost" onClick={() => setSelectedDeal(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Client Information</h4>
                  <p>{selectedDeal.clientName} - {selectedDeal.company}</p>
                  <p>{selectedDeal.clientEmail} | {selectedDeal.clientPhone}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Event Details</h4>
                  <p><strong>Date:</strong> {new Date(selectedDeal.eventDate).toLocaleDateString()}</p>
                  <p><strong>Location:</strong> {selectedDeal.eventLocation}</p>
                  <p><strong>Type:</strong> {selectedDeal.eventType}</p>
                  <p><strong>Attendees:</strong> {selectedDeal.attendeeCount}</p>
                  {selectedDeal.speakerRequested && (
                    <p><strong>Speaker:</strong> {selectedDeal.speakerRequested}</p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">Deal Information</h4>
                  <p><strong>Value:</strong> ${selectedDeal.dealValue.toLocaleString()}</p>
                  <p><strong>Budget Range:</strong> {selectedDeal.budgetRange}</p>
                  <p><strong>Status:</strong> {DEAL_STATUSES[selectedDeal.status].label}</p>
                  <p><strong>Priority:</strong> {selectedDeal.priority.toUpperCase()}</p>
                  <p><strong>Source:</strong> {selectedDeal.source}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Timeline</h4>
                  <p><strong>Created:</strong> {new Date(selectedDeal.createdAt).toLocaleDateString()}</p>
                  <p><strong>Last Contact:</strong> {new Date(selectedDeal.lastContact).toLocaleDateString()}</p>
                  {selectedDeal.nextFollowUp && (
                    <p><strong>Next Follow-up:</strong> {new Date(selectedDeal.nextFollowUp).toLocaleDateString()}</p>
                  )}
                </div>
                {selectedDeal.notes && (
                  <div>
                    <h4 className="font-semibold">Notes</h4>
                    <p className="text-sm text-gray-600">{selectedDeal.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}