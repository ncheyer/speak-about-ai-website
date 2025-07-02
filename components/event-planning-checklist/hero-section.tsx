import { CheckCircle } from "lucide-react"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import type { LandingPageEventChecklist } from "@/types/contentful-checklist"
import { EmailCaptureForm } from "./email-capture-form"

type HeroSectionProps = Pick<
  LandingPageEventChecklist,
  "heroHeadline" | "heroSubheadline" | "heroBulletPoints" | "heroImage" | "formFields" | "formSettings"
>

export function HeroSection({
  headline,
  subheadline,
  bulletPoints,
  image,
  formFields,
  formSettings,
}: HeroSectionProps) {
  const imageUrl = image.fields.file?.url ? `https:${image.fields.file.url}` : "/placeholder.svg"
  const imageAlt = image.fields.description || "Event planning checklist illustration"

  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-purple-800 to-gray-900 opacity-90"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">{headline}</h1>
            <div className="mt-6 text-lg text-blue-100 prose prose-invert">
              {documentToReactComponents(subheadline)}
            </div>
            <ul className="mt-8 space-y-3">
              {bulletPoints.map((point, index) => (
                <li key={index} className="flex items-center text-base">
                  <CheckCircle className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
            <EmailCaptureForm formFields={formFields} formSettings={formSettings} />
          </div>
        </div>
      </div>
    </section>
  )
}
