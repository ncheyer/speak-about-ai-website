"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import type { Entry } from "contentful"
import type { FaqItem } from "@/types/contentful-landing-page"

interface FaqSectionProps {
  items: Entry<FaqItem>[] | undefined
}

export default function FaqSection({ items }: FaqSectionProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {items.map((item) => {
            const { question, answer } = item.fields
            if (!question || !answer) return null

            return (
              <AccordionItem key={item.sys.id} value={item.sys.id}>
                <AccordionTrigger className="text-lg font-semibold text-left">{question}</AccordionTrigger>
                <AccordionContent className="text-base text-gray-600 prose max-w-none">
                  {documentToReactComponents(answer)}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}
