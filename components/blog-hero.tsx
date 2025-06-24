export function BlogHero() {
  return (
    <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">AI Insights & Expertise</h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Stay updated with the latest in AI, keynote speaking trends, and industry analysis from Speak About AI.
        </p>
        {/* Optional: You can add a CTA here, e.g., link to featured posts or categories */}
        {/* 
        <Link href="/blog/featured" legacyBehavior>
          <a className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
            View Featured Articles
          </a>
        </Link>
        */}
      </div>
    </section>
  )
}
