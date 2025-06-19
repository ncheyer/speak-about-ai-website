import { getBlogPosts, type BlogPost, type DerivedCategory } from "@/lib/contentful-blog"
import BlogClientPage from "./blog-client-page"

// Helper to collect and deduplicate categories from posts
function deriveCategories(posts: BlogPost[]): DerivedCategory[] {
  const categoryMap = new Map<string, DerivedCategory>()
  posts.forEach((post) => {
    if (post.categories && Array.isArray(post.categories)) {
      post.categories.forEach((cat) => {
        if (cat && cat.slug && cat.name && !categoryMap.has(cat.slug)) {
          categoryMap.set(cat.slug, { slug: cat.slug, name: cat.name })
        }
      })
    }
  })
  return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export default async function BlogPage() {
  const allPosts = await getBlogPosts() // already sorted newest→oldest

  const categories = deriveCategories(allPosts)

  const featuredPosts = allPosts.slice(0, 3) // top 3 newest
  const nonFeaturedPosts = allPosts.slice(3) // everything else

  return <BlogClientPage posts={nonFeaturedPosts} featuredPosts={featuredPosts} categories={categories} />
}
