/**
 * Lightweight Contentful helper utilities.
 *
 * This version includes a resolver to correctly process Rich Text fields
 * by stitching in linked entries and assets from the 'includes' payload.
 * This is the key to fixing embedded videos and images.
 */

import { createClient, type Entry } from "contentful"

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN
const ENVIRONMENT = "master" // change if you use multiple environments

const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`

async function fetchContentfulAPI<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}/${endpoint}${endpoint.includes("?") ? "&" : "?"}` + `access_token=${ACCESS_TOKEN}`
  const res = await fetch(url, { next: { revalidate: 60 } })

  if (!res.ok) {
    throw new Error(`Contentful error ${res.status}: ${await res.text()}`)
  }
  return res.json() as Promise<T>
}

/* ---------- Shapes & Mappers ---------- */

export interface Author {
  name?: string
  picture?: {
    url: string
    description?: string
  }
}

export interface Category {
  slug: string
  name: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  summary?: string
  body?: any // Rich text JSON
  author?: Author
  tags?: string[]
  publishedDate?: string // This is derived from Contentful fields or sys dates
  coverImage?: {
    url: string
    description?: string
  }
  relatedPosts?: BlogPost[]
  sys: {
    // Ensure sys object is part of the interface
    id: string
    contentType: {
      sys: {
        id: string
      }
    }
    createdAt?: string
    updatedAt?: string
    firstPublishedAt?: string // Available from Contentful
    publishedAt?: string // Available from Contentful
    // Add other sys properties if needed
  }
}

// Interface for derived categories, used by BlogClientPage
export interface DerivedCategory {
  slug: string
  name: string
}

type Sys = { id: string; contentType?: { sys: { id: string } } } // Added contentType to Sys for better typing
type AuthorEntry = {
  sys: Sys
  fields: {
    name: string
    picture?: any // Renamed Asset to any to avoid redeclaration
    // add other author fields here if needed, e.g., title, bio
  }
}
type CategoryEntry = {
  sys: Sys
  fields: {
    name: string
    slug: string
  }
}
type ContentfulAsset = {
  sys: Sys
  fields: {
    title: string
    description?: string
    file: { url: string; details: { image?: { width: number; height: number } } }
  }
}
type Includes = { Asset?: ContentfulAsset[]; Entry?: (AuthorEntry | CategoryEntry | any)[] } // Renamed Asset to ContentfulAsset

function extractAsset(assets: ContentfulAsset[] | undefined, id: string | undefined) {
  if (!assets || !id) return undefined
  const asset = assets.find((a) => a.sys.id === id)
  if (!asset) return undefined
  return {
    url: asset.fields.file.url.startsWith("//") ? `https:${asset.fields.file.url}` : asset.fields.file.url,
    alt: asset.fields.description || asset.fields.title || "",
  }
}

function extractAuthor(
  entries: (AuthorEntry | CategoryEntry | any)[] | undefined,
  authorFieldSysId: string | undefined,
): { name: string; picture?: { url: string; description?: string } } {
  const fallback = { name: "Speak About AI" }
  if (!entries || !authorFieldSysId) return fallback

  const authorEntry = entries.find(
    (e) => e.sys.id === authorFieldSysId && e.sys.contentType?.sys?.id === "author", // Ensure it's an author entry
  )

  if (authorEntry && (authorEntry as AuthorEntry).fields?.name) {
    const pictureAsset = (authorEntry as AuthorEntry).fields?.picture as ContentfulAsset | undefined
    return {
      name: (authorEntry as AuthorEntry).fields.name,
      picture: pictureAsset?.fields?.file
        ? {
            url: "https:" + pictureAsset.fields.file.url,
            description: pictureAsset.fields.description,
          }
        : undefined,
    }
  }
  console.warn(
    `Author with ID ${authorFieldSysId} not found or 'name' field missing in includes.Entry. Defaulting author.`,
  )
  return fallback
}

