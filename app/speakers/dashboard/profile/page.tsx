"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  User,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Video,
  Mic,
  DollarSign,
  Calendar,
  Upload,
  Save,
  ChevronLeft,
  Plus,
  X,
  Check,
  CheckCircle,
  AlertCircle,
  Camera,
  Edit,
  Trash2,
  Link as LinkIcon,
  BookOpen,
  Target,
  Users,
  Star,
  TrendingUp,
  FileText,
  Loader2,
  Eye,
  Copy,
  Download,
  ExternalLink,
  Building
} from "lucide-react"
import Link from "next/link"

const EXPERTISE_AREAS = [
  "Artificial Intelligence & Machine Learning",
  "Generative AI & LLMs",
  "AI Strategy & Implementation",
  "Business Strategy & Leadership",
  "Digital Transformation",
  "Innovation & Future Trends",
  "Data & Analytics",
  "Cybersecurity & AI Safety",
  "Ethics & Responsible AI",
  "Healthcare & Life Sciences",
  "Finance & Banking",
  "Retail & E-commerce",
  "Manufacturing & Supply Chain",
  "Education & Learning",
  "Marketing & Customer Experience",
  "Human Resources & Future of Work",
  "Sustainability & Climate Tech",
  "Government & Public Policy",
  "Media & Entertainment",
  "Transportation & Mobility"
]

const SPEAKING_FORMATS = [
  { value: "keynote", label: "Keynote Presentations" },
  { value: "workshop", label: "Workshops & Masterclasses" },
  { value: "panel", label: "Panel Discussions" },
  { value: "fireside", label: "Fireside Chats" },
  { value: "virtual", label: "Virtual Presentations" },
  { value: "executive", label: "Executive Briefings" },
  { value: "media", label: "Media Appearances" }
]

const FEE_RANGES = [
  "Pro bono (selective)",
  "Under $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000 - $75,000",
  "$75,000 - $100,000",
  "Above $100,000",
  "Varies by engagement"
]

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese (Mandarin)",
  "Japanese",
  "Korean",
  "Italian",
  "Portuguese",
  "Arabic",
  "Hindi",
  "Russian"
]

