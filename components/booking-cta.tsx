import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Phone } from "lucide-react"

export default function BookingCTA() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-4xl font-bold mb-6 font-neue-haas leading-tight">Ready to Book Your AI Keynote Speaker?</h2>
        <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto font-montserrat">
          Connect with our expert team to find the perfect AI speaker for your event. We make the booking process
          seamless and efficient.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4 font-montserrat group"
          >
            <Link href="/contact?source=home_page_cta_main">
              <Calendar className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
              Get Speaker Recommendations
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-blue-700 transition-all duration-300 text-lg px-8 py-4 font-montserrat group"
          >
            <Link href="/speakers">
              Explore All Speakers
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <p className="mt-8 text-sm text-blue-200 font-montserrat">
          Or call us directly:{" "}
          <a
            href="tel:+1-510-435-3947"
            className="font-semibold hover:underline flex items-center justify-center sm:inline-flex"
          >
            <Phone className="w-4 h-4 mr-1" /> (510) 435-3947
          </a>
        </p>
      </div>
    </section>
  )
}
