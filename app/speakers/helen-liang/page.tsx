import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  TrendingUp,
  Shield,
  Heart,
  Cpu,
  Sparkles,
  Video,
  Award,
  Building2,
  ChevronRight,
  ExternalLink
} from "lucide-react"

export const metadata = {
  title: "Helen H. Liang, PhD - AI & VC Speaker | FoundersX Ventures | Speak About AI",
  description: "Book Helen Liang for keynotes on GenAI in Cybersecurity, Fintech, Healthcare, Robotics & more. Managing Partner at FoundersX Ventures with 8 unicorns. Featured on WSJ & Business Insider.",
  keywords: "Helen Liang speaker, AI speaker, venture capital speaker, GenAI speaker, fintech AI, cybersecurity AI, healthcare AI, robotics AI",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function HelenLiangPage() {
  const speakingTopics = [
    {
      icon: Shield,
      title: "GenAI in Cybersecurity",
      description: "Deepfake detection, API security, and the future of enterprise security in the GenAI era",
      expertise: ["API Security", "Deepfake Detection", "Zero Trust Architecture", "AI-Powered Threat Detection"]
    },
    {
      icon: TrendingUp,
      title: "GenAI in Fintech",
      description: "Asset management, neobanking, supply chain finance, and AI-driven financial innovation",
      expertise: ["Asset Management AI", "Neobank Innovation", "Supply Chain Finance", "Financial Automation"]
    },
    {
      iconPath: "/icons/healthcare.svg",
      title: "GenAI in Healthcare",
      description: "Mental health platforms, hospital automation, neuroscience applications, and digital health transformation",
      expertise: ["Mental Health Tech", "Hospital Automation", "Neuroscience AI", "Digital Health Platforms"]
    },
    {
      iconPath: "/icons/robot.svg",
      title: "AI and Robotics",
      description: "Robotics operating systems, embodied AI, the World Model, and the future of intelligent machines",
      expertise: ["Robotics Brain/OS", "Embodied AI", "World Model", "Autonomous Systems"]
    },
    {
      iconPath: "/icons/microchip.png",
      title: "3D Chips and Next-Gen Compute",
      description: "3D chip architecture, quantum computing, and the computational infrastructure powering AI",
      expertise: ["3D Chip Design", "Quantum Computing", "Next-Gen Hardware", "AI Infrastructure"]
    },
    {
      icon: Briefcase,
      title: "Consumer AI",
      description: "AI devices, multi-agent gaming, AI-generated short films, and consumer applications",
      expertise: ["AI Devices", "Multi-Agent Systems", "AI Content Creation", "Consumer Applications"]
    }
  ]

  const videos = [
    {
      title: "Investing in Robotics and AI: Lessons from Industry VCs",
      url: "https://techcrunch.com/video/investing-in-robotics-and-ai-lessons-from-the-industrys-vcs-with-peter-barrett-playground-global-helen-liang-foundersx-ventures-eric-migicovsky-y-combinator-and-andy-wheeler-gv/",
      thumbnail: "/speakers/helen-techcrunch-robotics-ai.jpg",
      description: "TechCrunch panel with leading VCs from Playground Global, FoundersX Ventures, Y Combinator, and GV discussing AI and robotics investment strategies"
    },
    {
      title: "Fintech AI Innovation Panel",
      url: "https://www.linkedin.com/posts/leo-naiwen-cui-ph-d-59531439_fintech-aiinfinance-venturecapital-activity-7318645235612332033-9wbK",
      thumbnail: "/speakers/helen-fintech-panel.jpg",
      description: "Panel discussion on AI in finance and fintech innovation at the Fintech Summit"
    },
    {
      title: "TechWeek SF 2024: AI Agents Fireside Chat",
      url: "#",
      thumbnail: "/speakers/Helen at TechWeek SF1.jpg",
      description: "Fireside chat with David Lin, CEO of Linvest21, at TechWeek SF 2024 discussing AI agents and the future of AI-native investment platforms"
    }
  ]

  const portfolioFounders = [
    {
      name: "Salt Security",
      description: "API Security",
      valuation: "$1.4B",
      founder: "Roey Eliyahu",
      founderTitle: "Co-founder & CEO (est. 2016)",
      founderImage: "/speakers/roey-eliyahu.webp",
      founderBio: "Prodigy coder who started programming at age 9, freelancing by age 11. Joined Israeli Defense Forces (IDF) cyber-security unit at 18, quickly rising to team lead. Co-founded Salt Security with Michael Nicosia on a mission to 'protect every API in the world.' Now leading the frontier of AI agent security through Model Context Protocol (MCP) protection. Featured in Forbes for his journey from military cyber-security to building API defense infrastructure.",
      achievements: [
        "Raised $275M+ from Sequoia Capital, CapitalG (Google), Alkeon Capital",
        "Salt Labs uncovered more API vulnerabilities than all other teams combined",
        "Pioneered runtime threat protection for APIs (discovery, posture, defense)",
        "Leading MCP security for AI agents accessing production systems",
        "Series D led by Google's CapitalG at $1.4B valuation"
      ],
      featured: "Forbes, TechCrunch, Pulse 2.0"
    },
    {
      name: "Jeeves",
      description: "Global Finance Platform",
      valuation: "$2.1B",
      founder: "Dileep Thazhmon",
      founderTitle: "CEO & Founder (YC S20 & G21)",
      founderBio: "Serial entrepreneur and Stanford GSB MBA (Arbuckle Fellow). Previously Co-Founder & COO at Jeeng/PowerInbox with $100M+ exit. Led company to #2 in Software on Inc Top 30, #3 on Deloitte Fast50. Started college at 16, honors graduate with M.S./B.S. in Computer Engineering (magna cum laude). Built Jeeves to power smarter finance teams across 20+ countries.",
      achievements: [
        "Raised $380M+ in equity and venture debt",
        "Series A led by a16z, Series C by Tencent",
        "Previous exit: PowerInbox ($100M+) backed by Battery Ventures",
        "PowerInbox: 10B+ emails/month, 75M+ users (CNN, Disney, HBO, NFL)",
        "Serves companies across 🇲🇽 🇨🇴 🇧🇷 🇬🇧 🇪🇺 🇺🇸 🇨🇦"
      ],
      featured: "Bloomberg, Forbes, Inc Magazine, Deloitte Fast50"
    },
    {
      name: "Kapital",
      description: "LATAM Fintech",
      valuation: "$1.3B",
      founder: "René Saul",
      founderTitle: "CEO & Co-Founder (est. Jan 2020)",
      founderImage: "/speakers/rene-saul.webp",
      founderBio: "Stanford GSB MBA and Forbes Latam 35 Leaders in AI. Co-founded Kapital alongside Fernando Sandoval and Eder Echeverria to serve Latin America's underserved SME market (50% of regional GDP). Secured bank license in Mexico to connect directly to central bank. 2x Marathon & 1x 70.3 Ironman finisher, bringing the same relentless drive to building integrated financial infrastructure for enterprises across Latin America.",
      achievements: [
        "Closed $100M Series C achieving unicorn status ($1.3B valuation)",
        "Planning IPO within 3 years (dual listing Mexico + U.S.)",
        "Acquired bank license in Mexico for direct central bank connection",
        "Integrated platform: current accounts, cards, credit, expense mgmt, cash-flow visibility",
        "Serving SMEs across 🇲🇽 🇨🇴 🇵🇪 with AI-driven financial insights"
      ],
      featured: "Bloomberg, Forbes, Forbes México"
    },
    {
      name: "Linvest21",
      description: "AI-Native Investment Platform",
      valuation: "Series A",
      founder: "David Lin",
      founderTitle: "Founder & CEO",
      founderImage: "/speakers/david-lin.jpeg",
      founderBio: "Former Managing Director & CTO at JPMorgan Asset Management with 22+ years building global investment technology platforms. Holds Columbia MBA and BSc Computer Science (Honours) from University of Toronto. Immigrated from China to Canada in 1990, bringing resilience and vision to building AlphaCopilot™ - the first truly AI-native investment platform. Holds 6 patents in financial technology and applied AI. Selected speaker at industry events including TCFA panel on 'Alpha in the Age of AI.'",
      achievements: [
        "Built AlphaCopilot™: autonomous investment system with AI analyst, portfolio manager & virtual CIO agents",
        "Selected for Morningstar Investment Conference (MIC) 2025 (1 of 12 emerging fintechs worldwide)",
        "Finalist for 'Invest Tech Start-up of the Year' (2025) at Banking Tech Awards",
        "Featured by Bloomberg for pioneering AI-native investing",
        "6 patents in financial technology and applied AI",
        "22+ years at JPMorgan: Global Head of Investment Technology, CTO Global Investment Platform",
        "Unveiled Global Macro Intelligence 1.0 (July 2025) - comprehensive real-time analysis platform"
      ],
      featured: "Bloomberg, Banking Tech Awards, Morningstar"
    }
  ]

  const notableInvestments = [
    "Universal Quantum - $80M contract with German Aerospace Center",
    "Cognito Therapeutics - $105M Series B, breakthrough neuroscience",
    "1910 Genetics - AI drug discovery, backed by Sam Altman",
    "Solve Intelligence - $12M Series A, automated IP generation",
    "Alinea Invest - $10M Series A, AI investment platform for GenZ",
    "Meru Health - $50M+ raised, Stanford partner for mental healthcare",
    "Charge Robotics - Solar farm automation, backed by Founders Fund"
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="about" className="bg-gradient-to-br from-[#EAEAEE] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <Badge className="bg-blue-600 text-white mb-4">
                  Featured on WSJ & Business Insider
                </Badge>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 font-neue-haas">
                Helen H. Liang, PhD
              </h1>
              <p className="text-2xl text-gray-700 mb-6 font-montserrat">
                Founder & Managing Partner, FoundersX Ventures
              </p>
              <p className="text-xl text-gray-600 mb-8 font-montserrat leading-relaxed">
                Silicon Valley venture capitalist and AI thought leader. Managing Partner at FoundersX Ventures
                with 8 unicorns and 25+ portfolio companies valued over $100M. Board Director, Guest Lecturer at
                Stanford, and Invited Speaker at TechCrunch. NVIDIA VC Alliance Partner.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="w-full sm:w-auto">
                      Book Helen to Speak
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="https://www.linkedin.com/in/helensandhill/" target="_blank">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      View LinkedIn Profile
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="#videos">
                    <Button size="md" variant="outline" className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold">
                      <Video className="mr-2 h-4 w-4" />
                      Watch Speaking Videos
                    </Button>
                  </a>
                  <a href="#portfolio">
                    <Button size="md" variant="outline" className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold">
                      <Building2 className="mr-2 h-4 w-4" />
                      View Portfolio
                    </Button>
                  </a>
                  <a href="#partners">
                    <Button size="md" variant="outline" className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold">
                      <Award className="mr-2 h-4 w-4" />
                      Speaking Partners
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/speakers/helen-liang-headshot.jpeg"
                  alt="Helen H. Liang, PhD"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">8</div>
              <div className="text-blue-100">Unicorn Investments</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-blue-100">Companies &gt; $100M</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10</div>
              <div className="text-blue-100">Successful Acquisitions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">9+</div>
              <div className="text-blue-100">Years Leading FoundersX</div>
            </div>
          </div>
        </div>
      </section>

      {/* Speaking Topics */}
      <section id="topics" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-neue-haas">
              Speaking Topics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
              Helen delivers insights on cutting-edge AI applications across industries,
              backed by real-world experience investing in and building transformative companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakingTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    {topic.iconPath ? (
                      <Image
                        src={topic.iconPath}
                        alt={topic.title}
                        width={24}
                        height={24}
                        style={topic.iconPath.endsWith('.png') ? {
                          filter: 'brightness(0) saturate(100%) invert(32%) sepia(96%) saturate(2041%) hue-rotate(212deg) brightness(99%) contrast(94%)'
                        } : undefined}
                      />
                    ) : (
                      <topic.icon className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <CardTitle className="text-xl font-neue-haas">{topic.title}</CardTitle>
                  <CardDescription className="font-montserrat">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {topic.expertise.map((item, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Speaking Videos */}
      <section id="videos" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Video className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-4xl font-bold text-gray-900 font-neue-haas">
                Helen on Stage
              </h2>
            </div>
            <p className="text-xl text-gray-600 font-montserrat">
              Watch Helen speak at leading tech conferences and events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {videos.map((video, index) => (
              <Link key={index} href={video.url} target="_blank" rel="noopener noreferrer">
                <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="aspect-video relative bg-gray-200">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="lg">
                        Watch Video
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-2 font-neue-haas">{video.title}</h3>
                    <p className="text-sm text-gray-600 font-montserrat">{video.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Speaking Photos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/speakers/Fireside chat with Woz.jpeg"
                alt="Helen Liang Fireside Chat with Woz"
                fill
                className="object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/speakers/Helen in Singapore AI.jpeg"
                alt="Helen Liang in Singapore AI Conference"
                fill
                className="object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/speakers/Helen at TechWeek SF2.jpg"
                alt="Helen Liang at TechWeek SF 2024"
                fill
                className="object-cover hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Highlights */}
      <section id="portfolio" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-amber-600 mr-3" />
              <h2 className="text-4xl font-bold text-gray-900 font-neue-haas">
                Investment Track Record
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
              Helen's insights are backed by successful investments in groundbreaking companies
              across AI, fintech, healthcare, and deep tech
            </p>
          </div>

          {/* Portfolio Companies */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center font-neue-haas">
              Portfolio Companies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {portfolioFounders.map((company, index) => (
                <Card key={index} className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <Badge className="bg-blue-600">Portfolio</Badge>
                    </div>
                    <CardTitle className="text-lg font-neue-haas">{company.name}</CardTitle>
                    <CardDescription className="font-montserrat">
                      {company.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-semibold text-blue-700">
                      {company.valuation}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Founder Profiles */}
          <div id="partners" className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 font-neue-haas">
                Speaking & Panel Partners
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-montserrat">
                Helen has invested in and collaborates with exceptional founders building transformative companies.
                These visionary leaders make ideal co-speakers and panelists for industry events.
              </p>
            </div>

            <div className="space-y-8">
              {portfolioFounders.map((company, index) => (
                <Card key={index} className="overflow-hidden border-2 border-blue-100 hover:shadow-xl transition-all">
                  <div className="bg-gradient-to-r from-blue-50 to-white p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Company Info */}
                      <div className="md:w-1/3">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-blue-600 text-white">
                            <Building2 className="h-3 w-3 mr-1" />
                            Portfolio
                          </Badge>
                          <Badge variant="outline" className="border-blue-600 text-blue-700">
                            {company.valuation}
                          </Badge>
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2 font-neue-haas">
                          {company.name}
                        </h4>
                        <p className="text-gray-600 font-montserrat mb-4">
                          {company.description}
                        </p>
                        <div className="text-sm text-gray-500 font-montserrat">
                          Featured: {company.featured}
                        </div>
                      </div>

                      {/* Founder Profile */}
                      <div className="md:w-2/3 border-l-0 md:border-l-2 border-blue-200 md:pl-6">
                        <div className="flex gap-4 mb-4">
                          {company.founderImage && (
                            <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-200">
                              <Image
                                src={company.founderImage}
                                alt={company.founder}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <h5 className="text-xl font-bold text-gray-900 font-neue-haas">
                              {company.founder}
                            </h5>
                            <p className="text-sm text-blue-600 font-semibold font-montserrat">
                              {company.founderTitle}
                            </p>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 font-montserrat leading-relaxed">
                          {company.founderBio}
                        </p>

                        <div>
                          <h6 className="text-sm font-bold text-gray-900 mb-3 font-neue-haas uppercase tracking-wide">
                            Key Achievements
                          </h6>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {company.achievements.map((achievement, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <ChevronRight className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700 font-montserrat">{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Notable Investments */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center font-neue-haas">
              Notable Portfolio Companies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {notableInvestments.map((investment, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-800 font-montserrat">{investment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About FoundersX */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-neue-haas">
              About FoundersX Ventures
            </h2>
          </div>

          <Card className="border-2 border-blue-200">
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 mb-6 font-montserrat leading-relaxed">
                FoundersX Ventures is an early-stage venture capital firm based in Silicon Valley with offices
                in Menlo Park, CA and at Harvard Square, Cambridge, MA. The firm backs aspiring founders
                defining the future and breaking barriers across industries with core focus on value creation
                in building GenAI infrastructure and data-driven solutions.
              </p>
              <p className="text-lg text-gray-700 mb-6 font-montserrat leading-relaxed">
                The investment team, originally from Stanford, brings strong product focus and venture
                discipline into deep tech startups. FoundersX is featured on <strong>WSJ</strong> and{" "}
                <strong>Business Insider</strong> as a pioneering tech VC.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">Silicon Valley</div>
                  <div className="text-gray-600 font-montserrat">Menlo Park, CA</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">Boston</div>
                  <div className="text-gray-600 font-montserrat">Harvard Square, MA</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">Stanford</div>
                  <div className="text-gray-600 font-montserrat">Guest Lecturer</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center font-neue-haas">
            Biography
          </h2>
          <div className="prose prose-lg max-w-none font-montserrat">
            <p className="text-gray-700 leading-relaxed mb-6">
              Dr. Helen H. Liang is the Founder and Managing Partner of FoundersX Ventures, a Silicon Valley-based
              venture capital firm with over 10 years focused on building GenAI-powered tech infrastructure across
              industries, from enterprise SaaS and Fintech to Biotech and Digital Health solutions.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              With over a decade of product and operation experience in high-tech industry before founding FoundersX
              in 2016, Helen brings deep technical expertise combined with venture discipline. She has been featured
              on <strong>The Wall Street Journal</strong> and <strong>Business Insider</strong> as a pioneering
              tech VC and serves as a Board Director for multiple portfolio companies.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Helen is a Guest Lecturer at Stanford University Graduate School of Business, an Invited Speaker at
              TechCrunch, and an NVIDIA VC Alliance Partner. Her portfolio includes 8 unicorns, 25+ companies
              valued over $100M, and 10 successful acquisitions, including investments in SpaceX, Salt Security,
              Jeeves, Kapital, Universal Quantum, Cognito Therapeutics, and many others.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Prior to FoundersX, Helen held senior R&D and management positions at Seagate Technology for over
              13 years, where she led US and Asia product teams, won multiple RHO Leadership and Best Team awards,
              and delivered breakthrough solutions in magnetic sensor technology. She holds a PhD and brings deep
              technical expertise to her investment strategy.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Helen's speaking engagements cover cutting-edge topics including GenAI applications in cybersecurity,
              fintech, healthcare, robotics, next-generation compute infrastructure, and consumer AI. Her insights
              are grounded in real-world experience building and scaling transformative technology companies.
            </p>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-neue-haas">Education & Credentials</h3>
            <ul className="space-y-2 text-gray-700 font-montserrat">
              <li className="flex items-start gap-2">
                <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>PhD - Advanced Technology Research</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Stanford University Graduate School of Business - Guest Lecturer</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Board Director - Multiple Technology Companies</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>NVIDIA VC Alliance Partner</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 font-neue-haas">
            Bring Helen H. Liang to Your Next Event
          </h2>
          <p className="text-xl mb-8 opacity-90 font-montserrat">
            Bring world-class insights on AI, venture capital, and technology innovation to your audience.
            Helen delivers compelling keynotes backed by hands-on experience building unicorns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact?speaker=helen-liang">
              <Button size="lg" variant="secondary" className="font-semibold">
                Request Speaking Engagement
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="https://www.linkedin.com/in/helensandhill/" target="_blank">
              <Button
                size="lg"
                variant="outline"
                className="font-semibold bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
              >
                Connect on LinkedIn
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
