import Image from "next/image"
import { Linkedin, Twitter, Globe } from "lucide-react"

interface TeamMember {
  name: string
  title: string
  image: string
  bio: string
  linkedin?: string
  twitter?: string
  website?: string
}

export default function TeamMembers() {
  const teamMembers: TeamMember[] = [
    {
      name: "Robert Strong",
      title: "CEO",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Speak About AI was founded by author, speaker, and entertainer Robert Strong and is a division of Strong Entertainment, LLC. With 30+ years of experience booking speakers and entertainers globally, Robert brings unparalleled expertise to the AI speaking circuit. He's also a world-renowned magician who's performed at the White House twice, on Penn & Teller Fool Us, and for every major tech company in Silicon Valley. His Amazon best-selling book 'Amaze & Delight: Secrets to Creating Magic in Business' showcases his unique approach to business entertainment.",
      linkedin: "https://linkedin.com/in/robertstrong",
      twitter: "https://twitter.com/robertstrong",
    },
    {
      name: "Noah Cheyer",
      title: "Head of Marketing & Operations",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Noah Cheyer leads marketing and operations at Speak About AI, bringing a unique perspective to the AI speaking industry. With a BA in Communication Studies and Entrepreneurship from Chapman University, Noah has built expertise across multiple industries. He previously served as Marketplace Account Manager for BlendJet and held various marketing roles in sports, technology, and E-Commerce. Having grown up alongside AI as the son of Siri Co-Founder Adam Cheyer, Noah combines practical business acumen with a lifetime of exposure to artificial intelligence innovation.",
      linkedin: "https://linkedin.com/in/noahcheyer",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-64 h-64 mb-6 rounded-full overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 256px"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1 font-neue-haas text-center">{member.name}</h3>
              <p className="text-[#1E68C6] font-semibold mb-4 font-montserrat text-center">{member.title}</p>
              <p className="text-gray-600 text-center mb-4 font-montserrat leading-relaxed">{member.bio}</p>

              <div className="flex space-x-4 mt-auto">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-[#1E68C6]"
                    aria-label={`${member.name}'s LinkedIn profile`}
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {member.twitter && (
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-[#1E68C6]"
                    aria-label={`${member.name}'s Twitter profile`}
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {member.website && (
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-[#1E68C6]"
                    aria-label={`${member.name}'s personal website`}
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
