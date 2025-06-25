"use server"

interface FormData {
  name: string
  email: string
  phone: string
  organizationName: string
  specificSpeaker: string
  eventDate: string
  eventLocation: string
  eventBudget: string
  additionalInfo: string
  newsletterOptOut: boolean
}

interface SubmissionData extends FormData {
  wantsNewsletter: boolean
  submittedAt: string
  source: string
}

export async function submitContactForm(formData: FormData): Promise<{ success: boolean; message: string }> {
  console.log("Server Action: submitContactForm called with formData:", formData)

  const wantsNewsletter = !formData.newsletterOptOut

  const submissionData: SubmissionData = {
    ...formData,
    wantsNewsletter,
    submittedAt: new Date().toISOString(),
    source: "contact-2-single-step-form-v3-opt-out-server-action", // Updated source
  }

  try {
    const zapierWebhookUrl = "https://hooks.zapier.com/hooks/catch/23536588/ubtw516/"
    console.log("Server Action: Sending data to Zapier:", submissionData)

    const response = await fetch(zapierWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    })

    console.log("Server Action: Zapier response status:", response.status)
    const responseBody = await response.text()
    console.log("Server Action: Zapier response body:", responseBody)

    if (response.ok) {
      console.log("Server Action: Successfully submitted to Zapier.")
      return { success: true, message: "Form submitted successfully!" }
    } else {
      console.error("Server Action: Zapier submission failed. Status:", response.status, "Response Body:", responseBody)
      return {
        success: false,
        message: `Failed to submit to Zapier. Status: ${response.status}`,
      }
    }
  } catch (error: any) {
    console.error("Server Action: Error submitting form to Zapier:", {
      errorMessage: error.message,
      errorStack: error.stack,
      errorObject: error,
    })
    return {
      success: false,
      message: "An unexpected error occurred on the server.",
    }
  }
}
