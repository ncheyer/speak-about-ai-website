import { Users, Star, Heart, Lightbulb, Target, Zap } from "lucide-react"

export default function TeamValues() {
  const values = [
    {
      icon: Users,
      title: "Speaker-First Approach",
      description:
        "We prioritize our speakers' needs and preferences, ensuring they're matched with events that align with their expertise and values.",
    },
    {
      icon: Star,
      title: "AI Expertise",
      description:
        "Our team stays at the cutting edge of AI developments, allowing us to provide informed guidance to both speakers and clients.",
    },
    {
      icon: Heart,
      title: "Passion for Events",
      description:
        "We believe in the power of live events to inspire, educate, and connect people around artificial intelligence.",
    },
    {
      icon: Lightbulb,
      title: "Thought Leadership",
      description:
        "We're committed to elevating AI discourse by connecting the brightest minds with the most influential stages.",
    },
    {
      icon: Target,
      title: "Perfect Matches",
      description:
        "We take pride in creating ideal speaker-event matches that exceed expectations for all parties involved.",
    },
    {
      icon: Zap,
      title: "Responsive Service",
      description:
        "Our 24-hour response time and dedicated account management ensure seamless experiences for speakers and clients alike.",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-neue-haas">Our Values</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
            The principles that guide our work and define our culture
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <value.icon className="w-6 h-6 text-[#1E68C6]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-neue-haas">{value.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed font-montserrat">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
