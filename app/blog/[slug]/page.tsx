import { notFound } from "next/navigation"
import { BlogPostComponent } from "@/components/blog-post"
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/blog-data"
import { draftMode } from "next/headers" // Import draftMode

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { isEnabled: isPreview } = draftMode() // Check draft mode
  // Pass isPreview to your data fetching
  const post = await getBlogPostBySlug(params.slug, isPreview)

  if (!post) {
    return {
      title: "Post Not Found | Speak About AI",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${isPreview ? "[PREVIEW] " : ""}${post.title} | Speak About AI Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.seoKeywords || post.tags.join(", "),
    // Add other metadata, potentially indicating preview if desired
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { isEnabled: isPreview } = draftMode() // Check draft mode

  // Pass isPreview to your data fetching
  const post = await getBlogPostBySlug(params.slug, isPreview)

  if (!post) {
    notFound()
  }

  // Related posts might also respect preview mode
  const relatedPosts = await getRelatedBlogPosts(post.id, 3, isPreview)

  return (
    <main>
      {isPreview && (
        <div className="bg-yellow-200 dark:bg-yellow-700 border-b border-yellow-300 dark:border-yellow-600 p-3 text-center text-sm text-yellow-800 dark:text-yellow-100">
          <strong>PREVIEW MODE ACTIVE</strong> - You are viewing potentially unpublished content.{" "}
          <a
            href={`/api/preview/disable?redirect=/blog/${params.slug}`}
            className="underline hover:text-yellow-600 dark:hover:text-yellow-300"
          >
            Exit Preview Mode
          </a>
        </div>
      )}
      <BlogPostComponent key={params.slug} post={post} relatedPosts={relatedPosts} />
    </main>
  )
}
