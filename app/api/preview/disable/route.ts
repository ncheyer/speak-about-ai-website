import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // Disable Draft Mode by removing the cookie
  draftMode().disable()

  const { searchParams } = new URL(request.url)
  const redirectPath = searchParams.get("redirect") || "/"

  // Redirect to the path provided or homepage
  redirect(redirectPath)
}
