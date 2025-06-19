import { getBlogPosts, type BlogPost } from "@/lib/contentful-blog"
import BlogClientPage from "./blog-client-page"

// Helper to collect and deduplicate categories from posts
function deriveCategories(posts: BlogPost[]) {
  const map = new Map<string, { slug: string; name: string }>()
  posts.forEach((post) => {
    post.categories.forEach((cat) => {
      if (!map.has(cat.slug)) map.set(cat.slug, cat)
    })
  })
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export default async function BlogPage() {
  // Pull a generous amount of posts so every category in use is represented.
  const posts = await getBlogPosts(1000)
  const categories = deriveCategories(posts)

  return <BlogClientPage posts={posts} categories={categories} />
}
