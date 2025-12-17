"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Save,
  FileSignature,
  Building2,
  User,
  Calendar,
  MapPin,
  DollarSign,
  Plane,
  Hotel,
  Mic,
  Clock,
  Users,
  Loader2,
  Copy,
  ExternalLink,
  CheckCircle,
  Link as LinkIcon,
  Send
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useToast } from "@/hooks/use-toast"

interface Deal {
  id: number
  title: string
  company: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  value: string
  status: string
  event_date: string
  event_location: string
  speaker_id: number
  speaker_name?: string
  notes?: string
}

export default function NewFirmOfferPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    }>
      <NewFirmOfferContent />
    </Suspense>
  )
}

function NewFirmOfferContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const dealId = searchParams.get('deal_id')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deal, setDeal] = useState<Deal | null>(null)
  const [createdOffer, setCreatedOffer] = useState<{ id: number; share_url: string } | null>(null)
  const [copied, setCopied] = useState(false)

  // Form state - pre-populated from deal
  const [formData, setFormData] = useState({
    // Overview
    event_classification: 'travel' as 'virtual' | 'local' | 'travel',
    company_name: '',
    end_client_name: '',
    event_name: '',
    event_date: '',
    event_location: '',
    event_website: '',

    // Billing Contact
    billing_contact_name: '',
    billing_contact_title: '',
    billing_contact_email: '',
    billing_contact_phone: '',
    billing_address: '',

    // Logistics Contact
    logistics_contact_name: '',
    logistics_contact_email: '',
    logistics_contact_phone: '',

    // Program Details
    speaker_name: '',
    program_topic: '',
    program_type: 'keynote',
    audience_size: '',
    audience_demographics: '',
    speaker_attire: 'business_casual',

    // Schedule
    event_start_time: '',
    event_end_time: '',
    speaker_arrival_time: '',
    program_start_time: '',
    program_length_minutes: '',
    qa_length_minutes: '',
    timezone: 'America/Los_Angeles',

    // Technical
    recording_allowed: false,
    recording_purpose: '',
    live_streaming: false,
    photography_allowed: false,

    // Travel
    fly_in_date: '',
    fly_out_date: '',
    nearest_airport: '',
    airport_transport_provided: false,
    hotel_name: '',
    hotel_dates_needed: '',

    // Financial
    speaker_fee: '',
    travel_expenses_type: 'flat_buyout',
    travel_expenses_amount: '',
    payment_terms: 'net_30',

    // Additional
    green_room_available: false,
    prep_call_requested: false,
    additional_notes: ''
  })

  useEffect(() => {
    if (dealId) {
      loadDeal(dealId)
    } else {
      setLoading(false)
    }
  }, [dealId])

  const loadDeal = async (id: string) => {
    try {
      const response = await fetch(`/api/deals/${id}`)
      if (response.ok) {
        const dealData = await response.json()
        setDeal(dealData)

        // Pre-populate form from deal data
        setFormData(prev => ({
          ...prev,
          company_name: dealData.company || '',
          event_name: dealData.title || '',
          event_date: dealData.event_date?.split('T')[0] || '',
          event_location: dealData.event_location || '',
          billing_contact_name: dealData.contact_name || '',
          billing_contact_email: dealData.contact_email || '',
          billing_contact_phone: dealData.contact_phone || '',
          logistics_contact_name: dealData.contact_name || '',
          logistics_contact_email: dealData.contact_email || '',
          logistics_contact_phone: dealData.contact_phone || '',
          speaker_name: dealData.speaker_name || '',
          speaker_fee: dealData.value || ''
        }))
      }
    } catch (error) {
      console.error("Error loading deal:", error)
      toast({
        title: "Error",
        description: "Failed to load deal data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      // Create firm offer (as a project linked to the deal)
      const response = await fetch("/api/firm-offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deal_id: dealId ? parseInt(dealId) : null,
          ...formData
        })
      })

      if (response.ok) {
        const result = await response.json()
        setCreatedOffer({
          id: result.id,
          share_url: result.share_url
        })
        toast({
          title: "Success",
          description: "Firm offer created successfully"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to create firm offer",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error creating firm offer:", error)
      toast({
        title: "Error",
        description: "Failed to create firm offer",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const copyLink = async () => {
    if (createdOffer) {
      const fullUrl = `${window.location.origin}${createdOffer.share_url}`
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      toast({
        title: "Link Copied!",
        description: "Share this link with the client to fill in the details"
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isVirtual = formData.event_classification === 'virtual'
  const isLocal = formData.event_classification === 'local'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    )
  }

  // Success state - show share link
  if (createdOffer) {
    const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${createdOffer.share_url}`

    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="fixed left-0 top-0 h-full z-[60]">
          <AdminSidebar />
        </div>
        <div className="flex-1 ml-72 min-h-screen flex items-center justify-center">
          <Card className="max-w-lg w-full mx-4">
            <CardContent className="pt-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Firm Offer Created!</h2>
              <p className="text-gray-600 mb-6">Share this link with the client to fill in the event details</p>

              {/* Share Link */}
              <div className="bg-gray-50 border rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Share Link</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={fullUrl}
                    readOnly
                    className="text-sm bg-white"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyLink}
                    className={copied ? "border-green-500 text-green-500" : ""}
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  className="bg-amber-500 hover:bg-amber-600"
                  onClick={copyLink}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(createdOffer.share_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Form
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/admin/firm-offers')}
                >
                  Back to Firm Offers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-[60]">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <FileSignature className="h-6 w-6 text-amber-500" />
                  Create Firm Offer
                </h1>
                {deal && (
                  <p className="text-gray-600">
                    For: {deal.title || deal.company} - {deal.speaker_name}
                  </p>
                )}
              </div>
            </div>
            <Button
              className="bg-amber-500 hover:bg-amber-600"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Firm Offer
            </Button>
          </div>

          {/* Deal Summary Card */}
          {deal && (
            <Card className="mb-6 border-amber-200 bg-amber-50">
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-amber-700 font-medium">Company</p>
                    <p>{deal.company}</p>
                  </div>
                  <div>
                    <p className="text-amber-700 font-medium">Speaker</p>
                    <p>{deal.speaker_name}</p>
                  </div>
                  <div>
                    <p className="text-amber-700 font-medium">Event Date</p>
                    <p>{deal.event_date ? new Date(deal.event_date).toLocaleDateString() : 'TBD'}</p>
                  </div>
                  <div>
                    <p className="text-amber-700 font-medium">Location</p>
                    <p>{deal.event_location || 'TBD'}</p>
                  </div>
                  <div>
                    <p className="text-amber-700 font-medium">Deal Value</p>
                    <p className="text-lg font-bold text-green-600">${parseFloat(deal.value || '0').toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Sections on One Page */}
          <div className="space-y-6">
            {/* Event Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Event Overview</CardTitle>
                <CardDescription>Basic event information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Event Type</Label>
                  <Select
                    value={formData.event_classification}
                    onValueChange={(value) => updateField('event_classification', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual (Online)</SelectItem>
                      <SelectItem value="local">Local (No Travel Required)</SelectItem>
                      <SelectItem value="travel">Travel Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company / Organization</Label>
                    <Input
                      value={formData.company_name}
                      onChange={(e) => updateField('company_name', e.target.value)}
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div>
                    <Label>End Client (if different)</Label>
                    <Input
                      value={formData.end_client_name}
                      onChange={(e) => updateField('end_client_name', e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <Label>Event Name</Label>
                  <Input
                    value={formData.event_name}
                    onChange={(e) => updateField('event_name', e.target.value)}
                    placeholder="Annual Leadership Summit 2025"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Event Date</Label>
                    <Input
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => updateField('event_date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Event Location</Label>
                    <Input
                      value={formData.event_location}
                      onChange={(e) => updateField('event_location', e.target.value)}
                      placeholder="San Francisco, CA"
                      disabled={isVirtual}
                    />
                  </div>
                </div>

                <div>
                  <Label>Event Website</Label>
                  <Input
                    value={formData.event_website}
                    onChange={(e) => updateField('event_website', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Billing Contact</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={formData.billing_contact_name}
                        onChange={(e) => updateField('billing_contact_name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={formData.billing_contact_title}
                        onChange={(e) => updateField('billing_contact_title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.billing_contact_email}
                        onChange={(e) => updateField('billing_contact_email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={formData.billing_contact_phone}
                        onChange={(e) => updateField('billing_contact_phone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Billing Address</Label>
                    <Textarea
                      value={formData.billing_address}
                      onChange={(e) => updateField('billing_address', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-3">Logistics Contact</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={formData.logistics_contact_name}
                        onChange={(e) => updateField('logistics_contact_name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.logistics_contact_email}
                        onChange={(e) => updateField('logistics_contact_email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={formData.logistics_contact_phone}
                        onChange={(e) => updateField('logistics_contact_phone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Speaker Program Details */}
            <Card>
              <CardHeader>
                <CardTitle>Speaker Program Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Speaker Name</Label>
                    <Input
                      value={formData.speaker_name}
                      onChange={(e) => updateField('speaker_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Program Type</Label>
                    <Select
                      value={formData.program_type}
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
                  <Label>Program Topic</Label>
                  <Input
                    value={formData.program_topic}
                    onChange={(e) => updateField('program_topic', e.target.value)}
                    placeholder="AI in the Enterprise: What Leaders Need to Know"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Audience Size</Label>
                    <Input
                      type="number"
                      value={formData.audience_size}
                      onChange={(e) => updateField('audience_size', e.target.value)}
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <Label>Speaker Attire</Label>
                    <Select
                      value={formData.speaker_attire}
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
                    value={formData.audience_demographics}
                    onChange={(e) => updateField('audience_demographics', e.target.value)}
                    placeholder="C-suite executives, VPs of Technology, IT Directors..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Event Schedule */}
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
                      value={formData.event_start_time}
                      onChange={(e) => updateField('event_start_time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Event End Time</Label>
                    <Input
                      type="time"
                      value={formData.event_end_time}
                      onChange={(e) => updateField('event_end_time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Timezone</Label>
                    <Select
                      value={formData.timezone}
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

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label>Speaker Arrival</Label>
                    <Input
                      type="time"
                      value={formData.speaker_arrival_time}
                      onChange={(e) => updateField('speaker_arrival_time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Program Start</Label>
                    <Input
                      type="time"
                      value={formData.program_start_time}
                      onChange={(e) => updateField('program_start_time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Program (min)</Label>
                    <Input
                      type="number"
                      value={formData.program_length_minutes}
                      onChange={(e) => updateField('program_length_minutes', e.target.value)}
                      placeholder="45"
                    />
                  </div>
                  <div>
                    <Label>Q&A (min)</Label>
                    <Input
                      type="number"
                      value={formData.qa_length_minutes}
                      onChange={(e) => updateField('qa_length_minutes', e.target.value)}
                      placeholder="15"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recording"
                      checked={formData.recording_allowed}
                      onCheckedChange={(checked) => updateField('recording_allowed', checked)}
                    />
                    <Label htmlFor="recording" className="font-normal">Recording Allowed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="streaming"
                      checked={formData.live_streaming}
                      onCheckedChange={(checked) => updateField('live_streaming', checked)}
                    />
                    <Label htmlFor="streaming" className="font-normal">Live Streaming</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="photography"
                      checked={formData.photography_allowed}
                      onCheckedChange={(checked) => updateField('photography_allowed', checked)}
                    />
                    <Label htmlFor="photography" className="font-normal">Photography</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel & Accommodation - only show if not virtual */}
            {!isVirtual && (
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
                        value={formData.fly_in_date}
                        onChange={(e) => updateField('fly_in_date', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Fly-Out Date</Label>
                      <Input
                        type="date"
                        value={formData.fly_out_date}
                        onChange={(e) => updateField('fly_out_date', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Nearest Airport</Label>
                      <Input
                        value={formData.nearest_airport}
                        onChange={(e) => updateField('nearest_airport', e.target.value)}
                        placeholder="SFO"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="airport_transport"
                      checked={formData.airport_transport_provided}
                      onCheckedChange={(checked) => updateField('airport_transport_provided', checked)}
                    />
                    <Label htmlFor="airport_transport" className="font-normal">Airport Transportation Provided by Client</Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Hotel Name</Label>
                      <Input
                        value={formData.hotel_name}
                        onChange={(e) => updateField('hotel_name', e.target.value)}
                        placeholder="Four Seasons"
                      />
                    </div>
                    <div>
                      <Label>Hotel Dates Needed</Label>
                      <Input
                        value={formData.hotel_dates_needed}
                        onChange={(e) => updateField('hotel_dates_needed', e.target.value)}
                        placeholder="March 14-16, 2025"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financial Details */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Speaker Fee</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        value={formData.speaker_fee}
                        onChange={(e) => updateField('speaker_fee', e.target.value)}
                        className="pl-10"
                        placeholder="25000"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Payment Terms</Label>
                    <Select
                      value={formData.payment_terms}
                      onValueChange={(value) => updateField('payment_terms', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="net_30">Net 30</SelectItem>
                        <SelectItem value="net_15">Net 15</SelectItem>
                        <SelectItem value="upon_completion">Upon Completion</SelectItem>
                        <SelectItem value="deposit_balance">50% Deposit / 50% Balance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Travel Expenses</Label>
                    <Select
                      value={formData.travel_expenses_type}
                      onValueChange={(value) => updateField('travel_expenses_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat_buyout">Flat Buyout</SelectItem>
                        <SelectItem value="actual_expenses">Actual Expenses</SelectItem>
                        <SelectItem value="client_books">Client Books Travel</SelectItem>
                        <SelectItem value="included">Included in Fee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.travel_expenses_type === 'flat_buyout' && (
                    <div>
                      <Label>Travel Buyout Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="number"
                          value={formData.travel_expenses_amount}
                          onChange={(e) => updateField('travel_expenses_amount', e.target.value)}
                          className="pl-10"
                          placeholder="2500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="green_room"
                      checked={formData.green_room_available}
                      onCheckedChange={(checked) => updateField('green_room_available', checked)}
                    />
                    <Label htmlFor="green_room" className="font-normal">Green Room Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="prep_call"
                      checked={formData.prep_call_requested}
                      onCheckedChange={(checked) => updateField('prep_call_requested', checked)}
                    />
                    <Label htmlFor="prep_call" className="font-normal">Prep Call Requested</Label>
                  </div>
                </div>

                <div>
                  <Label>Additional Notes</Label>
                  <Textarea
                    value={formData.additional_notes}
                    onChange={(e) => updateField('additional_notes', e.target.value)}
                    rows={3}
                    placeholder="Any special requests or additional information..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Save Button */}
          <div className="flex justify-end mt-6">
            <Button
              className="bg-amber-500 hover:bg-amber-600"
              size="lg"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Firm Offer
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
