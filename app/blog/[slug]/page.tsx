import { notFound } from "next/navigation"
import { BlogPostComponent } from "@/components/blog-post"
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/blog-data"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found | Speak About AI",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} | Speak About AI Blog`,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedBlogPosts(post.id, 3)

  return (
    <main>
      <BlogPostComponent key={params.slug} post={post} relatedPosts={relatedPosts} />
    </main>
  )
}
