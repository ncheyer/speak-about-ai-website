"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Building2, Users, Plus, Edit, Trash2, Eye, 
  CheckCircle, XCircle, Clock, Search, Filter,
  Mail, Download, Upload, Star, TrendingUp, FileSpreadsheet,
  Save, X, Copy, ChevronRight, MoreHorizontal, MapPin, Globe
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { VendorCSVImport } from "@/components/vendor-csv-import"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Vendor {
  id: number
  company_name: string
  slug: string
  category_id?: number
  contact_name?: string
  contact_email: string
  contact_phone?: string
  website?: string
  description?: string
  services?: string[]
  pricing_range?: string
  location?: string
  logo_url?: string
  featured: boolean
  verified: boolean
  status: string
  created_at: string
}

interface Subscriber {
  id: number
  email: string
  name?: string
  company?: string
  access_level: string
  subscription_status: string
  last_login?: string
  login_count: number
  created_at: string
}

interface Category {
  id: number
  name: string
  slug: string
}

export default function AdminDirectoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("vendors")
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showVendorDialog, setShowVendorDialog] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [inlineEditingVendor, setInlineEditingVendor] = useState<number | null>(null)
  const [inlineEditingField, setInlineEditingField] = useState<string | null>(null)
  const [inlineEditValue, setInlineEditValue] = useState("")
  const [vendorForm, setVendorForm] = useState({
    company_name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    description: "",
    category_id: "",
    services: "",
    pricing_range: "",
    location: "",
    logo_url: "",
    featured: false,
    verified: false,
    status: "pending"
  })

  // Check authentication
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    
    loadData()
  }, [router])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load vendors
      const vendorsRes = await fetch("/api/vendors?all=true", {
        headers: { "x-admin-request": "true" }
      })
      const vendorsData = await vendorsRes.json()
      console.log("Loaded vendors:", vendorsData.vendors?.length, "total:", vendorsData.total)
      setVendors(vendorsData.vendors || [])

      // Load categories
      const categoriesRes = await fetch("/api/vendors?categories=true")
      const categoriesData = await categoriesRes.json()
      setCategories(categoriesData.categories || [])

      // Load subscribers
      const subscribersRes = await fetch("/api/vendors/subscribers", {
        headers: { "x-admin-request": "true" }
      })
      const subscribersData = await subscribersRes.json()
      console.log("Loaded subscribers:", subscribersData.subscribers?.length)
      setSubscribers(subscribersData.subscribers || [])
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load directory data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveVendor = async () => {
    try {
      const vendorData = {
        ...vendorForm,
        services: vendorForm.services.split(",").map(s => s.trim()).filter(Boolean),
        category_id: vendorForm.category_id ? parseInt(vendorForm.category_id) : null
      }

      const url = editingVendor 
        ? `/api/vendors/${editingVendor.id}`
        : "/api/vendors"
      
      const response = await fetch(url, {
        method: editingVendor ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-request": "true"
        },
        body: JSON.stringify(vendorData)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Vendor ${editingVendor ? "updated" : "created"} successfully`
        })
        setShowVendorDialog(false)
        resetVendorForm()
        loadData()
      } else {
        throw new Error("Failed to save vendor")
      }
    } catch (error) {
      console.error("Error saving vendor:", error)
      toast({
        title: "Error",
        description: "Failed to save vendor",
        variant: "destructive"
      })
    }
  }

  const handleDeleteVendor = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return

    try {
      const response = await fetch(`/api/vendors/${id}`, {
        method: "DELETE",
        headers: { "x-admin-request": "true" }
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Vendor deleted successfully"
        })
        loadData()
      } else {
        throw new Error("Failed to delete vendor")
      }
    } catch (error) {
      console.error("Error deleting vendor:", error)
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive"
      })
    }
  }

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor)
    setVendorForm({
      company_name: vendor.company_name,
      contact_name: vendor.contact_name || "",
      contact_email: vendor.contact_email,
      contact_phone: vendor.contact_phone || "",
      website: vendor.website || "",
      description: vendor.description || "",
      category_id: vendor.category_id?.toString() || "",
      services: vendor.services?.join(", ") || "",
      pricing_range: vendor.pricing_range || "",
      location: vendor.location || "",
      logo_url: vendor.logo_url || "",
      featured: vendor.featured,
      verified: vendor.verified,
      status: vendor.status
    })
    setShowVendorDialog(true)
  }

  const resetVendorForm = () => {
    setEditingVendor(null)
    setVendorForm({
      company_name: "",
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      website: "",
      description: "",
      category_id: "",
      services: "",
      pricing_range: "",
      location: "",
      logo_url: "",
      featured: false,
      verified: false,
      status: "pending"
    })
  }

  // Inline editing functions
  const startInlineEdit = (vendorId: number, field: string, currentValue: any) => {
    setInlineEditingVendor(vendorId)
    setInlineEditingField(field)
    setInlineEditValue(Array.isArray(currentValue) ? currentValue.join(", ") : (currentValue || ""))
  }

  const saveInlineEdit = async () => {
    if (!inlineEditingVendor || !inlineEditingField) return

    try {
      const vendor = vendors.find(v => v.id === inlineEditingVendor)
      if (!vendor) return

      // Don't save if value hasn't changed
      const currentValue = vendor[inlineEditingField as keyof Vendor]
      const normalizedCurrentValue = Array.isArray(currentValue) ? currentValue.join(", ") : (currentValue || "")
      
      if (inlineEditValue.trim() === normalizedCurrentValue.trim()) {
        cancelInlineEdit()
        return
      }

      let processedValue = inlineEditValue.trim()
      if (inlineEditingField === "services") {
        processedValue = inlineEditValue.split(",").map(s => s.trim()).filter(Boolean)
      }

      // Show loading state
      const originalValue = inlineEditValue
      setInlineEditValue("Saving...")

      const response = await fetch(`/api/vendors/${inlineEditingVendor}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-request": "true"
        },
        body: JSON.stringify({
          ...vendor,
          [inlineEditingField]: processedValue
        })
      })

      if (response.ok) {
        toast({
          title: "✓ Saved",
          description: `${inlineEditingField.replace('_', ' ')} updated successfully`,
          duration: 2000
        })
        
        // Update local state immediately for better UX
        setVendors(prevVendors => 
          prevVendors.map(v => 
            v.id === inlineEditingVendor 
              ? { ...v, [inlineEditingField]: processedValue }
              : v
          )
        )
        
        cancelInlineEdit()
      } else {
        throw new Error("Failed to update vendor")
      }
    } catch (error) {
      console.error("Error updating vendor:", error)
      setInlineEditValue(vendors.find(v => v.id === inlineEditingVendor)?.[inlineEditingField as keyof Vendor] as string || "")
      toast({
        title: "Save failed",
        description: "Please try again or check your connection",
        variant: "destructive"
      })
    }
  }

  const cancelInlineEdit = () => {
    setInlineEditingVendor(null)
    setInlineEditingField(null)
    setInlineEditValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      saveInlineEdit()
    } else if (e.key === "Escape") {
      e.preventDefault()
      cancelInlineEdit()
    } else if (e.key === "Tab") {
      e.preventDefault()
      saveInlineEdit()
    }
  }

  // Add double-click handler for better UX
  const handleDoubleClick = (vendorId: number, field: string, currentValue: any) => {
    if (inlineEditingVendor === vendorId && inlineEditingField === field) {
      return // Already editing
    }
    startInlineEdit(vendorId, field, currentValue)
  }

  const handleQuickStatusChange = async (vendorId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-request": "true"
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Vendor status updated to ${newStatus}`
        })
        loadData()
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating vendor:", error)
      toast({
        title: "Error",
        description: "Failed to update vendor status",
        variant: "destructive"
      })
    }
  }

  const handleFeatureToggle = async (vendorId: number, featured: boolean) => {
    try {
      const vendor = vendors.find(v => v.id === vendorId)
      if (!vendor) return

      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-request": "true"
        },
        body: JSON.stringify({
          ...vendor,
          featured
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Vendor ${featured ? "featured" : "unfeatured"} successfully`
        })
        loadData()
      } else {
        throw new Error("Failed to update vendor")
      }
    } catch (error) {
      console.error("Error updating vendor:", error)
      toast({
        title: "Error",
        description: "Failed to update vendor",
        variant: "destructive"
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Text copied to clipboard"
    })
  }

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vendor.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalVendors: vendors.length,
    approvedVendors: vendors.filter(v => v.status === "approved").length,
    pendingVendors: vendors.filter(v => v.status === "pending").length,
    featuredVendors: vendors.filter(v => v.featured).length,
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.subscription_status === "active").length
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Directory Management</h1>
        <p className="text-gray-600">Manage vendors, subscribers, and directory settings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold">{stats.totalVendors}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{stats.approvedVendors}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingVendors}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold">{stats.featuredVendors}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Subscribers</p>
                <p className="text-2xl font-bold">{stats.totalSubscribers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{stats.activeSubscribers}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="import">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Import
          </TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Manage Vendors</CardTitle>
                  <CardDescription>Add, edit, and manage vendor listings with enhanced inline editing</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button onClick={() => {
                    resetVendorForm()
                    setShowVendorDialog(true)
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vendor
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Enhanced Vendors Table */}
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredVendors.length} of {vendors.length} vendors
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading vendors...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVendors.map((vendor) => (
                      <TableRow key={vendor.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={vendor.logo_url} />
                              <AvatarFallback>
                                {vendor.company_name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              {inlineEditingVendor === vendor.id && inlineEditingField === "company_name" ? (
                                <div className="flex items-center gap-2 w-full">
                                  <Input
                                    value={inlineEditValue}
                                    onChange={(e) => setInlineEditValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    onBlur={() => {
                                      // Save on blur if value changed
                                      if (inlineEditValue !== vendor.company_name) {
                                        saveInlineEdit()
                                      } else {
                                        cancelInlineEdit()
                                      }
                                    }}
                                    className="h-8 text-sm font-medium flex-1 min-w-0"
                                    autoFocus
                                    placeholder="Enter company name"
                                  />
                                  <div className="flex items-center gap-1">
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      onClick={saveInlineEdit}
                                      className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                      title="Save (Enter)"
                                    >
                                      <Save className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      onClick={cancelInlineEdit}
                                      className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                      title="Cancel (Esc)"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div 
                                  className="group font-medium text-gray-900 cursor-pointer hover:bg-blue-50 hover:border-blue-200 rounded px-2 py-1 -mx-2 transition-all duration-150 flex items-center justify-between border border-transparent"
                                  onDoubleClick={() => handleDoubleClick(vendor.id, "company_name", vendor.company_name)}
                                  title="Double-click to edit company name"
                                >
                                  <span>{vendor.company_name}</span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                      Double-click
                                    </span>
                                    <Edit className="h-3 w-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                                  </div>
                                </div>
                              )}
                              <div className="text-sm text-gray-500">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {inlineEditingVendor === vendor.id && inlineEditingField === "website" ? (
                                    <div className="flex items-center gap-2">
                                      <Input
                                        value={inlineEditValue}
                                        onChange={(e) => setInlineEditValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        onBlur={() => {
                                          if (inlineEditValue !== (vendor.website || "")) {
                                            saveInlineEdit()
                                          } else {
                                            cancelInlineEdit()
                                          }
                                        }}
                                        className="h-6 text-xs flex-1"
                                        autoFocus
                                        placeholder="Enter website URL"
                                      />
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        onClick={saveInlineEdit}
                                        className="h-5 w-5 p-0 text-green-600"
                                        title="Save"
                                      >
                                        <Save className="h-3 w-3" />
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        onClick={cancelInlineEdit}
                                        className="h-5 w-5 p-0 text-gray-500"
                                        title="Cancel"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : vendor.website ? (
                                    <div className="flex items-center gap-1">
                                      <a 
                                        href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                        title={vendor.website}
                                      >
                                        <Globe className="h-3 w-3" />
                                        <span className="text-xs">Website</span>
                                      </a>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          startInlineEdit(vendor.id, "website", vendor.website)
                                        }}
                                        className="h-4 w-4 p-0 opacity-0 hover:opacity-100"
                                        title="Edit website"
                                      >
                                        <Edit className="h-2.5 w-2.5 text-gray-400" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        startInlineEdit(vendor.id, "website", "")
                                      }}
                                      className="flex items-center gap-1 text-gray-400 hover:text-blue-600 text-xs"
                                      title="Add website"
                                    >
                                      <Plus className="h-3 w-3" />
                                      <span>Add website</span>
                                    </button>
                                  )}
                                  {vendor.pricing_range && (
                                    <span className="font-semibold">{vendor.pricing_range}</span>
                                  )}
                                  {vendor.services && vendor.services.length > 0 && (
                                    <span>{vendor.services[0]}</span>
                                  )}
                                  {vendor.featured && (
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                      Featured
                                    </span>
                                  )}
                                </div>
                              </div>
                              {inlineEditingVendor === vendor.id && inlineEditingField === "description" ? (
                                <div className="mt-2">
                                  <Textarea
                                    value={inlineEditValue}
                                    onChange={(e) => setInlineEditValue(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && e.ctrlKey) {
                                        e.preventDefault()
                                        saveInlineEdit()
                                      } else if (e.key === "Escape") {
                                        e.preventDefault()
                                        cancelInlineEdit()
                                      }
                                    }}
                                    onBlur={() => {
                                      // Save on blur if value changed
                                      if (inlineEditValue !== (vendor.description || "")) {
                                        saveInlineEdit()
                                      } else {
                                        cancelInlineEdit()
                                      }
                                    }}
                                    className="text-xs resize-none"
                                    rows={3}
                                    autoFocus
                                    placeholder="Enter vendor description"
                                  />
                                  <div className="flex items-center gap-1 mt-1">
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      onClick={saveInlineEdit}
                                      className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                      title="Save (Ctrl+Enter)"
                                    >
                                      <Save className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      onClick={cancelInlineEdit}
                                      className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                      title="Cancel (Esc)"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                    <span className="text-xs text-gray-400 ml-2">Ctrl+Enter to save</span>
                                  </div>
                                </div>
                              ) : (
                                <div 
                                  className="group text-xs text-gray-400 mt-1 cursor-pointer hover:bg-blue-50 hover:border-blue-200 rounded px-2 py-1 -mx-2 transition-all duration-150 border border-transparent"
                                  onDoubleClick={() => handleDoubleClick(vendor.id, "description", vendor.description)}
                                  title={vendor.description ? "Double-click to edit description" : "Double-click to add description"}
                                >
                                  <div className="line-clamp-2 group-hover:line-clamp-none">
                                    {vendor.description ? (
                                      <span>{vendor.description}</span>
                                    ) : (
                                      <span className="italic text-gray-300">Double-click to add description</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                    <span className="text-xs text-gray-400">Double-click</span>
                                    <Edit className="h-3 w-3 text-blue-500" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {inlineEditingVendor === vendor.id && inlineEditingField === "contact_name" ? (
                              <div className="flex items-center gap-2 mb-2">
                                <Input
                                  value={inlineEditValue}
                                  onChange={(e) => setInlineEditValue(e.target.value)}
                                  onKeyDown={handleKeyPress}
                                  onBlur={() => {
                                    // Save on blur if value changed
                                    if (inlineEditValue !== (vendor.contact_name || "")) {
                                      saveInlineEdit()
                                    } else {
                                      cancelInlineEdit()
                                    }
                                  }}
                                  className="h-7 text-sm flex-1"
                                  autoFocus
                                  placeholder="Enter contact name"
                                />
                                <div className="flex items-center gap-1">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={saveInlineEdit}
                                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    title="Save (Enter)"
                                  >
                                    <Save className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={cancelInlineEdit}
                                    className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    title="Cancel (Esc)"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div 
                                className="group text-gray-900 cursor-pointer hover:bg-blue-50 hover:border-blue-200 rounded px-2 py-1 -mx-2 mb-1 transition-all duration-150 flex items-center justify-between border border-transparent"
                                onDoubleClick={() => handleDoubleClick(vendor.id, "contact_name", vendor.contact_name)}
                                title={vendor.contact_name ? "Double-click to edit contact name" : "Double-click to add contact name"}
                              >
                                <span className={vendor.contact_name ? "" : "text-gray-400 italic"}>
                                  {vendor.contact_name || "Double-click to add contact"}
                                </span>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                    Double-click
                                  </span>
                                  <Edit className="h-3 w-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-1 px-2">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-500 text-xs">{vendor.contact_email}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(vendor.contact_email)}
                                className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600"
                                title="Copy email"
                              >
                                <Copy className="h-2.5 w-2.5" />
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {inlineEditingVendor === vendor.id && inlineEditingField === "location" ? (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <Input
                                value={inlineEditValue}
                                onChange={(e) => setInlineEditValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                onBlur={() => {
                                  // Save on blur if value changed
                                  if (inlineEditValue !== (vendor.location || "")) {
                                    saveInlineEdit()
                                  } else {
                                    cancelInlineEdit()
                                  }
                                }}
                                className="h-8 text-sm flex-1"
                                autoFocus
                                placeholder="Enter location"
                              />
                              <div className="flex items-center gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={saveInlineEdit}
                                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  title="Save (Enter)"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={cancelInlineEdit}
                                  className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                  title="Cancel (Esc)"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="group flex items-center text-sm text-gray-600 cursor-pointer hover:bg-blue-50 hover:border-blue-200 rounded px-2 py-1 -mx-2 transition-all duration-150 justify-between border border-transparent"
                              onDoubleClick={() => handleDoubleClick(vendor.id, "location", vendor.location)}
                              title={vendor.location ? "Double-click to edit location" : "Double-click to add location"}
                            >
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className={vendor.location ? "" : "text-gray-400 italic"}>
                                  {vendor.location || "Double-click to add location"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                  Double-click
                                </span>
                                <Edit className="h-3 w-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              vendor.status === "approved" ? "success" :
                              vendor.status === "pending" ? "warning" :
                              vendor.status === "rejected" ? "destructive" :
                              "secondary"
                            }>
                              {vendor.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  onClick={() => handleQuickStatusChange(vendor.id, "approved")}
                                  disabled={vendor.status === "approved"}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                  Approved
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleQuickStatusChange(vendor.id, "pending")}
                                  disabled={vendor.status === "pending"}
                                >
                                  <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                                  Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleQuickStatusChange(vendor.id, "rejected")}
                                  disabled={vendor.status === "rejected"}
                                >
                                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                  Rejected
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={vendor.featured}
                              onCheckedChange={(checked) => handleFeatureToggle(vendor.id, checked)}
                            />
                            {vendor.featured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/directory/vendors/${vendor.slug || vendor.id}`, '_blank')}
                              title="Preview vendor page"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditVendor(vendor)}
                              title="Edit vendor details"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" title="More actions">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => copyToClipboard(vendor.contact_email)}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Copy Email
                                </DropdownMenuItem>
                                {vendor.website && (
                                  <DropdownMenuItem onClick={() => window.open(vendor.website, '_blank')}>
                                    <Globe className="h-4 w-4 mr-2" />
                                    Visit Website
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteVendor(vendor.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Vendor
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredVendors.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="text-gray-500">
                            <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>No vendors found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <VendorCSVImport />
        </TabsContent>

        <TabsContent value="subscribers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Directory Subscribers</CardTitle>
                  <CardDescription>Manage users who have access to the vendor directory</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {subscribers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Access Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Logins</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((subscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell className="font-medium">
                          {subscriber.name || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {subscriber.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {subscriber.company || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {subscriber.access_level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            subscriber.subscription_status === "active" ? "success" :
                            subscriber.subscription_status === "inactive" ? "secondary" :
                            "destructive"
                          }>
                            {subscriber.subscription_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{subscriber.login_count || 0} logins</p>
                            {subscriber.last_login && (
                              <p className="text-xs text-gray-500">
                                Last: {new Date(subscriber.last_login).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(subscriber.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Edit subscriber functionality
                                toast({
                                  title: "Edit subscriber",
                                  description: `Editing ${subscriber.email}`
                                })
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                if (confirm(`Remove ${subscriber.email} from directory subscribers?`)) {
                                  try {
                                    const response = await fetch(`/api/vendors/subscribers?id=${subscriber.id}`, {
                                      method: "DELETE",
                                      headers: { "x-admin-request": "true" }
                                    })
                                    if (response.ok) {
                                      toast({
                                        title: "Success",
                                        description: "Subscriber removed"
                                      })
                                      loadData()
                                    }
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description: "Failed to remove subscriber",
                                      variant: "destructive"
                                    })
                                  }
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No subscribers yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Subscribers will appear here when they sign up for directory access
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Categories</CardTitle>
              <CardDescription>Manage vendor categories and organization</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Vendors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-gray-500">{category.slug}</TableCell>
                      <TableCell>
                        {vendors.filter(v => v.category_id === category.id).length}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Directory Settings</CardTitle>
              <CardDescription>Configure directory access and display settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 py-8 text-center">
                Directory settings coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Vendor Form Dialog */}
      <Dialog open={showVendorDialog} onOpenChange={setShowVendorDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVendor ? "Edit Vendor" : "Add New Vendor"}
            </DialogTitle>
            <DialogDescription>
              Fill in the vendor information below
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={vendorForm.company_name}
                  onChange={(e) => setVendorForm({ ...vendorForm, company_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={vendorForm.category_id}
                  onValueChange={(value) => setVendorForm({ ...vendorForm, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name">Contact Name</Label>
                <Input
                  id="contact_name"
                  value={vendorForm.contact_name}
                  onChange={(e) => setVendorForm({ ...vendorForm, contact_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={vendorForm.contact_email}
                  onChange={(e) => setVendorForm({ ...vendorForm, contact_email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone</Label>
                <Input
                  id="contact_phone"
                  value={vendorForm.contact_phone}
                  onChange={(e) => setVendorForm({ ...vendorForm, contact_phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={vendorForm.website}
                  onChange={(e) => setVendorForm({ ...vendorForm, website: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={vendorForm.description}
                onChange={(e) => setVendorForm({ ...vendorForm, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="services">Services (comma-separated)</Label>
              <Input
                id="services"
                value={vendorForm.services}
                onChange={(e) => setVendorForm({ ...vendorForm, services: e.target.value })}
                placeholder="e.g., Event Planning, AV Equipment, Catering"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo</Label>
              <div className="flex items-center gap-4">
                {vendorForm.logo_url && (
                  <img 
                    src={vendorForm.logo_url} 
                    alt="Logo preview" 
                    className="h-16 w-16 object-cover rounded-lg border"
                  />
                )}
                <div className="flex-1">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      
                      const formData = new FormData()
                      formData.append("file", file)
                      
                      try {
                        const response = await fetch("/api/vendors/upload", {
                          method: "POST",
                          body: formData
                        })
                        
                        if (response.ok) {
                          const data = await response.json()
                          setVendorForm({ ...vendorForm, logo_url: data.url })
                          toast({
                            title: "Logo uploaded",
                            description: "Logo has been uploaded successfully"
                          })
                        } else {
                          throw new Error("Upload failed")
                        }
                      } catch (error) {
                        toast({
                          title: "Upload failed",
                          description: "Please try again",
                          variant: "destructive"
                        })
                      }
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
                {vendorForm.logo_url && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setVendorForm({ ...vendorForm, logo_url: "" })}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={vendorForm.location}
                  onChange={(e) => setVendorForm({ ...vendorForm, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricing_range">Pricing</Label>
                <Select 
                  value={vendorForm.pricing_range}
                  onValueChange={(value) => setVendorForm({ ...vendorForm, pricing_range: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$">$ - Budget</SelectItem>
                    <SelectItem value="$$">$$ - Moderate</SelectItem>
                    <SelectItem value="$$$">$$$ - Premium</SelectItem>
                    <SelectItem value="$$$$">$$$$ - Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={vendorForm.status}
                  onValueChange={(value) => setVendorForm({ ...vendorForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={vendorForm.featured}
                  onCheckedChange={(checked) => setVendorForm({ ...vendorForm, featured: checked })}
                />
                <Label htmlFor="featured">Featured Vendor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="verified"
                  checked={vendorForm.verified}
                  onCheckedChange={(checked) => setVendorForm({ ...vendorForm, verified: checked })}
                />
                <Label htmlFor="verified">Verified</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVendorDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveVendor}>
              {editingVendor ? "Update" : "Create"} Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}