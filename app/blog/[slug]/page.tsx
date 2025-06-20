import { getBlogPost, getBlogPosts } from "@/lib/blog-data"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { marked } from "marked"
import { getImageUrl } from "@/lib/utils"
import { documentToHtmlString, type Options } from "@contentful/rich-text-html-renderer"
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types"
import type { Document, Block, Inline } from "@contentful/rich-text-types"
import { Badge } from "@/components/ui/badge"

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
    return url
  }
  return url
}

// Helper function to render video embed HTML
const renderVideoEmbed = (node: Block | Inline): string => {
  if (!node.data?.target?.sys?.contentType?.sys?.id) {
    console.error("EMBEDDED_ENTRY: Missing target, sys, contentType, or id.", node.data)
    return `<div class="my-2 p-2 bg-red-100 text-red-700">Error: Video data missing.</div>`
  }
  const contentType = node.data.target.sys.contentType.sys.id
  const fields = node.data.target.fields
  if (
    (contentType === "video" || contentType === "videoEmbed" || contentType === "youtubeVideo") &&
    fields &&
    typeof fields === "object"
  ) {
    const videoUrlField = fields.videoUrl || fields.url || fields.youtubeUrl || fields.file?.url
    const title = fields.title || fields.name || "Embedded video"
    if (typeof videoUrlField === "string") {
      const embedUrl = getEmbedUrl(videoUrlField)
      return `<div class="my-8 relative w-full overflow-hidden rounded-lg shadow-lg mx-auto" style="padding-bottom: 56.25%; max-width: 800px;">
              <iframe src="${embedUrl}" class="absolute top-0 left-0 w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen title="${title}"></iframe>
          </div>`
    } else {
      console.error("EMBEDDED_ENTRY: Video URL field is not a string or not found.", videoUrlField)
      return `<div class="my-2 p-2 bg-yellow-100 text-yellow-700">Warning: Video URL not found or invalid.</div>`
    }
  }
  return ""
}

// Helper function to fix YouTube URLs in iframe src attributes
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

  if (!post) {
    notFound()
  }

  const featuredImageUrl = post.featuredImage?.url ? getImageUrl(post.featuredImage.url) : null
  let contentHtml = ""

  if (post.content) {
    if (typeof post.content === "string") {
      contentHtml = marked(post.content)
      contentHtml = fixYouTubeIframes(contentHtml)
    } else if (typeof post.content === "object" && post.content.nodeType === "document") {
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
            console.log("--- EMBEDDED ASSET RENDERER ---")
            console.log("Full Node Object:", JSON.stringify(node.data?.target?.fields, null, 2))

            if (!node.data?.target?.fields?.file?.url || typeof node.data.target.fields.file.url !== "string") {
              console.error(
                "EMBEDDED_ASSET_ERROR: 'node.data.target.fields.file.url' is missing or not a string. Asset ID:",
                node.data?.target?.sys?.id,
              )
              return `<p style='color:red; border: 1px solid red; padding: 5px;'>Error: Embedded asset (ID: ${node.data?.target?.sys?.id || "unknown"}) is missing 'file.url' or it's not a string. Is the asset published in Contentful and linked correctly?</p>`
            }

            const file = node.data.target.fields.file
            const assetFields = node.data.target.fields

            if (file.contentType && typeof file.contentType === "string" && file.contentType.startsWith("image/")) {
              const imageUrl = getImageUrl(file.url) // Now uses the updated lib/utils.ts version
              const altText = assetFields.description || assetFields.title || "Embedded image"

              if (!imageUrl) {
                console.error("EMBEDDED_ASSET_ERROR: getImageUrl returned null for URL:", file.url)
                return `<p style='color:red; border: 1px solid red; padding: 5px;'>Error: Could not construct valid image URL for asset (ID: ${node.data?.target?.sys?.id}).</p>`
              }

              console.log(
                `EMBEDDED_ASSET_SUCCESS: Rendering image. Original URL: ${file.url}, Processed URL: ${imageUrl}, Alt: ${altText}`,
              )
              // Change the wrapper to center the image, and set a max-width on the image itself
              return `<div class="my-6 flex justify-center">
                <img src="${imageUrl}" alt="${altText}" 
                     class="max-w-[75%] h-auto rounded-lg shadow-md object-contain" 
                     loading="lazy" />
              </div>`
            }

            console.warn(
              "EMBEDDED_ASSET_WARN: Asset is not an image. ContentType:",
              file.contentType,
              "Asset ID:",
              node.data?.target?.sys?.id,
            )
            return `<p style='color:orange; border: 1px solid orange; padding: 5px;'>Warning: Embedded asset (ID: ${node.data?.target?.sys?.id}) is not an image. ContentType: ${file.contentType || "unknown"}</p>`
          },
        },
      }
      contentHtml = documentToHtmlString(richTextDocument, renderOptions)
      contentHtml = fixYouTubeIframes(contentHtml)
    } else {
      contentHtml = "<p>Content is in an unexpected format.</p>"
    }
  } else {
    contentHtml = "<p>No content available for this post.</p>"
  }

  return (
    <article className="bg-white text-gray-800">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{post.title}</h1>
        <div className="text-gray-600 mb-2">
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

        {post.categories && post.categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <Link href={`/blog/category/${category.slug}`} key={category.slug}>
                <Badge variant="secondary" className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  {category.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {featuredImageUrl && (
          <div className="relative w-full h-80 mb-8 rounded-lg overflow-hidden">
            <Image
              src={featuredImageUrl || "/placeholder.svg"} // Already processed by getImageUrl
              alt={post.featuredImage?.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div
          className="prose prose-lg max-w-none text-gray-800 prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-strong:text-gray-800 prose-code:bg-gray-100 prose-code:p-1 prose-code:rounded"
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
