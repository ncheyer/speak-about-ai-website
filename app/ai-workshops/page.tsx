import type { Metadata } from "next"
import WorkshopDirectory from "@/components/workshop-directory"

// Revalidate workshops listing every 60 seconds
export const revalidate = 60

export const metadata: Metadata = {
  title: "AI Workshops | Immersive Training Programs | Speak About AI",
  description:
    "Discover hands-on AI workshops led by industry experts. Interactive training programs covering machine learning, generative AI, and practical implementation strategies for your team.",
  keywords:
    "AI workshops, machine learning training, AI corporate training, hands-on AI courses, generative AI workshops, AI implementation training",
  openGraph: {
    title: "AI Workshops | Speak About AI",
    description:
      "Transform your team with immersive AI workshops led by industry pioneers. Practical, hands-on training programs tailored to your organization.",
    images: [
      {
        url: "/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Workshops",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Workshops | Speak About AI",
    description:
      "Transform your team with immersive AI workshops led by industry pioneers.",
    images: ["/hero-image.jpg"],
  },
  alternates: {
    canonical: "https://speakabout.ai/ai-workshops",
  },
}

export default function WorkshopsPage() {
  return <WorkshopDirectory />
}
