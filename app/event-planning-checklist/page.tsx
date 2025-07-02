import { getLandingPageBySlug } from "@/lib/contentful-landing-page"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

// Components for the page
import HeroSection from "@/components/event-planning-checklist/hero-section"
import HowItWorksSection from "@/components/event-planning-checklist/how-it-works-section"
import BenefitsSection from "@/components/event-planning-checklist/benefits-section"
import FaqSection from "@/components/event-planning-checklist/faq-section"
import SeoContentSection from "@/components/event-planning-checklist/seo-content-section"

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getLandingPageBySlug("event-planning-checklist")
  if (!pageData) return { title: "Page Not Found" }
  return {
    title: pageData.pageTitle,
    description: pageData.metaDescription,
    alternates: { canonical: `/event-planning-checklist` },
  }
}

export default async function EventPlanningChecklistPage() {
  const pageData = await getLandingPageBySlug("event-planning-checklist")

  if (!pageData) {
    notFound()
  }

  return (
    <div className="bg-white text-gray-800">
      {pageData.schemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageData.schemaMarkup) }}
        />
      )}
      <main>
        <HeroSection data={pageData} />
        <HowItWorksSection steps={pageData.howItWorksSteps} />
        <BenefitsSection content={pageData.benefitsSection} />
        <FaqSection items={pageData.faqSection} />
        <SeoContentSection content={pageData.seoContent} />
      </main>
    </div>
  )
}
