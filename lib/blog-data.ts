import { createClient } from "contentful"

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
})

export interface BlogPost {
  title: string
  slug: string
  content: string
  createdAt: string
  featuredImage: {
    fields: {
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
      include: 3, // This fetches linked entries up to 3 levels deep
    })

    if (response.items.length > 0) {
      const item = response.items[0]
      return {
        title: item.fields.title as string,
        slug: item.fields.slug as string,
        content: item.fields.content as string,
        createdAt: item.sys.createdAt as string,
        featuredImage: item.fields.featuredImage as {
          fields: {
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
        },
      }
    } else {
      return null
    }
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export async function getBlogPosts(limit = 10): Promise<BlogPost[]> {
  try {
    const response = await client.getEntries({
      content_type: "blogPost",
      limit,
      order: "-sys.createdAt",
      include: 3, // This fetches linked entries up to 3 levels deep
    })

    return response.items.map((item) => ({
      title: item.fields.title as string,
      slug: item.fields.slug as string,
      content: item.fields.content as string,
      createdAt: item.sys.createdAt as string,
      featuredImage: item.fields.featuredImage as {
        fields: {
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
      },
    }))
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}
