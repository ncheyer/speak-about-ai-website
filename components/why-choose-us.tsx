import { Shield, Clock, Award, Users, Zap, Globe } from "lucide-react"

export default function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "AI-Exclusive Expertise",
      description:
        "The world's only speaker bureau focused exclusively on artificial intelligence experts. No generalists, only AI specialists.",
    },
    {
      icon: Award,
      title: "Vetted Industry Leaders",
      description:
        "Every speaker is a proven AI pioneer - from Siri co-founders to Google executives and Turing Award winners.",
    },
    {
      icon: Clock,
      title: "24-Hour Response",
      description:
        "Fast-track your event planning with our industry-leading response time and dedicated account management.",
    },
    {
      icon: Users,
      title: "Fortune 500 Trusted",
      description:
        "Trusted by Google, Microsoft, Meta, and other industry leaders for their most important AI conferences and events.",
    },
    {
      icon: Zap,
      title: "Cutting-Edge Content",
      description:
        "Our speakers deliver the latest insights on AI trends, from ChatGPT to autonomous vehicles to the future of work.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "International roster of speakers available for virtual and in-person events worldwide, with multi-language capabilities.",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Speak About AI?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're not just another speaker bureau. We're the definitive source for AI expertise, connecting you with the
            minds that are literally building the future.
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
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
