import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Event Professionals AI Community | WhatsApp Group | Speak About AI",
  description: "Join our exclusive WhatsApp community for event professionals leveraging AI. Connect with fellow planners, share insights, and stay ahead of industry trends.",
}

// WhatsApp group invite link
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/DEQNj4kRGr9Awt5icF8oz1"

export default function EventProfessionalsWhatsAppPage() {
  // Redirect to the WhatsApp group
  redirect(WHATSAPP_GROUP_URL)
}
