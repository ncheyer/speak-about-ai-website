"use client"

import { useState, useEffect, DragEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, Users, Building2, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface Deal {
  id: number
  client_name: string
  client_email: string
  company: string
  event_title: string
  event_date: string
  event_location: string
  event_type: string
  attendee_count: number
  deal_value: number
  status: string
  priority: string
  created_at: string
}

const STAGES = [
  { id: "lead", title: "Lead", color: "bg-slate-500" },
  { id: "qualified", title: "Qualified", color: "bg-blue-500" },
  { id: "proposal", title: "Proposal", color: "bg-yellow-500" },
  { id: "negotiation", title: "Negotiation", color: "bg-orange-500" },
  { id: "won", title: "Won", color: "bg-green-500" },
  { id: "lost", title: "Lost", color: "bg-red-500" },
]

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

export function DealsKanban() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null)

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      const response = await fetch("/api/deals")
      if (response.ok) {
        const data = await response.json()
        // Handle both array response and object with deals property
        setDeals(Array.isArray(data) ? data : data.deals || [])
      } else {
        setDeals([])
      }
    } catch (error) {
      console.error("Error fetching deals:", error)
      setDeals([])
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (e: DragEvent<HTMLDivElement>, deal: Deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>, newStatus: string) => {
    e.preventDefault()
    if (!draggedDeal || draggedDeal.status === newStatus) return

    const updatedDeals = deals.map(deal =>
      deal.id === draggedDeal.id ? { ...deal, status: newStatus } : deal
    )
    setDeals(updatedDeals)

    try {
      const response = await fetch(`/api/deals/${draggedDeal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        fetchDeals()
      }
    } catch (error) {
      console.error("Error updating deal status:", error)
      fetchDeals()
    }

    setDraggedDeal(null)
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

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading deals...</div>
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max p-4">
        {STAGES.map(stage => {
          const stageDeals = (deals || []).filter(deal => deal.status === stage.id)
          const totalValue = stageDeals.reduce((sum, deal) => sum + Number(deal.deal_value), 0)

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
                  <Badge variant="secondary">{stageDeals.length}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(totalValue)} total
                </p>
              </div>

              <div className="space-y-3">
                {stageDeals.map(deal => (
                  <Card
                    key={deal.id}
                    className="cursor-move hover:shadow-lg transition-shadow"
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{deal.event_title}</CardTitle>
                        <Badge className={cn("text-xs", PRIORITY_COLORS[deal.priority as keyof typeof PRIORITY_COLORS])}>
                          {deal.priority}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {deal.client_name} • {deal.company}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(deal.event_date)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {deal.event_location}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-3 w-3" />
                          {deal.attendee_count}
                        </div>
                        <div className="font-semibold text-sm">
                          {formatCurrency(Number(deal.deal_value))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}