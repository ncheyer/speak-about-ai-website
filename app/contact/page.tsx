import type { Metadata } from "next"
import { ContactFormWrapper } from "@/components/contact-form-wrapper"

export const metadata: Metadata = {
  title: "Contact AI Speaker Bureau | Speak About AI", // 43 chars
  description:
    "Contact Speak About AI to book top AI keynote speakers. Get personalized recommendations and check availability for your event. Reach out today.",
  keywords: "contact AI speakers, book AI keynote speakers, AI speaker availability, AI speaker bureau contact",
  alternates: {
    canonical: "https://speakabout.ai/contact",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <ContactFormWrapper />
      </div>
    </div>
  )
}
