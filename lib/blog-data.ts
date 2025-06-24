// Thin abstraction over the underlying CMS (now Contentful)

import {
  getBlogPosts as _getPosts,
  getBlogPostBySlug as _getPostBySlug,
  getFeaturedBlogPosts as _getFeatured, // Ensure this is exported
  getRelatedBlogPosts as _getRelated,
  type BlogPost,
} from "./contentful-blog"

export type { BlogPost }

export async function getBlogPosts(limit?: number) {
  // Added optional limit parameter
  try {
    return await _getPosts(limit)
  } catch (err) {
    console.error("Error fetching posts from Contentful:", err)
    return []
  }
}

export async function getFeaturedBlogPosts() {
  // Ensure this function exists and is exported
  try {
    return await _getFeatured()
  } catch (err) {
    console.error("Error fetching featured posts:", err)
    return []
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    return await _getPostBySlug(slug)
  } catch (err) {
    console.error(`Error fetching post ${slug}:`, err)
    return null
  }
}

export async function getRelatedBlogPosts(currentPostId: string, limit = 3) {
  try {
    return await _getRelated(currentPostId, limit)
  } catch (err) {
    console.error("Error fetching related posts:", err)
    return []
  }
}

// --- TEMPORARY ALIAS --------------------------------------------------
// Keeps older code that calls `getBlogPost()` working.
// Prefer `getBlogPostBySlug()` in new code.
export async function getBlogPost(slug: string) {
  return getBlogPostBySlug(slug)
}
