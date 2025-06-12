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
          <button
            className="btn-yellow inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 font-montserrat"
            data-button="yellow"
            style={{
              background: "linear-gradient(to right, #F59E0B, #D97706)",
              color: "white",
              border: "none",
              height: "44px",
            }}
          >
            <Calendar className="w-5 h-5 mr-2" />
            <Link href="/contact?source=homepage_cta" className="text-white no-underline">
              Contact Us
            </Link>
          </button>
          <button
            className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium px-8 py-4 border font-montserrat"
            data-button="primary"
            style={{
              backgroundColor: "#1E68C6",
              color: "white",
              borderColor: "white",
              height: "44px",
            }}
          >
            <Phone className="w-5 h-5 mr-2" />
            <a href="tel:+1-510-435-3947" className="text-white no-underline">
              Call Now: (510) 435-3947
            </a>
          </button>
          <button
            className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium px-8 py-4 border font-montserrat"
            data-button="primary"
            style={{
              backgroundColor: "#1E68C6",
              color: "white",
              borderColor: "white",
              height: "44px",
            }}
          >
            <Mail className="w-5 h-5 mr-2" />
            <a href="mailto:human@speakabout.ai" className="text-white no-underline">
              Email Us
            </a>
          </button>
        </div>
      </div>
    </section>
  )
}
