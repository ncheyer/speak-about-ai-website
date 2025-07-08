import "@/lib/fs-polyfill" // Must be first
import { createClient, type Asset, type Entry, type EntryCollection } from "contentful"
import type { Document } from "@contentful/rich-text-types"

// Define interfaces for our data structures
export interface Author {
  name: string
  picture: Asset | null
}

export interface Category {
  name: string
  slug: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedDate: string
  content: Document | null
  featured: boolean
  featuredImage: Asset | null
  author: Author | null
  categories: Category[]
  readTime?: number
  sys?: any
}

// Initialize Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
})

// Helper to parse an author entry
const parseAuthor = (entry: Entry<any>): Author | null => {
  if (!entry || !entry.fields) return null
  return {
    name: entry.fields.name || "Anonymous",
    picture: entry.fields.picture || null,
  }
}

// Helper to parse a category entry
const parseCategory = (entry: Entry<any>): Category | null => {
  if (!entry || !entry.fields) return null
  return {
    name: entry.fields.name || "Uncategorized",
    slug: entry.fields.slug || "uncategorized",
  }
}

// Helper to parse a blog post entry
const parseBlogPost = (entry: Entry<any>): BlogPost => {
  const authorEntry = entry.fields.author as Entry<any>
  const categoryEntries = (entry.fields.categories as Entry<any>[]) || []

  return {
    id: entry.sys.id,
    title: entry.fields.title || "Untitled Post",
    slug: entry.fields.slug || "",
    excerpt: entry.fields.excerpt || "",
    publishedDate: entry.fields.publishedDate || new Date().toISOString(),
    content: entry.fields.content || null,
    featured: entry.fields.featured || false,
    featuredImage: entry.fields.featuredImage || null,
    author: parseAuthor(authorEntry),
    categories: categoryEntries.map(parseCategory).filter((c): c is Category => c !== null),
  }
}

// Fetch all blog posts
export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  const entries: EntryCollection<any> = await client.getEntries({
    content_type: "blogPost",
    order: ["-fields.publishedDate"],
    limit: limit,
  })
  return entries.items.map(parseBlogPost)
}

// Fetch a single blog post by its slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const entries: EntryCollection<any> = await client.getEntries({
    content_type: "blogPost",
    "fields.slug": slug,
    limit: 1,
  })
  if (entries.items.length > 0) {
    return parseBlogPost(entries.items[0])
  }
  return null
}

// Fetch only featured blog posts
export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const entries: EntryCollection<any> = await client.getEntries({
    content_type: "blogPost",
    "fields.featured": true,
    order: ["-fields.publishedDate"],
  })
  return entries.items.map(parseBlogPost)
}

// Fetch related posts
export async function getRelatedBlogPosts(currentPostId: string, limit = 3): Promise<BlogPost[]> {
  const entries: EntryCollection<any> = await client.getEntries({
    content_type: "blogPost",
    "sys.id[ne]": currentPostId,
    order: ["-fields.publishedDate"],
    limit: limit,
  })
  return entries.items.map(parseBlogPost)
}
