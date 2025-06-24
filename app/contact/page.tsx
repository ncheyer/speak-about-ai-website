import type { Metadata } from "next"
import { Suspense } from "react"
import ContactForm from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contact Us | Speak About AI", // Updated: 28 chars
  description:
    "Contact Speak About AI to book top AI keynote speakers. Get personalized recommendations and check availability for your event. Reach out today.", // 140 chars
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
