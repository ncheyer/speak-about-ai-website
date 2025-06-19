/**
 * TEMPORARY shim so legacy imports like
 *   import { getBlogPosts } from "@/lib/payload-blog"
 * keep working while everything has moved to Contentful.
 *
 * Delete this file once all code has switched to "@/lib/blog-data".
 */
import { getBlogPosts as getBlogPostsFromContentful } from "./contentful-blog"

/**
 * Legacy alias – returns all blog posts
 */
export async function getBlogPosts() {
  return getBlogPostsFromContentful()
}

/**
 * Historical name used by a few pages;
 * just call the alias above.
 */
export const getBlogPostsFromPayload = getBlogPosts
