"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { BlogPost } from "@/lib/contentful-blog"
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
  // "all" = show everything
  const [active, setActive] = useState<string>("all")

  const filtered = active === "all" ? posts : posts.filter((p) => p.categories.some((c) => c.slug === active))

  return (
    <div className="bg-white text-gray-800 px-4 pb-12">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mt-8 mb-6 text-center">Blog</h1>

        {/* Category Tabs */}
        <Tabs value={active} onValueChange={setActive} className="w-full overflow-x-auto">
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

        {/* Posts */}
        <section className="grid gap-12 mt-10">
          {filtered.map((post) => {
            const imgUrl = post.featuredImage?.url?.startsWith("//")
              ? `https:${post.featuredImage.url}`
              : post.featuredImage?.url

            return (
              <article key={post.id} className="border-b pb-8 last:border-b-0">
                {imgUrl && (
                  <Link href={`/blog/${post.slug}`} className="block mb-4">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                      <Image
                        src={imgUrl || "/placeholder.svg"}
                        fill
                        priority
                        alt={post.featuredImage?.alt || post.title}
                        className="object-cover"
                      />
                    </div>
                  </Link>
                )}

                <h2 className={cn("text-3xl font-bold mb-2", "hover:text-blue-600 transition-colors")}>
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
          {filtered.length === 0 && <p className="text-center text-gray-500">No posts in this category.</p>}
        </section>
      </main>
    </div>
  )
}
