// components/LexicalRenderer.tsx
import type React from "react"
import NextImage from "next/image"
import { getImageUrl } from "@/lib/utils"

interface LexicalNode {
  type: string
  children?: LexicalNode[]
  text?: string
  tag?: string
  format?: string | number
  url?: string
  fields?: {
    url?: string
    linkType?: "internal" | "custom"
  }
  value?: {
    id: string
    url?: string
    filename?: string
    mimeType?: string
    filesize?: number
    width?: number // Expected to be a number
    height?: number // Expected to be a number
    alt?: string
  }
  relationTo?: string
  src?: string
  altText?: string
  width?: string | number
  height?: string | number
  source?: string
  frameBorder?: string | number
  allowFullScreen?: boolean
}

interface LexicalContent {
  root: {
    children: LexicalNode[]
  }
}

const renderLexicalNode = (node: LexicalNode, index: number): React.ReactNode => {
  // console.log("Rendering node:", node.type, node); // Temporary debug log

  // ... (other node handlers: text, paragraph, heading, link, image, list, quote remain the same) ...
  // Handle text nodes
  if (node.type === "text" && typeof node.text === "string") {
    const style: React.CSSProperties = {}
    if (typeof node.format === "number") {
      if (node.format & 1) style.fontWeight = "bold"
      if (node.format & 2) style.fontStyle = "italic"
      if (node.format & 8) style.textDecoration = "underline"
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
    // Check if paragraph only contains an iframe, if so, don't wrap with <p>
    if (node.children?.length === 1 && node.children[0].type === "iframe") {
      return renderLexicalNode(node.children[0], 0)
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
  // Handle generic link nodes
  if (node.type === "link" && node.url) {
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

  // Handle image nodes - OPTIMIZED VERSION
  if (node.type === "upload" && node.relationTo === "media" && node.value) {
    const rawImageUrl = node.value.url
    const imageUrl = getImageUrl(rawImageUrl)
    const imageAlt = node.value.alt || "Blog image"
    const imageWidth = typeof node.value.width === "number" ? node.value.width : undefined
    const imageHeight = typeof node.value.height === "number" ? node.value.height : undefined

    if (!imageUrl) return null

    if (imageWidth && imageHeight) {
      return (
        <div
          key={index}
          className="my-6 dynamic-image-container" // Class for CSS styling
          style={
            {
              // Set CSS variable for the max-width logic in global CSS
              "--original-width": `${imageWidth}px`,
            } as React.CSSProperties
          } // Type assertion for CSS custom properties
        >
          <NextImage
            src={imageUrl}
            alt={imageAlt}
            width={imageWidth} // Intrinsic width of the image
            height={imageHeight} // Intrinsic height of the image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px" // Responsive sizing hints
            priority={index < 2} // Prioritize loading for the first two images
            className="w-full h-auto rounded-lg shadow-md object-contain" // Styling for the image itself
          />
        </div>
      )
    } else {
      // Fallback for images without width/height (uses regular <img> tag)
      // This part remains, as NextImage requires width and height.
      return (
        <div key={index} className="my-6 text-center">
          {" "}
          {/* Added text-center for mx-auto effect */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={imageAlt}
            className="max-w-full h-auto rounded-lg shadow-md inline-block" // inline-block for centering with text-center
            style={{ maxWidth: "800px" }} // Cap width for non-NextImage fallback
            loading="lazy"
          />
        </div>
      )
    }
  }

  // Handle iframe nodes (e.g., YouTube embeds)
  if (node.type === "iframe") {
    const iframeSrc = node.src || node.url || node.source // Check common properties for src
    if (!iframeSrc) {
      // console.warn("iframe node is missing src/url/source:", node);
      return null
    }

    // Basic validation for YouTube embed URLs
    let finalSrc = iframeSrc
    if (iframeSrc.includes("youtube.com/watch?v=")) {
      finalSrc = iframeSrc.replace("watch?v=", "embed/")
    } else if (iframeSrc.includes("youtu.be/")) {
      finalSrc = iframeSrc.replace("youtu.be/", "www.youtube.com/embed/")
    }
    // Add more transformations if needed for other video platforms

    // Ensure src is for embedding
    if (!finalSrc.includes("/embed/")) {
      // console.warn("iframe src does not look like an embed URL:", finalSrc);
      // Optionally, try to construct an embed URL if it's a direct video page
    }

    const aspectRatio = "16/9" // Default to 16:9, common for videos
    const width = typeof node.width === "string" ? node.width : "100%" // Default to 100% width
    // Height is often controlled by aspect ratio for responsive embeds

    return (
      <div
        key={index}
        className="my-6 relative w-full overflow-hidden rounded-lg shadow-md"
        style={{ paddingBottom: `calc(100% / (${aspectRatio}))` }} // Aspect ratio padding trick
      >
        <iframe
          src={finalSrc}
          width={width}
          // height is controlled by aspect ratio wrapper
          className="absolute top-0 left-0 w-full h-full"
          frameBorder={node.frameBorder || "0"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={node.allowFullScreen !== undefined ? node.allowFullScreen : true}
          title={node.altText || "Embedded content"} // Use altText or a generic title
        />
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

  return null
}

interface LexicalRendererProps {
  content: LexicalContent | string | undefined | null
}

export const LexicalRenderer: React.FC<LexicalRendererProps> = ({ content }) => {
  // ... (existing logic for string content and root object handling remains the same) ...
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
