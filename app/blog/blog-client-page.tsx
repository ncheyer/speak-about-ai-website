"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { BlogPost } from "@/lib/contentful-blog" // Ensure BlogPost type is imported
import { cn } from "@/lib/utils"

interface Category {
  slug: string
  name: string
}

interface BlogClientPageProps {
  posts: BlogPost[]
  categories: Category[]
}

export default function BlogClientPage({ posts, categories }: BlogClientPageProps) {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>("all")

  const filteredPosts =
    activeCategorySlug === "all"
      ? posts
      : posts.filter((post) => post.categories.some((cat) => cat.slug === activeCategorySlug))

  return (
    <div className="bg-white text-gray-800 px-4 pb-12">
      <main className="max-w-7xl mx-auto">
        {" "}
        {/* Increased max-width for 3 columns */}
        <h1 className="text-4xl font-bold mt-8 mb-6 text-center">Blog</h1>
        <Tabs value={activeCategorySlug} onValueChange={setActiveCategorySlug} className="w-full mb-10">
          <TabsList className="flex flex-wrap gap-2 justify-center">
            <TabsTrigger value="all" className="capitalize">
              All
            </TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat.slug} value={cat.slug} className="capitalize">
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const imgUrl = post.featuredImage?.url?.startsWith("//")
                ? `https:${post.featuredImage.url}`
                : post.featuredImage?.url

              return (
                <article
                  key={post.id}
                  className="flex flex-col rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {imgUrl && (
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="relative w-full h-56">
                        {" "}
                        {/* Fixed height for card images */}
                        <Image
                          src={imgUrl || "/placeholder.svg?width=400&height=224&query=blog+post+image"}
                          fill
                          priority={posts.indexOf(post) < 3} // Prioritize loading images for the first few posts
                          alt={post.featuredImage?.alt || post.title}
                          className="object-cover"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className={cn("text-xl font-bold mb-2", "hover:text-blue-600 transition-colors")}>
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <div className="text-xs text-gray-500 mb-3">
                      <span>By {post.author?.name || "Speak About AI"}</span>
                      <span className="mx-1.5">•</span>
                      <span>
                        {new Date(post.publishedDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:underline font-semibold mt-auto text-sm"
                    >
                      Read more &rarr;
                    </Link>
                  </div>
                </article>
              )
            })}
          </section>
        ) : (
          <p className="text-center text-gray-500 col-span-full">No posts found in this category.</p>
        )}
      </main>
    </div>
  )
}
