import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
  icons: {
    icon: "/speak-about-ai-logo.png",
    apple: "/speak-about-ai-logo.png",
    shortcut: "/speak-about-ai-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/speak-about-ai-logo.png" sizes="any" />
        <link rel="icon" href="/speak-about-ai-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/speak-about-ai-logo.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
