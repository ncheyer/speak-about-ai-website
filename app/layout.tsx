import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PipedriveChat from "@/components/pipedrive-chat"
import { ScrollToTopProvider } from "@/components/scroll-to-top-provider"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Speak About AI | Book Top AI Keynote Speakers 2025",
  description:
    "The world's only AI-exclusive speaker bureau. Book top artificial intelligence experts, machine learning pioneers, and tech visionaries for your next event.",
  keywords:
    "AI keynote speakers, book AI speakers, artificial intelligence speakers, AI conference speakers, machine learning speakers, tech keynote speakers",
  authors: [{ name: "Speak About AI" }],
  creator: "Speak About AI",
  publisher: "Speak About AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://speakabout.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Book Top AI Keynote Speakers 2025 | Speak About AI",
    description:
      "The world's only AI-exclusive speaker bureau. Book top artificial intelligence experts for your next event.",
    url: "https://speakabout.ai",
    siteName: "Speak About AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Speak About AI - Book Top AI Keynote Speakers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Top AI Keynote Speakers 2025 | Speak About AI",
    description:
      "The world's only AI-exclusive speaker bureau. Book top artificial intelligence experts for your next event.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/hero-image.png", sizes: "32x32", type: "image/png" },
      { url: "/hero-image.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/hero-image.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/hero-image.png",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <link rel="icon" href="/hero-image.png" sizes="any" />
        <link rel="icon" href="/hero-image.png" type="image/png" />
        <link rel="apple-touch-icon" href="/hero-image.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Speak About AI",
              description: "The world's only AI-exclusive speaker bureau",
              url: "https://speakabout.ai",
              logo: "https://speakabout.ai/hero-image.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-555-012-3456",
                contactType: "customer service",
                email: "booking@speakabout.ai",
              },
              sameAs: ["https://linkedin.com/company/speakaboutai", "https://twitter.com/speakaboutai"],
            }),
          }}
        />
      </head>
      <body className={montserrat.className}>
        <ScrollToTopProvider>
          <Header />
          {children}
          <Footer />
          <PipedriveChat />
        </ScrollToTopProvider>
      </body>
    </html>
  )
}
