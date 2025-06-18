"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import { useEffect } from "react"
import Image from "next/image"

export default function EventsSection() {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://webforms.pipedrive.com/f/loader"
    script.async = true
    document.body.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src="https://webforms.pipedrive.com/f/loader"]')
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [])

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-neue-haas">Our In-Person Events</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
            In addition to helping others find keynote speakers for their events, we also host our own event series in
            the Bay Area, showcasing the speakers on our roster.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-[#1E68C6] mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900 font-neue-haas">Latest Event</h3>
                </div>
                <p className="text-gray-600 mb-6 font-montserrat">
                  Our last event, hosted at Microsoft HQ in Silicon Valley, featured speakers such as Adam Cheyer, Peter
                  Norvig, Maya Ackerman, Murray Newlands, Jeremiah Owyang, Katie McMahon, Max Sills, and many more.
                </p>
                <div className="mb-6">
                  <Image
                    src="/events/robert-strong-on-stage-at-microsoft.jpg"
                    alt="Robert Strong presenting on stage at Microsoft HQ event"
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <p className="text-gray-600 font-montserrat">
                  Whether you're an event planner, an executive, or just interested in AI, these events are a great way
                  to get an overview of the current AI landscape!
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <div>
              <Card className="bg-white shadow-lg border-0">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Calendar className="w-6 h-6 text-[#1E68C6] mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900 font-neue-haas">Stay Updated</h3>
                  </div>
                  <p className="text-gray-600 mb-0 font-montserrat">
                    Sign up with your email address to stay up to date on our upcoming events.
                  </p>
                  <div
                    className="pipedriveWebForms"
                    data-pd-webforms="https://webforms.pipedrive.com/f/5VC4HN8hdvjKvpaA69lAC7vLQ7nBVviY7oXImlS3k7liMwClEdDrGDXdBOtBz00QhB"
                  ></div>
                  <p className="text-xs text-gray-500 mt-4 text-center font-montserrat">We respect your privacy.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
