import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock } from "lucide-react"
import type { BlogPost } from "@/lib/blog-data"

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <div className={`overflow-hidden rounded-lg border bg-white shadow-sm ${featured ? "md:col-span-2" : ""}`}>
      <div className="relative">
        <Link href={`/blog/${post.slug}`}>
          <div className="aspect-[16/9] w-full overflow-hidden">
            <Image
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              width={800}
              height={450}
              className="h-full w-full object-cover transition-all hover:scale-105"
            />
          </div>
        </Link>
      </div>
      <div className="p-4 md:p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">{post.title}</h3>
        </Link>
        <p className="mt-2 line-clamp-3 text-gray-500">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{post.readTime}</span>
          </div>
        </div>
        <div className="mt-4">
          <Link href={`/blog/${post.slug}`} className="text-[#1E68C6] font-medium hover:underline">
            Read more
          </Link>
        </div>
      </div>
    </div>
  )
}
