"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin, Globe, Mail, Phone, Calendar, Star, DollarSign,
  Building2, Users, Award, Clock, ArrowLeft,
  ExternalLink, MessageSquare, Shield
} from "lucide-react"
import { format } from "date-fns"

interface Vendor {
  id: number
  company_name: string
  slug: string
  category?: {
    name: string
    slug: string
    icon?: string
  }
  contact_name?: string
  contact_email: string
  contact_phone?: string
  website?: string
  logo_url?: string
  description?: string
  services?: string[]
  specialties?: string[]
  pricing_range?: string
  minimum_budget?: number
  location?: string
  years_in_business?: number
  team_size?: string
  certifications?: string[]
  featured: boolean
  verified: boolean
  status: string
  tags?: string[]
  social_media?: any
  portfolio_items?: any[]
  client_references?: any
  created_at: string
  updated_at: string
  approved_at?: string
  average_rating?: number
  review_count?: number
}

export default function VendorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVendor()
  }, [params.slug])

  const fetchVendor = async () => {
    try {
      const response = await fetch(`/api/vendors/slug/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setVendor(data.vendor)
      } else {
        router.push("/vendor-directory/vendors")
      }
    } catch (error) {
      console.error("Error fetching vendor:", error)
      router.push("/vendor-directory/vendors")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor details...</p>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vendor not found</p>
          <Button onClick={() => router.push("/vendor-directory/vendors")}>
            Back to Directory
          </Button>
        </div>
      </div>
    )
  }

  const averageRating = vendor.average_rating || 0
  const reviewCount = vendor.review_count || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/vendor-directory/vendors")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Directory
          </Button>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            {vendor.logo_url ? (
              <img 
                src={vendor.logo_url} 
                alt={vendor.company_name}
                className="max-h-32 max-w-xs object-contain border-4 border-gray-100 rounded-lg bg-white p-2"
              />
            ) : (
              <div className="h-32 w-32 border-4 border-gray-100 rounded-lg bg-gray-100 flex items-center justify-center">
                <Building2 className="h-16 w-16 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {vendor.company_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                    {vendor.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {vendor.location}
                      </span>
                    )}
                    {vendor.years_in_business && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {vendor.years_in_business} years in business
                      </span>
                    )}
                    {vendor.pricing_range && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {vendor.pricing_range}
                      </span>
                    )}
                  </div>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {vendor.category && (
                      <Badge variant="secondary">
                        {vendor.category.name}
                      </Badge>
                    )}
                    {vendor.verified && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {vendor.featured && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  {/* Rating */}
                  {reviewCount > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(averageRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{averageRating.toFixed(1)}</span>
                      <span className="text-gray-500">({reviewCount} reviews)</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button size="lg" onClick={() => window.location.href = `mailto:${vendor.contact_email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Vendor
                  </Button>
                  {vendor.website && (
                    <Button variant="outline" size="lg" asChild>
                      <a href={vendor.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {vendor.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {vendor.description}
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* Services */}
            {vendor.services && vendor.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {vendor.services.map((service: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-blue-600 rounded-full" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Specialties */}
            {vendor.specialties && vendor.specialties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {vendor.specialties.map((specialty: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Certifications */}
            {vendor.certifications && vendor.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Certifications & Awards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {vendor.certifications.map((cert: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {vendor.contact_name && (
                  <div>
                    <p className="text-sm text-gray-500">Contact Person</p>
                    <p className="font-medium">{vendor.contact_name}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a 
                    href={`mailto:${vendor.contact_email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {vendor.contact_email}
                  </a>
                </div>
                
                {vendor.contact_phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a 
                      href={`tel:${vendor.contact_phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {vendor.contact_phone}
                    </a>
                  </div>
                )}
                
                {vendor.website && (
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a 
                      href={vendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Visit Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Business Details */}
            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {vendor.minimum_budget && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minimum Budget</span>
                    <span className="font-semibold">
                      ${vendor.minimum_budget.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {vendor.team_size && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Team Size</span>
                    <span className="font-semibold">{vendor.team_size}</span>
                  </div>
                )}
                
                {vendor.tags && vendor.tags.length > 0 && (
                  <div>
                    <p className="text-gray-600 mb-2">Event Types</p>
                    <div className="flex flex-wrap gap-1">
                      {vendor.tags.slice(0, 5).map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">
                    {format(new Date(vendor.created_at), "MMM yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            {/* CTA Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Ready to work with {vendor.company_name}?
                </h3>
                <p className="text-sm text-blue-800 mb-4">
                  Get in touch today to discuss your event needs and get a personalized quote.
                </p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.location.href = `mailto:${vendor.contact_email}`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Request Quote
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}