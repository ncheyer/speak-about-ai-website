import { getAllSpeakers } from "@/lib/speakers-data"
import { redirect, notFound } from "next/navigation"
import { glob } from "glob"
import path from "path"

// This tells Next.js to render this page dynamically, not at build time.
// This is crucial to allow redirects to work without build errors.
export const dynamic = "force-dynamic"

async function getExistingRoutes() {
  const appDir = path.join(process.cwd(), "app")
  const files = await glob("**/page.tsx", { cwd: appDir })

  // 'files' will be like: ['(no-nav)/ai-keynote-speakers/page.tsx', 'blog/page.tsx', 'contact/page.tsx', ...]
  // We need to extract the route segments from these paths.
  const routes = files
    .map((file) => {
      // Get the directory part of the file path
      const dir = path.dirname(file)
      // Don't include dynamic routes or the root page
      if (dir.includes("[") || dir === ".") {
        return null
      }
      // Clean up route group syntax like (no-nav)
      return dir.replace(/$$[^)]+$$\/?/g, "")
    })
    .filter((route): route is string => route !== null && route !== "")

  return new Set(routes)
}

type Props = {
  params: {
    slug: string
  }
}

export default async function OldSpeakerRedirectPage({ params }: Props) {
  const { slug } = params

  const existingRoutes = await getExistingRoutes()
  if (existingRoutes.has(slug)) {
    notFound()
  }

  const speakers = await getAllSpeakers()
  const speakerExists = speakers.some((speaker) => speaker.slug === slug)

  if (speakerExists) {
    // Issue a permanent redirect (308) for SEO purposes
    redirect(`/speakers/${slug}`, "permanent")
  } else {
    // If the slug doesn't match a speaker, show a 404 page
    notFound()
  }

  // This part is never reached
  return null
}
