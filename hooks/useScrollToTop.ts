"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function useScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash
    if (hash) {
      // If there's a hash, scroll to that element
      const element = document.querySelector(hash)
      if (element) {
        // Small delay to ensure the page has rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" })
        }, 100)
        return
      }
    }
    // Otherwise scroll to top
    window.scrollTo(0, 0)
  }, [pathname])
}
