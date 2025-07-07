import type { Asset, Entry } from "contentful"
import type { Document } from "@contentful/rich-text-types"

// --- Sub-Types for Linked Entries ---

export interface FormField {
  label: string
  placeholder: string
  type: "email" | "text" | "textarea"
  required: boolean
}

export interface ProcessStep {
  title: string
  description: Document
  icon: string
}

export interface FaqItem {
  question: string
  answer: Document
}

// --- Main Landing Page Type ---

export interface LandingPage {
  // SEO & Metadata
  pageTitle: string
  metaDescription: string
  urlSlug: string
  schemaMarkup?: Record<string, any>
  analyticsTracking?: {
    head?: string
    bodyStart?: string
    bodyEnd?: string
  }

  // Hero Section
  heroHeadline: string
  heroSubheadline: Document
  heroBulletPoints?: string[]
  heroImage?: Asset

  // Form
  formFields?: Entry<FormField>[]
  formSettings?: {
    submitButtonText: string
    successMessage: string
    privacyText: string
  }

  // Page Content Sections
  howItWorksSteps?: Entry<ProcessStep>[]
  benefitsSection?: Document
  faqSection?: Entry<FaqItem>[]
  seoContent?: Document
}
