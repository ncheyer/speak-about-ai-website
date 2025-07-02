"use client"

import type { Entry } from "contentful"
import type { FaqItem } from "@/types/contentful-landing-page"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"

export default function FaqSection({ items }: { items: Entry<FaqItem>[] }) {
  if (!items || items.length === 0) return null

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full mt-12">
            {items.map((item) => (
              <AccordionItem key={item.sys.id} value={item.sys.id}>
                <AccordionTrigger className="text-lg font-medium text-left">{item.fields.question}</AccordionTrigger>
                <AccordionContent className="text-base text-gray-600 prose">
                  {documentToReactComponents(item.fields.answer)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
