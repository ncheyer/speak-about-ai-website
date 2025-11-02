"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Quote, Building2, MapPin, User } from "lucide-react"

interface Speaker {
  name: string
  slug: string
}

interface CaseStudy {
  id: string
  company: string
  logo: string
  location: string
  eventType: string
  image: string
  testimonial: string
  speakers: Speaker[]
  impact: string[]
}

export default function ClientCaseStudies() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const caseStudies: CaseStudy[] = [
    {
      id: "nice",
      company: "NICE",
      logo: "/logos/nice-logo.png",
      location: "Global",
      eventType: "Corporate Conference",
      image: "/case-studies/nice-event.jpg",
      testimonial: "Outstanding AI expertise that resonated with our global audience and delivered actionable insights for our customer experience transformation.",
      speakers: [
        { name: "Adam Cheyer", slug: "adam-cheyer" },
        { name: "Maya Ackerman", slug: "maya-ackerman" }
      ],
      impact: [
        "Engaged 500+ enterprise decision-makers",
        "Practical AI implementation strategies",
        "Enhanced customer experience initiatives"
      ]
    },
    {
      id: "juniper",
      company: "Juniper Networks",
      logo: "/logos/juniper-networks-logo.svg",
      location: "United States",
      eventType: "Tech Leadership Summit",
      image: "/case-studies/juniper-event.jpg",
      testimonial: "World-class AI thought leadership that elevated our networking innovation summit with cutting-edge insights on AI-driven solutions.",
      speakers: [
        { name: "Peter Norvig", slug: "peter-norvig" }
      ],
      impact: [
        "Technology innovation showcase",
        "AI-driven networking solutions",
        "Executive-level strategic insights"
      ]
    },
    {
      id: "st-engineering",
      company: "ST Engineering",
      logo: "/logos/st-engineering-logo.png",
      location: "Singapore",
      eventType: "Engineering Innovation Forum",
      image: "/case-studies/st-engineering-event.jpg",
      testimonial: "Exceptional expertise in AI applications for aerospace, defense, and smart city technologies that inspired our engineering teams.",
      speakers: [
        { name: "Lucien Engelen", slug: "lucien-engelen" }
      ],
      impact: [
        "Cross-sector AI innovation insights",
        "Defense and aerospace applications",
        "Smart city technology roadmap"
      ]
    },
    {
      id: "korea",
      company: "Gyeonggi Province",
      logo: "/logos/korea-government-logo.png",
      location: "South Korea",
      eventType: "Government Technology Forum",
      image: "/case-studies/korea-event.jpg",
      testimonial: "Delivered compelling AI policy insights for public sector digital transformation and innovation initiatives across our region.",
      speakers: [
        { name: "Peter Norvig", slug: "peter-norvig" }
      ],
      impact: [
        "Government AI policy framework",
        "Public sector digital transformation",
        "Regional innovation strategy"
      ]
    },
    {
      id: "hansen",
      company: "Hansen Technologies",
      logo: "/logos/hansen-technologies-logo.png",
      location: "Australia",
      eventType: "Technology Conference",
      image: "/case-studies/hansen-event.jpg",
      testimonial: "Delivered cutting-edge AI insights for utility and telecommunications sectors, driving digital transformation strategies across our global operations.",
      speakers: [
        { name: "Brittany Hodak", slug: "brittany-hodak" }
      ],
      impact: [
        "Enterprise AI strategy development",
        "Utilities and telecom innovation",
        "Digital transformation roadmap"
      ]
    },
    {
      id: "litman-gregory",
      company: "Litman Gregory",
      logo: "/logos/litman-gregory-logo.png",
      location: "United States",
      eventType: "Investment Conference",
      image: "/case-studies/litman-gregory-event.jpg",
      testimonial: "Brought transformative insights on digital disruption and emerging technologies that reshaped our understanding of future market opportunities.",
      speakers: [
        { name: "Jeremiah Owyang", slug: "jeremiah-owyang" }
      ],
      impact: [
        "Strategic investment insights",
        "Digital transformation framework",
        "Emerging technology analysis"
      ]
    }
  ]

  // Preload images
  useEffect(() => {
    const preloadImage = (src: string, id: string) => {
      const img = new Image()
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, id]))
      }
      img.onerror = () => {
        console.warn(`Failed to preload image: ${src}`)
        setLoadedImages((prev) => new Set([...prev, id]))
      }
      img.src = src
    }

    caseStudies.forEach((study) => {
      preloadImage(study.image, study.id)
      preloadImage(study.logo, `${study.id}-logo`)
    })
  }, [])

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Very subtle dot pattern background */}
      <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: "radial-gradient(circle, #1E68C6 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-[#1E68C6] bg-opacity-10 text-[#1E68C6] rounded-full text-sm font-medium mb-6 font-montserrat">
            <Building2 className="w-4 h-4 mr-2" />
            Client Success Stories
          </div>
          <h2 className="text-4xl font-bold text-black mb-4 font-neue-haas">Trusted by Industry Leaders Worldwide</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
            From Fortune 500 companies to international conferences and government agencies—see how our AI speakers deliver transformative insights at the world's most important events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {caseStudies.map((study) => (
            <div
              key={study.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image Section */}
              <div className="relative w-full aspect-[16/9] bg-gray-200">
                {!loadedImages.has(study.id) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                )}
                <img
                  src={study.image || "/placeholder.svg"}
                  alt={`${study.company} event`}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    loadedImages.has(study.id) ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                />
                {/* Company Logo Overlay */}
                <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                  <img
                    src={study.logo || "/placeholder.svg"}
                    alt={`${study.company} logo`}
                    className="h-8 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 font-neue-haas">{study.company}</h3>
                  <div className="flex items-center text-gray-600 text-sm font-montserrat">
                    <MapPin className="w-4 h-4 mr-1" />
                    {study.location}
                  </div>
                </div>

                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-[#1E68C6] rounded-full text-sm font-semibold font-montserrat">
                    {study.eventType}
                  </span>
                </div>

                {/* Featured Speakers */}
                {study.speakers && study.speakers.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="text-sm font-bold text-gray-900 font-neue-haas mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2 text-[#1E68C6]" />
                      Featured Speaker{study.speakers.length > 1 ? 's' : ''}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {study.speakers.map((speaker, idx) => (
                        <Link
                          key={idx}
                          href={`/speakers/${speaker.slug}`}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#1E68C6] to-blue-600 text-white rounded-lg text-sm font-semibold font-montserrat hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          {speaker.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Testimonial */}
                <div className="mb-6 relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[#1E68C6] opacity-20" />
                  <p className="text-gray-700 font-montserrat leading-relaxed pl-6 italic">
                    "{study.testimonial}"
                  </p>
                </div>

                {/* Impact Points */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-gray-900 font-neue-haas mb-3">Key Impact:</h4>
                  {study.impact.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#1E68C6] mt-2"></span>
                      <span className="text-sm text-gray-600 font-montserrat leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            asChild
            variant="gold"
            size="lg"
            className="font-montserrat font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <Link href="/partners">View All Client Success Stories</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
