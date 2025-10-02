"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { trackVendorSearch, trackVendorFilter, trackVendorView } from "@/lib/analytics"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Search, Filter, Star, MapPin, DollarSign, 
  Building2, Globe, Phone, Mail, ChevronLeft,
  CheckCircle, Award, Users, Calendar
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Vendor {
  id: number
  company_name: string
  slug: string
  category?: {
    name: string
    slug: string
    icon?: string
  }
  logo_url?: string
  description?: string
  services?: string[]
  pricing_range?: string
  location?: string
  years_in_business?: number
  team_size?: string
  verified: boolean
  featured: boolean
  average_rating?: number
  review_count?: number
  website?: string
  contact_email: string
  contact_phone?: string
}

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
}

export default function VendorDirectoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationSearch, setLocationSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)
  const [subscriber, setSubscriber] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const subscriberData = sessionStorage.getItem("directorySubscriber")
    if (!subscriberData) {
      router.push("/directory")
      return
    }
    setSubscriber(JSON.parse(subscriberData))
    
    loadVendors()
    loadCategories()
  }, [router])

  const loadVendors = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== "all") params.append("category", selectedCategory)
      if (searchTerm) params.append("search", searchTerm)
      if (locationSearch) params.append("location", locationSearch)
      
      const response = await fetch(`/api/vendors?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setVendors(data.vendors || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to load vendors",
          variant: "destructive"
        })
      }
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

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/vendors?categories=true")
      const data = await response.json()
      
      if (response.ok) {
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadVendors()
    }, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm, locationSearch, selectedCategory])

  const sortedVendors = [...vendors].sort((a, b) => {
    switch (sortBy) {
      case "featured":
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      case "name":
        return a.company_name.localeCompare(b.company_name)
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default:
        return 0
    }
  })

  const getPricingSymbol = (range?: string) => {
    switch (range) {
      case "$": return "💰"
      case "$$": return "💰💰"
      case "$$$": return "💰💰💰"
      case "$$$$": return "💰💰💰💰"
      default: return ""
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/vendor-directory")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vendor Directory</h1>
                <p className="text-sm text-gray-600">
                  {subscriber?.name && `Welcome back, ${subscriber.name}`}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {vendors.length} Vendors
            </Badge>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search vendors by name, service, or keyword..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  if (e.target.value.length > 2) {
                    trackVendorSearch(e.target.value, vendors.length)
                  }
                }}
                className="pl-10"
              />
            </div>
            
            <div className="relative md:w-[200px]">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Location..."
                value={locationSearch}
                onChange={(e) => {
                  setLocationSearch(e.target.value)
                  if (e.target.value.length > 2) {
                    trackVendorFilter('location', e.target.value)
                  }
                }}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={(value) => {
              setSelectedCategory(value)
              trackVendorFilter('category', value)
            }}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => {
              setSortBy(value)
              trackVendorFilter('sort', value)
            }}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading vendors...</p>
          </div>
        ) : sortedVendors.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No vendors found matching your criteria</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
                className="mt-2"
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVendors.map((vendor) => (
              <Card 
                key={vendor.id}
                className="hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden"
                onClick={() => {
                  trackVendorView(vendor.id, vendor.company_name, vendor.slug || vendor.id.toString())
                  router.push(`/vendor-directory/vendors/${vendor.slug || vendor.id}`)
                }}
              >
                {vendor.featured && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-yellow-500 text-white">Featured</Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    {vendor.logo_url ? (
                      <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 p-1 flex items-center justify-center">
                        <img
                          src={vendor.logo_url}
                          alt={vendor.company_name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {vendor.company_name}
                        {vendor.verified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </CardTitle>
                      {vendor.category && (
                        <Badge variant="secondary" className="mt-1">
                          {vendor.category.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {vendor.description || "Professional event services provider"}
                  </p>
                  
                  {/* Services */}
                  {vendor.services && vendor.services.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {vendor.services.slice(0, 3).map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {vendor.services.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{vendor.services.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      {vendor.location && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {vendor.location}
                        </div>
                      )}
                      {vendor.pricing_range && (
                        <span>{getPricingSymbol(vendor.pricing_range)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {vendor.years_in_business && (
                      <span>{vendor.years_in_business}+ years</span>
                    )}
                    {vendor.team_size && (
                      <span>{vendor.team_size} team</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}