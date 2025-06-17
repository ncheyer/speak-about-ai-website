import type { Metadata } from "next"
import { getSpeakersByIndustry } from "@/lib/speakers-data"
import TechnologyClientPage from "./TechnologyClientPage"

export const metadata: Metadata = {
  title: "Technology & Enterprise AI Speakers | Tech AI Keynote Speakers | Speak About AI",
  description:
    "Book top technology and enterprise AI keynote speakers for your tech conference or corporate event. Experts in AI transformation, digital innovation, and enterprise technology solutions.",
  keywords:
    "technology AI speakers, enterprise AI keynote speakers, tech speakers, AI transformation speakers, digital innovation speakers, enterprise technology speakers",
}

export default async function TechnologyEnterpriseAISpeakersPage() {
  const technologySpeakers = await getSpeakersByIndustry("Technology")

  return <TechnologyClientPage speakers={technologySpeakers} />
}
