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
      {" "}
      {/* Further reduced pt-8 to pt-4 and pb-16 to pb-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-3">
          {" "}
          {/* Further reduced mb-6 to mb-3 */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Trusted by Industry Leaders</h2>{" "}
          {/* Reduced mb-4 to mb-2 */}
          <p className="text-lg text-gray-600">
            Our speakers have worked with leading organizations around the world for their most important events.
          </p>
        </div>
      </div>
      <div className="relative w-full overflow-hidden py-1">
        {" "}
        {/* Further reduced py-2 to py-1 */}
        <div className="flex animate-marquee">
          {allClients.map((client, index) => (
            <div key={index} className="flex-shrink-0 flex items-center justify-center px-8 py-2">
              {" "}
              {/* Reduced py-4 to py-2 */}
              <Image
                src={client.src || "/placeholder.svg"}
                alt={client.alt}
                // Conditionally apply sizes based on the 'size' property
                width={
                  client.size === "super-large"
                    ? 600
                    : client.size === "extra-large"
                      ? 400
                      : client.size === "small"
                        ? 200
                        : 320
                }
                height={
                  client.size === "super-large"
                    ? 300
                    : client.size === "extra-large"
                      ? 200
                      : client.size === "small"
                        ? 100
                        : 160
                }
                className={`w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 ${
                  client.size === "super-large"
                    ? "h-48"
                    : client.size === "extra-large"
                      ? "h-32"
                      : client.size === "small"
                        ? "h-16"
                        : "h-24"
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
