/**
 * Corrected and streamlined Contentful helper utilities with ENHANCED LOGGING for troubleshooting.
 * This version consistently uses a robust mapping function (`mapEntryToPost`)
 * that properly resolves all linked entries and assets, including those
 * embedded in Rich Text fields.
 */
import { createClient, type Entry, type Asset } from "contentful"

// --- Client Initialization & Credential Check ---
const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN

console.log("------------------------------------------------------------")
console.log("[Contentful Setup] Attempting to initialize Contentful client...")
console.log(
  `[Contentful Setup] Using Space ID: ${CONTENTFUL_SPACE_ID ? `******** (Length: ${CONTENTFUL_SPACE_ID.length})` : "!!! MISSING OR EMPTY SPACE ID !!!"}`,
)
console.log(
  `[Contentful Setup] Using Access Token: ${CONTENTFUL_ACCESS_TOKEN ? `******** (Length: ${CONTENTFUL_ACCESS_TOKEN.length})` : "!!! MISSING OR EMPTY ACCESS TOKEN !!!"}`,
)

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  console.error(
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n" +
      "[Contentful Setup] FATAL: Contentful Space ID or Access Token is missing or empty.\n" +
      "Blog posts WILL NOT LOAD. Please check your environment variables.\n" +
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
  )
}

const client = createClient({
  space: CONTENTFUL_SPACE_ID!, // Still pass them, SDK might have its own errors
  accessToken: CONTENTFUL_ACCESS_TOKEN!,
})
console.log("[Contentful Setup] Contentful client initialized (or attempted).")
console.log("------------------------------------------------------------")

// --- Type Definitions ---
// A single, consistent type for a blog post used throughout the app.
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt?: string
  content?: any // Rich Text JSON object
  author?: {
    name: string
    picture?: { url: string; description?: string }
  }
  categories?: { slug: string; name: string }[]
  publishedDate: string
  featuredImage?: { url: string; alt: string }
  readTime?: number
  featured?: boolean
  sys: any
}

// Type for the `includes` object from a Contentful API response.
type ContentfulIncludes = {
  Asset?: Asset[]
  Entry?: Entry<any>[]
}

// --- Data Mapping and Resolution ---

/**
 * Extracts and formats an asset (like an image) from the `includes` object.
 */
function extractAsset(assets: Asset[] | undefined, assetId: string | undefined) {
  if (!assets || !assetId) return undefined
  const asset = assets.find((a) => a.sys.id === assetId)
  if (!asset) return undefined
  return {
    url: asset.fields.file?.url ? `https:${asset.fields.file.url}` : "",
    alt: (asset.fields.description as string) || (asset.fields.title as string) || "",
  }
}

/**
 * Extracts and formats an author from the `includes` object.
 */
function extractAuthor(entries: Entry<any>[] | undefined, authorId: string | undefined) {
  const fallback = { name: "Speak About AI" }
  if (!entries || !authorId) return fallback

  const authorEntry = entries.find((e) => e.sys.id === authorId && e.sys.contentType.sys.id === "author")
  if (!authorEntry) return fallback

  const pictureAsset = authorEntry.fields.picture as Asset | undefined
  return {
    name: (authorEntry.fields.name as string) || "Speak About AI",
    picture: pictureAsset?.fields?.file
      ? {
          url: `https:${pictureAsset.fields.file.url}`,
          description: pictureAsset.fields.description as string,
        }
      : undefined,
  }
}

/**
 * Extracts and formats categories from the `includes` object.
 */
function extractCategories(entries: Entry<any>[] | undefined, categoryLinks: Entry<any>[] | undefined) {
  if (!entries || !categoryLinks) return []
  return categoryLinks
    .map((link) => {
      const categoryEntry = entries.find((e) => e.sys.id === link.sys.id && e.sys.contentType.sys.id === "category")
      if (categoryEntry && categoryEntry.fields.name && categoryEntry.fields.slug) {
        return {
          name: categoryEntry.fields.name as string,
          slug: categoryEntry.fields.slug as string,
        }
      }
      return null
    })
    .filter(Boolean) as { slug: string; name: string }[]
}

/**
 * Recursively traverses a Rich Text object and resolves any linked entries/assets.
 */
