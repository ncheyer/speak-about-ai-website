import { Users, Brain, Building2, BookOpen, Rocket, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FounderNextGen() {
  const resources = [
    {
      icon: Users,
      title: "WhatsApp Community",
      description: "Join 500+ event professionals sharing insights, vendors, and best practices",
      link: "/event-professionals-whatsapp",
      status: "Join Now",
    },
    {
      icon: Brain,
      title: "Free AI GPTs for Events",
      description: "5 custom AI tools to help you plan better events, write better copy, and save time",
      link: "/blog",
      status: "Get Access",
    },
    {
      icon: Building2,
      title: "Vendor Directory",
      description: "Curated list of trusted event vendors and service providers",
      link: "/vendor-directory",
      status: "Browse Now",
    },
    {
      icon: BookOpen,
      title: "Event Planning Resources",
      description: "Guides, templates, and best practices for booking speakers and running successful events",
      link: "/blog",
      status: "Explore",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-amber-100 text-gray-900 rounded-full text-sm font-medium mb-6 font-montserrat">
            <Rocket className="w-4 h-4 mr-2" />
            Resources for Event Professionals
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 font-neue-haas">
            Free Tools & Community for Event Planners
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
            We're building more than a speaker bureau—we're creating a community and toolkit to help event
            professionals succeed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {resources.map((resource, index) => (
            <Link
              key={index}
              href={resource.link}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-[#1E68C6] transition-all duration-300 group block"
            >
              <div className="flex flex-col h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <resource.icon className="w-6 h-6 text-[#1E68C6]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-neue-haas">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow font-montserrat">{resource.description}</p>
                <div className="mt-auto">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-[#1E68C6] group-hover:bg-[#1E68C6] group-hover:text-white transition-colors">
                    {resource.status} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#1E68C6] to-blue-700 rounded-2xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 font-neue-haas">
                Join Our Event Professionals Community
              </h3>
              <p className="text-lg text-blue-100 font-montserrat">
                Get exclusive access to resources, connect with other event planners, and stay ahead with the latest
                AI trends in events
              </p>
            </div>
            <Button
              asChild
              variant="gold"
              size="lg"
              className="flex-shrink-0 font-montserrat font-bold text-lg whitespace-nowrap"
            >
              <Link href="/event-professionals-whatsapp">Join WhatsApp Group</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <Sparkles className="w-5 h-5 text-[#1E68C6]" />
            <span className="font-montserrat">
              <strong className="text-gray-900">Built by event professionals,</strong> for event professionals
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
