import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const AIKeynoteSpeakersPage = () => {
  return (
    <div className="font-montserrat">
      {/* Hero Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            Engage Your Audience with AI Keynote Speakers
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">Discover top AI experts for your next event.</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-montserrat"
          >
            <Link href="/contact?source=no_nav_hero_main_cta">Book Speaker Today</Link>
          </Button>
          <Button size="lg" variant="outline" className="ml-4 text-gray-600 hover:text-gray-800 font-montserrat">
            <Link href="/#speakers">Explore Speakers</Link>
          </Button>
        </div>
      </section>

      {/* Featured Speakers Section */}
      <section className="py-16" id="speakers">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">Featured AI Keynote Speakers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Speaker Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image
                src="/images/speaker1.jpg" // Replace with actual image path
                alt="Speaker 1"
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Dr. Anya Sharma</h3>
                <p className="text-gray-600 mb-4">AI Ethics and the Future of Work</p>
                <Link
                  href="/contact?speaker=AnyaSharma"
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded"
                >
                  Book Dr. Sharma
                </Link>
              </div>
            </div>

            {/* Speaker Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image
                src="/images/speaker2.jpg" // Replace with actual image path
                alt="Speaker 2"
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Kenji Tanaka</h3>
                <p className="text-gray-600 mb-4">The Role of AI in Business Transformation</p>
                <Link
                  href="/contact?speaker=KenjiTanaka"
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded"
                >
                  Book Kenji Tanaka
                </Link>
              </div>
            </div>

            {/* Speaker Card 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image
                src="/images/speaker3.jpg" // Replace with actual image path
                alt="Speaker 3"
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Isabelle Dubois</h3>
                <p className="text-gray-600 mb-4">AI and the Future of Healthcare</p>
                <Link
                  href="/contact?speaker=IsabelleDubois"
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded"
                >
                  Book Isabelle Dubois
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-200 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Ready to Transform Your Event?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Contact us today to book an AI keynote speaker for your next conference or meeting.
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-montserrat"
            >
              <Link href="/contact?source=no_nav_footer_cta">Book Speaker Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AIKeynoteSpeakersPage
