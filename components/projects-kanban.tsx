"use client"

import { useState, useEffect, DragEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, Clock, AlertTriangle, CheckCircle2, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Project {
  id: number
  project_name: string
  client_name: string
  client_email?: string
  company?: string
  project_type: string
  description?: string
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  start_date: string
  deadline?: string
  budget: number
  spent: number
  completion_percentage: number
  tags?: string[]
  created_at: string
}

const STAGES = [
  { id: "planning", title: "Planning", color: "bg-blue-500" },
  { id: "in_progress", title: "In Progress", color: "bg-yellow-500" },
  { id: "review", title: "In Review", color: "bg-purple-500" },
  { id: "completed", title: "Completed", color: "bg-green-500" },
  { id: "on_hold", title: "On Hold", color: "bg-orange-500" },
  { id: "cancelled", title: "Cancelled", color: "bg-red-500" },
]

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

export function ProjectsKanban() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedProject, setDraggedProject] = useState<Project | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(Array.isArray(data) ? data : [])
      } else {
        setProjects([])
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (e: DragEvent<HTMLDivElement>, project: Project) => {
    setDraggedProject(project)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>, newStatus: string) => {
    e.preventDefault()
    if (!draggedProject || draggedProject.status === newStatus) return

    const updatedProjects = projects.map(project =>
      project.id === draggedProject.id ? { ...project, status: newStatus as Project['status'] } : project
    )
    setProjects(updatedProjects)

    try {
      const response = await fetch(`/api/projects/${draggedProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        // Revert on error
        fetchProjects()
        toast({
          title: "Error",
          description: "Failed to update project status",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Success",
          description: `Project moved to ${STAGES.find(s => s.id === newStatus)?.title}`,
        })
      }
    } catch (error) {
      console.error("Error updating project status:", error)
      fetchProjects()
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive"
      })
    }

    setDraggedProject(null)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const calculateDaysUntilDeadline = (deadline?: string) => {
    if (!deadline) return null
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading projects...</div>
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max p-4">
        {STAGES.map(stage => {
          const stageProjects = (projects || []).filter(project => project.status === stage.id)
          const totalBudget = stageProjects.reduce((sum, project) => sum + Number(project.budget), 0)

          return (
            <div
              key={stage.id}
              className="flex-1 min-w-[320px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", stage.color)} />
                    {stage.title}
                  </h3>
                  <Badge variant="secondary">{stageProjects.length}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(totalBudget)} total budget
                </p>
              </div>

              <div className="space-y-3">
                {stageProjects.map(project => {
                  const daysUntilDeadline = calculateDaysUntilDeadline(project.deadline)
                  const isOverdue = daysUntilDeadline !== null && daysUntilDeadline < 0
                  const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 7 && daysUntilDeadline >= 0

                  return (
                    <Card
                      key={project.id}
                      className={cn(
                        "cursor-move hover:shadow-lg transition-shadow",
                        isOverdue && "border-red-200 bg-red-50",
                        isUrgent && !isOverdue && "border-orange-200 bg-orange-50"
                      )}
                      draggable
                      onDragStart={(e) => handleDragStart(e, project)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{project.project_name}</CardTitle>
                          <div className="flex gap-1">
                            <Badge className={cn("text-xs", PRIORITY_COLORS[project.priority])}>
                              {project.priority}
                            </Badge>
                            {isOverdue && (
                              <Badge className="bg-red-500 text-white text-xs">
                                <AlertTriangle className="w-2 h-2 mr-1" />
                                OVERDUE
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription className="text-sm">
                          {project.client_name} {project.company && `• ${project.company}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Target className="h-3 w-3" />
                          {project.project_type}
                        </div>
                        {project.deadline && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Due: {formatDate(project.deadline)}
                            {daysUntilDeadline !== null && (
                              <span className={cn(
                                "font-semibold",
                                isOverdue ? "text-red-600" : isUrgent ? "text-orange-600" : ""
                              )}>
                                ({Math.abs(daysUntilDeadline)} days {isOverdue ? 'overdue' : 'left'})
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-3 w-3" />
                            {project.completion_percentage}%
                          </div>
                          <div className="font-semibold text-sm">
                            {formatCurrency(Number(project.budget))}
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${project.completion_percentage}%` }}
                          ></div>
                        </div>

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {project.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                {tag}
                              </Badge>
                            ))}
                            {project.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                +{project.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}