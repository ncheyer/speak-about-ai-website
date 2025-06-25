"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useConsent } from "../hooks/use-consent"
import { COOKIE_CATEGORIES } from "../lib/cookie-categories"
import type { ConsentPreferences } from "../lib/consent-manager"
import { Button } from "@/components/ui/button" // Assuming you have a Button component
import { Switch } from "@/components/ui/switch" // Assuming you have a Switch component
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog" // Assuming Dialog components
import { ScrollArea } from "@/components/ui/scroll-area" // Assuming ScrollArea

export default function CookieConsentManager() {
  const { consent, isLoading, updateConsent, hasValidConsent } = useConsent()
  const [showBanner, setShowBanner] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>({})

  useEffect(() => {
    if (!isLoading) {
      const isValid = hasValidConsent()
      setShowBanner(!isValid)

      const currentPrefs = consent?.preferences || {}
      const defaultPrefs = Object.keys(COOKIE_CATEGORIES).reduce((acc, key) => {
        acc[key] = currentPrefs[key] ?? COOKIE_CATEGORIES[key].required // Use ?? for undefined or null
        return acc
      }, {} as ConsentPreferences)
      setPreferences(defaultPrefs)
    }
  }, [consent, isLoading, hasValidConsent])

  const handleAcceptAll = () => {
    const allAccepted = Object.keys(COOKIE_CATEGORIES).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as ConsentPreferences)

    updateConsent(allAccepted)
    setShowBanner(false)
    setShowModal(false)
  }

  const handleRejectAll = () => {
    const onlyRequired = Object.keys(COOKIE_CATEGORIES).reduce((acc, key) => {
      acc[key] = COOKIE_CATEGORIES[key].required
      return acc
    }, {} as ConsentPreferences)

    updateConsent(onlyRequired)
    setShowBanner(false)
    setShowModal(false)
  }

  const handleSavePreferences = () => {
    updateConsent(preferences)
    setShowBanner(false)
    setShowModal(false)
  }

  const handlePreferenceChange = (category: string, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  if (isLoading && typeof window !== "undefined") {
    // Only show loading on client
    return null
  }

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1 text-foreground">We Value Your Privacy</h3>
                <p className="text-muted-foreground text-sm">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our
                  traffic. By clicking "Accept All", you consent to our use of cookies. You can change your preferences
                  at any time.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                <Button onClick={handleAcceptAll} size="sm">
                  Accept All
                </Button>
                <Button onClick={handleRejectAll} variant="outline" size="sm">
                  Reject All
                </Button>
                <Button onClick={() => setShowModal(true)} variant="ghost" size="sm">
                  Manage Preferences
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preference Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl w-full max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 border-b">
            <DialogTitle className="text-xl">Cookie Preferences</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-6">
              {Object.entries(COOKIE_CATEGORIES).map(([key, category]) => (
                <div key={key} className="mb-6 last:mb-0 border rounded-lg">
                  <div className="p-4 bg-muted/50 flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{category.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 pt-1">
                      <Switch
                        id={`switch-${key}`}
                        checked={preferences[key] || false}
                        disabled={category.required}
                        onCheckedChange={(checked) => handlePreferenceChange(key, checked)}
                      />
                      <label
                        htmlFor={`switch-${key}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.required ? "Required" : preferences[key] ? "Enabled" : "Disabled"}
                      </label>
                    </div>
                  </div>

                  {category.cookies.length > 0 && (
                    <div className="p-4 border-t">
                      <h4 className="text-sm font-medium mb-2 text-foreground">Cookies Used:</h4>
                      <ul className="space-y-2">
                        {category.cookies.map((cookie, index) => (
                          <li key={index} className="text-xs text-muted-foreground">
                            <strong>{cookie.name}</strong> ({cookie.provider || "First-party"}) - Expires:{" "}
                            {cookie.expiry}
                            <p className="text-xs">{cookie.purpose}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 border-t gap-2 flex-col sm:flex-row">
            <Button onClick={handleSavePreferences} className="w-full sm:w-auto">
              Save Preferences
            </Button>
            <Button onClick={handleAcceptAll} variant="outline" className="w-full sm:w-auto">
              Accept All
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" className="w-full sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Privacy Settings Widget */}
      {!showBanner && !isLoading && (
        <Button
          onClick={() => setShowModal(true)}
          className="fixed bottom-4 right-4 p-3 h-auto rounded-full shadow-lg z-40"
          variant="outline"
          aria-label="Privacy Settings"
          title="Privacy Settings"
        >
          <CookieIcon className="h-5 w-5" />
        </Button>
      )}
    </>
  )
}

// Simple Cookie Icon for the widget
function CookieIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" />
      <path d="M16 15.5v.01" />
      <path d="M12 12v.01" />
      <path d="M15.5 16v.01" />
      <path d="M8.5 15.5v.01" />
    </svg>
  )
}
