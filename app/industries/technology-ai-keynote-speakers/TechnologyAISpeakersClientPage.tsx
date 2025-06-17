"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SpeakerCard } from "@/components/speaker-card"

interface Speaker {
  slug: string
  name: string
  title: string
  company: string
  bio: string
  image: string
  industries: string[]
  topics: string[]
  keynoteFee?: string
  travelRequirements?: string
  bookingRequirements?: string
  notableClients?: string[]
  mediaLinks?: {
    type: string
    url: string
    title: string
  }[]
}

interface TechnologyAISpeakersClientPageProps {
  speakers: Speaker[]
}

export default function TechnologyAISpeakersClientPage({ speakers }: TechnologyAISpeakersClientPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#EAEAEE] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Technology & Enterprise AI Speakers</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading artificial intelligence experts specializing in enterprise technology transformation, digital
              innovation, and AI implementation at scale.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Book a Technology & Enterprise AI Speaker?</h2>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start">
                  <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                  <span>Understand how AI is transforming enterprise operations and business models</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                  <span>Learn practical strategies for implementing AI solutions in large organizations</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                  <span>Discover the latest trends in cloud computing, machine learning, and automation</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                  <span>Navigate the challenges of digital transformation and technology adoption</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-[#1E68C6] hover:bg-[#5084C6]">
                <Link href="/contact?source=technology_industry_page&industry=Technology">
                  Book a Technology AI Speaker
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Technology & Enterprise AI Keynote Speakers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(speakers) &&
              speakers.map((speaker) => (
                <SpeakerCard
                  key={speaker.slug}
                  speaker={speaker}
                  contactSource="technology_industry_page"
                  showTopics={true}
                  maxTopics={3}
                />
              ))}
          </div>

          {(!Array.isArray(speakers) || speakers.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No technology AI speakers found. Please check back later.</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Popular Technology & Enterprise AI Speaking Topics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Driven Digital Transformation</h3>
              <p className="text-gray-600">
                How artificial intelligence is reshaping business processes, customer experiences, and organizational
                structures in the digital age.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise AI Implementation</h3>
              <p className="text-gray-600">
                Practical strategies for deploying AI solutions at scale, including governance, ethics, and change
                management.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cloud AI & Machine Learning Platforms</h3>
              <p className="text-gray-600">
                Leveraging cloud-based AI services and ML platforms to accelerate innovation and reduce time-to-market.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Automation & Intelligent Process Optimization</h3>
              <p className="text-gray-600">
                Using AI to automate complex workflows, optimize operations, and improve efficiency across enterprise
                systems.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Data Strategy & AI Analytics</h3>
              <p className="text-gray-600">
                Building data-driven organizations with AI-powered analytics, predictive modeling, and business
                intelligence.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">The Future of Work & AI</h3>
              <p className="text-gray-600">
                How artificial intelligence is changing the workplace, job roles, and the skills needed for the future
                workforce.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Ethics & Responsible Innovation</h3>
              <p className="text-gray-600">
                Implementing ethical AI practices, ensuring fairness, transparency, and accountability in enterprise AI
                systems.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cybersecurity & AI</h3>
              <p className="text-gray-600">
                Using artificial intelligence to enhance cybersecurity defenses while addressing new AI-related security
                challenges.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Customer Experience</h3>
              <p className="text-gray-600">
                Transforming customer interactions through chatbots, personalization engines, and intelligent customer
                service solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Served Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Industries We Serve</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "Software & SaaS",
              "Cloud Computing",
              "Telecommunications",
              "E-commerce",
              "Fintech",
              "Cybersecurity",
              "Data Analytics",
              "IoT & Edge Computing",
              "DevOps & Infrastructure",
              "Enterprise Software",
              "Digital Marketing",
              "IT Services",
            ].map((industry) => (
              <div key={industry} className="text-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1E68C6]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Book a Technology & Enterprise AI Speaker?</h2>
          <p className="text-xl text-white text-opacity-90 mb-8 max-w-3xl mx-auto">
            Our technology AI experts are trusted by Fortune 500 companies, tech conferences, and innovation summits
            worldwide. Transform your event with cutting-edge insights.
          </p>
          <Button asChild size="lg" className="bg-white text-[#1E68C6] hover:bg-[#EAEAEE] text-lg px-8 py-4">
            <Link href="/contact?source=technology_industry_page&industry=Technology">Contact Us for Availability</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
