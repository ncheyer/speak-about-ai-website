import { createClient as contentfulCreateClient } from "contentful"
import type { Document } from "@contentful/rich-text-types"
import { documentToHtmlString } from "@contentful/rich-text-html-renderer"

// Standard environment variable checks
if (!process.env.CONTENTFUL_SPACE_ID) {
  console.error("CONTENTFUL_SPACE_ID is missing.")
}
if (!process.env.CONTENTFUL_ACCESS_TOKEN) {
  console.error("CONTENTFUL_ACCESS_TOKEN is missing.")
}
// CONTENTFUL_PREVIEW_SECRET is used by the API route, not directly here

// Client always uses the standard Delivery API token and CDN
export const contentfulClient = contentfulCreateClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  // host defaults to 'cdn.contentful.com'
})

export interface ContentfulBlogPost {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: {
    title: string
    slug: string
    metaDescription: string
    featuredImage?: {
      fields: {
        file: {
          url: string
        }
        title: string
      }
    }
    excerpt: string
    content: Document
    author: string
    publishedDate: string
    category: string
    tags: string[]
    seoKeywords: string
    status: string // This field is crucial for our "no preview token" approach
  }
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

// Updated to accept an isPreview flag
export async function getBlogPostsFromContentful(isPreview = false) {
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    console.error("Contentful credentials missing in getBlogPostsFromContentful.")
    return []
  }
  try {
    const queryOptions: any = {
      content_type: "blogPost",
      order: "-fields.publishedDate",
    }

    if (!isPreview) {
      // For non-preview, only fetch "Published"
      queryOptions["fields.status"] = "Published"
    }
    // For isPreview, we fetch all statuses.
    // Success depends on CONTENTFUL_ACCESS_TOKEN permissions.

    const response = await contentfulClient.getEntries<ContentfulBlogPost["fields"]>(queryOptions)

    return response.items.map((item) => {
      const htmlContent = documentToHtmlString(item.fields.content)
      return {
        id: item.sys.id,
        slug: item.fields.slug,
        title: item.fields.title,
        excerpt: item.fields.excerpt,
        content: htmlContent,
        author: item.fields.author,
        authorTitle: undefined,
        authorImage: undefined,
        coverImage: item.fields.featuredImage?.fields.file.url
          ? `https:${item.fields.featuredImage.fields.file.url}`
          : "/placeholder.jpg",
        date: new Date(item.fields.publishedDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        readTime: calculateReadTime(htmlContent),
        tags: item.fields.tags || [],
        featured: item.fields.category === "Featured" || item.fields.tags?.includes("Featured"),
        category: item.fields.category,
        metaDescription: item.fields.metaDescription,
        seoKeywords: item.fields.seoKeywords,
        status: item.fields.status, // Include status
      }
    })
  } catch (error) {
    console.error("Error fetching blog posts from Contentful:", error)
    return []
  }
}

// Updated to accept an isPreview flag
export async function getBlogPostBySlugFromContentful(slug: string, isPreview = false) {
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    console.error("Contentful credentials missing in getBlogPostBySlugFromContentful.")
    return null
  }
  try {
    const queryOptions: any = {
      content_type: "blogPost",
      "fields.slug": slug,
      limit: 1,
    }

    if (!isPreview) {
      // For non-preview, only fetch "Published"
      queryOptions["fields.status"] = "Published"
    }
    // For isPreview, we fetch by slug regardless of status.
    // Success depends on CONTENTFUL_ACCESS_TOKEN permissions.

    const response = await contentfulClient.getEntries<ContentfulBlogPost["fields"]>(queryOptions)

    if (response.items.length === 0) {
      return null
    }
    const item = response.items[0]

    // If not in preview mode AND the item fetched (somehow) isn't published, treat as not found.
    if (!isPreview && item.fields.status !== "Published") {
      console.warn(
        `Post with slug '${slug}' found but is not "Published" (status: ${item.fields.status}). Not showing in non-preview mode.`,
      )
      return null
    }

    const htmlContent = documentToHtmlString(item.fields.content)
    return {
      id: item.sys.id,
      slug: item.fields.slug,
      title: item.fields.title,
      excerpt: item.fields.excerpt,
      content: htmlContent,
      author: item.fields.author,
      authorTitle: undefined,
      authorImage: undefined,
      coverImage: item.fields.featuredImage?.fields.file.url
        ? `https:${item.fields.featuredImage.fields.file.url}`
        : "/placeholder.jpg",
      date: new Date(item.fields.publishedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readTime: calculateReadTime(htmlContent),
      tags: item.fields.tags || [],
      featured: item.fields.category === "Featured" || item.fields.tags?.includes("Featured"),
      category: item.fields.category,
      metaDescription: item.fields.metaDescription,
      seoKeywords: item.fields.seoKeywords,
      status: item.fields.status, // Include status
    }
  } catch (error) {
    console.error(`Error fetching blog post by slug (${slug}) from Contentful:`, error)
    return null
  }
}
