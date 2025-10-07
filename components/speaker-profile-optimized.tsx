"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Linkedin, Globe, Mail, ArrowLeft, Play, Quote, Building, Award, Calendar, CheckCircle } from "lucide-react"
import type { Speaker } from "@/lib/speakers-data"

interface OptimizedSpeakerProfileProps {
  speaker: Speaker
}

const OptimizedSpeakerProfile: React.FC<OptimizedSpeakerProfileProps> = ({ speaker }) => {
  const imageUrl = speaker.image || "/placeholder.svg"
  
  // Format bio with proper paragraphs
  const formatBio = (bio: string) => {
    if (!bio) return null
    const paragraphs = bio.split(/\n\s*\n/).filter((p) => p.trim())
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-700 leading-relaxed text-lg">
        {paragraph.trim()}
      </p>
    ))
  }

  // Generate breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://speakabout.ai"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "AI Speakers",
        "item": "https://speakabout.ai/speakers"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": speaker.name,
        "item": `https://speakabout.ai/speakers/${speaker.slug}`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className="min-h-screen bg-white">
        {/* Breadcrumb Navigation */}
        <nav className="bg-gray-50 py-4 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li><Link href="/" className="text-gray-500 hover:text-[#1E68C6]">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/speakers" className="text-gray-500 hover:text-[#1E68C6]">AI Speakers</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-semibold">{speaker.name}</li>
            </ol>
          </div>
        </nav>

        {/* Hero Section with H1 */}
        <section className="bg-gradient-to-br from-gray-50 to-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left: Image and Quick Info */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <Card className="shadow-xl border-0 overflow-hidden">
                    <div className="relative">
                      <img
                        src={imageUrl}
                        alt={`${speaker.name} - AI Keynote Speaker`}
                        className="w-full h-96 object-cover"
                        loading="eager"
                      />
                      {speaker.fee && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full">
                          <span className="font-bold text-gray-900">{speaker.fee}</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <Button
                        asChild
                        variant="gold"
                        size="lg"
                        className="w-full font-semibold"
                      >
                        <Link href={`/contact?speaker=${encodeURIComponent(speaker.name)}`}>
                          Book {speaker.name.split(' ')[0]} Now
                        </Link>
                      </Button>
                      
                      {/* Quick Info */}
                      <div className="mt-6 space-y-3">
                        {speaker.location && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-[#1E68C6]" />
                            <span>{speaker.location}</span>
                          </div>
                        )}
                        {speaker.languages && speaker.languages.length > 0 && (
                          <div className="flex items-center text-gray-600">
                            <Globe className="w-4 h-4 mr-2 text-[#1E68C6]" />
                            <span>{speaker.languages.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {/* Social Links */}
                      <div className="flex justify-center space-x-4 mt-6 pt-6 border-t">
                        {speaker.linkedin && (
                          <a href={speaker.linkedin} target="_blank" rel="noopener noreferrer"
                             className="text-gray-500 hover:text-[#1E68C6]">
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {speaker.website && (
                          <a href={speaker.website} target="_blank" rel="noopener noreferrer"
                             className="text-gray-500 hover:text-[#1E68C6]">
                            <Globe className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right: Main Content with Proper H Tags */}
              <div className="lg:col-span-2">
                {/* H1 - Main Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {speaker.name} - {speaker.title || 'AI Keynote Speaker'}
                </h1>
                
                {/* Subtitle with keywords */}
                <p className="text-xl text-gray-600 mb-6">
                  Book {speaker.name} for inspiring keynote speeches on{' '}
                  {speaker.expertise?.slice(0, 3).join(', ') || 'artificial intelligence and innovation'}
                </p>

                {/* Industry Badges - Only show if data exists */}
                {speaker.industries && speaker.industries.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {speaker.industries.map((industry, index) => (
                      <Badge key={index} className="bg-[#1E68C6] text-white">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* H2: About Section - Only show if bio exists */}
                {speaker.bio && (
                  <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <Award className="w-8 h-8 mr-3 text-[#1E68C6]" />
                      About {speaker.name}
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      {formatBio(speaker.bio)}
                    </div>
                  </section>
                )}

                {/* H2: Keynote Speaking Topics */}
                {speaker.topics && speaker.topics.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Keynote Speaking Topics
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {speaker.topics.map((topic, index) => (
                        <div key={index} className="border-l-4 border-[#1E68C6] pl-4">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{topic}</h3>
                          <p className="text-gray-600">
                            Expert insights on {topic.toLowerCase()} for your audience
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* H2: Why Book This Speaker - Show if we have title or expertise */}
                {(speaker.title || speaker.expertise) && (
                  <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Why Book {speaker.name}?
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="p-6 border-[#1E68C6] border-2">
                        <h3 className="text-xl font-semibold mb-3 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                          Proven Expertise
                        </h3>
                        <p className="text-gray-600">
                          {speaker.title || 'Leading AI expert'} with deep knowledge in{' '}
                          {speaker.expertise?.slice(0, 2).join(' and ') || 'artificial intelligence'}
                        </p>
                      </Card>
                      <Card className="p-6 border-[#1E68C6] border-2">
                        <h3 className="text-xl font-semibold mb-3 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                          Engaging Speaker
                        </h3>
                        <p className="text-gray-600">
                          Delivers actionable insights that inspire and educate audiences worldwide
                        </p>
                      </Card>
                    </div>
                  </section>
                )}

                {/* H2: Speaking Programs */}
                {speaker.programs && speaker.programs.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Available Speaking Programs
                    </h2>
                    <ul className="space-y-4">
                      {speaker.programs.map((program, index) => (
                        <li key={index} className="flex items-start">
                          <Calendar className="w-5 h-5 mr-3 mt-1 text-[#1E68C6] flex-shrink-0" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{program}</h3>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* H2: Videos & Media */}
                {speaker.videos && speaker.videos.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <Play className="w-8 h-8 mr-3 text-[#1E68C6]" />
                      Speaker Videos & Media
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {speaker.videos.map((video, index) => (
                        <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <iframe
                            src={video.url}
                            title={video.title}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Minimal Content Fallback - Show if we have very little data */}
                {!speaker.bio && (!speaker.topics || speaker.topics.length === 0) && !speaker.programs && (
                  <section className="mb-12 bg-gray-50 rounded-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      About {speaker.name}
                    </h2>
                    <p className="text-lg text-gray-700 mb-4">
                      {speaker.name} is a renowned speaker specializing in artificial intelligence and emerging technologies. 
                      With expertise in {speaker.expertise?.join(', ') || 'AI innovation'}, {speaker.name} delivers 
                      compelling keynote presentations that inspire and educate audiences worldwide.
                    </p>
                    <p className="text-lg text-gray-700">
                      Contact Speak About AI to learn more about booking {speaker.name} for your next event.
                    </p>
                  </section>
                )}

                {/* H2: Book This Speaker CTA - Always show */}
                <section className="bg-gradient-to-r from-[#1E68C6] to-[#5084C6] rounded-xl p-8 text-white">
                  <h2 className="text-3xl font-bold mb-4">
                    Book {speaker.name} for Your Next Event
                  </h2>
                  <p className="text-xl mb-6 opacity-95">
                    Transform your event with insights on AI and {speaker.expertise?.[0]?.toLowerCase() || 'innovation'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      asChild
                      size="lg"
                      variant="gold"
                      className="font-bold text-lg"
                    >
                      <Link href={`/contact?speaker=${encodeURIComponent(speaker.name)}`}>
                        Check Availability & Pricing
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="bg-white text-[#1E68C6] hover:bg-gray-100"
                    >
                      <Link href="/speakers">
                        Browse Other Speakers
                      </Link>
                    </Button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold mb-4">
                Frequently Asked Questions About Booking {speaker.name}
              </h2>
              <h3 className="text-xl font-semibold mt-6">
                What is {speaker.name}'s speaking fee?
              </h3>
              <p>
                {speaker.name}'s speaking fee is {speaker.fee || 'available upon request'}. 
                Final pricing depends on event location, date, and specific requirements.
              </p>
              <h3 className="text-xl font-semibold mt-6">
                What topics does {speaker.name} speak about?
              </h3>
              <p>
                {speaker.name} specializes in {speaker.topics?.slice(0, 3).join(', ') || 'AI and technology topics'}, 
                delivering customized presentations for your audience.
              </p>
              <h3 className="text-xl font-semibold mt-6">
                Is {speaker.name} available for virtual events?
              </h3>
              <p>
                Yes, {speaker.name} is available for both in-person and virtual keynote presentations worldwide.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default OptimizedSpeakerProfile