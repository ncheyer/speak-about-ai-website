"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { SpeakerCard } from "@/components/speaker-card"
import {
  DollarSign,
  TrendingUp,
  Shield,
  CreditCard,
  Building2,
  BarChart3,
  Users,
  Globe,
  Briefcase,
  PieChart,
  Zap,
  Lock,
} from "lucide-react"

interface Speaker {
  [key: string]: any
}

interface FinanceAISpeakersClientPageProps {
  speakers: Speaker[]
}

export default function FinanceAISpeakersClientPage({ speakers }: FinanceAISpeakersClientPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Finance AI Speakers</h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Transform your financial services event with leading fintech and banking AI experts who are
              revolutionizing payments, investments, and financial operations at top banks and financial institutions
              worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Link href="/contact?source=finance_speakers_page">Book Finance AI Speakers</Link>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Finance AI Speakers</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our finance AI speakers are industry executives, fintech founders, and financial technology leaders who
              have shaped the digital transformation of banking and financial services at leading institutions.
            </p>
          </div>

          {speakers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {speakers.map((speaker) => (
                <SpeakerCard
                  key={speaker.slug}
                  speaker={speaker}
                  contactSource="finance_industry_page"
                  maxTopicsToShow={3}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading finance AI speakers...</p>
            </div>
          )}
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Finance AI Speaking Topics</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our finance speakers cover the full spectrum of financial technology, from AI banking solutions to
              investment strategies and regulatory compliance in the digital age.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: "AI in Banking & Financial Services",
                description: "Customer service automation, risk assessment, and operational efficiency in banking",
              },
              {
                icon: TrendingUp,
                title: "Algorithmic Trading & Investment",
                description: "AI-powered market analysis, trading strategies, and investment decision-making",
              },
              {
                icon: Shield,
                title: "Fraud Detection & Security",
                description: "Machine learning for financial security, fraud prevention, and cybercrime detection",
              },
              {
                icon: CreditCard,
                title: "Digital Payments & Fintech",
                description: "Payment innovation, digital wallets, and financial technology disruption",
              },
              {
                icon: BarChart3,
                title: "Financial Analytics & Insights",
                description: "Data-driven decision making and predictive analytics in finance",
              },
              {
                icon: Lock,
                title: "Regulatory Technology (RegTech)",
                description: "AI solutions for compliance, regulatory reporting, and risk management",
              },
              {
                icon: Building2,
                title: "Digital Banking Transformation",
                description: "Modernizing banking operations and customer experiences with AI",
              },
              {
                icon: PieChart,
                title: "Wealth Management & Robo-Advisors",
                description: "AI-powered investment advice and automated portfolio management",
              },
              {
                icon: Globe,
                title: "Blockchain & Cryptocurrency",
                description: "Digital currencies, DeFi, and blockchain applications in finance",
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Financial Organizations We Serve</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our finance AI speakers have delivered transformational insights across diverse financial organizations,
              helping them navigate fintech innovation and digital transformation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, name: "Investment Banks" },
              { icon: DollarSign, name: "Commercial Banks" },
              { icon: CreditCard, name: "Payment Companies" },
              { icon: TrendingUp, name: "Asset Management" },
              { icon: Shield, name: "Insurance Companies" },
              { icon: PieChart, name: "Wealth Management" },
              { icon: Briefcase, name: "Financial Consulting" },
              { icon: Users, name: "Credit Unions" },
              { icon: Globe, name: "Fintech Startups" },
              { icon: BarChart3, name: "Trading Firms" },
              { icon: Lock, name: "RegTech Companies" },
              { icon: Zap, name: "Financial Conferences" },
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Finance Event?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Connect with our finance AI experts who are trusted by leading banks, investment firms, insurance companies,
            and financial conferences worldwide to deliver cutting-edge insights on the future of finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              <Link href="/contact?source=finance_speakers_cta">Get Speaker Recommendations</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
            >
              <Link href="/speakers">Browse All Finance Speakers</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
