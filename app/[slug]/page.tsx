import { permanentRedirect, notFound } from "next/navigation"
import { getSpeakerBySlug } from "@/lib/speakers-data"
import type { Metadata } from "next"

interface Props {
  params: { slug: string }
}

// This page component handles old speaker URLs (e.g., /speaker-slug)
// and permanently redirects them to the new structure (/speakers/speaker-slug).
// Next.js prioritizes static routes, so this will only catch slugs that
// don't match existing pages like /contact, /our-team, etc.

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // We are redirecting, so this metadata is primarily for bots before the redirect happens.
  const speaker = await getSpeakerBySlug(params.slug)
  if (speaker) {
    return {
      title: `Redirecting to ${speaker.name}'s profile...`,
      robots: {
        index: false, // Instruct search engines not to index this redirect page
        follow: true, // Instruct search engines to follow the link to the new page
      },
    }
  }
  return {
    title: "Page Not Found",
  }
}

export default async function OldSpeakerRedirectPage({ params }: Props) {
  if (!params.slug) {
    notFound()
  }

  const speaker = await getSpeakerBySlug(params.slug)

  if (speaker) {
    // If a speaker is found for the given slug, issue a permanent (308) redirect.
    // This is crucial for SEO to transfer link equity to the new URL.
    permanentRedirect(`/speakers/${speaker.slug}`)
  } else {
    // If no speaker is found, render the standard 404 page.
    notFound()
  }
}
