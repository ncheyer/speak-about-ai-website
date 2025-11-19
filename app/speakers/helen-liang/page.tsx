"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Linkedin, Globe, Building2, TrendingUp, Play, Award, Briefcase, Sparkles, Users, Target, Rocket, DollarSign } from "lucide-react"

export default function HelenLiangPage() {
  const unicorns = [
    { name: "SpaceX", valuation: "$180B+", description: "Revolutionizing space travel" },
    { name: "Salt Security", valuation: "$1.4B", description: "API Security unicorn" },
    { name: "Jeeves", valuation: "$2.1B", description: "Global fintech platform" },
    { name: "Kapital", valuation: "$1.3B", description: "LATAM fintech unicorn" }
  ]

  const portfolioCompanies = [
    { name: "Universal Quantum", sector: "Deep Tech", description: "Quantum computing" },
    { name: "1910 Genetics", sector: "Biotech", description: "AI-powered drug discovery" },
    { name: "Jericho Security", sector: "Enterprise AI", description: "Security awareness platform" },
    { name: "Solve Intelligence", sector: "Enterprise AI", description: "GenAI co-pilots for IP firms" },
    { name: "Alinea Invest", sector: "Fintech", description: "GenZ investing platform" },
    { name: "Cognito Therapeutics", sector: "Digital Health", description: "Non-invasive neurotherapies" },
    { name: "Meru Health", sector: "Digital Health", description: "Mental health solutions" },
    { name: "Omniscope", sector: "Digital Health", description: "Immune profiling platform" }
  ]

  const speakingTopics = [
    {
      title: "GenAI in Cybersecurity",
      description: "Exploring deepfake threats, API security, and the evolving landscape of AI-powered security solutions",
      icon: "🔒"
    },
    {
      title: "GenAI in Fintech",
      description: "Asset management, neobanking, and supply chain finance transformation through artificial intelligence",
      icon: "💰"
    },
    {
      title: "GenAI in Healthcare",
      description: "Mental health innovations, hospital automation, and neuroscience breakthroughs powered by AI",
      icon: "🏥"
    },
    {
      title: "AI and Robotics",
      description: "The future of robotics OS, World Models, and autonomous systems",
      icon: "🤖"
    },
    {
      title: "3D Chips and Next-Gen Compute",
      description: "3D chip architecture, quantum computing, and the future of computational infrastructure",
      icon: "💻"
    },
    {
      title: "Consumer AI",
      description: "AI devices, multi-agent gaming, and the transformation of consumer experiences",
      icon: "📱"
    }
  ]

  const videos = [
    {
      title: "AI & Robotics Panel at TechCrunch",
      url: "https://www.youtube.com/watch?v=PuSpdRXOieo",
      description: "Investing in Robotics and AI - Lessons from Industry VCs",
      thumbnail: "https://img.youtube.com/vi/PuSpdRXOieo/maxresdefault.jpg"
    },
    {
      title: "Fintech AI Panel Discussion",
      url: "https://www.linkedin.com/posts/leo-naiwen-cui-ph-d-59531439_fintech-aiinfinance-venturecapital-activity-7318645235612332033-9wbK",
      description: "Panel discussion on AI transformation in financial technology",
      thumbnail: "/speakers/helen-liang-techweek-1.jpg"
    }
  ]

  const notableFounders = [
    {
      name: "Diogo Rau",
      company: "Jeeves",
      title: "CEO & Co-Founder",
      achievement: "Featured on Bloomberg",
      link: "https://www.bloomberg.com"
    },
    {
      name: "Rene Saul",
      company: "Kapital",
      title: "CEO & Co-Founder",
      achievement: "Featured on Bloomberg and Forbes",
      link: "https://www.bloomberg.com"
    },
    {
      name: "Roey Eliyahu",
      company: "Salt Security",
      title: "CEO & Co-Founder",
      achievement: "Featured on Forbes",
      link: "https://www.forbes.com"
    },
    {
      name: "Chris Parsonson",
      company: "Solve Intelligence",
      title: "CEO & Co-Founder",
      achievement: "Closed $12M Series A",
      link: "#"
    },
    {
      name: "Eve Halimi & Anam Lakhani",
      company: "Alinea Invest",
      title: "Co-Founders",
      achievement: "Closed $10M+ Series A",
      link: "#"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-gray-500 hover:text-[#1E68C6]">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/speakers" className="text-gray-500 hover:text-[#1E68C6]">Speakers</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-semibold">Helen H. Liang, PhD</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Image */}
            <div className="lg:col-span-1">
              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl border-4 border-white/20">
                  <img
                    src="/speakers/helen-liang-techweek-1.jpg"
                    alt="Helen H. Liang, PhD - Venture Capital Leader"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg shadow-xl">
                  <div className="text-2xl font-bold">8 Unicorns</div>
                  <div className="text-sm">In Portfolio</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2">
              <Badge className="mb-4 bg-yellow-400 text-gray-900 text-sm px-4 py-1">
                Featured on WSJ & Business Insider
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Helen H. Liang, PhD
              </h1>
              <p className="text-2xl md:text-3xl text-blue-100 mb-6">
                Silicon Valley Venture Capital Pioneer in GenAI Infrastructure
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Building2 className="w-5 h-5 mr-2" />
                  <span>Founder & Managing Partner, FoundersX Ventures</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Award className="w-5 h-5 mr-2" />
                  <span>Stanford Guest Lecturer</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span>NVIDIA VC Alliance Partner</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Button asChild size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-bold">
                  <Link href="/contact?speaker=Helen H. Liang">
                    Book Helen for Your Event
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20">
                  <a href="https://linkedin.com/in/helen-liang-phd" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-5 h-5 mr-2" />
                    Connect on LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-50 py-8 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#1E68C6]">8</div>
              <div className="text-gray-600 mt-1">Tech Unicorns</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#1E68C6]">25+</div>
              <div className="text-gray-600 mt-1">Companies &gt;$100M</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#1E68C6]">10+</div>
              <div className="text-gray-600 mt-1">Successful Exits</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#1E68C6]">12 Years</div>
              <div className="text-gray-600 mt-1">High-Tech Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-12 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="about" className="data-[state=active]:bg-[#1E68C6] data-[state=active]:text-white">
                About
              </TabsTrigger>
              <TabsTrigger value="topics" className="data-[state=active]:bg-[#1E68C6] data-[state=active]:text-white">
                Speaking Topics
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-[#1E68C6] data-[state=active]:text-white">
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-[#1E68C6] data-[state=active]:text-white">
                Media & Videos
              </TabsTrigger>
              <TabsTrigger value="photos" className="data-[state=active]:bg-[#1E68C6] data-[state=active]:text-white">
                Event Photos
              </TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-8">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">About Helen H. Liang, PhD</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Helen H. Liang, PhD is the Founder and Managing Partner of FoundersX Ventures, a top-ranked AI-first venture capital firm based in Silicon Valley. Prior to FoundersX, Helen has 12 years of product and operation experience in high-tech industry. She founded the pioneering venture capital firm in 2016, investing in entrepreneurs defining the future and breaking barriers across industries.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Her investment focus is on AI powered tech infrastructure, from enterprise AI to fintech and digital health. She leads a high-performing investment team originated from Stanford, winning the Power Law with deep-dive research capacity and top-notch deal flow.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Helen is an early backer of multiple tech unicorns, including SpaceX, Jeeves, Kapital, and Salt Security, featured on the Wall Street Journal and Business Insider. She has backed over 30 high growth AI companies, each valued at over $100M. She has co-invested multiple deals with A16Z, Sequoia Capital, and Google Capital.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Helen serves as a board director in multiple high growth tech companies. She is an invited speaker on AI and Robotics at TechCrunch and a guest lecturer on Technology Ventures at Stanford University.
                </p>

                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-4 flex items-center">
                        <Award className="w-6 h-6 mr-2 text-[#1E68C6]" />
                        Education
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• PhD in Materials Science, University of Wisconsin-Madison</li>
                        <li>• Harvard Business School, PE/VC Class of 2021</li>
                        <li>• Stanford Directors College 2023, Rock Center for Corporate Governance</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-4 flex items-center">
                        <Sparkles className="w-6 h-6 mr-2 text-green-600" />
                        Recognition
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Featured on Wall Street Journal</li>
                        <li>• Featured on Business Insider</li>
                        <li>• TechCrunch Invited Speaker</li>
                        <li>• NVIDIA VC Alliance Partner</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Speaking Topics Tab */}
            <TabsContent value="topics" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Speaking Topics</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Helen delivers high-impact keynotes on the intersection of AI, venture capital, and emerging technologies, drawing from her extensive portfolio of unicorn investments and deep tech expertise.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {speakingTopics.map((topic, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-[#1E68C6]">
                      <CardContent className="p-6">
                        <div className="text-4xl mb-3">{topic.icon}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{topic.title}</h3>
                        <p className="text-gray-600">{topic.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-12">
              {/* Unicorns Section */}
              <div>
                <div className="flex items-center mb-6">
                  <Rocket className="w-8 h-8 mr-3 text-yellow-500" />
                  <h2 className="text-3xl font-bold text-gray-900">Unicorn Investments</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {unicorns.map((unicorn, index) => (
                    <Card key={index} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="text-2xl mb-2">🦄</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{unicorn.name}</h3>
                        <div className="text-2xl font-bold text-[#1E68C6] mb-2">{unicorn.valuation}</div>
                        <p className="text-gray-600 text-sm">{unicorn.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* High-Growth Companies */}
              <div>
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-8 h-8 mr-3 text-green-500" />
                  <h2 className="text-3xl font-bold text-gray-900">Select High-Growth Investments</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {portfolioCompanies.map((company, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-[#1E68C6] text-white">{company.sector}</Badge>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{company.name}</h3>
                        <p className="text-gray-600 text-sm">{company.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Notable Founders */}
              <div>
                <div className="flex items-center mb-6">
                  <Users className="w-8 h-8 mr-3 text-purple-500" />
                  <h2 className="text-3xl font-bold text-gray-900">Notable Portfolio Founders</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notableFounders.map((founder, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{founder.name}</h3>
                        <p className="text-[#1E68C6] font-semibold mb-1">{founder.title}</p>
                        <p className="text-gray-900 font-medium mb-2">{founder.company}</p>
                        <Badge className="bg-green-100 text-green-800 text-xs">{founder.achievement}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Co-investors */}
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Co-Invested Alongside Leading VCs</h3>
                <div className="flex flex-wrap justify-center gap-8 items-center">
                  <div className="text-2xl font-bold text-gray-700">Andreessen Horowitz (a16z)</div>
                  <div className="text-2xl font-bold text-gray-700">Sequoia Capital</div>
                  <div className="text-2xl font-bold text-gray-700">Google Capital (CapitalG)</div>
                  <div className="text-2xl font-bold text-gray-700">Tencent</div>
                  <div className="text-2xl font-bold text-gray-700">Y Combinator</div>
                </div>
              </div>
            </TabsContent>

            {/* Media & Videos Tab */}
            <TabsContent value="media" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Play className="w-8 h-8 mr-3 text-[#1E68C6]" />
                  Speaking Videos
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {videos.map((video, index) => (
                    <a
                      key={index}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <Card className="hover:shadow-xl transition-shadow overflow-hidden">
                        <div className="relative aspect-video bg-gray-100">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                            <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Play className="w-8 h-8 text-[#1E68C6] ml-1" />
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1E68C6] transition-colors">
                            {video.title}
                          </h3>
                          <p className="text-gray-600">{video.description}</p>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>

                <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Media Coverage</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">📰</div>
                        <h4 className="font-bold text-lg mb-2">Wall Street Journal</h4>
                        <p className="text-gray-600 text-sm">Featured as pioneering tech VC</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">📊</div>
                        <h4 className="font-bold text-lg mb-2">Business Insider</h4>
                        <p className="text-gray-600 text-sm">Highlighted for unicorn investments</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">🎤</div>
                        <h4 className="font-bold text-lg mb-2">TechCrunch</h4>
                        <p className="text-gray-600 text-sm">Invited speaker on AI & Robotics</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Event Photos Tab */}
            <TabsContent value="photos" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Event Photos & Speaking Engagements</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-[4/3] bg-gray-100">
                      <img
                        src="/speakers/helen-liang-techweek-1.jpg"
                        alt="Helen Liang speaking at TechWeek SF"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">TechWeek San Francisco</h3>
                      <p className="text-gray-600">Panel discussion on venture creation and AI innovation</p>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-[4/3] bg-gray-100">
                      <img
                        src="/speakers/helen-liang-techweek-2.jpg"
                        alt="Helen Liang at TechWeek SF on stage"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">TechWeek San Francisco - On Stage</h3>
                      <p className="text-gray-600">Keynote presentation on GenAI infrastructure investing</p>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-[4/3] bg-gray-100">
                      <img
                        src="/speakers/helen-liang-singapore.jpg"
                        alt="Helen Liang speaking at Singapore AI Conference"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Singapore AI Conference</h3>
                      <p className="text-gray-600">International keynote on AI and venture capital</p>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-[4/3] bg-gray-100">
                      <img
                        src="/speakers/helen-liang-woz-fireside.jpg"
                        alt="Helen Liang fireside chat with Steve Wozniak"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Fireside Chat with Steve Wozniak</h3>
                      <p className="text-gray-600">Exclusive conversation with Apple co-founder at tech event</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#1E68C6] to-[#5084C6] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Book Helen H. Liang for Your Next Event
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Bring Silicon Valley's leading GenAI venture capital insights to your audience. Perfect for conferences, corporate events, and industry summits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-bold text-lg px-8">
              <Link href="/contact?speaker=Helen H. Liang">
                Check Availability & Pricing
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20">
              <Link href="/speakers">
                Browse Other Speakers
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">
              Frequently Asked Questions About Booking Helen H. Liang
            </h2>
            <h3 className="text-xl font-semibold mt-6">
              What topics does Helen Liang speak about?
            </h3>
            <p>
              Helen Liang specializes in speaking about GenAI applications across industries including cybersecurity, fintech, healthcare, robotics, quantum computing, and consumer AI. Her unique perspective comes from her portfolio of 8 unicorn investments and 25+ companies valued over $100M.
            </p>
            <h3 className="text-xl font-semibold mt-6">
              What is Helen's background?
            </h3>
            <p>
              Helen holds a PhD in Materials Science and has completed executive programs at Harvard Business School (PE/VC) and Stanford Directors College. She has 12 years of high-tech experience and founded FoundersX Ventures in 2016. She's been featured on WSJ and Business Insider as a pioneering tech VC.
            </p>
            <h3 className="text-xl font-semibold mt-6">
              Is Helen available for virtual events?
            </h3>
            <p>
              Yes, Helen is available for both in-person and virtual speaking engagements worldwide. She has experience with keynotes, panels, fireside chats, and workshops.
            </p>
            <h3 className="text-xl font-semibold mt-6">
              What makes Helen unique as a speaker?
            </h3>
            <p>
              Helen brings real-world insights from being an early investor in SpaceX, Salt Security, Jeeves, and Kapital. She has co-invested with a16z, Sequoia, and Google Capital, and serves on multiple tech company boards. Her practical experience in building unicorns and deep understanding of GenAI infrastructure makes her perspective invaluable for audiences looking to understand the future of AI.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
