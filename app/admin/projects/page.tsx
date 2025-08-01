"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Plus,
  Edit,
  Eye,
  Target,
  ClipboardList,
  Timer,
  TrendingUp
} from "lucide-react"

interface Deal {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  company: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  eventType: string
  speakerRequested?: string
  attendeeCount: number
  dealValue: number
  status: string
  priority: string
  notes: string
  createdAt: string
}

interface ProjectTask {
  id: string
  title: string
  description: string
  completed: boolean
  dueDate?: string
  assignee?: string
  category: 'speaker' | 'logistics' | 'client' | 'marketing' | 'technical' | 'legal'
}

interface Project {
  id: string
  dealId: string
  status: 'planning' | 'preparation' | 'final-prep' | 'completed' | 'cancelled'
  daysUntilEvent: number
  tasks: ProjectTask[]
  completionPercentage: number
  lastUpdated: string
  notes: string
}

const PROJECT_STATUSES = {
  planning: { label: 'Planning', color: 'bg-blue-500' },
  preparation: { label: 'In Preparation', color: 'bg-yellow-500' },
  'final-prep': { label: 'Final Preparation', color: 'bg-orange-500' },
  completed: { label: 'Event Completed', color: 'bg-green-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500' }
}

const TASK_CATEGORIES = {
  speaker: { label: 'Speaker Coordination', color: 'bg-purple-100 text-purple-800' },
  logistics: { label: 'Event Logistics', color: 'bg-blue-100 text-blue-800' },
  client: { label: 'Client Communication', color: 'bg-green-100 text-green-800' },
  marketing: { label: 'Marketing & Promotion', color: 'bg-pink-100 text-pink-800' },
  technical: { label: 'Technical Setup', color: 'bg-orange-100 text-orange-800' },
  legal: { label: 'Contracts & Legal', color: 'bg-gray-100 text-gray-800' }
}

// Default task templates for new projects
const DEFAULT_TASKS: Omit<ProjectTask, 'id'>[] = [
  { title: 'Speaker Agreement Signed', description: 'Get signed speaker agreement with terms and conditions', completed: false, category: 'speaker' },
  { title: 'Event Brief to Speaker', description: 'Send detailed event brief including audience, objectives, and logistics', completed: false, category: 'speaker' },
  { title: 'Speaker Bio & Photos', description: 'Collect speaker bio, headshots, and presentation materials', completed: false, category: 'speaker' },
  { title: 'Travel Arrangements', description: 'Book flights, hotel, and ground transportation for speaker', completed: false, category: 'logistics' },
  { title: 'Venue Confirmation', description: 'Confirm venue booking and technical requirements', completed: false, category: 'logistics' },
  { title: 'AV & Technical Setup', description: 'Coordinate microphones, projectors, and presentation equipment', completed: false, category: 'technical' },
  { title: 'Client Final Confirmation', description: 'Get final approval from client on all arrangements', completed: false, category: 'client' },
  { title: 'Speaker Prep Call', description: 'Schedule prep call with speaker 1-2 weeks before event', completed: false, category: 'speaker' },
  { title: 'Marketing Materials', description: 'Prepare speaker announcement and promotional materials', completed: false, category: 'marketing' },
  { title: 'Payment Processing', description: 'Process speaker fee and confirm payment schedule', completed: false, category: 'legal' },
  { title: 'Event Day Coordination', description: 'Coordinate arrival, setup, and event day logistics', completed: false, category: 'logistics' },
  { title: 'Post-Event Follow-up', description: 'Collect feedback and handle post-event requirements', completed: false, category: 'client' }
]

