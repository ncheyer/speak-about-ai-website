import { serverCookies, COOKIE_CONSENT_NAME, COOKIE_CONSENT_VERSION } from "./cookies"
import type { ConsentData } from "./consent-manager"

export function getServerConsent(): ConsentData | null {
  try {
    const consent = serverCookies.get(COOKIE_CONSENT_NAME) as ConsentData | null

    if (!consent || consent.version !== COOKIE_CONSENT_VERSION) {
      return null
    }

    // Check if consent is still valid (less than 12 months old)
    const consentDate = new Date(consent.timestamp)
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1)

    if (consentDate <= twelveMonthsAgo) {
      return null // Consent expired
    }

    return consent
  } catch (error) {
    console.error("Error reading server consent:", error)
    return null
  }
}
