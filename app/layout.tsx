import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PipedriveChat from "@/components/pipedrive-chat"
import { ScrollToTopProvider } from "@/components/scroll-to-top-provider"
import Script from "next/script"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Book AI Keynote Speakers | Speak About AI",
  description:
    "Book top AI keynote speakers & tech visionaries with Speak About AI, the world's only AI-exclusive speaker bureau. Find experts for your event.",
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
  metadataBase: new URL("https://www.speakabout.ai"),
  openGraph: {
    title: "Book AI Keynote Speakers | Speak About AI",
    description:
      "Book top AI keynote speakers & tech visionaries with Speak About AI, the AI-exclusive bureau. Find experts for your event.",
    url: "https://www.speakabout.ai",
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
    title: "Book AI Keynote Speakers | Speak About AI",
    description:
      "Book top AI keynote speakers & tech visionaries with Speak About AI, the AI-exclusive bureau. Find experts for your event.",
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
      { url: "/speak-about-ai-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/speak-about-ai-logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/speak-about-ai-logo.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/speak-about-ai-logo.png",
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
        <link rel="icon" href="/speak-about-ai-logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/speak-about-ai-logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Speak About AI",
              description: "The world's only AI-exclusive speaker bureau",
              url: "https://www.speakabout.ai",
              logo: "https://www.speakabout.ai/speak-about-ai-logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-415-860-1799",
                contactType: "customer service",
                email: "booking@speakabout.ai",
              },
              sameAs: ["https://linkedin.com/company/speakaboutai", "https://twitter.com/speakaboutai"],
            }),
          }}
        />
        <script
          id="hotjar-init"
          dangerouslySetInnerHTML={{
            __html: `
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:6446085,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `,
          }}
        />
      </head>
      <body className={montserrat.className}>
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=AW-16583607648" />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-16583607648');
      `,
          }}
        />
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
