import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PipedriveChat from "@/components/pipedrive-chat"
import { ScrollToTopProvider } from "@/components/scroll-to-top-provider"
import CookieConsentManager from "@/components/cookie-consent-manager" // CMP component
import { getServerConsent } from "@/lib/get-server-consent" // Server-side consent utility

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
        url: "/og-image.jpg", // Make sure you have this image in public/
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
    images: ["/og-image.jpg"], // Make sure you have this image in public/
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
      { url: "/hero-image.png", sizes: "32x32", type: "image/png" }, // Consider using favicon.png
      { url: "/hero-image.png", sizes: "16x16", type: "image/png" }, // Consider using favicon.png
    ],
    apple: [{ url: "/hero-image.png", sizes: "180x180", type: "image/png" }], // Consider using favicon.png
    shortcut: "/hero-image.png", // Consider using favicon.png
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const consent = getServerConsent()
  const hasAnalyticsConsent = consent?.preferences?.analytics || false
  const hasFunctionalConsent = consent?.preferences?.functional || false
  // You can add more consent checks here, e.g., for marketing
  // const hasMarketingConsent = consent?.preferences?.marketing || false;

  // IMPORTANT: Set these in your Vercel Environment Variables
  const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID // e.g., "AW-16583607648" or "G-XXXXXXXXXX"
  const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID // e.g., "6446085"

  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Speak About AI",
              description: "The world's only AI-exclusive speaker bureau",
              url: "https://www.speakabout.ai",
              logo: "https://www.speakabout.ai/speak-about-ai-logo.png", // Updated logo path
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-510-435-3947",
                contactType: "customer service",
                email: "human@speakabout.ai",
              },
              sameAs: ["https://linkedin.com/company/speakaboutai", "https://twitter.com/speakaboutai"],
            }),
          }}
        />

        {/* Conditionally load Google Tag Manager / Google Analytics */}
        {GTAG_ID && hasAnalyticsConsent && (
          <>
            <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`} />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GTAG_ID}');
                `,
              }}
            />
          </>
        )}

        {/* Conditionally load Hotjar */}
        {HOTJAR_ID && hasFunctionalConsent && (
          <Script
            id="hotjar-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `,
            }}
          />
        )}
      </head>
      <body className={montserrat.className}>
        <ScrollToTopProvider>
          <Header />
          {children}
          <Footer />
          {hasFunctionalConsent && <PipedriveChat />}
          <CookieConsentManager />
        </ScrollToTopProvider>
      </body>
    </html>
  )
}
