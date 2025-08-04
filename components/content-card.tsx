import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { getImageUrl, formatDate } from "@/lib/utils"
import type { ContentItem } from "@/lib/combined-content"

interface ContentCardProps {
  item: ContentItem
}

export function ContentCard({ item }: ContentCardProps) {
  const featuredImageUrl = item.featuredImage?.url ? getImageUrl(item.featuredImage.url) : null
  const linkHref = item.type === 'blog' ? `/blog/${item.slug}` : `/lp/${item.slug}`

  return (
    <article className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      {featuredImageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <Link href={linkHref} className="block w-full h-full">
            <Image
              src={featuredImageUrl || "/placeholder.svg"}
              alt={item.featuredImage?.alt || item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>
      )}
      
      <div className="p-6">
        {/* Content Type Badge */}
        <div className="flex items-center justify-between mb-3">
          <Badge 
            variant={item.type === 'blog' ? 'default' : 'secondary'}
            className={item.type === 'blog' 
              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
              : 'bg-green-100 text-green-800 hover:bg-green-200'
            }
          >
            {item.type === 'blog' ? 'Article' : 'Tool'}
          </Badge>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-1">
            {item.categories.slice(0, 2).map((category) => (
              <Badge key={category.slug} variant="outline" className="text-xs">
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          <Link 
            href={linkHref} 
            className="hover:text-blue-700 transition-colors"
          >
            {item.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
          {item.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            {item.author?.name && (
              <span>By {item.author.name}</span>
            )}
          </div>
          <time dateTime={item.publishedDate}>
            {formatDate(item.publishedDate)}
          </time>
        </div>

        {/* CTA */}
        <div className="mt-4">
          <Link 
            href={linkHref}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm group"
          >
            {item.type === 'blog' ? 'Read article' : 'Try tool'}
            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}