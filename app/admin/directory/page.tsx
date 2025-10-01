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
  Mail, Download, Upload, Star, TrendingUp, FileSpreadsheet
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

      // Load subscribers (would need separate API endpoint)
      // For now, using mock data
      setSubscribers([])
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
      featured: false,
      verified: false,
      status: "pending"
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
                  <CardDescription>Add, edit, and manage vendor listings</CardDescription>
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

              {/* Vendors Table */}
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
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{vendor.company_name}</p>
                            <p className="text-sm text-gray-500">{vendor.website}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{vendor.contact_name}</p>
                            <p className="text-sm text-gray-500">{vendor.contact_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {categories.find(c => c.id === vendor.category_id)?.name || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            vendor.status === "approved" ? "success" :
                            vendor.status === "pending" ? "warning" :
                            vendor.status === "rejected" ? "destructive" :
                            "secondary"
                          }>
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={vendor.featured}
                            onCheckedChange={async (checked) => {
                              await handleEditVendor({ ...vendor, featured: checked })
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {vendor.verified ? (
                            <CheckCircle className="h-5 w-5 text-blue-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-300" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/directory/vendors/${vendor.slug}`, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditVendor(vendor)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVendor(vendor.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
              <CardTitle>Directory Subscribers</CardTitle>
              <CardDescription>Manage users who have access to the vendor directory</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 py-8 text-center">
                Subscriber management coming soon...
              </p>
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