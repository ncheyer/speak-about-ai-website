import { handleUpload } from "@vercel/blob/client"
import type { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest): Promise<NextResponse> {
  const response = await handleUpload({
    request,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })

  return response
}
