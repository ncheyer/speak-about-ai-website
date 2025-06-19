import { getBlogPost, getBlogPosts } from "@/lib/blog-data"
import Image from "next/image"
import { notFound } from "next/navigation"
import { marked } from "marked"
import { getImageUrl } from "@/lib/utils"
import { documentToHtmlString, type Options } from "@contentful/rich-text-html-renderer"
import { BLOCKS, INLINES } from "@contentful/rich-text-types"
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
    console.error("Error parsing video URL:", e)
    return url
  }
  return url
}

// Helper function to render video embed HTML with debugging
const renderVideoEmbed = (node: any): string => {
  console.log("=== VIDEO EMBED DEBUG ===")
  console.log("Full node:", JSON.stringify(node, null, 2))

  if (!node.data?.target) {
    console.log("No target found in node.data")
    return `<div class="my-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">Debug: No target found in embedded entry</div>`
  }

  const target = node.data.target
  console.log("Target:", JSON.stringify(target, null, 2))

  const contentTypeId = target.sys?.contentType?.sys?.id
  console.log("Content Type ID:", contentTypeId)

  if (!contentTypeId) {
    return `<div class="my-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">Debug: No content type ID found</div>`
  }

  // Check all possible field names for the video URL
  const fields = target.fields || {}
  console.log("Available fields:", Object.keys(fields))

  // Try different possible field names
  const possibleUrlFields = ["videoUrl", "url", "link", "youtubeUrl", "videoLink"]
  let videoUrl = null
  let usedFieldName = null

  for (const fieldName of possibleUrlFields) {
    if (fields[fieldName]) {
      videoUrl = fields[fieldName]
      usedFieldName = fieldName
      break
    }
  }

  console.log("Found video URL:", videoUrl, "using field:", usedFieldName)

  if (!videoUrl || typeof videoUrl !== "string") {
    return `<div class="my-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              Debug: Video entry found but no URL field. 
              <br>Content Type: ${contentTypeId}
              <br>Available fields: ${Object.keys(fields).join(", ")}
              <br>Looking for: ${possibleUrlFields.join(", ")}
            </div>`
  }

  const embedUrl = getEmbedUrl(videoUrl)
  const title = fields.title || fields.name || "Embedded video"

  console.log("Final embed URL:", embedUrl)

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
}

// Helper function to fix YouTube URLs in iframe src attributes (for raw HTML)
const fixYouTubeIframes = (html: string): string => {
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

  if (!post) {
    notFound()
  }

  const featuredImageUrl = getImageUrl(post.featuredImage?.url)
  let contentHtml = ""

  if (post.content) {
    if (typeof post.content === "string") {
      // Handle Markdown string
      contentHtml = marked(post.content)
      contentHtml = fixYouTubeIframes(contentHtml)
    } else if (typeof post.content === "object") {
      // Handle Contentful Rich Text object
      const richTextDocument = (post.content as any).json ?? post.content

      const renderOptions: Options = {
        renderNode: {
          // Handle block-level embedded entries
          [BLOCKS.EMBEDDED_ENTRY]: (node) => {
            console.log("Block embedded entry found")
            return renderVideoEmbed(node)
          },
          // Handle inline embedded entries
          [INLINES.EMBEDDED_ENTRY]: (node) => {
            console.log("Inline embedded entry found")
            return renderVideoEmbed(node)
          },
          // Handle embedded assets (images)
          [BLOCKS.EMBEDDED_ASSET]: (node) => {
            if (!node.data?.target?.fields?.file) {
              return ""
            }
            const file = node.data.target.fields.file
            if (file?.contentType?.startsWith("image/")) {
              const imageUrl = getImageUrl(file.url)
              const altText = node.data.target.fields.title || ""
              return `<div class="my-6"><img src="${imageUrl}" alt="${altText}" class="w-full h-auto rounded-lg shadow-md object-contain" loading="lazy" /></div>`
            }
            return ""
          },
        },
      }

      if (richTextDocument) {
        console.log("Processing rich text document:", JSON.stringify(richTextDocument, null, 2))
        contentHtml = documentToHtmlString(richTextDocument as Document, renderOptions)
        contentHtml = fixYouTubeIframes(contentHtml)
      }
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
  // Grab a generous number of posts so ISR picks up new ones later
  const posts = await getBlogPosts(200)

  return posts
    .filter((post) => typeof post.slug === "string" && post.slug.trim().length > 0)
    .map((post) => ({ slug: post.slug }))
}
