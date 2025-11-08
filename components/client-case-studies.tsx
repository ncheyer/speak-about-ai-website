"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Quote, Building2, MapPin, User, CalendarCheck } from "lucide-react"

interface Speaker {
  name: string
  slug: string
  title: string
  headshot: string
}

interface CaseStudy {
  id: string
  company: string
  logo: string
  location: string
  eventType: string
  image: string
  imageAlt: string
  speakerContribution: string
  testimonial: string
  testimonialAuthor?: string
  testimonialTitle?: string
  speakers: Speaker[]
  impact: string[]
}

export default function ClientCaseStudies() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const caseStudies: CaseStudy[] = [
    {
      id: "st-engineering",
      company: "ST Engineering",
      logo: "/logos/st-engineering-logo.png",
      location: "Singapore",
      eventType: "Engineering Innovation Forum",
      image: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/20240903-STE-InnoTech-A-175.jpg",
      imageAlt: "ST Engineering AI Innovation Forum in Singapore - AI keynote speaker Lucien Engelen presenting artificial intelligence insights to engineering professionals on aerospace defense and smart city technologies",
      speakerContribution: "Lucien delivered a transformative keynote on AI applications in healthcare and how those innovations translate to aerospace, defense, and smart city engineering. He provided practical frameworks for cross-sector AI implementation that inspired new approaches to complex engineering challenges.",
      testimonial: "Exceptional expertise in AI applications for aerospace, defense, and smart city technologies that inspired our engineering teams.",
      speakers: [
        {
          name: "Lucien Engelen",
          slug: "lucien-engelen",
          title: "TransformHealth CEO and Healthcare Visionary",
          headshot: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/lucien-engelen-headshot-1749733448794.jpg"
        }
      ],
      impact: [
        "Cross-sector AI innovation insights",
        "Defense and aerospace applications",
        "Smart city technology roadmap"
      ]
    },
    {
      id: "hansen",
      company: "Hansen Technologies",
      logo: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/Hansen-Technologies.-Powering-the-Next-Age-of-Digital-Experience-.jpg",
      location: "Columbia, South Carolina",
      eventType: "Customer Conference",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=675&fit=crop",
      imageAlt: "Hansen Technologies Customer Conference Columbia South Carolina - Brittany Hodak keynote speaker presenting AI strategies for utilities and telecommunications digital transformation",
      speakerContribution: "Brittany delivered an engaging keynote on leveraging AI for enhanced customer experiences in utilities and telecommunications. She shared actionable strategies for digital transformation that resonated with Hansen's enterprise clients and sparked meaningful conversations about AI adoption.",
      testimonial: "Though this was our first time working with them and they were a random find; I thought the whole interaction from first meeting to speaker execution were fantastic. I would definitely go through Speak About AI again on speaker needs in the technology field.",
      testimonialAuthor: "Fengning Yu",
      testimonialTitle: "Marketing Manager",
      speakers: [
        {
          name: "Brittany Hodak",
          slug: "brittany-hodak",
          title: "Speaker & Author",
          headshot: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/brittany-hodak-headshot-1752742665518.jpg"
        }
      ],
      impact: [
        "Enterprise AI strategy development",
        "Utilities and telecom innovation",
        "Digital transformation roadmap"
      ]
    },
    {
      id: "rio-innovation-week",
      company: "Rio Innovation Week",
      logo: "/logos/rio-innovation-week-new.png",
      location: "São Paulo, Brazil",
      eventType: "Innovation & Technology Conference",
      image: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/14082024_AL_Peter Norvig_3841 (1).JPG",
      imageAlt: "Rio Innovation Week São Paulo Brazil - Peter Norvig AI keynote speaker presenting artificial intelligence and innovation insights at Latin America's premier technology conference",
      speakerContribution: "Peter delivered a captivating keynote on the evolution of AI and its impact on Latin American innovation and entrepreneurship. He shared insights from Google's AI research and provided actionable guidance for startups and enterprises navigating the AI revolution.",
      testimonial: "Delivered transformative AI insights that inspired innovation leaders across Latin America's largest technology and entrepreneurship event.",
      speakers: [
        {
          name: "Peter Norvig",
          slug: "peter-norvig",
          title: "Former Director of Research at Google, AI Pioneer",
          headshot: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/peter-norvig-headshot-1749608907310.jpg"
        }
      ],
      impact: [
        "Latin American innovation ecosystem insights",
        "AI-driven entrepreneurship strategies",
        "Regional technology transformation"
      ]
    },
    {
      id: "nice",
      company: "NICE",
      logo: "/logos/nice-logo.png",
      location: "Virtual",
      eventType: "Global Training Webinar",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200&h=675&fit=crop",
      imageAlt: "NICE Global Training Webinar - Adam Cheyer and Maya Ackerman presenting customer experience AI transformation to enterprise decision-makers in virtual training session",
      speakerContribution: "Adam and Maya delivered separate virtual keynotes on AI's role in customer experience transformation, reaching over 1,000 NICE employees globally. Adam shared insights from building Siri and AI applications at scale, while Maya provided practical frameworks for implementing AI in enterprise customer service workflows.",
      testimonial: "We had a better turnout that we expected – ~1000 employees from all around the globe jumped on each virtual talk and held a lively chat. The content and presentation exceeded our expectations as well.",
      testimonialAuthor: "Lee B.",
      testimonialTitle: "Global Learning Manager",
      speakers: [
        {
          name: "Adam Cheyer",
          slug: "adam-cheyer",
          title: "VP of AI Experience at Airbnb, Co-Founder of Siri",
          headshot: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/adam-cheyer-headshot-1749607372221.jpg"
        },
        {
          name: "Maya Ackerman",
          slug: "maya-ackerman",
          title: "CEO/Co-founder of WaveAI, Santa Clara University Professor",
          headshot: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/Maya-Ackerman-Headshot-1749732144887.jpg"
        }
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
      location: "Virtual",
      eventType: "Marketing Webinar",
      image: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/1707414885816.jpeg",
      imageAlt: "Juniper Networks AI Marketing Webinar - Peter Norvig presenting AI insights to drive client acquisition among developers and educate existing clients on artificial intelligence",
      speakerContribution: "Peter presented a developer-focused webinar on AI fundamentals and practical applications in networking technology. His expertise from Google's AI research helped Juniper educate both prospects and existing clients on AI-driven networking solutions, resulting in strong developer engagement and lead generation.",
      testimonial: "The event was great!! We had incredible interest and saw strong numbers. The process was smooth and your communication was fantastic. Truly, I don't know if there's anything I could think of to improve.",
      testimonialAuthor: "Rachel F.",
      testimonialTitle: "Marketing Campaign Manager",
      speakers: [
        {
          name: "Peter Norvig",
          slug: "peter-norvig",
          title: "Former Director of Research at Google, AI Pioneer",
          headshot: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/peter-norvig-headshot-1749608907310.jpg"
        }
      ],
      impact: [
        "Client acquisition among developers",
        "Education on AI-driven networking solutions",
        "Enhanced developer and client engagement"
      ]
    },
    {
      id: "litman-gregory",
      company: "Litman Gregory",
      logo: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/litman_gregory_logo.jpeg",
      location: "United States",
      eventType: "Annual Client Education Event",
      image: "https://images.unsplash.com/photo-1560439513-74b037a25d84?w=1200&h=675&fit=crop",
      imageAlt: "Litman Gregory Annual Investment Event - Jeremiah Owyang presenting AI market impact and investment trends for wealth management clients",
      speakerContribution: "Jeremiah presented a thought-provoking keynote on AI's transformative impact on investment markets and wealth management. He translated complex AI trends into actionable insights for investors, helping Litman Gregory's clients understand which technology trends to watch and how AI will reshape their investment portfolios.",
      testimonial: "Jeremiah delivered exceptional insights on how AI will reshape investment markets and helped our clients identify key trends to watch, making complex technology accessible and actionable for wealth management.",
      speakers: [
        {
          name: "Jeremiah Owyang",
          slug: "jeremiah-owyang",
          title: "General Partner, Blitzscaling Ventures. Llama Lounge, AI Event Founder",
          headshot: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/jeremiah-owyang-headshot-1749730844346.jpg"
        }
      ],
      impact: [
        "Client education on AI's impact on investment markets",
        "Identification of key technology trends for investors",
        "Actionable insights for wealth management strategy"
      ]
    },
    {
      id: "chapman-university",
      company: "Chapman University",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Chapman_University_seal.svg/200px-Chapman_University_seal.svg.png",
      location: "Orange, California",
      eventType: "Academic AI Symposium",
      image: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/IMG_075.jpg",
      imageAlt: "Chapman University AI Symposium - Noah Cheyer and Adam Cheyer presenting artificial intelligence insights to students faculty and researchers on practical AI applications and innovation",
      speakerContribution: "Noah and Adam delivered a comprehensive presentation on AI innovation, from Siri's creation to modern AI applications. Adam shared technical insights on building conversational AI systems, while Noah discussed how the speaker industry can leverage AI, providing students and faculty with both foundational knowledge and practical implementation guidance.",
      testimonial: "Delivered exceptional insights on AI innovation and practical applications that inspired our academic community and enriched our understanding of cutting-edge technology.",
      speakers: [
        {
          name: "Noah Cheyer",
          slug: "noah-cheyer",
          title: "Co-Founder, Head of Marketing & Operations at Speak About AI",
          headshot: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/noah-cheyer-new-headshot.jpg"
        },
        {
          name: "Adam Cheyer",
          slug: "adam-cheyer",
          title: "VP of AI Experience at Airbnb, Co-Founder of Siri",
          headshot: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/adam-cheyer-headshot-1749607372221.jpg"
        }
      ],
      impact: [
        "Academic AI education and research insights",
        "Practical AI implementation strategies for education",
        "Next-generation technology thought leadership"
      ]
    },
    {
      id: "speak-about-ai-conference",
      company: "Speak About AI Conference",
      logo: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/speak-about-ai-logo.png",
      location: "San Francisco, California",
      eventType: "AI Industry Conference",
      image: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/robert-strong-speak-about-ai.jpg",
      imageAlt: "Speak About AI Conference San Francisco - Robert Strong serving as MC and emcee for premier AI industry conference bringing together thought leaders innovators and practitioners",
      speakerContribution: "Robert served as the master of ceremonies for our inaugural AI conference, bringing his unique blend of entertainment and professionalism to keep the audience engaged throughout the day. He expertly introduced speakers, moderated Q&A sessions, and facilitated networking breaks, ensuring seamless transitions and maintaining conference energy from start to finish.",
      testimonial: "Robert Strong brought exceptional energy and professionalism as MC, seamlessly guiding our AI conference and ensuring engaging interactions between speakers and attendees.",
      speakers: [
        {
          name: "Robert Strong",
          slug: "robert-strong",
          title: "Magician, Author, and Speaker",
          headshot: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/robert-strong-headshot-speak-about-ai.png"
        }
      ],
      impact: [
        "Seamless conference flow and professional hosting",
        "Engaging Q&A moderation and speaker introductions",
        "Enhanced attendee experience and networking"
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
                  alt={study.imageAlt}
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
                    <h4 className="text-sm font-bold text-gray-900 font-neue-haas mb-4 flex items-center">
                      <User className="w-4 h-4 mr-2 text-[#1E68C6]" />
                      Featured Speaker{study.speakers.length > 1 ? 's' : ''}:
                    </h4>
                    <div className="space-y-4">
                      {study.speakers.map((speaker, idx) => (
                        <div key={idx} className="flex items-start gap-4 bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-lg border border-blue-100">
                          {/* Speaker Headshot */}
                          <Link href={`/speakers/${speaker.slug}`} className="flex-shrink-0">
                            <img
                              src={speaker.headshot}
                              alt={speaker.name}
                              className="w-20 h-20 rounded-full object-cover border-2 border-[#1E68C6] hover:border-[#D4AF37] transition-all duration-300"
                            />
                          </Link>

                          {/* Speaker Info and CTA */}
                          <div className="flex-1 min-w-0">
                            <Link href={`/speakers/${speaker.slug}`} className="group">
                              <h5 className="text-lg font-bold text-gray-900 font-neue-haas group-hover:text-[#1E68C6] transition-colors">
                                {speaker.name}
                              </h5>
                              <p className="text-sm text-gray-600 font-montserrat mt-1 leading-snug">
                                {speaker.title}
                              </p>
                            </Link>

                            {/* Book Speaker CTA */}
                            <div className="mt-3">
                              <Button
                                asChild
                                variant="gold"
                                size="sm"
                                className="font-montserrat font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <Link
                                  href={`/contact?source=case_study_${study.id}&speakerName=${encodeURIComponent(speaker.name)}`}
                                  className="inline-flex items-center gap-2"
                                >
                                  <CalendarCheck className="w-4 h-4" />
                                  Book Speaker Today
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Speaker Contribution */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 font-neue-haas mb-3">What the Speaker Provided:</h4>
                  <p className="text-gray-700 font-montserrat leading-relaxed">
                    {study.speakerContribution}
                  </p>
                </div>

                {/* Testimonial */}
                {study.testimonial && (
                  <div className="mb-6 relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[#1E68C6] opacity-20" />
                    <p className="text-gray-700 font-montserrat leading-relaxed pl-6 italic mb-3">
                      "{study.testimonial}"
                    </p>
                    {study.testimonialAuthor && (
                      <div className="pl-6 mt-3">
                        <p className="text-gray-900 font-bold font-neue-haas text-sm">
                          — {study.testimonialAuthor}
                        </p>
                        {study.testimonialTitle && (
                          <p className="text-gray-600 font-montserrat text-xs mt-0.5">
                            {study.testimonialTitle}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

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
      </div>
    </section>
  )
}
