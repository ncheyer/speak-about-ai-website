import { getBlogPosts, type BlogPost, type DerivedCategory } from "@/lib/contentful-blog"
import BlogClientPage from "./blog-client-page"

// Helper to collect and deduplicate categories from all posts
function deriveCategories(allPostsForCategories: BlogPost[]): DerivedCategory[] {
  const categoryMap = new Map<string, DerivedCategory>()
  allPostsForCategories.forEach((post) => {
    if (post.categories && Array.isArray(post.categories)) {
      post.categories.forEach((cat) => {
        if (cat && typeof cat.slug === "string" && typeof cat.name === "string" && !categoryMap.has(cat.slug)) {
          categoryMap.set(cat.slug, { slug: cat.slug, name: cat.name })
        }
      })
    }
  })
  return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export default async function BlogPage() {
  const allPosts = await getBlogPosts() // Fetches all posts, sorted by creation date (newest first)

  const categories = deriveCategories(allPosts) // Derive categories from ALL posts

  // Define featured posts (e.g., the 2 newest ones)
  // The previous BlogClientPage showed up to 2 featured posts using FeaturedBlogPostCard
  const featuredPosts = allPosts.slice(0, 2)
  // Define non-featured posts (the rest)
  const nonFeaturedPosts = allPosts.slice(2)

  return <BlogClientPage posts={nonFeaturedPosts} featuredPosts={featuredPosts} categories={categories} />
}
