import Image from "next/image"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { CheckCircle } from "lucide-react"
import type { LandingPage } from "@/types/contentful-landing-page"
import EmailCaptureForm from "./email-capture-form"

interface HeroSectionProps {
  data: LandingPage
}

export default function HeroSection({ data }: HeroSectionProps) {
  const { heroHeadline, heroSubheadline, heroBulletPoints, heroImage, formFields, formSettings } = data

  const imageUrl = heroImage?.fields?.file?.url
  const imageAlt = heroImage?.fields?.description || heroHeadline

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              {heroHeadline || "Event Planning, Simplified"}
            </h1>
            {heroSubheadline && (
              <div className="mt-4 text-lg text-gray-600 prose max-w-none">
                {documentToReactComponents(heroSubheadline)}
              </div>
            )}
            {heroBulletPoints && heroBulletPoints.length > 0 && (
              <ul className="mt-6 space-y-3">
                {heroBulletPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            )}
            {formFields && formSettings && (
              <div className="mt-8">
                <EmailCaptureForm formFields={formFields} formSettings={formSettings} />
              </div>
            )}
          </div>
          <div className="relative h-80 md:h-full">
            {imageUrl && (
              <Image
                src={`https:${imageUrl}`}
                alt={imageAlt}
                fill
                className="object-cover rounded-lg shadow-2xl"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
