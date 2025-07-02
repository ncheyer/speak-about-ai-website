import type React from "react"
import { Check, Mail, ListChecks } from "lucide-react"
import type { LandingPageEventChecklist } from "@/types/contentful-checklist"

const iconMap: { [key: string]: React.ElementType } = {
  Mail: Mail,
  Check: Check,
  ListChecks: ListChecks,
}

export function HowItWorksSection({ steps }: Pick<LandingPageEventChecklist, "howItWorksSteps">) {
  return (
    <section className="bg-gray-50 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600">Get your personalized event checklist in 3 simple steps.</p>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-12 text-center">
          {steps.map((step, index) => {
            const Icon = iconMap[step.fields.icon] || ListChecks
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-lg">
                  <Icon className="h-10 w-10" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">{step.fields.title}</h3>
                <p className="mt-2 text-base text-gray-600">{step.fields.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
