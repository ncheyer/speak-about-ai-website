import type React from "react"
import type { Entry } from "contentful"
import type { ProcessStep } from "@/types/contentful-landing-page"
import { Check, Mail, FileText, ArrowRight } from "lucide-react"

const iconMap: { [key: string]: React.ElementType } = {
  Mail: Mail,
  FileText: FileText,
  Check: Check,
  default: ArrowRight,
}

export default function HowItWorksSection({ steps }: { steps: Entry<ProcessStep>[] }) {
  if (!steps || steps.length === 0) return null

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600">Get your personalized checklist in 3 simple steps.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = iconMap[step.fields.icon] || iconMap.default
            return (
              <div
                key={step.sys.id}
                className="text-center p-8 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mx-auto">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">{step.fields.title}</h3>
                <p className="mt-2 text-base text-gray-600">{step.fields.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
