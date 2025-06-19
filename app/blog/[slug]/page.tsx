import { getBlogPost, getBlogPosts } from "@/lib/blog-data"
import Image from "next/image"
import { notFound } from "next/navigation"
import { marked } from "marked"
import { getImageUrl } from "@/lib/utils"
import { documentToHtmlString, type Options } from "@contentful/rich-text-html-renderer"
import { BLOCKS } from "@contentful/rich-text-types"
import type { Document } from "@contentful/rich-text-types"

// Helper function to create embed URLs for videos
const getEmbedUrl = (url: string): string => {
  if (!url) return ""
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname.includes("youtube.com") || urlObj.hostname.includes("youtu.be")) {
      const videoId = urlObj.hostname.includes("youtu.be") ? urlObj.pathname.slice(1) : urlObj.searchParams.get("v")
      return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : url
    }
    if (urlObj.hostname.includes("vimeo.com")) {
      const videoId = urlObj.pathname.split("/").pop()
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url
    }
  } catch (e) {
    // Invalid URL, return original
    return url
  }
  return url // Fallback for other video services
}

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

  const featuredImageUrl = getImageUrl(post.featuredImage?.url)
  let contentHtml = ""

  if (post.content) {
    if (typeof post.content === "string") {
      // Handle Markdown string
      contentHtml = marked(post.content)
    } else if (typeof post.content === "object") {
      // Handle Contentful Rich Text object
      const richTextDocument = (post.content as any).json ?? post.content

      const renderOptions: Options = {
        renderNode: {
          [BLOCKS.EMBEDDED_ENTRY]: (node) => {
            const contentType = node.data.target?.sys?.contentType?.sys?.id
            // This assumes you have a Contentful content type with the ID 'videoEmbed'
            // and it has a field with the ID 'videoUrl'.
            if (contentType === "videoEmbed") {
              const videoUrl = node.data.target?.fields?.videoUrl
              if (typeof videoUrl === "string") {
                const embedUrl = getEmbedUrl(videoUrl)
                return `<div class="my-8 relative w-full overflow-hidden rounded-lg shadow-lg mx-auto" style="padding-bottom: 56.25%; max-width: 800px;">
                          <iframe
                              src="${embedUrl}"
                              class="absolute top-0 left-0 w-full h-full"
                              frameborder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowfullscreen
                              title="Embedded video"
                          ></iframe>
                      </div>`
              }
            }
            return "" // Don't render other unhandled embedded entries
          },
          [BLOCKS.EMBEDDED_ASSET]: (node) => {
            const file = node.data.target?.fields?.file
            if (file?.contentType.startsWith("image/")) {
              const imageUrl = getImageUrl(file.url)
              const altText = node.data.target.fields.title || ""
              // Note: We can't use Next/Image here because we're generating a raw HTML string.
              return `<div class="my-6"><img src="${imageUrl}" alt="${altText}" class="w-full h-auto rounded-lg shadow-md object-contain" loading="lazy" /></div>`
            }
            return ""
          },
        },
      }

      contentHtml = documentToHtmlString(richTextDocument as Document, renderOptions)
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

export async function generateStaticParams() {
  const posts = await getBlogPosts(100)
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