function resolveRichTextLinks(content: any, includes: ContentfulIncludes | undefined): any {
  if (!content?.content || !includes) return content

  const entryMap = new Map(includes.Entry?.map((e) => [e.sys.id, e]))
  const assetMap = new Map(includes.Asset?.map((a) => [a.sys.id, a]))

  // Deep copy to avoid mutating the original object
  const newContent = JSON.parse(JSON.stringify(content))

  function traverse(node: any) {
    if (node.nodeType === "embedded-entry-block" || node.nodeType === "embedded-entry-inline") {
      const id = node.data?.target?.sys?.id
      if (id && entryMap.has(id)) {
        node.data.target = entryMap.get(id)
      }
    } else if (node.nodeType === "embedded-asset-block") {
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

/**
 * The main function to map a Contentful entry to our clean BlogPost type.
 */
function mapEntryToPost(entry: Entry<any>, includes?: ContentfulIncludes): BlogPost {
  const { sys, fields } = entry
  const featuredImageAsset = extractAsset(includes?.Asset, (fields.featuredImage as Asset)?.sys.id)
  const resolvedContent = resolveRichTextLinks(fields.content, includes)
  const author = extractAuthor(includes?.Entry, (fields.author as Entry<any>)?.sys.id)
  const categories = extractCategories(includes?.Entry, fields.categories as Entry<any>[])

  return {
    id: sys.id,
    title: (fields.title as string) || "Untitled Post",
    slug: (fields.slug as string) || `post-${sys.id}`,
    excerpt: (fields.excerpt as string) ?? "",
    content: resolvedContent,
    publishedDate: (fields.publishedDate as string) || sys.createdAt,
    readTime: fields.readTime as number,
    featured: (fields.featured as boolean) ?? false,
    author,
    featuredImage: featuredImageAsset,
    categories,
    sys,
  }
}

// --- Public API Functions ---
const INCLUDE_LEVEL = 10 // Set a high include level to get all nested data

/**
 * Fetches a list of all blog posts.
 */
export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  console.log(`[getBlogPosts] Called. Limit: ${limit ?? "not set"}.`)

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    console.error("[getBlogPosts] ABORTING: Contentful credentials missing at time of call.")
    return []
  }

  const queryParams = {
    content_type: "blogPost", // IMPORTANT: Ensure this ID matches your Contentful model
    order: ["-fields.publishedDate", "-sys.createdAt"],
    limit: limit,
    include: INCLUDE_LEVEL,
  }
  console.log("[getBlogPosts] Query parameters:", JSON.stringify(queryParams))

  try {
    console.log("[getBlogPosts] Attempting client.getEntries()...")
    const response = await client.getEntries(queryParams)
    console.log("[getBlogPosts] client.getEntries() call completed.")

    console.log(
      `[getBlogPosts] Raw Contentful Response: Total items in space matching query: ${response.total}, ` +
        `Items in this batch: ${response.items.length}, Skip: ${response.skip}, Limit: ${response.limit}`,
    )

    if (response.items.length > 0) {
      // console.log("[getBlogPosts] First raw item from Contentful:", JSON.stringify(response.items[0], null, 2));
      console.log("[getBlogPosts] First raw item title from Contentful:", response.items[0]?.fields?.title)
    } else {
      console.warn(
        "[getBlogPosts] Contentful returned 0 items. Potential issues:\n" +
          "1. Incorrect `content_type` ID (expected 'blogPost'). Check your Contentful model.\n" +
          "2. No posts are PUBLISHED in the 'master' environment (or the one your token targets).\n" +
          "3. Access token lacks permissions for 'blogPost' or is for a different space/environment.\n" +
          "4. Incorrect Space ID or Access Token environment variables.",
      )
      return []
    }

    const includes = { Asset: response.includes?.Asset, Entry: response.includes?.Entry }
    const mappedPosts = response.items.map((item) => mapEntryToPost(item, includes))
    console.log(`[getBlogPosts] Successfully mapped ${mappedPosts.length} posts.`)
    return mappedPosts
  } catch (error) {
    console.error("[getBlogPosts] CRITICAL ERROR during client.getEntries() or mapping:", error)
    if (error.message) console.error("[getBlogPosts] Error message:", error.message)
    if (error.details) console.error("[getBlogPosts] Error details:", JSON.stringify(error.details, null, 2))
    if (error.response?.data)
      console.error("[getBlogPosts] Error response data:", JSON.stringify(error.response.data, null, 2))
    return []
  }
}

/**
 * Fetches a single blog post by its slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`[getBlogPostBySlug] Called. Slug: ${slug}.`)
  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    console.error("[getBlogPostBySlug] ABORTING: Contentful credentials missing.")
    return null
  }
  // ... (similar detailed logging for this function)
  try {
    const response = await client.getEntries({
      content_type: "blogPost",
      "fields.slug": slug,
      limit: 1,
      include: INCLUDE_LEVEL,
    })
    console.log(`[getBlogPostBySlug] Raw response for slug '${slug}'. Items: ${response.items.length}`)
    if (response.items.length > 0) {
      const includes = { Asset: response.includes?.Asset, Entry: response.includes?.Entry }
      return mapEntryToPost(response.items[0], includes)
    }
    return null
  } catch (error) {
    console.error(`Contentful getBlogPostBySlug error for slug "${slug}":`, error)
    return null
  }
}

/**
 * Fetches featured blog posts.
 * Assumes a boolean field with ID 'featured' exists in your Contentful model.
 * Falls back to latest posts if the query fails.
 */
export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
  try {
    const response = await client.getEntries({
      content_type: "blogPost",
      "fields.featured": true,
      order: ["-fields.publishedDate", "-sys.createdAt"],
      limit: limit,
      include: INCLUDE_LEVEL,
    })
    if (response.items.length > 0) {
      const includes = { Asset: response.includes?.Asset, Entry: response.includes?.Entry }
      return response.items.map((item) => mapEntryToPost(item, includes))
    }
    // If no featured posts, fall back to latest
    return getBlogPosts(limit)
  } catch (error) {
    console.warn("Could not fetch featured posts (maybe 'featured' field is missing). Falling back to latest posts.")
    return getBlogPosts(limit)
  }
}

/**
 * Fetches related blog posts, excluding the current one.
 */
export async function getRelatedBlogPosts(currentPostId: string, limit = 3): Promise<BlogPost[]> {
  try {
    const response = await client.getEntries({
      content_type: "blogPost",
      order: ["-fields.publishedDate", "-sys.createdAt"],
      limit: limit + 1,
      "sys.id[ne]": currentPostId,
      include: INCLUDE_LEVEL,
    })
    const includes = { Asset: response.includes?.Asset, Entry: response.includes?.Entry }
    return response.items
      .filter((item) => item.sys.id !== currentPostId)
      .slice(0, limit)
      .map((item) => mapEntryToPost(item, includes))
  } catch (error) {
    console.error("Contentful getRelatedBlogPosts error:", error)
    return []
  }
}
