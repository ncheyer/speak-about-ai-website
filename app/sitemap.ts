import type { MetadataRoute } from "next"
import { getAllSpeakers } from "@/lib/speakers-data" // Changed to getAllSpeakers as per lib/speakers-data.ts
import { getBlogPosts } from "@/lib/blog-data"

const BASE_URL = "https://www.speakabout.ai"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "", // Homepage
    "/speakers",
    "/blog",
    "/contact",
    "/our-services",
    "/our-team",
    "/privacy",
    "/terms",
    "/top-ai-speakers-2025",
    "/form-submission",
    // Industry Pages
    "/industries/automotive-ai-speakers",
    "/industries/healthcare-keynote-speakers",
    "/industries/leadership-business-strategy-ai-speakers",
    "/industries/manufacturing-ai-speakers",
    "/industries/retail-ai-speakers",
    "/industries/sales-marketing-ai-speakers",
    "/industries/technology-ai-keynote-speakers",
    "/industries/technology-keynote-speakers",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: path === "" || path === "/blog" || path === "/speakers" ? "daily" : "monthly",
    priority: path === "" ? 1.0 : 0.8,
  }))

  let speakerPages: MetadataRoute.Sitemap = []
  try {
    const speakers = await getAllSpeakers() // Using getAllSpeakers
    speakerPages = speakers.map((speaker) => ({
      url: `${BASE_URL}/speakers/${speaker.slug}`,
      lastModified: speaker.lastUpdated || new Date().toISOString(), // Using lastUpdated from Speaker interface
      changeFrequency: "weekly",
      priority: 0.7,
    }))
  } catch (error) {
    console.error("Error fetching speakers for sitemap:", error)
  }

  let blogPostPages: MetadataRoute.Sitemap = []
  try {
    const posts = await getBlogPosts()
    blogPostPages = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.sys?.updatedAt || new Date().toISOString(), // Using sys.updatedAt from Contentful structure
      changeFrequency: "weekly",
      priority: 0.6,
    }))
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error)
  }

  return [...staticPages, ...speakerPages, ...blogPostPages]
}
