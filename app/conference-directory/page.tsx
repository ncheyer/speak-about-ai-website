"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, User, Building, ArrowRight, CheckCircle, Users, Award, Megaphone } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface Category {
  id: number
  name: string
  slug: string
  icon?: string
}

export default function ConferenceDirectoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSignup, setIsSignup] = useState(true)
  const [loading, setLoading] = useState(false)
  const [topCategories, setTopCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    company: "",
    role: ""
  })

  useEffect(() => {
    fetchTopCategories()
  }, [])

  const fetchTopCategories = async () => {
    try {
      const response = await fetch("/api/conferences?categories=true")
      if (response.ok) {
        const data = await response.json()
        setTopCategories(data.categories.slice(0, 6))
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/conferences/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          action: isSignup ? "signup" : "login"
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Store subscriber info in session
        sessionStorage.setItem("conferenceSubscriber", JSON.stringify(data.subscriber))

        toast({
          title: "Success!",
          description: isSignup ? "Welcome to the Conference Directory!" : "Welcome back!",
        })

        // Redirect to conference listings
        router.push("/conference-directory/conferences")
      } else {
        toast({
          title: "Error",
          description: data.error || "Something went wrong",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to process your request",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Event Industry Conference Directory",
            "description": "Browse event industry conferences and find speaking opportunities. Track call for proposals, deadlines, and connect with conference organizers.",
            "url": "https://speakabout.ai/conference-directory",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://speakabout.ai"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Conference Directory",
                  "item": "https://speakabout.ai/conference-directory"
                }
              ]
            }
          })
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-600 rounded-full">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Event Industry Conference Directory
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Discover speaking opportunities at top event industry conferences.
              Find call for proposals, track deadlines, and connect with organizers - completely free.
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Whether you're an AI expert, event planner, or industry thought leader, our conference directory
              connects you with the best speaking opportunities in MICE, event technology, marketing, and more.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Features Section */}
            <div className="space-y-6">
              {/* What You Get Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    What You Get
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Instant Access</p>
                      <p className="text-sm text-gray-600">Browse our full conference directory immediately after signup</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">CFP Tracking</p>
                      <p className="text-sm text-gray-600">See which conferences have open calls for proposals</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Direct Contact Info</p>
                      <p className="text-sm text-gray-600">Connect directly with conference organizers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Deadline Alerts</p>
                      <p className="text-sm text-gray-600">Never miss an important submission deadline</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Categories Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conference Categories</CardTitle>
                  <CardDescription>Browse conferences by industry</CardDescription>
                </CardHeader>
                <CardContent>
                  {topCategories.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {topCategories.map((category) => (
                        <Badge
                          key={category.id}
                          variant="outline"
                          className="justify-start py-2"
                        >
                          <span className="mr-2">{category.icon || '📅'}</span>
                          <span className="text-xs">{category.name}</span>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Badge variant="outline" className="justify-start py-2">
                        <span className="mr-2">🏢</span>
                        <span className="text-xs">MICE & Meetings</span>
                      </Badge>
                      <Badge variant="outline" className="justify-start py-2">
                        <span className="mr-2">💻</span>
                        <span className="text-xs">Event Technology</span>
                      </Badge>
                      <Badge variant="outline" className="justify-start py-2">
                        <span className="mr-2">📋</span>
                        <span className="text-xs">Event Planning</span>
                      </Badge>
                      <Badge variant="outline" className="justify-start py-2">
                        <span className="mr-2">✈️</span>
                        <span className="text-xs">Travel & Tourism</span>
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* For Conference Organizers CTA */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    For Conference Organizers
                  </h3>
                  <p className="text-blue-800 text-sm mb-4">
                    Want to list your conference and attract top speakers?
                  </p>
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    onClick={() => router.push("/contact")}
                  >
                    Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Signup/Login Form */}
            <Card className="shadow-xl border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {isSignup ? "Get Instant Access" : "Welcome Back"}
                </CardTitle>
                <CardDescription>
                  {isSignup
                    ? "Sign up to browse our conference directory"
                    : "Log in to access the conference directory"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {isSignup && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="John Smith"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="pl-10"
                            required={isSignup}
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="company"
                            type="text"
                            placeholder="Acme Events Inc."
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="pl-10"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role (Optional)</Label>
                        <div className="relative">
                          <Award className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="role"
                            type="text"
                            placeholder="Event Planner, Speaker, etc."
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="pl-10"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : (isSignup ? "Get Access" : "Log In")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    {isSignup ? "Already have access?" : "New to the directory?"}
                  </p>
                  <Button
                    variant="link"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => setIsSignup(!isSignup)}
                  >
                    {isSignup ? "Log in instead" : "Sign up for access"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SEO Content Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
              Your Complete Event Conference Directory
            </h2>

            <div className="prose prose-lg text-gray-600 mb-12">
              <p className="mb-4">
                Finding the right speaking opportunities shouldn't be overwhelming. Our comprehensive event conference
                directory simplifies the process by connecting you with verified conferences actively seeking speakers
                in AI, event technology, MICE, marketing, and more.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Speaking Opportunities at Top Industry Events
              </h3>
              <p className="mb-4">
                Whether you're an AI keynote speaker, event technology expert, or industry thought leader, our event
                conference directory features opportunities at premier conferences like IMEX, PCMA Convening Leaders,
                Event Tech Live, and dozens more. Track open calls for proposals, submission deadlines, and speaker
                benefits all in one place.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Never Miss a Deadline
              </h3>
              <p className="mb-4">
                Stay ahead with our event conference directory's deadline tracking system. Filter by CFP status,
                conference date, location, and category to find opportunities that match your expertise. Get direct
                access to conference organizer contact information and submission guidelines.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Why Choose Our Event Conference Directory?
              </h3>
              <p className="mb-4">
                Complete transparency. No hidden fees. Every conference in our event conference directory includes
                detailed information about speaker benefits, compensation, travel coverage, and audience demographics.
                Make informed decisions about which speaking opportunities align with your goals.
              </p>

              <div className="bg-blue-50 p-6 rounded-lg mt-8">
                <h4 className="text-xl font-semibold text-blue-900 mb-3">
                  Start Building Your Speaking Portfolio Today
                </h4>
                <p className="text-blue-800">
                  Join our growing event conference directory to connect with conference organizers actively
                  seeking expert speakers. From MICE and event planning to AI and technology conferences,
                  we have the opportunities you need to grow your speaking career and share your expertise.
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            <div>
              <p className="text-3xl font-bold text-blue-600">100+</p>
              <p className="text-gray-600">Industry Conferences</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">10+</p>
              <p className="text-gray-600">Conference Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">100%</p>
              <p className="text-gray-600">Free Access</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">24/7</p>
              <p className="text-gray-600">Available Online</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
