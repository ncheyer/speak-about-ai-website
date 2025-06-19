import { getBlogPost, getBlogPosts } from "@/lib/blog-data"
import Image from "next/image"
import { notFound } from "next/navigation"
import { marked } from "marked"
import { getImageUrl } from "@/lib/utils" // Import the helper function
import { documentToHtmlString } from "@contentful/rich-text-html-renderer"

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

  const featuredImageUrl = getImageUrl(post.featuredImage?.url) // Use the helper

  // ---------- Build HTML from either Markdown or Contentful Rich Text ----------
  let contentHtml = ""

  if (post.content) {
    if (typeof post.content === "string") {
      // Markdown string
      contentHtml = marked(post.content)
    } else if (typeof post.content === "object") {
      // Contentful “Rich Text” JSON
      // Some SDK setups nest the document under `.json`
      const richDoc = (post.content as any).json ?? post.content
      contentHtml = documentToHtmlString(richDoc)
    }
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
        {featuredImageUrl && (
          <div className="relative w-full h-80 mb-8 rounded-lg overflow-hidden">
            <Image
              src={featuredImageUrl || "/placeholder.svg"}
              alt={post.featuredImage?.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div
          className="prose prose-lg max-w-none text-gray-800 prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-strong:text-gray-800"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </article>
  )
}

// ... (generateStaticParams remains the same) ...
export async function generateStaticParams() {
  const posts = await getBlogPosts(100)
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
