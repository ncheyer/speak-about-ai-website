"use client"

import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, Mail } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types – kept minimal so the component compiles even if the full   */
/*  Contentful types are not present.                                 */
/* ------------------------------------------------------------------ */
export interface MinimalFormSettings {
  submitButtonText: string
  successMessage: string
  privacyText: string
}

export interface EmailCaptureFormProps {
  /** Render-time settings coming from Contentful */
  formSettings: MinimalFormSettings
  /** Optional: placeholder text for the single e-mail field            */
  placeholder?: string
}

/* ------------------------------------------------------------------ */
/*  Validation schema                                                 */
/* ------------------------------------------------------------------ */
const schema = z.object({
  email: z.string().email({ message: "Please enter a valid e-mail address." }),
})

type FormValues = z.infer<typeof schema>

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export function EmailCaptureForm({ formSettings, placeholder = "you@example.com" }: EmailCaptureFormProps) {
  const [sent, setSent] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      /* -------------------------------------------------------------- */
      /*  TODO: replace this timeout with a real API call (Zapier,     */
      /*  HubSpot, etc.).                                              */
      /* -------------------------------------------------------------- */
      await new Promise((r) => setTimeout(r, 1200))
      console.info("Email captured:", values.email)
      setSent(true)
    } catch {
      form.setError("email", { message: "Something went wrong. Please try again." })
    }
  }

  if (sent)
    return (
      <div className="rounded-xl border border-green-300 bg-green-50 p-6 text-center">
        <p className="text-green-700">{formSettings.successMessage}</p>
      </div>
    )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">E-mail address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input type="email" placeholder={placeholder} {...field} className="pl-11 h-12 text-base" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="h-12 w-full bg-gradient-to-r from-blue-600 to-purple-700 text-lg font-semibold text-white hover:from-blue-700 hover:to-purple-800"
        >
          {form.formState.isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : formSettings.submitButtonText}
        </Button>

        <p className="text-center text-xs text-gray-500">{formSettings.privacyText}</p>
      </form>
    </Form>
  )
}

/* ------------------------------------------------------------------ */
/*  Default export so it works with                                   */
/*        import EmailCaptureForm from "…"                            */
/*  as well as                                                        */
/*        import { EmailCaptureForm } from "…"                        */
/* ------------------------------------------------------------------ */
export default EmailCaptureForm
