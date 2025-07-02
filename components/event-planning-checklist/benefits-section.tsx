import { documentToReactComponents, type Options } from "@contentful/rich-text-react-renderer"
import { BLOCKS, INLINES } from "@contentful/rich-text-types"
import type { Document } from "@contentful/rich-text-types"

const renderOptions: Options = {
  renderNode: {
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6 text-center">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">{children}</h3>,
    [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc list-inside space-y-2 text-gray-700">{children}</ul>,
    [BLOCKS.PARAGRAPH]: (node, children) => <p className="text-lg text-gray-600 mb-4">{children}</p>,
    [INLINES.HYPERLINK]: (node, children) => (
      <a href={node.data.uri} className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
  },
}

export default function BenefitsSection({ content }: { content: Document }) {
  if (!content) return null

  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-4xl mx-auto">{documentToReactComponents(content, renderOptions)}</div>
      </div>
    </section>
  )
}
