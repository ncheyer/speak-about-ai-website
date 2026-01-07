"use client"

import { Award, MapPin, Globe, Shield, Clock, Users, Headphones, Target } from "lucide-react"
import { EditableText, EditableImage } from "@/components/editable-text"
import { Button } from "@/components/ui/button"

interface PagePreviewProps {
  page: "home" | "services" | "team"
  content: Record<string, string>
  originalContent: Record<string, string>
  onContentChange: (key: string, value: string) => void
  editorMode?: boolean
}

// Helper to check if content is modified
function isModified(key: string, content: Record<string, string>, originalContent: Record<string, string>): boolean {
  return content[key] !== originalContent[key]
}

// Home Page Hero Preview
function HomeHeroPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const badge = content['home.hero.badge'] || '#1 AI-Exclusive Speaker Bureau'
  const title = content['home.hero.title'] || 'Book an AI Speaker for Your Event'
  const subtitle = content['home.hero.subtitle'] || 'The #1 AI speaker bureau with exclusive access to 70+ AI pioneers'

  return (
    <section className="bg-gradient-to-br from-[#EAEAEE] to-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-[#1E68C6] bg-opacity-10 text-[#1E68C6] rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              <EditableText
                value={badge}
                onChange={(v) => onContentChange('home.hero.badge', v)}
                isModified={isModified('home.hero.badge', content, originalContent)}
                editorMode={editorMode}
              />
            </div>

            {/* Main Headline */}
            <EditableText
              value={title}
              onChange={(v) => onContentChange('home.hero.title', v)}
              as="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-4 leading-[1.1] font-neue-haas tracking-tight"
              isModified={isModified('home.hero.title', content, originalContent)}
              editorMode={editorMode}
            />

            {/* Subtitle */}
            <EditableText
              value={subtitle}
              onChange={(v) => onContentChange('home.hero.subtitle', v)}
              as="p"
              className="text-lg md:text-xl text-gray-800 mb-6 font-montserrat font-semibold leading-tight"
              multiline
              isModified={isModified('home.hero.subtitle', content, originalContent)}
              editorMode={editorMode}
            />

            {/* CTA Buttons (static preview) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button variant="gold" size="lg" className="pointer-events-none opacity-80">
                Book Speaker Today
              </Button>
              <Button variant="default" size="lg" className="pointer-events-none opacity-80">
                Browse Speakers
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <p className="text-lg font-bold text-black font-neue-haas flex items-center gap-2 mb-2 sm:mb-0">
                <MapPin className="w-5 h-5 text-[#1E68C6]" />
                Silicon Valley Based
              </p>
              <p className="text-lg font-bold text-black font-neue-haas flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#1E68C6]" />
                Books Internationally
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/robert-strong-adam-cheyer-peter-norvig-on-stage-at-microsoft.jpg"
                alt="Robert Strong, Adam Cheyer, and Peter Norvig on stage"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Home Why Choose Us Preview
function HomeWhyChooseUsPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const sectionTitle = content['home.why-choose-us.section_title'] || 'Why Work with Speak About AI?'
  const sectionSubtitle = content['home.why-choose-us.section_subtitle'] || 'We book artificial intelligence keynote speakers for your organization\'s event who don\'t just talk about the future—they\'re the innovators building the tech.'

  const features = [
    {
      icon: Users,
      titleKey: 'feature1_title',
      descKey: 'feature1_description',
      defaultTitle: 'Access to Exclusive AI Pioneers',
      defaultDesc: 'Direct connections to the architects of modern AI—Siri co-founders, former Shazam executives, and the researchers who literally authored the AI textbooks.'
    },
    {
      icon: Shield,
      titleKey: 'feature2_title',
      descKey: 'feature2_description',
      defaultTitle: '24-Hour Response Guarantee',
      defaultDesc: 'Lightning-fast turnaround, guaranteed. From first inquiry to booking.'
    },
    {
      icon: Headphones,
      titleKey: 'feature3_title',
      descKey: 'feature3_description',
      defaultTitle: 'White-Glove Speaker Coordination',
      defaultDesc: 'We ensure seamless execution from booking to showtime.'
    },
    {
      icon: Target,
      titleKey: 'feature4_title',
      descKey: 'feature4_description',
      defaultTitle: 'We Help You Navigate The Noise',
      defaultDesc: 'Cut through the AI hype with our deep industry expertise and transparent guidance.'
    },
    {
      icon: Globe,
      titleKey: 'feature5_title',
      descKey: 'feature5_description',
      defaultTitle: 'Proven Stage Presence',
      defaultDesc: 'Our speakers command every venue with authority and authenticity.'
    },
    {
      icon: Clock,
      titleKey: 'feature6_title',
      descKey: 'feature6_description',
      defaultTitle: 'Actionable Industry Intelligence',
      defaultDesc: 'Tailored AI insights for your sector with concrete next steps.'
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <EditableText
            value={sectionTitle}
            onChange={(v) => onContentChange('home.why-choose-us.section_title', v)}
            as="h2"
            className="text-3xl font-bold text-gray-900 mb-4 font-neue-haas"
            isModified={isModified('home.why-choose-us.section_title', content, originalContent)}
            editorMode={editorMode}
          />
          <EditableText
            value={sectionSubtitle}
            onChange={(v) => onContentChange('home.why-choose-us.section_subtitle', v)}
            as="p"
            className="text-lg text-gray-600 max-w-3xl mx-auto font-montserrat"
            multiline
            isModified={isModified('home.why-choose-us.section_subtitle', content, originalContent)}
            editorMode={editorMode}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const titleKey = `home.why-choose-us.${feature.titleKey}`
            const descKey = `home.why-choose-us.${feature.descKey}`
            const title = content[titleKey] || feature.defaultTitle
            const description = content[descKey] || feature.defaultDesc

            return (
              <div
                key={index}
                className="group bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1E68C6] to-blue-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <EditableText
                    value={title}
                    onChange={(v) => onContentChange(titleKey, v)}
                    as="h3"
                    className="text-lg font-bold text-gray-900 font-neue-haas"
                    isModified={isModified(titleKey, content, originalContent)}
                    editorMode={editorMode}
                  />
                </div>
                <EditableText
                  value={description}
                  onChange={(v) => onContentChange(descKey, v)}
                  as="p"
                  className="text-gray-700 leading-relaxed font-montserrat text-sm"
                  multiline
                  isModified={isModified(descKey, content, originalContent)}
                  editorMode={editorMode}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Services Hero Preview
function ServicesHeroPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const badge = content['services.hero.badge'] || 'What We Offer'
  const title = content['services.hero.title'] || 'Our Services'
  const subtitle = content['services.hero.subtitle'] || 'At Speak About AI, we connect you with world-class AI experts to amaze your attendees, educate your executives, and inspire innovation.'

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-16 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1E68C6]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#1E68C6]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block mb-6">
          <span className="px-4 py-2 bg-[#1E68C6]/10 rounded-full text-[#1E68C6] text-sm font-montserrat font-medium">
            <EditableText
              value={badge}
              onChange={(v) => onContentChange('services.hero.badge', v)}
              isModified={isModified('services.hero.badge', content, originalContent)}
              editorMode={editorMode}
            />
          </span>
        </div>
        <EditableText
          value={title}
          onChange={(v) => onContentChange('services.hero.title', v)}
          as="h1"
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-neue-haas"
          isModified={isModified('services.hero.title', content, originalContent)}
          editorMode={editorMode}
        />
        <EditableText
          value={subtitle}
          onChange={(v) => onContentChange('services.hero.subtitle', v)}
          as="p"
          className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed font-montserrat"
          multiline
          isModified={isModified('services.hero.subtitle', content, originalContent)}
          editorMode={editorMode}
        />
      </div>
    </section>
  )
}

// Services Offerings Preview
function ServicesOfferingsPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const offerings = [
    {
      id: 'offering1',
      image: '/services/adam-cheyer-stadium.jpg',
      defaultTitle: 'Keynote Speeches',
      defaultDesc: 'Inspire your audience with engaging and informative keynote speeches on the future of technology.'
    },
    {
      id: 'offering2',
      image: '/services/sharon-zhou-panel.jpg',
      defaultTitle: 'Panel Discussions',
      defaultDesc: 'Facilitate insightful and dynamic panel discussions on industry trends and challenges.'
    },
    {
      id: 'offering3',
      image: '/services/allie-k-miller-fireside.jpg',
      defaultTitle: 'Fireside Chats',
      defaultDesc: 'Create intimate and engaging conversations with industry leaders in a fireside chat format.'
    },
    {
      id: 'offering4',
      image: '/services/tatyana-mamut-speaking.jpg',
      defaultTitle: 'Workshops',
      defaultDesc: 'Provide hands-on learning experiences with interactive workshops tailored to your audience\'s needs.'
    },
    {
      id: 'offering5',
      image: '/services/sharon-zhou-headshot.png',
      defaultTitle: 'Virtual Presentations',
      defaultDesc: 'Reach a global audience with engaging and professional virtual presentations.'
    },
    {
      id: 'offering6',
      image: '/services/simon-pierro-youtube.jpg',
      defaultTitle: 'Custom Video Content',
      defaultDesc: 'Create compelling video content for marketing, training, and internal communications.'
    },
  ]

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((offering) => {
            const titleKey = `services.offerings.${offering.id}_title`
            const descKey = `services.offerings.${offering.id}_description`
            const title = content[titleKey] || offering.defaultTitle
            const description = content[descKey] || offering.defaultDesc

            return (
              <div key={offering.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative w-full aspect-[4/3] bg-gray-200">
                  <img
                    src={offering.image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <EditableText
                    value={title}
                    onChange={(v) => onContentChange(titleKey, v)}
                    as="h2"
                    className="text-lg font-bold text-gray-900 mb-2 font-neue-haas"
                    isModified={isModified(titleKey, content, originalContent)}
                    editorMode={editorMode}
                  />
                  <EditableText
                    value={description}
                    onChange={(v) => onContentChange(descKey, v)}
                    as="p"
                    className="text-gray-700 font-montserrat text-sm"
                    multiline
                    isModified={isModified(descKey, content, originalContent)}
                    editorMode={editorMode}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Team Hero Preview
function TeamHeroPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const badge = content['team.hero.badge'] || 'Our Story'
  const title = content['team.hero.title'] || 'How It All Started'
  const p1 = content['team.hero.story_paragraph1'] || 'Robert Strong has been booking himself and other talent for 30+ years, and has called Silicon Valley home for 20 of them.'
  const p2 = content['team.hero.story_paragraph2'] || 'After ChatGPT launched and his friends in the AI space started getting flooded with speaking requests, Robert decided to turn it into an agency.'
  const p3 = content['team.hero.story_paragraph3'] || 'Today, Speak About AI has booked speakers everywhere from Silicon Valley to Singapore.'

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-16 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1E68C6]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#1E68C6]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-[#1E68C6]/10 rounded-full text-[#1E68C6] text-sm font-montserrat font-medium">
              <EditableText
                value={badge}
                onChange={(v) => onContentChange('team.hero.badge', v)}
                isModified={isModified('team.hero.badge', content, originalContent)}
                editorMode={editorMode}
              />
            </span>
          </div>
          <EditableText
            value={title}
            onChange={(v) => onContentChange('team.hero.title', v)}
            as="h1"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-neue-haas"
            isModified={isModified('team.hero.title', content, originalContent)}
            editorMode={editorMode}
          />
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <EditableText
            value={p1}
            onChange={(v) => onContentChange('team.hero.story_paragraph1', v)}
            as="p"
            className="text-base text-gray-600 font-montserrat leading-relaxed"
            multiline
            isModified={isModified('team.hero.story_paragraph1', content, originalContent)}
            editorMode={editorMode}
          />
          <EditableText
            value={p2}
            onChange={(v) => onContentChange('team.hero.story_paragraph2', v)}
            as="p"
            className="text-base text-gray-600 font-montserrat leading-relaxed"
            multiline
            isModified={isModified('team.hero.story_paragraph2', content, originalContent)}
            editorMode={editorMode}
          />
          <EditableText
            value={p3}
            onChange={(v) => onContentChange('team.hero.story_paragraph3', v)}
            as="p"
            className="text-base text-gray-600 font-montserrat leading-relaxed"
            multiline
            isModified={isModified('team.hero.story_paragraph3', content, originalContent)}
            editorMode={editorMode}
          />
        </div>
      </div>
    </section>
  )
}

// Team Members Preview
function TeamMembersPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const name = content['team.members.member1_name'] || 'Robert Strong'
  const title = content['team.members.member1_title'] || 'Founder & CEO'
  const bio = content['team.members.member1_bio'] || 'Robert has been booking talent for 30+ years and has called Silicon Valley home for 20 of them.'

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center font-neue-haas">Meet the Team</h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-48 h-48 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                <img
                  src={content['team.members.member1_image'] || '/placeholder.svg'}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <EditableText
                  value={name}
                  onChange={(v) => onContentChange('team.members.member1_name', v)}
                  as="h3"
                  className="text-2xl font-bold text-gray-900 mb-1 font-neue-haas"
                  isModified={isModified('team.members.member1_name', content, originalContent)}
                  editorMode={editorMode}
                />
                <EditableText
                  value={title}
                  onChange={(v) => onContentChange('team.members.member1_title', v)}
                  as="p"
                  className="text-[#1E68C6] font-semibold mb-4 font-montserrat"
                  isModified={isModified('team.members.member1_title', content, originalContent)}
                  editorMode={editorMode}
                />
                <EditableText
                  value={bio}
                  onChange={(v) => onContentChange('team.members.member1_bio', v)}
                  as="p"
                  className="text-gray-600 leading-relaxed font-montserrat"
                  multiline
                  isModified={isModified('team.members.member1_bio', content, originalContent)}
                  editorMode={editorMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Main Page Preview Component
export function PagePreview({ page, content, originalContent, onContentChange, editorMode = true }: PagePreviewProps) {
  if (page === 'home') {
    return (
      <div className="space-y-0">
        <HomeHeroPreview
          content={content}
          originalContent={originalContent}
          onContentChange={onContentChange}
          editorMode={editorMode}
        />
        <HomeWhyChooseUsPreview
          content={content}
          originalContent={originalContent}
          onContentChange={onContentChange}
          editorMode={editorMode}
        />
      </div>
    )
  }

  if (page === 'services') {
    return (
      <div className="space-y-0">
        <ServicesHeroPreview
          content={content}
          originalContent={originalContent}
          onContentChange={onContentChange}
          editorMode={editorMode}
        />
        <ServicesOfferingsPreview
          content={content}
          originalContent={originalContent}
          onContentChange={onContentChange}
          editorMode={editorMode}
        />
      </div>
    )
  }

  if (page === 'team') {
    return (
      <div className="space-y-0">
        <TeamHeroPreview
          content={content}
          originalContent={originalContent}
          onContentChange={onContentChange}
          editorMode={editorMode}
        />
        <TeamMembersPreview
          content={content}
          originalContent={originalContent}
          onContentChange={onContentChange}
          editorMode={editorMode}
        />
      </div>
    )
  }

  return null
}

export default PagePreview
