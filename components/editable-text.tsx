"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div"
  multiline?: boolean
  placeholder?: string
  isModified?: boolean
  editorMode?: boolean
}

export function EditableText({
  value,
  onChange,
  className,
  as: Component = "span",
  multiline = false,
  placeholder = "Click to edit...",
  isModified = false,
  editorMode = true
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleBlur = () => {
    setIsEditing(false)
    if (localValue !== value) {
      onChange(localValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setLocalValue(value)
      setIsEditing(false)
    }
    if (e.key === "Enter" && !multiline) {
      handleBlur()
    }
  }

  if (!editorMode) {
    return <Component className={className}>{value || placeholder}</Component>
  }

  if (isEditing) {
    const inputClasses = cn(
      "w-full bg-white border-2 border-blue-500 rounded px-2 py-1 outline-none shadow-lg",
      "text-inherit font-inherit",
      className
    )

    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(inputClasses, "min-h-[100px] resize-y")}
          placeholder={placeholder}
        />
      )
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={inputClasses}
        placeholder={placeholder}
      />
    )
  }

  return (
    <Component
      onClick={() => setIsEditing(true)}
      className={cn(
        className,
        "cursor-pointer transition-all duration-150",
        "hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2 hover:bg-blue-50/50",
        isModified && "outline outline-2 outline-amber-400 outline-offset-1 bg-amber-50/30",
        !value && "text-gray-400 italic"
      )}
      title="Click to edit"
    >
      {value || placeholder}
    </Component>
  )
}

// For editing images
interface EditableImageProps {
  src: string
  alt: string
  onChange: (src: string) => void
  onAltChange?: (alt: string) => void
  className?: string
  isModified?: boolean
  editorMode?: boolean
}

export function EditableImage({
  src,
  alt,
  onChange,
  onAltChange,
  className,
  isModified = false,
  editorMode = true
}: EditableImageProps) {
  const [showEditor, setShowEditor] = useState(false)
  const [localSrc, setLocalSrc] = useState(src)
  const [localAlt, setLocalAlt] = useState(alt)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLocalSrc(src)
    setLocalAlt(alt)
  }, [src, alt])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'uploads/website')

    try {
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      })
      const result = await response.json()
      if (result.success) {
        setLocalSrc(result.path)
        onChange(result.path)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  if (!editorMode) {
    return <img src={src} alt={alt} className={className} />
  }

  return (
    <div className="relative group">
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={cn(
          className,
          "cursor-pointer transition-all duration-150",
          "group-hover:outline group-hover:outline-2 group-hover:outline-blue-400 group-hover:outline-offset-2",
          isModified && "outline outline-2 outline-amber-400 outline-offset-1"
        )}
        onClick={() => setShowEditor(true)}
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <span className="text-white font-medium text-sm bg-blue-600 px-3 py-2 rounded-lg">
          Click to replace image
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Editor modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowEditor(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-4">Edit Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="text"
                  value={localSrc}
                  onChange={(e) => setLocalSrc(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alt Text</label>
                <input
                  type="text"
                  value={localAlt}
                  onChange={(e) => setLocalAlt(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded"
                >
                  Upload New
                </button>
                <button
                  onClick={() => {
                    onChange(localSrc)
                    onAltChange?.(localAlt)
                    setShowEditor(false)
                  }}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
