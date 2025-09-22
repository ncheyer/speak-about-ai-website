"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { upload } from "@vercel/blob/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  X,
  ExternalLink,
  Video,
  MessageSquare,
  User,
  Settings,
  Briefcase,
  Camera,
  Upload
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Video {
  id: string
  title: string
  url: string
  thumbnail?: string
  source?: string
  duration?: string
}

interface Testimonial {
  quote: string
  author: string
  position?: string
  company?: string
  event?: string
}

interface Speaker {
  id: number
  name: string
  email: string
  phone?: string
  company?: string
  title?: string
  slug?: string
  bio: string
  short_bio: string
  one_liner: string
  headshot_url: string
  website: string
  linkedin_url?: string
  twitter_url?: string
  instagram_url?: string
  youtube_url?: string
  location: string
  programs: string[]
  topics: string[]
  industries: string[]
  videos: Video[]
  testimonials: Testimonial[]
  speaking_fee_range: string
  travel_preferences: string
  technical_requirements: string
  dietary_restrictions: string
  featured: boolean
  active: boolean
  listed: boolean
  ranking: number
}

export default function AdminSpeakerEditPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [speaker, setSpeaker] = useState<Speaker | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    slug: "",
    bio: "",
    short_bio: "",
    one_liner: "",
    headshot_url: "",
    website: "",
    linkedin_url: "",
    twitter_url: "",
    instagram_url: "",
    youtube_url: "",
    location: "",
    programs: [] as string[],
    topics: [] as string[],
    industries: [] as string[],
    videos: [] as Video[],
    testimonials: [] as Testimonial[],
    speaking_fee_range: "",
    travel_preferences: "",
    technical_requirements: "",
    dietary_restrictions: "",
    featured: false,
    active: true,
    listed: true,
    ranking: 0,
  })

  // Form inputs for adding new items
  const [newTopic, setNewTopic] = useState("")
  const [newIndustry, setNewIndustry] = useState("")
  const [newProgram, setNewProgram] = useState("")
  const [newVideo, setNewVideo] = useState<Video>({ id: "", title: "", url: "", thumbnail: "" })
  const [newTestimonial, setNewTestimonial] = useState<Testimonial>({ quote: "", author: "" })

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
    loadSpeaker()
  }, [router, params.id])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    setUploadingImage(true)

    try {
      // Upload to Vercel Blob
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/speakers/upload",
      })

      // Update form data with the new image URL
      setFormData(prev => ({ ...prev, headshot_url: blob.url }))
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const loadSpeaker = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/speakers/${params.id}`)

      if (response.ok) {
        const data = await response.json()
        const speakerData = data.speaker
        setSpeaker(speakerData)
        setFormData({
          name: speakerData.name || "",
          email: speakerData.email || "",
          phone: speakerData.phone || "",
          company: speakerData.company || "",
          title: speakerData.title || "",
          slug: speakerData.slug || "",
          bio: speakerData.bio || "",
          short_bio: speakerData.short_bio || "",
          one_liner: speakerData.one_liner || "",
          headshot_url: speakerData.headshot_url || "",
          website: speakerData.website || "",
          linkedin_url: speakerData.linkedin_url || "",
          twitter_url: speakerData.twitter_url || "",
          instagram_url: speakerData.instagram_url || "",
          youtube_url: speakerData.youtube_url || "",
          location: speakerData.location || "",
          programs: speakerData.programs || [],
          topics: speakerData.topics || [],
          industries: speakerData.industries || [],
          videos: speakerData.videos || [],
          testimonials: speakerData.testimonials || [],
          speaking_fee_range: speakerData.speaking_fee_range || "",
          travel_preferences: speakerData.travel_preferences || "",
          technical_requirements: speakerData.technical_requirements || "",
          dietary_restrictions: speakerData.dietary_restrictions || "",
          featured: speakerData.featured || false,
          active: speakerData.active || true,
          listed: speakerData.listed || true,
          ranking: speakerData.ranking || 0,
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to load speaker",
          variant: "destructive",
        })
        router.push("/admin/speakers")
      }
    } catch (error) {
      console.error("Error loading speaker:", error)
      toast({
        title: "Error",
        description: "Failed to load speaker",
        variant: "destructive",
      })
      router.push("/admin/speakers")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch(`/api/admin/speakers/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Speaker updated successfully",
        })
        router.push(`/admin/speakers/${params.id}`)
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to update speaker",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating speaker:", error)
      toast({
        title: "Error",
        description: "Failed to update speaker",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Helper functions for managing arrays
  const addTopic = () => {
    if (newTopic.trim() && !formData.topics.includes(newTopic.trim())) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()]
      }))
      setNewTopic("")
    }
  }

  const removeTopic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }))
  }

  const addIndustry = () => {
    if (newIndustry.trim() && !formData.industries.includes(newIndustry.trim())) {
      setFormData(prev => ({
        ...prev,
        industries: [...prev.industries, newIndustry.trim()]
      }))
      setNewIndustry("")
    }
  }

  const removeIndustry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.filter((_, i) => i !== index)
    }))
  }

  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url?.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  // Function to get YouTube thumbnail
  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeId(url)
    if (videoId) {
      return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    }
    return null
  }

  const addVideo = () => {
    if (newVideo.title.trim() && newVideo.url.trim()) {
      const videoToAdd = {
        ...newVideo,
        id: newVideo.id || Date.now().toString(),
        // Automatically generate thumbnail for YouTube videos
        thumbnail: newVideo.thumbnail || getYouTubeThumbnail(newVideo.url) || undefined
      }
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, videoToAdd]
      }))
      setNewVideo({ id: "", title: "", url: "", thumbnail: "" })
    }
  }

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }))
  }

  const addTestimonial = () => {
    if (newTestimonial.quote.trim() && newTestimonial.author.trim()) {
      setFormData(prev => ({
        ...prev,
        testimonials: [...prev.testimonials, newTestimonial]
      }))
      setNewTestimonial({ quote: "", author: "" })
    }
  }

  const removeTestimonial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }))
  }

  const addProgram = () => {
    if (newProgram.trim() && !formData.programs.includes(newProgram.trim())) {
      setFormData(prev => ({
        ...prev,
        programs: [...prev.programs, newProgram.trim()]
      }))
      setNewProgram("")
    }
  }

  const removeProgram = (index: number) => {
    setFormData(prev => ({
      ...prev,
      programs: prev.programs.filter((_, i) => i !== index)
    }))
  }

  if (!isLoggedIn || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading speaker...</span>
      </div>
    )
  }

  if (!speaker) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Speaker not found</h2>
          <Link href="/admin/speakers">
            <Button>Back to Speakers</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/admin/speakers/${speaker.id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to View
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={formData.headshot_url} alt={formData.name} />
                <AvatarFallback>
                  {formData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit {formData.name}</h1>
                <p className="mt-2 text-gray-600">Update speaker profile information</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push(`/admin/speakers/${speaker.id}`)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Core speaker profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">/speakers/</span>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="auto-from-name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Company or Organization"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="CEO, AI Researcher, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="speaking_fee_range">Speaking Fee Range</Label>
                    <Input
                      id="speaking_fee_range"
                      value={formData.speaking_fee_range}
                      onChange={(e) => setFormData(prev => ({ ...prev, speaking_fee_range: e.target.value }))}
                      placeholder="e.g., $10,000 - $25,000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="headshot_url">Headshot</Label>
                    <div className="mt-2 flex items-start gap-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={formData.headshot_url} alt={formData.name} />
                        <AvatarFallback>
                          {formData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                          >
                            {uploadingImage ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload New Image
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData(prev => ({ ...prev, headshot_url: '' }))}
                            disabled={!formData.headshot_url || uploadingImage}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                        <Input
                          id="headshot_url"
                          value={formData.headshot_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, headshot_url: e.target.value }))}
                          placeholder="Or enter image URL directly"
                          disabled={uploadingImage}
                        />
                        <p className="text-xs text-gray-500">
                          Recommended: Square image, at least 400x400px, max 5MB
                        </p>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Personal Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                    <Input
                      id="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter_url">Twitter/X Profile</Label>
                    <Input
                      id="twitter_url"
                      value={formData.twitter_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, twitter_url: e.target.value }))}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram_url">Instagram Profile</Label>
                    <Input
                      id="instagram_url"
                      value={formData.instagram_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtube_url">YouTube Channel</Label>
                    <Input
                      id="youtube_url"
                      value={formData.youtube_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="one_liner">One Liner</Label>
                  <Input
                    id="one_liner"
                    value={formData.one_liner}
                    onChange={(e) => setFormData(prev => ({ ...prev, one_liner: e.target.value }))}
                    placeholder="A compelling one-line description"
                  />
                </div>

                <div>
                  <Label htmlFor="short_bio">Short Bio</Label>
                  <Textarea
                    id="short_bio"
                    value={formData.short_bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_bio: e.target.value }))}
                    rows={3}
                    placeholder="Brief professional bio (1-2 sentences)"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Full Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={6}
                    placeholder="Detailed professional biography"
                  />
                </div>

                <div>
                  <Label htmlFor="programs">Programs</Label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {formData.programs.map((program, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-2">
                          {program}
                          <button
                            onClick={() => removeProgram(index)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newProgram}
                        onChange={(e) => setNewProgram(e.target.value)}
                        placeholder="Add new program"
                        onKeyPress={(e) => e.key === 'Enter' && addProgram()}
                      />
                      <Button onClick={addProgram} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            {/* Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Speaking Topics</CardTitle>
                <CardDescription>Areas of expertise and speaking topics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.topics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-2">
                      {topic}
                      <button
                        onClick={() => removeTopic(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Add new topic"
                    onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                  />
                  <Button onClick={addTopic} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Industries */}
            <Card>
              <CardHeader>
                <CardTitle>Industries</CardTitle>
                <CardDescription>Industry focus areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.industries.map((industry, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-2">
                      {industry}
                      <button
                        onClick={() => removeIndustry(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    placeholder="Add new industry"
                    onKeyPress={(e) => e.key === 'Enter' && addIndustry()}
                  />
                  <Button onClick={addIndustry} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Videos
                </CardTitle>
                <CardDescription>Speaking videos and demonstrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {formData.videos.map((video, index) => (
                    <div key={video.id || index} className="border rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{video.title}</h4>
                        <Button
                          onClick={() => removeVideo(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                      >
                        {video.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      {video.duration && <p className="text-xs text-gray-500 mt-1">Duration: {video.duration}</p>}
                      {video.source && <p className="text-xs text-gray-500">Source: {video.source}</p>}
                    </div>
                  ))}
                </div>
                <div className="border rounded p-3 bg-gray-50">
                  <h4 className="font-medium mb-2">Add New Video</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <Input
                      value={newVideo.title}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Video title"
                    />
                    <Input
                      value={newVideo.url}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="Video URL"
                    />
                    <Input
                      value={newVideo.source || ""}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, source: e.target.value }))}
                      placeholder="Source (optional)"
                    />
                    <Input
                      value={newVideo.duration || ""}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="Duration (optional)"
                    />
                    <Input
                      value={newVideo.thumbnail || ""}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, thumbnail: e.target.value }))}
                      placeholder="Thumbnail URL (auto-generated for YouTube)"
                      className="md:col-span-2"
                    />
                  </div>
                  <Button onClick={addVideo} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Video
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Testimonials
                </CardTitle>
                <CardDescription>Client testimonials and reviews</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {formData.testimonials.map((testimonial, index) => (
                    <div key={index} className="border rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <blockquote className="text-gray-700 italic flex-1">
                          "{testimonial.quote}"
                        </blockquote>
                        <Button
                          onClick={() => removeTestimonial(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{testimonial.author}</p>
                        {testimonial.position && <p>{testimonial.position}</p>}
                        {testimonial.company && <p>{testimonial.company}</p>}
                        {testimonial.event && <p>Event: {testimonial.event}</p>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border rounded p-3 bg-gray-50">
                  <h4 className="font-medium mb-2">Add New Testimonial</h4>
                  <div className="space-y-2">
                    <Textarea
                      value={newTestimonial.quote}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, quote: e.target.value }))}
                      placeholder="Testimonial quote"
                      rows={3}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        value={newTestimonial.author}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, author: e.target.value }))}
                        placeholder="Author name"
                      />
                      <Input
                        value={newTestimonial.position || ""}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, position: e.target.value }))}
                        placeholder="Position (optional)"
                      />
                      <Input
                        value={newTestimonial.company || ""}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Company (optional)"
                      />
                      <Input
                        value={newTestimonial.event || ""}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, event: e.target.value }))}
                        placeholder="Event (optional)"
                      />
                    </div>
                  </div>
                  <Button onClick={addTestimonial} size="sm" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Testimonial
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Speaker Settings</CardTitle>
                <CardDescription>Visibility and status settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="active">Active Speaker</Label>
                      <p className="text-sm text-gray-600">Speaker is actively taking bookings</p>
                    </div>
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="featured">Featured Speaker</Label>
                      <p className="text-sm text-gray-600">Show in featured speakers section</p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="listed">Listed</Label>
                      <p className="text-sm text-gray-600">Show in public speaker directory</p>
                    </div>
                    <Switch
                      id="listed"
                      checked={formData.listed}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, listed: checked }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ranking">Ranking</Label>
                    <Input
                      id="ranking"
                      type="number"
                      value={formData.ranking}
                      onChange={(e) => setFormData(prev => ({ ...prev, ranking: parseInt(e.target.value) || 0 }))}
                      placeholder="Speaker ranking (for sorting)"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logistics</CardTitle>
                <CardDescription>Travel preferences and requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="travel_preferences">Travel Preferences</Label>
                  <Textarea
                    id="travel_preferences"
                    value={formData.travel_preferences}
                    onChange={(e) => setFormData(prev => ({ ...prev, travel_preferences: e.target.value }))}
                    rows={3}
                    placeholder="Travel preferences and requirements"
                  />
                </div>

                <div>
                  <Label htmlFor="technical_requirements">Technical Requirements</Label>
                  <Textarea
                    id="technical_requirements"
                    value={formData.technical_requirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, technical_requirements: e.target.value }))}
                    rows={3}
                    placeholder="AV and technical requirements"
                  />
                </div>

                <div>
                  <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
                  <Textarea
                    id="dietary_restrictions"
                    value={formData.dietary_restrictions}
                    onChange={(e) => setFormData(prev => ({ ...prev, dietary_restrictions: e.target.value }))}
                    rows={2}
                    placeholder="Dietary restrictions and preferences"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}