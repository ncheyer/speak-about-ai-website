import type { Metadata } from "next"
import { Suspense } from "react"
import HighConvertingContactForm from "@/components/high-converting-contact-form"

export const metadata: Metadata = {
  title: "Book AI Keynote Speaker | Speak About AI",
  description:
    "Get your perfect AI speaker in 4 hours. Free matching service. Tell us about your event and we'll connect you with top AI experts.",
  keywords: "book AI speaker, AI keynote speaker, contact AI speaker bureau, AI event speakers, hire AI expert",
  alternates: {
    canonical: "/contact-2",
  },
  robots: {
    // Added to prevent indexing of this test page by default
    index: false,
    follow: false,
  },
}

export default function ContactPage2() {
  // Renamed function for clarity
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      {" "}
      {/* Added a simple fallback */}
      <HighConvertingContactForm />
    </Suspense>
  )
}
