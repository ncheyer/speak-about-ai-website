import type { Metadata } from "next"
import TeamHero from "@/components/team-hero"
import TeamMembers from "@/components/team-members"
import TeamValues from "@/components/team-values"
import JoinTeam from "@/components/join-team"

export const metadata: Metadata = {
  title: "Our Team | AI Speaker Bureau Experts | Speak About AI",
  description:
    "Meet the team behind Speak About AI, the world's only AI-exclusive speaker bureau. Our experts connect you with top artificial intelligence keynote speakers.",
  keywords:
    "AI speaker bureau team, Speak About AI team, AI keynote speaker experts, artificial intelligence bureau staff",
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
