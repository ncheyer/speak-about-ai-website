import type { Metadata } from "next"
import Hero from "@/components/hero"
import ClientLogos from "@/components/client-logos"
import FeaturedSpeakers from "@/components/featured-speakers"
import WhyChooseUs from "@/components/why-choose-us"
import BookingCTA from "@/components/booking-cta"
import { getFeaturedSpeakers, type Speaker } from "@/lib/speakers-data"

export const metadata: Metadata = {
  title: "AI Keynote Speakers | Book Top AI Speakers for 2025 | Speak About AI",
  description:
    "Book world-class AI keynote speakers for your 2025 event. The only AI-exclusive speaker bureau trusted by Fortune 500s. 50+ experts including Siri founders.",
  keywords:
    "AI keynote speakers, book AI speakers, artificial intelligence speakers, AI conference speakers, machine learning speakers, tech keynote speakers, AI speaker bureau, book an AI speaker, keynote speaker on AI, generative AI speakers",
  openGraph: {
    title: "AI Keynote Speakers | Book Top AI Speakers for 2025",
    description:
      "Book world-class AI keynote speakers with Speak About AI, the AI-exclusive bureau trusted by Fortune 500s. 50+ experts for your next event.",
    type: "website",
    url: "https://speakabout.ai",
    images: [
      {
        url: "/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "Speak About AI - Top AI Keynote Speakers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Keynote Speakers | Book Top AI Speakers for 2025",
    description:
      "Book world-class AI keynote speakers. The only AI-exclusive speaker bureau trusted by Fortune 500s.",
    images: ["/hero-image.jpg"],
  },
  alternates: {
    canonical: "https://speakabout.ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// Schema.org structured data for organization and service
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Speak About AI",
  url: "https://speakabout.ai",
  logo: "https://speakabout.ai/logo.png",
  description:
    "The world's only AI-exclusive speaker bureau, connecting organizations with top artificial intelligence keynote speakers.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Silicon Valley",
    addressRegion: "CA",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.linkedin.com/company/speak-about-ai",
    "https://twitter.com/speakaboutai",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-XXX-XXX-XXXX",
    contactType: "sales",
    availableLanguage: ["en"],
  },
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "AI Keynote Speaker Booking",
  provider: {
    "@type": "Organization",
    name: "Speak About AI",
  },
  description:
    "Professional booking service for AI keynote speakers, artificial intelligence experts, and technology thought leaders for corporate events, conferences, and seminars.",
  areaServed: {
    "@type": "Country",
    name: "Worldwide",
  },
}

export default async function HomePage() {
  let featuredSpeakers: Speaker[] = []
  try {
    featuredSpeakers = await getFeaturedSpeakers(6)
    if (featuredSpeakers.length === 0) {
      console.warn(
        "HomePage: getFeaturedSpeakers returned an empty array. This might be due to a fetch error or no featured speakers.",
      )
    }
  } catch (error) {
    console.error("HomePage: Failed to load featured speakers:", error)
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <main className="min-h-screen">
        <Hero />
        <ClientLogos />
        <FeaturedSpeakers initialSpeakers={featuredSpeakers} />
        <WhyChooseUs />
        
        {/* SEO Content Section - Essential for Rankings */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-black mb-6">
                Book the World's Leading AI Keynote Speakers for Your 2025 Event
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Speak About AI is the premier AI-exclusive speaker bureau, representing over 50 of the
                world's most influential artificial intelligence keynote speakers. Our roster includes
                pioneering AI researchers, Silicon Valley executives, Siri co-founders, Stanford professors,
                and Fortune 500 AI leaders who are shaping the future of artificial intelligence.
              </p>
              
              <h3 className="text-2xl font-semibold text-black mt-8 mb-4">
                Why Choose Our AI Speakers Bureau?
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                As the only speaker bureau focused exclusively on artificial intelligence, we provide
                unparalleled expertise in matching your event with the perfect AI keynote speaker. Whether
                you need a generative AI expert, machine learning pioneer, or AI ethics thought leader,
                our curated selection of speakers delivers transformative insights that resonate with
                your audience.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    Industries We Serve
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Technology & Software Companies</li>
                    <li>• Healthcare & Pharmaceutical</li>
                    <li>• Financial Services & Banking</li>
                    <li>• Manufacturing & Automotive</li>
                    <li>• Retail & E-commerce</li>
                    <li>• Education & Research Institutions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    Popular AI Speaking Topics
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Generative AI & Large Language Models</li>
                    <li>• AI Strategy & Digital Transformation</li>
                    <li>• Machine Learning Applications</li>
                    <li>• AI Ethics & Responsible AI</li>
                    <li>• Future of Work with AI</li>
                    <li>• AI in Healthcare & Life Sciences</li>
                  </ul>
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold text-black mt-8 mb-4">
                Book an AI Speaker for Your Next Event
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                From keynote presentations at major conferences to executive briefings and workshop
                facilitation, our AI speakers bring cutting-edge insights and practical applications
                to every engagement. Each speaker is carefully vetted for their expertise, presentation
                skills, and ability to translate complex AI concepts into actionable business strategies.
              </p>
              
              <p className="text-lg text-gray-700 mb-4">
                Our clients include Microsoft, Google, Amazon, Fortune 500 companies, leading universities,
                and innovative startups. When you book an AI keynote speaker through Speak About AI,
                you're partnering with the trusted leader in AI thought leadership.
              </p>
            </div>
          </div>
        </section>
        
        {/* FAQ Section for SEO */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-black mb-12">
              Frequently Asked Questions About Booking AI Speakers
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-black mb-3">
                  How do I book an AI keynote speaker?
                </h3>
                <p className="text-gray-700">
                  Simply browse our speakers, select your preferred AI expert, and contact us through
                  our booking form. Our team will handle all logistics and ensure a seamless experience.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-3">
                  What makes Speak About AI different?
                </h3>
                <p className="text-gray-700">
                  We're the only speaker bureau focused exclusively on AI, giving us unmatched expertise
                  in artificial intelligence thought leadership and deep relationships with top AI speakers.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-3">
                  Do you offer virtual AI keynote speakers?
                </h3>
                <p className="text-gray-700">
                  Yes, many of our AI speakers offer both in-person and virtual keynote presentations,
                  ensuring global accessibility for your events.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-3">
                  What's the typical fee for an AI speaker?
                </h3>
                <p className="text-gray-700">
                  Speaker fees vary based on expertise, event type, and location. Contact us for a
                  customized quote based on your specific requirements and budget.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <BookingCTA />
      </main>
    </>
  )
}
