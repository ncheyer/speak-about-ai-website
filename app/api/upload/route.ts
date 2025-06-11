import { handleUpload } from "@vercel/blob/client"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if the Blob token is set
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN is not set")
      return NextResponse.json({ error: "Server configuration error: Blob token is not set" }, { status: 500 })
    }

    const body = await request.json()

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Generate a client token for the browser to upload the file
        // ⚠️ Authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads.

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          maximumSizeInBytes: 500 * 1024, // 500KB limit
        }
      },
      onUploadCompleted: async ({ blob }) => {
        // Get notified of client upload completion
        console.log("blob upload completed", blob)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 400 },
    )
  }
}
