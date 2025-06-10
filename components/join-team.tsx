"use client"

import { Mail } from "lucide-react"

export default function JoinTeam() {
  return (
    <section className="py-20 bg-[#1E68C6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-6 font-neue-haas">Get In Touch</h2>
        <p className="text-xl text-white text-opacity-90 mb-8 max-w-3xl mx-auto font-montserrat">
          Interested in working with Speak About AI or have questions about our services? We'd love to hear from you.
        </p>

        <a
          href="mailto:human@speakabout.ai"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-montserrat text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-md"
          style={{
            background: "linear-gradient(to right, #f59e0b, #d97706)",
            color: "white",
          }}
          data-button="yellow"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(to right, #d97706, #b45309)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(to right, #f59e0b, #d97706)"
          }}
        >
          <Mail className="w-5 h-5 mr-2" />
          Email Us
        </a>
      </div>
    </section>
  )
}
