import { Button } from "@/components/ui/button"
import { Phone, Mail, Calendar } from "lucide-react"
import Link from "next/link"

export default function BookingCTA() {
  return (
    <section className="py-20 bg-[#1E68C6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6 font-neue-haas">Ready to Book Your AI Keynote Speaker?</h2>
        <p className="text-xl text-white text-opacity-90 mb-10 max-w-3xl mx-auto font-montserrat">
          Join Fortune 500 companies who trust us to deliver world-class AI expertise. Get personalized speaker
          recommendations and availability within 24 hours.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4 font-montserrat"
          >
            <Link href="/contact">
              <Calendar className="w-5 h-5 mr-2" />
              Contact Us
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-[#1E68C6] text-lg px-8 py-4 font-montserrat"
          >
            <a href="tel:+1-510-435-3947">
              <Phone className="w-5 h-5 mr-2" />
              Call Now: (510) 435-3947
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-[#1E68C6] text-lg px-8 py-4 font-montserrat"
          >
            <a href="mailto:human@speakabout.ai">
              <Mail className="w-5 h-5 mr-2" />
              Email Us
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-2 font-neue-haas">24 Hours</div>
            <div className="text-white text-opacity-90 font-montserrat">Average Response Time</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2 font-neue-haas">500+</div>
            <div className="text-white text-opacity-90 font-montserrat">Successful Events</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2 font-neue-haas">98%</div>
            <div className="text-white text-opacity-90 font-montserrat">Client Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  )
}
