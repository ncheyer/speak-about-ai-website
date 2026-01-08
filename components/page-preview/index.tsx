"use client"

import { Award, MapPin, Globe, Shield, Clock, Users, Headphones, Target, DollarSign, Globe2, Check, Calendar, ArrowRight } from "lucide-react"
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

// Home Client Logos Preview
function HomeClientLogosPreview({
  content,
  originalContent,
  onContentChange,
  editorMode = true
}: Omit<PagePreviewProps, 'page'>) {
  const title = content['home.client-logos.title'] || 'Trusted by Industry Leaders'
  const subtitle = content['home.client-logos.subtitle'] || 'Our speakers have worked with leading organizations around the world for their most important events.'

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
        {/* Logo carousel preview placeholder */}
        <div className="flex justify-center gap-8 py-6 opacity-60">
          <div className="w-24 h-12 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-500">Logo 1</div>
          <div className="w-24 h-12 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-500">Logo 2</div>
          <div className="w-24 h-12 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-500">Logo 3</div>
          <div className="w-24 h-12 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-500">Logo 4</div>
        </div>
        <p className="text-center text-xs text-gray-400 italic">Logo carousel - logos are hardcoded, only title/subtitle editable</p>
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
  const mainTitle = content['home.seo-content.main_title'] || 'AI Keynote Speakers: Transform Your Event with Leading AI Experts'
  const intro = content['home.seo-content.intro'] || 'Speak About AI is the premier AI keynote speakers bureau, representing over 70 of the world\'s most influential artificial intelligence speakers.'
  const whyTitle = content['home.seo-content.why_title'] || 'Why Choose Our AI Speakers Bureau?'
  const whyText = content['home.seo-content.why_text'] || 'As a speaker bureau focused exclusively on artificial intelligence, we provide unparalleled expertise in matching your event with the perfect AI keynote speaker.'
  const bookTitle = content['home.seo-content.book_title'] || 'Book an AI Speaker for Your Next Event'
  const bookText = content['home.seo-content.book_text'] || 'From keynote presentations at major conferences to executive briefings and workshop facilitation, our AI speakers bring cutting-edge insights and practical applications to every engagement.'

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <EditableText
            value={mainTitle}
            onChange={(v) => onContentChange('home.seo-content.main_title', v)}
            as="h2"
            className="text-3xl font-bold text-black mb-6"
            isModified={isModified('home.seo-content.main_title', content, originalContent)}
            editorMode={editorMode}
          />
          <EditableText
            value={intro}
            onChange={(v) => onContentChange('home.seo-content.intro', v)}
            as="p"
            className="text-lg text-gray-700 mb-4"
            multiline
            isModified={isModified('home.seo-content.intro', content, originalContent)}
            editorMode={editorMode}
          />

          <EditableText
            value={whyTitle}
            onChange={(v) => onContentChange('home.seo-content.why_title', v)}
            as="h3"
            className="text-2xl font-semibold text-black mt-8 mb-4"
            isModified={isModified('home.seo-content.why_title', content, originalContent)}
            editorMode={editorMode}
          />
          <EditableText
            value={whyText}
            onChange={(v) => onContentChange('home.seo-content.why_text', v)}
            as="p"
            className="text-lg text-gray-700 mb-4"
            multiline
            isModified={isModified('home.seo-content.why_text', content, originalContent)}
            editorMode={editorMode}
          />

          {/* Industries and Topics - static preview */}
          <div className="grid md:grid-cols-2 gap-8 mt-8 opacity-70">
            <div>
              <h3 className="text-xl font-semibold text-black mb-3">Industries We Serve</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Technology & Software Companies</li>
                <li>• Healthcare & Pharmaceutical</li>
                <li>• Financial Services & Banking</li>
                <li>• Manufacturing & Automotive</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black mb-3">Popular AI Speaking Topics</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Generative AI & Large Language Models</li>
                <li>• AI Strategy & Digital Transformation</li>
                <li>• Machine Learning Applications</li>
                <li>• AI Ethics & Responsible AI</li>
              </ul>
            </div>
          </div>

          <EditableText
            value={bookTitle}
            onChange={(v) => onContentChange('home.seo-content.book_title', v)}
            as="h3"
            className="text-2xl font-semibold text-black mt-8 mb-4"
            isModified={isModified('home.seo-content.book_title', content, originalContent)}
            editorMode={editorMode}
          />
          <EditableText
            value={bookText}
            onChange={(v) => onContentChange('home.seo-content.book_text', v)}
            as="p"
            className="text-lg text-gray-700 mb-4"
            multiline
            isModified={isModified('home.seo-content.book_text', content, originalContent)}
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
  const contactInfo = content['home.booking-cta.contact_info'] || 'Text or call us at +1 (510) 435-3947 on WhatsApp or reach out to human@speakabout.ai by email'

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
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <Button variant="gold" size="lg" className="pointer-events-none opacity-80">
            <Calendar className="w-5 h-5 mr-2" />
            Get Speaker Recommendations
          </Button>
          <Button variant="default" size="lg" className="bg-white text-blue-700 pointer-events-none opacity-80">
            Explore All Speakers
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
        <EditableText
          value={contactInfo}
          onChange={(v) => onContentChange('home.booking-cta.contact_info', v)}
          as="p"
          className="text-sm text-blue-200 font-montserrat"
          multiline
          isModified={isModified('home.booking-cta.contact_info', content, originalContent)}
          editorMode={editorMode}
        />
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
        <HomeClientLogosPreview
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
