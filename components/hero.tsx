import { Button } from "@/components/ui/button"
import { Users, Award, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#EAEAEE] to-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-[#1E68C6] bg-opacity-10 text-[#1E68C6] rounded-full text-sm font-medium mb-6 font-montserrat">
              <Award className="w-4 h-4 mr-2" />
              AI-Exclusive Speaker Bureau
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight font-neue-haas">
              Book Top AI Keynote Speakers
            </h1>

            <p className="text-xl text-[#5084C6] mb-8 font-montserrat font-semibold">
              From Siri co-founders to Google AI researchers
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4 font-montserrat"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-[#1E68C6] text-[#1E68C6] hover:bg-[#1E68C6] hover:bg-opacity-10 font-montserrat"
              >
                <Link href="/speakers">Browse Speakers</Link>
              </Button>
            </div>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#1E68C6] mr-2" />
                  <span className="text-2xl font-bold text-black font-neue-haas">67+</span>
                </div>
                <p className="text-gray-600 font-montserrat text-xs">AI Experts</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#1E68C6] mr-2" />
                  <span className="text-2xl font-bold text-black font-neue-haas">Silicon Valley</span>
                </div>
                <p className="text-gray-600 font-montserrat text-xs">Based</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#1E68C6] mr-2" />
                  <span className="text-2xl font-bold text-black font-neue-haas">24hr</span>
                </div>
                <p className="text-gray-600 font-montserrat text-xs">Response</p>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/hero-image.png"
                alt="AI Speakers Panel featuring Adam Cheyer (Siri Co-Founder), Peter Norvig (Google & Stanford AI Researcher), and Robert Strong (Speak About AI Co-Founder)"
                width={700}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
