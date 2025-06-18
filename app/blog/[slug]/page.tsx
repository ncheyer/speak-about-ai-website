import { getBlogPost, getBlogPosts } from "@/lib/payload-blog"
import Image from "next/image"
import { notFound } from "next/navigation"

type BlogPostPageProps = {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="bg-white text-gray-800">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{post.title}</h1>
        <div className="text-gray-600 mb-8">
          <span>By {post.author?.name || "Speak About AI"}</span>
          <span className="mx-2">•</span>
          <span>
            {new Date(post.publishedDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {post.readTime && (
            <>
              <span className="mx-2">•</span>
              <span>{post.readTime} min read</span>
            </>
          )}
        </div>
        {post.featuredImage && (
          <div className="relative w-full h-80 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage.url || "/placeholder.svg"}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  )
}

// This function generates the static paths for all blog posts at build time.
export async function generateStaticParams() {
  const posts = await getBlogPosts(100) // Fetch a large number of posts
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
