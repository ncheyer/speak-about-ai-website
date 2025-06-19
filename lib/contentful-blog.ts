/**
 * Lightweight Contentful helper utilities.
 *
 * This version includes a resolver to correctly process Rich Text fields
 * by stitching in linked entries and assets from the 'includes' payload.
 * This is the key to fixing embedded videos and images.
 */

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

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: any // Rich Text JSON object
  publishedDate: string
  readTime?: number
  featured: boolean
  author: { name: string }
  featuredImage?: { url: string; alt: string }
  categories: { slug: string; name: string }[]
}

// Interface for derived categories, used by BlogClientPage
export interface DerivedCategory {
  slug: string
  name: string
}

type Sys = { id: string }
type Asset = {
  sys: Sys
  fields: {
    title: string
    description?: string
    file: { url: string; details: { image?: { width: number; height: number } } }
  }
}
type Includes = { Asset?: Asset[]; Entry?: any[] }

function extractAsset(assets: Asset[] | undefined, id: string | undefined) {
  if (!assets || !id) return undefined
  const asset = assets.find((a) => a.sys.id === id)
  if (!asset) return undefined
  return {
    url: asset.fields.file.url.startsWith("//") ? `https:${asset.fields.file.url}` : asset.fields.file.url,
    alt: asset.fields.description || asset.fields.title || "",
  }
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

  const featuredImageAsset = includes?.Asset ? extractAsset(includes.Asset, fields.featuredImage?.sys?.id) : undefined
  const resolvedContent = resolveRichTextLinks(fields.content, includes)

  // Ensure categories are mapped correctly and filter out any malformed ones
  const categories = (fields.categories || [])
    .map((c: any) => {
      if (c && c.fields && c.fields.slug && c.fields.name) {
        return { slug: c.fields.slug, name: c.fields.name }
      }
      return null // Invalid category structure
    })
    .filter((cat: any): cat is { slug: string; name: string } => cat !== null) // Type guard to filter out nulls

  return {
    id,
    title: fields.title || "Untitled Post",
    slug: fields.slug || `post-${id}`,
    excerpt: fields.excerpt ?? "",
    content: resolvedContent,
    publishedDate: fields.publishedDate || entry.sys.createdAt,
    readTime: fields.readTime,
    featured: fields.featured ?? false,
    author: { name: fields.author?.fields?.name ?? "Speak About AI" },
    featuredImage: featuredImageAsset,
    categories: categories,
  }
}

/* ---------- Public API ---------- */
const INCLUDE_LEVEL = 10

export async function getBlogPosts(limit = 1000): Promise<BlogPost[]> {
  // Increased limit for category derivation
  const data = await fetchContentfulAPI<{ items: any[]; includes?: Includes }>(
    `entries?content_type=blogPost&order=-fields.publishedDate&limit=${limit}&include=${INCLUDE_LEVEL}`,
  )
  return data.items.map((item) => mapEntryToPost(item, data.includes))
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const data = await fetchContentfulAPI<{ items: any[]; includes?: Includes }>(
    `entries?content_type=blogPost&fields.slug=${slug}&limit=1&include=${INCLUDE_LEVEL}`,
  )
  if (!data.items.length) return null
  return mapEntryToPost(data.items[0], data.includes)
}

// getFeaturedBlogPosts and getRelatedBlogPosts remain the same as your last synced version
export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const data = await fetchContentfulAPI<{ items: any[]; includes?: Includes }>(
    `entries?content_type=blogPost&fields.featured=true&order=-fields.publishedDate&include=${INCLUDE_LEVEL}`,
  )
  return data.items.map((item) => mapEntryToPost(item, data.includes))
}

export async function getRelatedBlogPosts(currentPostId: string, limit = 3): Promise<BlogPost[]> {
  const data = await fetchContentfulAPI<{ items: any[]; includes?: Includes }>(
    `entries?content_type=blogPost&sys.id[ne]=${currentPostId}&order=-fields.publishedDate&limit=${limit}&include=${INCLUDE_LEVEL}`,
  )
  return data.items.map((item) => mapEntryToPost(item, data.includes))
}
