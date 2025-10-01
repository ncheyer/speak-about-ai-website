"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Building2, User, Mail, Phone, Globe, MapPin, Calendar,
  FileText, Shield, TrendingUp, History, Settings, LogOut,
  CheckCircle, AlertCircle, Clock, Edit, Save, X, Loader2,
  Upload, Download, Eye, Activity, Award, DollarSign
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

interface VendorProfile {
  id: number
  company_name: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  website?: string
  description?: string
  location?: string
  services?: string[]
  pricing_range?: string
  status: string
  logo_url?: string
  compliance_score?: number
  average_rating?: number
  total_reviews?: number
  total_events?: number
  performance_tier?: string
  onboarding_progress?: number
  pending_documents?: number
}

interface ChangelogEntry {
  id: number
  field_name: string
  old_value: any
  new_value: any
  changed_by: string
  changed_at: string
}

interface ActivityEntry {
  id: number
  activity_type: string
  description: string
  created_at: string
  metadata?: any
}

export default function VendorDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([])
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  
  const [editedProfile, setEditedProfile] = useState<Partial<VendorProfile>>({})

  useEffect(() => {
    const token = localStorage.getItem("vendorToken")
    if (!token) {
      router.push("/vendors/login")
      return
    }
    
    loadProfile()
  }, [router])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("vendorToken")
      const response = await fetch("/api/vendors/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.status === 401) {
        localStorage.removeItem("vendorToken")
        localStorage.removeItem("vendorInfo")
        router.push("/vendors/login")
        return
      }

      const data = await response.json()
      setProfile(data.profile)
      setEditedProfile(data.profile)
      setChangelog(data.changelog || [])
      setActivity(data.activity || [])
    } catch (error) {
      console.error("Error loading profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("vendorToken")
      const response = await fetch("/api/vendors/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editedProfile)
      })

      const data = await response.json()

      if (response.ok) {
        setProfile(data.vendor)
        setEditMode(false)
        toast({
          title: "Success",
          description: `Profile updated with ${data.changes} changes`
        })
        loadProfile() // Reload to get updated changelog
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("vendorToken")
    localStorage.removeItem("vendorInfo")
    router.push("/vendors/login")
  }

  const getComplianceColor = (score?: number) => {
    if (!score) return "secondary"
    if (score >= 80) return "success"
    if (score >= 60) return "warning"
    return "destructive"
  }

  const getPerformanceTierIcon = (tier?: string) => {
    switch (tier) {
      case "platinum": return "🏆"
      case "gold": return "🥇"
      case "silver": return "🥈"
      case "bronze": return "🥉"
      default: return "📊"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load profile</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.company_name}
              </h1>
              <p className="text-gray-600 mt-1">Vendor Dashboard</p>
            </div>
            <div className="flex gap-3">
              {!editMode ? (
                <Button onClick={() => setEditMode(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditMode(false)
                      setEditedProfile(profile)
                    }}
                    disabled={saving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Compliance</p>
                  <p className="text-2xl font-bold">
                    {profile.compliance_score || 0}%
                  </p>
                </div>
                <Shield className={`h-8 w-8 text-${getComplianceColor(profile.compliance_score)}-500`} />
              </div>
              <Progress 
                value={profile.compliance_score || 0} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-2xl font-bold">
                    {profile.average_rating?.toFixed(1) || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profile.total_reviews || 0} reviews
                  </p>
                </div>
                <div className="text-2xl">⭐</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Events</p>
                  <p className="text-2xl font-bold">
                    {profile.total_events || 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tier</p>
                  <p className="text-xl font-bold capitalize">
                    {profile.performance_tier || "Bronze"}
                  </p>
                </div>
                <div className="text-2xl">
                  {getPerformanceTierIcon(profile.performance_tier)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="photos">Photos & Portfolio</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="changelog">Changelog</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={profile.onboarding_progress || 0} className="mb-2" />
                  <p className="text-sm text-gray-600">
                    {profile.onboarding_progress || 0}% complete
                  </p>
                  
                  {profile.pending_documents && profile.pending_documents > 0 && (
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You have {profile.pending_documents} pending documents to review
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Update Compliance
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Manage your company profile and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={editedProfile.company_name || ""}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        company_name: e.target.value
                      })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_name">Contact Name</Label>
                    <Input
                      id="contact_name"
                      value={editedProfile.contact_name || ""}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        contact_name: e.target.value
                      })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={editedProfile.contact_email || ""}
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Phone</Label>
                    <Input
                      id="contact_phone"
                      value={editedProfile.contact_phone || ""}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        contact_phone: e.target.value
                      })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editedProfile.website || ""}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        website: e.target.value
                      })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editedProfile.location || ""}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        location: e.target.value
                      })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={editedProfile.description || ""}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        description: e.target.value
                      })}
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Photos & Portfolio</CardTitle>
                <CardDescription>
                  Upload and manage your logo, portfolio images, and showcase your work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Logo Upload Section */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Company Logo</Label>
                    <div className="flex items-start gap-6">
                      <Avatar className="h-24 w-24 border-2 border-gray-200">
                        <AvatarImage src={profile.logo_url} />
                        <AvatarFallback className="text-2xl">
                          {profile.company_name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            
                            const formData = new FormData()
                            formData.append("file", file)
                            
                            try {
                              const response = await fetch("/api/vendors/upload", {
                                method: "POST",
                                body: formData
                              })
                              
                              if (response.ok) {
                                const data = await response.json()
                                setEditedProfile({ ...editedProfile, logo_url: data.url })
                                toast({
                                  title: "Logo uploaded",
                                  description: "Click 'Save Changes' to update your profile"
                                })
                              } else {
                                throw new Error("Upload failed")
                              }
                            } catch (error) {
                              toast({
                                title: "Upload failed",
                                description: "Please try again",
                                variant: "destructive"
                              })
                            }
                          }}
                          className="mb-2"
                        />
                        <p className="text-sm text-gray-500">
                          Recommended: Square image, at least 400x400px, PNG or JPG
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Portfolio Gallery Section */}
                  <div className="border-t pt-6">
                    <Label className="text-base font-semibold mb-3 block">Portfolio Gallery</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {/* Placeholder for portfolio images */}
                      <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 cursor-pointer transition-colors">
                        <label htmlFor="portfolio-upload" className="cursor-pointer text-center p-4">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <span className="text-sm text-gray-500">Add Photo</span>
                          <input
                            id="portfolio-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || [])
                              if (files.length === 0) return
                              
                              toast({
                                title: "Portfolio upload",
                                description: "Portfolio gallery feature coming soon!"
                              })
                            }}
                          />
                        </label>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Upload photos of your work, events, and services. These will be displayed on your public vendor profile.
                    </p>
                  </div>
                  
                  {/* Additional Documents */}
                  <div className="border-t pt-6">
                    <Label className="text-base font-semibold mb-3 block">Business Documents</Label>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Upload Insurance Certificate
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Upload Business License
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Award className="h-4 w-4 mr-2" />
                        Upload Certifications
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      These documents help verify your business and build trust with potential clients.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent actions and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activity.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3">
                      <Activity className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.description}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(item.created_at), "PPp")}
                        </p>
                      </div>
                    </div>
                  ))}
                  {activity.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No recent activity
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="changelog">
            <Card>
              <CardHeader>
                <CardTitle>Change History</CardTitle>
                <CardDescription>
                  Track all changes made to your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {changelog.map((change) => (
                    <div key={change.id} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {change.field_name.replace(/_/g, " ").charAt(0).toUpperCase() + 
                             change.field_name.replace(/_/g, " ").slice(1)}
                          </p>
                          <div className="text-sm text-gray-600 space-y-1 mt-1">
                            <p>Old: {JSON.stringify(change.old_value)}</p>
                            <p>New: {JSON.stringify(change.new_value)}</p>
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <p>{change.changed_by}</p>
                          <p>{format(new Date(change.changed_at), "PPp")}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {changelog.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No changes recorded
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}