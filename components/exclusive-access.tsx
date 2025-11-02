import { Sparkles, Award, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ExclusiveAccess() {
  const pioneers = [
    {
      icon: Award,
      title: "Siri Co-Founders",
      description: "The visionaries who created one of the world's first mainstream AI assistants",
    },
    {
      icon: Sparkles,
      title: "AI Textbook Authors",
      description: "Researchers who literally wrote the books used to teach AI at Stanford and MIT",
    },
    {
      icon: TrendingUp,
      title: "Billion-User Products",
      description: "Innovators who built AI technology now used by billions globally",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background decoration - very subtle */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#1E68C6] rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1E68C6] rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
      </div>
      {/* Very subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(30, 104, 198, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 104, 198, 0.1) 1px, transparent 1px)", backgroundSize: "50px 50px" }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6 font-montserrat">
            <Sparkles className="w-4 h-4 mr-2" />
            Our Competitive Edge
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 font-neue-haas">
            Direct Access to AI's Architects
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-montserrat leading-relaxed">
            We represent the pioneers who built the AI technology shaping our world—exclusive connections you won't find
            anywhere else
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pioneers.map((pioneer, index) => (
            <div
              key={index}
              className="group bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-xl border border-white border-opacity-20 hover:bg-opacity-20 hover:border-opacity-40 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 group-hover:bg-opacity-30 group-hover:scale-110 transition-all duration-300">
                  <pioneer.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-neue-haas">{pioneer.title}</h3>
                <p className="text-gray-300 font-montserrat leading-relaxed">{pioneer.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            variant="gold"
            size="lg"
            className="font-montserrat font-bold text-lg shadow-2xl hover:shadow-2xl"
          >
            <Link href="/speakers">Explore Our Elite Roster</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
