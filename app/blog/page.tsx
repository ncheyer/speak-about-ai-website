import { getBlogPosts, type BlogPost } from "@/lib/contentful-blog" // Ensure BlogPost type is imported
import BlogClientPage from "./blog-client-page"

interface DerivedCategory {
  slug: string
  name: string
}

// Helper to collect and deduplicate categories from posts
function deriveCategories(posts: BlogPost[]): DerivedCategory[] {
  const categoryMap = new Map<string, DerivedCategory>()
  posts.forEach((post) => {
    if (post.categories && Array.isArray(post.categories)) {
      post.categories.forEach((cat) => {
        // Ensure category has a valid slug and name before adding
        if (cat && cat.slug && cat.name && !categoryMap.has(cat.slug)) {
          categoryMap.set(cat.slug, { slug: cat.slug, name: cat.name })
        }
      })
    }
  })
  const derived = Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  // console.log("Derived categories on server:", JSON.stringify(derived, null, 2)); // For debugging
  return derived
}

export default async function BlogPage() {
  const posts = await getBlogPosts(1000) // Fetch a good number of posts
  const categories = deriveCategories(posts)

  return <BlogClientPage posts={posts} categories={categories} />
}
