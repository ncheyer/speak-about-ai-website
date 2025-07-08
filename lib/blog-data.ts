// Thin abstraction over the underlying CMS (now Contentful)

import {
  getBlogPosts as _getPosts,
  getBlogPostBySlug as _getPostBySlug,
  getFeaturedBlogPosts as _getFeatured,
  getRelatedBlogPosts as _getRelated,
  type BlogPost,
} from "./contentful-blog"

// Only re-export the type. The functions below will be this module's exports.
export type { BlogPost }

export async function getBlogPosts(limit?: number) {
  // Added optional limit parameter
  try {
    const posts = await _getPosts(limit)
    console.log("[lib/blog-data.ts] Fetched posts count:", posts.length)
    if (posts.length > 0) {
      console.log("[lib/blog-data.ts] First post title:", posts[0].title)
    }
    return posts
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
    // 1️⃣ normal lookup
    const direct = await _getPostBySlug(slug)
    console.log(`[lib/blog-data.ts] Attempting to fetch post by slug: ${slug}`)
    if (direct) {
      console.log("[lib/blog-data.ts] Found post by slug (direct):", direct.title)
    } else {
      console.log("[lib/blog-data.ts] No direct match for slug, will try fetching all.")
    }
    if (direct) return direct

    // 2️⃣ fallback – fetch all, then match
    const all = await _getPosts()
    const decoded = decodeURIComponent(slug).toLowerCase()

    const foundPost = all.find(
      (p) => p.slug?.toLowerCase() === decoded || decodeURIComponent(p.slug || "").toLowerCase() === decoded,
    )
    if (foundPost) {
      console.log("[lib/blog-data.ts] Found post after fetching all:", foundPost.title)
    } else {
      console.log("[lib/blog-data.ts] Post not found even after fetching all for slug:", slug)
    }

    return (
      all.find(
        (p) =>
          p.slug?.toLowerCase() === decoded || // exact match
          decodeURIComponent(p.slug || "").toLowerCase() === decoded,
      ) || null
    )
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
