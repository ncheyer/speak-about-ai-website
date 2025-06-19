import { createClient } from "contentful"

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
})

export interface BlogPost {
  title: string
  slug: string
  content: any // Changed from string to any to handle Rich Text
  createdAt: string
  publishedDate?: string
  readTime?: number
  author?: { name: string }
  featuredImage?: {
    url: string
    alt?: string
    fields?: {
      file: {
        url: string
        details: {
          image: {
            width: number
            height: number
          }
        }
      }
    }
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await client.getEntries({
      content_type: "blogPost",
      "fields.slug": slug,
      limit: 1,
      include: 10, // Increased to ensure all linked content is fetched
    })

    if (response.items.length > 0) {
      const item = response.items[0]
      const fields = item.fields as any

      // Handle featured image
      let featuredImage = null
      if (fields.featuredImage) {
        if (fields.featuredImage.fields?.file) {
          // Direct asset reference
          featuredImage = {
            url: fields.featuredImage.fields.file.url.startsWith("//")
              ? `https:${fields.featuredImage.fields.file.url}`
              : fields.featuredImage.fields.file.url,
            alt: fields.featuredImage.fields.title || fields.title,
            fields: fields.featuredImage.fields,
          }
        }
      }

      return {
        title: fields.title as string,
        slug: fields.slug as string,
        content: fields.content, // Keep as-is (Rich Text object or string)
        createdAt: item.sys.createdAt as string,
        publishedDate: fields.publishedDate || fields.date || item.sys.createdAt,
        readTime: fields.readTime,
        author: fields.author
          ? { name: fields.author.fields?.name || fields.author.name || "Speak About AI" }
          : { name: "Speak About AI" },
        featuredImage,
      }
    } else {
      return null
    }
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export async function getBlogPostBySlug(slug: string) {
  return getBlogPost(slug) // Use the same function
}

export async function getBlogPosts(limit = 10): Promise<BlogPost[]> {
  try {
    const response = await client.getEntries({
      content_type: "blogPost",
      limit,
      order: "-sys.createdAt",
      include: 10, // Increased to ensure all linked content is fetched
    })

    return response.items.map((item) => {
      const fields = item.fields as any

      // Handle featured image
      let featuredImage = null
      if (fields.featuredImage) {
        if (fields.featuredImage.fields?.file) {
          featuredImage = {
            url: fields.featuredImage.fields.file.url.startsWith("//")
              ? `https:${fields.featuredImage.fields.file.url}`
              : fields.featuredImage.fields.file.url,
            alt: fields.featuredImage.fields.title || fields.title,
            fields: fields.featuredImage.fields,
          }
        }
      }

      return {
        title: fields.title as string,
        slug: fields.slug as string,
        content: fields.content, // Keep as-is (Rich Text object or string)
        createdAt: item.sys.createdAt as string,
        publishedDate: fields.publishedDate || fields.date || item.sys.createdAt,
        readTime: fields.readTime,
        author: fields.author
          ? { name: fields.author.fields?.name || fields.author.name || "Speak About AI" }
          : { name: "Speak About AI" },
        featuredImage,
      }
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}
