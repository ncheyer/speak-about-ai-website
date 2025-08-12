import type { MetadataRoute } from "next"

const BASE_URL = "https://www.speakabout.ai"

export default function sitemap(): MetadataRoute.Sitemap {
  // Start with just the most critical pages
  // This conservative approach ensures Google focuses on your best content
  
  const now = new Date()
  
  // Only include the absolute most important pages initially
  const criticalPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/speakers`,
      lastModified: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/top-ai-speakers-2025`,
      lastModified: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/industries/technology-keynote-speakers`,
      lastModified: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/industries/healthcare-keynote-speakers`,
      lastModified: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/our-services`,
      lastModified: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]
  
  return criticalPages
}