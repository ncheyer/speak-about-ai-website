import type { Metadata } from "next"
import { getSpeakersByIndustry } from "@/lib/speakers-data"
import FinanceAISpeakersClientPage from "./FinanceAISpeakersClientPage"

export const metadata: Metadata = {
  title: "Finance AI Speakers | Financial Services AI Keynote Speakers | Speak About AI",
  description:
    "Book top finance AI keynote speakers for your financial services conference or event. Experts in AI banking applications, fintech, and financial technology innovation.",
  keywords:
    "finance AI speakers, financial services AI keynote speakers, fintech speakers, AI in banking speakers, financial technology speakers",
}

export default async function FinanceAISpeakersPage() {
  const financeSpeakers = await getSpeakersByIndustry("finance")

  return <FinanceAISpeakersClientPage speakers={financeSpeakers} />
}
