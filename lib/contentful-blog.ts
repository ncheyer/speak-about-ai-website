import { createClient } from "contentful"

const space = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

if (!space || !accessToken) {
  throw new Error("CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN environment variables must be defined.")
}

const client = createClient({
  space: space,
  accessToken: accessToken,
})

export async function fetchGraphQL(query: string, preview = false): Promise<any> {
  try {
    const result = await fetch(`https://graphql.contentful.com/content/v1/spaces/${space}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${preview ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : accessToken}`,
      },
      body: JSON.stringify({ query }),
    }).then((response) => response.json())
    return result
  } catch (error) {
    console.error("Error fetching GraphQL:", error)
    throw error
  }
}

function parsePost({ fields }: any): BlogPost {
  return {
    title: fields.title,
    slug: fields.slug,
    date: fields.date,
    content: fields.content,
    excerpt: fields.excerpt,
    coverImage: fields.coverImage?.fields?.file?.url || null,
  }
}

function parsePostEntries(entries: any[] = [], locale = "en-US") {
  return entries?.map((entry: any) => {
    if (entry?.fields) {
      return {
        ...entry.fields,
        date: entry.fields.date,
        slug: entry.fields.slug,
        title: entry.fields.title,
        content: entry.fields.content,
        excerpt: entry.fields.excerpt,
        coverImage: entry.fields.coverImage?.fields?.file?.url || null,
      }
    }
    return null
  })
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await client.getEntries({
      content_type: "blogPost",
      "fields.slug": slug,
      limit: 1,
      include: 3,
    })

    if (response.items.length === 0) {
      return null
    }

    return parsePost(response.items[0])
  } catch (error) {
    console.error("Error fetching blog post by slug:", error)
    return null
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await client.getEntries({
      content_type: "blogPost",
      order: "-fields.date",
      include: 3,
    })

    return response.items.map((item: any) => parsePost(item))
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export interface BlogPost {
  title: string
  slug: string
  date: string
  content: string
  excerpt: string
  coverImage: string | null
}
