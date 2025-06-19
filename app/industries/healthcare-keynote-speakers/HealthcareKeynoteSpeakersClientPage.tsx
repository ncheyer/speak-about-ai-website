"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SpeakerCard } from "@/components/speaker-card"
import { Brain, Stethoscope, ShieldCheck } from "lucide-react"
import type { स्पीकर } from "@/lib/speakers-data"

interface HealthcareKeynoteSpeakersClientPageProps {
  initialSpeakers: स्पीकर[]
}

const benefits = [
  {
    icon: <Brain className="w-8 h-8 text-blue-600" />,
    title: "Cutting-Edge AI Insights",
    description: "Our speakers are at the forefront of AI in healthcare, sharing the latest breakthroughs.",
  },
  {
    icon: <Stethoscope className="w-8 h-8 text-blue-600" />,
    title: "Clinical & Research Expertise",
    description: "Gain perspectives from experts with real-world clinical and research experience.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
    title: "Ethical & Regulatory Guidance",
    description: "Navigate the complex ethical and regulatory landscape of AI in medicine.",
  },
]

const textSections = [
  {
    title: "The AI Revolution in Healthcare",
    content:
      "Artificial intelligence is no longer a futuristic concept in healthcare; it's a present-day reality transforming diagnostics, treatment, patient care, and operational efficiency. From AI-powered medical imaging that detects diseases earlier and more accurately, to machine learning algorithms predicting patient risk and personalizing treatment plans, AI is reshaping every facet of the medical field. Our keynote speakers delve into these transformative applications, offering your audience a clear view of AI's current impact and future potential in healthcare.",
  },
  {
    title: "Navigating Challenges and Opportunities",
    content:
      "While the promise of AI in healthcare is immense, its integration comes with unique challenges: data privacy, algorithmic bias, regulatory hurdles, and the need for new skills among healthcare professionals. Our experts provide actionable strategies for overcoming these obstacles, ensuring ethical AI deployment, and fostering innovation. They illuminate how organizations can harness AI to improve patient outcomes, reduce costs, and empower medical staff, turning challenges into opportunities for growth and advancement.",
  },
  {
    title: "Future-Proofing Your Healthcare Organization",
    content:
      "Staying ahead in the rapidly evolving healthcare landscape requires a deep understanding of emerging AI technologies and their strategic implications. Our speakers equip your audience with the foresight needed to future-proof their organizations. They discuss the long-term vision for AI in healthcare, including advancements in areas like robotic surgery, drug discovery, mental health, and preventative care. Learn how to build a culture of innovation and adapt to the AI-driven future of medicine.",
  },
]

export default function HealthcareKeynoteSpeakersClientPage({
  initialSpeakers,
}: HealthcareKeynoteSpeakersClientPageProps) {
  const [speakers] = useState<स्पीकर[]>(initialSpeakers || [])

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">AI in Healthcare Keynote Speakers</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-10">
            Book world-renowned AI experts, medical innovators, and digital health visionaries to inspire and educate
            your audience on the transformative power of artificial intelligence in healthcare.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-10 py-7" asChild>
            <Link href="/contact?source=healthcare_keynote_speakers_hero">Book a Speaker</Link>
          </Button>
        </div>
      </section>

      {/* "Why Choose Our Healthcare Keynote Speakers?" Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose Our Healthcare Keynote Speakers?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our speakers offer unparalleled insights into the intersection of AI and medicine, tailored for diverse
              audiences from medical professionals to industry stakeholders.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Text Sections Container */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-blue-800 to-blue-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
          {textSections.map((section, index) => (
            <div key={index}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{section.title}</h2>
              <p className="text-lg md:text-xl leading-relaxed text-blue-50">{section.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Healthcare Keynote Speakers Section */}
      {speakers && speakers.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Healthcare Keynote Speakers</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Meet some of our leading experts shaping the future of AI in healthcare.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {speakers.map((speaker) => (
                <SpeakerCard key={speaker.slug} speaker={speaker} contactSource="healthcare_featured" />
              ))}
            </div>
            <div className="text-center mt-12 md:mt-16">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                asChild
              >
                <Link href="/speakers?industry=healthcare">View All Healthcare AI Speakers</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Healthcare Event?</h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Connect with our team to find the perfect AI in healthcare keynote speaker who can provide transformative
            insights and inspire your audience.
          </p>
          <Button
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold text-lg px-10 py-7 shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <Link href="/contact?source=healthcare_keynote_speakers_cta">Book My Healthcare Keynote Speaker</Link>
          </Button>
        </div>
      </section>

      {/* Final Paragraph Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-700">
            Speak About AI is your premier partner for accessing top-tier talent in the field of artificial intelligence
            for healthcare. Our rigorous vetting process ensures that every speaker we represent is not only an expert
            in their domain but also an engaging and impactful presenter. Let us help you make your next event
            unforgettable.
          </p>
        </div>
      </section>
    </div>
  )
}
