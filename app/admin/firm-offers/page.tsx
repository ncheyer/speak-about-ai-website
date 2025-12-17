"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileSignature,
  Plus,
  Search,
  Eye,
  Edit,
  DollarSign,
  Clock,
  CheckCircle,
  Calendar,
  MoreHorizontal,
  Send,
  Building2,
  User,
  MapPin
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Deal {
  id: number
  title: string
  company: string
  contact_name: string
  contact_email: string
  value: string
  status: string
  event_date: string
  event_location: string
  speaker_id: number
  speaker_name?: string
  project_id?: number
  created_at: string
  updated_at: string
}

export default function FirmOffersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    try {
      const response = await fetch("/api/deals")
      if (response.ok) {
        const data = await response.json()
        setDeals(data)
      }
    } catch (error) {
      console.error("Error loading deals:", error)
      toast({
        title: "Error",
        description: "Failed to load deals",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter deals in negotiation stage (ready for firm offers)
  const negotiationDeals = deals.filter(d => d.status === 'negotiation')

  // Filter based on search
  const filteredDeals = negotiationDeals.filter(deal => {
    const searchLower = searchTerm.toLowerCase()
    return (
      deal.title?.toLowerCase().includes(searchLower) ||
      deal.company?.toLowerCase().includes(searchLower) ||
      deal.contact_name?.toLowerCase().includes(searchLower) ||
      deal.speaker_name?.toLowerCase().includes(searchLower)
    )
  })

  const totalValue = negotiationDeals.reduce((sum, d) => sum + parseFloat(d.value || '0'), 0)
  const pendingOffers = negotiationDeals.filter(d => !d.project_id).length

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-[60]">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Firm Offer Sheets</h1>
                <p className="text-gray-600">Create and manage firm offers for deals in negotiation</p>
              </div>
              <Button
                className="bg-amber-500 hover:bg-amber-600"
                onClick={() => router.push('/admin/firm-offers/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Firm Offer
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Deals in Negotiation</p>
                    <p className="text-2xl font-bold">{negotiationDeals.length}</p>
                  </div>
                  <FileSignature className="h-8 w-8 text-amber-400" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Firm Offers</p>
                    <p className="text-2xl font-bold">{pendingOffers}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-400" />
                </div>
              </Card>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by deal, company, contact, or speaker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Deals Table */}
            <Card>
              <CardHeader>
                <CardTitle>Deals Ready for Firm Offer</CardTitle>
                <CardDescription>Click on a deal to create or view its firm offer sheet</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading deals...</div>
                ) : filteredDeals.length === 0 ? (
                  <div className="text-center py-8">
                    <FileSignature className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No deals in negotiation stage</p>
                    <p className="text-sm text-gray-400 mt-1">Move deals to "Negotiation" in the CRM to create firm offers</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDeals.map(deal => (
                      <div
                        key={deal.id}
                        className="border rounded-lg p-4 hover:border-amber-300 hover:bg-amber-50/30 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{deal.title || deal.company}</h3>
                              {deal.project_id ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Offer Created
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-100 text-amber-800">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Needs Firm Offer
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Contact</p>
                                <p className="font-medium flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {deal.contact_name}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Speaker</p>
                                <p className="font-medium">{deal.speaker_name || 'Not assigned'}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Event Date</p>
                                <p className="font-medium flex items-center gap-1">
                                  {deal.event_date ? (
                                    <>
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(deal.event_date)}
                                    </>
                                  ) : (
                                    <span className="text-gray-400">TBD</span>
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Location</p>
                                <p className="font-medium flex items-center gap-1">
                                  {deal.event_location ? (
                                    <>
                                      <MapPin className="h-3 w-3" />
                                      {deal.event_location}
                                    </>
                                  ) : (
                                    <span className="text-gray-400">TBD</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 ml-4">
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Deal Value</p>
                              <p className="text-xl font-bold text-green-600">
                                {formatCurrency(parseFloat(deal.value || '0'))}
                              </p>
                            </div>

                            {deal.project_id ? (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(`/admin/firm-offers/${deal.project_id}`)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => router.push(`/admin/firm-offers/${deal.project_id}/edit`)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            ) : (
                              <Button
                                className="bg-amber-500 hover:bg-amber-600"
                                onClick={() => router.push(`/admin/firm-offers/new?deal_id=${deal.id}`)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Create Firm Offer
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
