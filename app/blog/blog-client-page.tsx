"use client"

import { useMemo, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { BlogCard } from "@/components/blog-card"
import { ContentCard } from "@/components/content-card"
import { FeaturedBlogPostCard } from "@/components/featured-blog-post-card"
import PaginationControls from "@/components/pagination-controls"
import type { ContentItem, getCategoriesFromContent } from "@/lib/combined-content"
import type { BlogPost } from "@/lib/blog-data"

const POSTS_PER_PAGE = 9

interface BlogClientPageProps {
  initialContent: ContentItem[]
}

export default function BlogClientPage({ initialContent }: BlogClientPageProps) {
  // Initialize state with the data passed from the server component.
  const [content, setContent] = useState<ContentItem[]>(initialContent)
  const [loading, setLoading] = useState(false) // No initial loading needed
  

  // UI state remains the same
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)

  // The initial useEffect fetch is no longer needed.

  // Derived data calculations for combined content
  const featuredBlogPosts = useMemo(() => 
    content.filter((item) => item.type === 'blog' && item.featured)
  , [content])

  const categories = useMemo(() => {
    const map = new Map<string, {slug: string, name: string}>()
    content.forEach((item) =>
      item.categories.forEach((c) => {
        map.set(c.slug, { slug: c.slug, name: c.name })
      }),
    )
    return Array.from(map.values())
  }, [content])

  // Create primary tabs in order
  const primaryTabs = [
    { slug: "all", name: "All Content" },
    { slug: "blog", name: "Articles" },
    { slug: "tools", name: "Tools" }
  ]
  
  // Add category tabs (excluding tools-resources which we handle separately)
  const categoryTabs = categories.filter(cat => 
    cat.slug !== "tools-resources" && 
    ["AI Speakers", "Industry Insights", "Event Planning", "Speaker Spotlight", "Company News"].includes(cat.name)
  )
  
  const orderedTabs = [...primaryTabs, ...categoryTabs]

  const filteredContent = useMemo(() => {
    let list = content.filter((item) => item.type !== 'blog' || !item.featured)
    
    if (selectedCategorySlug === "blog") {
      list = list.filter((item) => item.type === 'blog')
    } else if (selectedCategorySlug === "tools") {
      list = list.filter((item) => item.type === 'landing')
    } else if (selectedCategorySlug !== "all") {
      list = list.filter((item) => item.categories.some((c) => c.slug === selectedCategorySlug))
    }
    
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          item.author?.name?.toLowerCase().includes(q) ||
          item.categories.some((c) => c.name.toLowerCase().includes(q)),
      )
    }
    
    return list
  }, [content, selectedCategorySlug, searchTerm])

  // Pagination logic updated for combined content
  const totalPages = Math.ceil(filteredContent.length / POSTS_PER_PAGE)
  const paginatedContent = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE
    return filteredContent.slice(start, start + POSTS_PER_PAGE)
  }, [filteredContent, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="bg-white text-gray-800">
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900">AI Insights & Tools</h1>
        <p className="text-lg md:text-xl text-center text-gray-600 mb-10 md:mb-12 max-w-3xl mx-auto">
          Explore expert articles, event planning tools, and cutting-edge resources in artificial intelligence and event management.
        </p>

        {featuredBlogPosts.length > 0 && (
          <section className="mb-12 md:mb-16 space-y-8">
            {featuredBlogPosts.map((item) => (
              <FeaturedBlogPostCard key={item.id} post={item.originalData as BlogPost} />
            ))}
          </section>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            {selectedCategorySlug === "all" && !searchTerm ? "All Content" : 
             selectedCategorySlug === "blog" ? "Articles" :
             selectedCategorySlug === "tools" ? "Tools" : "Filtered Content"}
             <span className="text-sm text-gray-500 ml-2">({selectedCategorySlug})</span>
          </h2>

          <div className="relative w-full md:w-auto md:max-w-xs">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 w-full bg-white border-gray-300"
              aria-label="Search content"
            />
          </div>
        </div>

        {orderedTabs.length > 1 && (
          <Tabs
            value={selectedCategorySlug}
            onValueChange={(v) => {
              setSelectedCategorySlug(v)
              setCurrentPage(1)
            }}
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
          <p className="text-center text-gray-500 py-10">Loading content...</p>
        ) : paginatedContent.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {paginatedContent.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </section>
        ) : (
          <p className="text-center text-gray-500 py-10">No content found.</p>
        )}

        {totalPages > 1 && (
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </main>
    </div>
  )
}