function extractCategories(
  entries: (AuthorEntry | CategoryEntry | any)[] | undefined,
  categoryLinks: { sys: { id: string } }[] | undefined,
): Category[] {
  if (!entries || !categoryLinks || categoryLinks.length === 0) return []

  const resolvedCategories: Category[] = []
  for (const link of categoryLinks) {
    const categoryEntry = entries.find(
      (e) => e.sys.id === link.sys.id && e.sys.contentType?.sys?.id === "category", // Ensure it's a category entry (adjust "category" if your ID is different)
    )
    if (categoryEntry) {
      const cat = categoryEntry as CategoryEntry
      if (cat.fields?.name && cat.fields?.slug) {
        resolvedCategories.push({ name: cat.fields.name, slug: cat.fields.slug })
      } else {
        console.warn(`Category with ID ${link.sys.id} found but missing 'name' or 'slug' field.`)
      }
    } else {
      console.warn(`Category with ID ${link.sys.id} not found in includes.Entry.`)
    }
  }
  return resolvedCategories
}

function resolveRichTextLinks(content: any, includes: Includes | undefined): any {
  if (!content?.content || !includes) {
    return content
  }

  const entryMap = new Map(includes.Entry?.map((e) => [e.sys.id, e]) || [])
  const assetMap = new Map(includes.Asset?.map((a) => [a.sys.id, a]) || [])

  const newContent = JSON.parse(JSON.stringify(content))

  function traverse(node: any) {
    const nodeType = node.nodeType
    if (nodeType === "embedded-entry-block" || nodeType === "embedded-entry-inline") {
      const id = node.data?.target?.sys?.id
      if (id && entryMap.has(id)) {
        node.data.target = entryMap.get(id)
      }
    } else if (nodeType === "embedded-asset-block") {
      const id = node.data?.target?.sys?.id
      if (id && assetMap.has(id)) {
        node.data.target = assetMap.get(id)
      }
    }

    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse)
    }
  }

  newContent.content.forEach(traverse)
  return newContent
}

function mapEntryToPost(entry: any, includes?: Includes): BlogPost {
  const {
    sys: { id },
    fields,
  } = entry

  // --- DEBUGGING LOGS ---
  console.log(`--- DEBUGGING AUTHOR & CATEGORIES FOR POST: "${fields.title}" (ID: ${id}) ---`)
  if (fields.author) {
    console.log("Found 'fields.author' (link object):", JSON.stringify(fields.author, null, 2))
  } else {
    console.log("❌ 'fields.author' is MISSING from the post entry.")
  }
  if (fields.categories) {
    console.log("Found 'fields.categories' (array of link objects):", JSON.stringify(fields.categories, null, 2))
  } else {
    console.log("ℹ️ 'fields.categories' is MISSING or empty for this post.")
  }
  if (includes?.Entry) {
    // console.log("Full includes.Entry array:", JSON.stringify(includes.Entry, null, 2));
  }
  // --- END DEBUGGING ---

  const featuredImageAsset = includes?.Asset ? extractAsset(includes.Asset, fields.featuredImage?.sys?.id) : undefined
  const resolvedContent = resolveRichTextLinks(fields.content, includes)

  const author = extractAuthor(includes?.Entry, fields.author?.sys?.id)
  const categories = extractCategories(includes?.Entry, fields.categories)

  return {
    id,
    title: fields.title || "Untitled Post",
    slug: fields.slug || `post-${id}`,
    excerpt: fields.excerpt ?? "",
    content: resolvedContent,
    publishedDate: fields.publishedDate || entry.sys.createdAt,
    readTime: fields.readTime,
    featured: fields.featured ?? false,
    author: author,
    featuredImage: featuredImageAsset,
    categories: categories,
    sys: entry.sys,
  }
}

function mapAuthorFields(entry: Entry<any> | undefined): Author | undefined {
  if (!entry || !entry.fields) return undefined
  const pictureAsset = entry.fields.picture as any | undefined // Renamed Asset to any
  return {
    name: entry.fields.name as string | undefined,
    picture: pictureAsset?.fields?.file
      ? {
          url: "https:" + pictureAsset.fields.file.url,
          description: pictureAsset.fields.description as string | undefined,
        }
      : undefined,
  }
}

