"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Plus, Edit, Trash2, Search, Eye, Star, Users, Clock, Loader2, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Workshop {
  id: number
  title: string
  slug: string
  speaker_id: number | null
  speaker_name?: string
  short_description: string | null
  duration_minutes: number | null
  format: string | null
  target_audience: string | null
  price_range: string | null
  active: boolean
  featured: boolean
  created_at: string
}

interface Speaker {
  id: number
  name: string
}

export default function AdminWorkshopsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    speaker_id: "",
    short_description: "",
    description: "",
    duration_minutes: "",
    format: "virtual",
    max_participants: "",
    price_range: "",
    target_audience: "",
    learning_objectives: "",
    key_takeaways: "",
    topics: "",
    active: true,
    featured: false
  })

  useEffect(() => {
    loadWorkshops()
    loadSpeakers()
  }, [])

  const loadWorkshops = async () => {
    try {
      const token = localStorage.getItem("adminSessionToken")
      const response = await fetch("/api/workshops?includeInactive=true", {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-dev-admin-bypass": "dev-admin-access"
        }
      })

      if (response.ok) {
        const data = await response.json()
        setWorkshops(data)
      }
    } catch (error) {
      console.error("Error loading workshops:", error)
      toast({
        title: "Error",
        description: "Failed to load workshops",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadSpeakers = async () => {
    try {
      const token = localStorage.getItem("adminSessionToken")
      const response = await fetch("/api/admin/speakers", {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-dev-admin-bypass": "dev-admin-access"
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSpeakers(data.speakers || [])
      }
    } catch (error) {
      console.error("Error loading speakers:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("adminSessionToken")
      const payload = {
        ...formData,
        speaker_id: formData.speaker_id ? parseInt(formData.speaker_id) : null,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        learning_objectives: formData.learning_objectives.split("\n").filter(Boolean),
        key_takeaways: formData.key_takeaways.split("\n").filter(Boolean),
        topics: formData.topics.split(",").map(t => t.trim()).filter(Boolean)
      }

      const url = editingWorkshop
        ? `/api/workshops/${editingWorkshop.id}`
        : "/api/workshops"
      const method = editingWorkshop ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-dev-admin-bypass": "dev-admin-access"
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Workshop ${editingWorkshop ? "updated" : "created"} successfully`
        })
        setShowCreateForm(false)
        setEditingWorkshop(null)
        resetForm()
        loadWorkshops()
      } else {
        const error = await response.json()
        throw new Error(error.details || error.error)
      }
    } catch (error) {
      console.error("Error saving workshop:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save workshop",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (workshop: Workshop) => {
    setEditingWorkshop(workshop)
    setFormData({
      title: workshop.title,
      slug: workshop.slug,
      speaker_id: workshop.speaker_id?.toString() || "",
      short_description: workshop.short_description || "",
      description: "", // Load from full workshop data if needed
      duration_minutes: workshop.duration_minutes?.toString() || "",
      format: workshop.format || "virtual",
      max_participants: "",
      price_range: workshop.price_range || "",
      target_audience: workshop.target_audience || "",
      learning_objectives: "",
      key_takeaways: "",
      topics: "",
      active: workshop.active,
      featured: workshop.featured
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this workshop?")) return

    try {
      const token = localStorage.getItem("adminSessionToken")
      const response = await fetch(`/api/workshops/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-dev-admin-bypass": "dev-admin-access"
        }
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Workshop deleted successfully"
        })
        loadWorkshops()
      }
    } catch (error) {
      console.error("Error deleting workshop:", error)
      toast({
        title: "Error",
        description: "Failed to delete workshop",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      speaker_id: "",
      short_description: "",
      description: "",
      duration_minutes: "",
      format: "virtual",
      max_participants: "",
      price_range: "",
      target_audience: "",
      learning_objectives: "",
      key_takeaways: "",
      topics: "",
      active: true,
      featured: false
    })
  }

  const filteredWorkshops = workshops.filter(workshop =>
    workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workshop.speaker_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workshop.target_audience?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="fixed left-0 top-0 h-full z-[60]">
        <AdminSidebar />
      </div>

      <div className="flex-1 ml-72 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Workshops Management</h1>
              <p className="mt-2 text-gray-600">Manage AI workshops and training sessions</p>
            </div>
            <Button onClick={() => { setShowCreateForm(true); setEditingWorkshop(null); resetForm(); }}>
              <Plus className="mr-2 h-4 w-4" />
              New Workshop
            </Button>
          </div>

          {showCreateForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingWorkshop ? "Edit Workshop" : "Create New Workshop"}</CardTitle>
                <CardDescription>
                  {editingWorkshop ? "Update workshop details" : "Add a new workshop to your catalog"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title">Workshop Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="slug">URL Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="ai-for-executives"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="speaker">Speaker</Label>
                      <Select value={formData.speaker_id} onValueChange={(value) => setFormData({ ...formData, speaker_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a speaker" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No speaker assigned</SelectItem>
                          {speakers.map((speaker) => (
                            <SelectItem key={speaker.id} value={speaker.id.toString()}>
                              {speaker.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="format">Format</Label>
                      <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="virtual">Virtual</SelectItem>
                          <SelectItem value="in-person">In-Person</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration_minutes}
                        onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                        placeholder="90"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price_range">Price Range</Label>
                      <Input
                        id="price_range"
                        value={formData.price_range}
                        onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                        placeholder="$5,000 - $10,000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="target_audience">Target Audience</Label>
                      <Input
                        id="target_audience"
                        value={formData.target_audience}
                        onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                        placeholder="Executives, Developers, etc."
                      />
                    </div>

                    <div>
                      <Label htmlFor="max_participants">Max Participants</Label>
                      <Input
                        id="max_participants"
                        type="number"
                        value={formData.max_participants}
                        onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                        placeholder="50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="short_description">Short Description</Label>
                    <Textarea
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      rows={2}
                      placeholder="Brief overview (max 500 characters)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="learning_objectives">Learning Objectives (one per line)</Label>
                    <Textarea
                      id="learning_objectives"
                      value={formData.learning_objectives}
                      onChange={(e) => setFormData({ ...formData, learning_objectives: e.target.value })}
                      rows={3}
                      placeholder="Understand AI fundamentals&#10;Learn practical applications&#10;Develop AI strategy"
                    />
                  </div>

                  <div>
                    <Label htmlFor="topics">Topics (comma-separated)</Label>
                    <Input
                      id="topics"
                      value={formData.topics}
                      onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                      placeholder="AI, Machine Learning, Strategy, Leadership"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Active</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Featured</span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit">
                      {editingWorkshop ? "Update Workshop" : "Create Workshop"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setShowCreateForm(false); setEditingWorkshop(null); }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Workshops ({filteredWorkshops.length})</CardTitle>
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search workshops..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workshop</TableHead>
                      <TableHead>Speaker</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkshops.map((workshop) => (
                      <TableRow key={workshop.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{workshop.title}</div>
                            <div className="text-sm text-gray-500">{workshop.target_audience}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {workshop.speaker_name || <span className="text-gray-400">Unassigned</span>}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{workshop.format || "N/A"}</Badge>
                        </TableCell>
                        <TableCell>
                          {workshop.duration_minutes ? `${workshop.duration_minutes} min` : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {workshop.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {workshop.active ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(workshop)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Link href={`/workshops/${workshop.slug}`} target="_blank">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(workshop.id)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
