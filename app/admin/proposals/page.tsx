"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit,
  Copy,
  Send,
  Trash2,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Link as LinkIcon,
  ExternalLink,
  TrendingUp,
  Mail,
  Download
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { Proposal } from "@/lib/proposals-db"

export default function ProposalsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [proposalToDelete, setProposalToDelete] = useState<Proposal | null>(null)

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    try {
      const response = await fetch("/api/proposals")
      if (response.ok) {
        const data = await response.json()
        setProposals(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load proposals",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error fetching proposals:", error)
      toast({
        title: "Error",
        description: "Failed to load proposals",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Draft</Badge>
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800"><Send className="h-3 w-3 mr-1" />Sent</Badge>
      case "viewed":
        return <Badge className="bg-purple-100 text-purple-800"><Eye className="h-3 w-3 mr-1" />Viewed</Badge>
      case "accepted":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Accepted</Badge>
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case "expired":
        return <Badge variant="secondary" className="bg-gray-100"><Clock className="h-3 w-3 mr-1" />Expired</Badge>
      default:
        return null
    }
  }

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = 
      proposal.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.client_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.proposal_number.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab = activeTab === "all" || proposal.status === activeTab

    return matchesSearch && matchesTab
  })

  const handleDeleteProposal = async () => {
    if (!proposalToDelete) return

    try {
      const response = await fetch(`/api/proposals/${proposalToDelete.id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setProposals(proposals.filter(p => p.id !== proposalToDelete.id))
        toast({
          title: "Success",
          description: "Proposal deleted successfully"
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete proposal",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error deleting proposal:", error)
      toast({
        title: "Error",
        description: "Failed to delete proposal",
        variant: "destructive"
      })
    } finally {
      setShowDeleteDialog(false)
      setProposalToDelete(null)
    }
  }

  const handleSendProposal = async (proposal: Proposal) => {
    try {
      const response = await fetch(`/api/proposals/${proposal.id}/send`, {
        method: "POST"
      })

      if (response.ok) {
        await fetchProposals()
        toast({
          title: "Success",
          description: "Proposal sent to client"
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to send proposal",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error sending proposal:", error)
      toast({
        title: "Error",
        description: "Failed to send proposal",
        variant: "destructive"
      })
    }
  }

  const copyProposalLink = async (proposal: Proposal) => {
    const link = `${window.location.origin}/proposal/${proposal.access_token}`
    await navigator.clipboard.writeText(link)
    toast({
      title: "Link copied",
      description: "Proposal link copied to clipboard"
    })
  }

  const getProposalStats = () => {
    const total = proposals.length
    const sent = proposals.filter(p => ["sent", "viewed", "accepted", "rejected"].includes(p.status)).length
    const accepted = proposals.filter(p => p.status === "accepted").length
    const totalValue = proposals
      .filter(p => p.status === "accepted")
      .reduce((sum, p) => sum + p.total_investment, 0)
    const conversionRate = sent > 0 ? (accepted / sent) * 100 : 0

    return { total, sent, accepted, totalValue, conversionRate }
  }

  const stats = getProposalStats()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Proposals</h1>
          <p className="text-gray-600">Create and manage client proposals</p>
        </div>
        <Button onClick={() => router.push("/admin/proposals/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Proposal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Proposals</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sent</p>
              <p className="text-2xl font-bold">{stats.sent}</p>
            </div>
            <Send className="h-8 w-8 text-blue-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-2xl font-bold">{stats.accepted}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by client, company, title, or proposal number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="viewed">Viewed</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Loading proposals...</p>
            </Card>
          ) : filteredProposals.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No proposals found</p>
              <Button className="mt-4" onClick={() => router.push("/admin/proposals/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Proposal
              </Button>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proposal</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{proposal.proposal_number}</p>
                          <p className="text-sm text-gray-500">{proposal.title}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{proposal.client_name}</p>
                          <p className="text-sm text-gray-500">{proposal.client_company}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{proposal.event_title}</p>
                          {proposal.event_date && (
                            <p className="text-xs text-gray-500">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {formatDate(proposal.event_date)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(proposal.total_investment)}</TableCell>
                      <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {proposal.views}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(proposal.created_at)}</TableCell>
                      <TableCell>
                        {proposal.valid_until ? (
                          <span className={new Date(proposal.valid_until) < new Date() ? "text-red-600" : ""}>
                            {formatDate(proposal.valid_until)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/admin/proposals/${proposal.id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/proposals/${proposal.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyProposalLink(proposal)}>
                              <LinkIcon className="h-4 w-4 mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => window.open(`/proposal/${proposal.access_token}`, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => window.open(`/api/proposals/${proposal.id}/pdf`, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {proposal.status === "draft" && (
                              <DropdownMenuItem onClick={() => handleSendProposal(proposal)}>
                                <Send className="h-4 w-4 mr-2" />
                                Send to Client
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => router.push(`/admin/proposals/${proposal.id}/duplicate`)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setProposalToDelete(proposal)
                                setShowDeleteDialog(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Proposal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete proposal {proposalToDelete?.proposal_number}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProposal}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}