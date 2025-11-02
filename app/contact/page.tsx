import type { Metadata } from "next"
import { ContactFormWrapper } from "@/components/contact-form-wrapper"

export const metadata: Metadata = {
  title: "Book AI Keynote Speakers - Contact Our Bureau | Speak About AI",
  description:
    "Book top AI keynote speakers for your event. Get personalized speaker recommendations, check availability, and receive custom proposals. Contact us today.",
  keywords: "book AI keynote speakers, contact AI speakers, AI speaker availability, AI speaker bureau contact, book AI speaker",
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
