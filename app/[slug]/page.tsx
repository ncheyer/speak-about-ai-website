import { getAllSpeakers } from "@/lib/speakers-data"
import { redirect, notFound } from "next/navigation"

// Render dynamically so redirects run at request-time, not build-time.
export const dynamic = "force-dynamic"

type Params = { slug: string }

export default async function OldSpeakerRedirectPage({
  params,
}: {
  params: Params
}) {
  const { slug } = params

  /*  
    Static folders in /app always take priority over this dynamic route,
    so normally we don't need to guard against them.  The extra array below
    is only for edge-cases where you might create new top-level routes
    later and want to be explicit.
  */
  const knownTopLevelRoutes = [
    "contact",
    "our-services",
    "our-team",
    "privacy",
    "terms",
    "blog",
    "speakers",
    "industries",
    "admin",
    "api",
  ]

  if (knownTopLevelRoutes.includes(slug)) {
    notFound()
  }

  const speakers = await getAllSpeakers()
  const match = speakers.find((s) => s.slug === slug)

  if (match) {
    /* 308 = permanent redirect — preserves SEO link equity */
    redirect(`/speakers/${slug}`, "permanent")
  }

  notFound()
}
