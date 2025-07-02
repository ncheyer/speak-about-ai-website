import { documentToReactComponents, type Options } from "@contentful/rich-text-react-renderer"
import { BLOCKS, INLINES } from "@contentful/rich-text-types"
import type { LandingPageEventChecklist } from "@/types/contentful-checklist"

const richTextOptions: Options = {
  renderNode: {
    [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-2xl font-bold text-gray-800 mb-4">{children}</h2>,
    [BLOCKS.PARAGRAPH]: (node, children) => <p className="text-base text-gray-600 mb-4">{children}</p>,
    [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc list-inside space-y-2 mb-4 pl-4">{children}</ul>,
    [INLINES.HYPERLINK]: (node, children) => (
      <a href={node.data.uri} className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
  },
}

export function SeoContentSection({ content }: Pick<LandingPageEventChecklist, "seoContent">) {
  return (
    <section className="bg-gray-100 py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose">
        {documentToReactComponents(content, richTextOptions)}
      </div>
    </section>
  )
}
