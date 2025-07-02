import { documentToReactComponents, type Options } from "@contentful/rich-text-react-renderer"
import { BLOCKS, INLINES } from "@contentful/rich-text-types"
import type { LandingPageEventChecklist } from "@/types/contentful-checklist"

const richTextOptions: Options = {
  renderNode: {
    [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-3xl font-bold text-gray-900 mb-4">{children}</h2>,
    [BLOCKS.PARAGRAPH]: (node, children) => <p className="text-lg text-gray-700 mb-4">{children}</p>,
    [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc list-inside space-y-2 mb-4 pl-4">{children}</ul>,
    [INLINES.HYPERLINK]: (node, children) => (
      <a href={node.data.uri} className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
  },
}

export function BenefitsSection({ content }: Pick<LandingPageEventChecklist, "benefitsSection">) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose lg:prose-xl">
        {documentToReactComponents(content, richTextOptions)}
      </div>
    </section>
  )
}
