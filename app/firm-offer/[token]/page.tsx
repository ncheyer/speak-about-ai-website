"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Save,
  FileSignature,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building2,
  Calendar,
  DollarSign
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FirmOffer {
  id: number
  access_token: string
  status: string
  event_classification: string
  company_name: string
  end_client_name: string
  event_name: string
  event_date: string
  event_location: string
  event_website: string
  billing_contact_name: string
  billing_contact_title: string
  billing_contact_email: string
  billing_contact_phone: string
  billing_address: string
  logistics_contact_name: string
  logistics_contact_email: string
  logistics_contact_phone: string
  speaker_name: string
  program_topic: string
  program_type: string
  audience_size: number
  audience_demographics: string
  speaker_attire: string
  event_start_time: string
  event_end_time: string
  speaker_arrival_time: string
  program_start_time: string
  program_length_minutes: number
  qa_length_minutes: number
  timezone: string
  recording_allowed: boolean
  recording_purpose: string
  live_streaming: boolean
  photography_allowed: boolean
  fly_in_date: string
  fly_out_date: string
  nearest_airport: string
  airport_transport_provided: boolean
  hotel_name: string
  hotel_dates_needed: string
  speaker_fee: number
  travel_expenses_type: string
  travel_expenses_amount: number
  payment_terms: string
  green_room_available: boolean
  prep_call_requested: boolean
  additional_notes: string
  venue_name: string
  venue_address: string
  venue_contact_name: string
  venue_contact_email: string
  venue_contact_phone: string
  detailed_timeline: string
  meals_provided: string
  dietary_requirements: string
  special_requests: string
}

