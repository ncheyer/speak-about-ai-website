import { BlogHero } from "@/components/blog-hero"
import { BlogList } from "@/components/blog-list"
import { getBlogPosts } from "@/lib/blog-data"

export const metadata = {
  title: "AI Blog | Speak About AI",
  description:
    "Expert perspectives on artificial intelligence, keynote speaking, and event planning from the world's only AI-exclusive speaker bureau.",
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <main>
      <BlogHero />
      <BlogList posts={posts} />
    </main>
  )
}
