"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { 
  Search, Filter, Eye, Edit, Trash2, Plus, Download, Upload,
  CheckCircle, XCircle, Clock, AlertCircle, TrendingUp, 
  Users, Building2, DollarSign, Star, MapPin, Globe,
  Mail, Phone, Calendar, FileText, Shield, Activity,
  ChevronRight, MoreHorizontal, ExternalLink, RefreshCw
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface Vendor {
  id: number
  company_name: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  website?: string
  description?: string
  location?: string
  services?: string[]
  pricing_range?: string
  minimum_budget?: number
  status: string
  approved_at?: string
  approved_by?: string
  created_at: string
  updated_at?: string
  slug?: string
  logo_url?: string
  tags?: string[]
  years_in_business?: number
  average_rating?: number
  total_reviews?: number
  featured?: boolean
  verification_status?: string
}

interface VendorStats {
  total: number
  approved: number
  pending: number
  rejected: number
  featured: number
  avg_rating: number
  total_reviews: number
  new_this_month: number
}

export default function VendorManagementPage() {
  const { toast } = useToast()
  
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [stats, setStats] = useState<VendorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedVendors, setSelectedVendors] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadVendors()
  }, [statusFilter])

  const loadVendors = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (searchTerm) params.append("search", searchTerm)
      
      const response = await fetch(`/api/vendors?${params}`, {
        headers: {
          "x-admin-request": "true"
        }
      })
      
      const data = await response.json()
      setVendors(data.vendors || [])
      setStats(data.stats || null)
    } catch (error) {
      console.error("Error loading vendors:", error)
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (vendorId: number, newStatus: string) => {
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
        loadVendors()
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

  const handleDeleteVendor = async (vendorId: number) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return
    
    try {
      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: "DELETE",
        headers: {
          "x-admin-request": "true"
        }
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Vendor deleted successfully"
        })
        loadVendors()
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

  const handleBulkAction = async (action: string) => {
    if (selectedVendors.length === 0) {
      toast({
        title: "No vendors selected",
        description: "Please select vendors to perform bulk actions",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch("/api/vendors/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-request": "true"
        },
        body: JSON.stringify({
          action,
          vendorIds: selectedVendors
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Bulk action completed for ${selectedVendors.length} vendors`
        })
        setSelectedVendors([])
        loadVendors()
      } else {
        throw new Error("Bulk action failed")
      }
    } catch (error) {
      console.error("Error performing bulk action:", error)
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        variant: "destructive"
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />
      case "rejected": return <XCircle className="h-4 w-4 text-red-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "success"
      case "pending": return "warning"
      case "rejected": return "destructive"
      default: return "secondary"
    }
  }

  const filteredVendors = vendors.filter(vendor => 
    vendor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor all vendor accounts</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => loadVendors()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      +{stats.new_this_month} this month
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {((stats.approved / stats.total) * 100).toFixed(0)}% of total
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                    <p className="text-xs text-gray-500 mt-1">Requires action</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.avg_rating?.toFixed(1) || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.total_reviews} reviews
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            {selectedVendors.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Bulk Actions ({selectedVendors.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleBulkAction("approve")}>
                    Approve Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("reject")}>
                    Reject Selected
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction("delete")}
                    className="text-red-600"
                  >
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 flex justify-center items-center">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Loading vendors...</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedVendors.length === filteredVendors.length && filteredVendors.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedVendors(filteredVendors.map(v => v.id))
                        } else {
                          setSelectedVendors([])
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVendors([...selectedVendors, vendor.id])
                          } else {
                            setSelectedVendors(selectedVendors.filter(id => id !== vendor.id))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={vendor.logo_url} />
                          <AvatarFallback>
                            {vendor.company_name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{vendor.company_name}</div>
                          <div className="text-sm text-gray-500">
                            {vendor.pricing_range && (
                              <span className="font-semibold">{vendor.pricing_range}</span>
                            )}
                            {vendor.services && vendor.services.length > 0 && (
                              <span className="ml-2">{vendor.services[0]}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-gray-900">{vendor.contact_name}</div>
                        <div className="text-gray-500">{vendor.contact_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {vendor.location || "Not specified"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(vendor.status) as any}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(vendor.status)}
                          {vendor.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vendor.average_rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{vendor.average_rating.toFixed(1)}</span>
                          <span className="text-gray-500 text-sm">({vendor.total_reviews})</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No ratings</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {format(new Date(vendor.created_at), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem 
                            onClick={() => window.open(`/directory/vendors/${vendor.slug || vendor.id}`, '_blank')}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(vendor.id, "approved")}
                            disabled={vendor.status === "approved"}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(vendor.id, "rejected")}
                            disabled={vendor.status === "rejected"}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteVendor(vendor.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredVendors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
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
    </div>
  )
}