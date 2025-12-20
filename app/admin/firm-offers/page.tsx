"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  MapPin,
  Copy,
  ExternalLink,
  Trash2,
  FileText,
  Loader2
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
  firm_offer_id?: number
  created_at: string
  updated_at: string
}

interface FirmOffer {
  id: number
  status: string
  speaker_access_token: string
  event_overview: {
    company_name?: string
    end_client_name?: string
    event_name?: string
    event_date?: string
    event_location?: string
    billing_contact?: {
      name?: string
      email?: string
    }
  }
  speaker_program: {
    speaker_name?: string
    program_topic?: string
    program_type?: string
  }
  financial_details: {
    speaker_fee?: number
    travel_expenses_amount?: number
  }
  confirmation?: {
    speaker_confirmed?: boolean
    confirmed_at?: string
  }
  deal_title?: string
  deal_company?: string
  speaker_name?: string
  created_at: string
  updated_at: string
  sent_to_speaker_at?: string
}

export default function FirmOffersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [deals, setDeals] = useState<Deal[]>([])
  const [firmOffers, setFirmOffers] = useState<FirmOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [offersLoading, setOffersLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [offersSearchTerm, setOffersSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("offers")

  useEffect(() => {
    loadDeals()
    loadFirmOffers()
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

  const loadFirmOffers = async () => {
    try {
      const response = await fetch("/api/firm-offers")
      if (response.ok) {
        const data = await response.json()
        setFirmOffers(data)
      }
    } catch (error) {
      console.error("Error loading firm offers:", error)
    } finally {
      setOffersLoading(false)
    }
  }

  const copyShareLink = (token: string) => {
    const url = `${window.location.origin}/firm-offer/${token}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied!",
      description: "Speaker share link copied to clipboard",
    })
  }

  const getStatusBadge = (offer: FirmOffer) => {
    if (offer.confirmation?.speaker_confirmed) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>
    }
    if (offer.sent_to_speaker_at) {
      return <Badge className="bg-blue-100 text-blue-800"><Send className="h-3 w-3 mr-1" />Sent to Speaker</Badge>
    }
    if (offer.status === 'draft') {
      return <Badge className="bg-gray-100 text-gray-800"><FileText className="h-3 w-3 mr-1" />Draft</Badge>
    }
    return <Badge className="bg-amber-100 text-amber-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
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
  const pendingOffers = negotiationDeals.filter(d => !d.firm_offer_id).length

  // Filter firm offers based on search
  const filteredOffers = firmOffers.filter(offer => {
    const searchLower = offersSearchTerm.toLowerCase()
    return (
      offer.event_overview?.company_name?.toLowerCase().includes(searchLower) ||
      offer.event_overview?.event_name?.toLowerCase().includes(searchLower) ||
      offer.speaker_program?.speaker_name?.toLowerCase().includes(searchLower) ||
      offer.deal_company?.toLowerCase().includes(searchLower) ||
      offer.speaker_name?.toLowerCase().includes(searchLower)
    )
  })

  // Calculate firm offers stats
  const confirmedOffers = firmOffers.filter(o => o.confirmation?.speaker_confirmed).length
  const sentOffers = firmOffers.filter(o => o.sent_to_speaker_at && !o.confirmation?.speaker_confirmed).length
  const draftOffers = firmOffers.filter(o => o.status === 'draft').length
  const totalOfferValue = firmOffers.reduce((sum, o) => sum + (o.financial_details?.speaker_fee || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden lg:block lg:fixed left-0 top-0 h-full z-[60]">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 lg:pt-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Firm Offer Sheets</h1>
                <p className="text-sm sm:text-base text-gray-600">Create and manage firm offers for speakers</p>
              </div>
              <Button
                className="bg-amber-500 hover:bg-amber-600 w-full sm:w-auto"
                onClick={() => router.push('/admin/firm-offers/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Firm Offer
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Offers</p>
                    <p className="text-xl sm:text-2xl font-bold">{firmOffers.length}</p>
                  </div>
                  <FileSignature className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
                </div>
              </Card>
              <Card className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Confirmed</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">{confirmedOffers}</p>
                  </div>
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
                </div>
              </Card>
              <Card className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Awaiting</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">{sentOffers}</p>
                  </div>
                  <Send className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                </div>
              </Card>
              <Card className="p-3 sm:p-4 col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Value</p>
                    <p className="text-xl sm:text-2xl font-bold">{formatCurrency(totalOfferValue)}</p>
                  </div>
                  <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
                </div>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="offers" className="flex items-center gap-2">
                  <FileSignature className="h-4 w-4" />
                  All Firm Offers ({firmOffers.length})
                </TabsTrigger>
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create from Deal ({negotiationDeals.length})
                </TabsTrigger>
              </TabsList>

              {/* Existing Firm Offers Tab */}
              <TabsContent value="offers" className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by company, event, or speaker..."
                    value={offersSearchTerm}
                    onChange={(e) => setOffersSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Firm Offers</CardTitle>
                    <CardDescription>View and manage all firm offer sheets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {offersLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
                    ) : filteredOffers.length === 0 ? (
                      <div className="text-center py-8">
                        <FileSignature className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No firm offers found</p>
                        <p className="text-sm text-gray-400 mt-1">Create your first firm offer to get started</p>
                        <Button
                          className="mt-4 bg-amber-500 hover:bg-amber-600"
                          onClick={() => router.push('/admin/firm-offers/new')}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Firm Offer
                        </Button>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Event / Company</TableHead>
                            <TableHead>Speaker</TableHead>
                            <TableHead>Event Date</TableHead>
                            <TableHead>Fee</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOffers.map((offer) => (
                            <TableRow key={offer.id} className="cursor-pointer hover:bg-gray-50">
                              <TableCell>{getStatusBadge(offer)}</TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">
                                    {offer.event_overview?.event_name || offer.deal_title || 'Untitled Event'}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {offer.event_overview?.company_name || offer.deal_company || '-'}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="font-medium">
                                  {offer.speaker_program?.speaker_name || offer.speaker_name || '-'}
                                </p>
                              </TableCell>
                              <TableCell>
                                {offer.event_overview?.event_date ? (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(offer.event_overview.event_date)}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">TBD</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <span className="font-semibold text-green-600">
                                  {offer.financial_details?.speaker_fee
                                    ? formatCurrency(offer.financial_details.speaker_fee)
                                    : '-'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-gray-500">
                                  {formatDate(offer.created_at)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push(`/admin/firm-offers/${offer.id}`)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push(`/admin/firm-offers/new?edit=${offer.id}`)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Offer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => copyShareLink(offer.speaker_access_token)}>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copy Speaker Link
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => window.open(`/firm-offer/${offer.speaker_access_token}`, '_blank')}>
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Open Speaker View
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Create from Deal Tab */}
              <TabsContent value="create" className="space-y-4">
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

                <Card>
                  <CardHeader>
                    <CardTitle>Deals Ready for Firm Offer</CardTitle>
                    <CardDescription>Deals in negotiation stage that can have firm offers created</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
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
                                  {deal.firm_offer_id ? (
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

                                {deal.firm_offer_id ? (
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => router.push(`/admin/firm-offers/${deal.firm_offer_id}`)}
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => router.push(`/admin/firm-offers/new?edit=${deal.firm_offer_id}`)}
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
