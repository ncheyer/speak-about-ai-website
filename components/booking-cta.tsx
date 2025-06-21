import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Phone } from "lucide-react" // Assuming Calendar is the correct icon, not CalendarDays

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
            variant="gold"
            size="lg"
            className="font-montserrat font-bold transition-all duration-300 ease-in-out transform hover:scale-105 group"
          >
            <Link href="/contact?source=home_page_cta_main" className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
              Get Speaker Recommendations
            </Link>
          </Button>
          <Button
            asChild
            variant="outline" // Assuming this button should remain an outline style
            size="lg"
            className="border-white text-white hover:bg-white hover:text-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 group font-montserrat"
          >
            <Link href="/speakers" className="flex items-center">
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
