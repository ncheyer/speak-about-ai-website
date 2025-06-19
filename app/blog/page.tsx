import { getBlogPosts, getBlogCategories } from "@/lib/contentful-blog"
import { BlogClientPage } from "./blog-client-page"

export default async function BlogPage() {
  // Fetch posts and categories in parallel for efficiency
  const [posts, categories] = await Promise.all([getBlogPosts(), getBlogCategories()])

  return <BlogClientPage posts={posts} categories={categories} />
}
