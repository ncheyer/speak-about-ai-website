"use client"

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="relative w-full aspect-square sm:aspect-[4/5] md:aspect-[3/4] bg-gray-200">
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
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 font-neue-haas">{service.title}</h2>
                <p className="text-gray-700 font-montserrat">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServiceOfferings
