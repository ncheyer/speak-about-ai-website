import { getAllSpeakers } from "@/lib/speakers-data"
import { redirect, notFound } from "next/navigation"
import { readdir } from "fs/promises"
import path from "path"

// This tells Next.js to render this page dynamically, not at build time.
// This is crucial to allow redirects to work without build errors.
export const dynamic = "force-dynamic"

type Props = {
  params: {
    slug: string
  }
}

export default async function OldSpeakerRedirectPage({ params }: Props) {
  const { slug } = params

  // Get a list of all top-level directories in the `app` folder
  // to avoid redirecting for actual pages like /contact, /blog, etc.
  try {
    const appDir = path.join(process.cwd(), "app")
    const entries = await readdir(appDir, { withFileTypes: true })
    const topLevelRoutes = entries
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      // Filter out special nextjs folders and the dynamic slug route itself
      .filter((name) => !name.startsWith("(") && !name.startsWith("_") && !name.startsWith("[") && name !== "api")

    if (topLevelRoutes.includes(slug)) {
      notFound()
      return
    }
  } catch (error) {
    // If we can't read the directory, we can proceed, but log the error.
    console.error("Could not read app directory for route checking:", error)
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
