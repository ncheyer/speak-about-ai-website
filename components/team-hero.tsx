export default function TeamHero() {
  return (
    <section className="relative bg-gradient-to-br from-[#1E68C6] via-[#1a5aa8] to-[#0f3d6e] py-24 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block mb-6">
          <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-montserrat font-medium border border-white/20">
            Your AI Speaker Experts
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-neue-haas">Meet Our Team</h1>
        <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 font-montserrat">
          The experts behind the world's leading AI-exclusive speaker bureau
        </p>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-white/80 font-montserrat leading-relaxed">
            At Speak About AI, we combine decades of entertainment industry experience with deep AI expertise to connect
            you with the world's leading artificial intelligence speakers. Our unique background in both speaker
            management and technology gives us unparalleled insight into what makes a truly exceptional keynote
            experience.
          </p>
        </div>
      </div>
    </section>
  )
}
