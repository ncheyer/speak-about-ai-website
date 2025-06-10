"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqs = [
    {
      question: "How long are typical speaking engagements?",
      answer:
        "The duration can vary based on your needs. Keynotes typically range from 30-60 minutes, while workshops can be half-day or full-day events. We're flexible and can adjust the format to fit your schedule.",
    },
    {
      question: "Can we book multiple services for a single event?",
      answer:
        "Yes, many clients combine our services. For example, you might book a keynote speaker for a large session, followed by a smaller workshop or fireside chat. We can help you design a program that maximizes value for your audience.",
    },
    {
      question: "Can your speakers create custom content for our event?",
      answer:
        "Absolutely. Our speakers are happy to tailor their presentations to your specific needs, industry, and audience. This ensures that the content is relevant and valuable to your attendees.",
    },
    {
      question: "How do you tailor your services to different industries?",
      answer:
        "Our diverse roster of AI experts allows us to match speakers and content to your specific industry. Whether you're in healthcare, finance, technology, or any other sector, we can provide relevant insights and applications of AI to your field.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-neue-haas">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-lg">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 font-neue-haas">{faq.question}</h3>
                {openFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openFAQ === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 font-montserrat">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
