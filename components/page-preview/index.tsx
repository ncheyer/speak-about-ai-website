"use client"

import { Award, MapPin, Globe, Shield, Clock, Users, Headphones, Target, DollarSign, Globe2, Check, Calendar, ArrowRight } from "lucide-react"
import { EditableText, EditableImage, LogoListEditor, OfferingsListEditor, SimpleListEditor, type ServiceOffering } from "@/components/editable-text"
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

  // Hero image from database
  const heroImage = content['home.images.hero_image'] || '/robert-strong-adam-cheyer-peter-norvig-on-stage-at-microsoft.jpg'
  const heroImageAlt = content['home.images.hero_image_alt'] || 'Robert Strong, Adam Cheyer, and Peter Norvig on stage'

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

          {/* Hero Image - Editable */}
          <div className="relative">
            <EditableImage
              src={heroImage}
              alt={heroImageAlt}
              onChange={(newSrc) => onContentChange('home.images.hero_image', newSrc)}
              onAltChange={(newAlt) => onContentChange('home.images.hero_image_alt', newAlt)}
              isModified={isModified('home.images.hero_image', content, originalContent)}
              editorMode={editorMode}
              className="w-full h-auto object-cover rounded-xl shadow-2xl"
              uploadFolder="hero"
            />
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

// Home Featured Speakers Preview
function HomeFeaturedSpeakersPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const title = content['home.featured-speakers.title'] || 'Featured AI Keynote Speakers'
  const subtitle = content['home.featured-speakers.subtitle'] || 'World-class artificial intelligence experts, machine learning pioneers, and tech visionaries who are shaping the future of AI across every industry.'
  const ctaText = content['home.featured-speakers.cta_text'] || 'View All AI Speakers'

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <EditableText
            value={title}
            onChange={(v) => onContentChange('home.featured-speakers.title', v)}
            as="h2"
            className="text-4xl font-bold text-black mb-4 font-neue-haas"
            isModified={isModified('home.featured-speakers.title', content, originalContent)}
            editorMode={editorMode}
          />
          <EditableText
            value={subtitle}
            onChange={(v) => onContentChange('home.featured-speakers.subtitle', v)}
            as="p"
            className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat"
            multiline
            isModified={isModified('home.featured-speakers.subtitle', content, originalContent)}
            editorMode={editorMode}
          />
        </div>

        {/* Speaker cards placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-6 h-64 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Speaker Card {i}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 italic mb-6">Speaker cards are loaded dynamically from the database</p>

        {/* CTA Button */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>CTA Button Text:</span>
            <EditableText
              value={ctaText}
              onChange={(v) => onContentChange('home.featured-speakers.cta_text', v)}
              className="font-semibold text-amber-600"
              isModified={isModified('home.featured-speakers.cta_text', content, originalContent)}
              editorMode={editorMode}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// Default logos for preview (matches client-logos.tsx)
const defaultLogos = [
  { name: "Stanford University", src: "/logos/stanford-university-logo-1024x335-1.png" },
  { name: "Google", src: "/logos/Google_2015_logo.svg.png" },
  { name: "Amazon", src: "/logos/Amazon-Logo-2000.png" },
  { name: "Visa", src: "/logos/Visa_Inc._logo.svg" },
  { name: "Rio Innovation Week", src: "/logos/rio-innovation-week-new.png" },
  { name: "NICE", src: "/logos/nice-logo.png" },
  { name: "ST Engineering", src: "/logos/st-engineering-logo.png" },
  { name: "Government of Korea", src: "/logos/korea-government-logo.png" },
  { name: "Juniper Networks", src: "/logos/juniper-networks-logo.svg" },
  { name: "KPMG", src: "/logos/KPMG_logo.svg.png" },
]

// Home Client Logos Preview
function HomeClientLogosPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const title = content['home.client-logos.title'] || 'Trusted by Industry Leaders'
  const subtitle = content['home.client-logos.subtitle'] || 'Our speakers have worked with leading organizations around the world for their most important events.'
  const ctaText = content['home.client-logos.cta_text'] || 'View Past Clients & Events'
  const ctaLink = content['home.client-logos.cta_link'] || '/our-services#testimonials'

  // Parse logos from content or use defaults
  const logosJson = content['home.client-logos.logos']
  let logos = defaultLogos
  if (logosJson) {
    try {
      logos = JSON.parse(logosJson)
    } catch (e) {
      // Use defaults if JSON parsing fails
    }
  }

  const handleLogosChange = (newLogos: typeof defaultLogos) => {
    onContentChange('home.client-logos.logos', JSON.stringify(newLogos))
  }

  return (
    <section className="pt-4 pb-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-3">
          <EditableText
            value={title}
            onChange={(v) => onContentChange('home.client-logos.title', v)}
            as="h2"
            className="text-3xl font-bold text-gray-900 mb-2"
            isModified={isModified('home.client-logos.title', content, originalContent)}
            editorMode={editorMode}
          />
          <EditableText
            value={subtitle}
            onChange={(v) => onContentChange('home.client-logos.subtitle', v)}
            as="p"
            className="text-lg text-gray-600"
            multiline
            isModified={isModified('home.client-logos.subtitle', content, originalContent)}
            editorMode={editorMode}
          />
        </div>
        {/* Logo carousel preview - showing actual logos */}
        <div className="flex justify-center items-center gap-8 py-6 flex-wrap">
          {logos.map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.name}
              className="h-12 w-auto object-contain opacity-70"
              title={logo.name}
            />
          ))}
        </div>

        {/* Logo Editor */}
        <div className="text-center mb-4">
          <LogoListEditor
            logos={logos}
            onChange={handleLogosChange}
            isModified={isModified('home.client-logos.logos', content, originalContent)}
            editorMode={editorMode}
          />
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>CTA Text:</span>
            <EditableText
              value={ctaText}
              onChange={(v) => onContentChange('home.client-logos.cta_text', v)}
              className="font-semibold text-amber-600"
              isModified={isModified('home.client-logos.cta_text', content, originalContent)}
              editorMode={editorMode}
            />
          </div>
          <div className="text-xs text-gray-500">
            CTA Link:
            <EditableText
              value={ctaLink}
              onChange={(v) => onContentChange('home.client-logos.cta_link', v)}
              className="ml-1 text-blue-600"
              isModified={isModified('home.client-logos.cta_link', content, originalContent)}
              editorMode={editorMode}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// Home Navigate The Noise Preview
function HomeNavigateTheNoisePreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const sectionTitle = content['home.navigate.section_title'] || 'Navigate the AI Speaker Landscape'
  const sectionSubtitle = content['home.navigate.section_subtitle'] || 'Clear guidance to help you make informed decisions faster'

  const cards = [
    {
      id: 'budget',
      icon: DollarSign,
      color: 'blue',
      defaultTitle: 'Budget Guidance',
      ranges: [
        { range: '$5k - $20k', desc: 'Rising AI experts, academics, and tech consultants' },
        { range: '$20k - $50k', desc: 'Industry leaders, published authors, and proven speakers' },
        { range: '$50k+', desc: 'AI pioneers, tech founders, and household names' }
      ]
    },
    {
      id: 'audience',
      icon: Users,
      color: 'amber',
      defaultTitle: 'Audience Types',
      items: ['Corporate & Enterprise', 'Public Sector & Government', 'Startups & Scale-ups', 'Academic & Research', 'Healthcare & Life Sciences', 'Financial Services', 'Technology Companies']
    },
    {
      id: 'global',
      icon: Globe2,
      color: 'green',
      defaultTitle: 'Global Delivery',
      formats: [
        { name: 'In-Person Events', desc: 'Worldwide coverage with speaker coordination and booking support' },
        { name: 'Virtual Events', desc: 'Professional virtual keynotes optimized for online engagement' },
        { name: 'Hybrid Format', desc: 'Seamless blend of in-person and remote engagement for maximum reach' }
      ]
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <EditableText
            value={sectionTitle}
            onChange={(v) => onContentChange('home.navigate.section_title', v)}
            as="h2"
            className="text-4xl font-bold text-gray-900 mb-4 font-neue-haas"
            isModified={isModified('home.navigate.section_title', content, originalContent)}
            editorMode={editorMode}
          />
          <EditableText
            value={sectionSubtitle}
            onChange={(v) => onContentChange('home.navigate.section_subtitle', v)}
            as="p"
            className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat"
            multiline
            isModified={isModified('home.navigate.section_subtitle', content, originalContent)}
            editorMode={editorMode}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => {
            const titleKey = `home.navigate.${card.id}_title`
            const title = content[titleKey] || card.defaultTitle
            const Icon = card.icon
            const colorClasses = {
              blue: 'border-blue-200 from-[#1E68C6] to-blue-600',
              amber: 'border-amber-200 from-amber-400 to-amber-600',
              green: 'border-green-200 from-green-500 to-green-700'
            }

            return (
              <div key={card.id} className={`bg-white p-8 rounded-2xl shadow-xl border-2 ${colorClasses[card.color as keyof typeof colorClasses].split(' ')[0]}`}>
                <div className="mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[card.color as keyof typeof colorClasses].split(' ').slice(1).join(' ')} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <EditableText
                    value={title}
                    onChange={(v) => onContentChange(titleKey, v)}
                    as="h3"
                    className="text-2xl font-bold text-gray-900 font-neue-haas"
                    isModified={isModified(titleKey, content, originalContent)}
                    editorMode={editorMode}
                  />
                </div>
                {/* Card content preview - simplified */}
                <div className="space-y-3 opacity-70">
                  {card.id === 'budget' && card.ranges?.map((r, i) => (
                    <div key={i} className="border-l-4 border-blue-600 pl-4">
                      <div className="font-bold text-gray-900 font-montserrat text-sm">{r.range}</div>
                      <div className="text-xs text-gray-600">{r.desc}</div>
                    </div>
                  ))}
                  {card.id === 'audience' && card.items?.map((item, i) => (
                    <div key={i} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-amber-600 mr-2" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                  {card.id === 'global' && card.formats?.map((f, i) => (
                    <div key={i}>
                      <div className="font-bold text-gray-900 text-sm flex items-center">
                        <Check className="w-4 h-4 text-green-600 mr-2" />
                        {f.name}
                      </div>
                      <p className="text-xs text-gray-600 ml-6">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Home SEO Content Preview
function HomeSEOContentPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  // Using correct keys that match API defaults
  const mainHeading = content['home.seo-content.main_heading'] || 'AI Keynote Speakers: Transform Your Event with Leading AI Experts'
  const introParagraph = content['home.seo-content.intro_paragraph'] || 'Speak About AI is the premier AI keynote speakers bureau, representing over 70 of the world\'s most influential artificial intelligence speakers.'
  const whyHeading = content['home.seo-content.why_heading'] || 'Why Choose Our AI Speakers Bureau?'
  const whyParagraph = content['home.seo-content.why_paragraph'] || 'As a speaker bureau focused exclusively on artificial intelligence, we provide unparalleled expertise in matching your event with the perfect AI keynote speaker.'
  const industriesHeading = content['home.seo-content.industries_heading'] || 'Industries We Serve'
  const topicsHeading = content['home.seo-content.topics_heading'] || 'Popular AI Speaking Topics'

  // Default industries and topics
  const defaultIndustries = [
    'Technology & Software Companies',
    'Healthcare & Pharmaceutical',
    'Financial Services & Banking',
    'Manufacturing & Automotive',
    'Retail & E-commerce',
    'Education & Research Institutions'
  ]
  const defaultTopics = [
    'Generative AI & Large Language Models',
    'AI Strategy & Digital Transformation',
    'Machine Learning Applications',
    'AI Ethics & Responsible AI',
    'Future of Work with AI',
    'AI in Healthcare & Life Sciences'
  ]

  // Parse from JSON or use defaults
  const industriesJson = content['home.seo-content.industries_list']
  let industries = defaultIndustries
  if (industriesJson) {
    try { industries = JSON.parse(industriesJson) } catch (e) {}
  }

  const topicsJson = content['home.seo-content.topics_list']
  let topics = defaultTopics
  if (topicsJson) {
    try { topics = JSON.parse(topicsJson) } catch (e) {}
  }

  const bookHeading = content['home.seo-content.book_heading'] || 'Book an AI Speaker for Your Next Event'
  const bookParagraph = content['home.seo-content.book_paragraph'] || 'From keynote presentations at major conferences to executive briefings and workshop facilitation, our AI speakers bring cutting-edge insights and practical applications to every engagement.'
  const ctaButtonText = content['home.seo-content.cta_button_text'] || 'Book an AI Speaker Today'
  const closingParagraph = content['home.seo-content.closing_paragraph'] || 'Our clients include provincial governments, international conferences, Fortune 500 companies, leading universities, and innovative startups. When you book an AI keynote speaker through Speak About AI, you\'re partnering with the trusted leader in AI thought leadership.'

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <EditableText
            value={mainHeading}
            onChange={(v) => onContentChange('home.seo-content.main_heading', v)}
            as="h2"
            className="text-3xl font-bold text-black mb-6"
            isModified={isModified('home.seo-content.main_heading', content, originalContent)}
            editorMode={editorMode}
          />
          <EditableText
            value={introParagraph}
            onChange={(v) => onContentChange('home.seo-content.intro_paragraph', v)}
            as="p"
            className="text-lg text-gray-700 mb-4"
            multiline
            isModified={isModified('home.seo-content.intro_paragraph', content, originalContent)}
            editorMode={editorMode}
          />

          <EditableText
            value={whyHeading}
            onChange={(v) => onContentChange('home.seo-content.why_heading', v)}
            as="h3"
            className="text-2xl font-semibold text-black mt-8 mb-4"
            isModified={isModified('home.seo-content.why_heading', content, originalContent)}
            editorMode={editorMode}
          />
          <EditableText
            value={whyParagraph}
            onChange={(v) => onContentChange('home.seo-content.why_paragraph', v)}
            as="p"
            className="text-lg text-gray-700 mb-4"
            multiline
            isModified={isModified('home.seo-content.why_paragraph', content, originalContent)}
            editorMode={editorMode}
          />

          {/* Industries and Topics with editable titles and lists */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <EditableText
                value={industriesHeading}
                onChange={(v) => onContentChange('home.seo-content.industries_heading', v)}
                as="h3"
                className="text-xl font-semibold text-black mb-3"
                isModified={isModified('home.seo-content.industries_heading', content, originalContent)}
                editorMode={editorMode}
              />
              <ul className="space-y-2 text-gray-700 text-sm">
                {industries.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
              <div className="mt-3">
                <SimpleListEditor
                  items={industries}
                  onChange={(newItems) => onContentChange('home.seo-content.industries_list', JSON.stringify(newItems))}
                  isModified={isModified('home.seo-content.industries_list', content, originalContent)}
                  editorMode={editorMode}
                  title="Edit Industries"
                  buttonText="Edit Industries"
                />
              </div>
            </div>
            <div>
              <EditableText
                value={topicsHeading}
                onChange={(v) => onContentChange('home.seo-content.topics_heading', v)}
                as="h3"
                className="text-xl font-semibold text-black mb-3"
                isModified={isModified('home.seo-content.topics_heading', content, originalContent)}
                editorMode={editorMode}
              />
              <ul className="space-y-2 text-gray-700 text-sm">
                {topics.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
              <div className="mt-3">
                <SimpleListEditor
                  items={topics}
                  onChange={(newItems) => onContentChange('home.seo-content.topics_list', JSON.stringify(newItems))}
                  isModified={isModified('home.seo-content.topics_list', content, originalContent)}
                  editorMode={editorMode}
                  title="Edit Topics"
                  buttonText="Edit Topics"
                />
              </div>
            </div>
          </div>

          <EditableText
            value={bookHeading}
            onChange={(v) => onContentChange('home.seo-content.book_heading', v)}
            as="h3"
            className="text-2xl font-semibold text-black mt-8 mb-4"
            isModified={isModified('home.seo-content.book_heading', content, originalContent)}
            editorMode={editorMode}
          />
          <EditableText
            value={bookParagraph}
            onChange={(v) => onContentChange('home.seo-content.book_paragraph', v)}
            as="p"
            className="text-lg text-gray-700 mb-4"
            multiline
            isModified={isModified('home.seo-content.book_paragraph', content, originalContent)}
            editorMode={editorMode}
          />

          {/* CTA Button */}
          <div className="my-8 p-4 border border-dashed border-gray-300 rounded-lg">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">CTA Button:</span>
              <EditableText
                value={ctaButtonText}
                onChange={(v) => onContentChange('home.seo-content.cta_button_text', v)}
                className="font-semibold text-amber-600"
                isModified={isModified('home.seo-content.cta_button_text', content, originalContent)}
                editorMode={editorMode}
              />
            </div>
          </div>

          <EditableText
            value={closingParagraph}
            onChange={(v) => onContentChange('home.seo-content.closing_paragraph', v)}
            as="p"
            className="text-lg text-gray-700 mb-4"
            multiline
            isModified={isModified('home.seo-content.closing_paragraph', content, originalContent)}
            editorMode={editorMode}
          />
        </div>
      </div>
    </section>
  )
}

// Home FAQ Preview
function HomeFAQPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const sectionTitle = content['home.seo-faq.section_title'] || 'Frequently Asked Questions About Booking AI Speakers'

  const faqs = [
    { id: 'faq1', defaultQ: 'How do I book an AI keynote speaker?', defaultA: 'Simply browse our speakers, select your preferred AI expert, and contact us through our booking form. Our team will handle all logistics and ensure a seamless experience.' },
    { id: 'faq2', defaultQ: 'What makes Speak About AI different?', defaultA: 'We\'re the only speaker bureau focused exclusively on AI, giving us unmatched expertise in artificial intelligence thought leadership and deep relationships with top AI speakers.' },
    { id: 'faq3', defaultQ: 'Do you offer virtual AI keynote speakers?', defaultA: 'Yes, many of our AI speakers offer both in-person and virtual keynote presentations, ensuring global accessibility for your events.' },
    { id: 'faq4', defaultQ: 'What\'s the typical fee for an AI speaker?', defaultA: 'AI speaker fees typically range from $5K-$20K for emerging experts to $20K+ for industry leaders. Final pricing depends on format, location, date, and speaker requirements.' }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EditableText
          value={sectionTitle}
          onChange={(v) => onContentChange('home.seo-faq.section_title', v)}
          as="h2"
          className="text-3xl font-bold text-center text-black mb-12"
          isModified={isModified('home.seo-faq.section_title', content, originalContent)}
          editorMode={editorMode}
        />
        <div className="grid md:grid-cols-2 gap-8">
          {faqs.map((faq) => {
            const qKey = `home.seo-faq.${faq.id}_question`
            const aKey = `home.seo-faq.${faq.id}_answer`
            const question = content[qKey] || faq.defaultQ
            const answer = content[aKey] || faq.defaultA

            return (
              <div key={faq.id}>
                <EditableText
                  value={question}
                  onChange={(v) => onContentChange(qKey, v)}
                  as="h3"
                  className="text-xl font-semibold text-black mb-3"
                  isModified={isModified(qKey, content, originalContent)}
                  editorMode={editorMode}
                />
                <EditableText
                  value={answer}
                  onChange={(v) => onContentChange(aKey, v)}
                  as="p"
                  className="text-gray-700"
                  multiline
                  isModified={isModified(aKey, content, originalContent)}
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

// Home Booking CTA Preview
function HomeBookingCTAPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const title = content['home.booking-cta.title'] || 'Ready to Book Your AI Keynote Speaker?'
  const subtitle = content['home.booking-cta.subtitle'] || 'Connect with our expert team to find the perfect AI speaker for your event. We make the booking process seamless and efficient.'
  const primaryCtaText = content['home.booking-cta.primary_cta_text'] || 'Get Speaker Recommendations'
  const primaryCtaLink = content['home.booking-cta.primary_cta_link'] || '/contact?source=home_page_cta_main'
  const secondaryCtaText = content['home.booking-cta.secondary_cta_text'] || 'Explore All Speakers'
  const secondaryCtaLink = content['home.booking-cta.secondary_cta_link'] || '/speakers'
  const whatsappNumber = content['home.booking-cta.whatsapp_number'] || '+1 (510) 435-3947'
  const email = content['home.booking-cta.email'] || 'human@speakabout.ai'

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <EditableText
          value={title}
          onChange={(v) => onContentChange('home.booking-cta.title', v)}
          as="h2"
          className="text-4xl font-bold mb-6 font-neue-haas leading-tight"
          isModified={isModified('home.booking-cta.title', content, originalContent)}
          editorMode={editorMode}
        />
        <EditableText
          value={subtitle}
          onChange={(v) => onContentChange('home.booking-cta.subtitle', v)}
          as="p"
          className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto font-montserrat"
          multiline
          isModified={isModified('home.booking-cta.subtitle', content, originalContent)}
          editorMode={editorMode}
        />

        {/* CTA Buttons with editable text */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
          <div className="flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-lg">
            <Calendar className="w-5 h-5 text-amber-300" />
            <EditableText
              value={primaryCtaText}
              onChange={(v) => onContentChange('home.booking-cta.primary_cta_text', v)}
              className="text-white font-semibold"
              isModified={isModified('home.booking-cta.primary_cta_text', content, originalContent)}
              editorMode={editorMode}
            />
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
            <EditableText
              value={secondaryCtaText}
              onChange={(v) => onContentChange('home.booking-cta.secondary_cta_text', v)}
              className="text-white font-semibold"
              isModified={isModified('home.booking-cta.secondary_cta_text', content, originalContent)}
              editorMode={editorMode}
            />
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* CTA Links */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 text-xs text-blue-300">
          <div className="flex items-center gap-1">
            <span>Primary Link:</span>
            <EditableText
              value={primaryCtaLink}
              onChange={(v) => onContentChange('home.booking-cta.primary_cta_link', v)}
              className="text-blue-200"
              isModified={isModified('home.booking-cta.primary_cta_link', content, originalContent)}
              editorMode={editorMode}
            />
          </div>
          <div className="flex items-center gap-1">
            <span>Secondary Link:</span>
            <EditableText
              value={secondaryCtaLink}
              onChange={(v) => onContentChange('home.booking-cta.secondary_cta_link', v)}
              className="text-blue-200"
              isModified={isModified('home.booking-cta.secondary_cta_link', content, originalContent)}
              editorMode={editorMode}
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-sm text-blue-200 font-montserrat space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span>WhatsApp:</span>
            <EditableText
              value={whatsappNumber}
              onChange={(v) => onContentChange('home.booking-cta.whatsapp_number', v)}
              className="font-semibold text-white"
              isModified={isModified('home.booking-cta.whatsapp_number', content, originalContent)}
              editorMode={editorMode}
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>Email:</span>
            <EditableText
              value={email}
              onChange={(v) => onContentChange('home.booking-cta.email', v)}
              className="font-semibold text-white"
              isModified={isModified('home.booking-cta.email', content, originalContent)}
              editorMode={editorMode}
            />
          </div>
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

// Default offerings for preview
const defaultOfferings: ServiceOffering[] = [
  {
    id: 'offering1',
    image: '/services/adam-cheyer-stadium.jpg',
    title: 'Keynote Speeches',
    description: 'Inspire your audience with engaging and informative keynote speeches on the future of technology.'
  },
  {
    id: 'offering2',
    image: '/services/sharon-zhou-panel.jpg',
    title: 'Panel Discussions',
    description: 'Facilitate insightful and dynamic panel discussions on industry trends and challenges.'
  },
  {
    id: 'offering3',
    image: '/services/allie-k-miller-fireside.jpg',
    title: 'Fireside Chats',
    description: 'Create intimate and engaging conversations with industry leaders in a fireside chat format.'
  },
  {
    id: 'offering4',
    image: '/services/tatyana-mamut-speaking.jpg',
    title: 'Workshops',
    description: 'Provide hands-on learning experiences with interactive workshops tailored to your audience\'s needs.'
  },
  {
    id: 'offering5',
    image: '/services/sharon-zhou-headshot.png',
    title: 'Virtual Presentations',
    description: 'Reach a global audience with engaging and professional virtual presentations.'
  },
  {
    id: 'offering6',
    image: '/services/simon-pierro-youtube.jpg',
    title: 'Custom Video Content',
    description: 'Create compelling video content for marketing, training, and internal communications.'
  },
]

// Services Offerings Preview
function ServicesOfferingsPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  // Parse offerings from content or use defaults
  const offeringsJson = content['services.offerings.list']
  let offerings = defaultOfferings
  if (offeringsJson) {
    try {
      offerings = JSON.parse(offeringsJson)
    } catch (e) {
      // Use defaults if JSON parsing fails
    }
  }

  const handleOfferingsChange = (newOfferings: ServiceOffering[]) => {
    onContentChange('services.offerings.list', JSON.stringify(newOfferings))
  }

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Offerings Editor Button */}
        <div className="text-center mb-6">
          <OfferingsListEditor
            offerings={offerings}
            onChange={handleOfferingsChange}
            isModified={isModified('services.offerings.list', content, originalContent)}
            editorMode={editorMode}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((offering) => (
            <div key={offering.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative w-full aspect-[4/3] bg-gray-200">
                <img
                  src={offering.image}
                  alt={offering.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-2 font-neue-haas">
                  {offering.title}
                </h2>
                <p className="text-gray-700 font-montserrat text-sm">
                  {offering.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Services Process Preview
function ServicesProcessPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const sectionTitle = content['services.process.section_title'] || 'Our Process'
  const sectionSubtitle = content['services.process.section_subtitle'] || 'From initial consultation to final delivery, we ensure a seamless experience that brings world-class AI expertise to your event.'

  const steps = [
    { id: 'step1', defaultTitle: 'Contact Us', defaultDesc: 'Fill out our online form to request a free consultation. One of our team members will contact you within 24 hours to discuss your event needs.' },
    { id: 'step2', defaultTitle: 'Pick Your Speaker', defaultDesc: "Based on your event goals, audience, and budget, we'll provide a curated list of AI experts for you to consider." },
    { id: 'step3', defaultTitle: 'Enjoy Your Event', defaultDesc: "Once you've selected your speaker, we handle all the details—from booking to logistics to post-event follow-up." },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <EditableText
            value={sectionTitle}
            onChange={(v) => onContentChange('services.process.section_title', v)}
            as="h2"
            className="text-3xl font-bold text-gray-900 mb-4 font-neue-haas"
            isModified={isModified('services.process.section_title', content, originalContent)}
            editorMode={editorMode}
          />
          <EditableText
            value={sectionSubtitle}
            onChange={(v) => onContentChange('services.process.section_subtitle', v)}
            as="p"
            className="text-lg text-gray-600 max-w-3xl mx-auto font-montserrat"
            multiline
            isModified={isModified('services.process.section_subtitle', content, originalContent)}
            editorMode={editorMode}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const titleKey = `services.process.${step.id}_title`
            const descKey = `services.process.${step.id}_description`
            const title = content[titleKey] || step.defaultTitle
            const description = content[descKey] || step.defaultDesc

            return (
              <div key={step.id} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-[#1E68C6] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">{index + 1}</span>
                  </div>
                </div>
                <EditableText
                  value={title}
                  onChange={(v) => onContentChange(titleKey, v)}
                  as="h3"
                  className="text-xl font-bold text-gray-900 mb-3 font-neue-haas"
                  isModified={isModified(titleKey, content, originalContent)}
                  editorMode={editorMode}
                />
                <EditableText
                  value={description}
                  onChange={(v) => onContentChange(descKey, v)}
                  as="p"
                  className="text-gray-600 font-montserrat"
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

// Services Events Preview
function ServicesEventsPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const sectionTitle = content['services.events.section_title'] || 'Our In-Person Events'
  const sectionSubtitle = content['services.events.section_subtitle'] || 'In addition to helping others find keynote speakers for their events, we also host our own event series in the Bay Area, showcasing the speakers on our roster.'
  const latestEventTitle = content['services.events.latest_event_title'] || 'Latest Event'
  const latestEventDescription = content['services.events.latest_event_description'] || 'Our last event, hosted at Microsoft HQ in Silicon Valley, featured speakers such as Adam Cheyer, Peter Norvig, Maya Ackerman, Murray Newlands, Jeremiah Owyang, Katie McMahon, Max Sills, and many more.'
  const latestEventCta = content['services.events.latest_event_cta'] || "Whether you're an event planner, an executive, or just interested in AI, these events are a great way to get an overview of the current AI landscape!"
  const eventImage = content['services.events.event_image'] || '/events/robert-strong-on-stage-at-microsoft.jpg'
  const newsletterTitle = content['services.events.newsletter_title'] || 'Stay Updated'
  const newsletterDescription = content['services.events.newsletter_description'] || 'Sign up with your email address to stay up to date on our upcoming events.'

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <EditableText
            value={sectionTitle}
            onChange={(v) => onContentChange('services.events.section_title', v)}
            as="h2"
            className="text-3xl font-bold text-gray-900 mb-4 font-neue-haas"
            isModified={isModified('services.events.section_title', content, originalContent)}
            editorMode={editorMode}
          />
          <EditableText
            value={sectionSubtitle}
            onChange={(v) => onContentChange('services.events.section_subtitle', v)}
            as="p"
            className="text-lg text-gray-600 max-w-3xl mx-auto font-montserrat"
            multiline
            isModified={isModified('services.events.section_subtitle', content, originalContent)}
            editorMode={editorMode}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <EditableText
              value={latestEventTitle}
              onChange={(v) => onContentChange('services.events.latest_event_title', v)}
              as="h3"
              className="text-2xl font-bold text-gray-900 mb-4 font-neue-haas"
              isModified={isModified('services.events.latest_event_title', content, originalContent)}
              editorMode={editorMode}
            />
            <EditableText
              value={latestEventDescription}
              onChange={(v) => onContentChange('services.events.latest_event_description', v)}
              as="p"
              className="text-gray-600 mb-6 font-montserrat"
              multiline
              isModified={isModified('services.events.latest_event_description', content, originalContent)}
              editorMode={editorMode}
            />
            <EditableImage
              src={eventImage}
              alt="Event photo"
              onChange={(newSrc) => onContentChange('services.events.event_image', newSrc)}
              isModified={isModified('services.events.event_image', content, originalContent)}
              editorMode={editorMode}
              className="w-full h-48 object-cover rounded-lg mb-4"
              uploadFolder="events"
            />
            <EditableText
              value={latestEventCta}
              onChange={(v) => onContentChange('services.events.latest_event_cta', v)}
              as="p"
              className="text-gray-600 font-montserrat"
              multiline
              isModified={isModified('services.events.latest_event_cta', content, originalContent)}
              editorMode={editorMode}
            />
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <EditableText
              value={newsletterTitle}
              onChange={(v) => onContentChange('services.events.newsletter_title', v)}
              as="h3"
              className="text-2xl font-bold text-gray-900 mb-4 font-neue-haas"
              isModified={isModified('services.events.newsletter_title', content, originalContent)}
              editorMode={editorMode}
            />
            <EditableText
              value={newsletterDescription}
              onChange={(v) => onContentChange('services.events.newsletter_description', v)}
              as="p"
              className="text-gray-600 mb-6 font-montserrat"
              multiline
              isModified={isModified('services.events.newsletter_description', content, originalContent)}
              editorMode={editorMode}
            />
            <div className="space-y-3 opacity-70">
              <div className="h-10 bg-gray-100 rounded border border-gray-200"></div>
              <div className="h-10 bg-gray-100 rounded border border-gray-200"></div>
              <div className="h-10 bg-[#1E68C6] rounded flex items-center justify-center text-white text-sm">Subscribe</div>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center italic">Newsletter form preview</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Services FAQ Preview
function ServicesFAQPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const sectionTitle = content['services.faq.section_title'] || 'Frequently Asked Questions'

  const faqs = [
    { id: 'faq1', defaultQ: 'How long are typical speaking engagements?', defaultA: "The duration can vary based on your needs. Keynotes typically range from 30-60 minutes, while workshops can be half-day or full-day events. We're flexible and can adjust the format to fit your schedule." },
    { id: 'faq2', defaultQ: 'Can we book multiple services for a single event?', defaultA: 'Yes, many clients combine our services. For example, you might book a keynote speaker for a large session, followed by a smaller workshop or fireside chat. We can help you design a program that maximizes value for your audience.' },
    { id: 'faq3', defaultQ: 'Can your speakers create custom content for our event?', defaultA: 'Absolutely. Our speakers are happy to tailor their presentations to your specific needs, industry, and audience. This ensures that the content is relevant and valuable to your attendees.' },
    { id: 'faq4', defaultQ: 'How do you tailor your services to different industries?', defaultA: "Our diverse roster of AI experts allows us to match speakers and content to your specific industry. Whether you're in healthcare, finance, technology, or any other sector, we can provide relevant insights and applications of AI to your field." }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <EditableText
            value={sectionTitle}
            onChange={(v) => onContentChange('services.faq.section_title', v)}
            as="h2"
            className="text-3xl font-bold text-gray-900 mb-4 font-neue-haas"
            isModified={isModified('services.faq.section_title', content, originalContent)}
            editorMode={editorMode}
          />
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const qKey = `services.faq.${faq.id}_question`
            const aKey = `services.faq.${faq.id}_answer`
            const question = content[qKey] || faq.defaultQ
            const answer = content[aKey] || faq.defaultA

            return (
              <div key={faq.id} className="bg-gray-50 rounded-lg p-6">
                <EditableText
                  value={question}
                  onChange={(v) => onContentChange(qKey, v)}
                  as="h3"
                  className="text-lg font-semibold text-gray-900 mb-2 font-neue-haas"
                  isModified={isModified(qKey, content, originalContent)}
                  editorMode={editorMode}
                />
                <EditableText
                  value={answer}
                  onChange={(v) => onContentChange(aKey, v)}
                  as="p"
                  className="text-gray-600 font-montserrat"
                  multiline
                  isModified={isModified(aKey, content, originalContent)}
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

// Services Contact Preview
function ServicesContactPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const title = content['services.cta.title'] || 'Ready to Elevate Your Event?'
  const subtitle = content['services.cta.subtitle'] || 'Let us connect you with the perfect AI expert to inspire your audience and drive meaningful conversations about the future of artificial intelligence.'
  const buttonText = content['services.cta.button_text'] || 'Book Speaker Today'
  const stat1Value = content['services.cta.stat1_value'] || '24 Hours'
  const stat1Label = content['services.cta.stat1_label'] || 'Average Response Time'
  const stat2Value = content['services.cta.stat2_value'] || '67+'
  const stat2Label = content['services.cta.stat2_label'] || 'AI Experts Available'
  const stat3Value = content['services.cta.stat3_value'] || '500+'
  const stat3Label = content['services.cta.stat3_label'] || 'Successful Events'

  return (
    <section className="py-16 bg-[#1E68C6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <EditableText
          value={title}
          onChange={(v) => onContentChange('services.cta.title', v)}
          as="h2"
          className="text-3xl font-bold text-white mb-6 font-neue-haas"
          isModified={isModified('services.cta.title', content, originalContent)}
          editorMode={editorMode}
        />
        <EditableText
          value={subtitle}
          onChange={(v) => onContentChange('services.cta.subtitle', v)}
          as="p"
          className="text-lg text-white text-opacity-90 mb-10 max-w-3xl mx-auto font-montserrat"
          multiline
          isModified={isModified('services.cta.subtitle', content, originalContent)}
          editorMode={editorMode}
        />

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 rounded-lg">
            <EditableText
              value={buttonText}
              onChange={(v) => onContentChange('services.cta.button_text', v)}
              className="text-white font-semibold"
              isModified={isModified('services.cta.button_text', content, originalContent)}
              editorMode={editorMode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <EditableText
              value={stat1Value}
              onChange={(v) => onContentChange('services.cta.stat1_value', v)}
              as="div"
              className="text-3xl font-bold text-white mb-2 font-neue-haas"
              isModified={isModified('services.cta.stat1_value', content, originalContent)}
              editorMode={editorMode}
            />
            <EditableText
              value={stat1Label}
              onChange={(v) => onContentChange('services.cta.stat1_label', v)}
              as="div"
              className="text-white text-opacity-90 font-montserrat"
              isModified={isModified('services.cta.stat1_label', content, originalContent)}
              editorMode={editorMode}
            />
          </div>
          <div>
            <EditableText
              value={stat2Value}
              onChange={(v) => onContentChange('services.cta.stat2_value', v)}
              as="div"
              className="text-3xl font-bold text-white mb-2 font-neue-haas"
              isModified={isModified('services.cta.stat2_value', content, originalContent)}
              editorMode={editorMode}
            />
            <EditableText
              value={stat2Label}
              onChange={(v) => onContentChange('services.cta.stat2_label', v)}
              as="div"
              className="text-white text-opacity-90 font-montserrat"
              isModified={isModified('services.cta.stat2_label', content, originalContent)}
              editorMode={editorMode}
            />
          </div>
          <div>
            <EditableText
              value={stat3Value}
              onChange={(v) => onContentChange('services.cta.stat3_value', v)}
              as="div"
              className="text-3xl font-bold text-white mb-2 font-neue-haas"
              isModified={isModified('services.cta.stat3_value', content, originalContent)}
              editorMode={editorMode}
            />
            <EditableText
              value={stat3Label}
              onChange={(v) => onContentChange('services.cta.stat3_label', v)}
              as="div"
              className="text-white text-opacity-90 font-montserrat"
              isModified={isModified('services.cta.stat3_label', content, originalContent)}
              editorMode={editorMode}
            />
          </div>
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
        <HomeClientLogosPreview
          content={content}
          originalContent={originalContent}
          onContentChange={onContentChange}
          editorMode={editorMode}
        />
        <HomeFeaturedSpeakersPreview
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
        <HomeNavigateTheNoisePreview
          content={content}
          originalContent={originalContent}
          onContentChange={onContentChange}
          editorMode={editorMode}
        />
        <HomeSEOContentPreview
          content={content}
          originalContent={originalContent}
          onContentChange={onContentChange}
          editorMode={editorMode}
        />
        <HomeFAQPreview
          content={content}
          originalContent={originalContent}
          onContentChange={onContentChange}
          editorMode={editorMode}
        />
        <HomeBookingCTAPreview
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
        <ServicesProcessPreview
          content={content}
          originalContent={originalContent}
          onContentChange={onContentChange}
          editorMode={editorMode}
        />
        <ServicesEventsPreview
          content={content}
          originalContent={originalContent}
          onContentChange={onContentChange}
          editorMode={editorMode}
        />
        <ServicesFAQPreview
          content={content}
          originalContent={originalContent}
          onContentChange={onContentChange}
          editorMode={editorMode}
        />
        <ServicesContactPreview
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
