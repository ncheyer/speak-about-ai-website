import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import type { BlogPost } from "@/lib/blog-data"
import { BlogCard } from "@/components/blog-card"
import { marked } from "marked"

interface BlogPostProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export function BlogPostComponent({ post, relatedPosts }: BlogPostProps) {
  // Convert markdown to HTML
  const contentHtml = marked(post.content)

  return (
    <article className="container px-4 py-12 md:px-6 md:py-16">
      <Link href="/blog" className="inline-flex items-center text-[#1E68C6] hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all articles
      </Link>

      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{post.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="aspect-[16/9] w-full overflow-hidden rounded-lg mb-8">
          <Image
            src={post.coverImage || "/placeholder.svg"}
            alt={post.title}
            width={1200}
            height={675}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />

        <div className="mt-12 border-t pt-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-full">
              <Image
                src={post.authorImage || "/placeholder-user.jpg"}
                alt={post.author}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{post.author}</p>
              {post.authorTitle && <p className="text-sm text-gray-500">{post.authorTitle}</p>}
            </div>
          </div>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
