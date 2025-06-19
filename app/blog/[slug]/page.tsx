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

// Helper function to render video embed HTML with enhanced debugging
const renderVideoEmbed = (node: any): string => {
  console.log("Attempting to render video embed. Node data:", JSON.stringify(node.data, null, 2))

  if (!node.data?.target) {
    const debugMsg = "Debug: Video embed node found, but 'node.data.target' is missing."
    console.error(debugMsg, "Full node:", JSON.stringify(node, null, 2))
    return `<div class="my-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">${debugMsg}</div>`
  }

  const target = node.data.target
  console.log("Video embed target:", JSON.stringify(target, null, 2))

  const contentTypeId = target.sys?.contentType?.sys?.id
  if (!contentTypeId) {
    const debugMsg = "Debug: Video embed target found, but 'contentTypeId' is missing."
    console.error(debugMsg, "Target sys:", JSON.stringify(target.sys, null, 2))
    return `<div class="my-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">${debugMsg}</div>`
  }
  console.log("Video embed contentTypeId:", contentTypeId)

  const fields = target.fields || {}
  console.log(`Video embed fields for contentType '${contentTypeId}':`, JSON.stringify(fields, null, 2))

  const possibleUrlFields = ["videoUrl", "url", "link", "youtubeUrl", "videoLink", "file"] // Added "file" for potential direct asset links
  let videoUrl = null
  let foundFieldName = null

  for (const fieldName of possibleUrlFields) {
    if (fields[fieldName]) {
      // If it's a direct asset (e.g., from a 'file' field)
      if (typeof fields[fieldName] === "object" && fields[fieldName].fields?.file?.url) {
        videoUrl = fields[fieldName].fields.file.url
      } else if (typeof fields[fieldName] === "object" && fields[fieldName].url) {
        // For simple link objects
        videoUrl = fields[fieldName].url
      }
      // For simple text fields
      else if (typeof fields[fieldName] === "string") {
        videoUrl = fields[fieldName]
      }

      if (videoUrl) {
        foundFieldName = fieldName
        break
      }
    }
  }

  console.log(`Searched for video URL. Found field: '${foundFieldName}', Value: '${videoUrl}'`)

  if (!videoUrl || typeof videoUrl !== "string") {
    const debugMsg = `Debug: Video entry (type: ${contentTypeId}) found, but no valid URL field. Looked for: ${possibleUrlFields.join(", ")}. Available fields: ${Object.keys(fields).join(", ")}.`
    console.error(debugMsg)
    return `<div class="my-4 p-2 bg-yellow-100 text-yellow-700 border border-yellow-300 rounded">${debugMsg}</div>`
  }

  const embedUrl = getEmbedUrl(videoUrl)
  const title = fields.title || fields.name || "Embedded video"
  console.log("Final video embed URL:", embedUrl)

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

  const featuredImageUrl = post.featuredImage?.url ? getImageUrl(post.featuredImage.url) : null
  let contentHtml = ""

  if (post.content) {
    if (typeof post.content === "string") {
      // Handle Markdown string
      contentHtml = marked(post.content)
      contentHtml = fixYouTubeIframes(contentHtml)
    } else if (typeof post.content === "object" && post.content.nodeType === "document") {
      // More specific check for Rich Text Document
      // Handle Contentful Rich Text object
      const renderOptions: Options = {
        renderNode: {
          [BLOCKS.EMBEDDED_ENTRY]: (node) => {
            console.log("BLOCKS.EMBEDDED_ENTRY found")
            return renderVideoEmbed(node)
          },
          [INLINES.EMBEDDED_ENTRY]: (node) => {
            console.log("INLINES.EMBEDDED_ENTRY found")
            return renderVideoEmbed(node)
          },
          [BLOCKS.EMBEDDED_ASSET]: (node) => {
            if (!node.data?.target?.fields?.file) {
              return ""
            }
            const file = node.data.target.fields.file
            if (file?.contentType?.startsWith("image/")) {
              let imageUrl = file.url
              if (imageUrl.startsWith("//")) {
                imageUrl = `https:${imageUrl}`
              }
              const altText = node.data.target.fields.title || ""
              return `<div class="my-6"><img src="${imageUrl}" alt="${altText}" class="w-full h-auto rounded-lg shadow-md object-contain" loading="lazy" /></div>`
            }
            return ""
          },
        },
      }

      try {
        contentHtml = documentToHtmlString(post.content as Document, renderOptions)
        contentHtml = fixYouTubeIframes(contentHtml) // In case some iframes are still raw HTML
      } catch (error) {
        console.error("Error rendering rich text:", error)
        contentHtml = "<p>Error rendering content. Please check console.</p>"
      }
    } else {
      console.warn(
        "Content format not recognized as Markdown string or Contentful Rich Text Document. Content:",
        post.content,
      )
      contentHtml = "<p>Content format not supported or content is empty.</p>"
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
            {new Date(post.publishedDate || post.createdAt).toLocaleDateString("en-US", {
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
  const posts = await getBlogPosts(200)
  return posts
    .filter((post) => typeof post.slug === "string" && post.slug.trim().length > 0)
    .map((post) => ({ slug: post.slug }))
}
