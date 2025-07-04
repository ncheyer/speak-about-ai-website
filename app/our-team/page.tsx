import type { Metadata } from "next"
import TeamHero from "@/components/team-hero"
import TeamMembers from "@/components/team-members"
import TeamValues from "@/components/team-values"
import JoinTeam from "@/components/join-team"

export const metadata: Metadata = {
  title: "Our Team | Speak About AI", // Updated: 26 chars
  description:
    "Meet the Speak About AI team, your experts for connecting you with top AI keynote speakers. We're the world's only AI-exclusive speaker bureau.", // 143 chars
  keywords:
    "AI speaker bureau team, Speak About AI team, AI keynote speaker experts, artificial intelligence bureau staff",
  alternates: {
    canonical: "/our-team",
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
