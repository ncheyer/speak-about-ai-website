import type { Metadata } from "next"
import ContactForm from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contact Us | Book AI Keynote Speakers | Speak About AI",
  description:
    "Contact Speak About AI to book top artificial intelligence keynote speakers for your event. Get personalized speaker recommendations and check availability.",
  keywords: "contact AI speakers, book AI keynote speakers, AI speaker availability, AI speaker bureau contact",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <ContactForm />
    </div>
  )
}
