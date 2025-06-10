"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Linkedin,
  MapPin,
  DollarSign,
  Mail,
  Play,
  ImageIcon,
  Award,
} from "lucide-react"
import Link from "next/link"
import type { Speaker } from "@/lib/speakers-data"

interface SpeakerProfileProps {
  speaker: Speaker
}

export default function SpeakerProfile({ speaker }: SpeakerProfileProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<"overview" | "videos" | "gallery" | "experience">("overview")

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Mock data for videos, gallery, and experience - in real implementation, this would come from the speaker data
  const mockVideos = [
    {
      id: 1,
      title: "AI and the Future of Work",
      thumbnail: "/placeholder.svg?height=200&width=350",
      duration: "18:42",
      event: "TechCrunch Disrupt 2024",
      description: "Exploring how artificial intelligence will reshape the workplace and create new opportunities.",
    },
    {
      id: 2,
      title: "Building Ethical AI Systems",
      thumbnail: "/placeholder.svg?height=200&width=350",
      duration: "25:15",
      event: "AI Ethics Summit 2024",
      description: "A deep dive into the principles and practices of responsible AI development.",
    },
    {
      id: 3,
      title: "Machine Learning in Healthcare",
      thumbnail: "/placeholder.svg?height=200&width=350",
      duration: "32:08",
      event: "HealthTech Conference 2023",
      description: "Real-world applications of ML in medical diagnosis and treatment.",
    },
  ]

  const mockGallery = [
    {
      id: 1,
      image: "/placeholder.svg?height=300&width=400",
      caption: "Keynote at Google I/O 2024",
      event: "Google I/O 2024",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=300&width=400",
      caption: "Panel discussion at MIT AI Conference",
      event: "MIT AI Conference 2024",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=300&width=400",
      caption: "Fireside chat with industry leaders",
      event: "Silicon Valley AI Summit 2023",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=300&width=400",
      caption: "Workshop session on machine learning",
      event: "Stanford AI Workshop 2023",
    },
    {
      id: 5,
      image: "/placeholder.svg?height=300&width=400",
      caption: "Speaking at Fortune 500 executive retreat",
      event: "Fortune 500 Executive Retreat 2024",
    },
    {
      id: 6,
      image: "/placeholder.svg?height=300&width=400",
      caption: "Virtual presentation to global audience",
      event: "Global AI Summit 2024",
    },
  ]

  const mockExperience = {
    totalEvents: 150,
    yearsExperience: 8,
    audienceSize: "50 - 10,000+",
    languages: ["English", "Spanish"],
    recentEvents: [
      {
        event: "Google I/O 2024",
        role: "Keynote Speaker",
        audience: "8,000+ attendees",
        topic: "The Future of AI in Consumer Technology",
      },
      {
        event: "MIT AI Conference 2024",
        role: "Panel Moderator",
        audience: "1,200 attendees",
        topic: "Ethics in AI Development",
      },
      {
        event: "Fortune 500 Executive Retreat",
        role: "Workshop Facilitator",
        audience: "50 executives",
        topic: "AI Strategy for Business Leaders",
      },
      {
        event: "Stanford AI Workshop 2023",
        role: "Technical Presenter",
        audience: "300 researchers",
        topic: "Advanced Machine Learning Techniques",
      },
    ],
    testimonials: [
      {
        quote: "An absolutely brilliant presentation that transformed how our team thinks about AI implementation.",
        author: "Sarah Chen",
        title: "CTO, TechCorp",
        event: "TechCorp Annual Summit 2024",
      },
      {
        quote: "Engaging, insightful, and practical. Our audience was captivated from start to finish.",
        author: "Michael Rodriguez",
        title: "Event Director, Innovation Conference",
        event: "Innovation Conference 2023",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Speaker Image */}
              <div className="bg-gray-200 p-8 lg:p-12 flex items-center justify-center">
                <img
                  src={speaker.image || "/placeholder.svg?height=400&width=400"}
                  alt={speaker.name}
                  className="w-full max-w-md h-auto rounded-2xl object-cover"
                />
              </div>

              {/* Speaker Info */}
              <div className="p-8 lg:p-12">
                <h1 className="text-4xl lg:text-5xl font-bold text-black mb-4 leading-tight">{speaker.name}</h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">{speaker.title}</p>

                {/* Quick Info */}
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {speaker.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3 text-[#1E68C6]" />
                      <span>{speaker.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-5 h-5 mr-3 text-[#1E68C6]" />
                    <span>{speaker.fee || "Please Inquire"}</span>
                  </div>
                  {speaker.contact && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-3 text-[#1E68C6]" />
                      <span>Contact: {speaker.contact}</span>
                    </div>
                  )}
                </div>

                {/* Expertise Tags */}
                {speaker.expertise && speaker.expertise.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-black mb-3">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {speaker.expertise.map((skill, index) => (
                        <Badge key={index} className="bg-[#1E68C6] text-white">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Industries */}
                {speaker.industries && speaker.industries.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-black mb-3">Industries</h3>
                    <div className="flex flex-wrap gap-2">
                      {speaker.industries.map((industry, index) => (
                        <Badge key={index} variant="secondary">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  className="btn-primary w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-semibold py-4 px-8 rounded-full mb-6"
                  data-button="primary"
                  style={{
                    backgroundColor: "#1E68C6",
                    color: "white",
                    border: "none",
                  }}
                >
                  <Link href="/contact" className="text-white no-underline">
                    Check Availability
                  </Link>
                </button>

                {/* Social Links */}
                {(speaker.linkedin || speaker.website) && (
                  <div className="flex gap-4">
                    {speaker.linkedin && (
                      <a
                        href={speaker.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-[#1E68C6] hover:text-[#5084C6]"
                      >
                        <Linkedin className="w-5 h-5 mr-2" />
                        LinkedIn
                      </a>
                    )}
                    {speaker.website && (
                      <a
                        href={speaker.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-[#1E68C6] hover:text-[#5084C6]"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Website
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content Section */}
        <Card className="mt-8 bg-white rounded-3xl shadow-lg">
          <CardContent className="p-0">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8 pt-8">
                {[
                  { id: "overview", label: "Overview", icon: null },
                  { id: "videos", label: "Speaking Videos", icon: Play },
                  { id: "gallery", label: "Photo Gallery", icon: ImageIcon },
                  { id: "experience", label: "Speaking Experience", icon: Award },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-[#1E68C6] text-[#1E68C6]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.icon && <tab.icon className="w-4 h-4 mr-2" />}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">About {speaker.name}</h2>
                  <p className="text-gray-600 leading-relaxed text-lg mb-8">{speaker.bio}</p>

                  {/* Expandable Sections */}
                  <div className="space-y-4">
                    {/* Suggested Speaker Programs */}
                    {speaker.programs && speaker.programs.length > 0 && (
                      <div className="border-b border-gray-200">
                        <button
                          onClick={() => toggleSection("programs")}
                          className="w-full flex items-center justify-between py-4 text-left"
                        >
                          <span className="text-lg font-semibold text-black">Suggested Speaker Programs</span>
                          {expandedSections.programs ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        {expandedSections.programs && (
                          <div className="pb-4">
                            <ul className="space-y-2">
                              {speaker.programs.map((program, index) => (
                                <li key={index} className="text-gray-600">
                                  • {program}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Speaker Fee */}
                    <div className="border-b border-gray-200">
                      <button
                        onClick={() => toggleSection("fee")}
                        className="w-full flex items-center justify-between py-4 text-left"
                      >
                        <span className="text-lg font-semibold text-black">Speaker Fee</span>
                        {expandedSections.fee ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {expandedSections.fee && (
                        <div className="pb-4">
                          <p className="text-gray-600">{speaker.fee || "Please Inquire"}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Fees may vary based on event location, duration, and specific requirements.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Primary Location */}
                    {speaker.location && (
                      <div className="border-b border-gray-200">
                        <button
                          onClick={() => toggleSection("location")}
                          className="w-full flex items-center justify-between py-4 text-left"
                        >
                          <span className="text-lg font-semibold text-black">Primary Location</span>
                          {expandedSections.location ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        {expandedSections.location && (
                          <div className="pb-4">
                            <p className="text-gray-600">{speaker.location}</p>
                            <p className="text-sm text-gray-500 mt-2">Available for virtual and in-person events</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "videos" && (
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Speaking Videos</h2>
                  <p className="text-gray-600 mb-8">Watch {speaker.name} in action at recent speaking engagements.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockVideos.map((video) => (
                      <Card key={video.id} className="group hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-0">
                          <div className="relative">
                            <img
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={video.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Play className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                              {video.duration}
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                            <p className="text-sm text-[#1E68C6] mb-2">{video.event}</p>
                            <p className="text-sm text-gray-600">{video.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "gallery" && (
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Photo Gallery</h2>
                  <p className="text-gray-600 mb-8">See {speaker.name} speaking at various events and conferences.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockGallery.map((photo) => (
                      <Card key={photo.id} className="group hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden">
                            <img
                              src={photo.image || "/placeholder.svg"}
                              alt={photo.caption}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-1">{photo.caption}</h3>
                            <p className="text-sm text-[#1E68C6]">{photo.event}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "experience" && (
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Speaking Experience</h2>

                  {/* Experience Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-[#1E68C6] mb-2">{mockExperience.totalEvents}+</div>
                      <div className="text-sm text-gray-600">Speaking Events</div>
                    </div>
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-[#1E68C6] mb-2">{mockExperience.yearsExperience}</div>
                      <div className="text-sm text-gray-600">Years Experience</div>
                    </div>
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-[#1E68C6] mb-2">{mockExperience.audienceSize}</div>
                      <div className="text-sm text-gray-600">Audience Size</div>
                    </div>
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-[#1E68C6] mb-2">{mockExperience.languages.length}</div>
                      <div className="text-sm text-gray-600">Languages</div>
                    </div>
                  </div>

                  {/* Recent Events */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-black mb-4">Recent Speaking Engagements</h3>
                    <div className="space-y-4">
                      {mockExperience.recentEvents.map((event, index) => (
                        <Card key={index} className="border-l-4 border-[#1E68C6]">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-900">{event.event}</h4>
                              <Badge variant="secondary">{event.role}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{event.topic}</p>
                            <p className="text-sm text-[#1E68C6]">{event.audience}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Testimonials */}
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-4">Client Testimonials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mockExperience.testimonials.map((testimonial, index) => (
                        <Card key={index} className="bg-gray-50">
                          <CardContent className="p-6">
                            <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                            <div>
                              <p className="font-semibold text-gray-900">{testimonial.author}</p>
                              <p className="text-sm text-gray-600">{testimonial.title}</p>
                              <p className="text-sm text-[#1E68C6]">{testimonial.event}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
