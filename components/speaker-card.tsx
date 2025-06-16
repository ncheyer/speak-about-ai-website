import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Speaker } from "@/lib/speakers-data"
import { CalendarCheck, User } from "lucide-react"

interface SpeakerCardProps {
  speaker: Speaker
  priorityImage?: boolean
}

export function SpeakerCard({ speaker, priorityImage = false }: SpeakerCardProps) {
  const {
    name,
    title,
    image,
    imagePosition = "center",
    imageOffsetY = "0%",
    industries,
    slug,
    isBookable, // Assuming this flag determines "Book Now" vs "Check Availability"
    feeRange, // Or whatever determines the fee display
  } = speaker

  const profileLink = `/speakers/${slug}`
  const contactLink = `/contact?source=speaker_card&speakerName=${encodeURIComponent(name)}`

  const commonButtonClasses =
    "w-full text-xs sm:text-sm px-3 h-auto py-3 whitespace-normal rounded-md font-semibold transition-all duration-300 flex items-center justify-center gap-2"

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 border-0 bg-white">
      <Link href={profileLink} className="block group">
        <div className="relative w-full h-64 sm:h-72 overflow-hidden">
          <Image
            src={image || "/placeholder.svg?width=400&height=300&text=Speaker"}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
            style={{ objectPosition: imagePosition === "top" ? `center ${imageOffsetY}` : "center" }}
            priority={priorityImage}
          />
          {feeRange && (
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 bg-black/70 text-white backdrop-blur-sm text-xs px-2 py-1"
            >
              {feeRange}
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4 flex-grow">
        <Link href={profileLink} className="block">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-neue-haas leading-tight mb-1 hover:text-[#1E68C6] transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-xs sm:text-sm text-gray-600 font-montserrat mb-2 leading-snug">{title}</p>
        {industries && industries.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {industries.slice(0, 3).map((industry) => (
              <Badge
                key={industry}
                className="bg-blue-100 text-[#1E68C6] text-[10px] sm:text-xs px-1.5 py-0.5 font-medium"
              >
                {industry}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full flex flex-col space-y-3">
          <Button
            asChild
            variant="outline"
            className={`${commonButtonClasses} border-2 border-[#1E68C6] text-[#1E68C6] hover:bg-[#1E68C6] hover:text-white bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:border-[#1E68C6] font-semibold py-3 h-auto`}
            style={{
              boxShadow: "0 4px 8px rgba(30, 104, 198, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
            }}
          >
            <Link href={profileLink}>
              <User size={16} />
              <span>View Profile</span>
            </Link>
          </Button>
          <Button
            asChild
            className={`${commonButtonClasses} bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:via-amber-600 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-montserrat font-semibold py-3 h-auto`}
            style={{
              boxShadow:
                "0 6px 12px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <Link href={contactLink}>
              <CalendarCheck size={16} />
              <span>Inquire About Speaker</span>
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
