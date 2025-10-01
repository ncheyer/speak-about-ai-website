"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Building2, User, Mail, Phone, Globe, Calendar, MapPin, 
  DollarSign, Clock, Upload, CheckCircle, Loader2, ArrowRight,
  Linkedin, Languages, Users, Star, FileText, AlertCircle
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const eventTypes = [
  "Corporate Events",
  "Weddings", 
  "Conferences",
  "Festivals",
  "Private Parties",
  "Galas",
  "Product Launches",
  "Concerts",
  "Trade Shows"
]

const secondaryServices = [
  "AV",
  "Catering",
  "Venues",
  "Production",
  "Swag",
  "Florals",
  "Photography/Video",
  "Entertainment/Talent",
  "Staffing",
  "Transportation"
]

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Mandarin",
  "Cantonese",
  "Japanese",
  "Korean",
  "Arabic"
]

const pricingStructures = [
  "Hourly",
  "Flat Fee",
  "Percentage-based",
  "Per person",
  "Custom Quote"
]

const serviceAreas = [
  "Local",
  "Regional", 
  "National",
  "International"
]

export default function VendorApplicationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  
  const [formData, setFormData] = useState({
    // Basic Info
    email: "",
    company_name: "",
    primary_contact_name: "",
    primary_contact_role: "",
    primary_contact_linkedin: "",
    business_email: "",
    business_phone: "",
    company_website: "",
    years_in_business: "",
    business_description: "",
    
    // Services
    primary_category: "",
    secondary_services: [] as string[],
    specialty_capabilities: "",
    
    // Event Details
    event_types: [] as string[],
    average_event_size: "",
    
    // Location
    headquarters_location: "",
    service_areas: [] as string[],
    specific_regions: "",
    travel_fees_applicable: false,
    travel_fee_policy: "",
    
    // Pricing
    budget_minimum: "",
    budget_maximum: "",
    pricing_structure: [] as string[],
    payment_terms: "",
    
    // Portfolio
    portfolio_link: "",
    awards_recognition: "",
    review_links: "",
    
    // Operations
    typical_lead_time: "",
    works_with_vendors: false,
    preferred_partners: "",
    languages: [] as string[],
    accessibility_accommodations: ""
  })

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Logo must be less than 5MB",
          variant: "destructive"
        })
        return
      }
      
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateStep = (step: number): boolean => {
    switch(step) {
      case 1:
        return !!(
          formData.email &&
          formData.company_name &&
          formData.primary_contact_name &&
          formData.primary_contact_role &&
          formData.business_email &&
          formData.business_phone &&
          formData.company_website &&
          formData.years_in_business &&
          formData.business_description
        )
      case 2:
        return !!(
          formData.primary_category &&
          formData.secondary_services.length > 0 &&
          formData.event_types.length > 0
        )
      case 3:
        return !!(
          formData.headquarters_location &&
          formData.service_areas.length > 0 &&
          formData.specific_regions
        )
      case 4:
        return !!(
          formData.budget_minimum &&
          formData.budget_maximum &&
          formData.pricing_structure.length > 0
        )
      case 5:
        return !!(
          formData.portfolio_link &&
          formData.languages.length > 0
        )
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      // Upload logo if provided
      let logoUrl = ""
      if (logoFile) {
        const formData = new FormData()
        formData.append("file", logoFile)
        
        const uploadRes = await fetch("/api/vendors/upload", {
          method: "POST",
          body: formData
        })
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          logoUrl = uploadData.url
        }
      }
      
      // Submit application
      const response = await fetch("/api/vendors/applications", {
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
          description: "We'll review your application and get back to you soon."
        })
      } else {
        throw new Error("Failed to submit application")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="pt-12 pb-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Application Received!
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Thank you for applying to join our vendor directory.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
                <h3 className="font-semibold mb-3">What happens next?</h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>1. We'll review your application within 2-3 business days</li>
                  <li>2. You'll receive an email with our decision</li>
                  <li>3. If approved, we'll send you login credentials</li>
                  <li>4. You can then manage your profile and listings</li>
                </ol>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => router.push("/directory")}
                >
                  Return to Directory
                </Button>
                <Button onClick={() => router.push("/")}>
                  Go to Homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const totalSteps = 5

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vendor Directory Application
          </h1>
          <p className="text-lg text-gray-600">
            Join our curated network of event service providers
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-600">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Services & Capabilities"}
              {currentStep === 3 && "Service Areas & Coverage"}
              {currentStep === 4 && "Pricing & Terms"}
              {currentStep === 5 && "Portfolio & Additional Info"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about your company and primary contact"}
              {currentStep === 2 && "Describe your services and event expertise"}
              {currentStep === 3 && "Where do you operate and serve clients?"}
              {currentStep === 4 && "Help clients understand your pricing"}
              {currentStep === 5 && "Showcase your work and capabilities"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primary_contact_name">Primary Contact Name *</Label>
                    <Input
                      id="primary_contact_name"
                      value={formData.primary_contact_name}
                      onChange={(e) => setFormData({...formData, primary_contact_name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primary_contact_role">Primary Contact Role *</Label>
                    <Input
                      id="primary_contact_role"
                      value={formData.primary_contact_role}
                      onChange={(e) => setFormData({...formData, primary_contact_role: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primary_contact_linkedin">LinkedIn Profile</Label>
                    <Input
                      id="primary_contact_linkedin"
                      value={formData.primary_contact_linkedin}
                      onChange={(e) => setFormData({...formData, primary_contact_linkedin: e.target.value})}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business_email">Business Email *</Label>
                    <Input
                      id="business_email"
                      type="email"
                      value={formData.business_email}
                      onChange={(e) => setFormData({...formData, business_email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business_phone">Business Phone *</Label>
                    <Input
                      id="business_phone"
                      type="tel"
                      value={formData.business_phone}
                      onChange={(e) => setFormData({...formData, business_phone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_website">Company Website *</Label>
                    <Input
                      id="company_website"
                      type="url"
                      value={formData.company_website}
                      onChange={(e) => setFormData({...formData, company_website: e.target.value})}
                      placeholder="https://..."
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="years_in_business">Years in Business *</Label>
                    <Input
                      id="years_in_business"
                      type="number"
                      min="0"
                      value={formData.years_in_business}
                      onChange={(e) => setFormData({...formData, years_in_business: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="business_description">Business Description (1-2 sentences) *</Label>
                  <Textarea
                    id="business_description"
                    rows={3}
                    value={formData.business_description}
                    onChange={(e) => setFormData({...formData, business_description: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logo">Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="flex-1"
                    />
                    {logoPreview && (
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="h-16 w-16 object-contain border rounded"
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Max file size: 5MB</p>
                </div>
              </>
            )}

            {/* Step 2: Services & Capabilities */}
            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="primary_category">Primary Vendor Category *</Label>
                  <Select 
                    value={formData.primary_category}
                    onValueChange={(value) => setFormData({...formData, primary_category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="av_production">AV & Production</SelectItem>
                      <SelectItem value="catering">Catering & Food Service</SelectItem>
                      <SelectItem value="venues">Venues & Spaces</SelectItem>
                      <SelectItem value="entertainment">Entertainment & Talent</SelectItem>
                      <SelectItem value="decor">Decor & Florals</SelectItem>
                      <SelectItem value="photography">Photography & Video</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="staffing">Staffing & Personnel</SelectItem>
                      <SelectItem value="marketing">Marketing & Promotion</SelectItem>
                      <SelectItem value="other">Other Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Secondary Services Offered *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {secondaryServices.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={formData.secondary_services.includes(service)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                secondary_services: [...formData.secondary_services, service]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                secondary_services: formData.secondary_services.filter(s => s !== service)
                              })
                            }
                          }}
                        />
                        <label htmlFor={service} className="text-sm">{service}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialty_capabilities">
                    Specialty Capabilities or Certifications
                  </Label>
                  <Textarea
                    id="specialty_capabilities"
                    rows={3}
                    value={formData.specialty_capabilities}
                    onChange={(e) => setFormData({...formData, specialty_capabilities: e.target.value})}
                    placeholder="e.g., sustainable practices, minority-owned, specific equipment"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Event Types Served *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {eventTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={formData.event_types.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                event_types: [...formData.event_types, type]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                event_types: formData.event_types.filter(t => t !== type)
                              })
                            }
                          }}
                        />
                        <label htmlFor={type} className="text-sm">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="average_event_size">Average Event Size (attendees)</Label>
                  <Select
                    value={formData.average_event_size}
                    onValueChange={(value) => setFormData({...formData, average_event_size: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select average size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">1-50 attendees</SelectItem>
                      <SelectItem value="medium">51-200 attendees</SelectItem>
                      <SelectItem value="large">201-500 attendees</SelectItem>
                      <SelectItem value="xlarge">501-1000 attendees</SelectItem>
                      <SelectItem value="enterprise">1000+ attendees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 3: Service Areas & Coverage */}
            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="headquarters_location">
                    Headquarters Location (City, State/Province, Country) *
                  </Label>
                  <Input
                    id="headquarters_location"
                    value={formData.headquarters_location}
                    onChange={(e) => setFormData({...formData, headquarters_location: e.target.value})}
                    placeholder="e.g., San Francisco, CA, USA"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Service Areas *</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {serviceAreas.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={formData.service_areas.includes(area)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                service_areas: [...formData.service_areas, area]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                service_areas: formData.service_areas.filter(a => a !== area)
                              })
                            }
                          }}
                        />
                        <label htmlFor={area} className="text-sm">{area}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specific_regions">Specific Cities/Regions Covered *</Label>
                  <Textarea
                    id="specific_regions"
                    rows={3}
                    value={formData.specific_regions}
                    onChange={(e) => setFormData({...formData, specific_regions: e.target.value})}
                    placeholder="List the specific cities or regions you serve"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Are travel fees applicable?</Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="travel_fees"
                        checked={formData.travel_fees_applicable === true}
                        onChange={() => setFormData({...formData, travel_fees_applicable: true})}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="travel_fees"
                        checked={formData.travel_fees_applicable === false}
                        onChange={() => setFormData({...formData, travel_fees_applicable: false})}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                
                {formData.travel_fees_applicable && (
                  <div className="space-y-2">
                    <Label htmlFor="travel_fee_policy">Travel Fee Policy</Label>
                    <Textarea
                      id="travel_fee_policy"
                      rows={3}
                      value={formData.travel_fee_policy}
                      onChange={(e) => setFormData({...formData, travel_fee_policy: e.target.value})}
                      placeholder="Describe your travel fee structure"
                    />
                  </div>
                )}
              </>
            )}

            {/* Step 4: Pricing & Terms */}
            {currentStep === 4 && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget_minimum">Minimum Project Budget ($) *</Label>
                    <Input
                      id="budget_minimum"
                      type="number"
                      min="0"
                      value={formData.budget_minimum}
                      onChange={(e) => setFormData({...formData, budget_minimum: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget_maximum">Maximum Project Budget ($) *</Label>
                    <Input
                      id="budget_maximum"
                      type="number"
                      min="0"
                      value={formData.budget_maximum}
                      onChange={(e) => setFormData({...formData, budget_maximum: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Pricing Structure *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {pricingStructures.map((structure) => (
                      <div key={structure} className="flex items-center space-x-2">
                        <Checkbox
                          id={structure}
                          checked={formData.pricing_structure.includes(structure)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                pricing_structure: [...formData.pricing_structure, structure]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                pricing_structure: formData.pricing_structure.filter(s => s !== structure)
                              })
                            }
                          }}
                        />
                        <label htmlFor={structure} className="text-sm">{structure}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment_terms">Payment Terms</Label>
                  <Textarea
                    id="payment_terms"
                    rows={3}
                    value={formData.payment_terms}
                    onChange={(e) => setFormData({...formData, payment_terms: e.target.value})}
                    placeholder="e.g., 50% deposit, net 30 days"
                  />
                </div>
              </>
            )}

            {/* Step 5: Portfolio & Additional Info */}
            {currentStep === 5 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="portfolio_link">Link to Portfolio or Case Studies *</Label>
                  <Input
                    id="portfolio_link"
                    type="url"
                    value={formData.portfolio_link}
                    onChange={(e) => setFormData({...formData, portfolio_link: e.target.value})}
                    placeholder="https://..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="awards_recognition">Awards or Industry Recognition</Label>
                  <Textarea
                    id="awards_recognition"
                    rows={3}
                    value={formData.awards_recognition}
                    onChange={(e) => setFormData({...formData, awards_recognition: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="review_links">Links to Reviews (Google, Yelp, etc.)</Label>
                  <Textarea
                    id="review_links"
                    rows={2}
                    value={formData.review_links}
                    onChange={(e) => setFormData({...formData, review_links: e.target.value})}
                    placeholder="One link per line"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="typical_lead_time">Typical Lead Time Required</Label>
                  <Input
                    id="typical_lead_time"
                    value={formData.typical_lead_time}
                    onChange={(e) => setFormData({...formData, typical_lead_time: e.target.value})}
                    placeholder="e.g., 2 weeks, 30 days"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Do you work with other vendors?</Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="works_with_vendors"
                        checked={formData.works_with_vendors === true}
                        onChange={() => setFormData({...formData, works_with_vendors: true})}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="works_with_vendors"
                        checked={formData.works_with_vendors === false}
                        onChange={() => setFormData({...formData, works_with_vendors: false})}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                
                {formData.works_with_vendors && (
                  <div className="space-y-2">
                    <Label htmlFor="preferred_partners">Preferred Partner List</Label>
                    <Textarea
                      id="preferred_partners"
                      rows={3}
                      value={formData.preferred_partners}
                      onChange={(e) => setFormData({...formData, preferred_partners: e.target.value})}
                      placeholder="List your preferred vendor partners"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Languages Spoken by Your Team *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {languages.map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={language}
                          checked={formData.languages.includes(language)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                languages: [...formData.languages, language]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                languages: formData.languages.filter(l => l !== language)
                              })
                            }
                          }}
                        />
                        <label htmlFor={language} className="text-sm">{language}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accessibility_accommodations">
                    Accessibility Accommodations Offered
                  </Label>
                  <Textarea
                    id="accessibility_accommodations"
                    rows={3}
                    value={formData.accessibility_accommodations}
                    onChange={(e) => setFormData({...formData, accessibility_accommodations: e.target.value})}
                    placeholder="e.g., accessible venues, sign language interpreters, sensory-friendly options"
                  />
                </div>
              </>
            )}
            
            <Separator />
            
            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!validateStep(currentStep)}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !validateStep(currentStep)}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}