import { documentToReactComponents, type Options } from "@contentful/rich-text-react-renderer"
import { BLOCKS } from "@contentful/rich-text-types"
import { CheckCircle } from "lucide-react"
import type { Document } from "@contentful/rich-text-types"

interface BenefitsSectionProps {
  content: Document | undefined
}

const renderOptions: Options = {
  renderNode: {
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl text-center mb-12">{children}</h2>
    ),
    [BLOCKS.UL_LIST]: (node, children) => <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">{children}</div>,
    [BLOCKS.LIST_ITEM]: (node, children) => (
      <div className="flex items-start">
        <CheckCircle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-1" />
        <span className="text-gray-700">{children}</span>
      </div>
    ),
  },
}

export default function BenefitsSection({ content }: BenefitsSectionProps) {
  if (!content) {
    return null
  }

  return (
    <section className="bg-blue-50 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">{documentToReactComponents(content, renderOptions)}</div>
    </section>
  )
}
