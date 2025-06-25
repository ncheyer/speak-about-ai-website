"use client"

import { useState, useEffect, useCallback } from "react"
import { ConsentManager, type ConsentData, type ConsentPreferences } from "../lib/consent-manager"

export function useConsent() {
  const [consentManager] = useState(() => new ConsentManager())
  const [consent, setConsent] = useState<ConsentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const currentConsent = consentManager.getConsent()
      setConsent(currentConsent)
      setIsLoading(false)

      // Listen for consent changes
      const handleConsentChange = (event: Event) => {
        // Ensure event is CustomEvent and has detail property
        if (event instanceof CustomEvent && event.detail) {
          setConsent(consentManager.getConsent()) // Re-fetch consent to get full data
        }
      }

      window.addEventListener("consentChanged", handleConsentChange)
      return () => window.removeEventListener("consentChanged", handleConsentChange)
    }
  }, [consentManager])

  const updateConsent = useCallback(
    (preferences: ConsentPreferences) => {
      consentManager.saveConsent(preferences)
      // The event listener will update the state
    },
    [consentManager],
  )

  const clearConsent = useCallback(() => {
    consentManager.clearConsent()
    setConsent(null) // Immediately reflect change
  }, [consentManager])

  const hasValidConsent = useCallback((): boolean => {
    // Ensure this check can run even if consent state isn't updated yet
    // by directly calling consentManager method.
    return consentManager.hasValidConsent()
  }, [consentManager])

  const hasCategory = useCallback(
    (category: string): boolean => {
      return consent?.preferences?.[category] || false
    },
    [consent],
  )

  return {
    consent,
    isLoading,
    updateConsent,
    clearConsent,
    hasValidConsent,
    hasCategory,
  }
}
