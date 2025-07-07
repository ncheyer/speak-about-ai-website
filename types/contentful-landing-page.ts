export interface LandingPage {
  pageTitle: string
  metaDescription: string
  urlSlug: string
  heroHeadline: string
  heroSubheadline?: any // Rich text content
  heroBulletPoints?: string[]
  heroImage?: {
    fields: {
      title: string
      file: {
        url: string
        details: {
          size: number
          image: {
            width: number
            height: number
          }
        }
        fileName: string
        contentType: string
      }
    }
  }
  formFields?: Array<{
    fields: {
      label: string
      type: string
      placeholder?: string
      required?: boolean
      options?: string[]
    }
  }>
  formSettings?: {
    submitButtonText?: string
    successMessage?: string
    redirectUrl?: string
  }
  howItWorksSteps?: Array<{
    fields: {
      title: string
      description?: any // Rich text content
      icon?: string
      order?: number
    }
  }>
  benefitsSection?: any // Rich text content
  faqSection?: Array<{
    fields: {
      question: string
      answer?: any // Rich text content
      order?: number
    }
  }>
  seoContent?: any // Rich text content (Below Fold SEO Content)
  schemaMarkup?: any // JSON object
  analyticsTracking?: any // JSON object
}
