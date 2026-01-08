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
  uploadFolder?: string
}

export function EditableImage({
  src,
  alt,
  onChange,
  onAltChange,
  className,
  isModified = false,
  editorMode = true,
  uploadFolder = 'uploads/website'
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
    formData.append('folder', uploadFolder)

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

// Logo type for the logo list editor
interface Logo {
  name: string
  src: string
  alt?: string
  size?: 'small' | 'default' | 'extra-large' | 'super-large'
}

interface LogoListEditorProps {
  logos: Logo[]
  onChange: (logos: Logo[]) => void
  isModified?: boolean
  editorMode?: boolean
}

export function LogoListEditor({
  logos,
  onChange,
  isModified = false,
  editorMode = true
}: LogoListEditorProps) {
  const [showEditor, setShowEditor] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [localLogos, setLocalLogos] = useState<Logo[]>(logos)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingForIndex, setUploadingForIndex] = useState<number | null>(null)

  useEffect(() => {
    setLocalLogos(logos)
  }, [logos])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'logos')

    try {
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      })
      const result = await response.json()
      if (result.success) {
        const updated = [...localLogos]
        updated[index] = { ...updated[index], src: result.path }
        setLocalLogos(updated)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    }
    setUploadingForIndex(null)
  }

  const handleAddLogo = () => {
    const newLogo: Logo = {
      name: 'New Logo',
      src: '/logos/placeholder.png',
      alt: 'New logo',
      size: 'default'
    }
    setLocalLogos([...localLogos, newLogo])
    setEditingIndex(localLogos.length)
  }

  const handleRemoveLogo = (index: number) => {
    const updated = localLogos.filter((_, i) => i !== index)
    setLocalLogos(updated)
  }

  const handleUpdateLogo = (index: number, field: keyof Logo, value: string) => {
    const updated = [...localLogos]
    updated[index] = { ...updated[index], [field]: value }
    setLocalLogos(updated)
  }

  const handleSave = () => {
    onChange(localLogos)
    setShowEditor(false)
    setEditingIndex(null)
  }

  if (!editorMode) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowEditor(true)}
        className={cn(
          "px-4 py-2 rounded-lg text-sm font-medium transition-all",
          "bg-blue-600 text-white hover:bg-blue-700",
          isModified && "ring-2 ring-amber-400 ring-offset-2"
        )}
      >
        Edit Logos ({logos.length})
      </button>

      {showEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowEditor(false)}>
          <div
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Client Logos</h3>
              <button
                onClick={() => setShowEditor(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localLogos.map((logo, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start gap-4">
                      {/* Logo preview */}
                      <div className="w-24 h-16 bg-white rounded border flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={logo.src}
                          alt={logo.name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg'
                          }}
                        />
                      </div>

                      {/* Logo details */}
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={logo.name}
                          onChange={(e) => handleUpdateLogo(index, 'name', e.target.value)}
                          className="w-full text-sm font-medium border rounded px-2 py-1 mb-2"
                          placeholder="Logo name"
                        />
                        <input
                          type="text"
                          value={logo.src}
                          onChange={(e) => handleUpdateLogo(index, 'src', e.target.value)}
                          className="w-full text-xs border rounded px-2 py-1 mb-2 font-mono"
                          placeholder="/logos/filename.png"
                        />
                        <div className="flex items-center gap-2">
                          <select
                            value={logo.size || 'default'}
                            onChange={(e) => handleUpdateLogo(index, 'size', e.target.value)}
                            className="text-xs border rounded px-2 py-1"
                          >
                            <option value="small">Small</option>
                            <option value="default">Default</option>
                            <option value="extra-large">Extra Large</option>
                            <option value="super-large">Super Large</option>
                          </select>
                          <input
                            type="file"
                            accept="image/*"
                            ref={uploadingForIndex === index ? fileInputRef : undefined}
                            onChange={(e) => handleFileUpload(e, index)}
                            className="hidden"
                            id={`logo-upload-${index}`}
                          />
                          <label
                            htmlFor={`logo-upload-${index}`}
                            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded cursor-pointer"
                          >
                            Upload
                          </label>
                          <button
                            onClick={() => handleRemoveLogo(index)}
                            className="text-xs text-red-600 hover:text-red-800 px-2 py-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddLogo}
                className="mt-4 w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + Add New Logo
              </button>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setLocalLogos(logos)
                  setShowEditor(false)
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
