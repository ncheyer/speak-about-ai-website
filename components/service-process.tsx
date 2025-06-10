import { MessageSquare, Users, Star } from "lucide-react"

export default function ServiceProcess() {
  const steps = [
    {
      icon: MessageSquare,
      title: "Contact Us",
      description:
        "Fill out our online form to request a free consultation. One of our team members will contact you within 24 hours to discuss your event needs.",
    },
    {
      icon: Users,
      title: "Pick Your Speaker",
      description:
        "Based on your event goals, audience, and budget, we'll provide a curated list of AI experts for you to consider.",
    },
    {
      icon: Star,
      title: "Enjoy Your Event",
      description:
        "Once you've selected your speaker, we handle all the details—from booking to logistics to post-event follow-up.",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-neue-haas">Our Process</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
            From initial consultation to final delivery, we ensure a seamless experience that brings world-class AI
            expertise to your event.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-[#1E68C6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#5084C6] rounded-full flex items-center justify-center text-white font-bold text-sm font-montserrat">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-neue-haas">{step.title}</h3>
              <p className="text-gray-600 font-montserrat">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
