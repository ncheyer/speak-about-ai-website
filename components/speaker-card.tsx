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
    "w-full text-xs sm:text-sm px-3 h-auto py-3 whitespace-normal rounded-md font-semibold transform transition-transform duration-150 ease-in-out active:translate-y-0.5 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] flex items-center justify-center gap-2"

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
            className={`${commonButtonClasses} bg-gradient-to-r from-amber-500 to-amber-600 text-white border-b-4 border-amber-700 active:border-b-0 hover:from-amber-600 hover:to-amber-700`}
          >
            <Link href={contactLink}>
              <CalendarCheck size={16} />
              <span>{isBookable ? "Book Now" : "Check Availability"}</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className={`${commonButtonClasses} bg-[#1E68C6] text-white hover:bg-[#1A5AAD] border-b-4 border-blue-700 active:border-b-0`}
          >
            <Link href={profileLink}>
              <User size={16} />
              <span>View Profile</span>
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
