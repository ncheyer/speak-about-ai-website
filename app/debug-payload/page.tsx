import { getBlogPosts, getBlogPostsFromPayload } from "@/lib/payload-blog"

export default async function DebugPayloadPage() {
  console.log("🔍 Debug page: Testing Payload connection...")

  const publishedPosts = await getBlogPosts(50)
  const allPosts = await getBlogPostsFromPayload(true) // Include unpublished

  let directData = null
  let directError = null
  try {
    const directTest = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/blog-posts?limit=5&depth=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store", // Force fresh requests
    })

    console.log("🔥 Direct API test response status:", directTest.status)
    console.log("🔥 Direct API test response headers:", Object.fromEntries(directTest.headers.entries()))

    if (!directTest.ok) {
      const errorText = await directTest.text()
      console.error("🔥 Direct API test error response text:", errorText)
      throw new Error(`Direct API call failed: ${directTest.status} ${errorText || directTest.statusText}`)
    }
    directData = await directTest.json()
    console.log("🔥 Direct API test data:", directData)
  } catch (error: any) {
    console.error("🔥 Direct API test fetch error:", error.message)
    directError = error.message
  }

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
        <h2 className="text-xl font-semibold mb-4">Direct API Call Test</h2>
        {directError ? (
          <div className="bg-red-100 p-4 rounded">
            <p className="text-red-700 font-semibold">Error:</p>
            <pre className="text-sm text-red-600 whitespace-pre-wrap">{directError}</pre>
          </div>
        ) : directData ? (
          <div className="bg-green-100 p-4 rounded">
            <p className="text-green-700 font-semibold">Success! Raw Data:</p>
            <pre className="text-sm text-green-600 whitespace-pre-wrap">{JSON.stringify(directData, null, 2)}</pre>
          </div>
        ) : (
          <p>Loading direct API test...</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Published Posts (via getBlogPosts - {publishedPosts.length})</h2>
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
          <p className="text-red-600">No published posts found via getBlogPosts</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Posts (via getBlogPostsFromPayload - {allPosts.length})</h2>
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
          <p className="text-red-600">No posts found at all via getBlogPostsFromPayload</p>
        )}
      </div>
    </div>
  )
}
