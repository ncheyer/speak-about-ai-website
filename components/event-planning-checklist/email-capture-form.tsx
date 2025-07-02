"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, PartyPopper, AlertTriangle, Loader2 } from "lucide-react"
import type { LandingPageEventChecklist } from "@/types/contentful-checklist"

type EmailCaptureFormProps = Pick<LandingPageEventChecklist, "formFields" | "formSettings">

export function EmailCaptureForm({ formFields, formSettings }: EmailCaptureFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState("")

  const emailField = formFields.find((f) => f.fields.type === "email")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!emailField?.fields.required || (emailField.fields.required && email)) {
      setStatus("loading")
      setError("")
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // In a real app, you'd make an API call here.
      // For demo, we'll just succeed.
      setStatus("success")
    } else {
      setError("Email address is required.")
    }
  }

  if (status === "success") {
    return (
      <div className="text-center p-4 bg-green-500/10 rounded-lg">
        <PartyPopper className="h-12 w-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white">Success!</h3>
        <p className="mt-2 text-green-200">{formSettings.successMessage}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-white">Generate Your Checklist Now</h2>
      <div className="space-y-2">
        <Label htmlFor="email" className="sr-only">
          {emailField?.fields.label || "Email"}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder={emailField?.fields.placeholder || "your@email.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={emailField?.fields.required}
            className="pl-10 h-12 bg-white/20 text-white placeholder:text-gray-300 border-white/30 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
        {error && (
          <p className="text-sm text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> {error}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full h-12 text-lg font-bold bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 transform hover:scale-105"
        disabled={status === "loading"}
      >
        {status === "loading" ? <Loader2 className="h-6 w-6 animate-spin" /> : formSettings.submitButtonText}
      </Button>
      <p className="text-xs text-center text-gray-400">{formSettings.privacyText}</p>
    </form>
  )
}
