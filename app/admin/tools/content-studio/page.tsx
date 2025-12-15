"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminSidebar } from "@/components/admin-sidebar"
import {
  Sparkles,
  FileText,
  Copy,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Users,
  BookOpen,
  ArrowRight,
  Eye,
  RefreshCw,
  X,
  Clock,
  Edit3
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import ReactMarkdown from 'react-markdown'

interface Speaker {
  id: string
  name: string
  title: string
  bio: string
  topics: string
  website: string
  slug: string
}

interface BlogPost {
  title: string
  slug: string
  url: string
}

interface PreviewData {
  title: string
  content: string
  speakers: Speaker[]
  blogPosts: BlogPost[]
  images: string[]
}

interface AIDraft {
  id: number
  title: string
  slug: string
  content: string
  original_content: string | null
  source_type: string | null
  source_url: string | null
  status: string
  created_at: string
  updated_at: string
}

type Step = 'input' | 'preview' | 'generate' | 'review'

export default function AIContentStudioPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>('input')

  // Input states
  const [semrushUrl, setSemrushUrl] = useState("")
  const [blogStyle, setBlogStyle] = useState("professional")

  // Preview states
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([])
  const [selectedBlogPosts, setSelectedBlogPosts] = useState<string[]>([])

  // Generate states
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")

  // Review states
  const [isPushingToContentful, setIsPushingToContentful] = useState(false)
  const [copied, setCopied] = useState(false)

  // Drafts states
  const [drafts, setDrafts] = useState<AIDraft[]>([])
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)

  const fetchDrafts = async () => {
    setIsLoadingDrafts(true)
    try {
      const token = localStorage.getItem('adminSessionToken')
      const response = await fetch("/api/admin/tools/blog-drafts", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setDrafts(data.drafts || [])
      }
    } catch (error) {
      console.error("Error fetching drafts:", error)
    } finally {
      setIsLoadingDrafts(false)
    }
  }

  const saveDraft = async () => {
    if (!generatedContent || !previewData?.title) {
      toast({ title: "Error", description: "No content to save", variant: "destructive" })
      return
    }
    setIsSavingDraft(true)
    try {
      const token = localStorage.getItem('adminSessionToken')
      const response = await fetch("/api/admin/tools/blog-drafts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: previewData.title,
          content: generatedContent,
          original_content: previewData.content,
          source_type: "semrush",
          source_url: semrushUrl,
          speakers_mentioned: selectedSpeakers.length
        })
      })
      if (response.ok) {
        toast({ title: "Success", description: "Draft saved successfully" })
        fetchDrafts()
      } else {
        const data = await response.json()
        toast({ title: "Error", description: data.error || "Failed to save draft", variant: "destructive" })
      }
    } catch (error) {
      console.error("Error saving draft:", error)
      toast({ title: "Error", description: "Failed to save draft", variant: "destructive" })
    } finally {
      setIsSavingDraft(false)
    }
  }

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
    fetchDrafts()
  }, [router])

  const handleFetchPreview = async () => {
    if (!semrushUrl.trim()) {
      toast({
        title: "Missing URL",
        description: "Please enter a Semrush article URL.",
        variant: "destructive"
      })
      return
    }

    setIsLoadingPreview(true)
    setPreviewData(null)

    try {
      const response = await fetch("/api/admin/tools/content-preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-dev-admin-bypass": "dev-admin-access"
        },
        body: JSON.stringify({ semrush_url: semrushUrl })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch content")
      }

      const data = await response.json()
      setPreviewData(data)
      // Auto-select all speakers and blog posts by default
      setSelectedSpeakers(data.speakers.map((s: Speaker) => s.id))
      setSelectedBlogPosts(data.blogPosts.map((p: BlogPost) => p.slug))
      setCurrentStep('preview')

      toast({
        title: "Content Fetched",
        description: `Found ${data.speakers.length} matching speakers and ${data.blogPosts.length} related blog posts.`
      })
    } catch (error) {
      console.error("Error fetching preview:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch content preview.",
        variant: "destructive"
      })
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const handleGenerate = async () => {
    if (!previewData) return

    setIsGenerating(true)
    setGeneratedContent("")

    try {
      const response = await fetch("/api/admin/tools/blog-writer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-dev-admin-bypass": "dev-admin-access"
        },
        body: JSON.stringify({
          semrush_url: semrushUrl,
          style: blogStyle,
          selected_speakers: selectedSpeakers,
          selected_blog_posts: selectedBlogPosts
        })
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      setGeneratedContent(data.blog)
      setCurrentStep('review')

      toast({
        title: "Content Generated",
        description: "Your article has been enhanced with internal links."
      })
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePushToContentful = async () => {
    if (!generatedContent.trim()) return

    setIsPushingToContentful(true)

    try {
      const response = await fetch("/api/admin/tools/push-to-contentful", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-dev-admin-bypass": "dev-admin-access"
        },
        body: JSON.stringify({ content: generatedContent })
      })

      if (!response.ok) {
        throw new Error("Failed to push to Contentful")
      }

      const data = await response.json()

      toast({
        title: "Pushed to Contentful",
        description: data.url ? `View draft: ${data.url}` : "Article saved as draft."
      })
    } catch (error) {
      console.error("Error pushing to Contentful:", error)
      toast({
        title: "Error",
        description: "Failed to push to Contentful. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsPushingToContentful(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    toast({ title: "Copied!", description: "Content copied to clipboard" })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setCurrentStep('input')
    setSemrushUrl("")
    setPreviewData(null)
    setSelectedSpeakers([])
    setSelectedBlogPosts([])
    setGeneratedContent("")
  }

  const toggleSpeaker = (id: string) => {
    setSelectedSpeakers(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const toggleBlogPost = (slug: string) => {
    setSelectedBlogPosts(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Content Studio</h1>
                <p className="mt-1 text-gray-600">Transform Semrush content with intelligent speaker and blog linking</p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {['input', 'preview', 'generate', 'review'].map((step, index) => {
                const stepLabels = {
                  input: 'Import',
                  preview: 'Preview',
                  generate: 'Generate',
                  review: 'Review'
                }
                const isActive = currentStep === step
                const isPast = ['input', 'preview', 'generate', 'review'].indexOf(currentStep) > index

                return (
                  <div key={step} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      isActive ? 'bg-amber-500 border-amber-500 text-white' :
                      isPast ? 'bg-green-500 border-green-500 text-white' :
                      'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {isPast ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${isActive ? 'text-amber-600' : isPast ? 'text-green-600' : 'text-gray-400'}`}>
                      {stepLabels[step as keyof typeof stepLabels]}
                    </span>
                    {index < 3 && (
                      <ArrowRight className={`mx-4 h-4 w-4 ${isPast ? 'text-green-400' : 'text-gray-300'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step 1: Input */}
          {currentStep === 'input' && (
            <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-600" />
                  Import Semrush Content
                </CardTitle>
                <CardDescription>
                  Paste the Semrush article URL to fetch and analyze content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-amber-50 border-amber-200">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900">
                    We'll automatically find matching speakers and related blog posts based on the article content.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="semrush-url">Semrush Article URL</Label>
                  <Input
                    id="semrush-url"
                    placeholder="https://static.semrush.com/contentshake/articles/..."
                    value={semrushUrl}
                    onChange={(e) => setSemrushUrl(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style">Writing Style</Label>
                  <Select value={blogStyle} onValueChange={setBlogStyle}>
                    <SelectTrigger id="style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional & Technical</SelectItem>
                      <SelectItem value="conversational">Conversational & Friendly</SelectItem>
                      <SelectItem value="thought-leadership">Thought Leadership</SelectItem>
                      <SelectItem value="educational">Educational & Instructive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleFetchPreview}
                  disabled={isLoadingPreview || !semrushUrl.trim()}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  {isLoadingPreview ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fetching Content...
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Fetch & Preview
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* AI Generated Drafts Section */}
            <Card className="mt-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Edit3 className="h-5 w-5 text-blue-600" />
                      Saved Drafts
                    </CardTitle>
                    <CardDescription>
                      AI-generated articles waiting to be published
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchDrafts} disabled={isLoadingDrafts}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingDrafts ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingDrafts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Loading drafts...</span>
                  </div>
                ) : drafts.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No saved drafts yet. Generate content and save it as a draft.</p>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {drafts.map((draft) => (
                      <div
                        key={draft.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                        onClick={() => {
                          setGeneratedContent(draft.content)
                          setCurrentStep('review')
                          toast({ title: "Draft loaded", description: `Loaded "${draft.title}"` })
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 truncate">{draft.title}</span>
                            <Badge variant="secondary" className="text-xs">
                              Draft
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2">{draft.content.substring(0, 150)}...</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(draft.created_at).toLocaleDateString()}
                            </div>
                            {draft.source_url && (
                              <div className="flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                Semrush
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            </>
          )}

          {/* Step 2: Preview */}
          {currentStep === 'preview' && previewData && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-blue-600" />
                        Content Preview
                      </CardTitle>
                      <CardDescription>Review the fetched content and select what to include</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setCurrentStep('input')}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Change URL
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <h3 className="font-semibold text-lg mb-2">{previewData.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-4">{previewData.content.substring(0, 500)}...</p>
                  </div>
                </CardContent>
              </Card>

              {/* Matched Speakers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Matched Speakers ({previewData.speakers.length})
                  </CardTitle>
                  <CardDescription>Select speakers to mention in the article (max 2 recommended)</CardDescription>
                </CardHeader>
                <CardContent>
                  {previewData.speakers.length === 0 ? (
                    <p className="text-gray-500 text-sm">No matching speakers found for this content.</p>
                  ) : (
                    <div className="space-y-3">
                      {previewData.speakers.map((speaker) => (
                        <div
                          key={speaker.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                            selectedSpeakers.includes(speaker.id)
                              ? 'border-purple-300 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleSpeaker(speaker.id)}
                        >
                          <Checkbox
                            checked={selectedSpeakers.includes(speaker.id)}
                            onCheckedChange={() => toggleSpeaker(speaker.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{speaker.name}</span>
                              <Badge variant="outline" className="text-xs">{speaker.title}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{speaker.bio}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {speaker.topics.split(', ').slice(0, 3).map((topic, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{topic}</Badge>
                              ))}
                            </div>
                          </div>
                          <a
                            href={speaker.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Related Blog Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    Related Blog Posts ({previewData.blogPosts.length})
                  </CardTitle>
                  <CardDescription>Select blog posts to link to for internal SEO</CardDescription>
                </CardHeader>
                <CardContent>
                  {previewData.blogPosts.length === 0 ? (
                    <p className="text-gray-500 text-sm">No related blog posts found.</p>
                  ) : (
                    <div className="space-y-2">
                      {previewData.blogPosts.map((post) => (
                        <div
                          key={post.slug}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                            selectedBlogPosts.includes(post.slug)
                              ? 'border-green-300 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleBlogPost(post.slug)}
                        >
                          <Checkbox
                            checked={selectedBlogPosts.includes(post.slug)}
                            onCheckedChange={() => toggleBlogPost(post.slug)}
                          />
                          <span className="flex-1 font-medium">{post.title}</span>
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-green-600 hover:text-green-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Enhanced Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate with {selectedSpeakers.length} Speaker{selectedSpeakers.length !== 1 ? 's' : ''} & {selectedBlogPosts.length} Blog Post{selectedBlogPosts.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 3/4: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Enhanced Article
                      </CardTitle>
                      <CardDescription>Review, edit, and export your enhanced content</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Start Over
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={saveDraft}
                        disabled={isSavingDraft}
                        className="border-amber-500 text-amber-600 hover:bg-amber-50"
                      >
                        {isSavingDraft ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Edit3 className="h-4 w-4 mr-2" />
                        )}
                        Save Draft
                      </Button>
                      <Button
                        size="sm"
                        onClick={handlePushToContentful}
                        disabled={isPushingToContentful}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isPushingToContentful ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Pushing...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 mr-2" />
                            Push to Contentful
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="min-h-[500px] font-mono text-sm"
                    placeholder="Generated content will appear here..."
                  />
                </CardContent>
              </Card>

              {/* Preview Rendered */}
              <Card>
                <CardHeader>
                  <CardTitle>Rendered Preview</CardTitle>
                  <CardDescription>How the content will look when published</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none bg-white p-6 rounded-lg border">
                    <ReactMarkdown>{generatedContent}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
