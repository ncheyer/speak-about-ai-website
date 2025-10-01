import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Event Vendor Directory | Find Trusted Event Vendors & Suppliers",
  description: "Browse our free event vendor directory to find trusted caterers, photographers, venues, entertainment, and more for your next event. Connect with verified event professionals and get transparent pricing.",
  keywords: "event vendor directory, event vendors, event suppliers, wedding vendors, corporate event vendors, party vendors, event planning directory, vendor listings, free vendor directory",
  openGraph: {
    title: "Free Event Vendor Directory - Find Trusted Event Vendors",
    description: "Connect with verified event vendors for catering, photography, venues, entertainment, and more. Free access to transparent pricing and direct vendor contact.",
    url: "https://speakabout.ai/vendor-directory",
    siteName: "Speak About AI",
    type: "website",
    images: [
      {
        url: "/images/vendor-directory-og.jpg",
        width: 1200,
        height: 630,
        alt: "Event Vendor Directory"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Event Vendor Directory | Verified Event Vendors",
    description: "Find trusted event vendors with transparent pricing. Free access to caterers, photographers, venues, entertainment & more.",
    images: ["/images/vendor-directory-og.jpg"]
  },
  alternates: {
    canonical: "https://speakabout.ai/vendor-directory"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1
    }
  }
}

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}