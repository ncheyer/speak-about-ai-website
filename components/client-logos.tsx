"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
      <TooltipProvider>
        <div className="relative w-full overflow-hidden py-1">
          {/* Added gap-x-16 for spacing between logos - faster animation */}
          <div className="flex animate-marquee-fast gap-x-16">
            {allClients.map((client, index) => (
              // Removed px-8 from here
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div className="flex-shrink-0 flex items-center justify-center py-2 cursor-pointer">
                    <Image
                      src={client.src || "/placeholder.svg"}
                      alt={client.alt}
                      width={
                        client.size === "super-large"
                          ? 800
                          : client.size === "extra-large"
                            ? 500
                            : client.size === "small"
                              ? 250
                              : 400
                      }
                      height={
                        client.size === "super-large"
                          ? 400
                          : client.size === "extra-large"
                            ? 250
                            : client.size === "small"
                              ? 120
                              : 200
                      }
                      className={`w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 ${
                        client.size === "super-large"
                          ? "h-64"
                          : client.size === "extra-large"
                            ? "h-40"
                            : client.size === "small"
                              ? "h-24"
                              : "h-32"
                      }`}
                      loading="lazy"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{client.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </TooltipProvider>

      {/* View Past Clients & Events Link */}
      <div className="text-center mt-8 pb-4">
        <Button asChild variant="outline" size="lg" className="font-montserrat font-semibold">
          <Link href="/partners" className="flex items-center">
            View Past Clients & Events
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
