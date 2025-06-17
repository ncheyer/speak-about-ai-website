import type { Metadata } from "next"
import { getSpeakersByIndustry } from "@/lib/speakers-data"
import { SpeakerCard } from "@/components/speaker-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  BarChart3,
  Zap,
  Globe,
  Shield,
  Building2,
  Briefcase,
  PieChart,
  Rocket,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Leadership & Business Strategy AI Keynote Speakers | Speak About AI",
  description:
    "Book top leadership and business strategy AI keynote speakers for your corporate events. Expert speakers on AI transformation, digital leadership, and strategic innovation.",
  keywords:
    "leadership keynote speaker, business keynote speaker, AI leadership speakers, business strategy speakers, corporate keynote speakers, executive speakers, digital transformation speakers",
  openGraph: {
    title: "Leadership & Business Strategy AI Keynote Speakers",
    description:
      "Transform your leadership events with expert AI keynote speakers specializing in business strategy, digital transformation, and executive leadership.",
    type: "website",
  },
}

export default async function LeadershipBusinessStrategyPage() {
  const speakers = await getSpeakersByIndustry("Leadership")

  const topics = [
    {
      icon: TrendingUp,
      title: "AI-Driven Business Transformation",
      description:
        "Strategic frameworks for implementing AI across organizations and driving digital transformation initiatives.",
    },
    {
      icon: Users,
      title: "Leadership in the AI Era",
      description:
        "Essential leadership skills and mindsets needed to guide teams and organizations through AI adoption.",
    },
    {
      icon: Target,
      title: "Strategic AI Implementation",
      description: "Best practices for developing and executing AI strategies that align with business objectives.",
    },
    {
      icon: Lightbulb,
      title: "Innovation & Change Management",
      description: "Leading organizational change and fostering innovation cultures in AI-driven environments.",
    },
    {
      icon: BarChart3,
      title: "AI ROI & Performance Metrics",
      description: "Measuring success and demonstrating value from AI investments and strategic initiatives.",
    },
    {
      icon: Zap,
      title: "Future of Work & Leadership",
      description: "Preparing leaders and organizations for the evolving workplace shaped by artificial intelligence.",
    },
    {
      icon: Globe,
      title: "Global AI Strategy",
      description:
        "Developing competitive advantages through AI while navigating international markets and regulations.",
    },
    {
      icon: Shield,
      title: "Ethical AI Leadership",
      description: "Building responsible AI practices and governance frameworks for sustainable business growth.",
    },
  ]

  const industries = [
    { name: "Fortune 500 Companies", icon: Building2 },
    { name: "Technology Enterprises", icon: Rocket },
    { name: "Financial Services", icon: PieChart },
    { name: "Consulting Firms", icon: Briefcase },
    { name: "Manufacturing", icon: Target },
    { name: "Healthcare Systems", icon: Shield },
    { name: "Retail & E-commerce", icon: TrendingUp },
    { name: "Energy & Utilities", icon: Zap },
    { name: "Government Agencies", icon: Globe },
    { name: "Non-Profit Organizations", icon: Users },
    { name: "Educational Institutions", icon: Lightbulb },
    { name: "Startups & Scale-ups", icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1E68C6] to-[#5084C6] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Leadership & Business Strategy
              <span className="block text-3xl md:text-5xl mt-2">AI Keynote Speakers</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              Transform your organization with expert keynote speakers who specialize in AI leadership, strategic
              transformation, and executive decision-making in the age of artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#1E68C6] hover:bg-gray-100 text-lg px-8 py-3">
                <Link href="/contact?source=leadership_hero">Book a Speaker</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#1E68C6] text-lg px-8 py-3"
              >
                <Link href="#speakers">View Speakers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Grid */}
      <section id="speakers" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Expert Leadership & Business Strategy Speakers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our speakers are proven leaders who have successfully navigated AI transformation at the highest levels of
              business and government.
            </p>
          </div>

          {speakers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {speakers.map((speaker) => (
                <SpeakerCard
                  key={speaker.slug}
                  speaker={speaker}
                  contactSource="leadership_industry_page"
                  maxTopics={3}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Our leadership and business strategy speakers are being updated. Please{" "}
                <Link href="/contact" className="text-[#1E68C6] hover:underline">
                  contact us
                </Link>{" "}
                for current availability.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leadership & Strategy Topics</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our speakers cover the most critical aspects of leading organizations through AI transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <topic.icon className="w-12 h-12 text-[#1E68C6] mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{topic.title}</h3>
                  <p className="text-gray-600 text-sm">{topic.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our leadership speakers have experience across diverse industries and organizational contexts.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <industry.icon className="w-6 h-6 text-[#1E68C6] flex-shrink-0" />
                <span className="text-gray-700 font-medium text-sm">{industry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1E68C6] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Leadership Event?</h2>
          <p className="text-xl mb-8 leading-relaxed">
            Connect with our expert team to find the perfect leadership and business strategy speaker for your corporate
            event, conference, or executive retreat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#1E68C6] hover:bg-gray-100 text-lg px-8 py-3">
              <Link href="/contact?source=leadership_cta">Get Speaker Recommendations</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#1E68C6] text-lg px-8 py-3"
            >
              <Link href="/our-services">Learn About Our Services</Link>
            </Button>
          </div>
          <div className="mt-8 text-lg">
            <p>
              Call us directly: <span className="font-semibold">(510) 435-3947</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
