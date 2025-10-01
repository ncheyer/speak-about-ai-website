import { notFound } from "next/navigation"
import { neon } from "@neondatabase/serverless"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin, Globe, Mail, Phone, Calendar, Star, DollarSign,
  CheckCircle, Building2, Users, Award, Clock, FileText,
  ExternalLink, MessageSquare, Shield, TrendingUp
} from "lucide-react"
import { format } from "date-fns"

const sql = neon(process.env.DATABASE_URL!)

async function getVendor(slug: string) {
  try {
    // Try to find by slug first, then by ID
    const vendors = await sql`
      SELECT * FROM vendors 
      WHERE slug = ${slug} OR (id::text = ${slug} AND slug IS NULL)
      LIMIT 1
    `
    
    if (vendors.length === 0) {
      return null
    }
    
    return vendors[0]
  } catch (error) {
    console.error("Error fetching vendor:", error)
    return null
  }
}

async function getVendorReviews(vendorId: number) {
  try {
    const reviews = await sql`
      SELECT * FROM vendor_reviews
      WHERE vendor_id = ${vendorId}
      AND status = 'approved'
      ORDER BY created_at DESC
      LIMIT 10
    `
    return reviews
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return []
  }
}

export default async function VendorDetailPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const vendor = await getVendor(params.slug)
  
  if (!vendor) {
    notFound()
  }
  
  const reviews = await getVendorReviews(vendor.id)
  
  const averageRating = vendor.average_rating || 0
  const totalReviews = vendor.total_reviews || 0
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <Avatar className="h-32 w-32 border-4 border-gray-100">
              <AvatarImage src={vendor.logo_url} />
              <AvatarFallback className="text-3xl font-bold">
                {vendor.company_name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
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
                  
                  {/* Rating */}
                  {totalReviews > 0 && (
                    <div className="flex items-center gap-2 mb-4">
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
                      <span className="text-gray-500">({totalReviews} reviews)</span>
                    </div>
                  )}
                  
                  {/* Tags/Services */}
                  {vendor.services && vendor.services.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {vendor.services.map((service: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button size="lg">
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
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {vendor.description || "No description available."}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Services & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                {vendor.services && vendor.services.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vendor.services.map((service: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No services listed</p>
                )}
              </CardContent>
            </Card>
            
            {/* Reviews Section */}
            {reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>
                    What clients are saying about {vendor.company_name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{review.reviewer_name}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {format(new Date(review.created_at), "MMM d, yyyy")}
                          </span>
                        </div>
                        <p className="text-gray-600">{review.review_text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a 
                      href={`mailto:${vendor.contact_email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {vendor.contact_email}
                    </a>
                  </div>
                </div>
                
                {vendor.contact_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a 
                        href={`tel:${vendor.contact_phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {vendor.contact_phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {vendor.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a 
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
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
                
                {vendor.years_in_business && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Years in Business</span>
                    <span className="font-semibold">{vendor.years_in_business}</span>
                  </div>
                )}
                
                {vendor.tags && vendor.tags.length > 0 && (
                  <div>
                    <p className="text-gray-600 mb-2">Languages</p>
                    <div className="flex flex-wrap gap-1">
                      {vendor.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
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
                
                {vendor.status === "approved" && vendor.approved_at && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">Verified Vendor</span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* CTA Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Ready to work with {vendor.company_name}?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get in touch today to discuss your event needs.
                </p>
                <Button className="w-full">
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