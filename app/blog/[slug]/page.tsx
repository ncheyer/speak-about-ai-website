import { getBlogPost, getBlogPosts } from "@/lib/blog-data"
import Image from "next/image"
import { notFound } from "next/navigation"
import { marked } from "marked" // Keep for potential Markdown fallback
import { getImageUrl } from "@/lib/utils" // Ensure this handles Contentful URLs correctly
import { documentToHtmlString, type Options } from "@contentful/rich-text-html-renderer"
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types" // Added MARKS
import type { Document, Block, Inline } from "@contentful/rich-text-types"

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
    console.error("Error parsing video URL:", e, "URL was:", url)
    return url // Return original URL on error
  }
  return url
}

// Helper function to render video embed HTML
const renderVideoEmbed = (node: Block | Inline): string => {
  // Critical Debugging for Video Embeds:
  console.log("Attempting to render EMBEDDED_ENTRY. Node:", JSON.stringify(node, null, 2))

  if (!node.data?.target?.sys?.contentType?.sys?.id) {
    console.error("EMBEDDED_ENTRY: Missing target, sys, contentType, or id.", node.data)
    return `<div class="my-2 p-2 bg-red-100 text-red-700">Error: Video data missing.</div>`
  }

  const contentType = node.data.target.sys.contentType.sys.id
  const fields = node.data.target.fields

  console.log(`EMBEDDED_ENTRY: contentType='${contentType}', fields:`, JSON.stringify(fields, null, 2))

  // Adapt this to your Contentful Video content type ID and URL field ID
  if ((contentType === "video" || contentType === "videoEmbed" || contentType === "youtubeVideo") && fields) {
    const videoUrlField = fields.videoUrl || fields.url || fields.youtubeUrl || fields.file?.url
    const title = fields.title || fields.name || "Embedded video"

    if (typeof videoUrlField === "string") {
      const embedUrl = getEmbedUrl(videoUrlField)
      console.log(`EMBEDDED_ENTRY: Rendering video with URL: ${embedUrl}`)
      return `<div class="my-8 relative w-full overflow-hidden rounded-lg shadow-lg mx-auto" style="padding-bottom: 56.25%; max-width: 800px;">
                <iframe
                    src="${embedUrl}"
                    class="absolute top-0 left-0 w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                    title="${title}"
                ></iframe>
            </div>`
    } else {
      console.error("EMBEDDED_ENTRY: Video URL field is not a string or not found.", videoUrlField)
      return `<div class="my-2 p-2 bg-yellow-100 text-yellow-700">Warning: Video URL not found or invalid for contentType '${contentType}'.</div>`
    }
  }
  console.warn(`EMBEDDED_ENTRY: Unhandled content type '${contentType}'.`)
  return "" // Return empty string for unhandled embedded entries
}

