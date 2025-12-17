"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Building,
  Calendar,
  Clock,
  MapPin,
  Users,
  Mic,
  Plane,
  Hotel,
  DollarSign,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  Camera
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Props {
  token: string
  firmOffer: any
  speakerName: string
}

export function SpeakerReviewClient({ token, firmOffer, speakerName }: Props) {
  const { toast } = useToast()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDeclineDialog, setShowDeclineDialog] = useState(false)
  const [speakerNotes, setSpeakerNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(firmOffer.status)

  const eventOverview = firmOffer.event_overview || {}
  const speakerProgram = firmOffer.speaker_program || {}
  const eventSchedule = firmOffer.event_schedule || {}
  const technicalReqs = firmOffer.technical_requirements || {}
  const travelAccom = firmOffer.travel_accommodation || {}
  const additionalInfo = firmOffer.additional_info || {}
  const financialDetails = firmOffer.financial_details || {}
  const confirmation = firmOffer.confirmation || {}

  // Already responded
  if (status === 'speaker_confirmed' || status === 'speaker_declined' || firmOffer.speaker_confirmed !== null) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            {firmOffer.speaker_confirmed ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">You've Confirmed This Engagement</h1>
                <p className="text-gray-600">
                  Thank you for confirming! The Speak About AI team will be in touch with next steps.
                </p>
                {firmOffer.speaker_notes && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                    <p className="text-sm font-medium text-gray-700">Your notes:</p>
                    <p className="text-sm text-gray-600">{firmOffer.speaker_notes}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">You've Declined This Engagement</h1>
                <p className="text-gray-600">
                  Thank you for your response. We appreciate you letting us know.
                </p>
                {firmOffer.speaker_notes && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                    <p className="text-sm font-medium text-gray-700">Your feedback:</p>
                    <p className="text-sm text-gray-600">{firmOffer.speaker_notes}</p>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    )
  }

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/firm-offers/${firmOffer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'speaker_confirmed',
          speaker_confirmed: true,
          speaker_notes: speakerNotes
        })
      })

      if (!response.ok) throw new Error('Failed to confirm')

      setStatus('speaker_confirmed')
      setShowConfirmDialog(false)
      toast({
        title: "Confirmed!",
        description: "You've confirmed this speaking engagement."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDecline = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/firm-offers/${firmOffer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'speaker_declined',
          speaker_confirmed: false,
          speaker_notes: speakerNotes
        })
      })

      if (!response.ok) throw new Error('Failed to decline')

      setStatus('speaker_declined')
      setShowDeclineDialog(false)
      toast({
        title: "Response Submitted",
        description: "Thank you for your feedback."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'TBD'
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Speaking Engagement Review</h1>
          <p className="text-gray-600 mt-2">
            Please review the details below and confirm your availability
          </p>
          <Badge className="mt-2 bg-blue-100 text-blue-800">
            {firmOffer.proposal_title || eventOverview.event_name || 'Speaking Engagement'}
          </Badge>
        </div>

        {/* Event Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Event Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Event Name</p>
                <p className="font-medium">{eventOverview.event_name || firmOffer.event_title || 'TBD'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Client</p>
                <p className="font-medium">{eventOverview.end_client_name || firmOffer.client_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Event Date</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(eventOverview.event_date || firmOffer.event_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {eventOverview.venue_name || firmOffer.event_location || 'TBD'}
                </p>
              </div>
              {eventOverview.venue_address && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Full Address</p>
                  <p className="font-medium">{eventOverview.venue_address}</p>
                </div>
              )}
              {eventOverview.event_website && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Event Website</p>
                  <a href={eventOverview.event_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {eventOverview.event_website}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Speaker Program */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Program Type</p>
                <p className="font-medium capitalize">{(speakerProgram.program_type || 'keynote').replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Audience Size</p>
                <p className="font-medium flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {speakerProgram.audience_size || 'TBD'} attendees
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Attire</p>
                <p className="font-medium capitalize">{(speakerProgram.speaker_attire || 'business_casual').replace('_', ' ')}</p>
              </div>
            </div>
            {speakerProgram.program_topic && (
              <div>
                <p className="text-sm text-gray-500">Topic/Focus</p>
                <p className="font-medium">{speakerProgram.program_topic}</p>
              </div>
            )}
            {speakerProgram.audience_demographics && (
              <div>
                <p className="text-sm text-gray-500">Audience Demographics</p>
                <p className="font-medium">{speakerProgram.audience_demographics}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Arrival at Venue</p>
                <p className="font-medium">{eventSchedule.speaker_arrival_time || 'TBD'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Program Start</p>
                <p className="font-medium">{eventSchedule.program_start_time || 'TBD'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Program Length</p>
                <p className="font-medium">{eventSchedule.program_length_minutes || 'TBD'} min</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Q&A</p>
                <p className="font-medium">{eventSchedule.qa_length_minutes || 0} min</p>
              </div>
            </div>
            {eventSchedule.timezone && (
              <p className="text-sm text-gray-500">Timezone: {eventSchedule.timezone}</p>
            )}
            {eventSchedule.detailed_timeline && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Full Timeline</p>
                <div className="bg-gray-50 p-3 rounded-lg text-sm whitespace-pre-wrap">
                  {eventSchedule.detailed_timeline}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technical & Recording */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Technical & Recording
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technicalReqs.microphone_type && (
                <div>
                  <p className="text-sm text-gray-500">Microphone</p>
                  <p className="font-medium">{technicalReqs.microphone_type}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {technicalReqs.recording_allowed && (
                  <Badge variant="secondary">
                    <Camera className="h-3 w-3 mr-1" />
                    Recording ({technicalReqs.recording_purpose})
                  </Badge>
                )}
                {technicalReqs.live_stream && (
                  <Badge variant="secondary">Live Stream</Badge>
                )}
                {technicalReqs.photography_allowed && (
                  <Badge variant="secondary">Photography</Badge>
                )}
              </div>
            </div>
            {technicalReqs.tech_rehearsal_date && (
              <div>
                <p className="text-sm text-gray-500">Tech Rehearsal</p>
                <p className="font-medium">{formatDate(technicalReqs.tech_rehearsal_date)} at {technicalReqs.tech_rehearsal_time || 'TBD'}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Travel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Travel & Accommodation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Fly-In Date</p>
                <p className="font-medium">{formatDate(travelAccom.fly_in_date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fly-Out Date</p>
                <p className="font-medium">{formatDate(travelAccom.fly_out_date)}</p>
              </div>
              {travelAccom.nearest_airport && (
                <div>
                  <p className="text-sm text-gray-500">Nearest Airport</p>
                  <p className="font-medium">{travelAccom.nearest_airport}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Airport Transportation</p>
                <p className="font-medium capitalize">{(travelAccom.airport_transportation || 'tbd').replace('_', ' ')}</p>
              </div>
            </div>
            {travelAccom.hotel_required && (
              <div className="flex items-center gap-2">
                <Hotel className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Hotel: {travelAccom.hotel_dates || 'Dates TBD'}</span>
                <Badge variant="secondary" className="capitalize">{travelAccom.hotel_tier || 'TBD'}</Badge>
              </div>
            )}
            {travelAccom.meals_provided?.length > 0 && (
              <div>
                <p className="text-sm text-gray-500">Meals Provided</p>
                <p className="font-medium">{travelAccom.meals_provided.join(', ')}</p>
              </div>
            )}
            {(travelAccom.guest_list_invitation || travelAccom.vip_meet_greet) && (
              <div className="flex gap-2">
                {travelAccom.guest_list_invitation && <Badge>Guest List Invite</Badge>}
                {travelAccom.vip_meet_greet && <Badge>VIP Meet & Greet</Badge>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        {(additionalInfo.green_room_available || additionalInfo.meet_greet_before || additionalInfo.meet_greet_after || additionalInfo.press_media_present || additionalInfo.special_requests) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {additionalInfo.green_room_available && <Badge variant="secondary">Green Room Available</Badge>}
                {additionalInfo.meet_greet_before && <Badge variant="secondary">Meet & Greet Before</Badge>}
                {additionalInfo.meet_greet_after && <Badge variant="secondary">Meet & Greet After</Badge>}
                {additionalInfo.vip_reception && <Badge variant="secondary">VIP Reception</Badge>}
                {additionalInfo.press_media_present && <Badge variant="secondary">Press/Media Present</Badge>}
              </div>
              {additionalInfo.special_requests && (
                <div>
                  <p className="text-sm text-gray-500">Special Requests</p>
                  <p className="font-medium">{additionalInfo.special_requests}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Financial */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-green-50 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Your Fee</span>
                <span className="text-2xl font-bold text-green-700">
                  ${(financialDetails.speaker_fee || firmOffer.total_investment || 0).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Travel Arrangement</p>
                <p className="font-medium capitalize">{(financialDetails.travel_expenses_type || 'TBD').replace('_', ' ')}</p>
              </div>
              {financialDetails.travel_buyout_amount && (
                <div>
                  <p className="text-sm text-gray-500">Travel Buyout</p>
                  <p className="font-medium">${financialDetails.travel_buyout_amount.toLocaleString()}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Payment Terms</p>
                <p className="font-medium">{financialDetails.payment_terms || 'Net 30'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prep Call */}
        {confirmation.prep_call_requested && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Prep Call Requested</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                The client has requested a prep call.
                {confirmation.prep_call_date_preferences && (
                  <span> Preferred timing: {confirmation.prep_call_date_preferences}</span>
                )}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Ready to Confirm?</h2>
              <p className="text-gray-600 mb-6">
                Please review all details above and let us know if you can accept this engagement.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setShowConfirmDialog(true)}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirm Engagement
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowDeclineDialog(true)}
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Decline
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirm Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Speaking Engagement</DialogTitle>
              <DialogDescription>
                You're confirming your availability for this event. Add any notes or special requests below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Notes or Special Requests (Optional)</Label>
                <Textarea
                  value={speakerNotes}
                  onChange={(e) => setSpeakerNotes(e.target.value)}
                  placeholder="Any additional information or requests..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Engagement'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Decline Dialog */}
        <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Decline Engagement</DialogTitle>
              <DialogDescription>
                Please let us know why you're unable to accept this engagement.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Reason for Declining</Label>
                <Textarea
                  value={speakerNotes}
                  onChange={(e) => setSpeakerNotes(e.target.value)}
                  placeholder="Schedule conflict, topic mismatch, etc..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeclineDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleDecline}
                disabled={isSubmitting}
                variant="destructive"
              >
                {isSubmitting ? 'Submitting...' : 'Decline Engagement'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
