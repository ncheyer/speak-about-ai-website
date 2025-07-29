import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import TrackingScripts from "@/components/tracking-scripts"
import PipedriveChat from "@/components/pipedrive-chat"
import { ScrollToTopProvider } from "@/components/scroll-to-top-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Speak About AI - Premier AI Keynote Speakers Bureau",
    template: "%s | Speak About AI",
  },
  description:
    "Book world-class AI keynote speakers for your next event. Our expert speakers include AI pioneers, researchers, and industry leaders who deliver engaging presentations on artificial intelligence, machine learning, and the future of technology.",
  keywords: [
    "AI speakers",
    "keynote speakers",
    "artificial intelligence",
    "machine learning",
    "technology speakers",
    "AI experts",
    "conference speakers",
  ],
  authors: [{ name: "Speak About AI" }],
  creator: "Speak About AI",
  publisher: "Speak About AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://speakaboutai.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://speakaboutai.com",
    siteName: "Speak About AI",
    title: "Speak About AI - Premier AI Keynote Speakers Bureau",
    description:
      "Book world-class AI keynote speakers for your next event. Our expert speakers include AI pioneers, researchers, and industry leaders.",
    images: [
      {
        url: "/new-ai-logo.png",
        width: 1200,
        height: 630,
        alt: "Speak About AI Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Speak About AI - Premier AI Keynote Speakers Bureau",
    description:
      "Book world-class AI keynote speakers for your next event. Our expert speakers include AI pioneers, researchers, and industry leaders.",
    images: ["/new-ai-logo.png"],
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
      { url: "/new-ai-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/new-ai-logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/new-ai-logo.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/new-ai-logo.png",
  },
  manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/new-ai-logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/new-ai-logo.png" />
        <TrackingScripts />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <ScrollToTopProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <PipedriveChat />
          </ScrollToTopProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
