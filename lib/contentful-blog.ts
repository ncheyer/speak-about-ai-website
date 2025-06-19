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

  const res = await fetch(url, { next: { revalidate: 60 } })

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
  content: string
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
  fields: { title: string; file: { url: string } }
}

function extractAsset(assets: Asset[] | undefined, id: string | undefined) {
  if (!assets || !id) return undefined
  const asset = assets.find((a) => a.sys.id === id)
  if (!asset) return undefined
  return {
    url: "https:" + asset.fields.file.url,
    alt: asset.fields.title,
  }
}

function mapEntryToPost(entry: any, includes?: { Asset: Asset[] }): BlogPost {
  const {
    sys: { id },
    fields,
  } = entry

  const asset = includes && includes.Asset ? extractAsset(includes.Asset, fields.featuredImage?.sys?.id) : undefined

  return {
    id,
    title: fields.title,
    slug: fields.slug,
    excerpt: fields.excerpt ?? "",
    content: fields.content ?? "",
    publishedDate: fields.publishedDate,
    readTime: fields.readTime,
    featured: fields.featured ?? false,
    author: { name: fields.author?.fields?.name ?? "Speak About AI" },
    featuredImage: asset,
    categories:
      fields.categories?.map((c: any) => ({
        slug: c.fields.slug,
        name: c.fields.name,
      })) ?? [],
  }
}

/* ---------- Public API ---------- */

export async function getBlogPosts(limit = 10): Promise<BlogPost[]> {
  const data = await fetchContentfulAPI<{
    items: any[]
    includes?: { Asset: Asset[] }
  }>(`entries?content_type=blogPost&order=-fields.publishedDate&limit=${limit}&include=3`)

  return data.items.map((item) => mapEntryToPost(item, data.includes))
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const data = await fetchContentfulAPI<{
    items: any[]
    includes?: { Asset: Asset[] }
  }>(`entries?content_type=blogPost&fields.slug=${slug}&limit=1&include=3`)
  if (!data.items.length) return null
  return mapEntryToPost(data.items[0], data.includes)
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const data = await fetchContentfulAPI<{
    items: any[]
    includes?: { Asset: Asset[] }
  }>(`entries?content_type=blogPost&fields.featured=true&order=-fields.publishedDate&include=3`)
  return data.items.map((item) => mapEntryToPost(item, data.includes))
}

export async function getRelatedBlogPosts(currentPostId: string, limit = 3): Promise<BlogPost[]> {
  const data = await fetchContentfulAPI<{
    items: any[]
    includes?: { Asset: Asset[] }
  }>(`entries?content_type=blogPost&sys.id[ne]=${currentPostId}&order=-fields.publishedDate&limit=${limit}&include=3`)
  return data.items.map((item) => mapEntryToPost(item, data.includes))
}
