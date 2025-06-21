import { Award, MapPin, Globe } from "lucide-react" // Added Globe
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button" // Import the Button component

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

            <p className="text-xl text-black mb-8 font-montserrat font-semibold">
              <span className="font-bold">50+ experts in every industry</span>, including the co-author of "Artifical
              Intelligence: A Modern Approach", Siri Co-Founders, and Google/Amazon Executives.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* "Book Speaker Today" button using the Button component with 'gold' variant */}
              <Button
                asChild // Use asChild to render the Link component as the button's child
                variant="gold"
                size="lg"
                className="shadow-lg hover:shadow-xl transition-all duration-300 font-montserrat"
              >
                <Link href="/contact" className="text-white no-underline">
                  Book Speaker Today
                </Link>
              </Button>
              {/* "Browse Speakers" button using the Button component with 'default' variant */}
              <Button
                asChild // Use asChild to render the Link component as the button's child
                variant="default" // The default variant is blue
                size="lg"
                className="font-montserrat"
              >
                <Link href="/speakers" className="text-white no-underline">
                  Browse Speakers
                </Link>
              </Button>
            </div>

            {/* Social Proof Stat */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                {" "}
                {/* Wrapper for layout */}
                <p className="text-xl font-bold text-black font-neue-haas flex items-center justify-start gap-2 mb-2 sm:mb-0">
                  {" "}
                  {/* Reduced text size from text-2xl to text-xl */}
                  <MapPin className="w-5 h-5 text-[#1E68C6]" /> {/* Adjusted icon size slightly */}
                  Silicon Valley Based
                </p>
                <p className="text-xl font-bold text-black font-neue-haas flex items-center justify-start gap-2">
                  {" "}
                  {/* Reduced text size */}
                  <Globe className="w-5 h-5 text-[#1E68C6]" /> {/* Added Globe icon and adjusted size */}
                  Books Internationally
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/robert-strong-adam-cheyer-peter-norvig-on-stage-at-microsoft.png"
                alt="Robert Strong, Adam Cheyer (Siri Co-Founder), and Peter Norvig (Google & Stanford AI Researcher) on stage at a Microsoft event"
                width={700}
                height={467}
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
