import { clientCookies, COOKIE_CONSENT_NAME, COOKIE_CONSENT_VERSION } from "./cookies"

export interface ConsentPreferences {
  [category: string]: boolean
}

export interface ConsentData {
  version: string
  timestamp: string
  preferences: ConsentPreferences
  userAgent: string
}

export class ConsentManager {
  private cookieName: string
  private version: string

  constructor() {
    this.cookieName = COOKIE_CONSENT_NAME
    this.version = COOKIE_CONSENT_VERSION
  }

  getConsent(): ConsentData | null {
    return clientCookies.get(this.cookieName)
  }

  saveConsent(preferences: ConsentPreferences): boolean {
    const consentData: ConsentData = {
      version: this.version,
      timestamp: new Date().toISOString(),
      preferences: preferences,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    }

    clientCookies.set(this.cookieName, consentData)
    this.dispatchConsentEvent(preferences)
    return true
  }

  hasValidConsent(): boolean {
    const consent = this.getConsent()
    if (!consent) return false

    // Check version compatibility
    if (consent.version !== this.version) return false

    // Check if consent is less than 12 months old (adjust as needed)
    const consentDate = new Date(consent.timestamp)
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1)

    return consentDate > twelveMonthsAgo
  }

  clearConsent(): void {
    clientCookies.delete(this.cookieName)
    this.dispatchConsentEvent({}) // Dispatch with empty preferences to signal reset
  }

  private dispatchConsentEvent(preferences: ConsentPreferences): void {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("consentChanged", {
        detail: { preferences },
      })
      window.dispatchEvent(event)
    }
  }
}
