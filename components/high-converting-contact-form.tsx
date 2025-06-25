"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Sparkles } from "lucide-react"

interface FormData {
  name: string
  email: string
  phone: string
  organizationName: string
  specificSpeaker: string
  eventDate: string
  eventLocation: string
  eventBudget: string
  additionalInfo: string
  newsletterOptOut: boolean // Changed from newsletterSignup to newsletterOptOut
}

export default function HighConvertingContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    organizationName: "",
    specificSpeaker: "",
    eventDate: "",
    eventLocation: "",
    eventBudget: "",
    additionalInfo: "",
    newsletterOptOut: false, // Default to false, meaning they are opted-IN unless they check the box
  })

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Interpret newsletterOptOut: if false (box unchecked), they want the newsletter.
    // If true (box checked), they want to be taken off.
    // For Zapier, you might want to send a clear "subscribed_to_newsletter: true/false"
    const wantsNewsletter = !formData.newsletterOptOut

    try {
      const response = await fetch("https://hooks.zapier.com/hooks/catch/23536588/ubtw516/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          wantsNewsletter,
          submittedAt: new Date().toISOString(),
          source: "contact-2-single-step-form-v3-opt-out",
        }),
      })

      console.log("Zapier response status:", response.status)
      console.log("Zapier response status text:", response.statusText)
      // Try to clone the response before reading the body, so it can be read again if needed
      // or handle cases where it might not be readable as text.
      let responseBody = ""
      try {
        responseBody = await response.clone().text() // Clone to read body safely
      } catch (e) {
        console.warn("Could not clone or read response body as text:", e)
      }
      console.log("Zapier response body:", responseBody)

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        console.error("Zapier submission failed. Status:", response.status, "Response Body:", responseBody)
        throw new Error(`Failed to submit form. Status: ${response.status}. Response: ${responseBody}`)
      }
    } catch (error: any) {
      console.error("Detailed error submitting form to Zapier:", {
        errorMessage: error.message,
        errorStack: error.stack,
        errorObject: error,
      })
      alert("There was an error submitting your request. Please try again or call us directly at (510) 435-3947.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EAEAEE] to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🎉 Request Received!</h1>
            <p className="text-xl text-gray-600">
              Our speaker experts will be in touch with a quote & proposal shortly.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next:</h3>
            <div className="space-y-2 text-left text-gray-700">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Our team reviews your event requirements.</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>We identify suitable AI keynote speakers from our network.</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>You receive personalized recommendations and quotes.</span>
              </div>
            </div>
          </div>
          {/* Logic for displaying newsletter status on success page */}
          {!formData.newsletterOptOut ? (
            <p className="text-sm text-gray-600 mb-4">
              You're subscribed to our newsletter for updates on new speakers and AI trends!
            </p>
          ) : (
            <p className="text-sm text-gray-600 mb-4">You have been unsubscribed from our newsletter.</p>
          )}
          <p className="text-gray-600 mb-4">
            Questions? Call us directly: <span className="font-semibold text-orange-600">(510) 435-3947</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAEAEE] to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Badge
              variant="outline"
              className="border-orange-600 text-orange-700 bg-orange-50 px-4 py-2 text-sm font-semibold"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Free Speaker Quote & Proposal
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Get Your Perfect AI Keynote Speaker <span className="text-orange-600">Today</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Please be as detailed as possible about your event to help us quickly identify the right expert for you.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal & Organization Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="Your full name"
                  required
                  className="h-11"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="h-11"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (optional)
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  className="h-11"
                />
              </div>
              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name *
                </label>
                <Input
                  id="organizationName"
                  type="text"
                  value={formData.organizationName}
                  onChange={(e) => updateFormData("organizationName", e.target.value)}
                  placeholder="Your company or organization"
                  required
                  className="h-11"
                />
              </div>
            </div>

            {/* Event Details */}
            <div>
              <label htmlFor="specificSpeaker" className="block text-sm font-medium text-gray-700 mb-1">
                Do you have a specific speaker in mind?
              </label>
              <Input
                id="specificSpeaker"
                type="text"
                value={formData.specificSpeaker}
                onChange={(e) => updateFormData("specificSpeaker", e.target.value)}
                placeholder="Speaker name or 'No preference'"
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date (optional)
                </label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => updateFormData("eventDate", e.target.value)}
                  className="h-11"
                />
              </div>
              <div>
                <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Location (optional)
                </label>
                <Input
                  id="eventLocation"
                  type="text"
                  value={formData.eventLocation}
                  onChange={(e) => updateFormData("eventLocation", e.target.value)}
                  placeholder="City, State or Virtual"
                  className="h-11"
                />
              </div>
            </div>

            <div>
              <label htmlFor="eventBudget" className="block text-sm font-medium text-gray-700 mb-1">
                Event Budget *
              </label>
              <Select
                value={formData.eventBudget}
                onValueChange={(value) => updateFormData("eventBudget", value)}
                required
              >
                <SelectTrigger id="eventBudget" className="h-11">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-10k">Under $10,000</SelectItem>
                  <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                  <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="100k+">$100,000+</SelectItem>
                  <SelectItem value="flexible">Flexible/Discuss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Information */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                What additional information would you like us to know about your organization, industry, or event? *
              </label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                className="min-h-[120px]"
                placeholder="Share details about your event theme, audience, specific topics of interest, or any other requirements..."
                required
              />
            </div>

            {/* Newsletter Opt-Out */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletterOptOut"
                checked={formData.newsletterOptOut} // Checked means they want to opt OUT
                onCheckedChange={(checked) => updateFormData("newsletterOptOut", Boolean(checked))}
              />
              <label
                htmlFor="newsletterOptOut"
                className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Take me off Speak About AI's newsletter for updates on new speakers and AI trends.
              </label>
            </div>

            {/* Value Proposition & Submit */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Star className="h-5 w-5 text-orange-600 mr-2" />
                What you'll get:
              </h3>
              <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                <li>Personalized speaker recommendations</li>
                <li>Availability checks and direct quotes</li>
                <li>Expert guidance from our speaker bureau</li>
                <li>Transparent booking process</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.name ||
                !formData.email ||
                !formData.organizationName ||
                !formData.eventBudget ||
                !formData.additionalInfo
              }
              className="w-full h-12 text-lg font-semibold bg-orange-600 hover:bg-orange-700 text-white transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Get My Speaker Quote & Proposal"
              )}
            </Button>
          </form>
        </div>

        {/* Trust Signals - Styled to match site */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm mb-3">Speak About AI: Your Premier Bureau for AI Keynote Speakers</p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>🔒 SSL Secured</span>
            <span>⚡ Prompt Response</span>
            <span>✅ Expert Curation</span>
          </div>
        </div>
      </div>
    </div>
  )
}
