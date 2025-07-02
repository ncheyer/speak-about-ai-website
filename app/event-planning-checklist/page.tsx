import { getChecklistLandingPage } from "@/lib/contentful-checklist-page"
import type { Metadata } from "next"
import { HeroSection } from "@/components/event-planning-checklist/hero-section"
import { HowItWorksSection } from "@/components/event-planning-checklist/how-it-works-section"
import { BenefitsSection } from "@/components/event-planning-checklist/benefits-section"
import { FaqSection } from "@/components/event-planning-checklist/faq-section"
import { SeoContentSection } from "@/components/event-planning-checklist/seo-content-section"

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getChecklistLandingPage()

  if (!pageData) {
    return {
      title: "Event Planning Checklist Generator",
      description: "Generate a custom checklist for your event.",
    }
  }

  return {
    title: pageData.pageTitle,
    description: pageData.metaDescription,
  }
}

export default async function EventPlanningChecklistPage() {
  const pageData = await getChecklistLandingPage()

  if (!pageData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Page Not Found</h1>
          <p className="mt-2 text-gray-600">The requested content could not be loaded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageData.schemaMarkup) }} />

      <main>
        <HeroSection
          headline={pageData.heroHeadline}
          subheadline={pageData.heroSubheadline}
          bulletPoints={pageData.heroBulletPoints}
          image={pageData.heroImage}
          formFields={pageData.formFields}
          formSettings={pageData.formSettings}
        />
        <HowItWorksSection steps={pageData.howItWorksSteps} />
        <BenefitsSection content={pageData.benefitsSection} />
        <FaqSection items={pageData.faqSection} />
        <SeoContentSection content={pageData.seoContent} />
      </main>
    </div>
  )
}
