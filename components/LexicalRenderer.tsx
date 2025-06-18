// components/LexicalRenderer.tsx
import type React from "react"

interface LexicalNode {
  type: string
  children?: LexicalNode[]
  text?: string
  tag?: string // e.g., 'h1', 'h2', 'p'
  format?: string | number // For text formatting (bold, italic, etc.) - not fully handled here
  url?: string // For link nodes
  fields?: {
    // For Payload link fields
    url?: string
    linkType?: "internal" | "custom" // 'internal' for relative, 'custom' for absolute
    // newTab?: boolean; // If you have a newTab field
  }
  // Add other properties your Lexical nodes might have
  // e.g., listType for lists, style for inline styles, etc.
}

interface LexicalContent {
  root: {
    children: LexicalNode[]
    // Other root properties if any
  }
  // Other top-level properties if any
}

const renderLexicalNode = (node: LexicalNode, index: number): React.ReactNode => {
  // Handle text nodes
  if (node.type === "text" && typeof node.text === "string") {
    // Basic text formatting (can be expanded)
    const style: React.CSSProperties = {}
    if (typeof node.format === "number") {
      if (node.format & 1) style.fontWeight = "bold" // Bold
      if (node.format & 2) style.fontStyle = "italic" // Italic
      if (node.format & 8) style.textDecoration = "underline" // Underline
    }
    return (
      <span key={index} style={style}>
        {node.text}
      </span>
    )
  }

  // Handle paragraph nodes
  if (node.type === "paragraph") {
    // Skip empty paragraphs
    if (!node.children || node.children.every((child) => child.type === "text" && !child.text?.trim())) {
      return null
    }
    return (
      <p key={index} className="mb-4">
        {node.children?.map((child, childIndex) => renderLexicalNode(child, childIndex))}
      </p>
    )
  }

  // Handle heading nodes
  if (node.type === "heading" && node.tag && ["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tag)) {
    const HeadingTag = node.tag as keyof JSX.IntrinsicElements
    let className = "font-bold mb-4 mt-6"
    if (node.tag === "h1") className += " text-3xl"
    if (node.tag === "h2") className += " text-2xl"
    if (node.tag === "h3") className += " text-xl"
    // Add more specific styling as needed
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
    return (
      <a
        key={index}
        href={node.url}
        className="text-blue-600 hover:text-blue-800 underline"
        // Add target/rel if you can determine if it's external from node.url
      >
        {node.children?.map((child, childIndex) => renderLexicalNode(child, childIndex))}
      </a>
    )
  }

  // Handle list nodes (example for unordered lists)
  if (node.type === "list" && node.tag === "ul") {
    return (
      <ul key={index} className="list-disc pl-5 mb-4">
        {node.children?.map(
          (child, childIndex) => renderLexicalNode(child, childIndex), // Expecting listitem nodes
        )}
      </ul>
    )
  }
  if (node.type === "list" && node.tag === "ol") {
    return (
      <ol key={index} className="list-decimal pl-5 mb-4">
        {node.children?.map(
          (child, childIndex) => renderLexicalNode(child, childIndex), // Expecting listitem nodes
        )}
      </ol>
    )
  }

  // Handle list item nodes
  if (node.type === "listitem") {
    return <li key={index}>{node.children?.map((child, childIndex) => renderLexicalNode(child, childIndex))}</li>
  }

  // Handle blockquote nodes
  if (node.type === "quote") {
    return (
      <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-4">
        {node.children?.map((child, childIndex) => renderLexicalNode(child, childIndex))}
      </blockquote>
    )
  }

  // Fallback for unknown node types or nodes without children that aren't text
  // console.warn("Unsupported Lexical node type or structure:", node);
  return null
}

interface LexicalRendererProps {
  content: LexicalContent | string | undefined | null
}

export const LexicalRenderer: React.FC<LexicalRendererProps> = ({ content }) => {
  // Handle if content is already a string (HTML) - useful for fallbacks or mixed content
  if (typeof content === "string") {
    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
  }

  // Handle Lexical JSON structure
  if (
    content &&
    typeof content === "object" &&
    "root" in content &&
    content.root &&
    Array.isArray(content.root.children)
  ) {
    const renderedNodes = content.root.children.map((node, index) => renderLexicalNode(node, index)).filter(Boolean) // Filter out nulls (e.g., empty paragraphs)

    if (renderedNodes.length === 0) {
      return <p>Content is empty or not renderable.</p>
    }

    return <div className="prose max-w-none">{renderedNodes}</div>
  }

  // Fallback for undefined, null, or unexpected content structure
  // console.warn("LexicalRenderer received invalid content:", content);
  return <p>No content available or content is in an unexpected format.</p>
}

export default LexicalRenderer
