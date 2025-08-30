"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Plane,
  Hotel,
  MapPin,
  Users,
  Calendar,
  Clock,
  Mic,
  Monitor,
  AlertTriangle,
  CheckCircle2,
  Save,
  FileText,
  Phone,
  Mail,
  Globe,
  Car,
  Building,
  User,
  Hash,
  Target,
  Info,
  Edit,
  Plus,
  Trash2
} from "lucide-react"
import { ProjectDetails, calculateProjectCompletion, generateTasksFromMissingFields } from "@/lib/project-details-schema"

interface ProjectDetailsManagerProps {
  projectId: number
  projectName: string
  initialDetails?: ProjectDetails
  onSave?: (details: ProjectDetails) => void
  onGenerateTasks?: (tasks: any[]) => void
}

export function ProjectDetailsManager({
  projectId,
  projectName,
  initialDetails = {},
  onSave,
  onGenerateTasks
}: ProjectDetailsManagerProps) {
  const [details, setDetails] = useState<ProjectDetails>(initialDetails)
  const [activeTab, setActiveTab] = useState("overview")
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Load project details when component mounts or projectId changes
  useEffect(() => {
    const loadProjectDetails = async () => {
      setLoading(true)
      try {
        console.log('Loading details for project:', projectId)
        const response = await fetch(`/api/projects/${projectId}/details`)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Received project details:', data)
          setDetails(data.details || {})
        } else {
          const errorText = await response.text()
          console.error('Failed to load project details:', response.status, errorText)
          setDetails({})
        }
      } catch (error) {
        console.error('Error loading project details:', error)
        setDetails({})
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      loadProjectDetails()
    } else {
      setDetails({})
      setLoading(false)
    }
  }, [projectId])

  // Calculate completion
  const completion = calculateProjectCompletion(details)

  // Update a nested field in the details object
  const updateField = (path: string, value: any) => {
    const keys = path.split('.')
    const newDetails = { ...details }
    let current: any = newDetails
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    setDetails(newDetails)
    setUnsavedChanges(true)
  }

  // Save details
  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/details`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Project details saved successfully"
        })
        setUnsavedChanges(false)
        if (onSave) onSave(details)
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project details",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  // Generate tasks from missing fields
  const handleGenerateTasks = () => {
    const tasks = generateTasksFromMissingFields(details, projectName)
    if (onGenerateTasks) {
      onGenerateTasks(tasks)
      toast({
        title: "Tasks Generated",
        description: `${tasks.length} tasks created based on missing information`
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Completion Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Project Details Completion</CardTitle>
              <CardDescription>
                Track and manage all event information
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{completion.percentage}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
              {completion.missingCritical.length > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {completion.missingCritical.length} Critical Missing
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={completion.percentage} className="h-2 mb-4" />
          
          {completion.missingCritical.length > 0 && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Critical information missing:</strong>
                <ul className="mt-2 text-sm">
                  {completion.missingCritical.slice(0, 5).map(field => (
                    <li key={field}>• {field.replace(/\./g, ' → ')}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={handleGenerateTasks} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Generate Tasks from Missing Info
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!unsavedChanges || saving}
              size="sm"
            >
              <Save className="h-4 w-4 mr-1" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start rounded-none border-b overflow-x-auto flex-nowrap">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="travel">Travel & Hotel</TabsTrigger>
              <TabsTrigger value="venue">Venue</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="event">Event Details</TabsTrigger>
              <TabsTrigger value="speaker">Speaker Needs</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Speaker Name</Label>
                  <Input
                    value={details.overview?.speaker_name || ''}
                    onChange={(e) => updateField('overview.speaker_name', e.target.value)}
                    placeholder="Enter speaker name"
                  />
                </div>
                <div>
                  <Label>Speaker Title/Designation</Label>
                  <Input
                    value={details.overview?.speaker_title || ''}
                    onChange={(e) => updateField('overview.speaker_title', e.target.value)}
                    placeholder="e.g., CSP, PhD"
                  />
                </div>
                <div>
                  <Label>Company/Organization</Label>
                  <Input
                    value={details.overview?.company_name || ''}
                    onChange={(e) => updateField('overview.company_name', e.target.value)}
                    placeholder="Client company name"
                  />
                </div>
                <div>
                  <Label>Event Location</Label>
                  <Input
                    value={details.overview?.event_location || ''}
                    onChange={(e) => updateField('overview.event_location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <Label>Event Date</Label>
                  <Input
                    type="date"
                    value={details.overview?.event_date || ''}
                    onChange={(e) => updateField('overview.event_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Event Time</Label>
                  <Input
                    type="time"
                    value={details.overview?.event_time || ''}
                    onChange={(e) => updateField('overview.event_time', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Travel & Hotel Tab */}
            <TabsContent value="travel" className="p-6 space-y-6">
              {/* Flights Section */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  Flight Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label>Outbound Flight Details</Label>
                    <Textarea
                      value={details.travel?.flights?.notes || ''}
                      onChange={(e) => updateField('travel.flights.notes', e.target.value)}
                      placeholder="Enter flight details (airline, flight numbers, times, etc.)"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Confirmation Numbers</Label>
                    <Input
                      value={details.travel?.flights?.confirmation_numbers?.join(', ') || ''}
                      onChange={(e) => updateField('travel.flights.confirmation_numbers', e.target.value.split(', '))}
                      placeholder="Enter confirmation numbers"
                    />
                  </div>
                </div>
              </div>

              {/* Ground Transportation */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Ground Transportation
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Transportation Type</Label>
                    <Select
                      value={details.travel?.ground_transportation?.type || ''}
                      onValueChange={(value) => updateField('travel.ground_transportation.type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="taxi">Taxi</SelectItem>
                        <SelectItem value="uber">Uber/Lyft</SelectItem>
                        <SelectItem value="car_service">Car Service</SelectItem>
                        <SelectItem value="rental">Rental Car</SelectItem>
                        <SelectItem value="provided">Client Provided</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Responsibility</Label>
                    <Select
                      value={details.travel?.ground_transportation?.responsibility || ''}
                      onValueChange={(value) => updateField('travel.ground_transportation.responsibility', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Who arranges?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="speaker">Speaker</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="agency">Agency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Hotel Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Hotel className="h-5 w-5" />
                  Hotel Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Hotel Name</Label>
                    <Input
                      value={details.travel?.hotel?.name || ''}
                      onChange={(e) => updateField('travel.hotel.name', e.target.value)}
                      placeholder="Hotel name"
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      value={details.travel?.hotel?.phone || ''}
                      onChange={(e) => updateField('travel.hotel.phone', e.target.value)}
                      placeholder="Hotel phone"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Address</Label>
                    <Input
                      value={details.travel?.hotel?.address || ''}
                      onChange={(e) => updateField('travel.hotel.address', e.target.value)}
                      placeholder="Full hotel address"
                    />
                  </div>
                  <div>
                    <Label>City, State, ZIP</Label>
                    <Input
                      value={details.travel?.hotel?.city_state_zip || ''}
                      onChange={(e) => updateField('travel.hotel.city_state_zip', e.target.value)}
                      placeholder="City, ST 12345"
                    />
                  </div>
                  <div>
                    <Label>Room Type</Label>
                    <Input
                      value={details.travel?.hotel?.room_type || ''}
                      onChange={(e) => updateField('travel.hotel.room_type', e.target.value)}
                      placeholder="e.g., King, Suite"
                    />
                  </div>
                  <div>
                    <Label>Check-in Date</Label>
                    <Input
                      type="date"
                      value={details.travel?.hotel?.check_in_date || ''}
                      onChange={(e) => updateField('travel.hotel.check_in_date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Check-out Date</Label>
                    <Input
                      type="date"
                      value={details.travel?.hotel?.check_out_date || ''}
                      onChange={(e) => updateField('travel.hotel.check_out_date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Confirmation Number</Label>
                    <Input
                      value={details.travel?.hotel?.confirmation_number || ''}
                      onChange={(e) => updateField('travel.hotel.confirmation_number', e.target.value)}
                      placeholder="Confirmation #"
                    />
                  </div>
                  <div>
                    <Label>Secondary Confirmation # (if any)</Label>
                    <Input
                      value={details.travel?.hotel?.confirmation_number_2 || ''}
                      onChange={(e) => updateField('travel.hotel.confirmation_number_2', e.target.value)}
                      placeholder="Additional confirmation #"
                    />
                  </div>
                  <div>
                    <Label>Travel Time to Airport</Label>
                    <Input
                      value={details.travel?.hotel?.travel_time_to_airport || ''}
                      onChange={(e) => updateField('travel.hotel.travel_time_to_airport', e.target.value)}
                      placeholder="e.g., 10 miles / 20 minutes"
                    />
                  </div>
                  <div>
                    <Label>Travel Time to Venue</Label>
                    <Input
                      value={details.travel?.hotel?.travel_time_to_venue || ''}
                      onChange={(e) => updateField('travel.hotel.travel_time_to_venue', e.target.value)}
                      placeholder="e.g., 10 miles / 20 minutes"
                    />
                  </div>
                  <div>
                    <Label>Arranged By</Label>
                    <Select
                      value={details.travel?.hotel?.arranged_by || ''}
                      onValueChange={(value) => updateField('travel.hotel.arranged_by', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Who arranged?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sponsor">Sponsor/Client</SelectItem>
                        <SelectItem value="speaker">Speaker</SelectItem>
                        <SelectItem value="agency">Agency</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <Label>Additional Hotel Information</Label>
                  <Textarea
                    value={details.travel?.hotel?.additional_info || ''}
                    onChange={(e) => updateField('travel.hotel.additional_info', e.target.value)}
                    placeholder="Any special notes about the hotel, amenities, etc."
                    rows={2}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Venue Tab */}
            <TabsContent value="venue" className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Venue Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Venue Name</Label>
                    <Input
                      value={details.venue?.name || ''}
                      onChange={(e) => updateField('venue.name', e.target.value)}
                      placeholder="Venue name"
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      value={details.venue?.phone || ''}
                      onChange={(e) => updateField('venue.phone', e.target.value)}
                      placeholder="Venue phone"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Address</Label>
                    <Input
                      value={details.venue?.address || ''}
                      onChange={(e) => updateField('venue.address', e.target.value)}
                      placeholder="Full venue address"
                    />
                  </div>
                  <div>
                    <Label>City, State, ZIP</Label>
                    <Input
                      value={details.venue?.city_state_zip || ''}
                      onChange={(e) => updateField('venue.city_state_zip', e.target.value)}
                      placeholder="City, ST 12345"
                    />
                  </div>
                  <div>
                    <Label>Venue Website</Label>
                    <Input
                      value={details.venue?.venue_website || ''}
                      onChange={(e) => updateField('venue.venue_website', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label>Meeting Room Name</Label>
                    <Input
                      value={details.venue?.meeting_room_name || ''}
                      onChange={(e) => updateField('venue.meeting_room_name', e.target.value)}
                      placeholder="Room/hall name"
                    />
                  </div>
                  <div>
                    <Label>Room Capacity</Label>
                    <Input
                      type="number"
                      value={details.venue?.room_capacity || ''}
                      onChange={(e) => updateField('venue.room_capacity', parseInt(e.target.value))}
                      placeholder="Maximum capacity"
                    />
                  </div>
                  <div>
                    <Label>Room Setup</Label>
                    <Select
                      value={details.venue?.room_setup || ''}
                      onValueChange={(value) => updateField('venue.room_setup', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select setup" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theater">Theater</SelectItem>
                        <SelectItem value="classroom">Classroom</SelectItem>
                        <SelectItem value="rounds">Rounds</SelectItem>
                        <SelectItem value="u-shape">U-Shape</SelectItem>
                        <SelectItem value="boardroom">Boardroom</SelectItem>
                        <SelectItem value="auditorium">Auditorium</SelectItem>
                        <SelectItem value="arena">Arena</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Closest Airport</Label>
                    <Input
                      value={details.venue?.closest_airport || ''}
                      onChange={(e) => updateField('venue.closest_airport', e.target.value)}
                      placeholder="Airport code (e.g., LAX)"
                    />
                  </div>
                  <div>
                    <Label>Distance from Airport</Label>
                    <Input
                      value={details.venue?.distance_from_airport || ''}
                      onChange={(e) => updateField('venue.distance_from_airport', e.target.value)}
                      placeholder="e.g., 10 miles / 20 minutes"
                    />
                  </div>
                </div>
              </div>

              {/* Venue Logistics */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Venue Logistics
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>Parking Information</Label>
                    <Textarea
                      value={details.venue?.parking_info || ''}
                      onChange={(e) => updateField('venue.parking_info', e.target.value)}
                      placeholder="Describe parking options, costs, validation, etc."
                      rows={2}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Loading Dock / Equipment Access</Label>
                    <Textarea
                      value={details.venue?.loading_dock_info || ''}
                      onChange={(e) => updateField('venue.loading_dock_info', e.target.value)}
                      placeholder="Loading dock location, access restrictions, elevator availability"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Venue Contact */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Venue Contact Person
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={details.venue?.venue_contact?.name || ''}
                      onChange={(e) => updateField('venue.venue_contact.name', e.target.value)}
                      placeholder="Venue contact name"
                    />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={details.venue?.venue_contact?.title || ''}
                      onChange={(e) => updateField('venue.venue_contact.title', e.target.value)}
                      placeholder="Job title"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={details.venue?.venue_contact?.email || ''}
                      onChange={(e) => updateField('venue.venue_contact.email', e.target.value)}
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={details.venue?.venue_contact?.office_phone || ''}
                      onChange={(e) => updateField('venue.venue_contact.office_phone', e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts" className="p-6 space-y-6">
              {/* On-Site Contact */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Primary On-Site Contact
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={details.contacts?.on_site?.name || ''}
                      onChange={(e) => updateField('contacts.on_site.name', e.target.value)}
                      placeholder="Contact name"
                    />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={details.contacts?.on_site?.title || ''}
                      onChange={(e) => updateField('contacts.on_site.title', e.target.value)}
                      placeholder="Job title"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={details.contacts?.on_site?.email || ''}
                      onChange={(e) => updateField('contacts.on_site.email', e.target.value)}
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <Label>Cell Phone</Label>
                    <Input
                      value={details.contacts?.on_site?.cell_phone || ''}
                      onChange={(e) => updateField('contacts.on_site.cell_phone', e.target.value)}
                      placeholder="Mobile number"
                    />
                  </div>
                  <div>
                    <Label>Best Contact Method</Label>
                    <Select
                      value={details.contacts?.on_site?.best_contact_method || ''}
                      onValueChange={(value) => updateField('contacts.on_site.best_contact_method', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Phone Call</SelectItem>
                        <SelectItem value="text">Text Message</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* A/V Contact */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Audio/Visual Contact
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={details.contacts?.av_contact?.name || ''}
                      onChange={(e) => updateField('contacts.av_contact.name', e.target.value)}
                      placeholder="A/V contact name"
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={details.contacts?.av_contact?.company_name || ''}
                      onChange={(e) => updateField('contacts.av_contact.company_name', e.target.value)}
                      placeholder="A/V company"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={details.contacts?.av_contact?.email || ''}
                      onChange={(e) => updateField('contacts.av_contact.email', e.target.value)}
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={details.contacts?.av_contact?.cell_phone || ''}
                      onChange={(e) => updateField('contacts.av_contact.cell_phone', e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Important Contacts */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Additional Contacts
                </h3>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 mb-2">Add any other important contacts for this event</div>
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <Label>Event Coordinator</Label>
                    <div className="grid md:grid-cols-2 gap-3 mt-2">
                      <Input placeholder="Name" />
                      <Input placeholder="Phone" />
                      <Input placeholder="Email" type="email" />
                      <Input placeholder="Role/Title" />
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <Label>Client Executive Sponsor</Label>
                    <div className="grid md:grid-cols-2 gap-3 mt-2">
                      <Input placeholder="Name" />
                      <Input placeholder="Phone" />
                      <Input placeholder="Email" type="email" />
                      <Input placeholder="Role/Title" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Itinerary Tab */}
            <TabsContent value="itinerary" className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Event Day Schedule
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Escort Person</Label>
                    <Input
                      value={details.itinerary?.escort_person || ''}
                      onChange={(e) => updateField('itinerary.escort_person', e.target.value)}
                      placeholder="Name of escort/handler"
                    />
                  </div>
                  <div>
                    <Label>Escort Phone</Label>
                    <Input
                      value={details.itinerary?.escort_phone || ''}
                      onChange={(e) => updateField('itinerary.escort_phone', e.target.value)}
                      placeholder="Escort contact number"
                    />
                  </div>
                  <div>
                    <Label>Doors Open Time</Label>
                    <Input
                      type="time"
                      value={details.itinerary?.doors_open_time || ''}
                      onChange={(e) => updateField('itinerary.doors_open_time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Speaker Arrival Time</Label>
                    <Input
                      type="time"
                      value={details.itinerary?.speaker_arrival_time || ''}
                      onChange={(e) => updateField('itinerary.speaker_arrival_time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Sound Check Time</Label>
                    <Input
                      type="time"
                      value={details.itinerary?.sound_check_time || ''}
                      onChange={(e) => updateField('itinerary.sound_check_time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Speaking Slot Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={details.itinerary?.speaking_slot?.duration_minutes || ''}
                      onChange={(e) => updateField('itinerary.speaking_slot.duration_minutes', parseInt(e.target.value))}
                      placeholder="e.g., 60"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Speaking Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={details.itinerary?.speaking_slot?.start_time || ''}
                      onChange={(e) => updateField('itinerary.speaking_slot.start_time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={details.itinerary?.speaking_slot?.end_time || ''}
                      onChange={(e) => updateField('itinerary.speaking_slot.end_time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Includes Q&A?</Label>
                    <Select
                      value={details.itinerary?.speaking_slot?.includes_qa ? 'yes' : 'no'}
                      onValueChange={(value) => updateField('itinerary.speaking_slot.includes_qa', value === 'yes')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Q&A Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={details.itinerary?.speaking_slot?.qa_duration_minutes || ''}
                      onChange={(e) => updateField('itinerary.speaking_slot.qa_duration_minutes', parseInt(e.target.value))}
                      placeholder="e.g., 15"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Audience Tab */}
            <TabsContent value="audience" className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Audience Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Expected Size</Label>
                    <Input
                      type="number"
                      value={details.audience?.expected_size || ''}
                      onChange={(e) => updateField('audience.expected_size', parseInt(e.target.value))}
                      placeholder="Expected attendance"
                    />
                  </div>
                  <div>
                    <Label>Actual Size (Post-Event)</Label>
                    <Input
                      type="number"
                      value={details.audience?.actual_size || ''}
                      onChange={(e) => updateField('audience.actual_size', parseInt(e.target.value))}
                      placeholder="Actual attendance"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Audience Description</Label>
                    <Textarea
                      value={details.audience?.audience_description || ''}
                      onChange={(e) => updateField('audience.audience_description', e.target.value)}
                      placeholder="Describe the audience composition, background, and expectations"
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Attendee Roles/Titles</Label>
                    <Input
                      value={details.audience?.attendee_role || ''}
                      onChange={(e) => updateField('audience.attendee_role', e.target.value)}
                      placeholder="e.g., Senior executives, managers, engineers"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Demographics</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Age Range</Label>
                    <Input
                      value={details.audience?.demographics?.age_range || ''}
                      onChange={(e) => updateField('audience.demographics.age_range', e.target.value)}
                      placeholder="e.g., 30-70"
                    />
                  </div>
                  <div>
                    <Label>Geographic Profile</Label>
                    <Select
                      value={details.audience?.demographics?.geographic_profile || ''}
                      onValueChange={(value) => updateField('audience.demographics.geographic_profile', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select profile" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local</SelectItem>
                        <SelectItem value="regional">Regional</SelectItem>
                        <SelectItem value="national">National</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Industry/Sector</Label>
                    <Input
                      value={details.audience?.demographics?.industry || ''}
                      onChange={(e) => updateField('audience.demographics.industry', e.target.value)}
                      placeholder="e.g., Technology, Healthcare"
                    />
                  </div>
                  <div>
                    <Label>Seniority Levels</Label>
                    <Input
                      value={details.audience?.demographics?.seniority_level?.join(', ') || ''}
                      onChange={(e) => updateField('audience.demographics.seniority_level', e.target.value.split(', '))}
                      placeholder="e.g., C-Suite, Directors, Managers"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Event Details Tab */}
            <TabsContent value="event" className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Event Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Event Title</Label>
                    <Input
                      value={details.event_details?.event_title || ''}
                      onChange={(e) => updateField('event_details.event_title', e.target.value)}
                      placeholder="Official event name"
                    />
                  </div>
                  <div>
                    <Label>Event Type</Label>
                    <Select
                      value={details.event_details?.event_type || ''}
                      onValueChange={(value) => updateField('event_details.event_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="seminar">Seminar</SelectItem>
                        <SelectItem value="corporate_meeting">Corporate Meeting</SelectItem>
                        <SelectItem value="association">Association Event</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Event Theme</Label>
                    <Input
                      value={details.event_details?.event_theme || ''}
                      onChange={(e) => updateField('event_details.event_theme', e.target.value)}
                      placeholder="Theme or focus area"
                    />
                  </div>
                  <div>
                    <Label>Is Annual Event?</Label>
                    <Select
                      value={details.event_details?.is_annual_event ? 'yes' : 'no'}
                      onValueChange={(value) => updateField('event_details.is_annual_event', value === 'yes')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Event Purpose</Label>
                    <Textarea
                      value={details.event_details?.event_purpose || ''}
                      onChange={(e) => updateField('event_details.event_purpose', e.target.value)}
                      placeholder="Primary goals and objectives of the event"
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Why This Speaker?</Label>
                    <Textarea
                      value={details.event_details?.speaker_selection_reason || ''}
                      onChange={(e) => updateField('event_details.speaker_selection_reason', e.target.value)}
                      placeholder="Reason for selecting this speaker"
                      rows={2}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Key Message Goals</Label>
                    <Textarea
                      value={details.event_details?.key_message_goals || ''}
                      onChange={(e) => updateField('event_details.key_message_goals', e.target.value)}
                      placeholder="What key messages should the audience take away?"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Additional Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Event Hashtag</Label>
                    <Input
                      value={details.event_details?.event_hashtag || ''}
                      onChange={(e) => updateField('event_details.event_hashtag', e.target.value)}
                      placeholder="#EventHashtag"
                    />
                  </div>
                  <div>
                    <Label>Can Publicize?</Label>
                    <Select
                      value={details.event_details?.can_publicize ? 'yes' : 'no'}
                      onValueChange={(value) => updateField('event_details.can_publicize', value === 'yes')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Book Distribution?</Label>
                    <Select
                      value={details.event_details?.book_distribution ? 'yes' : 'no'}
                      onValueChange={(value) => updateField('event_details.book_distribution', value === 'yes')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Book Signing?</Label>
                    <Select
                      value={details.event_details?.book_signing ? 'yes' : 'no'}
                      onValueChange={(value) => updateField('event_details.book_signing', value === 'yes')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Speaker Requirements Tab */}
            <TabsContent value="speaker" className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Speaker Introduction
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label>Introduction Text</Label>
                    <Textarea
                      value={details.speaker_requirements?.introduction?.text || ''}
                      onChange={(e) => updateField('speaker_requirements.introduction.text', e.target.value)}
                      placeholder="Speaker introduction script"
                      rows={4}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Phonetic Name</Label>
                      <Input
                        value={details.speaker_requirements?.introduction?.phonetic_name || ''}
                        onChange={(e) => updateField('speaker_requirements.introduction.phonetic_name', e.target.value)}
                        placeholder="e.g., Hodak rhymes with Kodak"
                      />
                    </div>
                    <div>
                      <Label>Introducer Name</Label>
                      <Input
                        value={details.speaker_requirements?.introduction?.introducer_name || ''}
                        onChange={(e) => updateField('speaker_requirements.introduction.introducer_name', e.target.value)}
                        placeholder="Who will introduce the speaker"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  A/V Requirements
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Microphone Type</Label>
                    <Select
                      value={details.speaker_requirements?.av_needs?.microphone_type || ''}
                      onValueChange={(value) => updateField('speaker_requirements.av_needs.microphone_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lavalier">Lavalier</SelectItem>
                        <SelectItem value="countryman">Countryman</SelectItem>
                        <SelectItem value="handheld">Handheld</SelectItem>
                        <SelectItem value="headset">Headset</SelectItem>
                        <SelectItem value="podium">Podium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Presentation Format</Label>
                    <Select
                      value={details.speaker_requirements?.av_needs?.presentation_format || ''}
                      onValueChange={(value) => updateField('speaker_requirements.av_needs.presentation_format', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="powerpoint">PowerPoint</SelectItem>
                        <SelectItem value="keynote">Keynote</SelectItem>
                        <SelectItem value="mentimeter">Mentimeter</SelectItem>
                        <SelectItem value="prezi">Prezi</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Confidence Monitor?</Label>
                    <Select
                      value={details.speaker_requirements?.av_needs?.confidence_monitor ? 'yes' : 'no'}
                      onValueChange={(value) => updateField('speaker_requirements.av_needs.confidence_monitor', value === 'yes')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Remote Clicker?</Label>
                    <Select
                      value={details.speaker_requirements?.av_needs?.remote_clicker ? 'yes' : 'no'}
                      onValueChange={(value) => updateField('speaker_requirements.av_needs.remote_clicker', value === 'yes')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Internet Required?</Label>
                    <Select
                      value={details.speaker_requirements?.av_needs?.internet_required ? 'yes' : 'no'}
                      onValueChange={(value) => updateField('speaker_requirements.av_needs.internet_required', value === 'yes')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Recording Permitted?</Label>
                    <Select
                      value={details.speaker_requirements?.presentation?.recording_permitted ? 'yes' : 'no'}
                      onValueChange={(value) => updateField('speaker_requirements.presentation.recording_permitted', value === 'yes')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Attire & Preferences</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Recommended Attire</Label>
                    <Select
                      value={details.speaker_requirements?.recommended_attire || ''}
                      onValueChange={(value) => updateField('speaker_requirements.recommended_attire', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select attire" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business_formal">Business Formal</SelectItem>
                        <SelectItem value="business_casual">Business Casual</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="black_tie">Black Tie</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Water Preference</Label>
                    <Input
                      value={details.speaker_requirements?.av_needs?.water_preference || ''}
                      onChange={(e) => updateField('speaker_requirements.av_needs.water_preference', e.target.value)}
                      placeholder="e.g., Still, room temperature"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Online Presence Tab */}
            <TabsContent value="online" className="p-6 space-y-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Online Presence & Links
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Event Website</Label>
                  <Input
                    value={details.online_presence?.event_website || ''}
                    onChange={(e) => updateField('online_presence.event_website', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label>Registration Link</Label>
                  <Input
                    value={details.online_presence?.registration_link || ''}
                    onChange={(e) => updateField('online_presence.registration_link', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label>LinkedIn URL</Label>
                  <Input
                    value={details.online_presence?.linkedin_url || ''}
                    onChange={(e) => updateField('online_presence.linkedin_url', e.target.value)}
                    placeholder="LinkedIn event page"
                  />
                </div>
                <div>
                  <Label>Facebook Event</Label>
                  <Input
                    value={details.online_presence?.facebook_event || ''}
                    onChange={(e) => updateField('online_presence.facebook_event', e.target.value)}
                    placeholder="Facebook event URL"
                  />
                </div>
                <div>
                  <Label>Twitter/X Handle</Label>
                  <Input
                    value={details.online_presence?.twitter_handle || ''}
                    onChange={(e) => updateField('online_presence.twitter_handle', e.target.value)}
                    placeholder="@handle"
                  />
                </div>
                <div>
                  <Label>Instagram Handle</Label>
                  <Input
                    value={details.online_presence?.instagram_handle || ''}
                    onChange={(e) => updateField('online_presence.instagram_handle', e.target.value)}
                    placeholder="@handle"
                  />
                </div>
                <div>
                  <Label>YouTube Channel</Label>
                  <Input
                    value={details.online_presence?.youtube_channel || ''}
                    onChange={(e) => updateField('online_presence.youtube_channel', e.target.value)}
                    placeholder="YouTube channel URL"
                  />
                </div>
                <div>
                  <Label>Event App</Label>
                  <Input
                    value={details.online_presence?.event_app || ''}
                    onChange={(e) => updateField('online_presence.event_app', e.target.value)}
                    placeholder="Mobile app name/link"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}