// Mock data - in production this would come from API
const mockProfile = {
  id: 1,
  first_name: "Noah",
  last_name: "Cheyer",
  email: "noah@speakabout.ai",
  phone: "+1 (555) 123-4567",
  title: "CEO & Founder",
  company: "Speak About AI",
  location: "San Francisco, CA",
  timezone: "PST",
  
  bio: "Noah Cheyer is a visionary entrepreneur and AI thought leader who founded Speak About AI to connect organizations with the world's leading experts in artificial intelligence. With over 15 years of experience in technology and innovation, Noah has been at the forefront of the AI revolution, helping Fortune 500 companies navigate digital transformation and implement cutting-edge AI strategies.",
  
  short_bio: "CEO & Founder of Speak About AI, connecting organizations with leading AI experts worldwide.",
  
  headshot_url: "https://example.com/headshot.jpg",
  banner_url: "https://example.com/banner.jpg",
  
  expertise_areas: [
    "AI Strategy & Implementation",
    "Digital Transformation",
    "Business Strategy & Leadership"
  ],
  
  speaking_topics: [
    "The Future of AI in Business",
    "Building AI-First Organizations",
    "Ethical AI Implementation",
    "AI Leadership and Innovation",
    "Digital Transformation Strategies"
  ],
  
  signature_talks: [
    {
      title: "AI Revolution: Leading in the Age of Intelligence",
      description: "A comprehensive look at how organizations can leverage AI to transform their operations and create competitive advantages."
    },
    {
      title: "The Human Side of AI",
      description: "Exploring the intersection of human creativity and artificial intelligence in the modern workplace."
    }
  ],
  
  achievements: [
    "Founded 3 successful AI startups",
    "Named to Forbes 30 Under 30 in Technology",
    "Published 20+ articles on AI and innovation",
    "Keynoted at 100+ international conferences"
  ],
  
  education: [
    {
      degree: "MBA",
      institution: "Stanford Graduate School of Business",
      year: "2015"
    },
    {
      degree: "BS Computer Science",
      institution: "MIT",
      year: "2010"
    }
  ],
  
  certifications: [
    "Google Cloud AI/ML Professional",
    "AWS Machine Learning Specialty",
    "Certified Speaking Professional (CSP)"
  ],
  
  languages: ["English", "Spanish", "French"],
  
  speaking_fee_range: "$25,000 - $50,000",
  available_formats: ["keynote", "panel", "fireside", "virtual", "executive"],
  
  travel_preferences: "Business class for flights over 4 hours, 4-star or above accommodation",
  booking_requirements: "Minimum 6 weeks advance notice, signed agreement required",
  technical_requirements: "Wireless lavalier mic, confidence monitor, HDMI connection for presentations",
  
  website: "https://noahcheyer.com",
  linkedin_url: "https://linkedin.com/in/noahcheyer",
  twitter_url: "https://twitter.com/noahcheyer",
  youtube_url: "https://youtube.com/noahcheyer",
  instagram_url: "https://instagram.com/noahcheyer",
  
  videos: [
    {
      title: "AI Leadership Summit 2024 Keynote",
      url: "https://youtube.com/watch?v=example1",
      date: "2024-11-15",
      views: "15K"
    },
    {
      title: "The Future of Work Podcast",
      url: "https://youtube.com/watch?v=example2",
      date: "2024-10-20",
      views: "8.5K"
    }
  ],
  
  publications: [
    {
      title: "The AI-First Organization",
      publisher: "Harvard Business Review",
      date: "2024-09",
      url: "https://hbr.org/example"
    },
    {
      title: "Ethical AI Implementation Guide",
      publisher: "MIT Technology Review",
      date: "2024-07",
      url: "https://technologyreview.com/example"
    }
  ],
  
  testimonials: [
    {
      text: "Noah's keynote was the highlight of our conference. His insights on AI transformation were invaluable.",
      author: "Sarah Johnson",
      title: "CEO, TechCorp",
      event: "Global Tech Summit 2024"
    },
    {
      text: "Engaging, insightful, and truly inspiring. Noah has a gift for making complex AI concepts accessible.",
      author: "Michael Chen",
      title: "VP Innovation, Fortune 500 Company",
      event: "Enterprise AI Forum"
    }
  ],
  
  profile_completion: 85,
  profile_views: 1250,
  engagement_requests: 12,
  avg_rating: 4.9,
  total_engagements: 47
}

