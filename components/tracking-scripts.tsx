"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

interface TrackingScriptsProps {
  trackingCodes?: {
    head?: string
    bodyStart?: string
    bodyEnd?: string
  }
}

export default function TrackingScripts({ trackingCodes }: TrackingScriptsProps) {
  const pathname = usePathname()

  useEffect(() => {
    // This effect can be used for client-side page view tracking if needed.
    // For example: window.gtag('event', 'page_view', { page_path: pathname });
  }, [pathname])

  return (
    <>
      {/* Umami Analytics */}
      <Script
        defer
        src="https://cloud.umami.is/script.js"
        data-website-id="e9883970-17ec-4067-a92a-a32cfe6a36d0"
        strategy="afterInteractive"
      />

      {/* Custom tracking codes if provided */}
      {trackingCodes?.head && (
        <Script id="tracking-head-script" strategy="afterInteractive">
          {trackingCodes.head}
        </Script>
      )}

      {/* Scripts for the start of <body> */}
      {trackingCodes?.bodyStart && (
        <Script id="tracking-body-start-script" strategy="beforeInteractive">
          {trackingCodes.bodyStart}
        </Script>
      )}

      {/* Scripts for the end of <body> */}
      {trackingCodes?.bodyEnd && (
        <Script id="tracking-body-end-script" strategy="lazyOnload">
          {trackingCodes.bodyEnd}
        </Script>
      )}
    </>
  )
}
