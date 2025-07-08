import { getAllSpeakers } from "@/lib/speakers-data"
import { redirect, notFound } from "next/navigation"

type Params = { slug: string }

/**
 * Generate static params for each known speaker slug so the redirect page
 * can be statically optimized while still issuing the proper 308 redirect.
 */
export async function generateStaticParams() {
  const speakers = await getAllSpeakers()
  return speakers.map((s) => ({ slug: s.slug }))
}

/**
 * Any top-level route like `/adam-cheyer` that conflicts with an existing
 * speaker slug will be permanently redirected to `/speakers/adam-cheyer`.
 * All other unmatched slugs will fall through to the Next.js 404 page.
 */
export default async function OldSpeakerRedirectPage({
  params,
}: {
  params: Params
}) {
  const { slug } = params

  // Check if the slug matches a speaker
  const speakers = await getAllSpeakers()
  const match = speakers.find((s) => s.slug === slug)

  if (match) {
    // 308 permanent redirect preserves SEO equity
    redirect(`/speakers/${slug}`, "permanent")
  }

  // Not a speaker – show the default 404
  notFound()
}
