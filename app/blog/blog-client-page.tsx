"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import type { BlogPost, DerivedCategory } from "@/lib/contentful-blog"
import { FeaturedBlogPostCard } from "@/components/featured-blog-post-card" // For featured posts
import { BlogCard } from "@/components/blog-card" // For regular posts in the grid
import { PaginationControls } from "@/components/pagination-controls" // Added PaginationControls

interface BlogClientPageProps {
  posts: BlogPost[] // These are now non-featured posts
  featuredPosts: BlogPost[]
  categories: DerivedCategory[]
}

const POSTS_PER_PAGE = 9 // For pagination of non-featured posts

export default function BlogClientPage({ posts, featuredPosts, categories }: BlogClientPageProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)

  const normalizedCategories = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      slug: typeof cat.slug === "string" ? cat.slug : `category-${Math.random().toString(36).substring(7)}`,
      name: typeof cat.name === "string" ? cat.name : "Unnamed Category",
    }))
  }, [categories])

  // Filter and search logic applies only to non-featured posts
  const filteredAndSearchedNonFeaturedPosts = useMemo(() => {
    let filtered = posts // Start with non-featured posts

    if (selectedCategorySlug !== "all") {
      filtered = filtered.filter((post) => post.categories.some((cat) => cat.slug === selectedCategorySlug))
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerSearchTerm) ||
          post.excerpt.toLowerCase().includes(lowerSearchTerm) ||
          (post.author?.name && post.author.name.toLowerCase().includes(lowerSearchTerm)) ||
          post.categories.some((cat) => cat.name.toLowerCase().includes(lowerSearchTerm)),
      )
    }
    return filtered
  }, [posts, selectedCategorySlug, searchTerm])

  // Pagination logic for the filtered and searched non-featured posts
  const totalPages = Math.ceil(filteredAndSearchedNonFeaturedPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    const endIndex = startIndex + POSTS_PER_PAGE
    return filteredAndSearchedNonFeaturedPosts.slice(startIndex, endIndex)
  }, [filteredAndSearchedNonFeaturedPosts, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0) // Scroll to top on page change
  }

  // Reset to page 1 when tab or search term changes
  const onTabChange = (tabSlug: string) => {
    setSelectedCategorySlug(tabSlug)
    setCurrentPage(1)
  }
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  // User's desired tab order - filter available categories against this
  const desiredTabOrder = ["AI Speakers", "Industry Insights", "Event Planning", "Speaker Spotlight", "Company News"]
  const allPostsTab = { slug: "all", name: "All Posts" }
  const availableCategoryTabs = normalizedCategories.filter((cat) => desiredTabOrder.includes(cat.name))

  const sortedAvailableTabs = [allPostsTab, ...availableCategoryTabs].sort((a, b) => {
    if (a.slug === "all") return -1
    if (b.slug === "all") return 1
    const indexA = desiredTabOrder.indexOf(a.name)
    const indexB = desiredTabOrder.indexOf(b.name)
    if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name) // Sort alphabetically if not in desired order
    if (indexA === -1) return 1 // Put items not in desired order at the end
    if (indexB === -1) return -1
    return indexA - indexB
  })

  return (
    <div className="bg-white text-gray-800">
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900">Innovations in AI & Events</h1>
        <p className="text-lg md:text-xl text-center text-gray-600 mb-10 md:mb-12 max-w-3xl mx-auto">
          Explore expert opinions, event professional resources, and future trends in the world of artificial
          intelligence.
        </p>

        {/* Featured Posts Section - Unaffected by tabs/search */}
        {featuredPosts && featuredPosts.length > 0 && (
          <section className="mb-12 md:mb-16 space-y-8">
            {featuredPosts.map((post) => (
              <FeaturedBlogPostCard key={`featured-${post.id}`} post={post} />
            ))}
          </section>
        )}

        {/* Tabs and Search Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            {selectedCategorySlug === "all" && !searchTerm ? "Latest Articles" : "Filtered Articles"}
          </h2>
          <div className="relative w-full md:w-auto md:max-w-xs">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={onSearchChange}
              className="pl-10 w-full bg-white border-gray-300"
              aria-label="Search articles"
            />
          </div>
        </div>

        {sortedAvailableTabs.length > 1 && (
          <Tabs value={selectedCategorySlug} onValueChange={onTabChange} className="mb-8 md:mb-10">
            <TabsList className="flex flex-wrap justify-center gap-2">
              {sortedAvailableTabs.map((tab) => (
                <TabsTrigger key={tab.slug} value={tab.slug}>
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* Main Blog Grid - Paginated and Filtered */}
        {paginatedPosts.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {paginatedPosts.map((post) => {
              // BlogCard is now used here, which is simpler.
              // FeaturedBlogPostCard was used in the previous version of BlogClientPage for featured items.
              // We are now using BlogCard for the main grid.
              return <BlogCard key={post.id} post={post} />
            })}
          </section>
        ) : (
          <p className="text-center text-gray-500 py-10">No posts found matching your criteria.</p>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </main>
    </div>
  )
}