export default function SpeakerProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState(mockProfile)
  const [activeTab, setActiveTab] = useState("basic")
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<any>({})
  
  // Form states for editing
  const [editMode, setEditMode] = useState({
    basic: false,
    professional: false,
    expertise: false,
    media: false,
    logistics: false
  })

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("speakerToken")
    if (!token) {
      router.push("/speakers/login")
    }
  }, [router])

  const handleSave = async (section: string) => {
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      setEditMode(prev => ({ ...prev, [section]: false }))
      
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1000)
  }

  const handleImageUpload = (type: 'headshot' | 'banner') => {
    // In production, this would handle actual file upload
    console.log(`Uploading ${type}...`)
  }

  const addItem = (field: string, item: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as any[]), item]
    }))
  }

  const removeItem = (field: string, index: number) => {
    setProfile(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).filter((_, i) => i !== index)
    }))
  }

  const profileCompletionItems = [
    { label: "Basic Information", completed: true },
    { label: "Professional Background", completed: true },
    { label: "Expertise & Topics", completed: true },
    { label: "Speaking Videos", completed: profile.videos.length > 0 },
    { label: "Publications", completed: profile.publications.length > 0 },
    { label: "Testimonials", completed: profile.testimonials.length > 0 },
    { label: "Social Media Links", completed: true },
    { label: "Speaking Requirements", completed: false }
  ]

  const completedItems = profileCompletionItems.filter(item => item.completed).length
  const totalItems = profileCompletionItems.length
  const completionPercentage = Math.round((completedItems / totalItems) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-1"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/speakers/dashboard">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Profile Management
                </h1>
                <p className="text-sm text-gray-600">Update your speaker profile and information</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview Profile
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <Card className="border-0 shadow-xl mb-8 overflow-hidden">
          {/* Banner */}
          <div className="h-48 bg-gradient-to-r from-purple-600 to-blue-600 relative">
            {profile.banner_url && (
              <img 
                src={profile.banner_url} 
                alt="Banner" 
                className="w-full h-full object-cover opacity-50"
              />
            )}
            <Button
              className="absolute top-4 right-4 bg-white/20 backdrop-blur hover:bg-white/30"
              size="sm"
              onClick={() => handleImageUpload('banner')}
            >
              <Camera className="h-4 w-4 mr-2" />
              Change Banner
            </Button>
          </div>
          
          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex items-end -mt-16 mb-4">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                  <AvatarImage src={profile.headshot_url} alt={profile.first_name} />
                  <AvatarFallback className="text-3xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    {profile.first_name[0]}{profile.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0 bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleImageUpload('headshot')}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="ml-6 flex-1">
                <h2 className="text-3xl font-bold">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-lg text-gray-600">
                  {profile.title} at {profile.company}
                </p>
                <div className="flex items-center gap-6 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="gap-1">
                    <Eye className="h-3 w-3" />
                    {profile.profile_views} views
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Star className="h-3 w-3" />
                    {profile.avg_rating} rating
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {profile.total_engagements} speaking engagements
                </div>
              </div>
            </div>
            
            {/* Profile Completion */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-900">Profile Completion</span>
                  <span className="text-sm font-bold text-purple-600">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {profileCompletionItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-xs">
                      {item.completed ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <X className="h-3 w-3 text-gray-400" />
                      )}
                      <span className={item.completed ? "text-green-800" : "text-gray-600"}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Card>

        {/* Success Alert */}
        {showSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your profile has been updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="basic">
              <User className="h-4 w-4 mr-2" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="professional">
              <Briefcase className="h-4 w-4 mr-2" />
              Professional
            </TabsTrigger>
            <TabsTrigger value="expertise">
              <Target className="h-4 w-4 mr-2" />
              Expertise
            </TabsTrigger>
            <TabsTrigger value="media">
              <Video className="h-4 w-4 mr-2" />
              Media
            </TabsTrigger>
            <TabsTrigger value="logistics">
              <Calendar className="h-4 w-4 mr-2" />
              Logistics
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Your personal and contact information</CardDescription>
                  </div>
                  <Button
                    variant={editMode.basic ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditMode(prev => ({ ...prev, basic: !prev.basic }))}
                  >
                    {editMode.basic ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profile.first_name}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                      disabled={!editMode.basic}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profile.last_name}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      disabled={!editMode.basic}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        disabled={!editMode.basic}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={!editMode.basic}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative mt-2">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        disabled={!editMode.basic}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={profile.timezone}
                      onValueChange={(value) => setProfile({ ...profile, timezone: value })}
                      disabled={!editMode.basic}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PST">PST - Pacific Standard Time</SelectItem>
                        <SelectItem value="MST">MST - Mountain Standard Time</SelectItem>
                        <SelectItem value="CST">CST - Central Standard Time</SelectItem>
                        <SelectItem value="EST">EST - Eastern Standard Time</SelectItem>
                        <SelectItem value="GMT">GMT - Greenwich Mean Time</SelectItem>
                        <SelectItem value="CET">CET - Central European Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="languages">Languages</Label>
                  <div className="mt-2 space-y-2">
                    {editMode.basic ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {LANGUAGES.map((lang) => (
                          <div key={lang} className="flex items-center space-x-2">
                            <Checkbox
                              id={lang}
                              checked={profile.languages.includes(lang)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setProfile({ ...profile, languages: [...profile.languages, lang] })
                                } else {
                                  setProfile({ ...profile, languages: profile.languages.filter(l => l !== lang) })
                                }
                              }}
                            />
                            <Label htmlFor={lang} className="text-sm font-normal cursor-pointer">
                              {lang}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((lang, idx) => (
                          <Badge key={idx} variant="secondary">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              {editMode.basic && (
                <CardFooter className="bg-gray-50">
                  <Button
                    className="ml-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => handleSave('basic')}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          {/* Professional Background Tab */}
          <TabsContent value="professional">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Professional Background</CardTitle>
                    <CardDescription>Your career information and achievements</CardDescription>
                  </div>
                  <Button
                    variant={editMode.professional ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditMode(prev => ({ ...prev, professional: !prev.professional }))}
                  >
                    {editMode.professional ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Current Title</Label>
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      disabled={!editMode.professional}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      disabled={!editMode.professional}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Full Biography</Label>
                  <Textarea
                    id="bio"
                    rows={6}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!editMode.professional}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {profile.bio.length} characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="short_bio">Short Bio (for introductions)</Label>
                  <Textarea
                    id="short_bio"
                    rows={2}
                    value={profile.short_bio}
                    onChange={(e) => setProfile({ ...profile, short_bio: e.target.value })}
                    disabled={!editMode.professional}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Education</Label>
                  <div className="mt-2 space-y-3">
                    {profile.education.map((edu, idx) => (
                      <div key={idx} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{edu.degree}</p>
                          <p className="text-sm text-gray-600">{edu.institution}, {edu.year}</p>
                        </div>
                        {editMode.professional && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('education', idx)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {editMode.professional && (
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Certifications</Label>
                  <div className="mt-2 space-y-2">
                    {editMode.professional ? (
                      <>
                        {profile.certifications.map((cert, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Input
                              value={cert}
                              onChange={(e) => {
                                const newCerts = [...profile.certifications]
                                newCerts[idx] = e.target.value
                                setProfile({ ...profile, certifications: newCerts })
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem('certifications', idx)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addItem('certifications', '')}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Certification
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.certifications.map((cert, idx) => (
                          <Badge key={idx} variant="secondary">
                            <Award className="h-3 w-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Key Achievements</Label>
                  <div className="mt-2 space-y-2">
                    {editMode.professional ? (
                      <>
                        {profile.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Input
                              value={achievement}
                              onChange={(e) => {
                                const newAchievements = [...profile.achievements]
                                newAchievements[idx] = e.target.value
                                setProfile({ ...profile, achievements: newAchievements })
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem('achievements', idx)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addItem('achievements', '')}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Achievement
                        </Button>
                      </>
                    ) : (
                      <ul className="space-y-1">
                        {profile.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
              {editMode.professional && (
                <CardFooter className="bg-gray-50">
                  <Button
                    className="ml-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => handleSave('professional')}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          {/* Expertise Tab */}
          <TabsContent value="expertise">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Expertise & Topics</CardTitle>
                    <CardDescription>Your areas of expertise and speaking topics</CardDescription>
                  </div>
                  <Button
                    variant={editMode.expertise ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditMode(prev => ({ ...prev, expertise: !prev.expertise }))}
                  >
                    {editMode.expertise ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Areas of Expertise</Label>
                  <div className="mt-2">
                    {editMode.expertise ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {EXPERTISE_AREAS.map((area) => (
                          <div key={area} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                            <Checkbox
                              id={area}
                              checked={profile.expertise_areas.includes(area)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setProfile({ ...profile, expertise_areas: [...profile.expertise_areas, area] })
                                } else {
                                  setProfile({ ...profile, expertise_areas: profile.expertise_areas.filter(a => a !== area) })
                                }
                              }}
                            />
                            <Label htmlFor={area} className="text-sm font-normal cursor-pointer flex-1">
                              {area}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.expertise_areas.map((area, idx) => (
                          <Badge key={idx} className="bg-purple-100 text-purple-800 border-purple-200">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Speaking Topics</Label>
                  <div className="mt-2 space-y-2">
                    {editMode.expertise ? (
                      <>
                        {profile.speaking_topics.map((topic, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Input
                              value={topic}
                              onChange={(e) => {
                                const newTopics = [...profile.speaking_topics]
                                newTopics[idx] = e.target.value
                                setProfile({ ...profile, speaking_topics: newTopics })
                              }}
                              placeholder="Enter a speaking topic"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem('speaking_topics', idx)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addItem('speaking_topics', '')}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Topic
                        </Button>
                      </>
                    ) : (
                      <ul className="space-y-2">
                        {profile.speaking_topics.map((topic, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Mic className="h-4 w-4 text-purple-600" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Signature Talks</Label>
                  <div className="mt-2 space-y-3">
                    {editMode.expertise ? (
                      <>
                        {profile.signature_talks.map((talk, idx) => (
                          <Card key={idx} className="p-4">
                            <div className="space-y-2">
                              <Input
                                value={talk.title}
                                onChange={(e) => {
                                  const newTalks = [...profile.signature_talks]
                                  newTalks[idx].title = e.target.value
                                  setProfile({ ...profile, signature_talks: newTalks })
                                }}
                                placeholder="Talk title"
                                className="font-medium"
                              />
                              <Textarea
                                value={talk.description}
                                onChange={(e) => {
                                  const newTalks = [...profile.signature_talks]
                                  newTalks[idx].description = e.target.value
                                  setProfile({ ...profile, signature_talks: newTalks })
                                }}
                                placeholder="Talk description"
                                rows={2}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem('signature_talks', idx)}
                                className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Talk
                              </Button>
                            </div>
                          </Card>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => addItem('signature_talks', { title: '', description: '' })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Signature Talk
                        </Button>
                      </>
                    ) : (
                      profile.signature_talks.map((talk, idx) => (
                        <Card key={idx} className="p-4 bg-purple-50 border-purple-200">
                          <h4 className="font-medium text-purple-900 mb-1">{talk.title}</h4>
                          <p className="text-sm text-gray-700">{talk.description}</p>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
              {editMode.expertise && (
                <CardFooter className="bg-gray-50">
                  <Button
                    className="ml-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => handleSave('expertise')}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media">
            <div className="space-y-6">
              {/* Social Media Links */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Social Media & Web Presence</CardTitle>
                  <CardDescription>Your online profiles and links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="website">Personal Website</Label>
                      <div className="relative mt-2">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="website"
                          type="url"
                          value={profile.website}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                          className="pl-10"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn Profile</Label>
                      <div className="relative mt-2">
                        <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="linkedin"
                          type="url"
                          value={profile.linkedin_url}
                          onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                          className="pl-10"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter/X Profile</Label>
                      <div className="relative mt-2">
                        <Twitter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="twitter"
                          type="url"
                          value={profile.twitter_url}
                          onChange={(e) => setProfile({ ...profile, twitter_url: e.target.value })}
                          className="pl-10"
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="youtube">YouTube Channel</Label>
                      <div className="relative mt-2">
                        <Youtube className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="youtube"
                          type="url"
                          value={profile.youtube_url}
                          onChange={(e) => setProfile({ ...profile, youtube_url: e.target.value })}
                          className="pl-10"
                          placeholder="https://youtube.com/@channel"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Videos */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Speaking Videos</CardTitle>
                      <CardDescription>Showcase your speaking engagements</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Video
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.videos.map((video, idx) => (
                      <Card key={idx} className="overflow-hidden">
                        <div className="aspect-video bg-gray-100 relative">
                          <Video className="h-12 w-12 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <CardContent className="pt-4">
                          <h4 className="font-medium mb-1">{video.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{video.date}</span>
                            <span>{video.views} views</span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Publications */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Publications & Articles</CardTitle>
                      <CardDescription>Your written content and thought leadership</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Publication
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.publications.map((pub, idx) => (
                      <div key={idx} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{pub.title}</h4>
                          <p className="text-sm text-gray-600">
                            {pub.publisher} • {pub.date}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Testimonials */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Client Testimonials</CardTitle>
                      <CardDescription>What clients say about your speaking</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Testimonial
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.testimonials.map((testimonial, idx) => (
                      <Card key={idx} className="bg-purple-50 border-purple-200">
                        <CardContent className="pt-6">
                          <blockquote className="text-gray-700 italic mb-4">
                            "{testimonial.text}"
                          </blockquote>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-purple-900">{testimonial.author}</p>
                              <p className="text-sm text-gray-600">{testimonial.title}</p>
                              <p className="text-sm text-gray-500">{testimonial.event}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Logistics Tab */}
          <TabsContent value="logistics">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Speaking Logistics & Requirements</CardTitle>
                    <CardDescription>Your speaking preferences and requirements</CardDescription>
                  </div>
                  <Button
                    variant={editMode.logistics ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditMode(prev => ({ ...prev, logistics: !prev.logistics }))}
                  >
                    {editMode.logistics ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="fee_range">Speaking Fee Range</Label>
                  <Select
                    value={profile.speaking_fee_range}
                    onValueChange={(value) => setProfile({ ...profile, speaking_fee_range: value })}
                    disabled={!editMode.logistics}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FEE_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Available Speaking Formats</Label>
                  <div className="mt-2 space-y-2">
                    {editMode.logistics ? (
                      SPEAKING_FORMATS.map((format) => (
                        <div key={format.value} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <Checkbox
                            id={format.value}
                            checked={profile.available_formats.includes(format.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setProfile({ ...profile, available_formats: [...profile.available_formats, format.value] })
                              } else {
                                setProfile({ ...profile, available_formats: profile.available_formats.filter(f => f !== format.value) })
                              }
                            }}
                          />
                          <Label htmlFor={format.value} className="text-sm font-normal cursor-pointer flex-1">
                            {format.label}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.available_formats.map((format) => {
                          const formatLabel = SPEAKING_FORMATS.find(f => f.value === format)?.label || format
                          return (
                            <Badge key={format} variant="secondary">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatLabel}
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="travel_preferences">Travel Preferences</Label>
                  <Textarea
                    id="travel_preferences"
                    rows={3}
                    value={profile.travel_preferences}
                    onChange={(e) => setProfile({ ...profile, travel_preferences: e.target.value })}
                    disabled={!editMode.logistics}
                    className="mt-2"
                    placeholder="e.g., Business class for flights over 4 hours, 4-star or above accommodation"
                  />
                </div>

                <div>
                  <Label htmlFor="booking_requirements">Booking Requirements</Label>
                  <Textarea
                    id="booking_requirements"
                    rows={3}
                    value={profile.booking_requirements}
                    onChange={(e) => setProfile({ ...profile, booking_requirements: e.target.value })}
                    disabled={!editMode.logistics}
                    className="mt-2"
                    placeholder="e.g., Minimum 6 weeks advance notice, signed agreement required"
                  />
                </div>

                <div>
                  <Label htmlFor="technical_requirements">Technical Requirements</Label>
                  <Textarea
                    id="technical_requirements"
                    rows={3}
                    value={profile.technical_requirements}
                    onChange={(e) => setProfile({ ...profile, technical_requirements: e.target.value })}
                    disabled={!editMode.logistics}
                    className="mt-2"
                    placeholder="e.g., Wireless lavalier mic, confidence monitor, HDMI connection"
                  />
                </div>
              </CardContent>
              {editMode.logistics && (
                <CardFooter className="bg-gray-50">
                  <Button
                    className="ml-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => handleSave('logistics')}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}