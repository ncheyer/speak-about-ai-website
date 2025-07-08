/**
 * Legacy shim: older code imports from `lib/payload-blog`.
 * We delegate to the new Contentful implementation so nothing breaks.
 *
 * NOTE: no `"use client"` directive here, so an early import is legal.
 */
import "./fs-polyfill"
import { getBlogPosts as getBlogPostsFromContentful, type BlogPost } from "./contentful-blog"

export type { BlogPost }

export const getBlogPosts = getBlogPostsFromContentful

/** Historical alias retained for compatibility */
export const getBlogPostsFromPayload = getBlogPostsFromContentful
