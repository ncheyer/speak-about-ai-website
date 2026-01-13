"use client"

import { useState } from "react"
import { Search, Sparkles, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function AISearchPage() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    setResults(null)

    // TODO: Implement AI search API call
    // For now, simulate a search delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSearching(false)
    // Placeholder results - will be replaced with actual AI search
    setResults({
      query: query,
      message: "AI Search is coming soon! We're building an intelligent search engine to help you find the perfect speaker for your event."
    })
  }

  const suggestedQueries = [
    "AI speakers for a tech conference",
    "Keynote on future of work and AI",
    "Healthcare AI innovation speaker",
    "Business transformation with AI",
    "Ethical AI and responsible technology"
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            {/* Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400 font-medium">AI-Powered Speaker Search</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Find Your Perfect
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> AI Speaker</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                Describe your event, audience, or topic and let our AI find the ideal speakers for your needs.
              </p>
            </div>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-20"></div>
                <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700 p-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-3 px-4">
                      <Search className="w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Describe what you're looking for..."
                        className="flex-1 bg-transparent border-none text-white placeholder:text-gray-500 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSearching || !query.trim()}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-xl"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          Search
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Suggested Queries */}
            {!results && (
              <div className="max-w-3xl mx-auto">
                <p className="text-sm text-gray-500 mb-3 text-center">Try searching for:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedQueries.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(suggestion)}
                      className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-full text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Section */}
            {results && (
              <div className="max-w-3xl mx-auto mt-12">
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Search results for "{results.query}"</p>
                      <p className="text-lg text-white">{results.message}</p>
                      <div className="mt-6">
                        <Button
                          asChild
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <a href="/speakers">Browse All Speakers</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-800/30 border-t border-gray-700/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-bold text-white text-center mb-12">How AI Search Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Describe Your Event</h3>
                <p className="text-gray-400">Tell us about your audience, industry, and what topics matter most to you.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Matches Speakers</h3>
                <p className="text-gray-400">Our AI analyzes speaker expertise, style, and experience to find your perfect match.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Book with Confidence</h3>
                <p className="text-gray-400">Review curated recommendations and book the speaker who's right for you.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
