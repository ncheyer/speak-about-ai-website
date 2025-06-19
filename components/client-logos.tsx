"use client"

import Image from "next/image"

export default function ClientLogos() {
  const clients = [
    {
      name: "Stanford University",
      src: "/logos/stanford-university-logo-1024x335-1.png",
      alt: "Stanford University logo",
      size: "small",
    },
    {
      name: "Google",
      src: "/logos/Google_2015_logo.svg.png",
      alt: "Google logo",
      size: "small",
    },
    {
      name: "Amazon",
      src: "/logos/Amazon-Logo-2000.png",
      alt: "Amazon logo",
      size: "default",
    },
    {
      name: "Visa",
      src: "/logos/Visa_Inc._logo.svg",
      alt: "Visa Inc. logo",
      size: "small",
    },
    {
      name: "Rio Innovation Week",
      src: "/logos/rio-innovation-week-new.png",
      alt: "Rio Innovation Week - Leading innovation conference in Brazil",
      size: "extra-large",
    },
    {
      name: "NICE",
      src: "/logos/nice-logo.png",
      alt: "NICE - Cloud platform for customer experience and financial crime solutions",
      size: "extra-large",
    },
    {
      name: "ST Engineering",
      src: "/logos/st-engineering-logo.png",
      alt: "ST Engineering - Global technology, defense and engineering group",
      size: "super-large",
    },
    {
      name: "Government of Korea",
      src: "/logos/korea-government-logo.png",
      alt: "Government of the Republic of Korea - Official government emblem",
      size: "extra-large",
    },
    {
      name: "Juniper Networks",
      src: "/logos/juniper-networks-logo.svg",
      alt: "Juniper Networks - AI-driven enterprise networking solutions",
      size: "extra-large",
    },
    {
      name: "KPMG",
      src: "/logos/KPMG_logo.svg.png",
      alt: "KPMG logo",
      size: "default",
    },
  ]

  // Duplicate clients for a seamless looping effect
  const allClients = [...clients, ...clients]

  return (
    <section className="pt-4 pb-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-3">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Trusted by Industry Leaders</h2>
          <p className="text-lg text-gray-600">
            Our speakers have worked with leading organizations around the world for their most important events.
          </p>
        </div>
      </div>
      <div className="relative w-full overflow-hidden py-1">
        {/* Added gap-x-16 for spacing between logos */}
        <div className="flex animate-marquee gap-x-16">
          {allClients.map((client, index) => (
            // Removed px-8 from here
            <div key={index} className="flex-shrink-0 flex items-center justify-center py-2">
              <Image
                src={client.src || "/placeholder.svg"}
                alt={client.alt}
                // Increased width and height for larger logos
                width={
                  client.size === "super-large"
                    ? 800 // Increased from 600
                    : client.size === "extra-large"
                      ? 500 // Increased from 400
                      : client.size === "small"
                        ? 250 // Increased from 200
                        : 400 // Increased from 320
                }
                height={
                  client.size === "super-large"
                    ? 400 // Increased from 300
                    : client.size === "extra-large"
                      ? 250 // Increased from 200
                      : client.size === "small"
                        ? 120 // Increased from 100
                        : 200 // Increased from 160
                }
                className={`w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 ${
                  // Increased h-* classes for larger logos
                  client.size === "super-large"
                    ? "h-64" // Increased from h-48
                    : client.size === "extra-large"
                      ? "h-40" // Increased from h-32
                      : client.size === "small"
                        ? "h-24" // Increased from h-16
                        : "h-32" // Increased from h-24
                }`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
