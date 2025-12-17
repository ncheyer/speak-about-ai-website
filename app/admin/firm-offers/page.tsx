"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  Send,
  Eye,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  Copy,
  ExternalLink,
  Search,
  RefreshCw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { AdminSidebar } from "@/components/admin-sidebar"

interface FirmOffer {
  id: number
  proposal_id: number
  status: string
  proposal_title: string
  client_name: string
  client_email: string
  event_overview: any
  speaker_program: any
  financial_details: any
  speaker_access_token: string
  speaker_viewed_at: string | null
  speaker_response_at: string | null
  speaker_confirmed: boolean | null
  speaker_notes: string | null
  created_at: string
  submitted_at: string | null
  sent_to_speaker_at: string | null
}

export default function AdminFirmOffersPage() {
  const { toast } = useToast()
  const [firmOffers, setFirmOffers] = useState<FirmOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOffer, setSelectedOffer] = useState<FirmOffer | null>(null)
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [speakerEmail, setSpeakerEmail] = useState("")
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    fetchFirmOffers()
  }, [])

  const fetchFirmOffers = async () => {
    try {
      const response = await fetch('/api/firm-offers')
      if (response.ok) {
        const data = await response.json()
        setFirmOffers(data)
      }
    } catch (error) {
      console.error('Error fetching firm offers:', error)
      toast({
        title: "Error",
        description: "Failed to load firm offers",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (offer: FirmOffer) => {
    if (offer.speaker_confirmed === true) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Speaker Confirmed</Badge>
    }
    if (offer.speaker_confirmed === false) {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Speaker Declined</Badge>
    }
    if (offer.status === 'sent_to_speaker') {
      return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Awaiting Speaker</Badge>
    }
    if (offer.status === 'submitted') {
      return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Ready for Review</Badge>
    }
    return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Draft</Badge>
  }

  const handleSendToSpeaker = async () => {
    if (!selectedOffer) return

    setIsSending(true)
    try {
      const response = await fetch(`/api/firm-offers/${selectedOffer.id}/send-to-speaker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speaker_email: speakerEmail,
          speaker_name: selectedOffer.speaker_program?.requested_speaker_name
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sent!",
          description: "Firm offer sent to speaker for review."
        })
        setShowSendDialog(false)
        fetchFirmOffers()

        // Copy the review URL to clipboard
        if (data.speaker_review_url) {
          navigator.clipboard.writeText(data.speaker_review_url)
          toast({
            title: "Link Copied",
            description: "Speaker review link has been copied to clipboard."
          })
        }
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send to speaker",
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
    }
  }

  const copyReviewLink = (token: string) => {
    const url = `${window.location.origin}/speaker-review/${token}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied!",
      description: "Speaker review link copied to clipboard."
    })
  }

  const copyClientLink = (token: string) => {
    const url = `${window.location.origin}/firm-offer/${token}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied!",
      description: "Client firm offer link copied to clipboard."
    })
  }

  const filteredOffers = firmOffers.filter(offer =>
    offer.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.proposal_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.speaker_program?.requested_speaker_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Firm Offers</h1>
              <p className="text-gray-600">Manage client firm offer sheets and speaker confirmations</p>
            </div>
            <Button onClick={fetchFirmOffers} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{firmOffers.length}</div>
                <div className="text-sm text-gray-500">Total Offers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {firmOffers.filter(o => o.status === 'submitted').length}
                </div>
                <div className="text-sm text-gray-500">Ready for Review</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {firmOffers.filter(o => o.status === 'sent_to_speaker' && o.speaker_confirmed === null).length}
                </div>
                <div className="text-sm text-gray-500">Awaiting Speaker</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {firmOffers.filter(o => o.speaker_confirmed === true).length}
                </div>
                <div className="text-sm text-gray-500">Confirmed</div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by client, proposal, or speaker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client / Event</TableHead>
                    <TableHead>Speaker</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Sent to Speaker</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredOffers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No firm offers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOffers.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{offer.client_name}</p>
                            <p className="text-sm text-gray-500">{offer.proposal_title || offer.event_overview?.event_name}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {offer.speaker_program?.requested_speaker_name || '-'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(offer)}
                          {offer.speaker_viewed_at && offer.speaker_confirmed === null && (
                            <p className="text-xs text-gray-500 mt-1">
                              Viewed {formatDate(offer.speaker_viewed_at)}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(offer.submitted_at)}</TableCell>
                        <TableCell>{formatDate(offer.sent_to_speaker_at)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => window.open(`/firm-offer/${offer.speaker_access_token}`, '_blank')}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Form
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyClientLink(offer.speaker_access_token)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Client Link
                              </DropdownMenuItem>
                              {offer.status === 'submitted' && (
                                <DropdownMenuItem onClick={() => {
                                  setSelectedOffer(offer)
                                  setShowSendDialog(true)
                                }}>
                                  <Send className="h-4 w-4 mr-2" />
                                  Send to Speaker
                                </DropdownMenuItem>
                              )}
                              {offer.status === 'sent_to_speaker' && (
                                <>
                                  <DropdownMenuItem onClick={() => copyReviewLink(offer.speaker_access_token)}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy Speaker Link
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => window.open(`/speaker-review/${offer.speaker_access_token}`, '_blank')}>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Speaker Page
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Send to Speaker Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send to Speaker</DialogTitle>
            <DialogDescription>
              Send this firm offer to the speaker for review and confirmation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Speaker</Label>
              <p className="font-medium">{selectedOffer?.speaker_program?.requested_speaker_name}</p>
            </div>
            <div>
              <Label>Event</Label>
              <p className="text-sm text-gray-600">
                {selectedOffer?.event_overview?.event_name || selectedOffer?.proposal_title}
              </p>
            </div>
            <div>
              <Label htmlFor="speaker-email">Speaker Email (optional)</Label>
              <Input
                id="speaker-email"
                type="email"
                value={speakerEmail}
                onChange={(e) => setSpeakerEmail(e.target.value)}
                placeholder="speaker@email.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to just copy the review link
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendToSpeaker} disabled={isSending}>
              <Send className="h-4 w-4 mr-2" />
              {isSending ? 'Sending...' : 'Send & Copy Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
