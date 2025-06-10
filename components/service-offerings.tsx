"use client"

import { Zap } from "lucide-react"

const ServiceOfferings = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Keynote Speeches */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/services/adam-cheyer-stadium.jpg" alt="Keynote Speeches" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Keynote Speeches</h3>
              <p className="text-gray-700">
                Inspire your audience with engaging and informative keynote speeches on the future of technology.
              </p>
            </div>
          </div>

          {/* Panel Discussions */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/services/sharon-zhou-panel.jpg" alt="Panel Discussions" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Panel Discussions</h3>
              <p className="text-gray-700">
                Facilitate insightful and dynamic panel discussions on industry trends and challenges.
              </p>
            </div>
          </div>

          {/* Fireside Chats */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="/services/allie-k-miller-fireside.jpg"
              alt="Fireside Chats"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fireside Chats</h3>
              <p className="text-gray-700">
                Create intimate and engaging conversations with industry leaders in a fireside chat format.
              </p>
            </div>
          </div>

          {/* Workshops */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="/services/tatyana-mamut-speaking.jpg" alt="Workshops" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Workshops</h3>
              <p className="text-gray-700">
                Provide hands-on learning experiences with interactive workshops tailored to your audience's needs.
              </p>
            </div>
          </div>

          {/* Virtual Presentations */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="/services/sharon-zhou-headshot.png"
              alt="Virtual Presentations"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Virtual Presentations</h3>
              <p className="text-gray-700">
                Reach a global audience with engaging and professional virtual presentations.
              </p>
            </div>
          </div>

          {/* Custom Video Content */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="/services/simon-pierro-youtube.jpg"
              alt="Custom Video Content"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Custom Video Content</h3>
              <p className="text-gray-700">
                Create compelling video content for marketing, training, and internal communications.
              </p>
            </div>
          </div>
        </div>

        {/* SprintAI Featured Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 font-neue-haas">
                  SprintAI: One-Day Generative AI Innovation Accelerator
                </h3>
              </div>

              <p className="text-gray-600 mb-6 font-montserrat">
                SprintAI is our flagship workshop offering hosted by Adam Holt, designed to revolutionize your team's
                approach to AI strategy. It's a collaborative innovation sprint where Generative AI and human creativity
                converge to amplify your team's insights and accelerate results—all in a single day.
              </p>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 font-neue-haas">Key Benefits:</h4>
                <ul className="space-y-2">
                  <li className="text-gray-600 flex items-start font-montserrat">
                    <span className="flex-shrink-0 text-orange-600 mr-2">•</span>
                    <span>Accelerated Ideation: Achieve in one day what traditionally takes a week or more</span>
                  </li>
                  <li className="text-gray-600 flex items-start font-montserrat">
                    <span className="flex-shrink-0 text-orange-600 mr-2">•</span>
                    <span>Synergistic Collaboration: AI tools work alongside your team, enhancing human insights</span>
                  </li>
                  <li className="text-gray-600 flex items-start font-montserrat">
                    <span className="flex-shrink-0 text-orange-600 mr-2">•</span>
                    <span>Strategic Focus: AI assists in maintaining alignment with key business objectives</span>
                  </li>
                  <li className="text-gray-600 flex items-start font-montserrat">
                    <span className="flex-shrink-0 text-orange-600 mr-2">•</span>
                    <span>Superior Idea Quality: Generate, iterate, and refine ideas more effectively</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-600 mb-6 font-montserrat">
                Available virtually or in-person for leadership teams of 5 to 20 participants, with two expert
                facilitators guiding you through the day. Tangible outputs include a prioritized idea portfolio, pitch
                deck, innovation metrics, team alignment, and an executive summary.
              </p>

              <a
                href="mailto:human@speakabout.ai"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 font-montserrat"
                style={{
                  backgroundColor: "#ea580c",
                  color: "white",
                }}
                data-button="orange"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#c2410c"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ea580c"
                }}
              >
                Inquire About SprintAI
              </a>
            </div>

            <div className="lg:order-first">
              <div className="relative">
                <img
                  src="/services/sprintai-workshop.png"
                  alt="Adam Holt SprintAI Workshop"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Adam Holt Bio Card */}
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <img
                    src="/services/adam-holt-headshot.png"
                    alt="Adam Holt"
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 font-neue-haas">Adam Holt</h4>
                    <p className="text-[#1E68C6] font-semibold font-montserrat">Innovation Leader</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-montserrat">
                  Adam Holt brings over two decades of innovation leadership experience, having led product and design
                  teams at Wells Fargo Innovation Center, BBVA, and T-Mobile. As Head of Wells Fargo Innovation Center,
                  he built and led a 30-member team of product managers and experience designers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceOfferings
