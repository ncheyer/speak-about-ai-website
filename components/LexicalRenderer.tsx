// components/LexicalRenderer.tsx
import type React from "react"
import NextImage from "next/image" // Import Next.js Image component

interface LexicalNode {
  type: string
  children?: LexicalNode[]
  text?: string
  tag?: string // e.g., 'h1', 'h2', 'p'
  format?: string | number // For text formatting (bold, italic, etc.)
  url?: string // For link nodes
  fields?: {
    // For Payload link fields
    url?: string
    linkType?: "internal" | "custom"
  }
  // Image node properties from Payload's 'upload' field type
  value?: {
    id: string
    url?: string // URL of the image
    filename?: string
    mimeType?: string
    filesize?: number
    width?: number
    height?: number
    alt?: string // Alt text from Payload media library
    // You might have other custom fields in your 'upload' collection
  }
  relationTo?: string // Should be your media collection slug, e.g., 'media'
  // Direct image properties (less common for Payload uploads but good for generic image nodes)
  src?: string
  altText?: string // Payload often uses altText for direct image nodes if not from 'upload'
  width?: number
  height?: number
}

interface LexicalContent {
  root: {
    children: LexicalNode[]
  }
}

const renderLexicalNode = (node: LexicalNode, index: number): React.ReactNode => {
  // console.log("Rendering node:", node.type, node); // Temporary debug log

  // Handle text nodes
  if (node.type === "text" && typeof node.text === "string") {
    const style: React.CSSProperties = {}
    if (typeof node.format === "number") {
      if (node.format & 1) style.fontWeight = "bold"
      if (node.format & 2) style.fontStyle = "italic"
      if (node.format & 8) style.textDecoration = "underline"
      // Add more formats like strikethrough, code, etc. if needed
    }
    return (
      <span key={index} style={style}>
        {node.text}
      </span>
    )
  }

  // Handle paragraph nodes
  if (node.type === "paragraph") {
    if (!node.children || node.children.every((child) => child.type === "text" && !child.text?.trim())) {
      return null
    }
    return (
      <p key={index} className="mb-4 leading-relaxed">
        {node.children?.map((child, childIndex) => renderLexicalNode(child, childIndex))}
      </p>
    )
  }

  // Handle heading nodes
  if (node.type === "heading" && node.tag && ["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tag)) {
    const HeadingTag = node.tag as keyof JSX.IntrinsicElements
    let className = "font-bold mb-3 mt-5"
    if (node.tag === "h1") className += " text-3xl md:text-4xl"
    if (node.tag === "h2") className += " text-2xl md:text-3xl"
    if (node.tag === "h3") className += " text-xl md:text-2xl"
    if (node.tag === "h4") className += " text-lg md:text-xl"
    return (
      <HeadingTag key={index} className={className}>
        {node.children?.map((child, childIndex) => renderLexicalNode(child, childIndex))}
      </HeadingTag>
    )
  }

  // Handle link nodes (Payload specific structure)
  if (node.type === "link" && node.fields) {
    const url = node.fields.url || "#"
    const isExternal = node.fields.linkType === "custom"
    return (
      <a
        key={index}
        href={url}
        className="text-blue-600 hover:text-blue-800 underline"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {node.children?.map((child, childIndex) => renderLexicalNode(child, childIndex))}
      </a>
    )
  }
  // Handle generic link nodes (if not using Payload's specific 'fields' structure)
  if (node.type === "link" && node.url) {
    // A simple heuristic to check if a URL is external
    const isExternal = /^(https?:|mailto:|tel:)/.test(node.url)
    return (
      <a
        key={index}
        href={node.url}
        className="text-blue-600 hover:text-blue-800 underline"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {node.children?.map((child, childIndex) => renderLexicalNode(child, childIndex))}
      </a>
    )
  }

  // Handle image nodes (typically 'upload' type from Payload)
  if (node.type === "upload" && node.relationTo === "media" && node.value) {
    // Assuming 'media' is your Payload media collection slug
    const imageUrl = node.value.url
    const imageAlt = node.value.alt || "Blog image" // Use alt text from Payload media
    const imageWidth = node.value.width
    const imageHeight = node.value.height

    if (!imageUrl) return null

    // Use Next.js Image component for optimization
    return (
      <div key={index} className="my-6 relative">
        {imageWidth && imageHeight ? (
          <NextImage
            src={imageUrl || "/placeholder.svg"}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            className="max-w-full h-auto rounded-lg shadow-md object-contain"
            // Consider adding sizes prop for responsiveness if layout is complex
          />
        ) : (
          // Fallback for images without width/height (less optimal)
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={imageAlt}
            className="max-w-full h-auto rounded-lg shadow-md"
            loading="lazy"
          />
        )}
      </div>
    )
  }

  // Handle list nodes
  if (node.type === "list" && (node.tag === "ul" || node.tag === "ol")) {
    const ListTag = node.tag as keyof JSX.IntrinsicElements
    const listStyle = node.tag === "ul" ? "list-disc" : "list-decimal"
    return (
      <ListTag key={index} className={`${listStyle} pl-6 mb-4 space-y-1`}>
        {node.children?.map((child, childIndex) => renderLexicalNode(child, childIndex))}
      </ListTag>
    )
  }

  // Handle list item nodes
  if (node.type === "listitem") {
    return <li key={index}>{node.children?.map((child, childIndex) => renderLexicalNode(child, childIndex))}</li>
  }

  // Handle blockquote nodes
  if (node.type === "quote") {
    return (
      <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-4 py-2 text-gray-700">
        {node.children?.map((child, childIndex) => renderLexicalNode(child, childIndex))}
      </blockquote>
    )
  }

  // Fallback for unknown node types
  return null
}

interface LexicalRendererProps {
  content: LexicalContent | string | undefined | null
}

export const LexicalRenderer: React.FC<LexicalRendererProps> = ({ content }) => {
  if (typeof content === "string") {
    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
  }

  if (
    content &&
    typeof content === "object" &&
    "root" in content &&
    content.root &&
    Array.isArray(content.root.children)
  ) {
    const renderedNodes = content.root.children.map((node, index) => renderLexicalNode(node, index)).filter(Boolean)

    if (renderedNodes.length === 0) {
      return <p className="text-gray-500">Content is empty or not renderable.</p>
    }
    return <div className="prose max-w-none">{renderedNodes}</div>
  }

  return <p className="text-gray-500">No content available or content is in an unexpected format.</p>
}

export default LexicalRenderer
