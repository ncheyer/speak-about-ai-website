import { Shield, Clock, Users, Headphones, Target, Globe } from "lucide-react"

export default function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "We're On Your Team",
      description:
        "Lightning-fast 24-hour response guarantee, rain or shine. Whether you need a speaker in three days or three months, we work around the clock to secure the perfect match for your event.",
    },
    {
      icon: Headphones,
      title: "We Handle Your Logistical Headaches",
      description:
        "Event planning is complex enough without speaker booking stress. We proactively manage travel contingencies and maintain backup options, so you're never left scrambling if emergencies arise.",
    },
    {
      icon: Target,
      title: "We Help You Navigate The Noise",
      description:
        "Cut through the AI hype with our deep industry expertise. We deliver custom-tailored speaker recommendations within 24 hours, perfectly aligned with your budget, audience demographics, and industry focus.",
    },
    {
      icon: Users,
      title: "Access to Exclusive AI Pioneers",
      description:
        "Direct connections to the architects of modern AI—Siri co-founders, former Shazam executives, and the researchers who literally authored the AI textbooks. These innovators have built products used by billions.",
    },
    {
      icon: Globe,
      title: "Proven Stage Presence",
      description:
        "From intimate boardroom discussions to stadium-sized keynotes, our speakers command every venue. Learn from LinkedIn Top Voices, Google's Chief Evangelist, and Stanford professors with decades of global speaking experience.",
    },
    {
      icon: Clock,
      title: "Actionable Industry Intelligence",
      description:
        "Skip the theoretical fluff. Our experts share real-world case studies, implementation strategies, and hard-won lessons that help your audience immediately apply AI insights and future-proof their organizations.",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-neue-haas">Why Work with Speak About AI?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
            We book artificial intelligence keynote speakers for your organization's event who don't just talk about the
            future—they're the innovators building the tech.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-neue-haas">{feature.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed font-montserrat">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
