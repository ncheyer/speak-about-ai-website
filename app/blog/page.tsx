import BlogClientPage from "./blog-client-page"
import { getBlogPosts } from "@/lib/blog-data"

export default async function BlogPage() {
  // Fetch initial data on the server.
  const initialPosts = await getBlogPosts()

  // Render the client component, passing the initial data as a prop.
  return <BlogClientPage initialPosts={initialPosts} />
}
