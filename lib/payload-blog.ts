const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000"

// Define a type for the Post object for better type safety
// This should match the structure of your 'blog-posts' collection in Payload
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string // This will be HTML
  publishedDate: string
  readTime?: number
  status: "published" | "draft"
  featured: boolean
  author: {
    name: string
  }
  featuredImage: {
    url: string
    alt: string
  }
  categories: {
    slug: string
    name: string
  }[]
}

async function fetchPayloadAPI(query: string, options: RequestInit = {}) {
  const res = await fetch(`${PAYLOAD_URL}/api/${query}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  })

  if (!res.ok) {
    // Handle errors appropriately in a real application
    console.error(`Error fetching from Payload: ${res.statusText}`)
    return null
  }

  return res.json()
}

// Get all published blog posts
export async function getBlogPosts(limit = 10): Promise<BlogPost[]> {
  const data = await fetchPayloadAPI(
    `blog-posts?where[status][equals]=published&limit=${limit}&depth=2&sort=-publishedDate`,
  )
  return data?.docs || []
}

// Get a single blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const data = await fetchPayloadAPI(`blog-posts?where[slug][equals]=${slug}&depth=2`)
  return data?.docs?.[0] || null
}

// Get featured posts
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const data = await fetchPayloadAPI(
    `blog-posts?where[featured][equals]=true&where[status][equals]=published&depth=2&sort=-publishedDate`,
  )
  return data?.docs || []
}

// Get posts by category slug
export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  const data = await fetchPayloadAPI(
    `blog-posts?where[categories.slug][equals]=${categorySlug}&where[status][equals]=published&depth=2&sort=-publishedDate`,
  )
  return data?.docs || []
}

// Legacy function names for backward compatibility
export async function getBlogPostsFromPayload(includeUnpublished = false): Promise<BlogPost[]> {
  if (includeUnpublished) {
    const data = await fetchPayloadAPI(`blog-posts?depth=2&sort=-publishedDate`)
    return data?.docs || []
  }
  return getBlogPosts()
}

export async function getBlogPostBySlugFromPayload(slug: string, includeUnpublished = false): Promise<BlogPost | null> {
  if (includeUnpublished) {
    const data = await fetchPayloadAPI(`blog-posts?where[slug][equals]=${slug}&depth=2`)
    return data?.docs?.[0] || null
  }
  return getBlogPost(slug)
}

export async function getFeaturedBlogPostsFromPayload(): Promise<BlogPost[]> {
  return getFeaturedPosts()
}

export async function getRelatedBlogPostsFromPayload(currentPostId: string, limit = 3): Promise<BlogPost[]> {
  const data = await fetchPayloadAPI(
    `blog-posts?where[id][not_equals]=${currentPostId}&where[status][equals]=published&depth=2&sort=-publishedDate&limit=${limit}`,
  )
  return data?.docs || []
}
