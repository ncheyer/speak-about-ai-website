import type { Metadata } from "next"
import { getSpeakersByIndustry } from "@/lib/speakers-data"
import LeadershipBusinessStrategyClientPage from "./LeadershipBusinessStrategyClientPage"

export const metadata: Metadata = {
  title: "Leadership & Business Strategy AI Keynote Speakers | Speak About AI",
  description:
    "Book top leadership and business strategy AI keynote speakers for your corporate events. Expert speakers on AI transformation, digital leadership, and strategic innovation.",
  keywords:
    "leadership keynote speaker, business keynote speaker, AI leadership speakers, business strategy speakers, corporate keynote speakers, executive speakers, digital transformation speakers",
  openGraph: {
    title: "Leadership & Business Strategy AI Keynote Speakers",
    description:
      "Transform your leadership events with expert AI keynote speakers specializing in business strategy, digital transformation, and executive leadership.",
    type: "website",
  },
}

export default async function LeadershipBusinessStrategyPage() {
  const speakers = await getSpeakersByIndustry("leadership")

  return <LeadershipBusinessStrategyClientPage speakers={speakers} />
}
