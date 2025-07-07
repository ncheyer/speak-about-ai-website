/**
 * Robust Contentful helper utilities with LAZY CLIENT INITIALISATION.
 * If credentials are missing, the helper functions now return safe fallbacks
 * instead of throwing `Expected parameter accessToken` at import time.
 */
import { createClient, type Entry, type Asset } from "contentful"

/* -------------------------------------------------------------------------- */
/*                               ENV VARIABLES                               */
/* -------------------------------------------------------------------------- */
const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN

/* -------------------------------------------------------------------------- */
/*                         LAZY CLIENT INITIALISATION                         */
/* -------------------------------------------------------------------------- */
let _client: ReturnType<typeof createClient> | null = null

/**
 * Lazily create – or return the cached – Contentful client.
 * Returns `null` when credentials are missing so callers can short-circuit.
 */
function getClient() {
  if (_client) return _client
  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    console.warn(
      "[Contentful] Missing SPACE_ID or ACCESS_TOKEN – returning null client. " +
        "Blog data will be empty in development / preview environments.",
    )
    return null
  }

  console.log("[Contentful] Initialising client …")
  _client = createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
  })
  return _client
}

/* -------------------------------------------------------------------------- */
/*                               TYPE DEFINITIONS                             */
/* -------------------------------------------------------------------------- */

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt?: string
  content?: any // Rich-text JSON object
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

type ContentfulIncludes = {
  Asset?: Asset[]
  Entry?: Entry<any>[]
}

/* -------------------------------------------------------------------------- */
/*                          HELPERS TO RESOLVE FIELDS                         */
/* -------------------------------------------------------------------------- */

function extractAsset(assets: Asset[] | undefined, assetId: string | undefined) {
  if (!assets || !assetId) return undefined
  const asset = assets.find((a) => a.sys.id === assetId)
  if (!asset) return undefined
  return {
    url: asset.fields.file?.url ? `https:${asset.fields.file.url}` : "",
    alt: (asset.fields.description as string) || (asset.fields.title as string) || "",
  }
}

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

function resolveRichTextLinks(content: any, includes: ContentfulIncludes | undefined): any {
  if (!content?.content || !includes) return content

  const entryMap = new Map(includes.Entry?.map((e) => [e.sys.id, e]))
  const assetMap = new Map(includes.Asset?.map((a) => [a.sys.id, a]))

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

/* -------------------------------------------------------------------------- */
/*                               PUBLIC API                                   */
/* -------------------------------------------------------------------------- */

const INCLUDE_LEVEL = 10

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  const client = getClient()
  if (!client) return []

  try {
    const res = await client.getEntries({
      content_type: "blogPost",
      order: ["-fields.publishedDate", "-sys.createdAt"],
      include: INCLUDE_LEVEL,
      limit,
    })

    const includes = { Asset: res.includes?.Asset, Entry: res.includes?.Entry }
    return res.items.map((item) => mapEntryToPost(item, includes))
  } catch (error) {
    console.error("[getBlogPosts] Error:", error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const client = getClient()
  if (!client) return null

  try {
    const res = await client.getEntries({
      content_type: "blogPost",
      "fields.slug": slug,
      limit: 1,
      include: INCLUDE_LEVEL,
    })

    if (!res.items.length) return null
    const includes = { Asset: res.includes?.Asset, Entry: res.includes?.Entry }
    return mapEntryToPost(res.items[0], includes)
  } catch (error) {
    console.error(`[getBlogPostBySlug] Error for slug "${slug}":`, error)
    return null
  }
}

export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
  const client = getClient()
  if (!client) return []

  try {
    const res = await client.getEntries({
      content_type: "blogPost",
      "fields.featured": true,
      order: ["-fields.publishedDate", "-sys.createdAt"],
      include: INCLUDE_LEVEL,
      limit,
    })

    if (!res.items.length) return getBlogPosts(limit)
    const includes = { Asset: res.includes?.Asset, Entry: res.includes?.Entry }
    return res.items.map((item) => mapEntryToPost(item, includes))
  } catch (error) {
    console.warn("[getFeaturedBlogPosts] Fallback to latest. Reason:", error)
    return getBlogPosts(limit)
  }
}

export async function getRelatedBlogPosts(currentPostId: string, limit = 3): Promise<BlogPost[]> {
  const client = getClient()
  if (!client) return []

  try {
    const res = await client.getEntries({
      content_type: "blogPost",
      order: ["-fields.publishedDate", "-sys.createdAt"],
      limit: limit + 1,
      "sys.id[ne]": currentPostId,
      include: INCLUDE_LEVEL,
    })

    const includes = { Asset: res.includes?.Asset, Entry: res.includes?.Entry }
    return res.items
      .filter((item) => item.sys.id !== currentPostId)
      .slice(0, limit)
      .map((item) => mapEntryToPost(item, includes))
  } catch (error) {
    console.error("[getRelatedBlogPosts] Error:", error)
    return []
  }
}
