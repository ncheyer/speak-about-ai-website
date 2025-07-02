import { documentToReactComponents, type Options } from "@contentful/rich-text-react-renderer"
import { BLOCKS } from "@contentful/rich-text-types"
import type { Document } from "@contentful/rich-text-types"

interface SeoContentSectionProps {
  content: Document | undefined
}

const renderOptions: Options = {
  renderNode: {
    [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{children}</h2>,
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">{children}</h3>
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-4 text-gray-600">{children}</p>,
    [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
    [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
  },
}

export default function SeoContentSection({ content }: SeoContentSectionProps) {
  if (!content) {
    return null
  }

  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose max-w-none">
        {documentToReactComponents(content, renderOptions)}
      </div>
    </section>
  )
}
