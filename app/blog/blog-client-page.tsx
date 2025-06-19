"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getImageUrl } from "@/lib/utils"
import { FeaturedBlogPostCard } from "@/components/featured-blog-post-card"
import { PaginationControls } from "@/components/pagination-controls"

// Ensure these types are correctly defined or imported
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage?: { url?: string; alt?: string }
  publishedDate: string
  author?: { name?: string }
  categories: { slug: string; name: string }[]
}

export interface Category {
  slug: string
  name: string
}

interface BlogClientPageProps {
  posts: BlogPost[] // These are now non-featured posts
  featuredPosts: BlogPost[]
  categories: Category[]
}

const POSTS_PER_PAGE = 9 // 3 columns * 3 rows

export default function BlogClientPage({ posts, featuredPosts, categories }: BlogClientPageProps) {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState<number>(1)

  const postsForCurrentTab = useMemo(() => {
    if (activeTab === "all") return posts
    return posts.filter((post) => post.categories.some((c) => c.slug === activeTab))
  }, [activeTab, posts])

  const totalPages = Math.ceil(postsForCurrentTab.length / POSTS_PER_PAGE)

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    const endIndex = startIndex + POSTS_PER_PAGE
    return postsForCurrentTab.slice(startIndex, endIndex)
  }, [postsForCurrentTab, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0) // Scroll to top on page change
  }

  // Reset to page 1 when tab changes
  const onTabChange = (tabSlug: string) => {
    setActiveTab(tabSlug)
    setCurrentPage(1)
  }

  return (
    <div className="bg-white text-gray-800">
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900">Innovations in AI & Events</h1>
        <p className="text-lg md:text-xl text-center text-gray-600 mb-10 md:mb-12 max-w-3xl mx-auto">
          Explore expert opinions, event professional resources, and future trends in the world of artificial
          intelligence.
        </p>

        {/* Featured Posts Section */}
        {featuredPosts && featuredPosts.length > 0 && (
          <section className="mb-12 md:mb-16 space-y-8">
            {featuredPosts.slice(0, 2).map(
              (
                post, // Show up to 2 featured posts
              ) => (
                <FeaturedBlogPostCard key={`featured-${post.id}`} post={post} />
              ),
            )}
          </section>
        )}

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={onTabChange} className="mb-8 md:mb-10">
          <TabsList className="flex flex-wrap justify-center gap-2">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat.slug} value={cat.slug}>
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Main Blog Grid */}
        {paginatedPosts.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-0">
            {paginatedPosts.map((post) => {
              const featuredImageUrl = getImageUrl(post.featuredImage?.url)
              return (
                <article
                  key={post.id}
                  className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  {featuredImageUrl && (
                    <Link href={`/blog/${post.slug}`} className="block aspect-[16/9] relative overflow-hidden">
                      <Image
                        src={featuredImageUrl || "/placeholder.svg?width=400&height=225&query=blog+thumbnail"}
                        alt={post.featuredImage?.alt || post.title}
                        fill
                        className="object-cover"
                      />
                    </Link>
                  )}
                  <div className="p-5 md:p-6 flex flex-col flex-grow">
                    <h3 className="text-lg md:text-xl font-semibold mb-2 leading-tight flex-1">
                      <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
                    <div className="text-xs text-gray-500 mb-3">
                      <span>By {post.author?.name || "Speak About AI"}</span>
                      <span className="mx-1.5">•</span>
                      <span>
                        {new Date(post.publishedDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm text-blue-600 hover:underline font-semibold mt-auto self-start"
                    >
                      Read more &rarr;
                    </Link>
                  </div>
                </article>
              )
            })}
          </section>
        ) : (
          <p className="text-center text-gray-500 py-10">No posts found in this category.</p>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </main>
    </div>
  )
}
