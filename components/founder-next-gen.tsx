import { Rocket, FileText, Calculator, Database, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FounderNextGen() {
  const innovations = [
    {
      icon: Calculator,
      title: "AI ROI Calculator",
      description: "Quantify the business impact of AI speakers for your event budget",
      status: "Coming Soon",
    },
    {
      icon: FileText,
      title: "Speaker Selection Guide",
      description: "Step-by-step framework to match speakers with your audience and goals",
      status: "Available",
    },
    {
      icon: Database,
      title: "AI Trends Dashboard",
      description: "Real-time insights on emerging AI topics and speaker demand",
      status: "In Development",
    },
    {
      icon: BookOpen,
      title: "Event Planner Playbook",
      description: "Best practices for booking, logistics, and maximizing speaker impact",
      status: "Available",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-amber-100 text-gray-900 rounded-full text-sm font-medium mb-6 font-montserrat">
            <Rocket className="w-4 h-4 mr-2" />
            Building the Future of Speaker Booking
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 font-neue-haas">
            Innovation from Founders Who Get It
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
            We're not just booking speakers—we're building practical AI tools, frameworks, and resources to help event
            planners and organizations make smarter decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {innovations.map((innovation, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-[#1E68C6] transition-all duration-300 group"
            >
              <div className="flex flex-col h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <innovation.icon className="w-6 h-6 text-[#1E68C6]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-neue-haas">{innovation.title}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow font-montserrat">{innovation.description}</p>
                <div className="mt-auto">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      innovation.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : innovation.status === "In Development"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {innovation.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#1E68C6] to-blue-700 rounded-2xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 font-neue-haas">
                Want Early Access to Our Tools?
              </h3>
              <p className="text-lg text-blue-100 font-montserrat">
                Join our innovation partners program and get exclusive access to new resources, beta tools, and
                AI adoption frameworks
              </p>
            </div>
            <Button
              asChild
              variant="gold"
              size="lg"
              className="flex-shrink-0 font-montserrat font-bold text-lg whitespace-nowrap"
            >
              <Link href="/contact?source=innovation">Get Early Access</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <TrendingUp className="w-5 h-5 text-[#1E68C6]" />
            <span className="font-montserrat">
              <strong className="text-gray-900">Next-generation thinking</strong> from founders who've been in the
              trenches
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