export default function ProjectManagement() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check authentication and load data
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)

    // Load deals
    const savedDeals = localStorage.getItem("adminDeals")
    if (savedDeals) {
      setDeals(JSON.parse(savedDeals))
    }

    // Load or initialize projects
    const savedProjects = localStorage.getItem("adminProjects")
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      // Initialize projects for won deals
      const dealsData = savedDeals ? JSON.parse(savedDeals) : []
      const wonDeals = dealsData.filter((deal: Deal) => deal.status === 'won')
      
      const initialProjects: Project[] = wonDeals.map((deal: Deal) => {
        const eventDate = new Date(deal.eventDate)
        const today = new Date()
        const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        const tasks: ProjectTask[] = DEFAULT_TASKS.map((task, index) => ({
          ...task,
          id: `${deal.id}-task-${index}`,
          dueDate: index < 6 ? new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined
        }))

        return {
          id: `project-${deal.id}`,
          dealId: deal.id,
          status: daysUntilEvent > 60 ? 'planning' : daysUntilEvent > 14 ? 'preparation' : 'final-prep',
          daysUntilEvent,
          tasks,
          completionPercentage: 0,
          lastUpdated: new Date().toISOString(),
          notes: ''
        }
      })

      setProjects(initialProjects)
      localStorage.setItem("adminProjects", JSON.stringify(initialProjects))
    }
  }, [router])

  const updateProject = (updatedProject: Project) => {
    const updatedProjects = projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    )
    setProjects(updatedProjects)
    localStorage.setItem("adminProjects", JSON.stringify(updatedProjects))
  }

  const toggleTask = (projectId: string, taskId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return

    const updatedTasks = project.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )

    const completionPercentage = Math.round((updatedTasks.filter(t => t.completed).length / updatedTasks.length) * 100)

    const updatedProject = {
      ...project,
      tasks: updatedTasks,
      completionPercentage,
      lastUpdated: new Date().toISOString()
    }

    updateProject(updatedProject)
  }

  const addTask = (projectId: string, task: Omit<ProjectTask, 'id'>) => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return

    const newTask: ProjectTask = {
      ...task,
      id: `${projectId}-task-${Date.now()}`
    }

    const updatedTasks = [...project.tasks, newTask]
    const completionPercentage = Math.round((updatedTasks.filter(t => t.completed).length / updatedTasks.length) * 100)

    const updatedProject = {
      ...project,
      tasks: updatedTasks,
      completionPercentage,
      lastUpdated: new Date().toISOString()
    }

    updateProject(updatedProject)
  }

  if (!isLoggedIn) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const upcomingProjects = projects.filter(p => p.daysUntilEvent > 0 && p.status !== 'completed')
  const completedProjects = projects.filter(p => p.status === 'completed')
  const urgentProjects = projects.filter(p => p.daysUntilEvent <= 14 && p.daysUntilEvent > 0)

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
                  Back to CRM
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
                <p className="mt-2 text-gray-600">Track event execution for closed deals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent (≤14 days)</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{urgentProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Events</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.completionPercentage, 0) / projects.length) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Active Projects</h2>
          
          {upcomingProjects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No active projects</p>
                <p className="text-sm text-gray-400">Projects are automatically created when deals are marked as "Won"</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {upcomingProjects
                .sort((a, b) => a.daysUntilEvent - b.daysUntilEvent)
                .map((project) => {
                  const deal = deals.find(d => d.id === project.dealId)
                  if (!deal) return null

                  return (
                    <Card key={project.id} className={`hover:shadow-lg transition-shadow ${
                      project.daysUntilEvent <= 7 ? 'border-red-200 bg-red-50' : 
                      project.daysUntilEvent <= 14 ? 'border-orange-200 bg-orange-50' : ''
                    }`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-xl">{deal.eventTitle}</CardTitle>
                              <Badge className={`${PROJECT_STATUSES[project.status].color} text-white`}>
                                {PROJECT_STATUSES[project.status].label}
                              </Badge>
                              {project.daysUntilEvent <= 7 && (
                                <Badge className="bg-red-500 text-white">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  URGENT
                                </Badge>
                              )}
                            </div>
                            <CardDescription>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                  <p className="font-semibold text-gray-900">{deal.clientName}</p>
                                  <p className="text-sm">{deal.company}</p>
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <Mail className="mr-1 h-3 w-3" />
                                    {deal.clientEmail}
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {new Date(deal.eventDate).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    {deal.eventLocation}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <Users className="mr-1 h-3 w-3" />
                                    {deal.attendeeCount} attendees
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {project.daysUntilEvent} days until event
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    {project.completionPercentage}% complete
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                      style={{ width: `${project.completionPercentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => setSelectedProject(project)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(TASK_CATEGORIES).map(([key, category]) => {
                            const tasksInCategory = project.tasks.filter(t => t.category === key)
                            const completedInCategory = tasksInCategory.filter(t => t.completed).length
                            if (tasksInCategory.length === 0) return null
                            
                            return (
                              <Badge key={key} className={category.color}>
                                {category.label}: {completedInCategory}/{tasksInCategory.length}
                              </Badge>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          )}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      {deals.find(d => d.id === selectedProject.dealId)?.eventTitle}
                    </CardTitle>
                    <p className="text-gray-600 mt-2">
                      {selectedProject.daysUntilEvent} days until event • {selectedProject.completionPercentage}% complete
                    </p>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedProject(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Task Categories */}
                {Object.entries(TASK_CATEGORIES).map(([categoryKey, category]) => {
                  const tasksInCategory = selectedProject.tasks.filter(t => t.category === categoryKey)
                  if (tasksInCategory.length === 0) return null

                  return (
                    <div key={categoryKey}>
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Badge className={category.color}>{category.label}</Badge>
                        <span className="text-sm text-gray-500">
                          ({tasksInCategory.filter(t => t.completed).length}/{tasksInCategory.length})
                        </span>
                      </h4>
                      <div className="space-y-3">
                        {tasksInCategory.map((task) => (
                          <div key={task.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(selectedProject.id, task.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                {task.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              {task.dueDate && (
                                <p className="text-sm text-gray-500 mt-2">
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}

                {/* Add Custom Task */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">Add Custom Task</h4>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    addTask(selectedProject.id, {
                      title: formData.get('title') as string,
                      description: formData.get('description') as string,
                      completed: false,
                      category: formData.get('category') as ProjectTask['category'],
                      dueDate: formData.get('dueDate') as string || undefined
                    })
                    e.currentTarget.reset()
                  }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input name="title" placeholder="Task title" required />
                      </div>
                      <div>
                        <Select name="category" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(TASK_CATEGORIES).map(([key, category]) => (
                              <SelectItem key={key} value={key}>{category.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Textarea name="description" placeholder="Task description" />
                    <div>
                      <Input name="dueDate" type="date" placeholder="Due date (optional)" />
                    </div>
                    <Button type="submit">Add Task</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}