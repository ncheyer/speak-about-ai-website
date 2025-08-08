"use client"

import { useState } from "react"
import { SpeakerDashboardLayout } from "@/components/speaker-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  MessageSquare,
  Eye,
  Download,
  ChevronRight,
  Filter,
  Plus,
  Search,
  TrendingUp,
  Building,
  Video,
  Mic,
  Globe
} from "lucide-react"

export default function SpeakerEvents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const upcomingEvents = [
    {
      id: 1,
      title: "AI Innovation Summit 2025",
      client: "Tech Leaders Association",
      date: "March 15, 2025",
      time: "2:00 PM - 3:30 PM PST",
      location: "San Francisco Convention Center",
      type: "Keynote",
      status: "confirmed",
      fee: "$15,000",
      attendees: "500+",
      topics: ["AI Strategy", "Innovation"],
      requirements: "Presentation clicker, wireless mic",
      notes: "45-minute keynote + 15-minute Q&A",
      contactPerson: "Sarah Johnson",
      contactEmail: "sarah@techleaders.org"
    },
    {
      id: 2,
      title: "Digital Transformation Workshop",
      client: "Fortune 500 Company",
      date: "April 10, 2025",
      time: "9:00 AM - 5:00 PM EST",
      location: "Virtual",
      type: "Workshop",
      status: "pending",
      fee: "$25,000",
      attendees: "50",
      topics: ["Digital Strategy", "AI Implementation"],
      requirements: "Zoom, shared screen access",
      notes: "Full-day interactive workshop with breakout sessions",
      contactPerson: "Michael Chen",
      contactEmail: "m.chen@company.com"
    },
    {
      id: 3,
      title: "Healthcare AI Panel Discussion",
      client: "Medical Innovation Institute",
      date: "May 22, 2025",
      time: "10:00 AM - 11:00 AM CST",
      location: "Chicago Medical Center",
      type: "Panel",
      status: "confirmed",
      fee: "$8,000",
      attendees: "200",
      topics: ["Healthcare AI", "Ethics"],
      requirements: "Panel mic, name plate",
      notes: "Panel with 3 other experts",
      contactPerson: "Dr. Emily Ross",
      contactEmail: "e.ross@medical.org"
    }
  ]

  const pastEvents = [
    {
      id: 4,
      title: "Global Tech Summit 2024",
      client: "International Tech Forum",
      date: "December 10, 2024",
      location: "London, UK",
      type: "Keynote",
      status: "completed",
      fee: "$20,000",
      attendees: "1,000+",
      rating: 4.9,
      reviews: 127,
      feedback: "Outstanding presentation! The insights on AI were transformative."
    },
    {
      id: 5,
      title: "Enterprise AI Workshop",
      client: "Global Consulting Firm",
      date: "November 15, 2024",
      location: "New York, NY",
      type: "Workshop",
      status: "completed",
      fee: "$18,000",
      attendees: "75",
      rating: 5.0,
      reviews: 42,
      feedback: "Best workshop we've ever hosted. Practical and actionable insights."
    }
  ]

  const requests = [
    {
      id: 6,
      title: "Startup Accelerator Keynote",
      client: "TechStars",
      requestDate: "January 5, 2025",
      eventDate: "June 15, 2025",
      location: "Austin, TX",
      type: "Keynote",
      budget: "$10,000 - $15,000",
      status: "new",
      deadline: "January 15, 2025",
      message: "We'd love to have you speak at our annual accelerator summit..."
    },
    {
      id: 7,
      title: "AI Ethics Symposium",
      client: "University of California",
      requestDate: "January 3, 2025",
      eventDate: "September 20, 2025",
      location: "Berkeley, CA",
      type: "Academic Talk",
      budget: "$5,000",
      status: "reviewing",
      deadline: "January 20, 2025",
      message: "Invitation to speak at our annual AI ethics symposium..."
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "new":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "reviewing":
        return "bg-orange-100 text-orange-700 border-orange-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <SpeakerDashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Speaking Engagements</h1>
          <p className="text-gray-600 mt-1">Manage your speaking events and requests</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming Events</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed Events</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">47</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">4.9</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upcoming" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="bg-white border">
              <TabsTrigger value="requests" className="data-[state=active]:bg-gray-100">
                <AlertCircle className="h-4 w-4 mr-2" />
                Requests ({requests.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-gray-100">
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-gray-100">
                <CheckCircle className="h-4 w-4 mr-2" />
                Past Events ({pastEvents.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{request.client}</p>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status === "new" ? "New Request" : "Under Review"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Event Date</p>
                          <p className="text-sm font-medium mt-1">{request.eventDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm font-medium mt-1">{request.location}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Type</p>
                          <p className="text-sm font-medium mt-1">{request.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Budget</p>
                          <p className="text-sm font-medium mt-1">{request.budget}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-gray-700">{request.message}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Received: {request.requestDate}</span>
                          <span className="text-orange-600 font-medium">Deadline: {request.deadline}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <XCircle className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Upcoming Tab */}
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.client}</p>
                    </div>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status === "confirmed" ? "Confirmed" : "Pending Confirmation"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm font-medium">{event.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="text-sm font-medium">{event.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium">{event.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Attendees</p>
                        <p className="text-sm font-medium">{event.attendees}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div>
                          <p className="text-xs text-gray-500">Type</p>
                          <p className="text-sm font-medium">{event.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Fee</p>
                          <p className="text-sm font-medium text-green-600">{event.fee}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Contact</p>
                          <p className="text-sm font-medium">{event.contactPerson}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Past Events Tab */}
          <TabsContent value="past" className="space-y-4">
            {pastEvents.map((event) => (
              <Card key={event.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.client}</p>
                    </div>
                    <Badge className={getStatusColor(event.status)}>Completed</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm font-medium">{event.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium">{event.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="text-sm font-medium">{event.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Attendees</p>
                      <p className="text-sm font-medium">{event.attendees}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fee</p>
                      <p className="text-sm font-medium text-green-600">{event.fee}</p>
                    </div>
                  </div>

                  {event.feedback && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-blue-900 italic">"{event.feedback}"</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{event.rating}</span>
                        <span className="ml-1 text-sm text-gray-500">({event.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Invoice
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Reviews
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </SpeakerDashboardLayout>
  )
}