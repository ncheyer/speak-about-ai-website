import { getLandingPageBySlug } from "@/lib/contentful-landing-page"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

// Components for the page
import HeroSection from "@/components/event-planning-checklist/hero-section"
import HowItWorksSection from "@/components/event-planning-checklist/how-it-works-section"
import BenefitsSection from "@/components/event-planning-checklist/benefits-section"
import FaqSection from "@/components/event-planning-checklist/faq-section"
import SeoContentSection from "@/components/event-planning-checklist/seo-content-section"
import TrackingScripts from "@/components/tracking-scripts"

const PAGE_SLUG = "event-planning-checklist"

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getLandingPageBySlug(PAGE_SLUG)
  if (!pageData) return { title: "Page Not Found" }

  return {
    title: pageData.pageTitle,
    description: pageData.metaDescription,
    alternates: { canonical: `/${PAGE_SLUG}` },
  }
}

export default async function EventPlanningChecklistPage() {
  const pageData = await getLandingPageBySlug(PAGE_SLUG)

  if (!pageData) {
    notFound()
  }

  return (
    <>
      {/* Render tracking scripts first */}
      <TrackingScripts trackingCodes={pageData.trackingCodes} />

      {/* Render JSON-LD Schema if it exists */}
      {pageData.schemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageData.schemaMarkup) }}
        />
      )}

      <main className="bg-white text-gray-800">
        <HeroSection data={pageData} />
        <HowItWorksSection steps={pageData.howItWorksSteps} />
        <BenefitsSection content={pageData.benefitsSection} />
        <FaqSection items={pageData.faqSection} />
        <SeoContentSection content={pageData.seoContent} />
      </main>
    </>
  )
}
