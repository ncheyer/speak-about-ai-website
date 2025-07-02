"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import type { LandingPageEventChecklist } from "@/types/contentful-checklist"

export function FaqSection({ items }: Pick<LandingPageEventChecklist, "faqSection">) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-semibold text-left">{item.fields.question}</AccordionTrigger>
              <AccordionContent className="text-base text-gray-700 prose">
                {documentToReactComponents(item.fields.answer)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
