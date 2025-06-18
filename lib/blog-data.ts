import {
  getBlogPostsFromPayload,
  getBlogPostBySlugFromPayload,
  getFeaturedBlogPostsFromPayload,
  getRelatedBlogPostsFromPayload,
  type BlogPost as PayloadBlogPost, // Use the type from payload-blog
} from "./payload-blog"

// Re-export the BlogPost type from payload-blog for consistency if other parts of the app use it from here
export type BlogPost = PayloadBlogPost

// No more static fallback data needed here if Payload is the single source of truth.
// If you still want static data for local development when Payload isn't running,
// you can re-add it, but ensure its structure matches PayloadBlogPost.
// For now, we'll assume Payload is always available or errors are handled.

export async function getBlogPosts(includeUnpublished = false) {
  try {
    return await getBlogPostsFromPayload(includeUnpublished)
  } catch (error) {
    console.error("Error fetching blog posts from Payload in blog-data.ts:", error)
    return [] // Fallback to empty array on error
  }
}

export async function getFeaturedBlogPosts() {
  try {
    return await getFeaturedBlogPostsFromPayload()
  } catch (error) {
    console.error("Error fetching featured blog posts from Payload in blog-data.ts:", error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string, includeUnpublished = false) {
  try {
    return await getBlogPostBySlugFromPayload(slug, includeUnpublished)
  } catch (error) {
    console.error(`Error fetching blog post by slug "${slug}" from Payload in blog-data.ts:`, error)
    return null
  }
}

export async function getRelatedBlogPosts(currentPostId: string, limit = 3, includeUnpublished = false) {
  try {
    // Note: getRelatedBlogPostsFromPayload in payload-blog.ts already filters by published status
    // unless includeUnpublished is explicitly handled there.
    // For simplicity, we're not passing includeUnpublished to it here, assuming default behavior.
    return await getRelatedBlogPostsFromPayload(currentPostId, limit)
  } catch (error) {
    console.error(`Error fetching related blog posts for ID "${currentPostId}" from Payload in blog-data.ts:`, error)
    return []
  }
}
