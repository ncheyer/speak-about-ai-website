"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminSidebar } from "@/components/admin-sidebar"
import {
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Home,
  Briefcase,
  Users,
  Image as ImageIcon,
  Search,
  HelpCircle,
  Compass,
  FileText,
  Upload,
  Loader2,
  X
} from "lucide-react"

interface ContentItem {
  id: number
  page: string
  section: string
  content_key: string
  content_value: string
  updated_at: string
}

interface ContentBySection {
  [section: string]: {
    [key: string]: ContentItem
  }
}

// ContentField component - uses local state to avoid re-renders on every keystroke
// Syncs to parent on blur (when you leave the field)
const ContentField = memo(function ContentField({
  page,
  section,
  contentKey,
  label,
  multiline = false,
  value,
  originalValue,
  onChange
}: {
  page: string
  section: string
  contentKey: string
  label: string
  multiline?: boolean
  value: string
  originalValue: string
  onChange: (page: string, section: string, contentKey: string, value: string) => void
}) {
  // Local state for the input - prevents parent re-renders on every keystroke
  const [localValue, setLocalValue] = useState(value)

  // Sync local state when parent value changes (e.g., after save or reset)
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Check if modified compared to original database value
  const isModified = localValue !== originalValue

  // Sync to parent on blur
  const handleBlur = () => {
    if (localValue !== value) {
      onChange(page, section, contentKey, localValue)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {isModified && <span className="ml-2 text-xs text-amber-600">(modified)</span>}
      </label>
      {multiline ? (
        <Textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          rows={4}
          className={isModified ? 'border-amber-300 bg-amber-50/50' : ''}
        />
      ) : (
        <Input
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          className={isModified ? 'border-amber-300 bg-amber-50/50' : ''}
        />
      )}
    </div>
  )
})

// ImageField component - extracted outside main component
function ImageFieldComponent({
  page,
  section,
  contentKey,
  label,
  altKey,
  uploadFolder,
  value,
  altValue,
  isModified,
  onChange,
  onUploadSuccess
}: {
  page: string
  section: string
  contentKey: string
  label: string
  altKey?: string
  uploadFolder?: string
  value: string
  altValue: string
  isModified: boolean
  onChange: (page: string, section: string, contentKey: string, value: string) => void
  onUploadSuccess: (message: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (uploadFolder) {
        formData.append('folder', uploadFolder)
      }

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok && result.success) {
        onChange(page, section, contentKey, result.path)
        onUploadSuccess(`Image uploaded: ${result.filename}`)
      } else {
        setUploadError(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('Failed to upload image')
    } finally {
      setUploading(false)
      if (e.target) {
        e.target.value = ''
      }
    }
  }

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-gray-500" />
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {isModified && <span className="ml-2 text-xs text-amber-600">(modified)</span>}
          </label>
        </div>
      </div>

      {/* Image Preview */}
      {value && (
        <div className="relative w-full max-w-xs h-40 bg-gray-200 rounded-lg overflow-hidden group">
          <img
            src={value}
            alt={altValue || label}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg'
            }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="cursor-pointer bg-white text-gray-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Replace
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      )}

      {/* Upload Button (when no image) */}
      {!value && (
        <label className="cursor-pointer flex flex-col items-center justify-center w-full max-w-xs h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload</span>
              <span className="text-xs text-gray-400 mt-1">JPEG, PNG, GIF, WebP (max 5MB)</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
          <AlertCircle className="w-4 h-4" />
          {uploadError}
          <button onClick={() => setUploadError(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Uploading Indicator */}
      {uploading && (
        <div className="flex items-center gap-2 text-blue-600 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Uploading...
        </div>
      )}

      {/* Image Path Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(page, section, contentKey, e.target.value)}
            placeholder="/path/to/image.jpg"
            className={`flex-1 ${isModified ? 'border-amber-300 bg-amber-50/50' : ''}`}
          />
          <label className="cursor-pointer">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              className="h-10"
              asChild
            >
              <span>
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </span>
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
        <p className="text-xs text-gray-500">Upload a new image or enter the path manually</p>
      </div>

      {/* Alt Text Input */}
      {altKey && (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600">Alt Text (for accessibility)</label>
          <Input
            value={altValue}
            onChange={(e) => onChange(page, section, altKey, e.target.value)}
            placeholder="Describe the image..."
            className="text-sm"
          />
        </div>
      )}
    </div>
  )
}

export default function WebsiteEditorPage() {
  const router = useRouter()
  const [content, setContent] = useState<ContentItem[]>([])
  const [editedContent, setEditedContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'home-hero': true,
    'home-why-choose-us': false,
    'home-images': false,
    'home-navigate': false,
    'home-faq': false,
    'home-seo-content': false,
    'home-seo-faq': false,
    'home-meta': false,
    'services-hero': true,
    'services-offerings': false,
    'services-images': false,
    'services-process': false,
    'services-events': false,
    'services-cta': false,
    'services-meta': false,
    'team-hero': true,
    'team-members': false,
    'team-meta': false,
  })

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
    fetchContent()
  }, [router])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/website-content?_t=${Date.now()}`, {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setContent(data)
        // Initialize edited content with current values
        const initial: Record<string, string> = {}
        data.forEach((item: ContentItem) => {
          const key = `${item.page}.${item.section}.${item.content_key}`
          initial[key] = item.content_value
        })
        setEditedContent(initial)
      }
    } catch (error) {
      console.error('Error fetching content:', error)
      setSaveStatus({ type: 'error', message: 'Failed to load content' })
    } finally {
      setLoading(false)
    }
  }

  const hasChanges = (page: string, section: string): boolean => {
    const sectionContent = content.filter(c => c.page === page && c.section === section)
    return sectionContent.some(item => {
      const key = `${item.page}.${item.section}.${item.content_key}`
      return editedContent[key] !== item.content_value
    })
  }

  const saveSection = async (page: string, section: string) => {
    setSaving(true)
    try {
      const sectionContent = content.filter(c => c.page === page && c.section === section)
      const updates = sectionContent.map(item => {
        const key = `${item.page}.${item.section}.${item.content_key}`
        return {
          page: item.page,
          section: item.section,
          content_key: item.content_key,
          content_value: editedContent[key] || item.content_value
        }
      })

      const response = await fetch('/api/admin/website-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        setSaveStatus({ type: 'success', message: 'Content saved successfully!' })
        await fetchContent()
        setTimeout(() => setSaveStatus(null), 3000)
      } else {
        setSaveStatus({ type: 'error', message: 'Failed to save content' })
      }
    } catch (error) {
      console.error('Error saving content:', error)
      setSaveStatus({ type: 'error', message: 'Error saving content' })
    } finally {
      setSaving(false)
    }
  }

  const resetToDefaults = async () => {
    if (!confirm('Are you sure you want to reset all content to defaults? This cannot be undone.')) return

    setSaving(true)
    try {
      const response = await fetch('/api/admin/website-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reseed' })
      })

      if (response.ok) {
        setSaveStatus({ type: 'success', message: 'Content reset to defaults!' })
        await fetchContent()
        setTimeout(() => setSaveStatus(null), 3000)
      }
    } catch (error) {
      console.error('Error resetting content:', error)
      setSaveStatus({ type: 'error', message: 'Error resetting content' })
    } finally {
      setSaving(false)
    }
  }

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }))
  }

  // Stable callback for content changes
  const handleContentChangeStable = useCallback((page: string, section: string, contentKey: string, value: string) => {
    const key = `${page}.${section}.${contentKey}`
    setEditedContent(prev => ({ ...prev, [key]: value }))
  }, [])

  // Wrapper for ContentField that computes value and originalValue
  const renderContentField = (page: string, section: string, contentKey: string, label: string, multiline = false) => {
    const key = `${page}.${section}.${contentKey}`
    const value = editedContent[key] || ''
    const originalItem = content.find(c =>
      c.page === page && c.section === section && c.content_key === contentKey
    )
    const originalValue = originalItem?.content_value || ''

    return (
      <ContentField
        key={key}
        page={page}
        section={section}
        contentKey={contentKey}
        label={label}
        multiline={multiline}
        value={value}
        originalValue={originalValue}
        onChange={handleContentChangeStable}
      />
    )
  }

  // Wrapper for ImageField
  const renderImageField = (page: string, section: string, contentKey: string, label: string, altKey?: string, uploadFolder?: string) => {
    const key = `${page}.${section}.${contentKey}`
    const value = editedContent[key] || ''
    const altValue = altKey ? (editedContent[`${page}.${section}.${altKey}`] || '') : ''
    const originalItem = content.find(c =>
      c.page === page && c.section === section && c.content_key === contentKey
    )
    const isModified = !!(originalItem && value !== originalItem.content_value)

    const handleUploadSuccess = (message: string) => {
      setSaveStatus({ type: 'success', message })
      setTimeout(() => setSaveStatus(null), 3000)
    }

    return (
      <ImageFieldComponent
        key={key}
        page={page}
        section={section}
        contentKey={contentKey}
        label={label}
        altKey={altKey}
        uploadFolder={uploadFolder}
        value={value}
        altValue={altValue}
        isModified={isModified}
        onChange={handleContentChangeStable}
        onUploadSuccess={handleUploadSuccess}
      />
    )
  }

  const SectionCard = ({
    title,
    sectionKey,
    page,
    section,
    children
  }: {
    title: string
    sectionKey: string
    page: string
    section: string
    children: React.ReactNode
  }) => {
    const isExpanded = expandedSections[sectionKey]
    const modified = hasChanges(page, section)

    return (
      <Card className={modified ? 'border-amber-300' : ''}>
        <CardHeader
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              {title}
              {modified && (
                <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                  Unsaved changes
                </span>
              )}
            </CardTitle>
            {isExpanded && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  saveSection(page, section)
                }}
                disabled={!modified || saving}
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Section
              </Button>
            )}
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="space-y-4">
            {children}
          </CardContent>
        )}
      </Card>
    )
  }

  if (!isLoggedIn) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="fixed left-0 top-0 h-full z-[60]">
        <AdminSidebar />
      </div>

      <div className="flex-1 ml-72 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Website Editor</h1>
              <p className="text-gray-600 mt-1">Edit content for your public-facing pages</p>
            </div>
            <Button onClick={resetToDefaults} variant="outline" disabled={saving}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>

          {saveStatus && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              saveStatus.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {saveStatus.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {saveStatus.message}
            </div>
          )}

          {loading ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-600">Loading content...</p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="home" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="home" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Home Page
                </TabsTrigger>
                <TabsTrigger value="services" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Services Page
                </TabsTrigger>
                <TabsTrigger value="team" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Our Team Page
                </TabsTrigger>
              </TabsList>

              {/* Home Page Tab */}
              <TabsContent value="home" className="space-y-4">
                <SectionCard title="Hero Section" sectionKey="home-hero" page="home" section="hero">
                  {renderContentField("home", "hero", "badge", "Badge Text")}
                  {renderContentField("home", "hero", "title", "Main Headline")}
                  {renderContentField("home", "hero", "subtitle", "Subtitle", true)}
                </SectionCard>

                <SectionCard title="Images" sectionKey="home-images" page="home" section="images">
                  {renderImageField("home", "images", "hero_image", "Hero Image", "hero_image_alt", "uploads/home")}
                </SectionCard>

                <SectionCard title="Why Choose Us" sectionKey="home-why-choose-us" page="home" section="why-choose-us">
                  <div className="space-y-4 mb-6">
                    {renderContentField("home", "why-choose-us", "section_title", "Section Title")}
                    {renderContentField("home", "why-choose-us", "section_subtitle", "Section Subtitle", true)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700">Feature 1: AI Pioneers</h4>
                      {renderContentField("home", "why-choose-us", "feature1_title", "Title")}
                      {renderContentField("home", "why-choose-us", "feature1_description", "Description", true)}
                    </div>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700">Feature 2: Response Time</h4>
                      {renderContentField("home", "why-choose-us", "feature2_title", "Title")}
                      {renderContentField("home", "why-choose-us", "feature2_description", "Description", true)}
                    </div>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700">Feature 3: Coordination</h4>
                      {renderContentField("home", "why-choose-us", "feature3_title", "Title")}
                      {renderContentField("home", "why-choose-us", "feature3_description", "Description", true)}
                    </div>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700">Feature 4: Guidance</h4>
                      {renderContentField("home", "why-choose-us", "feature4_title", "Title")}
                      {renderContentField("home", "why-choose-us", "feature4_description", "Description", true)}
                    </div>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700">Feature 5: Stage Presence</h4>
                      {renderContentField("home", "why-choose-us", "feature5_title", "Title")}
                      {renderContentField("home", "why-choose-us", "feature5_description", "Description", true)}
                    </div>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700">Feature 6: Intelligence</h4>
                      {renderContentField("home", "why-choose-us", "feature6_title", "Title")}
                      {renderContentField("home", "why-choose-us", "feature6_description", "Description", true)}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Navigate the Speaker Landscape" sectionKey="home-navigate" page="home" section="navigate">
                  <div className="space-y-4 mb-6">
                    {renderContentField("home", "navigate", "section_title", "Section Title")}
                    {renderContentField("home", "navigate", "section_subtitle", "Section Subtitle")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800">Budget Guidance Card</h4>
                      {renderContentField("home", "navigate", "budget_title", "Card Title")}
                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded">
                          {renderContentField("home", "navigate", "budget_tier1_range", "Tier 1 Range")}
                          {renderContentField("home", "navigate", "budget_tier1_desc", "Tier 1 Description")}
                        </div>
                        <div className="p-3 bg-white rounded">
                          {renderContentField("home", "navigate", "budget_tier2_range", "Tier 2 Range")}
                          {renderContentField("home", "navigate", "budget_tier2_desc", "Tier 2 Description")}
                        </div>
                        <div className="p-3 bg-white rounded">
                          {renderContentField("home", "navigate", "budget_tier3_range", "Tier 3 Range")}
                          {renderContentField("home", "navigate", "budget_tier3_desc", "Tier 3 Description")}
                        </div>
                      </div>
                      {renderContentField("home", "navigate", "budget_disclaimer", "Disclaimer", true)}
                    </div>
                    <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-medium text-amber-800">Audience Types Card</h4>
                      {renderContentField("home", "navigate", "audience_title", "Card Title")}
                      {renderContentField("home", "navigate", "audience_list", "Audience List (comma-separated)", true)}
                    </div>
                    <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800">Global Delivery Card</h4>
                      {renderContentField("home", "navigate", "delivery_title", "Card Title")}
                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded">
                          {renderContentField("home", "navigate", "delivery_inperson_title", "In-Person Title")}
                          {renderContentField("home", "navigate", "delivery_inperson_desc", "In-Person Description")}
                        </div>
                        <div className="p-3 bg-white rounded">
                          {renderContentField("home", "navigate", "delivery_virtual_title", "Virtual Title")}
                          {renderContentField("home", "navigate", "delivery_virtual_desc", "Virtual Description")}
                        </div>
                        <div className="p-3 bg-white rounded">
                          {renderContentField("home", "navigate", "delivery_hybrid_title", "Hybrid Title")}
                          {renderContentField("home", "navigate", "delivery_hybrid_desc", "Hybrid Description")}
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="FAQ Section" sectionKey="home-faq" page="home" section="faq">
                  {renderContentField("home", "faq", "section_title", "Section Title")}
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <h4 className="font-medium text-gray-700">FAQ {i}</h4>
                        {renderContentField("home", "faq", `faq${i}_question`, "Question")}
                        {renderContentField("home", "faq", `faq${i}_answer`, "Answer", true)}
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="SEO Content Section" sectionKey="home-seo-content" page="home" section="seo-content">
                  <p className="text-sm text-gray-500 mb-4">This is the rich text content section at the bottom of the homepage for SEO purposes.</p>
                  <div className="space-y-4">
                    {renderContentField("home", "seo-content", "main_heading", "Main Heading")}
                    {renderContentField("home", "seo-content", "intro_paragraph", "Introduction Paragraph", true)}
                    {renderContentField("home", "seo-content", "why_heading", "Why Choose Us Heading")}
                    {renderContentField("home", "seo-content", "why_paragraph", "Why Choose Us Paragraph", true)}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                        {renderContentField("home", "seo-content", "industries_heading", "Industries Heading")}
                        {renderContentField("home", "seo-content", "industries_list", "Industries List (comma-separated)", true)}
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                        {renderContentField("home", "seo-content", "topics_heading", "Topics Heading")}
                        {renderContentField("home", "seo-content", "topics_list", "Topics List (comma-separated)", true)}
                      </div>
                    </div>
                    {renderContentField("home", "seo-content", "book_heading", "Book Section Heading")}
                    {renderContentField("home", "seo-content", "book_paragraph", "Book Section Paragraph", true)}
                    {renderContentField("home", "seo-content", "cta_button_text", "CTA Button Text")}
                    {renderContentField("home", "seo-content", "closing_paragraph", "Closing Paragraph", true)}
                  </div>
                </SectionCard>

                <SectionCard title="SEO FAQ Section" sectionKey="home-seo-faq" page="home" section="seo-faq">
                  <p className="text-sm text-gray-500 mb-4">These FAQs appear at the bottom of the homepage for SEO purposes.</p>
                  {renderContentField("home", "seo-faq", "section_title", "Section Title")}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <h4 className="font-medium text-gray-700">SEO FAQ {i}</h4>
                        {renderContentField("home", "seo-faq", `faq${i}_question`, "Question")}
                        {renderContentField("home", "seo-faq", `faq${i}_answer`, "Answer", true)}
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="SEO Meta Information" sectionKey="home-meta" page="home" section="meta">
                  <p className="text-sm text-gray-500 mb-4">These meta tags help with search engine optimization.</p>
                  <div className="space-y-4">
                    {renderContentField("home", "meta", "title", "Page Title (shown in browser tab)")}
                    {renderContentField("home", "meta", "description", "Meta Description", true)}
                    {renderContentField("home", "meta", "keywords", "Keywords (comma-separated)", true)}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                      <h4 className="font-medium text-blue-800">Open Graph (Social Sharing)</h4>
                      {renderContentField("home", "meta", "og_title", "OG Title")}
                      {renderContentField("home", "meta", "og_description", "OG Description", true)}
                    </div>
                  </div>
                </SectionCard>
              </TabsContent>

              {/* Services Page Tab */}
              <TabsContent value="services" className="space-y-4">
                <SectionCard title="Hero Section" sectionKey="services-hero" page="services" section="hero">
                  {renderContentField("services", "hero", "badge", "Badge Text")}
                  {renderContentField("services", "hero", "title", "Page Title")}
                  {renderContentField("services", "hero", "subtitle", "Subtitle", true)}
                </SectionCard>

                <SectionCard title="Service Images" sectionKey="services-images" page="services" section="images">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {renderImageField("services", "images", "offering1_image", "Keynote Speeches", undefined, "uploads/services")}
                    {renderImageField("services", "images", "offering2_image", "Panel Discussions", undefined, "uploads/services")}
                    {renderImageField("services", "images", "offering3_image", "Fireside Chats", undefined, "uploads/services")}
                    {renderImageField("services", "images", "offering4_image", "Workshops", undefined, "uploads/services")}
                    {renderImageField("services", "images", "offering5_image", "Virtual Presentations", undefined, "uploads/services")}
                    {renderImageField("services", "images", "offering6_image", "Custom Video Content", undefined, "uploads/services")}
                  </div>
                </SectionCard>

                <SectionCard title="Service Offerings" sectionKey="services-offerings" page="services" section="offerings">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700">Offering 1: Keynote Speeches</h4>
                      {renderContentField("services", "offerings", "offering1_title", "Title")}
                      {renderContentField("services", "offerings", "offering1_description", "Description", true)}
                    </div>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700">Offering 2: Panel Discussions</h4>
                      {renderContentField("services", "offerings", "offering2_title", "Title")}
                      {renderContentField("services", "offerings", "offering2_description", "Description", true)}
                    </div>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700">Offering 3: Fireside Chats</h4>
                      {renderContentField("services", "offerings", "offering3_title", "Title")}
                      {renderContentField("services", "offerings", "offering3_description", "Description", true)}
                    </div>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700">Offering 4: Workshops</h4>
                      {renderContentField("services", "offerings", "offering4_title", "Title")}
                      {renderContentField("services", "offerings", "offering4_description", "Description", true)}
                    </div>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700">Offering 5: Virtual Presentations</h4>
                      {renderContentField("services", "offerings", "offering5_title", "Title")}
                      {renderContentField("services", "offerings", "offering5_description", "Description", true)}
                    </div>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700">Offering 6: Custom Video Content</h4>
                      {renderContentField("services", "offerings", "offering6_title", "Title")}
                      {renderContentField("services", "offerings", "offering6_description", "Description", true)}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Our Process" sectionKey="services-process" page="services" section="process">
                  <div className="space-y-4 mb-6">
                    {renderContentField("services", "process", "section_title", "Section Title")}
                    {renderContentField("services", "process", "section_subtitle", "Section Subtitle", true)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                        <h4 className="font-medium text-blue-800">Step 1</h4>
                      </div>
                      {renderContentField("services", "process", "step1_title", "Title")}
                      {renderContentField("services", "process", "step1_description", "Description", true)}
                    </div>
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                        <h4 className="font-medium text-blue-800">Step 2</h4>
                      </div>
                      {renderContentField("services", "process", "step2_title", "Title")}
                      {renderContentField("services", "process", "step2_description", "Description", true)}
                    </div>
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                        <h4 className="font-medium text-blue-800">Step 3</h4>
                      </div>
                      {renderContentField("services", "process", "step3_title", "Title")}
                      {renderContentField("services", "process", "step3_description", "Description", true)}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="In-Person Events" sectionKey="services-events" page="services" section="events">
                  <div className="space-y-4 mb-6">
                    {renderContentField("services", "events", "section_title", "Section Title")}
                    {renderContentField("services", "events", "section_subtitle", "Section Subtitle", true)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700">Latest Event Card</h4>
                      {renderContentField("services", "events", "latest_event_title", "Card Title")}
                      {renderContentField("services", "events", "latest_event_description", "Event Description", true)}
                      {renderContentField("services", "events", "latest_event_cta", "CTA Text", true)}
                      {renderImageField("services", "events", "event_image", "Event Image", undefined, "uploads/events")}
                    </div>
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700">Newsletter Signup Card</h4>
                      {renderContentField("services", "events", "newsletter_title", "Card Title")}
                      {renderContentField("services", "events", "newsletter_description", "Description", true)}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="CTA Section" sectionKey="services-cta" page="services" section="cta">
                  <p className="text-sm text-gray-500 mb-4">This is the call-to-action section at the bottom of the services page.</p>
                  <div className="space-y-4">
                    {renderContentField("services", "cta", "title", "Headline")}
                    {renderContentField("services", "cta", "subtitle", "Subtitle", true)}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {renderContentField("services", "cta", "button_text", "Button Text")}
                      {renderContentField("services", "cta", "phone_number", "Phone Number")}
                      {renderContentField("services", "cta", "email", "Email Address")}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <h4 className="font-medium text-gray-700">Stat 1</h4>
                        {renderContentField("services", "cta", "stat1_value", "Value")}
                        {renderContentField("services", "cta", "stat1_label", "Label")}
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <h4 className="font-medium text-gray-700">Stat 2</h4>
                        {renderContentField("services", "cta", "stat2_value", "Value")}
                        {renderContentField("services", "cta", "stat2_label", "Label")}
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <h4 className="font-medium text-gray-700">Stat 3</h4>
                        {renderContentField("services", "cta", "stat3_value", "Value")}
                        {renderContentField("services", "cta", "stat3_label", "Label")}
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="SEO Meta Information" sectionKey="services-meta" page="services" section="meta">
                  <p className="text-sm text-gray-500 mb-4">These meta tags help with search engine optimization for the Services page.</p>
                  <div className="space-y-4">
                    {renderContentField("services", "meta", "title", "Page Title (shown in browser tab)")}
                    {renderContentField("services", "meta", "description", "Meta Description", true)}
                    {renderContentField("services", "meta", "keywords", "Keywords (comma-separated)", true)}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                      <h4 className="font-medium text-blue-800">Open Graph (Social Sharing)</h4>
                      {renderContentField("services", "meta", "og_title", "OG Title")}
                      {renderContentField("services", "meta", "og_description", "OG Description", true)}
                    </div>
                  </div>
                </SectionCard>
              </TabsContent>

              {/* Team Page Tab */}
              <TabsContent value="team" className="space-y-4">
                <SectionCard title="Our Story" sectionKey="team-hero" page="team" section="hero">
                  {renderContentField("team", "hero", "badge", "Badge Text")}
                  {renderContentField("team", "hero", "title", "Section Title")}
                  {renderContentField("team", "hero", "story_paragraph1", "Paragraph 1", true)}
                  {renderContentField("team", "hero", "story_paragraph2", "Paragraph 2", true)}
                  {renderContentField("team", "hero", "story_paragraph3", "Paragraph 3", true)}
                </SectionCard>

                <SectionCard title="Team Members" sectionKey="team-members" page="team" section="members">
                  <div className="space-y-6">
                    <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                      <h4 className="font-semibold text-gray-800 text-lg">Robert Strong</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          {renderImageField("team", "members", "member1_image", "Profile Photo", undefined, "uploads/team")}
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            {renderContentField("team", "members", "member1_name", "Name")}
                            {renderContentField("team", "members", "member1_title", "Title/Role")}
                          </div>
                          {renderContentField("team", "members", "member1_bio", "Bio", true)}
                          {renderContentField("team", "members", "member1_linkedin", "LinkedIn URL")}
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="SEO Meta Information" sectionKey="team-meta" page="team" section="meta">
                  <p className="text-sm text-gray-500 mb-4">These meta tags help with search engine optimization for the Team page.</p>
                  <div className="space-y-4">
                    {renderContentField("team", "meta", "title", "Page Title (shown in browser tab)")}
                    {renderContentField("team", "meta", "description", "Meta Description", true)}
                    {renderContentField("team", "meta", "keywords", "Keywords (comma-separated)", true)}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                      <h4 className="font-medium text-blue-800">Open Graph (Social Sharing)</h4>
                      {renderContentField("team", "meta", "og_title", "OG Title")}
                      {renderContentField("team", "meta", "og_description", "OG Description", true)}
                    </div>
                  </div>
                </SectionCard>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
