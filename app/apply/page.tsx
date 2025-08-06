"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Loader2, 
  CheckCircle, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Linkedin,
  MapPin,
  Briefcase,
  Mic,
  DollarSign,
  Plane,
  Video,
  Users
} from "lucide-react"
import Link from "next/link"

const EXPERTISE_AREAS = [
  "Artificial Intelligence & Machine Learning",
  "Business Strategy & Leadership",
  "Digital Transformation",
  "Innovation & Future Trends",
  "Data & Analytics",
  "Cybersecurity",
  "Ethics & Responsible AI",
  "Healthcare & Life Sciences",
  "Finance & Banking",
  "Retail & E-commerce",
  "Manufacturing & Supply Chain",
  "Education & Learning",
  "Marketing & Customer Experience",
  "Human Resources & Future of Work",
  "Sustainability & Climate Tech"
]

const SPEAKING_FORMATS = [
  { value: "keynote", label: "Keynote Presentations" },
  { value: "workshop", label: "Workshops & Masterclasses" },
  { value: "panel", label: "Panel Discussions" },
  { value: "fireside", label: "Fireside Chats" },
  { value: "virtual", label: "Virtual Presentations" },
  { value: "multi-day", label: "Multi-day Programs" }
]

const FEE_RANGES = [
  "Under $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000 - $100,000",
  "Above $100,000",
  "Negotiable"
]

export default function SpeakerApplicationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    // Personal Information
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    website: "",
    linkedin_url: "",
    location: "",
    
    // Professional Information
    title: "",
    company: "",
    bio: "",
    expertise_areas: [] as string[],
    speaking_topics: "",
    
    // Experience
    years_speaking: "",
    previous_engagements: "",
    video_links: [""],
    reference_contacts: "",
    
    // Logistics
    speaking_fee_range: "",
    travel_requirements: "",
    available_formats: [] as string[],
  })

  const handleExpertiseChange = (area: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      expertise_areas: checked 
        ? [...prev.expertise_areas, area]
        : prev.expertise_areas.filter(a => a !== area)
    }))
  }

  const handleFormatChange = (format: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      available_formats: checked 
        ? [...prev.available_formats, format]
        : prev.available_formats.filter(f => f !== format)
    }))
  }

  const addVideoLink = () => {
    setFormData(prev => ({
      ...prev,
      video_links: [...prev.video_links, ""]
    }))
  }

  const updateVideoLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      video_links: prev.video_links.map((link, i) => i === index ? value : link)
    }))
  }

  const removeVideoLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      video_links: prev.video_links.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Filter out empty video links
      const cleanedData = {
        ...formData,
        video_links: formData.video_links.filter(link => link.trim() !== ""),
        years_speaking: formData.years_speaking ? parseInt(formData.years_speaking) : null
      }

      const response = await fetch("/api/speaker-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        setError(data.error || "Failed to submit application. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      setError("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-12 pb-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Application Submitted Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for applying to join Speak About AI. Our team will review your application 
                and get back to you within 5-7 business days.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                If approved, you'll receive an invitation email with instructions to create your speaker account.
              </p>
              <Link href="/">
                <Button>Return to Homepage</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join Speak About AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Apply to become part of our exclusive network of AI and technology thought leaders
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      required
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    required
                    placeholder="City, State/Country"
                    className="pl-10"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      type="url"
                      className="pl-10"
                      placeholder="https://..."
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="linkedin_url"
                      type="url"
                      className="pl-10"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Information
              </CardTitle>
              <CardDescription>Your professional background and expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Current Title *</Label>
                  <Input
                    id="title"
                    required
                    placeholder="e.g., Chief AI Officer"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company/Organization *</Label>
                  <Input
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  required
                  rows={6}
                  placeholder="Tell us about your background, achievements, and what makes you a compelling speaker..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
                <p className="text-sm text-gray-500 mt-1">Minimum 100 characters</p>
              </div>

              <div>
                <Label>Areas of Expertise *</Label>
                <p className="text-sm text-gray-500 mb-3">Select all that apply</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {EXPERTISE_AREAS.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={formData.expertise_areas.includes(area)}
                        onCheckedChange={(checked) => handleExpertiseChange(area, checked as boolean)}
                      />
                      <Label htmlFor={area} className="text-sm font-normal cursor-pointer">
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="speaking_topics">Speaking Topics *</Label>
                <Textarea
                  id="speaking_topics"
                  required
                  rows={4}
                  placeholder="List the specific topics you speak about, separated by commas..."
                  value={formData.speaking_topics}
                  onChange={(e) => setFormData({...formData, speaking_topics: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Speaking Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Speaking Experience
              </CardTitle>
              <CardDescription>Your track record as a speaker</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="years_speaking">Years of Speaking Experience</Label>
                <Input
                  id="years_speaking"
                  type="number"
                  min="0"
                  placeholder="e.g., 5"
                  value={formData.years_speaking}
                  onChange={(e) => setFormData({...formData, years_speaking: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="previous_engagements">Previous Speaking Engagements</Label>
                <Textarea
                  id="previous_engagements"
                  rows={4}
                  placeholder="List notable conferences, events, or organizations you've spoken at..."
                  value={formData.previous_engagements}
                  onChange={(e) => setFormData({...formData, previous_engagements: e.target.value})}
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Video Links
                </Label>
                <p className="text-sm text-gray-500 mb-2">Share links to your speaking videos</p>
                {formData.video_links.map((link, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={link}
                      onChange={(e) => updateVideoLink(index, e.target.value)}
                    />
                    {formData.video_links.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeVideoLink(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVideoLink}
                >
                  Add Another Video
                </Button>
              </div>

              <div>
                <Label htmlFor="reference_contacts">References</Label>
                <Textarea
                  id="reference_contacts"
                  rows={3}
                  placeholder="Provide contact information for 1-2 professional references..."
                  value={formData.reference_contacts}
                  onChange={(e) => setFormData({...formData, reference_contacts: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Logistics & Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Logistics & Availability
              </CardTitle>
              <CardDescription>Your speaking requirements and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="speaking_fee_range">Speaking Fee Range</Label>
                <Select
                  value={formData.speaking_fee_range}
                  onValueChange={(value) => setFormData({...formData, speaking_fee_range: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee range" />
                  </SelectTrigger>
                  <SelectContent>
                    {FEE_RANGES.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Available Speaking Formats</Label>
                <p className="text-sm text-gray-500 mb-3">Select all formats you're available for</p>
                <div className="space-y-2">
                  {SPEAKING_FORMATS.map((format) => (
                    <div key={format.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={format.value}
                        checked={formData.available_formats.includes(format.value)}
                        onCheckedChange={(checked) => handleFormatChange(format.value, checked as boolean)}
                      />
                      <Label htmlFor={format.value} className="text-sm font-normal cursor-pointer">
                        {format.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="travel_requirements">Travel Requirements & Preferences</Label>
                <Textarea
                  id="travel_requirements"
                  rows={3}
                  placeholder="Any specific travel requirements or restrictions..."
                  value={formData.travel_requirements}
                  onChange={(e) => setFormData({...formData, travel_requirements: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By submitting this application, you agree to our{" "}
            <Link href="/terms" className="underline">Terms of Service</Link> and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}