export default function PublicFirmOfferPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [formData, setFormData] = useState<Partial<FirmOffer>>({})
  const [wasComplete, setWasComplete] = useState(false)

  useEffect(() => {
    loadFirmOffer()
  }, [token])

  const loadFirmOffer = async () => {
    try {
      const response = await fetch(`/api/firm-offers/public/${token}`)
      if (response.ok) {
        const data = await response.json()
        setFormData(data)
        setWasComplete(data.status === 'completed')
      } else {
        setNotFound(true)
      }
    } catch (error) {
      console.error("Error loading firm offer:", error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/firm-offers/public/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, _wasComplete: wasComplete })
      })

      if (response.ok) {
        const result = await response.json()
        setFormData(result)

        if (result.status === 'completed' && !wasComplete) {
          setWasComplete(true)
          toast({
            title: "Form Completed!",
            description: "Thank you! The speaker bureau has been notified."
          })
        } else {
          toast({
            title: "Saved",
            description: "Your changes have been saved."
          })
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to save changes",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Calculate completion percentage
  const requiredFields = [
    'company_name', 'event_name', 'event_date',
    'billing_contact_name', 'billing_contact_email',
    'logistics_contact_name', 'logistics_contact_email',
    'speaker_name', 'program_topic', 'speaker_fee'
  ]
  const filledRequired = requiredFields.filter(f => formData[f as keyof FirmOffer]).length
  const completionPercent = Math.round((filledRequired / requiredFields.length) * 100)

  const isVirtual = formData.event_classification === 'virtual'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Form Not Found</h2>
            <p className="text-gray-600">This firm offer link is invalid or has expired.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <FileSignature className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Firm Offer Sheet</h1>
          <p className="text-gray-600 mt-2">Please complete the event details below</p>

          {formData.status === 'completed' && (
            <Badge className="mt-4 bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4 mr-1" />
              Completed
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Completion Progress</span>
              <span className="text-sm text-gray-500">{completionPercent}%</span>
            </div>
            <Progress value={completionPercent} className="h-2" />
            {completionPercent < 100 && (
              <p className="text-xs text-gray-500 mt-2">
                Fill in all required fields (*) to complete the form
              </p>
            )}
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="mb-6 border-amber-200">
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Speaker</p>
                <p className="font-medium">{formData.speaker_name || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-gray-500">Event Date</p>
                <p className="font-medium">
                  {formData.event_date ? new Date(formData.event_date).toLocaleDateString() : 'TBD'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Location</p>
                <p className="font-medium">{formData.event_location || 'TBD'}</p>
              </div>
              <div>
                <p className="text-gray-500">Speaker Fee</p>
                <p className="font-medium text-green-600">
                  ${parseFloat(String(formData.speaker_fee || 0)).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="program">Program</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="travel" disabled={isVirtual}>Travel</TabsTrigger>
            <TabsTrigger value="venue">Venue</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Event Overview</CardTitle>
                <CardDescription>Basic event information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Event Type</Label>
                  <Select
                    value={formData.event_classification || 'travel'}
                    onValueChange={(value) => updateField('event_classification', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual (Online)</SelectItem>
                      <SelectItem value="local">Local (No Travel)</SelectItem>
                      <SelectItem value="travel">Travel Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company / Organization *</Label>
                    <Input
                      value={formData.company_name || ''}
                      onChange={(e) => updateField('company_name', e.target.value)}
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div>
                    <Label>End Client (if different)</Label>
                    <Input
                      value={formData.end_client_name || ''}
                      onChange={(e) => updateField('end_client_name', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Event Name *</Label>
                  <Input
                    value={formData.event_name || ''}
                    onChange={(e) => updateField('event_name', e.target.value)}
                    placeholder="Annual Leadership Summit 2025"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Event Date *</Label>
                    <Input
                      type="date"
                      value={formData.event_date?.split('T')[0] || ''}
                      onChange={(e) => updateField('event_date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Event Location</Label>
                    <Input
                      value={formData.event_location || ''}
                      onChange={(e) => updateField('event_location', e.target.value)}
                      placeholder="San Francisco, CA"
                      disabled={isVirtual}
                    />
                  </div>
                </div>

                <div>
                  <Label>Event Website</Label>
                  <Input
                    value={formData.event_website || ''}
                    onChange={(e) => updateField('event_website', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        value={formData.billing_contact_name || ''}
                        onChange={(e) => updateField('billing_contact_name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={formData.billing_contact_title || ''}
                        onChange={(e) => updateField('billing_contact_title', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={formData.billing_contact_email || ''}
                        onChange={(e) => updateField('billing_contact_email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={formData.billing_contact_phone || ''}
                        onChange={(e) => updateField('billing_contact_phone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Billing Address</Label>
                    <Textarea
                      value={formData.billing_address || ''}
                      onChange={(e) => updateField('billing_address', e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Logistics Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        value={formData.logistics_contact_name || ''}
                        onChange={(e) => updateField('logistics_contact_name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={formData.logistics_contact_email || ''}
                        onChange={(e) => updateField('logistics_contact_email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={formData.logistics_contact_phone || ''}
                        onChange={(e) => updateField('logistics_contact_phone', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Program Tab */}
          <TabsContent value="program">
            <Card>
              <CardHeader>
                <CardTitle>Speaker Program Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Speaker Name *</Label>
                    <Input
                      value={formData.speaker_name || ''}
                      onChange={(e) => updateField('speaker_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Program Type</Label>
                    <Select
                      value={formData.program_type || 'keynote'}
                      onValueChange={(value) => updateField('program_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="keynote">Keynote</SelectItem>
                        <SelectItem value="fireside_chat">Fireside Chat</SelectItem>
                        <SelectItem value="panel_discussion">Panel Discussion</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="breakout_session">Breakout Session</SelectItem>
                        <SelectItem value="emcee">Emcee / Host</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Program Topic *</Label>
                  <Input
                    value={formData.program_topic || ''}
                    onChange={(e) => updateField('program_topic', e.target.value)}
                    placeholder="AI in the Enterprise: What Leaders Need to Know"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Audience Size</Label>
                    <Input
                      type="number"
                      value={formData.audience_size || ''}
                      onChange={(e) => updateField('audience_size', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Speaker Attire</Label>
                    <Select
                      value={formData.speaker_attire || 'business_casual'}
                      onValueChange={(value) => updateField('speaker_attire', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business_formal">Business Formal</SelectItem>
                        <SelectItem value="business_casual">Business Casual</SelectItem>
                        <SelectItem value="smart_casual">Smart Casual</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="black_tie">Black Tie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Audience Demographics</Label>
                  <Textarea
                    value={formData.audience_demographics || ''}
                    onChange={(e) => updateField('audience_demographics', e.target.value)}
                    placeholder="Job titles, industries, experience levels..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Speaker Fee *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      value={formData.speaker_fee || ''}
                      onChange={(e) => updateField('speaker_fee', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Event Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Event Start Time</Label>
                    <Input
                      type="time"
                      value={formData.event_start_time || ''}
                      onChange={(e) => updateField('event_start_time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Event End Time</Label>
                    <Input
                      type="time"
                      value={formData.event_end_time || ''}
                      onChange={(e) => updateField('event_end_time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Timezone</Label>
                    <Select
                      value={formData.timezone || 'America/Los_Angeles'}
                      onValueChange={(value) => updateField('timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Speaker Arrival Time</Label>
                    <Input
                      type="time"
                      value={formData.speaker_arrival_time || ''}
                      onChange={(e) => updateField('speaker_arrival_time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Program Start Time</Label>
                    <Input
                      type="time"
                      value={formData.program_start_time || ''}
                      onChange={(e) => updateField('program_start_time', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Program Length (minutes)</Label>
                    <Input
                      type="number"
                      value={formData.program_length_minutes || ''}
                      onChange={(e) => updateField('program_length_minutes', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Q&A Length (minutes)</Label>
                    <Input
                      type="number"
                      value={formData.qa_length_minutes || ''}
                      onChange={(e) => updateField('qa_length_minutes', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Detailed Timeline / Agenda</Label>
                  <Textarea
                    value={formData.detailed_timeline || ''}
                    onChange={(e) => updateField('detailed_timeline', e.target.value)}
                    rows={4}
                    placeholder="8:00 AM - Registration&#10;9:00 AM - Opening Remarks&#10;9:30 AM - Keynote..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Technical & Recording</Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="recording"
                        checked={formData.recording_allowed || false}
                        onCheckedChange={(checked) => updateField('recording_allowed', checked)}
                      />
                      <Label htmlFor="recording" className="font-normal">Recording Allowed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="streaming"
                        checked={formData.live_streaming || false}
                        onCheckedChange={(checked) => updateField('live_streaming', checked)}
                      />
                      <Label htmlFor="streaming" className="font-normal">Live Streaming</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="photography"
                        checked={formData.photography_allowed || false}
                        onCheckedChange={(checked) => updateField('photography_allowed', checked)}
                      />
                      <Label htmlFor="photography" className="font-normal">Photography</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Travel Tab */}
          <TabsContent value="travel">
            <Card>
              <CardHeader>
                <CardTitle>Travel & Accommodation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Fly-In Date</Label>
                    <Input
                      type="date"
                      value={formData.fly_in_date?.split('T')[0] || ''}
                      onChange={(e) => updateField('fly_in_date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Fly-Out Date</Label>
                    <Input
                      type="date"
                      value={formData.fly_out_date?.split('T')[0] || ''}
                      onChange={(e) => updateField('fly_out_date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Nearest Airport</Label>
                    <Input
                      value={formData.nearest_airport || ''}
                      onChange={(e) => updateField('nearest_airport', e.target.value)}
                      placeholder="SFO"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="airport_transport"
                    checked={formData.airport_transport_provided || false}
                    onCheckedChange={(checked) => updateField('airport_transport_provided', checked)}
                  />
                  <Label htmlFor="airport_transport" className="font-normal">Airport Transportation Provided</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Hotel Name</Label>
                    <Input
                      value={formData.hotel_name || ''}
                      onChange={(e) => updateField('hotel_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Hotel Dates Needed</Label>
                    <Input
                      value={formData.hotel_dates_needed || ''}
                      onChange={(e) => updateField('hotel_dates_needed', e.target.value)}
                      placeholder="March 14-16, 2025"
                    />
                  </div>
                </div>

                <div>
                  <Label>Meals Provided</Label>
                  <Textarea
                    value={formData.meals_provided || ''}
                    onChange={(e) => updateField('meals_provided', e.target.value)}
                    placeholder="Breakfast, lunch, and dinner provided..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Dietary Requirements</Label>
                  <Input
                    value={formData.dietary_requirements || ''}
                    onChange={(e) => updateField('dietary_requirements', e.target.value)}
                    placeholder="Vegetarian, gluten-free, etc."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Venue Tab */}
          <TabsContent value="venue">
            <Card>
              <CardHeader>
                <CardTitle>Venue Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Venue Name</Label>
                  <Input
                    value={formData.venue_name || ''}
                    onChange={(e) => updateField('venue_name', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Venue Address</Label>
                  <Textarea
                    value={formData.venue_address || ''}
                    onChange={(e) => updateField('venue_address', e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Contact Name</Label>
                    <Input
                      value={formData.venue_contact_name || ''}
                      onChange={(e) => updateField('venue_contact_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      value={formData.venue_contact_email || ''}
                      onChange={(e) => updateField('venue_contact_email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Contact Phone</Label>
                    <Input
                      value={formData.venue_contact_phone || ''}
                      onChange={(e) => updateField('venue_contact_phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="green_room"
                      checked={formData.green_room_available || false}
                      onCheckedChange={(checked) => updateField('green_room_available', checked)}
                    />
                    <Label htmlFor="green_room" className="font-normal">Green Room Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="prep_call"
                      checked={formData.prep_call_requested || false}
                      onCheckedChange={(checked) => updateField('prep_call_requested', checked)}
                    />
                    <Label htmlFor="prep_call" className="font-normal">Prep Call Requested</Label>
                  </div>
                </div>

                <div>
                  <Label>Special Requests / Additional Notes</Label>
                  <Textarea
                    value={formData.special_requests || formData.additional_notes || ''}
                    onChange={(e) => {
                      updateField('special_requests', e.target.value)
                      updateField('additional_notes', e.target.value)
                    }}
                    rows={3}
                    placeholder="Any special requirements or additional information..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 px-8"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save & Submit
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by Speak About AI</p>
        </div>
      </div>
    </div>
  )
}
