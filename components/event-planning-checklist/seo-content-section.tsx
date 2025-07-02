import { documentToReactComponents, type Options } from "@contentful/rich-text-react-renderer"
import { BLOCKS, INLINES } from "@contentful/rich-text-types"
import type { Document } from "@contentful/rich-text-types"

const renderOptions: Options = {
  renderNode: {
    [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-2xl font-bold text-gray-800 mb-4">{children}</h2>,
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">{children}</h3>
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => <p className="text-gray-600 mb-4">{children}</p>,
    [INLINES.HYPERLINK]: (node, children) => (
      <a href={node.data.uri} className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
  },
}

export default function SeoContentSection({ content }: { content: Document }) {
  if (!content) return null

  return (
    <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose max-w-4xl mx-auto">{documentToReactComponents(content, renderOptions)}</div>
      </div>
    </section>
  )
}
