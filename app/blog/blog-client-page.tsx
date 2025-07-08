"use client"

// DO NOT import fs-polyfill here. It's a server-side polyfill.
// The data fetching libraries below will import it on their own.

import { useEffect, useMemo, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { BlogCard } from "@/components/blog-card"
import { FeaturedBlogPostCard } from "@/components/featured-blog-post-card"
import PaginationControls from "@/components/pagination-controls"
import { getBlogPosts } from "@/lib/blog-data" // Use the central data lib
import type { BlogPost, DerivedCategory } from "@/lib/blog-data"

const POSTS_PER_PAGE = 9

export default function BlogClientPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  // UI state
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)

  // ───────────────────────────────────────────
  // Data fetch (runs only on client)
  // ───────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getBlogPosts()
        if (!cancelled && Array.isArray(data)) setPosts(data)
      } catch (err) {
        console.error("🔴 getBlogPosts() failed:", err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Derived data
  const featuredPosts = useMemo(() => posts.filter((p) => p.featured), [posts])

  const categories: DerivedCategory[] = useMemo(() => {
    const map = new Map<string, DerivedCategory>()
    posts.forEach((p) =>
      p.categories.forEach((c) => {
        map.set(c.slug, { slug: c.slug, name: c.name })
      }),
    )
    return Array.from(map.values())
  }, [posts])

  const desiredTabOrder = ["AI Speakers", "Industry Insights", "Event Planning", "Speaker Spotlight", "Company News"]
  const allTab = { slug: "all", name: "All Posts" }
  const orderedTabs = [allTab, ...categories]
    .sort((a, b) => {
      if (a.slug === "all") return -1
      if (b.slug === "all") return 1
      const iA = desiredTabOrder.indexOf(a.name)
      const iB = desiredTabOrder.indexOf(b.name)
      if (iA === -1 && iB === -1) return a.name.localeCompare(b.name)
      if (iA === -1) return 1
      if (iB === -1) return -1
      return iA - iB
    })
    .filter((t) => t.slug === "all" || desiredTabOrder.includes(t.name))

  const filteredNonFeatured = useMemo(() => {
    let list = posts.filter((p) => !p.featured)
    if (selectedCategorySlug !== "all") {
      list = list.filter((p) => p.categories.some((c) => c.slug === selectedCategorySlug))
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author?.name?.toLowerCase().includes(q) ||
          p.categories.some((c) => c.name.toLowerCase().includes(q)),
      )
    }
    return list
  }, [posts, selectedCategorySlug, searchTerm])

  // Pagination
  const totalPages = Math.ceil(filteredNonFeatured.length / POSTS_PER_PAGE)
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE
    return filteredNonFeatured.slice(start, start + POSTS_PER_PAGE)
  }, [filteredNonFeatured, currentPage])

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ───────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────
  return (
    <div className="bg-white text-gray-800">
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900">Innovations in AI & Events</h1>
        <p className="text-lg md:text-xl text-center text-gray-600 mb-10 md:mb-12 max-w-3xl mx-auto">
          Explore expert opinions, event professional resources, and future trends in the world of artificial
          intelligence.
        </p>

        {featuredPosts.length > 0 && (
          <section className="mb-12 md:mb-16 space-y-8">
            {featuredPosts.map((post) => (
              <FeaturedBlogPostCard key={post.id} post={post} />
            ))}
          </section>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            {selectedCategorySlug === "all" && !searchTerm ? "All Articles" : "Filtered Articles"}
          </h2>

          <div className="relative w-full md:w-auto md:max-w-xs">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 w-full bg-white border-gray-300"
              aria-label="Search articles"
            />
          </div>
        </div>

        {orderedTabs.length > 1 && (
          <Tabs
            value={selectedCategorySlug}
            onValueChange={(v) => setSelectedCategorySlug(v)}
            className="mb-8 md:mb-10"
          >
            <TabsList className="flex flex-wrap justify-center gap-2">
              {orderedTabs.map((t) => (
                <TabsTrigger key={t.slug} value={t.slug}>
                  {t.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading posts...</p>
        ) : paginatedPosts.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {paginatedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </section>
        ) : (
          <p className="text-center text-gray-500 py-10">No posts found.</p>
        )}

        {totalPages > 1 && (
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </main>
    </div>
  )
}
