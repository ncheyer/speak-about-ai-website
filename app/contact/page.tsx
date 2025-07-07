import type { Metadata } from "next"
import { Suspense } from "react"
import ContactForm from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contact AI Speaker Bureau | Speak About AI", // 43 chars
  description:
    "Contact Speak About AI to book top AI keynote speakers. Get personalized recommendations and check availability for your event. Reach out today.",
  keywords: "contact AI speakers, book AI keynote speakers, AI speaker availability, AI speaker bureau contact",
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <ContactForm />
      </Suspense>
    </div>
  )
}
