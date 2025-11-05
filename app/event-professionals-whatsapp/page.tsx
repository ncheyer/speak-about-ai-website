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
  CheckCircle,
  Users,
  MessageCircle,
  Lightbulb,
  TrendingUp,
  Network,
  Loader2,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Mail,
  User,
  Phone,
  Linkedin,
  AlertCircle
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const EVENT_ROLES = [
  "Event Planner/Organizer",
  "Venue Manager",
  "Caterer",
  "Audiovisual Specialist",
  "Marketing/Promotions",
  "Exhibitor/Vendor",
  "Speaker/Presenter",
  "Other"
]

const VALUE_OPTIONS = [
  "Networking with peers",
  "Sharing industry insights",
  "Finding collaborators",
  "Seeking advice/solutions",
  "Staying updated on trends",
  "Promoting my services/events (in relevant contexts)",
  "General industry discussions"
]

export default function EventProfessionalsWhatsAppPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    linkedin_url: "",
    phone_number: "",
    primary_role: "",
    other_role: "",
    value_expectations: [] as string[],
    agree_to_rules: false
  })

  const handleValueChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      value_expectations: checked
        ? [...prev.value_expectations, value]
        : prev.value_expectations.filter(v => v !== value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agree_to_rules) {
      toast({
        title: "Please agree to the rules",
        description: "You must agree to the community rules to join",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/whatsapp-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitted(true)
        toast({
          title: "Application Submitted!",
          description: "We'll review your application and send you the WhatsApp link soon."
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit application")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-2xl">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-r from-green-500 to-green-600">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-4">
                Application Received!
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Thank you for applying to join our event professional networking group.
              </p>
              <div className="bg-green-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold text-green-900 mb-3">What happens next?</h3>
                <ol className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">1.</span>
                    <span>We'll review your application within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">2.</span>
                    <span>If approved, you'll receive a WhatsApp invite link via email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">3.</span>
                    <span>Join the group and introduce yourself to fellow event professionals!</span>
                  </li>
                </ol>
              </div>
              <Button onClick={() => window.location.href = "/"} className="bg-green-600 hover:bg-green-700">
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Header Image */}
      <div className="w-full">
        <img
          src="https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/IMG_9585.jpg"
          alt="AI for Event Professionals WhatsApp Community"
          className="w-full h-auto max-h-[500px] object-cover"
        />
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              Join 200+ Event Professionals
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Event Professional Networking Groups for AI Innovation
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect with event planners, venue managers, and industry experts in the most active event professional networking groups focused on AI tools and technology
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Free to Join</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Vetted Members Only</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Active Daily Discussions</span>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardHeader>
                <Network className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Network with Industry Peers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Join event professional networking groups where you can connect with planners, vendors, and specialists across all event types
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <Lightbulb className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Share AI Tools & Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Discover how other event professionals are using AI for planning, marketing, and execution
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Stay Ahead of Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get real-time insights on AI innovations transforming the events industry
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Community Rules */}
          <Card className="mb-12 border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl">Community Guidelines</CardTitle>
              <CardDescription>
                Our event professional networking groups maintain high-quality discussions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  DO:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">1.</span>
                    <span>Share AI wins, fails, and experiments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">2.</span>
                    <span>Ask specific questions about AI tools for events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">3.</span>
                    <span>Help others with solutions you've discovered</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">4.</span>
                    <span>Keep discussions focused on practical AI applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">5.</span>
                    <span>Respect different AI adoption levels (from curious to advanced)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  DON'T:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">1.</span>
                    <span>Spam or self-promote (all pitches go in the "Pitches" channel)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">2.</span>
                    <span>Share confidential client information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">3.</span>
                    <span>Post unrelated content or off-topic discussions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">4.</span>
                    <span>DM members without permission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">5.</span>
                    <span>Share inappropriate or offensive content</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Best Practices:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">1.</span>
                    <span>Share screenshots/examples when possible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">2.</span>
                    <span>Credit sources and tools you recommend</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">3.</span>
                    <span>Be patient - we're all learning together</span>
                  </li>
                </ul>
              </div>

              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Violations = Removal.</strong> We maintain high standards to keep this one of the best event professional networking groups.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Application Form */}
          <Card className="border-2 border-blue-200 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Apply to Join Our Event Professional Networking Groups
              </CardTitle>
              <CardDescription className="text-blue-100">
                Fill out this form to get vetted and join our exclusive WhatsApp group for event professionals discussing AI
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your.email@example.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="full_name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    placeholder="John Smith"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn Profile URL *
                  </Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    required
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone_number" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number (including country code) *
                  </Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    required
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">Required for WhatsApp invitation</p>
                </div>

                <div>
                  <Label htmlFor="primary_role">What is your primary role in the events industry? *</Label>
                  <Select
                    value={formData.primary_role}
                    onValueChange={(value) => setFormData({...formData, primary_role: value})}
                    required
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.primary_role === "Other" && (
                  <div>
                    <Label htmlFor="other_role">Please specify your role *</Label>
                    <Input
                      id="other_role"
                      type="text"
                      required
                      value={formData.other_role}
                      onChange={(e) => setFormData({...formData, other_role: e.target.value})}
                      placeholder="e.g., Event Technology Consultant"
                      className="mt-2"
                    />
                  </div>
                )}

                <div>
                  <Label>What kind of value do you hope to gain from joining this WhatsApp group?</Label>
                  <div className="space-y-2 mt-3">
                    {VALUE_OPTIONS.map((option) => (
                      <div key={option} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          id={option}
                          checked={formData.value_expectations.includes(option)}
                          onCheckedChange={(checked) => handleValueChange(option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm cursor-pointer flex-1">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agree_to_rules"
                      checked={formData.agree_to_rules}
                      onCheckedChange={(checked) => setFormData({...formData, agree_to_rules: checked as boolean})}
                      className="mt-1"
                    />
                    <Label htmlFor="agree_to_rules" className="text-sm cursor-pointer">
                      I agree to these rules and understand I may be removed if I spam or self-promote. *
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !formData.agree_to_rules}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg py-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why Join Event Professional Networking Groups Focused on AI?
          </h2>
          <p className="text-gray-700 mb-4">
            Event professional networking groups have become essential for staying competitive in today's rapidly evolving industry. Our WhatsApp community brings together event planners, venue managers, caterers, AV specialists, and other industry professionals who are leveraging AI to transform their events.
          </p>
          <p className="text-gray-700 mb-4">
            Unlike generic event professional networking groups, our community focuses specifically on artificial intelligence applications in the events industry. Members share practical experiences with AI tools for event planning, marketing automation, attendee engagement, and operational efficiency.
          </p>
          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            What Makes Our Event Professional Networking Groups Different?
          </h3>
          <ul className="space-y-2 text-gray-700 mb-6">
            <li>• <strong>Vetted Members Only:</strong> All applicants are reviewed to ensure quality discussions</li>
            <li>• <strong>AI-Focused Content:</strong> Exclusively about AI tools and technology for events</li>
            <li>• <strong>Active Community:</strong> Daily discussions with 200+ engaged event professionals</li>
            <li>• <strong>No-Spam Policy:</strong> Strict rules keep conversations valuable and on-topic</li>
            <li>• <strong>Real-World Examples:</strong> Members share actual case studies and results</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
