import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function JoinTeam() {
  return (
    <section className="py-20 bg-[#1E68C6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-6 font-neue-haas">Get In Touch</h2>
        <p className="text-xl text-white text-opacity-90 mb-8 max-w-3xl mx-auto font-montserrat">
          Interested in working with Speak About AI or have questions about our services? We'd love to hear from you.
        </p>

        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4 font-montserrat"
        >
          <a href="mailto:human@speakabout.ai">
            <Mail className="w-5 h-5 mr-2" />
            Email Us
          </a>
        </Button>
      </div>
    </section>
  )
}
