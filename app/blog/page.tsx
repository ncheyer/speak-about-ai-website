import Link from "next/link"
import Image from "next/image"
import { getBlogPosts, type BlogPost } from "@/lib/payload-blog"
import { getImageUrl } from "@/lib/utils" // Import the helper function

export type { BlogPost }

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="bg-white text-gray-800">
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
        <div className="grid gap-12">
          {posts.map((post) => {
            const featuredImageUrl = getImageUrl(post.featuredImage?.url) // Use the helper
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
      </main>
    </div>
  )
}
