import type { Metadata } from "next"
import Link from "next/link"
import Hero from "@/components/hero"
import ClientLogos from "@/components/client-logos"
import FeaturedSpeakers from "@/components/featured-speakers"
import WhyChooseUs from "@/components/why-choose-us"
import NavigateTheNoise from "@/components/navigate-the-noise"
import FounderNextGen from "@/components/founder-next-gen"
import BookingCTA from "@/components/booking-cta"
import { Button } from "@/components/ui/button"
import { getFeaturedSpeakers, type Speaker } from "@/lib/speakers-data"

export const metadata: Metadata = {
  title: "AI Keynote Speakers | Book Artificial Intelligence Speakers for Events",
  description:
    "Book an AI keynote speaker from the #1 AI-exclusive bureau. 70+ artificial intelligence keynote speakers including Siri founders, OpenAI staff & Stanford AI experts.",
  keywords:
    "AI keynote speaker, AI keynote speakers, artificial intelligence keynote speaker, artificial intelligence keynote speakers, ai expert speaker, book AI speaker, AI speaker bureau, AI conference speakers, machine learning speakers, generative AI speakers",
  openGraph: {
    title: "AI Keynote Speaker | Book Artificial Intelligence Speakers",
    description:
      "Book an AI keynote speaker from the #1 AI-exclusive bureau. 70+ artificial intelligence keynote speakers for conferences, corporate events & summits.",
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
    title: "AI Keynote Speaker | Book Artificial Intelligence Speakers",
    description:
      "Book an AI keynote speaker from the #1 AI-exclusive bureau. 70+ artificial intelligence keynote speakers for your event.",
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
    telephone: "+1-510-435-3947",
    contactType: "sales",
    email: "hello@speakabout.ai",
    availableLanguage: ["en"],
    areaServed: "Worldwide",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does it cost to book an AI keynote speaker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI keynote speaker fees typically range from $5K-$20K for emerging experts to $20K+ for industry leaders. Final pricing depends on format, location, date, and speaker requirements."
      }
    },
    {
      "@type": "Question", 
      name: "What topics do AI speakers cover?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our AI speakers cover artificial intelligence strategy, machine learning, generative AI, ChatGPT, AI ethics, AI in healthcare, automation, and industry-specific AI applications."
      }
    },
    {
      "@type": "Question",
      name: "Do you provide virtual AI keynote speakers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer both in-person and virtual AI keynote speakers for online events, webinars, and hybrid conferences worldwide."
      }
    }
  ]
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
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AI Speaker Categories",
    itemListElement: [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI Strategy Speakers" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Machine Learning Experts" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI Ethics Speakers" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Generative AI Speakers" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI Healthcare Speakers" }},
    ]
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "127",
    bestRating: "5"
  }
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <main className="min-h-screen">
        <Hero />
        <ClientLogos />
        <FeaturedSpeakers initialSpeakers={featuredSpeakers} />
        <WhyChooseUs />
        <NavigateTheNoise />

        {/* SEO Content Section - Essential for Rankings */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-black mb-6">
                AI Keynote Speakers: Transform Your Event with Leading AI Experts
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Speak About AI is the premier <strong>AI keynote speakers bureau</strong>, representing over 70 of the
                world's most influential <strong>artificial intelligence speakers</strong>. Our roster includes
                pioneering AI researchers, Silicon Valley executives, Siri co-founders, Stanford AI professors,
                and Fortune 500 AI leaders who deliver engaging keynotes on artificial intelligence, machine learning, and generative AI.
              </p>
              
              <h3 className="text-2xl font-semibold text-black mt-8 mb-4">
                Why Choose Our AI Speakers Bureau?
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                As a speaker bureau focused exclusively on artificial intelligence, we provide
                unparalleled expertise in matching your event with the perfect <strong>AI keynote speaker</strong>. Whether
                you need a generative AI expert, machine learning pioneer, or AI ethics thought leader,
                our curated selection of <a href="/speakers" className="text-[#1E68C6] hover:underline font-semibold">AI speakers</a> delivers transformative insights that resonate with
                your audience. Browse our <a href="/speakers" className="text-[#1E68C6] hover:underline font-semibold">full roster of AI experts</a>.
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

              <div className="flex justify-center my-8">
                <Button
                  asChild
                  variant="gold"
                  size="lg"
                  className="font-montserrat font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Link href="/contact?source=book_ai_speaker_seo_section">
                    Book an AI Speaker Today
                  </Link>
                </Button>
              </div>

              <p className="text-lg text-gray-700 mb-4">
                Our clients include provincial governments, international conferences, Fortune 500 companies, leading universities,
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
                <p className="text-gray-700 mb-3">
                  AI speaker fees typically range from <strong>$5K-$20K</strong> for emerging experts to <strong>$20K+</strong> for industry leaders. Final pricing depends on format, location, date, and speaker requirements. Contact us for a precise quote tailored to your event.
                </p>
              </div>
            </div>
          </div>
        </section>

        <FounderNextGen />
        <BookingCTA />
      </main>
    </>
  )
}
