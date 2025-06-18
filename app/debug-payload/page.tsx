import { getBlogPosts, getBlogPostsFromPayload } from "@/lib/payload-blog"

export default async function DebugPayloadPage() {
  console.log("🔍 Debug page: Testing Payload connection...")

  const publishedPosts = await getBlogPosts(50)
  const allPosts = await getBlogPostsFromPayload(true) // Include unpublished

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Payload Debug Page</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p>
            <strong>NEXT_PUBLIC_PAYLOAD_URL:</strong> {process.env.NEXT_PUBLIC_PAYLOAD_URL || "Not set"}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Published Posts ({publishedPosts.length})</h2>
        {publishedPosts.length > 0 ? (
          <div className="space-y-4">
            {publishedPosts.map((post) => (
              <div key={post.id} className="border p-4 rounded">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">Slug: {post.slug}</p>
                <p className="text-sm text-gray-600">Status: {post.status}</p>
                <p className="text-sm text-gray-600">Author: {post.author?.name || "No author"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-600">No published posts found</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Posts (Including Drafts) ({allPosts.length})</h2>
        {allPosts.length > 0 ? (
          <div className="space-y-4">
            {allPosts.map((post) => (
              <div key={post.id} className="border p-4 rounded">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">Slug: {post.slug}</p>
                <p className="text-sm text-gray-600">Status: {post.status}</p>
                <p className="text-sm text-gray-600">Author: {post.author?.name || "No author"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-600">No posts found at all</p>
        )}
      </div>
    </div>
  )
}
