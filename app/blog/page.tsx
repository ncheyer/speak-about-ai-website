import type { Metadata } from "next"
import { Suspense } from "react"
import BlogClientPage from "./blog-client-page"

export const metadata: Metadata = {
  title: "AI Industry Blog & Insights | Speak About AI", // 45 chars
  description:
    "Read the latest AI industry insights, speaker spotlights, and artificial intelligence trends from Speak About AI's expert blog.",
  keywords: "AI blog, artificial intelligence insights, AI industry news, machine learning trends, AI speaker insights",
  alternates: {
    canonical: "/blog",
  },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div>Loading blog posts...</div>}>
        <BlogClientPage />
      </Suspense>
    </div>
  )
}
