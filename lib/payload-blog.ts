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
  const fullUrl = `${PAYLOAD_URL}/api/${query}`
  // console.log("🔍 Fetching from Payload:", fullUrl) // Keep this commented out unless debugging

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })

    // console.log("📡 Payload API Response Status:", res.status, res.statusText) // Keep commented

    if (!res.ok) {
      // console.error(`❌ Error fetching from Payload: ${res.status} ${res.statusText}`) // Keep commented
      // const errorText = await res.text()
      // console.error("Error details:", errorText) // Keep commented
      return null
    }

    const data = await res.json()
    // console.log("✅ Payload API Response:", data) // Keep commented
    return data
  } catch (error) {
    // console.error("🚨 Network error fetching from Payload:", error) // Keep commented
    return null
  }
}

// Get all published blog posts
export async function getBlogPosts(limit = 10): Promise<BlogPost[]> {
  // console.log("🔄 getBlogPosts called with limit:", limit) // Keep commented
  const data = await fetchPayloadAPI(
    `blog-posts?where[status][equals]=published&limit=${limit}&depth=2&sort=-publishedDate`,
  )

  const posts = data?.docs || []
  // console.log("📝 Found blog posts:", posts.length) // Keep commented
  // console.log("📋 Posts data:", posts) // Keep commented

  return posts
}

// Get a single blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // console.log("🔄 getBlogPost called with slug:", slug) // Keep commented
  const data = await fetchPayloadAPI(`blog-posts?where[slug][equals]=${slug}&depth=2`)
  const post = data?.docs?.[0] || null
  // console.log("📄 Found post:", post ? post.title : "No post found") // Keep commented
  return post
}

// Get featured posts
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  // console.log("🔄 getFeaturedPosts called") // Keep commented
  const data = await fetchPayloadAPI(
    `blog-posts?where[featured][equals]=true&where[status][equals]=published&depth=2&sort=-publishedDate`,
  )
  const posts = data?.docs || []
  // console.log("⭐ Found featured posts:", posts.length) // Keep commented
  return posts
}

// Get posts by category slug
export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  // console.log("🔄 getPostsByCategory called with category:", categorySlug) // Keep commented
  const data = await fetchPayloadAPI(
    `blog-posts?where[categories.slug][equals]=${categorySlug}&where[status][equals]=published&depth=2&sort=-publishedDate`,
  )
  const posts = data?.docs || []
  // console.log("🏷️ Found posts in category:", posts.length) // Keep commented
  return posts
}

// Legacy function names for backward compatibility
export async function getBlogPostsFromPayload(includeUnpublished = false): Promise<BlogPost[]> {
  // console.log("🔄 getBlogPostsFromPayload called, includeUnpublished:", includeUnpublished) // Keep commented
  if (includeUnpublished) {
    const data = await fetchPayloadAPI(`blog-posts?depth=2&sort=-publishedDate`)
    const posts = data?.docs || []
    // console.log("📝 Found all posts (including unpublished):", posts.length) // Keep commented
    return posts
  }
  return getBlogPosts()
}

export async function getBlogPostBySlugFromPayload(slug: string, includeUnpublished = false): Promise<BlogPost | null> {
  // console.log("🔄 getBlogPostBySlugFromPayload called, slug:", slug, "includeUnpublished:", includeUnpublished) // Keep commented
  if (includeUnpublished) {
    const data = await fetchPayloadAPI(`blog-posts?where[slug][equals]=${slug}&depth=2`)
    const post = data?.docs?.[0] || null
    // console.log("📄 Found post (including unpublished):", post ? post.title : "No post found") // Keep commented
    return post
  }
  return getBlogPost(slug)
}

export async function getFeaturedBlogPostsFromPayload(): Promise<BlogPost[]> {
  return getFeaturedPosts()
}

export async function getRelatedBlogPostsFromPayload(currentPostId: string, limit = 3): Promise<BlogPost[]> {
  // console.log("🔄 getRelatedBlogPostsFromPayload called, currentPostId:", currentPostId, "limit:", limit) // Keep commented
  const data = await fetchPayloadAPI(
    `blog-posts?where[id][not_equals]=${currentPostId}&where[status][equals]=published&depth=2&sort=-publishedDate&limit=${limit}`,
  )
  const posts = data?.docs || []
  // console.log("🔗 Found related posts:", posts.length) // Keep commented
  return posts
}
