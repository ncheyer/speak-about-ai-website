"use client"

import { useSearchParams } from "next/navigation"
import { CustomContactForm } from "./custom-contact-form"
import { Suspense } from "react"

function ContactFormContent() {
  const searchParams = useSearchParams()
  const speakerName = searchParams.get("speakerName")
  const workshopId = searchParams.get("workshop")

  // Determine initial tab based on URL parameters
  const initialTab = workshopId ? "workshop" : "keynote"

  return (
    <CustomContactForm
      preselectedSpeaker={speakerName || undefined}
      preselectedWorkshopId={workshopId || undefined}
      initialTab={initialTab}
    />
  )
}

export function ContactFormWrapper() {
  return (
    <Suspense fallback={
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading contact form...</p>
      </div>
    }>
      <ContactFormContent />
    </Suspense>
  )
}