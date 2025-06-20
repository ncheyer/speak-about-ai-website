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

export interface Category {
  slug: string
  name: string
}
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
  categories: Category[]
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
type Asset = {
  sys: Sys
  fields: {
    title: string
    description?: string
    file: { url: string; details: { image?: { width: number; height: number } } }
  }
}
type Includes = { Asset?: Asset[]; Entry?: (AuthorEntry | CategoryEntry | any)[] } // Make Entry more specific

function extractAsset(assets: Asset[] | undefined, id: string | undefined) {
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
): { name: string } {
  const fallback = { name: "Speak About AI" }
  if (!entries || !authorFieldSysId) return fallback

  const authorEntry = entries.find(
    (e) => e.sys.id === authorFieldSysId && e.sys.contentType?.sys?.id === "author", // Ensure it's an author entry
  )

  if (authorEntry && (authorEntry as AuthorEntry).fields?.name) {
    return { name: (authorEntry as AuthorEntry).fields.name }
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
  }
}

/* ---------- Public API ---------- */
const INCLUDE_LEVEL = 10 // This should be high enough to get linked authors and categories

export async function getBlogPosts(limit = 1000): Promise<BlogPost[]> {
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
