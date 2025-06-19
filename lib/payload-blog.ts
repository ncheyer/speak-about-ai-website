/**
 * TEMPORARY SHIM - keeps old imports working.
 * -------------------------------------------------
 *   •  getBlogPosts() – delegates to the Contentful version
 *   •  getBlogPostsFromPayload() – alias, maintained for older code
 *
 * Delete this file once every import uses "@/lib/blog-data" directly.
 */

import { getBlogPosts as getBlogPostsFromContentful, type BlogPost } from "./blog-data"

/**
 * Legacy name expected by older components/tests.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  return getBlogPostsFromContentful()
}

/**
 * Older codepath that used to hit Payload CMS.
 * For now we call the same Contentful helper.
 * Remove when no longer referenced.
 */
export async function getBlogPostsFromPayload(): Promise<BlogPost[]> {
  return getBlogPostsFromContentful()
}
