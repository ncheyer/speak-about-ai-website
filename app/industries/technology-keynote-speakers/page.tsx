import type { Metadata } from "next"
import { getSpeakersByIndustry } from "@/lib/speakers-data"
import TechnologyAISpeakersClientPage from "../technology-ai-keynote-speakers/TechnologyAISpeakersClientPage"

export const metadata: Metadata = {
  title: "Technology Keynote Speakers | AI & Enterprise Technology Experts",
  description:
    "Book top technology keynote speakers and AI experts for your corporate events, conferences, and tech summits. Leading voices in enterprise AI, digital transformation, and emerging technologies.",
  keywords:
    "technology keynote speakers, tech keynote speaker, ai keynote speaker, enterprise technology speakers, digital transformation speakers, artificial intelligence experts",
}

export default async function TechnologyKeynoteSpeakersPage() {
  const speakers = await getSpeakersByIndustry("Technology")

  return <TechnologyAISpeakersClientPage speakers={speakers} />
}
