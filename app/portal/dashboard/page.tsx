"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  User,
  Building2,
  Phone,
  Mail,
  LogOut,
  FileText,
  Monitor,
  Plane,
  Hotel,
  Utensils,
  Send,
  CreditCard,
  FileCheck,
  Loader2,
  RefreshCw
} from "lucide-react"

interface Project {
  id: number
  project_name: string
  client_name: string
  client_email?: string
  client_phone?: string
  company?: string
  project_type: string
  description?: string
  status: "2plus_months" | "1to2_months" | "less_than_month" | "final_week" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  start_date: string
  deadline?: string
  event_date?: string
  event_location?: string
  event_type?: string
  event_classification?: "virtual" | "local" | "travel"
  attendee_count?: number
  speaker_fee?: number
  travel_required?: boolean
  accommodation_required?: boolean
  av_requirements?: string
  catering_requirements?: string
  special_requirements?: string
  contact_person?: string
  venue_contact?: string
  contract_signed?: boolean
  invoice_sent?: boolean
  payment_received?: boolean
  presentation_ready?: boolean
  materials_sent?: boolean
  notes?: string
  speaker_bio?: string
  speaker_headshot_url?: string
  speaker_topics?: any
  speaker_social_media?: any
  speaker_website?: string
  speaker_one_liner?: string
  promotional_materials?: any
  contract_requirements?: string
  invoice_requirements?: string
  payment_terms?: string
  purchase_order_number?: string
  invoice_number?: string
  contract_url?: string
  invoice_url?: string
  created_at: string
  updated_at: string
}

interface ClientUser {
  email: string
  name: string
  company?: string
  projectCount: number
}

const STATUS_COLORS = {
  "2plus_months": "bg-blue-500",
  "1to2_months": "bg-yellow-500", 
  "less_than_month": "bg-orange-500",
  "final_week": "bg-red-500",
  "completed": "bg-green-500",
  "cancelled": "bg-gray-500"
}

const STATUS_LABELS = {
  "2plus_months": "2+ Months Out",
  "1to2_months": "1-2 Months Out", 
  "less_than_month": "< 1 Month Out",
  "final_week": "Final Week",
  "completed": "Completed",
  "cancelled": "Cancelled"
}

