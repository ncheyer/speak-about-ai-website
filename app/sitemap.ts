import type { MetadataRoute } from "next"
import { getAllSpeakers } from "@/lib/speakers-data"

const BASE_URL = "https://www.speakabout.ai"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  
  // Get all speakers for individual pages
  const speakers = await getAllSpeakers()
  
  // Main pages with high priority
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/speakers`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/top-ai-speakers-2025`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/our-services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/our-team`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]
  
  // Industry pages with high SEO value
  const industryPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/industries/technology-keynote-speakers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/industries/healthcare-keynote-speakers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/industries/leadership-business-strategy-ai-speakers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/industries/retail-ai-speakers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/industries/manufacturing-ai-speakers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/industries/sales-marketing-ai-speakers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/industries/automotive-ai-speakers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ]
  
  // Individual speaker pages - VERY IMPORTANT FOR SEO
  const speakerPages: MetadataRoute.Sitemap = speakers.map((speaker) => ({
    url: `${BASE_URL}/speakers/${speaker.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))
  
  return [...mainPages, ...industryPages, ...speakerPages]
}
