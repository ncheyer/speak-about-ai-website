import BlogClientPage from "./blog-client-page"
import { getCombinedContent } from "@/lib/combined-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Insights & Tools - Expert Articles | Speak About AI",
  description:
    "Discover expert articles, cutting-edge tools, and resources for AI-powered events. Stay informed with insights from leading AI speakers.",
  alternates: {
    canonical: "https://speakabout.ai/blog"
  }
}

export default async function BlogPage() {
  // Fetch combined content (blog posts + landing pages) on the server.
  const initialContent = await getCombinedContent()
  
  // Debug: log content on server side
  console.log('Server: Total content items:', initialContent.length)
  console.log('Server: Blog posts:', initialContent.filter(item => item.type === 'blog').length)
  console.log('Server: Landing pages:', initialContent.filter(item => item.type === 'landing').length)

  // Render the client component, passing the initial data as a prop.
  return <BlogClientPage initialContent={initialContent} />
}
