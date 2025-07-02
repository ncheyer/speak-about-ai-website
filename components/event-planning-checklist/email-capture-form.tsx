"use client"

import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Entry } from "contentful"
import type { FormField as FormFieldType, LandingPage } from "@/types/contentful-landing-page"

type EmailFormData = {
  email: string
}

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

interface EmailCaptureFormProps {
  formFields: Entry<FormFieldType>[]
  formSettings: LandingPage["formSettings"]
}

export function EmailCaptureForm({ formFields, formSettings }: EmailCaptureFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const emailField = formFields.find((f) => f.fields.type === "email")

  const form = useForm<EmailFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit: SubmitHandler<EmailFormData> = async (data) => {
    // Here you would typically send the data to your backend/API
    console.log("Form submitted:", data)
    // For demonstration, we'll just show the success message
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="text-center p-4 bg-green-100 text-green-800 border border-green-200 rounded-lg">
        <p className="font-semibold">{formSettings.successMessage}</p>
      </div>
    )
  }

  if (!emailField) return null

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email" className="sr-only">
                {emailField.fields.label}
              </FormLabel>
              <FormControl>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder={emailField.fields.placeholder}
                    {...field}
                    className="flex-grow text-base p-6"
                    required={emailField.fields.required}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-bold text-base px-8 py-6"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Submitting..." : formSettings.submitButtonText}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-xs text-gray-500 text-center sm:text-left">{formSettings.privacyText}</p>
      </form>
    </Form>
  )
}
