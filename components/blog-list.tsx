import { BlogCard } from "@/components/blog-card"
import type { BlogPost } from "@/lib/blog-data"

interface BlogListProps {
  posts: BlogPost[]
  showFeatured?: boolean
}

export function BlogList({ posts, showFeatured = true }: BlogListProps) {
  // If showFeatured is true, find the featured post (if any)
  const featuredPost = showFeatured ? posts.find((post) => post.featured) : undefined

  // Filter out the featured post from the regular posts list if we're showing it separately
  const regularPosts = featuredPost ? posts.filter((post) => post.id !== featuredPost.id) : posts

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      {featuredPost && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
          <BlogCard post={featuredPost} featured={true} />
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Latest Articles</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {regularPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
