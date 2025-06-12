import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getSpeakersByIndustry } from "@/lib/speakers-data"

export const metadata: Metadata = {
  title: "Healthcare AI Speakers | Medical AI Keynote Speakers | Speak About AI",
  description:
    "Book top healthcare AI keynote speakers for your medical conference or event. Experts in AI healthcare applications, medical technology, and digital health innovation.",
  keywords:
    "healthcare AI speakers, medical AI keynote speakers, digital health speakers, AI in medicine speakers, healthcare technology speakers",
}

export default async function HealthcareAISpeakersPage() {
  const healthcareSpeakers = await getSpeakersByIndustry("Healthcare")

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#EAEAEE] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Healthcare AI Speakers</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              World-class artificial intelligence experts specializing in healthcare, medical technology, and digital
              health innovation.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Book a Healthcare AI Speaker?</h2>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start">
                  <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                  <span>Learn how AI is transforming patient care, diagnostics, and treatment</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                  <span>Discover the latest in medical AI research and applications</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                  <span>Understand how healthcare organizations can implement AI solutions</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                  <span>Explore the ethical implications of AI in medicine</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-[#1E68C6] hover:bg-[#5084C6]">
                <Link href="/contact?source=healthcare_industry_page&industry=Healthcare">
                  Book a Healthcare AI Speaker
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Healthcare AI Keynote Speakers</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(healthcareSpeakers) &&
              healthcareSpeakers.map((speaker) => (
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
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Healthcare Expertise:</h4>
                        <div className="flex flex-wrap gap-1">
                          {speaker.expertise
                            .filter(
                              (skill) =>
                                skill.toLowerCase().includes("health") ||
                                skill.toLowerCase().includes("medical") ||
                                skill.toLowerCase().includes("medicine") ||
                                skill.toLowerCase().includes("digital"),
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
                            href={`/contact?source=healthcare_industry_page&speakerName=${encodeURIComponent(speaker.name)}&industry=Healthcare`}
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

          {(!Array.isArray(healthcareSpeakers) || healthcareSpeakers.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No healthcare AI speakers found. Please check back later.</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Popular Healthcare AI Speaking Topics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI in Medical Diagnostics</h3>
              <p className="text-gray-600">
                How artificial intelligence is revolutionizing disease detection, medical imaging analysis, and early
                diagnosis.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Digital Health Transformation</h3>
              <p className="text-gray-600">
                Strategies for healthcare organizations to implement AI-powered digital solutions and improve patient
                outcomes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Precision Medicine & AI</h3>
              <p className="text-gray-600">
                How AI is enabling personalized treatment plans based on individual patient data and genetic profiles.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI in Drug Discovery</h3>
              <p className="text-gray-600">
                Accelerating pharmaceutical research and development through machine learning and predictive analytics.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Healthcare Robotics & Automation</h3>
              <p className="text-gray-600">
                The role of AI-powered robots in surgery, patient care, and hospital operations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ethical AI in Healthcare</h3>
              <p className="text-gray-600">
                Addressing privacy concerns, bias, and ethical considerations in medical AI applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1E68C6]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Book a Healthcare AI Speaker?</h2>
          <p className="text-xl text-white text-opacity-90 mb-8 max-w-3xl mx-auto">
            Our healthcare AI experts are trusted by leading medical conferences, hospitals, pharmaceutical companies,
            and healthcare organizations worldwide.
          </p>
          <Button asChild size="lg" className="bg-white text-[#1E68C6] hover:bg-[#EAEAEE] text-lg px-8 py-4">
            <Link href="/contact?source=healthcare_industry_page&industry=Healthcare">Contact Us for Availability</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
