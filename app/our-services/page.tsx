import type { Metadata } from "next"
import ServicesHero from "@/components/services-hero"
import ServiceOfferings from "@/components/service-offerings"
import ServiceProcess from "@/components/service-process"
import EventsSection from "@/components/events-section"
import FAQSection from "@/components/faq-section"
import ServicesContact from "@/components/services-contact"

export const metadata: Metadata = {
  title: "Our Services | AI Speaker Bureau Services | Speak About AI",
  description:
    "Comprehensive AI speaker services including keynotes, panels, fireside chats, workshops, and our flagship SprintAI innovation accelerator. Connect with world-class AI experts.",
  keywords:
    "AI speaker services, AI keynote speakers, AI panel discussions, AI fireside chats, SprintAI workshop, artificial intelligence speaking bureau",
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
