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
      image: "/team/robert-strong-headshot.png",
      bio: "Speak About AI was founded by author, speaker, and entertainer Robert Strong and is a division of Strong Entertainment, LLC. With 30+ years of experience booking speakers and entertainers globally, Robert brings unparalleled expertise to the AI speaking circuit. He's also a world-renowned magician who's performed at the White House twice, on Penn & Teller Fool Us, and for every major tech company in Silicon Valley. His Amazon best-selling book 'Amaze & Delight: Secrets to Creating Magic in Business' showcases his unique approach to business entertainment.",
      linkedin: "https://linkedin.com/in/robertstrong",
    },
    {
      name: "Noah Cheyer",
      title: "Head of Marketing & Operations",
      image: "/team/noah-cheyer-headshot.png",
      bio: "Noah Cheyer is a co-founder and leads marketing and operations at Speak About AI. Since it's founding, Noah has had the chance to work with clients ranging from Fortune 100 to 150,000 person international conferences and provincial governments. Previously, he's worked in a wide range of industries including e-commerce, sports, and technology and graduated from Chapman University with a BA in Communication and Entrepreneurship. Having grown up alongside AI as the son of Siri Co-Founder Adam Cheyer, he's had a front-row seat to watching the current climate develop.",
      linkedin: "https://linkedin.com/in/noah-cheyer",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1E68C6]/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-neue-haas">Leadership</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-montserrat">
            Meet the people behind our mission to connect organizations with world-class AI speakers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-[#1E68C6]/30 relative overflow-hidden"
            >
              {/* Card accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1E68C6] to-blue-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

              <div className="flex flex-col items-center">
                {/* Image with ring effect */}
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#1E68C6] to-blue-400 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                  <div className="relative w-48 h-48 rounded-full overflow-hidden ring-4 ring-gray-100 group-hover:ring-[#1E68C6]/30 transition-all duration-300">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 192px"
                      priority
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-1 font-neue-haas text-center group-hover:text-[#1E68C6] transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-[#1E68C6] font-semibold mb-4 font-montserrat text-center text-sm uppercase tracking-wide">
                  {member.title}
                </p>
                <p className="text-gray-600 text-center mb-6 font-montserrat leading-relaxed text-sm">
                  {member.bio}
                </p>

                {/* Social links with better styling */}
                <div className="flex space-x-3 mt-auto">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-[#1E68C6] hover:text-white transition-all duration-300"
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
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-[#1E68C6] hover:text-white transition-all duration-300"
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
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-[#1E68C6] hover:text-white transition-all duration-300"
                      aria-label={`${member.name}'s personal website`}
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
