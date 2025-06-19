import type { Metadata } from "next"
import { getSpeakersByIndustry } from "@/lib/speakers-data"
import HealthcareKeynoteSpeakersClientPage from "./HealthcareKeynoteSpeakersClientPage" // Updated import

export const metadata: Metadata = {
  title: "Top Healthcare Keynote Speakers | Medical Conference Experts", // Updated title
  description:
    "Book top healthcare keynote speakers for medical conferences. Experts in medical innovation, patient care, and healthcare technology.", // Updated description
  keywords: [
    "healthcare keynote speakers",
    "medical keynote speakers",
    "top healthcare speakers",
    "medical conference speakers",
    "healthcare innovation speakers",
    "digital health keynote",
    "patient care speakers",
    "healthcare technology speakers",
    "AI in healthcare speakers", // Kept AI as it's still a theme
  ],
}

export default async function HealthcareKeynoteSpeakersPage() {
  // Updated function name for clarity
  const healthcareSpeakers = await getSpeakersByIndustry("healthcare")

  return <HealthcareKeynoteSpeakersClientPage speakers={healthcareSpeakers} /> // Updated component name
}
