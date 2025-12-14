import { list } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Require authentication
    const user = getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required", code: "NO_AUTH" },
        { status: 401 }
      )
    }

    // Check if the Blob token is set
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN is not set")
      return NextResponse.json({ error: "Image library unavailable" }, { status: 503 })
    }

    // Get search/filter params
    const { searchParams } = new URL(request.url)
    const prefix = searchParams.get("prefix") || ""
    const cursor = searchParams.get("cursor") || undefined
    const limit = parseInt(searchParams.get("limit") || "100", 10)

    // List blobs from Vercel Blob storage
    const { blobs, cursor: nextCursor, hasMore } = await list({
      prefix,
      cursor,
      limit,
    })

    // Filter to only image types
    const imageBlobs = blobs.filter((blob) =>
      blob.contentType?.startsWith("image/")
    )

    // Group by folder/prefix for easier browsing
    const grouped: Record<string, typeof imageBlobs> = {}
    for (const blob of imageBlobs) {
      // Extract folder from pathname (e.g., "speakers/photo.jpg" -> "speakers")
      const parts = blob.pathname.split("/")
      const folder = parts.length > 1 ? parts.slice(0, -1).join("/") : "root"
      if (!grouped[folder]) {
        grouped[folder] = []
      }
      grouped[folder].push(blob)
    }

    return NextResponse.json({
      images: imageBlobs.map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        contentType: blob.contentType,
      })),
      grouped,
      cursor: nextCursor,
      hasMore,
    })
  } catch (error) {
    console.error("Error listing images:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to list images",
      },
      { status: 500 }
    )
  }
}
