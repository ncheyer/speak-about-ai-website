"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar,
  Mic,
  Users,
  ArrowRight,
  Building2,
  Award,
  FileText,
  BarChart,
  Search,
  Clock,
  MapPin,
  TrendingUp,
  Star,
  CheckCircle2,
  Globe,
  LogIn,
  UserPlus,
  CalendarDays,
  Sparkles
} from "lucide-react"

export default function EventHubPortal() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Check if user is already logged in
  useEffect(() => {
    const clientLoggedIn = localStorage.getItem("clientLoggedIn")
    const speakerLoggedIn = localStorage.getItem("speakerAuth")
    
    if (clientLoggedIn) {
      router.push("/portal/dashboard")
    } else if (speakerLoggedIn) {
      router.push("/portal/speaker")
    }
  }, [router])

  const handleQuickAccess = async () => {
    if (!email) return
    
    setIsLoading(true)
    try {
      // Try client login first
      const clientResponse = await fetch("/api/auth/client-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      
      const clientData = await clientResponse.json()
      
      if (clientData.success) {
        localStorage.setItem("clientLoggedIn", "true")
        localStorage.setItem("clientSessionToken", clientData.sessionToken)
        localStorage.setItem("clientUser", JSON.stringify(clientData.user))
        localStorage.setItem("clientProjects", JSON.stringify(clientData.projects))
        router.push("/portal/dashboard")
        return
      }
      
      // Try speaker login
      const speakerResponse = await fetch("/api/auth/speaker-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "temp" }) // Will need proper auth
      })
      
      const speakerData = await speakerResponse.json()
      
      if (speakerData.success) {
        localStorage.setItem("speakerAuth", JSON.stringify({
          token: speakerData.token,
          speaker: speakerData.speaker
        }))
        router.push("/portal/speaker")
        return
      }
      
      // If no account found, redirect to appropriate signup
      router.push("/speakers/apply")
    } catch (error) {
      console.error("Access error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const upcomingEvents = [
    {
      name: "AI Innovation Summit 2025",
      date: "March 15-17, 2025",
      location: "San Francisco, CA",
      speakers: 12,
      attendees: "500+"
    },
    {
      name: "Future of Work Conference",
      date: "April 8-9, 2025",
      location: "Virtual Event",
      speakers: 8,
      attendees: "1000+"
    },
    {
      name: "Healthcare AI Symposium",
      date: "May 22, 2025",
      location: "Boston, MA",
      speakers: 6,
      attendees: "300+"
    }
  ]

  const featuredSpeakers = [
    { name: "Adam Cheyer", role: "Co-founder of Siri", topics: ["AI", "Innovation"] },
    { name: "Peter Norvig", role: "Former Google Research Director", topics: ["AI", "Education"] },
    { name: "Katie McMahon", role: "Business Strategy Expert", topics: ["Leadership", "Strategy"] }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              Event Hub Portal
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Your Central Hub for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI Speaking Events</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect with world-class AI speakers, manage your events, and access exclusive resources all in one place
            </p>
            
            {/* Quick Access */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email to access portal..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuickAccess()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleQuickAccess}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? "Accessing..." : "Quick Access"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Enter your email to access your dashboard or speaker profile
              </p>
            </div>

            {/* Role Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Event Organizer Card */}
              <Card 
                className="relative overflow-hidden hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-blue-200"
                onClick={() => router.push("/portal/client")}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                
                <CardHeader className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">Event Organizers</CardTitle>
                  <CardDescription>
                    Manage your events and speaker bookings
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Access event details & logistics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>View speaker information</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Track contracts & invoices</span>
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline">
                    <LogIn className="mr-2 h-4 w-4" />
                    Access Client Portal
                  </Button>
                </CardContent>
              </Card>

              {/* Speaker Card */}
              <Card 
                className="relative overflow-hidden hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-purple-200"
                onClick={() => router.push("/portal/speaker")}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                
                <CardHeader className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Mic className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">Speakers</CardTitle>
                  <CardDescription>
                    Manage your profile and engagements
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                    <span>View upcoming engagements</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                    <span>Update profile & materials</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                    <span>Access event information</span>
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline">
                    <LogIn className="mr-2 h-4 w-4" />
                    Access Speaker Portal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Info Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="speakers">Featured Speakers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>For Event Organizers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Streamline your event management with our comprehensive portal
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Real-time event status tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Direct communication with speakers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Centralized document management</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Mic className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>For Speakers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage your speaking career with powerful tools
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Dashboard for all engagements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Profile and material management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Event logistics at your fingertips</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Platform Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Why choose our event hub platform
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>Curated AI expert speakers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>Seamless booking process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>End-to-end event support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Featured events with our AI speakers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-start justify-between p-4 rounded-lg border bg-white hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{event.name}</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mic className="h-4 w-4" />
                            {event.speakers} speakers
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event.attendees}
                          </div>
                        </div>
                      </div>
                      {event.location.includes("Virtual") && (
                        <Badge variant="secondary">
                          <Globe className="h-3 w-3 mr-1" />
                          Virtual
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="speakers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Featured AI Speakers</CardTitle>
                <CardDescription>World-class experts available for your events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {featuredSpeakers.map((speaker, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-3" />
                      <h4 className="font-semibold">{speaker.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{speaker.role}</p>
                      <div className="flex flex-wrap gap-1">
                        {speaker.topics.map((topic, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Button variant="outline" onClick={() => router.push("/speakers")}>
                    View All Speakers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join the premier platform for AI speaking events
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => router.push("/contact")}
            >
              <Building2 className="mr-2 h-5 w-5" />
              Book a Speaker
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              onClick={() => router.push("/speakers/apply")}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Become a Speaker
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}