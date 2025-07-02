import { getLandingPageBySlug } from "@/lib/contentful-landing-page"
import type { Metadata } from "next"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ServerCrash } from "lucide-react"

// Components for the page
import HeroSection from "@/components/event-planning-checklist/hero-section"
import HowItWorksSection from "@/components/event-planning-checklist/how-it-works-section"
import BenefitsSection from "@/components/event-planning-checklist/benefits-section"
import FaqSection from "@/components/event-planning-checklist/faq-section"
import SeoContentSection from "@/components/event-planning-checklist/seo-content-section"

// This function generates metadata dynamically based on the fetched content.
export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getLandingPageBySlug("event-planning-checklist")

  if (!pageData) {
    return {
      title: "Event Planning Checklist Not Found",
      description: "The requested page could not be loaded from Contentful.",
    }
  }

  return {
    title: pageData.pageTitle,
    description: pageData.metaDescription,
    alternates: {
      canonical: `/event-planning-checklist`,
    },
  }
}

// The main page component
export default async function EventPlanningChecklistPage() {
  const pageData = await getLandingPageBySlug("event-planning-checklist")

  // If no data is returned, display a user-friendly error message.
  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <ServerCrash className="h-4 w-4" />
          <AlertTitle>Failed to Load Page Content</AlertTitle>
          <AlertDescription>
            We could not retrieve the content for the "event-planning-checklist" page from our CMS. Please check the
            troubleshooting steps on the{" "}
            <a href="/landing-page" className="font-semibold underline hover:text-red-800">
              Landing Page Directory
            </a>
            .
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="bg-white text-gray-800">
      {/* JSON-LD Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageData.schemaMarkup) }} />

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
