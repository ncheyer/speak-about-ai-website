import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Event Professional WhatsApp Community",
  description:
    "Join exclusive event professional networking groups for AI innovation. Connect with 200+ event planners, venue managers, and industry experts in our WhatsApp community.",
  keywords:
    "event professional networking groups, event planner networking, event industry networking, AI for events, event professional community, WhatsApp networking groups, event planners group, venue manager network, event industry AI",
  openGraph: {
    title: "Event Professional Networking Groups for AI Innovation",
    description:
      "Join 200+ event professionals in WhatsApp networking groups focused on AI tools and technology for the events industry.",
    type: "website",
    url: "https://speakabout.ai/event-professionals-whatsapp",
    images: [
      {
        url: "https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/IMG_9585.jpg",
        width: 1200,
        height: 630,
        alt: "Event Professional Networking Groups - AI WhatsApp Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Professional Networking Groups for AI Innovation",
    description:
      "Join 200+ event professionals in WhatsApp networking groups focused on AI tools.",
    images: ["https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/IMG_9585.jpg"],
  },
  alternates: {
    canonical: "https://speakabout.ai/event-professionals-whatsapp",
  },
}

export default function EventProfessionalsWhatsAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
