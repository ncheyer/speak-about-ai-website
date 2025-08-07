"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  FileText,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle,
  TrendingUp,
  Video,
  Mic,
  Globe,
  Plane,
  Building,
  Mail,
  Phone,
  MessageSquare,
  Star,
  Filter,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock3,
  CalendarDays,
  BanknoteIcon,
  BarChart3,
  History,
  Loader2,
  Send,
  Archive
} from "lucide-react"
import Link from "next/link"

// Type definitions
interface Engagement {
  id: number
  client_name?: string
  company: string
  event_title: string
  event_date: string
  event_location: string
  event_type: string
  attendee_count?: number
  budget_range?: string
  deal_value?: string
  speaker_fee?: string
  status?: string
  priority?: string
  admin_message?: string
  created_at: string
  type: 'request' | 'upcoming' | 'past'
  needs_response?: boolean
}

const mockEngagements = {
  upcoming: [
    {
      id: 1,
      title: "AI Leadership Summit 2025",
      client: "TechCorp Industries",
      date: "2025-03-15",
      time: "2:00 PM EST",
      location: "New York, NY",
      venue: "Javits Center",
      type: "Keynote",
      duration: "45 minutes",
      audience_size: "500+",
      fee: "$25,000",
      status: "confirmed",
      topics: ["AI Strategy", "Digital Transformation"],
      format: "In-person",
      contact: {
        name: "Sarah Johnson",
        email: "sarah@techcorp.com",
        phone: "+1 555-0123"
      },
      notes: "Focus on enterprise AI adoption strategies",
      travel_covered: true,
      accommodation_covered: true,
      requirements: "Wireless mic, confidence monitor, HDMI connection"
    },
    {
      id: 2,
      title: "Virtual AI Workshop Series",
      client: "Innovation Labs",
      date: "2025-02-20",
      time: "10:00 AM PST",
      location: "Virtual",
      venue: "Zoom Webinar",
      type: "Workshop",
      duration: "3 hours",
      audience_size: "50-100",
      fee: "$10,000",
      status: "pending",
      topics: ["Generative AI", "Prompt Engineering"],
      format: "Virtual",
      contact: {
        name: "Mike Chen",
        email: "mike@innovationlabs.io",
        phone: "+1 555-0456"
      },
      notes: "Interactive workshop with hands-on exercises",
      travel_covered: false,
      accommodation_covered: false,
      requirements: "Screen sharing, breakout rooms capability"
    },
    {
      id: 3,
      title: "Healthcare AI Symposium",
      client: "MedTech Association",
      date: "2025-04-10",
      time: "9:00 AM CST",
      location: "Chicago, IL",
      venue: "McCormick Place",
      type: "Panel Discussion",
      duration: "60 minutes",
      audience_size: "200-300",
      fee: "$15,000",
      status: "confirmed",
      topics: ["AI in Healthcare", "Ethics & Compliance"],
      format: "In-person",
      contact: {
        name: "Dr. Emily Brown",
        email: "ebrown@medtech.org",
        phone: "+1 555-0789"
      },
      notes: "Panel with 3 other speakers on AI ethics in healthcare",
      travel_covered: true,
      accommodation_covered: true,
      requirements: "Lapel mic, panel seating arrangement"
    }
  ],
  past: [
    {
      id: 4,
      title: "Global AI Conference 2024",
      client: "AI World Forum",
      date: "2024-11-15",
      time: "3:00 PM GMT",
      location: "London, UK",
      venue: "ExCeL London",
      type: "Keynote",
      duration: "60 minutes",
      audience_size: "1000+",
      fee: "$50,000",
      status: "completed",
      topics: ["Future of AI", "AGI Perspectives"],
      format: "In-person",
      rating: 4.8,
      testimonial: "Outstanding presentation that captivated our audience. Highly recommended speaker!",
      recording_url: "https://example.com/recording1"
    },
    {
      id: 5,
      title: "Enterprise AI Summit",
      client: "Fortune 500 Company",
      date: "2024-10-20",
      time: "1:00 PM EST",
      location: "Boston, MA",
      venue: "Company HQ",
      type: "Executive Briefing",
      duration: "90 minutes",
      audience_size: "20-30",
      fee: "$35,000",
      status: "completed",
      topics: ["AI Implementation", "ROI Analysis"],
      format: "In-person",
      rating: 5.0,
      testimonial: "Invaluable insights that shaped our AI strategy for the next 5 years."
    },
    {
      id: 6,
      title: "AI Ethics Roundtable",
      client: "Tech Policy Institute",
      date: "2024-09-05",
      time: "11:00 AM PST",
      location: "San Francisco, CA",
      venue: "Policy Center",
      type: "Roundtable",
      duration: "2 hours",
      audience_size: "15-20",
      fee: "$12,000",
      status: "completed",
      topics: ["AI Ethics", "Responsible AI"],
      format: "Hybrid",
      rating: 4.9
    }
  ],
  requests: [
    {
      id: 7,
      title: "Banking AI Innovation Forum",
      client: "Global Finance Corp",
      date: "2025-05-20",
      time: "TBD",
      location: "Singapore",
      venue: "Marina Bay Sands",
      type: "Keynote",
      duration: "45 minutes",
      audience_size: "300-400",
      proposed_fee: "$30,000",
      status: "requested",
      topics: ["AI in Finance", "Risk Management"],
      format: "In-person",
      message: "We'd love to have you speak at our annual innovation forum. Are you available in May?",
      requested_date: "2025-01-05",
      response_deadline: "2025-01-20"
    },
    {
      id: 8,
      title: "University Guest Lecture",
      client: "MIT",
      date: "2025-03-01",
      time: "2:00 PM EST",
      location: "Cambridge, MA",
      venue: "MIT Campus",
      type: "Guest Lecture",
      duration: "90 minutes",
      audience_size: "100-150",
      proposed_fee: "Pro bono",
      status: "requested",
      topics: ["AI Research", "Career Development"],
      format: "In-person",
      message: "Our students would greatly benefit from your expertise in AI.",
      requested_date: "2025-01-03",
      response_deadline: "2025-01-15"
    }
  ]
}

