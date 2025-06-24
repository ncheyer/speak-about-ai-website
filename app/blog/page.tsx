import type { Metadata } from "next"
import { BlogHero } from "@/components/blog-hero"
import { BlogList } from "@/components/blog-list"
import { FeaturedBlogPostCard } from "@/components/featured-blog-post-card"
import { getBlogPosts, type BlogPost } from "@/lib/blog-data"

export const metadata: Metadata = {
  title: "AI Insights Blog | Speak About AI",
  description: "Explore Speak About AI’s blog for expert insights on AI trends, keynote speaking, and industry news.",
  alternates: { canonical: "/blog" },
}

export default async function BlogPage() {
  let allPosts: BlogPost[] = []

  try {
    // Fetch a generous number of posts; pagination can come later.
    allPosts = await getBlogPosts(100)
  } catch (err) {
    console.error("BlogPage: failed to load posts:", err)
  }

  // Split the list: first 3 as “featured”, remainder as “regular”.
  const featuredPosts = allPosts.slice(0, 3)
  const regularPosts = allPosts.slice(3)

  return (
    <div className="min-h-screen bg-white">
      <BlogHero />

      <main className="container mx-auto px-4 py-8 md:py-12">
        {featuredPosts.length > 0 && (
          <section className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">Featured Articles</h2>

            <div className="grid gap-8 md:gap-12">
              {featuredPosts.map((post) => (
                <FeaturedBlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">
            {featuredPosts.length ? "More Articles" : "All Articles"}
          </h2>

          {regularPosts.length ? (
            <BlogList posts={regularPosts} />
          ) : (
            <p className="text-center text-gray-600 text-lg py-10">
              {featuredPosts.length
                ? "No more articles right now—check back soon!"
                : "No blog posts found at the moment. Check back soon!"}
            </p>
          )}
        </section>
      </main>
    </div>
  )
}
