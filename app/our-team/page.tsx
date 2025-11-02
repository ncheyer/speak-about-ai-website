import type { Metadata } from "next"
import TeamHero from "@/components/team-hero"
import TeamMembers from "@/components/team-members"
import TeamValues from "@/components/team-values"
import JoinTeam from "@/components/join-team"

export const metadata: Metadata = {
  title: "AI Speaker Bureau Team - Expert Booking Agents | Speak About AI",
  description:
    "Expert AI speaker bureau team connecting you with top AI keynote speakers. World's only AI-exclusive speaker bureau with dedicated booking agents.",
  keywords:
    "AI speaker bureau team, AI booking agents, AI keynote speaker experts, artificial intelligence bureau staff, speaker booking team",
  alternates: {
    canonical: "https://speakabout.ai/our-team",
  },
}

export default function OurTeamPage() {
  return (
    <div className="min-h-screen bg-white">
      <TeamHero />
      <TeamMembers />
      <TeamValues />
      <JoinTeam />
    </div>
  )
}
