import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSpeakersByIndustry } from "@/lib/speakers-data"
import { SpeakerCard } from "@/components/speaker-card"
import { Brain, Zap, Target, TrendingUp, Shield, Users, Globe, Lightbulb } from "lucide-react"

export const metadata: Metadata = {
  title: "AI Keynote Speakers | Top Artificial Intelligence Speakers | Speak About AI",
  description:
    "Book the world's leading AI keynote speakers for your conference or corporate event. Expert artificial intelligence speakers covering machine learning, deep learning, and AI transformation.",
  keywords:
    "ai keynote speakers, artificial intelligence speakers, ai conference speakers, machine learning speakers, ai transformation speakers, technology keynote speakers",
}

export default async function AIKeynoteSpeakersPage() {
  const aiSpeakers = await getSpeakersByIndustry("Technology")

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1E68C6] to-[#5084C6] py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">AI Keynote Speakers</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
              The world's most sought-after artificial intelligence experts and thought leaders for your next
              conference, corporate event, or summit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-[#1E68C6] hover:bg-gray-100 text-lg px-8 py-4">
                <Link href="/contact?source=ai_keynote_speakers&industry=AI">Book an AI Speaker Today</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#1E68C6] text-lg px-8 py-4"
              >
                <Link href="/speakers">Browse All Speakers</Link>
              </Button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Why Book an AI Keynote Speaker?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Brain className="w-6 h-6 mr-3 mt-1 text-blue-200" />
                  <span>Cutting-edge insights on AI trends and breakthroughs</span>
                </div>
                <div className="flex items-start">
                  <Zap className="w-6 h-6 mr-3 mt-1 text-blue-200" />
                  <span>Practical strategies for AI implementation</span>
                </div>
                <div className="flex items-start">
                  <Target className="w-6 h-6 mr-3 mt-1 text-blue-200" />
                  <span>Industry-specific AI applications and use cases</span>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="w-6 h-6 mr-3 mt-1 text-blue-200" />
                  <span>Future predictions and market opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            World-Class AI Keynote Speakers
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            From Silicon Valley pioneers to global AI researchers, our speakers have shaped the artificial intelligence
            landscape and continue to drive innovation forward.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(aiSpeakers) &&
              aiSpeakers.map((speaker) => (
                <SpeakerCard
                  key={speaker.slug}
                  speaker={speaker}
                  contactSource="ai_keynote_speakers"
                  maxTopicsToShow={3}
                />
              ))}
          </div>

          {(!Array.isArray(aiSpeakers) || aiSpeakers.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Loading our world-class AI speakers...</p>
              <Button asChild className="bg-[#1E68C6] hover:bg-[#5084C6]">
                <Link href="/speakers">View All Speakers</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* AI Topics Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Popular AI Keynote Topics</h2>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Our AI speakers cover the full spectrum of artificial intelligence, from foundational concepts to
            cutting-edge applications.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Brain className="w-12 h-12 text-[#1E68C6] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Machine Learning & Deep Learning</h3>
              <p className="text-gray-600">
                Foundational AI technologies, neural networks, and advanced algorithms driving today's AI revolution.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Zap className="w-12 h-12 text-[#1E68C6] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Generative AI & Large Language Models</h3>
              <p className="text-gray-600">
                ChatGPT, GPT-4, and the transformative power of generative artificial intelligence in business and
                society.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Target className="w-12 h-12 text-[#1E68C6] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Strategy & Implementation</h3>
              <p className="text-gray-600">
                Practical frameworks for adopting AI in organizations, from pilot projects to enterprise-wide
                deployment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <TrendingUp className="w-12 h-12 text-[#1E68C6] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">The Future of AI</h3>
              <p className="text-gray-600">
                Predictions, trends, and emerging technologies that will shape the next decade of artificial
                intelligence.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Shield className="w-12 h-12 text-[#1E68C6] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Ethics & Responsible AI</h3>
              <p className="text-gray-600">
                Addressing bias, fairness, transparency, and the societal implications of artificial intelligence
                systems.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-[#1E68C6] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI & the Future of Work</h3>
              <p className="text-gray-600">
                How artificial intelligence is transforming jobs, skills, and the workplace of tomorrow.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Globe className="w-12 h-12 text-[#1E68C6] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI in Industry Applications</h3>
              <p className="text-gray-600">
                Real-world AI use cases across healthcare, finance, manufacturing, retail, and other key industries.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Lightbulb className="w-12 h-12 text-[#1E68C6] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Innovation & Entrepreneurship</h3>
              <p className="text-gray-600">
                Building AI startups, fostering innovation, and creating breakthrough AI products and services.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Brain className="w-12 h-12 text-[#1E68C6] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Conversational AI & Voice Technology</h3>
              <p className="text-gray-600">
                Chatbots, virtual assistants, and the evolution of human-computer interaction through natural language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Perfect for Any AI Event</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "AI Conferences",
              "Technology Summits",
              "Corporate Events",
              "Innovation Forums",
              "Executive Retreats",
              "Industry Conventions",
              "Academic Symposiums",
              "Startup Events",
              "Digital Transformation Meetings",
              "Leadership Conferences",
              "Future of Work Events",
              "Ethics & AI Panels",
            ].map((eventType) => (
              <div
                key={eventType}
                className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">{eventType}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#1E68C6] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">World-Class AI Speakers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-200">Successful Events</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Countries Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-200">AI-Focused Expertise</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Book an AI Keynote Speaker?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your event with insights from the world's leading artificial intelligence experts. Our speakers
            have shaped the AI industry and continue to drive innovation forward.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#1E68C6] hover:bg-[#5084C6] text-lg px-8 py-4">
              <Link href="/contact?source=ai_keynote_speakers&industry=AI">Get Speaker Recommendations</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4"
            >
              <Link href="/speakers">Browse All AI Speakers</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
