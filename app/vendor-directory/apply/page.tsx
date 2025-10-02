"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Building2, CheckCircle, Mail, Phone, User, Globe, MapPin, DollarSign, Upload, Image } from "lucide-react"

export default function VendorApplicationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  
  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    location: "",
    category: "",
    services: "",
    pricing_range: "",
    description: "",
    years_in_business: "",
    team_size: "",
    minimum_budget: "",
    specialties: "",
    certifications: "",
    testimonials: "",
    why_join: "",
    logo_url: ""
  })

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Logo must be less than 5MB",
        variant: "destructive"
      })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      })
      return
    }

    setLogoFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload logo first if present
      let logoUrl = ""
      if (logoFile) {
        const formData = new FormData()
        formData.append("file", logoFile)
        
        const uploadResponse = await fetch("/api/vendors/upload", {
          method: "POST",
          body: formData
        })
        
        if (uploadResponse.ok) {
          const data = await uploadResponse.json()
          logoUrl = data.url
        }
      }

      const response = await fetch("/api/vendors/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          logo_url: logoUrl
        })
      })

      if (response.ok) {
        setSubmitted(true)
        toast({
          title: "Application Submitted!",
          description: "We'll review your application and get back to you within 2-3 business days.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to submit application. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for applying to join our vendor directory. We'll review your application and get back to you within 2-3 business days.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={() => router.push("/vendor-directory")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Return to Directory
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/vendor-directory")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Directory
            </Button>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-600 rounded-full">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Apply to Join Our Vendor Directory
              </h1>
              <p className="text-lg text-gray-600">
                Get your business in front of thousands of event planners looking for quality vendors
              </p>
            </div>
          </div>

          {/* Benefits */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Why Join Our Directory?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <span>Get discovered by qualified event planners actively searching for vendors</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <span>Free listing with no hidden fees or commissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <span>Direct contact from potential clients - no middleman</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <span>Showcase your services, portfolio, and expertise</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Application Form</CardTitle>
              <CardDescription>
                Please fill out all required fields. We'll review your application within 2-3 business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Company Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name *</Label>
                      <Input
                        id="company_name"
                        required
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        placeholder="Your Company Name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="https://yourcompany.com"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="location"
                          required
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="City, State"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Primary Category *</Label>
                      <Select 
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="event-technology">Event Technology</SelectItem>
                          <SelectItem value="event-production">Event Production</SelectItem>
                          <SelectItem value="venues-spaces">Venues & Spaces</SelectItem>
                          <SelectItem value="catering-fb">Catering & F&B</SelectItem>
                          <SelectItem value="marketing-pr">Marketing & PR</SelectItem>
                          <SelectItem value="staffing-talent">Staffing & Talent</SelectItem>
                          <SelectItem value="design-creative">Design & Creative</SelectItem>
                          <SelectItem value="transportation">Transportation</SelectItem>
                          <SelectItem value="photography-video">Photography & Video</SelectItem>
                          <SelectItem value="swag-printing">Swag & Printing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="logo">Company Logo</Label>
                    <div className="flex items-center gap-4">
                      {logoPreview && (
                        <div className="w-20 h-20 border rounded-lg overflow-hidden">
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <Label htmlFor="logo-upload" className="cursor-pointer">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Click to upload logo</p>
                            <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                          </div>
                        </Label>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_name">Contact Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="contact_name"
                          required
                          value={formData.contact_name}
                          onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                          placeholder="John Smith"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Contact Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="contact_email"
                          type="email"
                          required
                          value={formData.contact_email}
                          onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                          placeholder="john@company.com"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="contact_phone"
                        type="tel"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Business Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="years_in_business">Years in Business</Label>
                      <Input
                        id="years_in_business"
                        type="number"
                        min="0"
                        value={formData.years_in_business}
                        onChange={(e) => setFormData({ ...formData, years_in_business: e.target.value })}
                        placeholder="5"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="team_size">Team Size</Label>
                      <Select 
                        value={formData.team_size}
                        onValueChange={(value) => setFormData({ ...formData, team_size: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10</SelectItem>
                          <SelectItem value="11-50">11-50</SelectItem>
                          <SelectItem value="51-200">51-200</SelectItem>
                          <SelectItem value="200+">200+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pricing_range">Pricing Range</Label>
                      <Select 
                        value={formData.pricing_range}
                        onValueChange={(value) => setFormData({ ...formData, pricing_range: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select pricing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="$">$ - Budget Friendly</SelectItem>
                          <SelectItem value="$$">$$ - Moderate</SelectItem>
                          <SelectItem value="$$$">$$$ - Premium</SelectItem>
                          <SelectItem value="$$$$">$$$$ - Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="services">Services Offered *</Label>
                    <Textarea
                      id="services"
                      required
                      value={formData.services}
                      onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                      placeholder="List your main services (e.g., Wedding Photography, Corporate Event Photography, Portrait Sessions)"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialties">Specialties</Label>
                    <Textarea
                      id="specialties"
                      value={formData.specialties}
                      onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                      placeholder="What makes your services unique? Any special expertise or focus areas?"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minimum_budget">Minimum Budget</Label>
                      <Input
                        id="minimum_budget"
                        type="number"
                        min="0"
                        value={formData.minimum_budget}
                        onChange={(e) => setFormData({ ...formData, minimum_budget: e.target.value })}
                        placeholder="e.g., 5000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications & Awards</Label>
                      <Input
                        id="certifications"
                        value={formData.certifications}
                        onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                        placeholder="e.g., CMP, CSEP, Industry Awards"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Company Description *</Label>
                    <Textarea
                      id="description"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tell us about your company, your experience, and what makes you unique..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testimonials">Client Testimonials</Label>
                    <Textarea
                      id="testimonials"
                      value={formData.testimonials}
                      onChange={(e) => setFormData({ ...formData, testimonials: e.target.value })}
                      placeholder="Share 1-2 client testimonials that showcase your work (optional but highly recommended)"
                      rows={4}
                    />
                    <p className="text-xs text-gray-500">Including testimonials helps build trust with potential clients</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="why_join">Why do you want to join our directory? *</Label>
                    <Textarea
                      id="why_join"
                      required
                      value={formData.why_join}
                      onChange={(e) => setFormData({ ...formData, why_join: e.target.value })}
                      placeholder="Tell us why you're interested in joining our vendor directory..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/vendor-directory")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}