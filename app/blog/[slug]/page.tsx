import { getBlogPost, getBlogPosts } from "@/lib/blog-data"
import Image from "next/image"
import { notFound } from "next/navigation"
import { marked } from "marked"
import { getImageUrl } from "@/lib/utils"
import { documentToHtmlString, type Options } from "@contentful/rich-text-html-renderer"
import { BLOCKS } from "@contentful/rich-text-types"
import type { Document } from "@contentful/rich-text-types"

// Helper function to fix YouTube URLs in iframe src attributes
const fixYouTubeIframes = (html: string): string => {
  return html.replace(
    /<iframe([^>]*)\ssrc=["']https:\/\/www\.youtube\.com\/watch\?v=([^"'&]+)[^"']*["']([^>]*)>/gi,
    (match, beforeSrc, videoId, afterSrc) => {
      // Convert watch URL to embed URL and make it responsive
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
      // Fix any YouTube iframes in the markdown-generated HTML
      contentHtml = fixYouTubeIframes(contentHtml)
    } else if (typeof post.content === "object") {
      // Handle Contentful Rich Text object
      const richTextDocument = (post.content as any).json ?? post.content

      const renderOptions: Options = {
        renderNode: {
          [BLOCKS.EMBEDDED_ENTRY]: (node) => {
            if (!node.data?.target?.sys?.contentType?.sys?.id) {
              return ""
            }
            const contentType = node.data.target.sys.contentType.sys.id

            if (contentType === "videoEmbed") {
              const videoUrl = node.data.target.fields?.videoUrl
              if (typeof videoUrl === "string") {
                const videoId =
                  videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")
                    ? videoUrl.includes("youtu.be")
                      ? videoUrl.split("/").pop()
                      : new URL(videoUrl).searchParams.get("v")
                    : null

                if (videoId) {
                  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`
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
            }
            return ""
          },
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
        contentHtml = documentToHtmlString(richTextDocument as Document, renderOptions)
        // Fix any YouTube iframes in the rich text HTML
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
  const posts = await getBlogPosts(100)
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
