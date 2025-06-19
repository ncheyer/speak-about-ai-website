import HealthcareKeynoteSpeakersClientPage from "./HealthcareKeynoteSpeakersClientPage"
import type { Metadata } from "next"
import type { स्पीकर } from "@/lib/speakers-data" // Assuming this type is available

// Dummy data for speakers - replace with actual data fetching
const healthcareSpeakers: स्पीकर[] = [
  {
    id: "1",
    name: "Dr. Emily Carter",
    slug: "dr-emily-carter",
    title: "Pioneer in AI-Driven Diagnostics",
    bio: "Dr. Carter is a leading voice in the integration of artificial intelligence in healthcare, focusing on improving diagnostic accuracy and patient outcomes. Her work has been pivotal in developing new AI tools for medical imaging.",
    imageUrl: "/placeholder.svg?width=400&height=400",
    tags: ["AI in Diagnostics", "Medical Imaging", "Healthcare Innovation"],
    speakingTopics: [
      "The Future of AI in Medical Diagnostics",
      "Ethical AI: Ensuring Patient Trust in Healthcare Tech",
      "Transforming Patient Care with Machine Learning",
    ],
    featured: true,
    socialMedia: {
      linkedin: "https://www.linkedin.com/in/dremilycarter",
      twitter: "https://twitter.com/dremilycarter",
    },
    location: "San Francisco, CA",
    languages: ["English"],
    feeRange: "$15,000 - $25,000",
  },
  {
    id: "2",
    name: "Dr. Ben Miller",
    slug: "dr-ben-miller",
    title: "Expert in AI for Personalized Medicine",
    bio: "Dr. Miller's research focuses on leveraging AI to create personalized treatment plans, revolutionizing how chronic diseases are managed. He is a sought-after speaker for his insights on the practical applications of AI in clinical settings.",
    imageUrl: "/placeholder.svg?width=400&height=400",
    tags: ["Personalized Medicine", "AI in Clinical Practice", "Healthcare Data Science"],
    speakingTopics: [
      "AI-Powered Personalized Medicine: The Next Frontier",
      "Data-Driven Healthcare: Using AI to Predict and Prevent Disease",
      "The Role of AI in Managing Chronic Conditions",
    ],
    featured: true,
    socialMedia: {
      linkedin: "https://www.linkedin.com/in/drbenmiller",
    },
    location: "Boston, MA",
    languages: ["English"],
    feeRange: "$10,000 - $20,000",
  },
  {
    id: "3",
    name: "Dr. Shafi Ahmed",
    slug: "dr-shafi-ahmed",
    title: "Global Surgeon, Futurist & Innovator",
    bio: "Dr. Ahmed is a multi-award-winning surgeon and a global advocate for accessible and affordable healthcare through technology. He is renowned for performing the world's first virtual reality surgery.",
    imageUrl: "/speakers/dr-shafi-ahmed-headshot.jpg",
    tags: ["Surgical Innovation", "Virtual Reality", "Medical Education"],
    speakingTopics: [
      "The Future of Surgery: AI, VR, and Robotics",
      "Democratizing Medical Education with Technology",
      "Innovation in Healthcare Delivery",
    ],
    featured: true,
    socialMedia: {
      linkedin: "https://www.linkedin.com/in/shafiahmed/",
      twitter: "https://twitter.com/ShafiAhmed5",
    },
    location: "London, UK",
    languages: ["English"],
    feeRange: "$20,000 - $30,000",
  },
]

export const metadata: Metadata = {
  title: "Top Healthcare Keynote Speakers | AI Experts for Medical Events",
  description:
    "Book leading healthcare keynote speakers specializing in AI, medical innovation, and digital health. Elevate your conference with insights from top AI in healthcare experts.",
  keywords:
    "healthcare keynote speakers, AI in healthcare speakers, medical AI experts, digital health speakers, healthcare innovation conference",
  openGraph: {
    title: "Top Healthcare Keynote Speakers | AI Experts for Medical Events",
    description:
      "Discover and book influential healthcare keynote speakers who are experts in artificial intelligence, medical technology, and the future of digital health.",
    images: [
      {
        url: "/og-image-healthcare.png",
        width: 1200,
        height: 630,
        alt: "Healthcare Keynote Speakers on AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Healthcare Keynote Speakers | AI Experts for Medical Events",
    description:
      "Find the perfect AI in healthcare keynote speaker for your event. Experts in medical innovation, digital health, and AI applications in medicine.",
    images: ["/og-image-healthcare.png"],
  },
}

export default function HealthcareKeynoteSpeakersPage() {
  const featuredSpeakers = healthcareSpeakers.filter((s) => s.featured)
  return <HealthcareKeynoteSpeakersClientPage initialSpeakers={featuredSpeakers} />
}