function mapContentfulFields(entry: Entry<any>): BlogPost {
  const authorEntry = entry.fields.author as Entry<any> | undefined
  const coverImageAsset = entry.fields.coverImage as any | undefined // Renamed Asset to any

  return {
    id: entry.sys.id,
    slug: (entry.fields.slug as string) || "",
    title: (entry.fields.title as string) || "Untitled Post",
    summary: (entry.fields.summary as string) || "",
    body: entry.fields.body, // Assuming body is rich text JSON
    author: mapAuthorFields(authorEntry),
    tags: (entry.fields.tags as string[]) || [],
    publishedDate:
      (entry.fields.publishedDate as string) || // Prefer explicit publishedDate field
      entry.sys.firstPublishedAt || // Fallback to Contentful's firstPublishedAt
      entry.sys.createdAt, // Further fallback
    coverImage: coverImageAsset?.fields?.file
      ? {
          url: "https:" + coverImageAsset.fields.file.url,
          description: coverImageAsset.fields.description as string | undefined,
        }
      : undefined,
    sys: {
      // Pass through the sys object, or relevant parts of it
      id: entry.sys.id,
      contentType: entry.sys.contentType,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      firstPublishedAt: entry.sys.firstPublishedAt,
      publishedAt: entry.sys.publishedAt,
    },
  }
}

/* ---------- Public API ---------- */
const INCLUDE_LEVEL = 10 // This should be high enough to get linked authors and categories

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  try {
    const entries = await client.getEntries({
      content_type: "blogPost", // Replace with your actual blog post content type ID
      order: ["-fields.publishedDate", "-sys.firstPublishedAt", "-sys.createdAt"], // Ensure proper ordering
      limit: limit,
    })
    return entries.items.map(mapContentfulFields)
  } catch (error) {
    console.error("Contentful getBlogPosts error:", error)
    return []
  }
}

export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
  // This function might need adjustment if "featured" is a specific field in Contentful
  // For now, let's assume it fetches posts that have a 'featured' boolean field set to true
  // Or, if you don't have a featured field, it could fetch the latest N posts.
  // The current implementation in app/blog/page.tsx takes the first few from getBlogPosts.
  // If you want a dedicated "featured" query, you'd add:
  // 'fields.featured': true, (assuming 'featured' is a boolean field in Contentful)
  try {
    const entries = await client.getEntries({
      content_type: "blogPost",
      order: ["-fields.publishedDate", "-sys.firstPublishedAt", "-sys.createdAt"],
      limit: limit,
      // 'fields.featured': true, // Example if you have a 'featured' field
    })
    return entries.items.map(mapContentfulFields)
  } catch (error) {
    console.error("Contentful getFeaturedBlogPosts error:", error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const entries = await client.getEntries({
      content_type: "blogPost", // Replace with your blog post content type ID
      "fields.slug": slug,
      limit: 1,
    })
    if (entries.items.length > 0) {
      return mapContentfulFields(entries.items[0])
    }
    return null
  } catch (error) {
    console.error(`Contentful getBlogPostBySlug error for slug "${slug}":`, error)
    return null
  }
}

export async function getRelatedBlogPosts(currentPostId: string, limit = 3): Promise<BlogPost[]> {
  // This is a simplified related posts logic (e.g., latest posts excluding current)
  // For true related posts, you might query by tags or categories.
  try {
    const entries = await client.getEntries({
      content_type: "blogPost",
      order: ["-fields.publishedDate", "-sys.firstPublishedAt", "-sys.createdAt"],
      limit: limit + 1, // Fetch one extra to filter out current post if it appears
      "sys.id[ne]": currentPostId, // Exclude the current post
    })
    return entries.items
      .filter((item) => item.sys.id !== currentPostId) // Ensure current post is excluded
      .slice(0, limit) // Take the desired limit
      .map(mapContentfulFields)
  } catch (error) {
    console.error("Contentful getRelatedBlogPosts error:", error)
    return []
  }
}
