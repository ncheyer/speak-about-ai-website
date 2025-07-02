import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { EmailCaptureForm } from "./email-capture-form"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import type { LandingPage } from "@/types/contentful-landing-page"

export default function HeroSection({ data }: { data: LandingPage }) {
  const { heroHeadline, heroSubheadline, heroBulletPoints, heroImage, formFields, formSettings } = data

  const imageUrl = heroImage?.fields?.file?.url
    ? `https:${heroImage.fields.file.url}`
    : "/placeholder.svg?width=600&height=600"

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
              {heroHeadline}
            </h1>
            <div className="mt-6 text-lg text-gray-600 prose lg:prose-xl">
              {documentToReactComponents(heroSubheadline)}
            </div>
            <ul className="mt-8 space-y-3">
              {heroBulletPoints.map((point, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <EmailCaptureForm formFields={formFields} formSettings={formSettings} />
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400 to-blue-500 rounded-full blur-3xl opacity-30"></div>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={heroImage?.fields?.description || "Event planning illustration"}
              width={600}
              height={600}
              className="rounded-lg shadow-2xl relative z-10"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
