"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { SpeakerCard } from "@/components/speaker-card"
import {
  Heart,
  Brain,
  Stethoscope,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Globe,
  Building2,
  Briefcase,
  GraduationCap,
  Activity,
} from "lucide-react"

interface Speaker {
  [key: string]: any
}

interface HealthcareAISpeakersClientPageProps {
  speakers: Speaker[]
}

export default function HealthcareAISpeakersClientPage({ speakers }: HealthcareAISpeakersClientPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Healthcare AI Speakers</h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Transform your medical conference with leading healthcare AI experts who are revolutionizing patient care,
              medical diagnostics, and digital health innovation across top hospitals and healthcare systems worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Link href="/contact?source=healthcare_speakers_page">Book Healthcare AI Speakers</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3"
              >
                <Link href="/speakers">View All Speakers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Healthcare AI Speakers</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our healthcare AI speakers are medical professionals, researchers, and technology leaders who are at the
              forefront of digital health transformation at leading medical institutions and healthcare organizations.
            </p>
          </div>

          {speakers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {speakers.map((speaker) => (
                <SpeakerCard
                  key={speaker.slug}
                  speaker={speaker}
                  contactSource="healthcare_industry_page"
                  maxTopicsToShow={3}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading healthcare AI speakers...</p>
            </div>
          )}
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Healthcare AI Speaking Topics</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our healthcare speakers cover the full spectrum of medical AI applications, from diagnostic tools to
              patient care innovations and healthcare system transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI in Medical Diagnostics",
                description: "Machine learning for disease detection, medical imaging analysis, and early diagnosis",
              },
              {
                icon: Heart,
                title: "Digital Health Transformation",
                description: "Healthcare system modernization and AI-powered patient care solutions",
              },
              {
                icon: Stethoscope,
                title: "Precision Medicine & AI",
                description: "Personalized treatment plans using AI and genetic profiling",
              },
              {
                icon: Shield,
                title: "AI in Drug Discovery",
                description: "Accelerating pharmaceutical research through machine learning and predictive analytics",
              },
              {
                icon: Activity,
                title: "Healthcare Robotics & Automation",
                description: "AI-powered surgical robots and automated hospital operations",
              },
              {
                icon: Users,
                title: "Ethical AI in Healthcare",
                description: "Privacy, bias, and ethical considerations in medical AI applications",
              },
              {
                icon: TrendingUp,
                title: "Healthcare Data Analytics",
                description: "Population health insights and predictive healthcare modeling",
              },
              {
                icon: Globe,
                title: "Telemedicine & Remote Care",
                description: "AI-enhanced virtual care and remote patient monitoring",
              },
              {
                icon: Zap,
                title: "Healthcare Innovation Strategy",
                description: "Implementing AI solutions in healthcare organizations",
              },
            ].map((topic, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <topic.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{topic.title}</h3>
                  <p className="text-gray-600">{topic.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Healthcare Organizations We Serve</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our healthcare AI speakers have delivered transformational insights across diverse medical organizations,
              helping them navigate digital health innovation and AI implementation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, name: "Hospital Systems" },
              { icon: Heart, name: "Medical Centers" },
              { icon: Briefcase, name: "Healthcare Consulting" },
              { icon: Shield, name: "Pharmaceutical Companies" },
              { icon: GraduationCap, name: "Medical Schools" },
              { icon: Users, name: "Healthcare Conferences" },
              { icon: Globe, name: "Digital Health Startups" },
              { icon: Activity, name: "Medical Device Companies" },
              { icon: TrendingUp, name: "Health Insurance" },
              { icon: Zap, name: "Biotech Firms" },
              { icon: Stethoscope, name: "Clinical Research" },
              { icon: Brain, name: "Healthcare AI Companies" },
            ].map((industry, index) => (
              <div key={index} className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <industry.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{industry.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Healthcare Event?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Connect with our healthcare AI experts who are trusted by leading medical institutions, hospitals, and
            healthcare organizations worldwide to deliver cutting-edge insights on the future of medicine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              <Link href="/contact?source=healthcare_speakers_cta">Get Speaker Recommendations</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
            >
              <Link href="/speakers">Browse All Healthcare Speakers</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
