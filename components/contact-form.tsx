"use client"

import { useEffect, Suspense } from "react"
import { Phone, Mail, Clock } from "lucide-react"
import { useSearchParams } from "next/navigation"

function ContactFormContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const source = searchParams.get("source")
    const speakerName = searchParams.get("speakerName")
    const industry = searchParams.get("industry")

    if (source || speakerName || industry) {
      console.log("Pipedrive Contact Form received URL parameters:")
      if (source) console.log(`- Source: ${source}`)
      if (speakerName) console.log(`- Speaker Name: ${speakerName}`)
      if (industry) console.log(`- Industry: ${industry}`)
      console.log("Ensure your Pipedrive webform is configured to map these parameters to fields.")
    }
  }, [searchParams])

  useEffect(() => {
    // Load Pipedrive webforms script
    const script = document.createElement("script")
    script.src = "https://webforms.pipedrive.com/f/loader"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="bg-gradient-to-br from-[#EAEAEE] to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get personalized speaker recommendations and check availability for your next event.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-[#1E68C6]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Call Us</h3>
                    <p className="mt-1 text-gray-600">(510) 435-3947</p>
                    <p className="mt-1 text-sm text-gray-500">Monday-Friday, 9am-6pm PT</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-[#1E68C6]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                    <p className="mt-1 text-gray-600">human@speakabout.ai</p>
                    <p className="mt-1 text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-[#1E68C6]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Response Time</h3>
                    <p className="mt-1 text-gray-600">24 Hours</p>
                    <p className="mt-1 text-sm text-gray-500">For speaker availability and quotes</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Why Choose Speak About AI?</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                    <span>Exclusive AI speaker representation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                    <span>Personalized speaker matching</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                    <span>Trusted by Fortune 500 companies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 text-[#1E68C6] mr-2">•</span>
                    <span>Seamless booking experience</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pipedrive Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Pipedrive Webform */}
              <div
                className="pipedriveWebForms"
                data-pd-webforms="https://webforms.pipedrive.com/f/ctoswBHcheTWUjcfitBTRlIxoOj7jOhHg1GA8CSpVYWp45oKsrxtQnDSAiwekwzSvN"
              />

              <p className="text-sm text-gray-500 mt-6 text-center">
                We'll respond with availability and recommendations within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContactForm() {
  return (
    <Suspense fallback={
      <div className="bg-gradient-to-br from-[#EAEAEE] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ContactFormContent />
    </Suspense>
  )
}
