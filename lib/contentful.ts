import { createClient } from "contentful"
import type { Document } from "@contentful/rich-text-types"
import { documentToHtmlString } from "@contentful/rich-text-html-renderer"

if (!process.env.CONTENTFUL_SPACE_ID) {
  throw new Error("CONTENTFUL_SPACE_ID is required")
}

if (!process.env.CONTENTFUL_ACCESS_TOKEN) {
  throw new Error("CONTENTFUL_ACCESS_TOKEN is required")
}

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

// Contentful blog post content type interface matching your structure
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
    content: Document // Rich text field
    author: string
    publishedDate: string
    category: string
    tags: string[]
    seoKeywords: string
    status: string
  }
}

// Helper function to calculate read time from content
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

export async function getBlogPostsFromContentful() {
  try {
    const response = await contentfulClient.getEntries<ContentfulBlogPost["fields"]>({
      content_type: "blogPost",
      "fields.status": "Published", // Only get published posts
      order: "-fields.publishedDate",
    })

    return response.items.map((item) => {
      const htmlContent = documentToHtmlString(item.fields.content)

      return {
        id: item.sys.id,
        slug: item.fields.slug,
        title: item.fields.title,
        excerpt: item.fields.excerpt,
        content: htmlContent, // Convert rich text to HTML
        author: item.fields.author,
        authorTitle: undefined, // Not in your Contentful structure
        authorImage: undefined, // Not in your Contentful structure
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
        featured: item.fields.category === "Featured" || item.fields.tags?.includes("Featured"), // Determine featured status
        category: item.fields.category,
        metaDescription: item.fields.metaDescription,
        seoKeywords: item.fields.seoKeywords,
      }
    })
  } catch (error) {
    console.error("Error fetching blog posts from Contentful:", error)
    return []
  }
}

export async function getBlogPostBySlugFromContentful(slug: string) {
  try {
    const response = await contentfulClient.getEntries<ContentfulBlogPost["fields"]>({
      content_type: "blogPost",
      "fields.slug": slug,
      "fields.status": "Published",
      limit: 1,
    })

    if (response.items.length === 0) {
      return null
    }

    const item = response.items[0]
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
    }
  } catch (error) {
    console.error("Error fetching blog post from Contentful:", error)
    return null
  }
}
