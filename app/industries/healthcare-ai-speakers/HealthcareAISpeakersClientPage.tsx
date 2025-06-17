"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SpeakerCard } from "@/components/speaker-card"
import { useEffect } from "react"
import type { Speaker } from "@/lib/speakers-data"

interface HealthcareAISpeakersClientPageProps {
  speakers: Speaker[]
}

export default function HealthcareAISpeakersClientPage({ speakers }: HealthcareAISpeakersClientPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
            {Array.isArray(speakers) &&
              speakers.map((speaker) => (
                <SpeakerCard
                  key={speaker.slug}
                  speaker={speaker}
                  contactSource="healthcare_industry_page"
                  maxTopicsToShow={3}
                />
              ))}
          </div>

          {(!Array.isArray(speakers) || speakers.length === 0) && (
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
