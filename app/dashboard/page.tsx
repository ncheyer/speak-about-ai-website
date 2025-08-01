"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, Users, Plus, Edit2, Trash2, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  capacity: number
  attendees: number
  published: boolean
}

export default function Dashboard() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
  })

  // Check if user is logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem("eventHubLoggedIn")
    if (!loggedIn) {
      router.push("/login")
      return
    }
    setIsLoggedIn(true)

    // Load events from localStorage
    const savedEvents = localStorage.getItem("eventHubEvents")
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    } else {
      // Initialize with sample data
      const sampleEvents: Event[] = [
        {
          id: "1",
          title: "AI Conference 2024",
          description: "A comprehensive conference about the future of artificial intelligence.",
          date: "2024-06-15",
          location: "San Francisco, CA",
          capacity: 200,
          attendees: 45,
          published: true,
        },
        {
          id: "2",
          title: "Machine Learning Workshop",
          description: "Hands-on workshop covering practical ML techniques.",
          date: "2024-07-20",
          location: "New York, NY",
          capacity: 50,
          attendees: 12,
          published: false,
        },
      ]
      setEvents(sampleEvents)
      localStorage.setItem("eventHubEvents", JSON.stringify(sampleEvents))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("eventHubLoggedIn")
    router.push("/login")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newEvent: Event = {
      id: editingEvent?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: formData.date,
      location: formData.location,
      capacity: parseInt(formData.capacity),
      attendees: editingEvent?.attendees || 0,
      published: false,
    }

    let updatedEvents
    if (editingEvent) {
      updatedEvents = events.map(e => e.id === editingEvent.id ? newEvent : e)
    } else {
      updatedEvents = [...events, newEvent]
    }

    setEvents(updatedEvents)
    localStorage.setItem("eventHubEvents", JSON.stringify(updatedEvents))
    
    setFormData({ title: "", description: "", date: "", location: "", capacity: "" })
    setShowCreateForm(false)
    setEditingEvent(null)
  }

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      capacity: event.capacity.toString(),
    })
    setEditingEvent(event)
    setShowCreateForm(true)
  }

  const handleDelete = (id: string) => {
    const updatedEvents = events.filter(e => e.id !== id)
    setEvents(updatedEvents)
    localStorage.setItem("eventHubEvents", JSON.stringify(updatedEvents))
  }

  const togglePublished = (id: string) => {
    const updatedEvents = events.map(e => 
      e.id === id ? { ...e, published: !e.published } : e
    )
    setEvents(updatedEvents)
    localStorage.setItem("eventHubEvents", JSON.stringify(updatedEvents))
  }

  if (!isLoggedIn) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const totalEvents = events.length
  const publishedEvents = events.filter(e => e.published).length
  const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your events and track attendance</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedEvents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAttendees}</div>
            </CardContent>
          </Card>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingEvent ? "Edit Event" : "Create New Event"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="AI Conference 2024"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your event..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="San Francisco, CA"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      placeholder="100"
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button type="submit">
                    {editingEvent ? "Update Event" : "Create Event"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateForm(false)
                      setEditingEvent(null)
                      setFormData({ title: "", description: "", date: "", location: "", capacity: "" })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Events List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Events</h2>
          {events.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No events created yet</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  Create Your First Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription className="mt-1">
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm mt-1">
                            <MapPin className="mr-1 h-3 w-3" />
                            {event.location}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(event)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(event.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="mr-1 h-4 w-4" />
                        {event.attendees} / {event.capacity}
                      </div>
                      <Button
                        size="sm"
                        variant={event.published ? "default" : "outline"}
                        onClick={() => togglePublished(event.id)}
                      >
                        {event.published ? "Published" : "Draft"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}