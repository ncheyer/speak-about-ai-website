/**
 * Lightweight Contentful helper utilities.
 *
 * Required env vars (already present in the workspace):
 * - CONTENTFUL_SPACE_ID
 * - CONTENTFUL_ACCESS_TOKEN
 *
 * NOTE  This uses the Content Delivery API (REST) and maps the response
 * into the BlogPost shape your components already expect.
 */

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN
const ENVIRONMENT = "master" // change if you use multiple environments

const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`

async function fetchContentfulAPI<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}/${endpoint}${endpoint.includes("?") ? "&" : "?"}` + `access_token=${ACCESS_TOKEN}`

  const res = await fetch(url, { next: { revalidate: 60 } }) // Added revalidate for ISR

  if (!res.ok) {
    throw new Error(`Contentful error ${res.status}: ${await res.text()}`)
  }
  return res.json() as Promise<T>
}

/* ---------- Shapes & mappers ---------- */

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: any // Changed to any to handle Rich Text object directly
  publishedDate: string
  readTime?: number
  featured: boolean
  author: { name: string }
  featuredImage?: { url: string; alt: string }
  categories: { slug: string; name: string }[]
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

function extractAsset(assets: Asset[] | undefined, id: string | undefined) {
  if (!assets || !id) return undefined
  const asset = assets.find((a) => a.sys.id === id)
  if (!asset) return undefined
  return {
    url: asset.fields.file.url.startsWith("//") ? `https:${asset.fields.file.url}` : asset.fields.file.url,
    alt: asset.fields.description || asset.fields.title || "",
  }
}

function mapEntryToPost(entry: any, includes?: { Asset: Asset[]; Entry: any[] }): BlogPost {
  const {
    sys: { id },
    fields,
  } = entry

  const featuredImageAsset = includes?.Asset ? extractAsset(includes.Asset, fields.featuredImage?.sys?.id) : undefined

  return {
    id,
    title: fields.title,
    slug: fields.slug,
    excerpt: fields.excerpt ?? "",
    content: fields.content, // Store the raw Rich Text JSON object
    publishedDate: fields.publishedDate || entry.sys.createdAt,
    readTime: fields.readTime,
    featured: fields.featured ?? false,
    author: { name: fields.author?.fields?.name ?? "Speak About AI" },
    featuredImage: featuredImageAsset,
    categories:
      fields.categories?.map((c: any) => ({
        slug: c.fields.slug,
        name: c.fields.name,
      })) ?? [],
  }
}

/* ---------- Public API ---------- */
const INCLUDE_LEVEL = 10 // Max include level for Contentful

export async function getBlogPosts(limit = 10): Promise<BlogPost[]> {
  const data = await fetchContentfulAPI<{
    items: any[]
    includes?: { Asset: Asset[]; Entry: any[] }
  }>(`entries?content_type=blogPost&order=-fields.publishedDate&limit=${limit}&include=${INCLUDE_LEVEL}`)

  return data.items.map((item) => mapEntryToPost(item, data.includes))
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const data = await fetchContentfulAPI<{
    items: any[]
    includes?: { Asset: Asset[]; Entry: any[] }
  }>(`entries?content_type=blogPost&fields.slug=${slug}&limit=1&include=${INCLUDE_LEVEL}`)
  if (!data.items.length) return null
  return mapEntryToPost(data.items[0], data.includes)
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const data = await fetchContentfulAPI<{
    items: any[]
    includes?: { Asset: Asset[]; Entry: any[] }
  }>(`entries?content_type=blogPost&fields.featured=true&order=-fields.publishedDate&include=${INCLUDE_LEVEL}`)
  return data.items.map((item) => mapEntryToPost(item, data.includes))
}

export async function getRelatedBlogPosts(currentPostId: string, limit = 3): Promise<BlogPost[]> {
  const data = await fetchContentfulAPI<{
    items: any[]
    includes?: { Asset: Asset[]; Entry: any[] }
  }>(
    `entries?content_type=blogPost&sys.id[ne]=${currentPostId}&order=-fields.publishedDate&limit=${limit}&include=${INCLUDE_LEVEL}`,
  )
  return data.items.map((item) => mapEntryToPost(item, data.includes))
}
