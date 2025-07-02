import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import type { Entry } from "contentful"
import type { ProcessStep } from "@/types/contentful-landing-page"

interface HowItWorksSectionProps {
  steps: Entry<ProcessStep>[] | undefined
}

export default function HowItWorksSection({ steps }: HowItWorksSectionProps) {
  if (!steps || steps.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600">A simple, three-step process to get your custom checklist.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const { title, description } = step.fields
            if (!title || !description) return null

            return (
              <div key={step.sys.id} className="p-8 bg-gray-50 rounded-lg shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white font-bold text-xl mb-6">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <div className="mt-2 text-base text-gray-600 prose max-w-none">
                  {documentToReactComponents(description)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