export default function SpeakerEngagementsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [engagements, setEngagements] = useState<{
    upcoming: Engagement[]
    past: Engagement[]
    requests: Engagement[]
  }>({ upcoming: [], past: [], requests: [] })
  const [stats, setStats] = useState({
    totalUpcoming: 0,
    totalPast: 0,
    pendingRequests: 0,
    totalEarnings: 0,
    upcomingEarnings: 0
  })
  const [selectedEngagement, setSelectedEngagement] = useState<any>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showResponseDialog, setShowResponseDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [responseMessage, setResponseMessage] = useState("")
  const [proposedChanges, setProposedChanges] = useState({
    date: "",
    time: "",
    fee: "",
    notes: ""
  })

  // Check authentication and fetch data
  useEffect(() => {
    const token = localStorage.getItem("speakerToken")
    if (!token) {
      router.push("/speakers/login")
    } else {
      fetchEngagements(token)
    }
  }, [router])

  const fetchEngagements = async (token: string) => {
    try {
      const response = await fetch('/api/speakers/engagements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch engagements')
      }
      
      const data = await response.json()
      setEngagements({
        upcoming: data.upcoming || [],
        past: data.past || [],
        requests: data.requests || []
      })
      
      // Update stats from API response
      setStats({
        totalUpcoming: data.stats?.totalUpcoming || 0,
        totalPast: data.stats?.totalPast || 0,
        pendingRequests: data.stats?.totalRequests || 0,
        totalEarnings: data.stats?.totalRevenue || 0,
        upcomingEarnings: data.upcoming?.reduce((acc: number, e: Engagement) => {
          const fee = parseFloat(e.speaker_fee || e.deal_value || '0')
          return acc + fee
        }, 0) || 0
      })
    } catch (error) {
      console.error('Error fetching engagements:', error)
      // Fall back to mock data if needed
      setEngagements(mockEngagements)
    } finally {
      setIsLoading(false)
    }
  }

  // Stats are now calculated in fetchEngagements

  const handleAcceptRequest = async (request: any) => {
    setIsLoading(true)
    const token = localStorage.getItem("speakerToken")
    
    try {
      const response = await fetch('/api/speakers/engagements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dealId: request.id,
          action: 'accept',
          negotiationNotes: responseMessage
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to accept request')
      }
      
      // Refresh engagements
      await fetchEngagements(token!)
    } catch (error) {
      console.error('Error accepting request:', error)
      alert('Failed to accept request. Please try again.')
    } finally {
      setIsLoading(false)
    }
    
    // Keep the original logic for UI update
    const newEngagement = {
      ...request,
      status: "confirmed",
      fee: request.budget_range || request.deal_value
    }
    
    setEngagements(prev => ({
      ...prev,
      upcoming: [...prev.upcoming, newEngagement],
      requests: prev.requests.filter(r => r.id !== request.id)
    }))
    
    setShowResponseDialog(false)
    setResponseMessage("")
  }

  const handleDeclineRequest = async (requestId: number) => {
    setIsLoading(true)
    const token = localStorage.getItem("speakerToken")
    
    try {
      const response = await fetch('/api/speakers/engagements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dealId: requestId,
          action: 'decline'
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to decline request')
      }
      
      // Refresh engagements
      await fetchEngagements(token!)
    } catch (error) {
      console.error('Error declining request:', error)
      alert('Failed to decline request. Please try again.')
    } finally {
      setIsLoading(false)
    }
    // In production, this would make an API call
    setEngagements(prev => ({
      ...prev,
      requests: prev.requests.filter(r => r.id !== requestId)
    }))
    
    setShowResponseDialog(false)
    setResponseMessage("")
  }

  const handleNegotiateRequest = (request: any) => {
    // In production, this would make an API call with proposed changes
    console.log("Negotiating:", request, proposedChanges)
    setShowResponseDialog(false)
    setProposedChanges({ date: "", time: "", fee: "", notes: "" })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: "Confirmed", variant: "default" as const, icon: CheckCircle },
      pending: { label: "Pending", variant: "secondary" as const, icon: Clock3 },
      completed: { label: "Completed", variant: "outline" as const, icon: Check },
      requested: { label: "New Request", variant: "destructive" as const, icon: AlertCircle },
      cancelled: { label: "Cancelled", variant: "secondary" as const, icon: XCircle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      "Keynote": { color: "bg-purple-100 text-purple-800", icon: Mic },
      "Workshop": { color: "bg-blue-100 text-blue-800", icon: Users },
      "Panel Discussion": { color: "bg-green-100 text-green-800", icon: MessageSquare },
      "Executive Briefing": { color: "bg-orange-100 text-orange-800", icon: Building },
      "Guest Lecture": { color: "bg-pink-100 text-pink-800", icon: Globe },
      "Roundtable": { color: "bg-indigo-100 text-indigo-800", icon: Users }
    }
    
    const config = typeConfig[type as keyof typeof typeConfig] || { color: "bg-gray-100 text-gray-800", icon: Calendar }
    const Icon = config.icon
    
    return (
      <Badge className={`${config.color} gap-1 border-0`}>
        <Icon className="h-3 w-3" />
        {type}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`
    return `In ${diffDays} days`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-1"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/speakers/dashboard">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Speaking Engagements
                </h1>
                <p className="text-sm text-gray-600">Manage your bookings and speaking requests</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Engagement
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-purple-600">{stats.totalUpcoming}</div>
                <Calendar className="h-5 w-5 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
                <AlertCircle className="h-5 w-5 text-orange-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">{stats.totalPast}</div>
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-blue-600">
                  ${stats.upcomingEarnings.toLocaleString()}
                </div>
                <DollarSign className="h-5 w-5 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">
                  ${stats.totalEarnings.toLocaleString()}
                </div>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalUpcoming + stats.totalPast}
                </div>
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="requests" className="relative">
              <AlertCircle className="h-4 w-4 mr-2" />
              Requests
              {stats.pendingRequests > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 px-1.5">
                  {stats.pendingRequests}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming ({stats.totalUpcoming})
            </TabsTrigger>
            <TabsTrigger value="past">
              <History className="h-4 w-4 mr-2" />
              Past Events ({stats.totalPast})
            </TabsTrigger>
          </TabsList>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            {engagements.requests.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
                  <p className="text-gray-600">You don't have any speaking requests at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              engagements.requests.map((request) => (
                <Card key={request.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{request.event_title}</CardTitle>
                        <CardDescription className="mt-2">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {request.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              {formatDate(request.event_date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {request.event_location}
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(request.status)}
                        {getTypeBadge(request.type)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {request.admin_message && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-purple-900 font-medium mb-2">Message from Admin:</p>
                        <p className="text-sm text-gray-700">{request.admin_message}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Event Type</p>
                        <p className="font-medium">{request.event_type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Audience Size</p>
                        <p className="font-medium">{request.attendee_count || 'TBD'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Budget</p>
                        <p className="font-medium text-green-600">{request.budget_range || `$${request.deal_value}` || 'TBD'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Priority</p>
                        <p className="font-medium capitalize">{request.priority || 'Normal'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Clock3 className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-orange-600 font-medium">
                        Response deadline: {formatDate(request.response_deadline)}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedEngagement(request)
                        setShowDetailsDialog(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDeclineRequest(request.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedEngagement(request)
                          setShowResponseDialog(true)
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Negotiate
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        onClick={() => handleAcceptRequest(request)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Upcoming Tab */}
          <TabsContent value="upcoming" className="space-y-4">
            {engagements.upcoming.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Engagements</h3>
                  <p className="text-gray-600">You don't have any confirmed upcoming engagements.</p>
                </CardContent>
              </Card>
            ) : (
              engagements.upcoming.map((engagement) => (
                <Card key={engagement.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{engagement.title}</CardTitle>
                        <CardDescription className="mt-2">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {engagement.client}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              {formatDate(engagement.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {engagement.time}
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(engagement.status)}
                        {getTypeBadge(engagement.type)}
                        <Badge variant="outline" className="gap-1">
                          <Clock3 className="h-3 w-3" />
                          {getDaysUntil(engagement.date)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {engagement.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Venue</p>
                        <p className="font-medium">{engagement.venue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Audience</p>
                        <p className="font-medium">{engagement.audience_size}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fee</p>
                        <p className="font-medium text-green-600">{engagement.fee}</p>
                      </div>
                    </div>
                    
                    {engagement.notes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-900 font-medium mb-1">Notes:</p>
                        <p className="text-sm text-gray-700">{engagement.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {engagement.topics.map((topic, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {engagement.travel_covered && (
                        <span className="flex items-center gap-1">
                          <Plane className="h-4 w-4 text-green-500" />
                          Travel covered
                        </span>
                      )}
                      {engagement.accommodation_covered && (
                        <span className="flex items-center gap-1">
                          <Building className="h-4 w-4 text-green-500" />
                          Accommodation covered
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 flex justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Mail className="h-4 w-4" />
                        {engagement.contact.email}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Phone className="h-4 w-4" />
                        {engagement.contact.phone}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedEngagement(engagement)
                          setShowDetailsDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Contract
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Past Events Tab */}
          <TabsContent value="past" className="space-y-4">
            {engagements.past.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <History className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Past Events</h3>
                  <p className="text-gray-600">You don't have any completed speaking engagements yet.</p>
                </CardContent>
              </Card>
            ) : (
              engagements.past.map((engagement) => (
                <Card key={engagement.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{engagement.title}</CardTitle>
                        <CardDescription className="mt-2">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {engagement.client}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              {formatDate(engagement.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {engagement.location}
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(engagement.status)}
                        {getTypeBadge(engagement.type)}
                        {engagement.rating && (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(engagement.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-sm font-medium ml-1">
                              {engagement.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Event Type</p>
                        <p className="font-medium">{engagement.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Audience</p>
                        <p className="font-medium">{engagement.audience_size}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fee</p>
                        <p className="font-medium text-green-600">{engagement.fee}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Priority</p>
                        <p className="font-medium">{engagement.format}</p>
                      </div>
                    </div>
                    
                    {engagement.testimonial && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-green-900 font-medium mb-2">Client Testimonial:</p>
                        <p className="text-sm text-gray-700 italic">"{engagement.testimonial}"</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {engagement.topics.map((topic, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 flex justify-between">
                    <div className="text-sm text-gray-600">
                      Completed {getDaysUntil(engagement.date)}
                    </div>
                    <div className="flex gap-2">
                      {engagement.recording_url && (
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          View Recording
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Request Testimonial
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Response Dialog */}
        <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Respond to Speaking Request</DialogTitle>
              <DialogDescription>
                Negotiate terms or provide a counter-offer for this engagement
              </DialogDescription>
            </DialogHeader>
            {selectedEngagement && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">{selectedEngagement.title}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Client:</span> {selectedEngagement.client}
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span> {formatDate(selectedEngagement.date)}
                    </div>
                    <div>
                      <span className="text-gray-500">Proposed Fee:</span> {selectedEngagement.proposed_fee}
                    </div>
                    <div>
                      <span className="text-gray-500">Format:</span> {selectedEngagement.format}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="response-message">Message to Client</Label>
                    <Textarea
                      id="response-message"
                      placeholder="Thank you for the invitation. I'd like to discuss..."
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="proposed-date">Propose Alternative Date</Label>
                      <Input
                        id="proposed-date"
                        type="date"
                        value={proposedChanges.date}
                        onChange={(e) => setProposedChanges({...proposedChanges, date: e.target.value})}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="proposed-fee">Propose Different Fee</Label>
                      <Input
                        id="proposed-fee"
                        placeholder="$50,000"
                        value={proposedChanges.fee}
                        onChange={(e) => setProposedChanges({...proposedChanges, fee: e.target.value})}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="additional-notes">Additional Requirements</Label>
                    <Textarea
                      id="additional-notes"
                      placeholder="Any specific requirements or conditions..."
                      value={proposedChanges.notes}
                      onChange={(e) => setProposedChanges({...proposedChanges, notes: e.target.value})}
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResponseDialog(false)}>
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={() => selectedEngagement && handleNegotiateRequest(selectedEngagement)}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Response
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Engagement Details</DialogTitle>
            </DialogHeader>
            {selectedEngagement && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{selectedEngagement.title}</h3>
                  <div className="flex gap-2 mb-4">
                    {getStatusBadge(selectedEngagement.status)}
                    {getTypeBadge(selectedEngagement.type)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Client Organization</Label>
                    <p className="font-medium">{selectedEngagement.client}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Event Date & Time</Label>
                    <p className="font-medium">
                      {formatDate(selectedEngagement.date)} at {selectedEngagement.time}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Location</Label>
                    <p className="font-medium">{selectedEngagement.location}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Venue</Label>
                    <p className="font-medium">{selectedEngagement.venue}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Duration</Label>
                    <p className="font-medium">{selectedEngagement.duration}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Audience Size</Label>
                    <p className="font-medium">{selectedEngagement.audience_size}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Speaking Fee</Label>
                    <p className="font-medium text-green-600">
                      {selectedEngagement.fee || selectedEngagement.proposed_fee}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Format</Label>
                    <p className="font-medium">{selectedEngagement.format}</p>
                  </div>
                </div>
                
                {selectedEngagement.topics && (
                  <div>
                    <Label className="text-gray-500">Topics to Cover</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedEngagement.topics.map((topic: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedEngagement.notes && (
                  <div>
                    <Label className="text-gray-500">Event Notes</Label>
                    <p className="mt-2">{selectedEngagement.notes}</p>
                  </div>
                )}
                
                {selectedEngagement.requirements && (
                  <div>
                    <Label className="text-gray-500">Technical Requirements</Label>
                    <p className="mt-2">{selectedEngagement.requirements}</p>
                  </div>
                )}
                
                {selectedEngagement.contact && (
                  <div>
                    <Label className="text-gray-500">Contact Information</Label>
                    <div className="mt-2 space-y-2">
                      <p><strong>Name:</strong> {selectedEngagement.contact.name}</p>
                      <p><strong>Email:</strong> {selectedEngagement.contact.email}</p>
                      <p><strong>Phone:</strong> {selectedEngagement.contact.phone}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <Label className="text-gray-500">Travel & Accommodation</Label>
                  <div className="mt-2 flex gap-4">
                    <Badge variant={selectedEngagement.travel_covered ? "default" : "secondary"}>
                      <Plane className="h-3 w-3 mr-1" />
                      Travel {selectedEngagement.travel_covered ? "Covered" : "Not Covered"}
                    </Badge>
                    <Badge variant={selectedEngagement.accommodation_covered ? "default" : "secondary"}>
                      <Building className="h-3 w-3 mr-1" />
                      Accommodation {selectedEngagement.accommodation_covered ? "Covered" : "Not Covered"}
                    </Badge>
                  </div>
                </div>
                
                {selectedEngagement.testimonial && (
                  <div>
                    <Label className="text-gray-500">Client Testimonial</Label>
                    <blockquote className="mt-2 border-l-4 border-purple-500 pl-4 italic">
                      "{selectedEngagement.testimonial}"
                    </blockquote>
                  </div>
                )}
                
                {selectedEngagement.rating && (
                  <div>
                    <Label className="text-gray-500">Event Rating</Label>
                    <div className="flex items-center gap-2 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(selectedEngagement.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="font-medium">{selectedEngagement.rating} / 5.0</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}