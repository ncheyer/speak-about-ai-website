"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Mic, MessageCircle, Users, BookOpen, Video, Camera, Zap } from "lucide-react"

export default function ServiceOfferings() {
  const services = [
    {
      title: "Keynote Speeches",
      icon: Mic,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Our AI experts deliver compelling keynotes that educate and inspire audiences of all sizes and backgrounds. From intimate boardrooms to packed arenas, our speakers adapt their presentations to captivate your specific audience.",
      features: [
        "30-60 minute presentations",
        "Customized content for your audience",
        "Adaptable to any venue size",
        "Interactive Q&A sessions",
      ],
    },
    {
      title: "Fireside Chats",
      icon: MessageCircle,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Engage your audience with interactive discussions featuring our knowledgeable and charismatic speakers. Fireside chats offer a more intimate setting for in-depth exploration of AI topics.",
      features: [
        "Intimate, conversational format",
        "Interactive audience engagement",
        "Deep-dive AI discussions",
        "Personal insights and stories",
      ],
    },
    {
      title: "Panel Discussions",
      icon: Users,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Bring multiple perspectives to your event with our expert-led panel discussions. Our speakers can participate in or moderate panels, offering diverse insights into the world of AI.",
      features: [
        "Multiple AI expert perspectives",
        "Moderated discussions",
        "Diverse industry insights",
        "Audience interaction opportunities",
      ],
    },
    {
      title: "Workshops and Training",
      icon: BookOpen,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Dive deeper with hands-on workshops and training sessions led by AI practitioners with real-world experience. These sessions provide practical knowledge and skills your team can immediately apply.",
      features: [
        "Half-day or full-day formats",
        "Hands-on learning experience",
        "Real-world applications",
        "Immediate practical value",
      ],
    },
    {
      title: "Virtual and Hybrid Events",
      icon: Video,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Our speakers are experienced in delivering impactful presentations in virtual and hybrid settings, ensuring your event is successful regardless of the format.",
      features: [
        "Professional virtual setup",
        "Hybrid event expertise",
        "Interactive online engagement",
        "Global accessibility",
      ],
    },
    {
      title: "Custom Video Content",
      icon: Camera,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Book our speakers to create exclusive video content for your organization, perfect for internal training, marketing materials, or social media campaigns.",
      features: [
        "Exclusive content creation",
        "Multiple format options",
        "Professional production quality",
        "Flexible usage rights",
      ],
    },
  ]

  const sprintAI = {
    title: "SprintAI: One-Day Generative AI Innovation Accelerator",
    icon: Zap,
    image: "/placeholder.svg?height=300&width=500",
    description:
      "SprintAI is our flagship workshop offering hosted by Adam Holt, designed to revolutionize your team's approach to AI strategy. It's a collaborative innovation sprint where Generative AI and human creativity converge to amplify your team's insights and accelerate results—all in a single day.",
    benefits: [
      "Accelerated Ideation: Achieve in one day what traditionally takes a week or more",
      "Synergistic Collaboration: AI tools work alongside your team, enhancing human insights",
      "Strategic Focus: AI assists in maintaining alignment with key business objectives",
      "Superior Idea Quality: Generate, iterate, and refine ideas more effectively",
    ],
    details:
      "Available virtually or in-person for leadership teams of 5 to 20 participants, with two expert facilitators guiding you through the day. Tangible outputs include a prioritized idea portfolio, pitch deck, innovation metrics, team alignment, and an executive summary.",
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="relative">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md">
                    <service.icon className="w-6 h-6 text-[#1E68C6]" />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-neue-haas">{service.title}</h3>
                  <p className="text-gray-600 mb-4 font-montserrat">{service.description}</p>

                  <div className="mb-6 mt-auto">
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-gray-600 flex items-start font-montserrat">
                          <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 font-montserrat text-center"
                    style={{
                      backgroundColor: "#1E68C6",
                      color: "white",
                    }}
                    data-button="primary"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#5084C6"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#1E68C6"
                    }}
                  >
                    Learn More
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SprintAI Featured Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <sprintAI.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 font-neue-haas">{sprintAI.title}</h3>
              </div>

              <p className="text-gray-600 mb-6 font-montserrat">{sprintAI.description}</p>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 font-neue-haas">Key Benefits:</h4>
                <ul className="space-y-2">
                  {sprintAI.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-600 flex items-start font-montserrat">
                      <span className="flex-shrink-0 text-orange-600 mr-2">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm text-gray-600 mb-6 font-montserrat">{sprintAI.details}</p>

              <a
                href="mailto:human@speakabout.ai"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 font-montserrat"
                style={{
                  backgroundColor: "#ea580c",
                  color: "white",
                }}
                data-button="orange"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#c2410c"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ea580c"
                }}
              >
                Inquire About SprintAI
              </a>
            </div>

            <div className="lg:order-first">
              <div className="relative">
                <img
                  src={sprintAI.image || "/placeholder.svg"}
                  alt="Adam Holt SprintAI Workshop"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Adam Holt Bio Card */}
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <img
                    src="/placeholder.svg?height=80&width=80"
                    alt="Adam Holt"
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 font-neue-haas">Adam Holt</h4>
                    <p className="text-[#1E68C6] font-semibold font-montserrat">Innovation Leader</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-montserrat">
                  Adam Holt brings over two decades of innovation leadership experience, having led product and design
                  teams at Wells Fargo Innovation Center, BBVA, and T-Mobile. As Head of Wells Fargo Innovation Center,
                  he built and led a 30-member team of product managers and experience designers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