export default function ClientPortalDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<ClientUser | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    const isClientLoggedIn = localStorage.getItem("clientLoggedIn")
    const sessionToken = localStorage.getItem("clientSessionToken")
    const userData = localStorage.getItem("clientUser")
    const projectsData = localStorage.getItem("clientProjects")

    if (!isClientLoggedIn || !sessionToken || !userData) {
      router.push("/portal")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      const parsedProjects = projectsData ? JSON.parse(projectsData) : []
      
      setUser(parsedUser)
      setProjects(parsedProjects)
    } catch (error) {
      console.error("Error parsing stored data:", error)
      handleLogout()
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("clientLoggedIn")
    localStorage.removeItem("clientSessionToken")
    localStorage.removeItem("clientUser")
    localStorage.removeItem("clientProjects")
    router.push("/portal")
  }

  const refreshProjects = async () => {
    if (!user) return

    try {
      setIsRefreshing(true)
      setError("")

      const sessionToken = localStorage.getItem("clientSessionToken")
      const response = await fetch("/api/auth/client-refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ email: user.email })
      })

      const data = await response.json()

      if (data.success) {
        setProjects(data.projects)
        localStorage.setItem("clientProjects", JSON.stringify(data.projects))
      } else {
        setError(data.error || "Failed to refresh projects")
      }
    } catch (error) {
      console.error("Refresh error:", error)
      setError("Connection error. Please try again.")
    } finally {
      setIsRefreshing(false)
    }
  }

  const calculateDaysUntilEvent = (eventDate?: string) => {
    if (!eventDate) return null
    const today = new Date()
    const event = new Date(eventDate)
    const diffTime = event.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getUrgentProjects = () => {
    return projects.filter(project => {
      const days = calculateDaysUntilEvent(project.event_date)
      return days !== null && days <= 30 && days >= 0
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your events...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">Session expired</p>
            <Button onClick={() => router.push("/portal")}>
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeProjects = projects.filter(p => !['completed', 'cancelled'].includes(p.status))
  const completedProjects = projects.filter(p => p.status === 'completed')
  const urgentProjects = getUrgentProjects()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Dashboard</h1>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{user.name}</span>
              </div>
              {user.company && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{user.company}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{user.email}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 lg:mt-0">
            <Button 
              variant="outline" 
              onClick={refreshProjects}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activeProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming (30 days)</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{urgentProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedProjects.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Your Events</h2>
          </div>

          {projects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
                <p className="text-gray-500 mb-4">
                  You don't have any events scheduled at the moment.
                </p>
                <Button onClick={refreshProjects} disabled={isRefreshing}>
                  {isRefreshing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Refresh Events
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {projects.map((project) => {
                const daysUntilEvent = calculateDaysUntilEvent(project.event_date)
                const isUpcoming = daysUntilEvent !== null && daysUntilEvent <= 30 && daysUntilEvent >= 0
                const isOverdue = daysUntilEvent !== null && daysUntilEvent < 0

                return (
                  <Card 
                    key={project.id} 
                    className={`hover:shadow-lg transition-shadow cursor-pointer ${
                      isUpcoming ? 'border-orange-200 bg-orange-50' : 
                      isOverdue ? 'border-red-200 bg-red-50' : ''
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{project.project_name}</CardTitle>
                            <Badge className={`${STATUS_COLORS[project.status]} text-white`}>
                              {STATUS_LABELS[project.status]}
                            </Badge>
                            {project.event_classification && (
                              <Badge variant={
                                project.event_classification === 'virtual' ? 'secondary' : 
                                project.event_classification === 'travel' ? 'default' : 
                                'outline'
                              }>
                                {project.event_classification === 'virtual' && <Monitor className="w-3 h-3 mr-1" />}
                                {project.event_classification === 'travel' && <Plane className="w-3 h-3 mr-1" />}
                                {project.event_classification === 'local' && <MapPin className="w-3 h-3 mr-1" />}
                                {project.event_classification.toUpperCase()}
                              </Badge>
                            )}
                            {isUpcoming && (
                              <Badge className="bg-orange-500 text-white">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                UPCOMING
                              </Badge>
                            )}
                            {isOverdue && (
                              <Badge className="bg-red-500 text-white">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                OVERDUE
                              </Badge>
                            )}
                          </div>
                          <CardDescription>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                              <div>
                                {project.event_date && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {new Date(project.event_date).toLocaleDateString()}
                                    {daysUntilEvent !== null && (
                                      <span className={`ml-2 font-semibold ${
                                        isOverdue ? 'text-red-600' : isUpcoming ? 'text-orange-600' : ''
                                      }`}>
                                        ({Math.abs(daysUntilEvent)} days {isOverdue ? 'ago' : 'left'})
                                      </span>
                                    )}
                                  </div>
                                )}
                                {project.event_location && (
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    {project.event_location}
                                  </div>
                                )}
                              </div>
                              <div>
                                {project.event_type && (
                                  <div className="text-sm text-gray-600">
                                    <strong>Type:</strong> {project.event_type}
                                  </div>
                                )}
                                {project.attendee_count && (
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <Users className="mr-2 h-4 w-4" />
                                    {project.attendee_count} attendees
                                  </div>
                                )}
                              </div>
                              <div>
                                {project.speaker_fee && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    ${project.speaker_fee.toLocaleString()}
                                  </div>
                                )}
                                {project.contact_person && (
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <User className="mr-2 h-4 w-4" />
                                    {project.contact_person}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">
                                  <strong>Created:</strong> {new Date(project.created_at).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  <strong>Updated:</strong> {new Date(project.updated_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Event Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedProject.project_name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`${STATUS_COLORS[selectedProject.status]} text-white`}>
                        {STATUS_LABELS[selectedProject.status]}
                      </Badge>
                      {selectedProject.event_date && (() => {
                        const days = calculateDaysUntilEvent(selectedProject.event_date)
                        const isUpcoming = days !== null && days <= 30 && days >= 0
                        const isOverdue = days !== null && days < 0
                        return days !== null && (
                          <Badge variant={isOverdue ? "destructive" : isUpcoming ? "secondary" : "outline"}>
                            {isOverdue ? `${Math.abs(days)} days ago` : `${days} days left`}
                          </Badge>
                        )
                      })()}
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedProject(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Event Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="h-5 w-5" />
                        Event Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedProject.event_date && (
                        <div>
                          <strong>Date:</strong> {new Date(selectedProject.event_date).toLocaleDateString()}
                        </div>
                      )}
                      {selectedProject.event_location && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                          <span>{selectedProject.event_location}</span>
                        </div>
                      )}
                      {selectedProject.event_type && (
                        <div><strong>Type:</strong> {selectedProject.event_type}</div>
                      )}
                      {selectedProject.attendee_count && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{selectedProject.attendee_count} expected attendees</span>
                        </div>
                      )}
                      {selectedProject.speaker_fee && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span>${selectedProject.speaker_fee.toLocaleString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CheckCircle2 className="h-5 w-5" />
                        Event Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { key: 'contract_signed', label: 'Contract Signed', icon: FileCheck },
                        { key: 'invoice_sent', label: 'Invoice Sent', icon: Send },
                        { key: 'payment_received', label: 'Payment Received', icon: CreditCard },
                        { key: 'presentation_ready', label: 'Presentation Ready', icon: Monitor },
                        { key: 'materials_sent', label: 'Materials Sent', icon: FileText }
                      ].map(({ key, label, icon: Icon }) => (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{label}</span>
                          </div>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedProject[key as keyof Project] ? 'bg-green-500 border-green-500' : 'border-gray-300'
                          }`}>
                            {selectedProject[key as keyof Project] && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Requirements & Logistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded border ${selectedProject.travel_required ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                          {selectedProject.travel_required && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-gray-400" />
                          <span>Travel Required</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded border ${selectedProject.accommodation_required ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                          {selectedProject.accommodation_required && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <Hotel className="h-4 w-4 text-gray-400" />
                          <span>Accommodation Required</span>
                        </div>
                      </div>
                    </div>

                    {selectedProject.av_requirements && (
                      <div>
                        <div className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                          <Monitor className="h-4 w-4" />
                          AV Requirements
                        </div>
                        <p className="text-sm text-gray-600 pl-6">{selectedProject.av_requirements}</p>
                      </div>
                    )}

                    {selectedProject.catering_requirements && (
                      <div>
                        <div className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                          <Utensils className="h-4 w-4" />
                          Catering Requirements
                        </div>
                        <p className="text-sm text-gray-600 pl-6">{selectedProject.catering_requirements}</p>
                      </div>
                    )}

                    {selectedProject.special_requirements && (
                      <div>
                        <div className="font-medium text-gray-700 mb-1">Special Requirements</div>
                        <p className="text-sm text-gray-600">{selectedProject.special_requirements}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Contact Information */}
                {(selectedProject.contact_person || selectedProject.venue_contact) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Phone className="h-5 w-5" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedProject.contact_person && (
                        <div>
                          <strong>Primary Contact:</strong> {selectedProject.contact_person}
                        </div>
                      )}
                      {selectedProject.venue_contact && (
                        <div>
                          <strong>Venue Contact:</strong> {selectedProject.venue_contact}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Speaker Promotion Information */}
                {(selectedProject.speaker_bio || selectedProject.speaker_headshot_url || selectedProject.speaker_one_liner) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5" />
                        Speaker Promotion Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedProject.speaker_headshot_url && (
                        <div>
                          <strong>Headshot:</strong>
                          <img 
                            src={selectedProject.speaker_headshot_url} 
                            alt="Speaker headshot" 
                            className="mt-2 w-32 h-32 rounded-lg object-cover"
                          />
                        </div>
                      )}
                      {selectedProject.speaker_one_liner && (
                        <div>
                          <strong>One-Liner:</strong>
                          <p className="text-gray-600 mt-1 italic">{selectedProject.speaker_one_liner}</p>
                        </div>
                      )}
                      {selectedProject.speaker_bio && (
                        <div>
                          <strong>Biography:</strong>
                          <p className="text-gray-600 mt-1 whitespace-pre-wrap">{selectedProject.speaker_bio}</p>
                        </div>
                      )}
                      {selectedProject.speaker_website && (
                        <div>
                          <strong>Website:</strong>
                          <a href={selectedProject.speaker_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-1 block">
                            {selectedProject.speaker_website}
                          </a>
                        </div>
                      )}
                      {selectedProject.speaker_topics && Array.isArray(selectedProject.speaker_topics) && selectedProject.speaker_topics.length > 0 && (
                        <div>
                          <strong>Speaking Topics:</strong>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedProject.speaker_topics.map((topic: string, index: number) => (
                              <Badge key={index} variant="secondary">{topic}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Contracting & Invoicing */}
                {(selectedProject.contract_requirements || selectedProject.invoice_requirements || selectedProject.payment_terms) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileCheck className="h-5 w-5" />
                        Contracting & Invoicing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedProject.contract_requirements && (
                        <div>
                          <strong>Contract Requirements:</strong>
                          <p className="text-gray-600 mt-1">{selectedProject.contract_requirements}</p>
                        </div>
                      )}
                      {selectedProject.invoice_requirements && (
                        <div>
                          <strong>Invoice Requirements:</strong>
                          <p className="text-gray-600 mt-1">{selectedProject.invoice_requirements}</p>
                        </div>
                      )}
                      {selectedProject.payment_terms && (
                        <div>
                          <strong>Payment Terms:</strong>
                          <p className="text-gray-600 mt-1">{selectedProject.payment_terms}</p>
                        </div>
                      )}
                      {selectedProject.purchase_order_number && (
                        <div>
                          <strong>PO Number:</strong>
                          <span className="text-gray-600 ml-2">{selectedProject.purchase_order_number}</span>
                        </div>
                      )}
                      {selectedProject.invoice_number && (
                        <div>
                          <strong>Invoice Number:</strong>
                          <span className="text-gray-600 ml-2">{selectedProject.invoice_number}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Description & Notes */}
                {(selectedProject.description || selectedProject.notes) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="h-5 w-5" />
                        Additional Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedProject.description && (
                        <div>
                          <strong>Description:</strong>
                          <p className="text-gray-600 mt-1">{selectedProject.description}</p>
                        </div>
                      )}
                      {selectedProject.notes && (
                        <div>
                          <strong>Notes:</strong>
                          <p className="text-gray-600 mt-1 whitespace-pre-wrap">{selectedProject.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}