"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Upload, Plus, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SpeakerApplicationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    email: "",
    phone: "",
    title: "",
    company: "",
    website: "",
    
    // Bio
    bio: "",
    short_bio: "",
    one_liner: "",
    
    // Social Media
    linkedin: "",
    twitter: "",
    instagram: "",
    youtube: "",
    
    // Speaking Topics
    primary_topics: [""],
    secondary_topics: [""],
    keywords: "",
    
    // Experience
    years_speaking: "",
    total_engagements: "",
    industries_served: "",
    notable_clients: "",
    certifications: "",
    awards: "",
    
    // Requirements
    speaking_fee_min: "",
    speaking_fee_max: "",
    travel_preferences: "",
    technical_requirements: "",
    dietary_restrictions: "",
    preferred_event_types: [] as string[],
    
    // Media URLs
    headshot_url: "",
    speaker_reel_url: "",
    one_sheet_url: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTopicChange = (type: 'primary_topics' | 'secondary_topics', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((topic, i) => i === index ? value : topic)
    }))
  }

  const addTopic = (type: 'primary_topics' | 'secondary_topics') => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ""]
    }))
  }

  const removeTopic = (type: 'primary_topics' | 'secondary_topics', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const handleEventTypeToggle = (eventType: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_event_types: prev.preferred_event_types.includes(eventType)
        ? prev.preferred_event_types.filter(type => type !== eventType)
        : [...prev.preferred_event_types, eventType]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        social_media: {
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          instagram: formData.instagram,
          youtube: formData.youtube
        },
        primary_topics: formData.primary_topics.filter(t => t.trim()),
        secondary_topics: formData.secondary_topics.filter(t => t.trim()),
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
        industries_served: formData.industries_served.split(',').map(i => i.trim()).filter(i => i),
        notable_clients: formData.notable_clients.split(',').map(c => c.trim()).filter(c => c),
        certifications: formData.certifications.split(',').map(c => c.trim()).filter(c => c),
        awards: formData.awards.split(',').map(a => a.trim()).filter(a => a),
        years_speaking: formData.years_speaking ? parseInt(formData.years_speaking) : null,
        total_engagements: formData.total_engagements ? parseInt(formData.total_engagements) : null,
        speaking_fee_min: formData.speaking_fee_min ? parseFloat(formData.speaking_fee_min) : null,
        speaking_fee_max: formData.speaking_fee_max ? parseFloat(formData.speaking_fee_max) : null,
        speaking_fee_range: formData.speaking_fee_min && formData.speaking_fee_max 
          ? `$${formData.speaking_fee_min} - $${formData.speaking_fee_max}`
          : undefined
      }

      const response = await fetch("/api/speakers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/speakers/thank-you")
      }, 2000)
    } catch (err) {
      console.error("Error submitting application:", err)
      setError(err instanceof Error ? err.message : "Failed to submit application")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your speaker application has been submitted successfully! We'll review it and get back to you soon.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Speaker Application</h1>
          <p className="text-gray-600">Join our network of expert speakers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., CEO, Author, Consultant"
                />
              </div>
              <div>
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </Card>

          {/* Bio Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Speaker Bio</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="one_liner">One-Liner (Tagline)</Label>
                <Input
                  id="one_liner"
                  name="one_liner"
                  value={formData.one_liner}
                  onChange={handleInputChange}
                  placeholder="Your compelling speaker tagline"
                  maxLength={255}
                />
              </div>
              <div>
                <Label htmlFor="short_bio">Short Bio (For Marketing) *</Label>
                <Textarea
                  id="short_bio"
                  name="short_bio"
                  value={formData.short_bio}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  placeholder="A brief 2-3 sentence bio for event promotions"
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.short_bio.length}/500 characters
                </p>
              </div>
              <div>
                <Label htmlFor="bio">Full Bio *</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={6}
                  required
                  placeholder="Your complete professional biography"
                />
              </div>
            </div>
          </Card>

          {/* Speaking Topics */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Speaking Topics</h2>
            <div className="space-y-4">
              <div>
                <Label>Primary Speaking Topics *</Label>
                <p className="text-sm text-gray-500 mb-2">List your main areas of expertise</p>
                {formData.primary_topics.map((topic, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={topic}
                      onChange={(e) => handleTopicChange('primary_topics', index, e.target.value)}
                      placeholder="e.g., Artificial Intelligence"
                      required={index === 0}
                    />
                    {formData.primary_topics.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTopic('primary_topics', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTopic('primary_topics')}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Topic
                </Button>
              </div>

              <div>
                <Label>Secondary Topics</Label>
                <p className="text-sm text-gray-500 mb-2">Additional topics you can speak about</p>
                {formData.secondary_topics.map((topic, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={topic}
                      onChange={(e) => handleTopicChange('secondary_topics', index, e.target.value)}
                      placeholder="e.g., Innovation"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTopic('secondary_topics', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTopic('secondary_topics')}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Topic
                </Button>
              </div>

              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  placeholder="Comma-separated keywords for search"
                />
              </div>
            </div>
          </Card>

          {/* Experience */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Speaking Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="years_speaking">Years of Speaking Experience</Label>
                <Input
                  id="years_speaking"
                  name="years_speaking"
                  type="number"
                  value={formData.years_speaking}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="total_engagements">Approximate Total Engagements</Label>
                <Input
                  id="total_engagements"
                  name="total_engagements"
                  type="number"
                  value={formData.total_engagements}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="industries_served">Industries Served</Label>
                <Input
                  id="industries_served"
                  name="industries_served"
                  value={formData.industries_served}
                  onChange={handleInputChange}
                  placeholder="Comma-separated list (e.g., Technology, Healthcare, Finance)"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notable_clients">Notable Clients</Label>
                <Input
                  id="notable_clients"
                  name="notable_clients"
                  value={formData.notable_clients}
                  onChange={handleInputChange}
                  placeholder="Comma-separated list"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="certifications">Relevant Certifications</Label>
                <Input
                  id="certifications"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  placeholder="Comma-separated list"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="awards">Awards & Recognition</Label>
                <Input
                  id="awards"
                  name="awards"
                  value={formData.awards}
                  onChange={handleInputChange}
                  placeholder="Comma-separated list"
                />
              </div>
            </div>
          </Card>

          {/* Speaking Requirements */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Speaking Requirements & Fees</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="speaking_fee_min">Minimum Speaking Fee (USD)</Label>
                  <Input
                    id="speaking_fee_min"
                    name="speaking_fee_min"
                    type="number"
                    value={formData.speaking_fee_min}
                    onChange={handleInputChange}
                    placeholder="5000"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="speaking_fee_max">Maximum Speaking Fee (USD)</Label>
                  <Input
                    id="speaking_fee_max"
                    name="speaking_fee_max"
                    type="number"
                    value={formData.speaking_fee_max}
                    onChange={handleInputChange}
                    placeholder="25000"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label>Preferred Event Types</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {['Keynote', 'Workshop', 'Panel', 'Seminar', 'Conference', 'Virtual'].map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.preferred_event_types.includes(type)}
                        onChange={() => handleEventTypeToggle(type)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="travel_preferences">Travel Preferences</Label>
                <Textarea
                  id="travel_preferences"
                  name="travel_preferences"
                  value={formData.travel_preferences}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="e.g., Prefer direct flights, need business class for international"
                />
              </div>

              <div>
                <Label htmlFor="technical_requirements">Technical Requirements</Label>
                <Textarea
                  id="technical_requirements"
                  name="technical_requirements"
                  value={formData.technical_requirements}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="e.g., Wireless microphone, confidence monitor, HDMI connection"
                />
              </div>

              <div>
                <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
                <Input
                  id="dietary_restrictions"
                  name="dietary_restrictions"
                  value={formData.dietary_restrictions}
                  onChange={handleInputChange}
                  placeholder="e.g., Vegetarian, Gluten-free"
                />
              </div>
            </div>
          </Card>

          {/* Media & Materials */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Media & Materials</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="headshot_url">Professional Headshot URL</Label>
                <Input
                  id="headshot_url"
                  name="headshot_url"
                  type="url"
                  value={formData.headshot_url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="speaker_reel_url">Speaker Reel/Video URL</Label>
                <Input
                  id="speaker_reel_url"
                  name="speaker_reel_url"
                  type="url"
                  value={formData.speaker_reel_url}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div>
                <Label htmlFor="one_sheet_url">One-Sheet/Media Kit URL</Label>
                <Input
                  id="one_sheet_url"
                  name="one_sheet_url"
                  type="url"
                  value={formData.one_sheet_url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>
            </div>
          </Card>

          {/* Social Media */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Social Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter/X Handle</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  placeholder="@username"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram Handle</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  placeholder="@username"
                />
              </div>
              <div>
                <Label htmlFor="youtube">YouTube Channel</Label>
                <Input
                  id="youtube"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}