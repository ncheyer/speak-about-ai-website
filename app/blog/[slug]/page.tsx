import { notFound } from "next/navigation"
import { BlogPostComponent } from "@/components/blog-post"
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/blog-data"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found | Speak About AI",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} | Speak About AI Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.seoKeywords || post.tags.join(", "),
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription || post.excerpt,
      images: [post.coverImage],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedBlogPosts(post.id, 3)

  return (
    <main>
      <BlogPostComponent key={params.slug} post={post} relatedPosts={relatedPosts} />
    </main>
  )
}
