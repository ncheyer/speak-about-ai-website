import type { Metadata } from "next"
import { getSpeakersByIndustry } from "@/lib/speakers-data"
import HealthcareAISpeakersClientPage from "./HealthcareAISpeakersClientPage"

export const metadata: Metadata = {
  title: "Healthcare AI Speakers | Medical AI Keynote Speakers",
  description:
    "Book world-class healthcare AI speakers for your medical conference or event. Expert keynote speakers specializing in medical AI, digital health, and healthcare innovation.",
  keywords: [
    "healthcare AI speakers",
    "medical AI keynote speakers",
    "digital health speakers",
    "healthcare innovation speakers",
    "medical technology speakers",
    "AI in healthcare",
    "healthcare conference speakers",
  ],
}

export default async function HealthcareAISpeakersPage() {
  const healthcareSpeakers = await getSpeakersByIndustry("healthcare")

  return <HealthcareAISpeakersClientPage speakers={healthcareSpeakers} />
}