// Helper function to fix YouTube URLs in iframe src attributes (for raw HTML fallback)
const fixYouTubeIframes = (html: string): string => {
  if (!html || typeof html !== "string") return ""
  return html.replace(
    /<iframe([^>]*)\ssrc=["']https:\/\/www\.youtube\.com\/watch\?v=([^"'&]+)[^"']*["']([^>]*)>/gi,
    (match, beforeSrc, videoId, afterSrc) => {
      const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`
      return `<div class="my-8 relative w-full overflow-hidden rounded-lg shadow-lg mx-auto" style="padding-bottom: 56.25%; max-width: 800px;">
                <iframe${beforeSrc} src="${embedUrl}"${afterSrc} class="absolute top-0 left-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
              </div>`
    },
  )
}

type BlogPostPageProps = {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  // CRITICAL DEBUG LOG:
  console.log("Full post object received from Contentful for slug", params.slug, ":", JSON.stringify(post, null, 2))

  if (!post) {
    notFound()
  }

  const featuredImageUrl = post.featuredImage?.url ? getImageUrl(post.featuredImage.url) : null
  let contentHtml = ""

  if (post.content) {
    // Check if content is a string (potential Markdown) or an object (Rich Text)
    if (typeof post.content === "string") {
      console.log("Rendering content as Markdown string.")
      contentHtml = marked(post.content)
      contentHtml = fixYouTubeIframes(contentHtml) // Fallback for raw iframes in markdown
    } else if (typeof post.content === "object" && post.content.nodeType === "document") {
      console.log("Rendering content as Contentful Rich Text Document.")
      const richTextDocument = post.content as Document

      const renderOptions: Options = {
        renderMark: {
          [MARKS.BOLD]: (text) => `<strong>${text}</strong>`,
          [MARKS.ITALIC]: (text) => `<em>${text}</em>`,
          [MARKS.UNDERLINE]: (text) => `<u>${text}</u>`,
          [MARKS.CODE]: (text) => `<code class="bg-gray-100 p-1 rounded text-sm">${text}</code>`,
        },
        renderNode: {
          [BLOCKS.EMBEDDED_ENTRY]: renderVideoEmbed,
          [INLINES.EMBEDDED_ENTRY]: renderVideoEmbed,
          [BLOCKS.EMBEDDED_ASSET]: (node) => {
            console.log("Attempting to render EMBEDDED_ASSET. Node:", JSON.stringify(node, null, 2))
            if (!node.data?.target?.fields?.file) {
              console.error("EMBEDDED_ASSET: Missing target or file data.", node.data)
              return ""
            }
            const file = node.data.target.fields.file
            if (file?.contentType?.startsWith("image/")) {
              const imageUrl = getImageUrl(file.url) // Ensure getImageUrl handles Contentful's // protocol
              const altText = node.data.target.fields.description || node.data.target.fields.title || ""
              console.log(`EMBEDDED_ASSET: Rendering image with URL: ${imageUrl}`)
              return `<div class="my-6"><img src="${imageUrl}" alt="${altText}" class="w-full h-auto rounded-lg shadow-md object-contain" loading="lazy" /></div>`
            }
            console.warn("EMBEDDED_ASSET: Unhandled asset content type:", file?.contentType)
            return ""
          },
          // Add more renderers for other BLOCKS (PARAGRAPH, HEADING_1, etc.) if default isn't enough
          // or if you want to add specific classes.
          // Example:
          // [BLOCKS.PARAGRAPH]: (node, next) => `<p class="my-4">${next(node.content)}</p>`,
          // [BLOCKS.HEADING_1]: (node, next) => `<h1 class="text-3xl font-bold my-6">${next(node.content)}</h1>`,
        },
      }

      try {
        contentHtml = documentToHtmlString(richTextDocument, renderOptions)
        // The fixYouTubeIframes might not be necessary if all videos are embedded entries
        // but can be kept as a fallback if some raw HTML iframes might still exist.
        contentHtml = fixYouTubeIframes(contentHtml)
      } catch (error) {
        console.error("Error rendering Contentful Rich Text:", error)
        contentHtml = "<p>Error displaying content. Please check the console.</p>"
      }
    } else {
      console.warn(
        "Post content is not a string (Markdown) or a Rich Text Document object. Content type:",
        typeof post.content,
        "Value:",
        post.content,
      )
      contentHtml = "<p>Content is in an unexpected format.</p>"
    }
  } else {
    contentHtml = "<p>No content available for this post.</p>"
  }

  return (
    <article className="bg-white text-gray-800">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{post.title}</h1>
        <div className="text-gray-600 mb-8">
          <span>By {post.author?.name || "Speak About AI"}</span>
          <span className="mx-2">•</span>
          <span>
            {new Date(post.publishedDate || post.createdAt).toLocaleDateString("en-US", {
              // Added fallback for publishedDate
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
        {/* Ensure prose classes are applied for Tailwind Typography */}
        <div
          className="prose prose-lg max-w-none text-gray-800 prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-strong:text-gray-800 prose-code:bg-gray-100 prose-code:p-1 prose-code:rounded"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </article>
  )
}

export async function generateStaticParams() {
  const posts = await getBlogPosts(200) // Fetch more posts for static generation if needed
  return posts
    .filter((post) => typeof post.slug === "string" && post.slug.trim().length > 0)
    .map((post) => ({ slug: post.slug }))
}
