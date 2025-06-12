import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getSpeakersByIndustry } from "@/lib/speakers-data"

export const metadata: Metadata = {
  title: "Finance AI Speakers | Financial Services AI Keynote Speakers | Speak About AI",
  description:
    "Book top finance AI keynote speakers for your financial services conference or event. Experts in AI banking applications, fintech, and financial technology innovation.",
  keywords:
    "finance AI speakers, financial services AI keynote speakers, fintech speakers, AI in banking speakers, financial technology speakers",
}

export default async function FinanceAISpeakersPage() {
  const financeSpeakers = await getSpeakersByIndustry("Finance")

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#EAEAEE] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Finance AI Speakers</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              World-class artificial intelligence experts specializing in financial services, banking technology, and
              fintech innovation.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Book a Finance AI Speaker?</h2>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start">
                  <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                  <span>Learn how AI is transforming banking, investments, and financial services</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                  <span>Discover the latest in fintech innovation and applications</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                  <span>Understand how financial institutions can implement AI solutions</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                  <span>Explore the future of money, payments, and financial security</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-[#1E68C6] hover:bg-[#5084C6]">
                <Link href="/contact?source=finance_industry_page&industry=Finance">Book a Finance AI Speaker</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Finance AI Keynote Speakers</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(financeSpeakers) &&
              financeSpeakers.map((speaker) => (
                <Card
                  key={speaker.slug}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={speaker.image || "/placeholder.svg"}
                        alt={speaker.name}
                        className="w-full h-64 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded text-sm font-semibold text-gray-900">
                        {speaker.fee}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{speaker.name}</h3>
                      <p className="text-[#5084C6] font-semibold mb-3">{speaker.title}</p>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{speaker.bio}</p>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Finance Expertise:</h4>
                        <div className="flex flex-wrap gap-1">
                          {speaker.expertise
                            .filter(
                              (skill) =>
                                skill.toLowerCase().includes("finance") ||
                                skill.toLowerCase().includes("banking") ||
                                skill.toLowerCase().includes("fintech") ||
                                skill.toLowerCase().includes("business"),
                            )
                            .slice(0, 3)
                            .map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild className="flex-1 bg-[#1E68C6] hover:bg-[#5084C6]">
                          <Link href={`/speakers/${speaker.slug}`}>View Profile</Link>
                        </Button>
                        <Button asChild variant="outline" className="flex-1">
                          <Link
                            href={`/contact?source=finance_industry_page&speakerName=${encodeURIComponent(speaker.name)}&industry=Finance`}
                          >
                            Book Now
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {(!Array.isArray(financeSpeakers) || financeSpeakers.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No finance AI speakers found. Please check back later.</p>
              <Button asChild className="bg-[#1E68C6] hover:bg-[#5084C6]">
                <Link href="/speakers">View All Speakers</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Popular Finance AI Speaking Topics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI in Banking & Financial Services</h3>
              <p className="text-gray-600">
                How artificial intelligence is revolutionizing customer service, risk assessment, and financial
                operations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Algorithmic Trading & Investment</h3>
              <p className="text-gray-600">
                The role of AI in market analysis, trading strategies, and investment decision-making.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fraud Detection & Security</h3>
              <p className="text-gray-600">
                How machine learning is enhancing financial security, detecting fraud, and preventing cybercrime.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">The Future of Fintech</h3>
              <p className="text-gray-600">
                Emerging trends in financial technology, digital banking, and the transformation of financial services.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI & Blockchain in Finance</h3>
              <p className="text-gray-600">
                The convergence of AI and blockchain technologies in creating new financial products and services.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Regulatory Technology (RegTech)</h3>
              <p className="text-gray-600">
                How AI is helping financial institutions navigate complex regulatory environments and ensure compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1E68C6]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Book a Finance AI Speaker?</h2>
          <p className="text-xl text-white text-opacity-90 mb-8 max-w-3xl mx-auto">
            Our finance AI experts are trusted by leading banks, investment firms, insurance companies, and financial
            conferences worldwide.
          </p>
          <Button asChild size="lg" className="bg-white text-[#1E68C6] hover:bg-[#EAEAEE] text-lg px-8 py-4">
            <Link href="/contact?source=finance_industry_page&industry=Finance">Contact Us for Availability</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
