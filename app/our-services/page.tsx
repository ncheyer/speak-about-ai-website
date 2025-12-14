import type { Metadata } from "next"
import ServicesHero from "@/components/services-hero"
import ServiceOfferings from "@/components/service-offerings"
import ClientCaseStudies from "@/components/client-case-studies"
import ServiceProcess from "@/components/service-process"
import EventsSection from "@/components/events-section"
import FAQSection from "@/components/faq-section"
import ServicesContact from "@/components/services-contact"

export const metadata: Metadata = {
  title: "AI Speaker Services & Event Solutions | Speak About AI",
  description:
    "Discover AI speaker services from Speak About AI: keynotes, panels, workshops, fireside chats, and custom presentations. Connect with world-class AI experts for your event.",
  keywords:
    "AI speaker services, AI keynote speakers, AI panel discussions, AI fireside chats, AI workshops, artificial intelligence speaking bureau, virtual AI presentations",
  alternates: {
    canonical: "https://speakabout.ai/our-services",
  },
}

export default function OurServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <ServicesHero />
      <ServiceOfferings />
      <ClientCaseStudies />
      <ServiceProcess />
      <EventsSection />
      <FAQSection />
      <ServicesContact />
    </div>
  )
}
