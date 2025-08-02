"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  ArrowLeft,
  Plus,
  Edit,
  Target,
  DollarSign,
  Loader2,
  Trash2
} from "lucide-react"

interface Project {
  id: number
  project_name: string
  client_name: string
  client_email?: string
  client_phone?: string
  company?: string
  project_type: string
  description?: string
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  start_date: string
  end_date?: string
  deadline?: string
  budget: number
  spent: number
  completion_percentage: number
  team_members?: string[]
  deliverables?: string
  milestones?: any
  notes?: string
  tags?: string[]
  created_at: string
  updated_at: string
  completed_at?: string
}

const PROJECT_STATUSES = {
  planning: { label: 'Planning', color: 'bg-blue-500' },
  in_progress: { label: 'In Progress', color: 'bg-yellow-500' },
  review: { label: 'In Review', color: 'bg-purple-500' },
  completed: { label: 'Completed', color: 'bg-green-500' },
  on_hold: { label: 'On Hold', color: 'bg-orange-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500' }
}

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
}

const PROJECT_TYPES = [
  'Workshop',
  'Consulting',
  'Speaking',
  'Training',
  'Development',
  'Research',
  'Other'
]

export default function ProjectManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  // Check authentication and load data
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
    fetchProjects()
  }, [router])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/projects")
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch projects")
      }
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch projects",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createProject = async (projectData: Omit<Project, "id" | "created_at" | "updated_at">) => {
    try {
      setIsCreating(true)
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create project")
      }
      
      const newProject = await response.json()
      setProjects([newProject, ...projects])
      setShowCreateForm(false)
      toast({
        title: "Success",
        description: "Project created successfully"
      })
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  const updateProject = async (id: number, updates: Partial<Project>) => {
    try {
      setIsUpdating(true)
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update project")
      }
      
      const updatedProject = await response.json()
      setProjects(projects.map(p => p.id === id ? updatedProject : p))
      setSelectedProject(null)
      toast({
        title: "Success",
        description: "Project updated successfully"
      })
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update project",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE"
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete project")
      }
      
      setProjects(projects.filter(p => p.id !== id))
      toast({
        title: "Success",
        description: "Project deleted successfully"
      })
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive"
      })
    }
  }

  const calculateDaysUntilDeadline = (deadline?: string) => {
    if (!deadline) return null
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === "" || 
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.company && project.company.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = filterStatus === "all" || project.status === filterStatus
    const matchesPriority = filterPriority === "all" || project.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const activeProjects = filteredProjects.filter(p => !['completed', 'cancelled'].includes(p.status))
  const completedProjects = filteredProjects.filter(p => p.status === 'completed')
  const overdueProjects = activeProjects.filter(p => {
    const days = calculateDaysUntilDeadline(p.deadline)
    return days !== null && days < 0
  })

  if (!isLoggedIn) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
                <p className="mt-2 text-gray-600">Track and manage all active projects</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activeProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(PROJECT_STATUSES).map(([key, status]) => (
                <SelectItem key={key} value={key}>{status.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No projects found</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create your first project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredProjects.map((project) => {
              const daysUntilDeadline = calculateDaysUntilDeadline(project.deadline)
              const isOverdue = daysUntilDeadline !== null && daysUntilDeadline < 0
              const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 7 && daysUntilDeadline >= 0

              return (
                <Card key={project.id} className={`hover:shadow-lg transition-shadow ${
                  isOverdue ? 'border-red-200 bg-red-50' : 
                  isUrgent ? 'border-orange-200 bg-orange-50' : ''
                }`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{project.project_name}</CardTitle>
                          <Badge className={`${PROJECT_STATUSES[project.status].color} text-white`}>
                            {PROJECT_STATUSES[project.status].label}
                          </Badge>
                          <Badge className={PRIORITY_COLORS[project.priority]}>
                            {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                          </Badge>
                          {isOverdue && (
                            <Badge className="bg-red-500 text-white">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              OVERDUE
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="font-semibold text-gray-900">{project.client_name}</p>
                              {project.company && <p className="text-sm">{project.company}</p>}
                              {project.client_email && (
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <Mail className="mr-1 h-3 w-3" />
                                  {project.client_email}
                                </div>
                              )}
                              {project.client_phone && (
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <Phone className="mr-1 h-3 w-3" />
                                  {project.client_phone}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="mr-1 h-3 w-3" />
                                Start: {new Date(project.start_date).toLocaleDateString()}
                              </div>
                              {project.deadline && (
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <Clock className="mr-1 h-3 w-3" />
                                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                                  {daysUntilDeadline !== null && (
                                    <span className={`ml-2 font-semibold ${
                                      isOverdue ? 'text-red-600' : isUrgent ? 'text-orange-600' : ''
                                    }`}>
                                      ({Math.abs(daysUntilDeadline)} days {isOverdue ? 'overdue' : 'left'})
                                    </span>
                                  )}
                                </div>
                              )}
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Target className="mr-1 h-3 w-3" />
                                Type: {project.project_type}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center text-sm text-gray-600">
                                <DollarSign className="mr-1 h-3 w-3" />
                                Budget: ${project.budget.toLocaleString()}
                              </div>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <DollarSign className="mr-1 h-3 w-3" />
                                Spent: ${project.spent.toLocaleString()}
                              </div>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                {project.completion_percentage}% complete
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${project.completion_percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          {project.description && (
                            <p className="text-sm text-gray-600 mt-3">{project.description}</p>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedProject(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteProject(project.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {project.tags && project.tags.length > 0 && (
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        )}

        {/* Create Project Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl">Create New Project</CardTitle>
                  <Button variant="ghost" onClick={() => setShowCreateForm(false)} disabled={isCreating}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const projectData = {
                    project_name: formData.get('project_name') as string,
                    client_name: formData.get('client_name') as string,
                    client_email: formData.get('client_email') as string || undefined,
                    client_phone: formData.get('client_phone') as string || undefined,
                    company: formData.get('company') as string || undefined,
                    project_type: formData.get('project_type') as string,
                    description: formData.get('description') as string || undefined,
                    status: formData.get('status') as Project['status'],
                    priority: formData.get('priority') as Project['priority'],
                    start_date: formData.get('start_date') as string,
                    end_date: formData.get('end_date') as string || undefined,
                    deadline: formData.get('deadline') as string || undefined,
                    budget: parseFloat(formData.get('budget') as string) || 0,
                    spent: parseFloat(formData.get('spent') as string) || 0,
                    completion_percentage: parseInt(formData.get('completion_percentage') as string) || 0,
                    notes: formData.get('notes') as string || undefined,
                    tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || undefined
                  }
                  createProject(projectData)
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Project Name *</label>
                      <Input name="project_name" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Project Type *</label>
                      <Select name="project_type" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Client Name *</label>
                      <Input name="client_name" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Company</label>
                      <Input name="company" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Client Email</label>
                      <Input name="client_email" type="email" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Client Phone</label>
                      <Input name="client_phone" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status *</label>
                      <Select name="status" defaultValue="planning" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PROJECT_STATUSES).map(([key, status]) => (
                            <SelectItem key={key} value={key}>{status.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priority *</label>
                      <Select name="priority" defaultValue="medium" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Start Date *</label>
                      <Input name="start_date" type="date" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Deadline</label>
                      <Input name="deadline" type="date" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Budget *</label>
                      <Input name="budget" type="number" step="0.01" defaultValue="0" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Spent *</label>
                      <Input name="spent" type="number" step="0.01" defaultValue="0" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Completion % *</label>
                      <Input name="completion_percentage" type="number" min="0" max="100" defaultValue="0" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tags (comma-separated)</label>
                      <Input name="tags" placeholder="ai, workshop, strategy" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea name="description" rows={3} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea name="notes" rows={3} />
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)} disabled={isCreating}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Project'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Project Form */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl">Edit Project</CardTitle>
                  <Button variant="ghost" onClick={() => setSelectedProject(null)} disabled={isUpdating}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const updates: Partial<Project> = {}
                  
                  // Only include fields that have changed
                  const fields = ['project_name', 'client_name', 'client_email', 'client_phone', 'company',
                    'project_type', 'description', 'status', 'priority', 'start_date', 'end_date', 'deadline',
                    'budget', 'spent', 'completion_percentage', 'notes']
                  
                  fields.forEach(field => {
                    const value = formData.get(field) as string
                    if (value !== null && value !== '') {
                      if (field === 'budget' || field === 'spent') {
                        updates[field as keyof Project] = parseFloat(value) as any
                      } else if (field === 'completion_percentage') {
                        updates[field] = parseInt(value)
                      } else {
                        updates[field as keyof Project] = value as any
                      }
                    }
                  })
                  
                  const tagsValue = formData.get('tags') as string
                  if (tagsValue) {
                    updates.tags = tagsValue.split(',').map(t => t.trim()).filter(Boolean)
                  }
                  
                  updateProject(selectedProject.id, updates)
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Project Name</label>
                      <Input name="project_name" defaultValue={selectedProject.project_name} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Project Type</label>
                      <Select name="project_type" defaultValue={selectedProject.project_type}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Client Name</label>
                      <Input name="client_name" defaultValue={selectedProject.client_name} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Company</label>
                      <Input name="company" defaultValue={selectedProject.company || ''} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Client Email</label>
                      <Input name="client_email" type="email" defaultValue={selectedProject.client_email || ''} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Client Phone</label>
                      <Input name="client_phone" defaultValue={selectedProject.client_phone || ''} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Select name="status" defaultValue={selectedProject.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PROJECT_STATUSES).map(([key, status]) => (
                            <SelectItem key={key} value={key}>{status.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Select name="priority" defaultValue={selectedProject.priority}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input name="start_date" type="date" defaultValue={selectedProject.start_date.split('T')[0]} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Deadline</label>
                      <Input name="deadline" type="date" defaultValue={selectedProject.deadline?.split('T')[0] || ''} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Budget</label>
                      <Input name="budget" type="number" step="0.01" defaultValue={selectedProject.budget} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Spent</label>
                      <Input name="spent" type="number" step="0.01" defaultValue={selectedProject.spent} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Completion %</label>
                      <Input name="completion_percentage" type="number" min="0" max="100" defaultValue={selectedProject.completion_percentage} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tags (comma-separated)</label>
                      <Input name="tags" defaultValue={selectedProject.tags?.join(', ') || ''} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea name="description" rows={3} defaultValue={selectedProject.description || ''} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea name="notes" rows={3} defaultValue={selectedProject.notes || ''} />
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setSelectedProject(null)} disabled={isUpdating}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Project'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}