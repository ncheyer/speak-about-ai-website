"use client"

import { useEffect } from "react"

export default function PipedriveChat() {
  useEffect(() => {
    // Set up Pipedrive LeadBooster configuration
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.pipedriveLeadboosterConfig = {
        base: "leadbooster-chat.pipedrive.com",
        companyId: 13689122,
        playbookUuid: "591113a1-96f5-4f8e-88ca-32b9bded9c26",
        version: 2,
      }

      // Initialize LeadBooster if it doesn't exist
      // @ts-ignore
      if (!window.LeadBooster) {
        // @ts-ignore
        window.LeadBooster = {
          q: [],
          on: function (n: string, h: Function) {
            this.q.push({ t: "o", n: n, h: h })
          },
          trigger: function (n: string) {
            this.q.push({ t: "t", n: n })
          },
        }
      }

      // Load the LeadBooster script
      const script = document.createElement("script")
      script.src = "https://leadbooster-chat.pipedrive.com/assets/loader.js"
      script.async = true
      script.onload = () => {
        console.log("Pipedrive LeadBooster loaded successfully")
      }
      script.onerror = () => {
        console.error("Failed to load Pipedrive LeadBooster")
      }

      document.body.appendChild(script)

      // Cleanup function
      return () => {
        try {
          document.body.removeChild(script)
        } catch (e) {
          // Script might already be removed
        }
      }
    }
  }, [])

  return null // This component doesn't render anything visible
}
