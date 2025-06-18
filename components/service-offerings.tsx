"use client"

import { Zap } from "lucide-react"
import { useState, useEffect } from "react"

const ServiceOfferings = () => {
  // State to track which images have loaded
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const services = [
    {
      id: "keynote",
      image: "/services/adam-cheyer-stadium.jpg",
      title: "Keynote Speeches",
      description: "Inspire your audience with engaging and informative keynote speeches on the future of technology.",
    },
    {
      id: "panel",
      image: "/services/sharon-zhou-panel.jpg",
      title: "Panel Discussions",
      description: "Facilitate insightful and dynamic panel discussions on industry trends and challenges.",
    },
    {
      id: "fireside",
      image: "/services/allie-k-miller-fireside.jpg",
      title: "Fireside Chats",
      description: "Create intimate and engaging conversations with industry leaders in a fireside chat format.",
    },
    {
      id: "workshops",
      image: "/services/tatyana-mamut-speaking.jpg",
      title: "Workshops",
      description:
        "Provide hands-on learning experiences with interactive workshops tailored to your audience's needs.",
    },
    {
      id: "virtual",
      image: "/services/sharon-zhou-headshot.png",
      title: "Virtual Presentations",
      description: "Reach a global audience with engaging and professional virtual presentations.",
    },
    {
      id: "video",
      image: "/services/simon-pierro-youtube.jpg",
      title: "Custom Video Content",
      description: "Create compelling video content for marketing, training, and internal communications.",
    },
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
        // Still mark as "loaded" to stop showing loading state
        setLoadedImages((prev) => new Set([...prev, id]))
      }
      img.src = src
    }

    // Preload all service images
    services.forEach((service) => {
      preloadImage(service.image, service.id)
    })
  }, [])

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative w-full h-48 bg-gray-200">
                {!loadedImages.has(service.id) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                )}
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    loadedImages.has(service.id) ? "opacity-100" : "opacity-0"
                  }`}
                  loading="eager"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SprintAI Featured Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 font-neue-haas">
                  SprintAI: One-Day Generative AI Innovation Accelerator
                </h3>
              </div>

              <p className="text-gray-600 mb-6 font-montserrat">
                SprintAI is our flagship workshop offering hosted by Adam Holt, designed to revolutionize your team's
                approach to AI strategy. It's a collaborative innovation sprint where Generative AI and human creativity
                converge to amplify your team's insights and accelerate results—all in a single day.
              </p>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 font-neue-haas">Key Benefits:</h4>
                <ul className="space-y-2">
                  <li className="text-gray-600 flex items-start font-montserrat">
                    <span className="flex-shrink-0 text-orange-600 mr-2">•</span>
                    <span>Accelerated Ideation: Achieve in one day what traditionally takes a week or more</span>
                  </li>
                  <li className="text-gray-600 flex items-start font-montserrat">
                    <span className="flex-shrink-0 text-orange-600 mr-2">•</span>
                    <span>Synergistic Collaboration: AI tools work alongside your team, enhancing human insights</span>
                  </li>
                  <li className="text-gray-600 flex items-start font-montserrat">
                    <span className="flex-shrink-0 text-orange-600 mr-2">•</span>
                    <span>Strategic Focus: AI assists in maintaining alignment with key business objectives</span>
                  </li>
                  <li className="text-gray-600 flex items-start font-montserrat">
                    <span className="flex-shrink-0 text-orange-600 mr-2">•</span>
                    <span>Superior Idea Quality: Generate, iterate, and refine ideas more effectively</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-600 mb-6 font-montserrat">
                Available virtually or in-person for leadership teams of 5 to 20 participants, with two expert
                facilitators guiding you through the day. Tangible outputs include a prioritized idea portfolio, pitch
                deck, innovation metrics, team alignment, and an executive summary.
              </p>

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
              <ServiceImage
                src="/services/sprintai-workshop.png"
                alt="Adam Holt SprintAI Workshop"
                className="w-full h-auto rounded-lg shadow-lg"
              />

              {/* Adam Holt Bio Card */}
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ServiceImage
                    src="/services/adam-holt-headshot.png"
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

// Separate component for images with loading states
const ServiceImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setIsLoaded(true)
    img.onerror = () => {
      console.warn(`Failed to preload image: ${src}`)
      setIsLoaded(true) // Still show the image even if preload fails
    }
    img.src = src
  }, [src])

  return (
    <div className="relative">
      {!isLoaded && (
        <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
          <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      )}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
        }`}
        loading="eager"
      />
    </div>
  )
}

export default ServiceOfferings
