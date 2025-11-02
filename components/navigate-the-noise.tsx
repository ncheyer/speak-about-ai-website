import { DollarSign, Users, Globe2, Check } from "lucide-react"

export default function NavigateTheNoise() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-neue-haas">
            Navigate the AI Speaker Landscape
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
            Clear guidance to help you make informed decisions faster
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Budget Ranges */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-lg border border-blue-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 font-neue-haas">Budget Guidance</h3>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-4">
                <div className="font-bold text-gray-900 font-montserrat mb-1">$10k - $25k</div>
                <div className="text-sm text-gray-600 font-montserrat">Rising AI experts, academics, and tech consultants</div>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <div className="font-bold text-gray-900 font-montserrat mb-1">$25k - $50k</div>
                <div className="text-sm text-gray-600 font-montserrat">Industry leaders, published authors, and proven speakers</div>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <div className="font-bold text-gray-900 font-montserrat mb-1">$50k+</div>
                <div className="text-sm text-gray-600 font-montserrat">AI pioneers, tech founders, and household names</div>
              </div>
              <p className="text-xs text-gray-500 font-montserrat italic mt-4">
                Final fees vary by format, location, and date. Contact us for precise quotes.
              </p>
            </div>
          </div>

          {/* Audience Types */}
          <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-xl shadow-lg border border-amber-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 font-neue-haas">Audience Types</h3>
            </div>
            <div className="space-y-3">
              {[
                "Corporate & Enterprise",
                "Public Sector & Government",
                "Startups & Scale-ups",
                "Academic & Research",
                "Healthcare & Life Sciences",
                "Financial Services",
                "Technology Companies"
              ].map((audience, index) => (
                <div key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-montserrat">{audience}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Delivery */}
          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-lg border border-green-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Globe2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 font-neue-haas">Global Delivery</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 font-montserrat mb-2 flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  In-Person Events
                </h4>
                <p className="text-sm text-gray-600 font-montserrat ml-7">
                  Worldwide coverage with expert travel logistics and on-ground support
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 font-montserrat mb-2 flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  Virtual Events
                </h4>
                <p className="text-sm text-gray-600 font-montserrat ml-7">
                  Professional virtual keynotes with premium A/V setup and tech support
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 font-montserrat mb-2 flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  Hybrid Format
                </h4>
                <p className="text-sm text-gray-600 font-montserrat ml-7">
                  Seamless blend of in-person and remote engagement for maximum reach
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
