import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")
  const slug = searchParams.get("slug")

  // Check the secret and slug
  // This secret should be an environment variable
  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !slug) {
    return new Response("Invalid token or missing slug", { status: 401 })
  }

  // Enable Draft Mode by setting the cookie
  draftMode().enable()

  // Redirect to the path from the fetched post
  // Ensure slug is sanitized before use if necessary
  redirect(`/blog/${slug}`)
}
