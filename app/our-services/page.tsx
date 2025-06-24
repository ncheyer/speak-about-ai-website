import type { Metadata } from "next"
import ServicesHero from "@/components/services-hero"
import ServiceOfferings from "@/components/service-offerings"
import ServiceProcess from "@/components/service-process"
import EventsSection from "@/components/events-section"
import FAQSection from "@/components/faq-section"
import ServicesContact from "@/components/services-contact"

export const metadata: Metadata = {
  title: "AI Speaker Services | Speak About AI", // Updated: 36 chars
  description:
    "Discover AI speaker services from Speak About AI: keynotes, panels, workshops & SprintAI. Connect with world-class AI experts for your event.", // 146 chars
  keywords:
    "AI speaker services, AI keynote speakers, AI panel discussions, AI fireside chats, SprintAI workshop, artificial intelligence speaking bureau",
  alternates: {
    canonical: "/our-services",
  },
}

export default function OurServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <ServicesHero />
      <ServiceOfferings />
      <ServiceProcess />
      <EventsSection />
      <FAQSection />
      <ServicesContact />
    </div>
  )
}
