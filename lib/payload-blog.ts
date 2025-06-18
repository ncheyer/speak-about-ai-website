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
  console.log("🔍 Fetching from:", fullUrl) // Updated log message
  console.log("🔍 PAYLOAD_URL is:", PAYLOAD_URL) // Added for clarity

  try {
    const res = await fetch(fullUrl, {
      method: "GET", // Explicitly set method
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json", // Added Accept header
        ...options.headers, // Allow overriding headers if needed
      },
      cache: "no-store", // Force fresh requests, disable caching
      ...options, // Spread other options like `next` if provided
    })

    console.log("📡 Response status:", res.status)
    console.log("📡 Response headers:", Object.fromEntries(res.headers.entries())) // Log response headers

    if (!res.ok) {
      const errorText = await res.text()
      console.error("❌ Error response text:", errorText) // Log the raw error text
      // Throw an error to be caught by the calling function or the catch block below
      throw new Error(`HTTP error ${res.status}: ${errorText || res.statusText}`)
    }

    const data = await res.json()
    console.log("✅ Success data:", data)
    return data
  } catch (error) {
    console.error("🚨 Fetch error in fetchPayloadAPI:", error) // Log the caught error
    // Re-throw the error so that calling functions can also handle it if they need to
    // Or return null/empty array as before if that's the desired behavior for failures
    // For now, let's re-throw to make failures more visible during debugging
    throw error
    // return null; // Previous behavior
  }
}

// Get all published blog posts
export async function getBlogPosts(limit = 10): Promise<BlogPost[]> {
  console.log("🚀 STARTING getBlogPosts - This should definitely show")
  console.log("🌐 PAYLOAD_URL is:", PAYLOAD_URL)

  console.log("🔄 getBlogPosts called with limit:", limit)
  try {
    const data = await fetchPayloadAPI(
      `blog-posts?where[status][equals]=published&limit=${limit}&depth=2&sort=-publishedDate`,
    )
    const posts = data?.docs || []
    console.log("📝 Found blog posts:", posts.length)
    console.log("📋 Posts data:", posts)
    return posts
  } catch (error) {
    console.error("Error in getBlogPosts:", error)
    return [] // Return empty array on error to prevent breaking the page
  }
}

// Get a single blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  console.log("🔄 getBlogPost called with slug:", slug)
  try {
    const data = await fetchPayloadAPI(`blog-posts?where[slug][equals]=${slug}&depth=2`)
    const post = data?.docs?.[0] || null
    console.log("📄 Found post:", post ? post.title : "No post found")
    return post
  } catch (error) {
    console.error(`Error in getBlogPost for slug ${slug}:`, error)
    return null
  }
}

// Get featured posts
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  console.log("🔄 getFeaturedPosts called")
  try {
    const data = await fetchPayloadAPI(
      `blog-posts?where[featured][equals]=true&where[status][equals]=published&depth=2&sort=-publishedDate`,
    )
    const posts = data?.docs || []
    console.log("⭐ Found featured posts:", posts.length)
    return posts
  } catch (error) {
    console.error("Error in getFeaturedPosts:", error)
    return []
  }
}

// Get posts by category slug
export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  console.log("🔄 getPostsByCategory called with category:", categorySlug)
  try {
    const data = await fetchPayloadAPI(
      `blog-posts?where[categories.slug][equals]=${categorySlug}&where[status][equals]=published&depth=2&sort=-publishedDate`,
    )
    const posts = data?.docs || []
    console.log("🏷️ Found posts in category:", posts.length)
    return posts
  } catch (error) {
    console.error(`Error in getPostsByCategory for ${categorySlug}:`, error)
    return []
  }
}

// Legacy function names for backward compatibility
export async function getBlogPostsFromPayload(includeUnpublished = false): Promise<BlogPost[]> {
  console.log("🔄 getBlogPostsFromPayload called, includeUnpublished:", includeUnpublished)
  try {
    if (includeUnpublished) {
      const data = await fetchPayloadAPI(`blog-posts?depth=2&sort=-publishedDate`)
      const posts = data?.docs || []
      console.log("📝 Found all posts (including unpublished):", posts.length)
      return posts
    }
    return getBlogPosts()
  } catch (error) {
    console.error("Error in getBlogPostsFromPayload:", error)
    return []
  }
}

export async function getBlogPostBySlugFromPayload(slug: string, includeUnpublished = false): Promise<BlogPost | null> {
  console.log("🔄 getBlogPostBySlugFromPayload called, slug:", slug, "includeUnpublished:", includeUnpublished)
  try {
    if (includeUnpublished) {
      const data = await fetchPayloadAPI(`blog-posts?where[slug][equals]=${slug}&depth=2`)
      const post = data?.docs?.[0] || null
      console.log("📄 Found post (including unpublished):", post ? post.title : "No post found")
      return post
    }
    return getBlogPost(slug)
  } catch (error) {
    console.error(`Error in getBlogPostBySlugFromPayload for slug ${slug}:`, error)
    return null
  }
}

export async function getFeaturedBlogPostsFromPayload(): Promise<BlogPost[]> {
  return getFeaturedPosts()
}

export async function getRelatedBlogPostsFromPayload(currentPostId: string, limit = 3): Promise<BlogPost[]> {
  console.log("🔄 getRelatedBlogPostsFromPayload called, currentPostId:", currentPostId, "limit:", limit)
  try {
    const data = await fetchPayloadAPI(
      `blog-posts?where[id][not_equals]=${currentPostId}&where[status][equals]=published&depth=2&sort=-publishedDate&limit=${limit}`,
    )
    const posts = data?.docs || []
    console.log("🔗 Found related posts:", posts.length)
    return posts
  } catch (error) {
    console.error("Error in getRelatedBlogPostsFromPayload:", error)
    return []
  }
}
