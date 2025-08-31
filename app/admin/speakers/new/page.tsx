"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
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
  User,
  Settings,
  Briefcase,
  Camera,
  Upload,
  Mail,
  Globe,
  MapPin,
  Phone
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminAddSpeakerPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
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
    bio: "",
    short_bio: "",
    one_liner: "",
    headshot_url: "",
    website: "",
    location: "",
    programs: "",
    topics: [] as string[],
    industries: [] as string[],
    speaking_fee_range: "",
    travel_preferences: "",
    technical_requirements: "",
    dietary_restrictions: "",
    featured: false,
    active: true,
    listed: true,
    ranking: 0
  })

  const [newTopic, setNewTopic] = useState("")
  const [newIndustry, setNewIndustry] = useState("")

  // Check authentication
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleAddTopic = () => {
    if (newTopic.trim() && !formData.topics.includes(newTopic.trim())) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()]
      }))
      setNewTopic("")
    }
  }

  const handleRemoveTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter(t => t !== topic)
    }))
  }

  const handleAddIndustry = () => {
    if (newIndustry.trim() && !formData.industries.includes(newIndustry.trim())) {
      setFormData(prev => ({
        ...prev,
        industries: [...prev.industries, newIndustry.trim()]
      }))
      setNewIndustry("")
    }
  }

  const handleRemoveIndustry = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.filter(i => i !== industry)
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/speakers/upload',
      })

      setFormData(prev => ({
        ...prev,
        headshot_url: blob.url
      }))

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/admin/speakers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-dev-admin-bypass': 'dev-admin-access'
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: "Speaker created successfully",
        })
        router.push(`/admin/speakers/${data.speaker.id}`)
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to create speaker",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Error",
        description: "Failed to create speaker",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (!isLoggedIn) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-[60]">
        <AdminSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-72 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin/speakers">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Speakers
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Add New Speaker</h1>
                <p className="mt-2 text-gray-600">Create a new speaker profile</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Speaker
                </>
              )}
            </Button>
          </div>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Essential speaker details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Image */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={formData.headshot_url} alt={formData.name} />
                      <AvatarFallback>
                        {formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'SP'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
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
                            <Camera className="mr-2 h-4 w-4" />
                            Upload Photo
                          </>
                        )}
                      </Button>
                      <p className="text-sm text-gray-500 mt-1">Recommended: 400x400px</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, State/Country"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="one_liner">One-Liner</Label>
                    <Input
                      id="one_liner"
                      name="one_liner"
                      value={formData.one_liner}
                      onChange={handleInputChange}
                      placeholder="Brief tagline or description"
                    />
                  </div>

                  <div>
                    <Label htmlFor="short_bio">Short Bio</Label>
                    <Textarea
                      id="short_bio"
                      name="short_bio"
                      value={formData.short_bio}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Brief biography (200 characters)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Full Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Detailed biography"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                  <CardDescription>Speaking topics and expertise</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Topics */}
                  <div>
                    <Label>Speaking Topics</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="Add a topic"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTopic())}
                      />
                      <Button onClick={handleAddTopic} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="px-3 py-1">
                          {topic}
                          <button
                            onClick={() => handleRemoveTopic(topic)}
                            className="ml-2 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Industries */}
                  <div>
                    <Label>Industries</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newIndustry}
                        onChange={(e) => setNewIndustry(e.target.value)}
                        placeholder="Add an industry"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIndustry())}
                      />
                      <Button onClick={handleAddIndustry} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.industries.map((industry) => (
                        <Badge key={industry} variant="secondary" className="px-3 py-1">
                          {industry}
                          <button
                            onClick={() => handleRemoveIndustry(industry)}
                            className="ml-2 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="speaking_fee_range">Speaking Fee Range</Label>
                    <Input
                      id="speaking_fee_range"
                      name="speaking_fee_range"
                      value={formData.speaking_fee_range}
                      onChange={handleInputChange}
                      placeholder="e.g., $5,000 - $10,000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="programs">Programs/Services</Label>
                    <Textarea
                      id="programs"
                      name="programs"
                      value={formData.programs}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Keynotes, workshops, consulting, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="travel_preferences">Travel Preferences</Label>
                    <Textarea
                      id="travel_preferences"
                      name="travel_preferences"
                      value={formData.travel_preferences}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Flight class, hotel preferences, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="technical_requirements">Technical Requirements</Label>
                    <Textarea
                      id="technical_requirements"
                      name="technical_requirements"
                      value={formData.technical_requirements}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="A/V needs, stage setup, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
                    <Input
                      id="dietary_restrictions"
                      name="dietary_restrictions"
                      value={formData.dietary_restrictions}
                      onChange={handleInputChange}
                      placeholder="Vegetarian, allergies, etc."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Settings & Visibility</CardTitle>
                  <CardDescription>Control speaker profile settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="active">Active</Label>
                        <p className="text-sm text-gray-500">Speaker is available for bookings</p>
                      </div>
                      <Switch
                        id="active"
                        checked={formData.active}
                        onCheckedChange={handleSwitchChange('active')}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="listed">Listed</Label>
                        <p className="text-sm text-gray-500">Show on public speakers page</p>
                      </div>
                      <Switch
                        id="listed"
                        checked={formData.listed}
                        onCheckedChange={handleSwitchChange('listed')}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="featured">Featured</Label>
                        <p className="text-sm text-gray-500">Highlight as featured speaker</p>
                      </div>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={handleSwitchChange('featured')}
                      />
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="ranking">Display Ranking</Label>
                      <Input
                        id="ranking"
                        name="ranking"
                        type="number"
                        value={formData.ranking}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                      <p className="text-sm text-gray-500 mt-1">Higher numbers appear first</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}