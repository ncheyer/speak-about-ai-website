"use client"

import { useState } from "react"
import { FirmOfferForm } from "@/components/firm-offer-form"
import type { FirmOffer } from "@/lib/firm-offer-types"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"
import { CheckCircle, Clock } from "lucide-react"

interface Props {
  token: string
  proposal: any
  firmOffer: any
  speakerName: string
  speakerFee: number
}

export function FirmOfferClientPage({ token, proposal, firmOffer, speakerName, speakerFee }: Props) {
  const { toast } = useToast()
  const [currentOffer, setCurrentOffer] = useState(firmOffer)

  // If already submitted, show status
  if (currentOffer?.status === 'submitted' || currentOffer?.status === 'sent_to_speaker' || currentOffer?.status === 'speaker_confirmed') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            {currentOffer.status === 'speaker_confirmed' ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Speaker Confirmed!</h1>
                <p className="text-gray-600">
                  Great news! {speakerName} has confirmed your event. Our team will be in touch shortly with next steps.
                </p>
              </>
            ) : currentOffer.status === 'sent_to_speaker' ? (
              <>
                <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Awaiting Speaker Confirmation</h1>
                <p className="text-gray-600">
                  Your firm offer has been sent to {speakerName} for review. We'll notify you once they respond.
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Firm Offer Submitted</h1>
                <p className="text-gray-600">
                  Thank you! Your firm offer is being reviewed by our team. We'll forward it to {speakerName} shortly.
                </p>
              </>
            )}
          </Card>
        </div>
      </div>
    )
  }

  const handleSave = async (data: Partial<FirmOffer>) => {
    try {
      if (currentOffer?.id) {
        // Update existing
        const response = await fetch(`/api/firm-offers/${currentOffer.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to save')
        const updated = await response.json()
        setCurrentOffer(updated)
      } else {
        // Create new
        const response = await fetch('/api/firm-offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            proposal_id: proposal.id
          })
        })
        if (!response.ok) throw new Error('Failed to create')
        const created = await response.json()
        setCurrentOffer(created)
      }
    } catch (error) {
      console.error('Error saving firm offer:', error)
      throw error
    }
  }

  const handleSubmit = async (data: Partial<FirmOffer>) => {
    try {
      // First save the data
      await handleSave(data)

      // Then update status to submitted
      const response = await fetch(`/api/firm-offers/${currentOffer?.id || 'new'}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'submitted' })
      })

      if (!response.ok) throw new Error('Failed to submit')

      const updated = await response.json()
      setCurrentOffer(updated)

      toast({
        title: "Submitted!",
        description: "Your firm offer has been submitted for review."
      })
    } catch (error) {
      console.error('Error submitting firm offer:', error)
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <FirmOfferForm
        proposalId={proposal.id}
        proposalTitle={proposal.title || proposal.event_title || 'Speaking Engagement'}
        speakerName={speakerName}
        speakerFee={speakerFee}
        eventDate={proposal.event_date}
        initialData={currentOffer || undefined}
        onSave={handleSave}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
