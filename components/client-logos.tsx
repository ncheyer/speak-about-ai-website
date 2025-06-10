import Image from "next/image"

export default function ClientLogos() {
  const clients = [
    {
      name: "Rio Innovation Week",
      src: "/logos/rio-innovation-week-new.png",
      alt: "Rio Innovation Week - Leading innovation conference in Brazil",
      featured: true,
    },
    {
      name: "NICE",
      src: "/logos/nice-logo.png",
      alt: "NICE - Cloud platform for customer experience and financial crime solutions",
      featured: false,
    },
    {
      name: "ST Engineering",
      src: "/logos/st-engineering-logo.png",
      alt: "ST Engineering - Global technology, defense and engineering group",
      featured: true,
    },
    {
      name: "Government of Korea",
      src: "/logos/korea-government-logo.png",
      alt: "Government of the Republic of Korea - Official government emblem",
      featured: false,
    },
    {
      name: "Juniper Networks",
      src: "/logos/juniper-networks-logo.svg",
      alt: "Juniper Networks - AI-driven enterprise networking solutions",
      featured: false,
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
          <p className="text-lg text-gray-600">
            Fortune 1000 companies, governments, and international organizations choose our AI speakers for their most
            important events
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 items-center">
          {clients.map((client, index) => (
            <div key={index} className="flex items-center justify-center p-4">
              <Image
                src={client.src || "/placeholder.svg"}
                alt={client.alt}
                width={client.featured ? 400 : 320}
                height={client.featured ? 200 : 160}
                className={`w-auto object-contain hover:scale-105 transition-transform duration-300 opacity-80 hover:opacity-100 ${
                  client.featured ? "h-32" : "h-24"
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
