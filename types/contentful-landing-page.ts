import type { Asset, Entry, RichTextContent } from "contentful"
import type { Document } from "@contentful/rich-text-types"

// Basic linked entry types
export interface FormField {
  label: string
  placeholder: string
  type: "email" | "text" | "textarea"
  required: boolean
}

export interface ProcessStep {
  title: string
  description: string
  icon: string // Assuming icon is a string name from lucide-react
}

export interface FaqItem {
  question: string
  answer: RichTextContent
}

// Main landing page type
export interface LandingPage {
  pageTitle: string
  metaDescription: string
  slug: string
  heroHeadline: string
  heroSubheadline: Document
  heroBulletPoints: string[]
  heroImage: Asset
  formFields: Entry<FormField>[]
  formSettings: {
    submitButtonText: string
    successMessage: string
    privacyText: string
  }
  howItWorksSteps: Entry<ProcessStep>[]
  benefitsSection: Document
  faqSection: Entry<FaqItem>[]
  seoContent: Document
  schemaMarkup: Record<string, any>
}
