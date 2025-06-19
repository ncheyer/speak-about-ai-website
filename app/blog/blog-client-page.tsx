"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { BlogPost, Category } from "@/lib/contentful-blog"
import { getImageUrl } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BlogClientPageProps {
  posts: BlogPost[]
  categories: Category[]
}

export function BlogClientPage({ posts, categories }: BlogClientPageProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts)

  const handleTabChange = (categorySlug: string) => {
    if (categorySlug === "all") {
      setFilteredPosts(posts)
    } else {
      const newFilteredPosts = posts.filter((post) => post.categories.some((cat) => cat.slug === categorySlug))
      setFilteredPosts(newFilteredPosts)
    }
  }

  return (
    <div className="bg-white text-gray-800">
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
        <Tabs defaultValue="all" onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.slug}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">
            <PostGrid posts={filteredPosts} />
          </TabsContent>
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.slug}>
              <PostGrid posts={filteredPosts} />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}

function PostGrid({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <p className="text-center text-gray-500">No posts found in this category.</p>
  }

  return (
    <div className="grid gap-12">
      {posts.map((post) => {
        const featuredImageUrl = getImageUrl(post.featuredImage?.url)
        return (
          <article key={post.id} className="border-b pb-8 last:border-b-0">
            {featuredImageUrl && (
              <Link href={`/blog/${post.slug}`}>
                <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={featuredImageUrl || "/placeholder.svg"}
                    alt={post.featuredImage?.alt || post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
            )}
            <h2 className="text-3xl font-bold mb-2 hover:text-blue-600 transition-colors duration-200">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <div className="text-sm text-gray-500 mb-4">
              <span>By {post.author?.name || "Speak About AI"}</span>
              <span className="mx-2">•</span>
              <span>
                {new Date(post.publishedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline font-semibold">
              Read more &rarr;
            </Link>
          </article>
        )
      })}
    </div>
  )
}

export default BlogClientPage
