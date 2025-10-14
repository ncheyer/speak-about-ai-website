"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DealStatusDropdown } from "@/components/deal-status-dropdown"
import { LostDealModal, type LostDealData } from "@/components/lost-deal-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Plus,
  Search,
  Edit,
  Eye,
  Phone,
  Mail,
  MapPin,
  Clock,
  BarChart3,
  CheckSquare,
  Loader2,
  AlertTriangle,
  Database,
  ExternalLink,
  FileText,
  List,
  Kanban,
  Send,
  CheckCircle,
  Trash2,
  XCircle,
  TrendingDown,
  Calculator,
  RefreshCw,
  ArrowLeft,
  Download,
  X,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { DealsKanban } from "@/components/deals-kanban"
import { AdminSidebar } from "@/components/admin-sidebar"

interface Deal {
  id: number
  client_name: string
  client_email: string
  client_phone: string
  company: string
  event_title: string
  event_date: string
  event_location: string
  event_type: string
  speaker_requested?: string
  attendee_count: number
  budget_range: string
  deal_value: number
  status: "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
  priority: "low" | "medium" | "high" | "urgent"
  source: string
  notes: string
  created_at: string
  last_contact: string
  next_follow_up?: string
  updated_at: string
  // Travel fields
  travel_required?: boolean
  flight_required?: boolean
  hotel_required?: boolean
  travel_stipend?: number
  travel_notes?: string
  // Task counts
  pending_tasks_count?: number
  overdue_tasks_count?: number
}

interface Contract {
  id: number
  deal_id: number
  contract_number: string
  title: string
  status: "draft" | "sent" | "partially_signed" | "fully_executed" | "cancelled"
  total_amount: number
  event_title: string
  event_date: string
  client_name: string
  client_company?: string
  speaker_name?: string
  generated_at: string
  sent_at?: string
  completed_at?: string
}

const DEAL_STATUSES = {
  lead: { label: "New Lead", color: "bg-gray-500" },
  qualified: { label: "Qualified", color: "bg-blue-500" },
  proposal: { label: "Proposal Sent", color: "bg-yellow-500" },
  negotiation: { label: "Negotiating", color: "bg-orange-500" },
  won: { label: "Won", color: "bg-green-500" },
  lost: { label: "Lost", color: "bg-red-500" },
}

const CONTRACT_STATUSES = {
  draft: { label: "Draft", color: "bg-gray-500", icon: FileText },
  sent: { label: "Sent", color: "bg-blue-500", icon: Send },
  partially_signed: { label: "Partially Signed", color: "bg-yellow-500", icon: Clock },
  fully_executed: { label: "Fully Executed", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-500", icon: AlertTriangle }
}

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

export default function AdminCRMPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [deals, setDeals] = useState<Deal[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [viewMode, setViewMode] = useState<"pipeline" | "list">("list")
  const [activeTab, setActiveTab] = useState("deals")
  const [showContractDialog, setShowContractDialog] = useState(false)
  const [contractDeal, setContractDeal] = useState<Deal | null>(null)
  const [showContractPreview, setShowContractPreview] = useState(false)
  const [contractPreviewContent, setContractPreviewContent] = useState("")
  const [showLostDealModal, setShowLostDealModal] = useState(false)
  const [lostDealInfo, setLostDealInfo] = useState<{ id: number; name: string } | null>(null)
  const [pastDealsSearch, setPastDealsSearch] = useState("")
  const [pastDealsFilter, setPastDealsFilter] = useState<"all" | "won" | "lost">("all")
  const [pastDealsDateRange, setPastDealsDateRange] = useState<"all" | "30days" | "90days" | "1year">("all")
  const [contractFormData, setContractFormData] = useState({
    speaker_name: "",
    speaker_email: "",
    speaker_fee: "",
    additional_terms: "",
    payment_terms: "Net 30 days after event completion",
    client_signer_email: "",
    client_signer_name: "",
    // Engagement details
    engagement_type: "keynote", // keynote, workshop, panel, fireside_chat, etc.
    keynote_duration: "40",
    qa_duration: "20",
    workshop_duration: "",
    session_description: "",
    arrival_time: "10:00 am",
    departure_time: "12:30 pm",
    tech_check_required: true,
    alignment_meeting_required: true
  })

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    company: "",
    eventTitle: "",
    eventDate: "",
    eventLocation: "",
    eventType: "in-person",
    speakerRequested: "",
    attendeeCount: "",
    budgetRange: "",
    dealValue: "",
    travelRequired: false,
    travelStipend: "",
    flightRequired: false,
    hotelRequired: false,
    travelNotes: "",
    status: "lead" as Deal["status"],
    priority: "medium" as Deal["priority"],
    source: "",
    notes: "",
    nextFollowUp: "",
  })

  // Currency formatting helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  // Date formatting helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Check authentication and load data
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load deals and contracts in parallel
      const [dealsResponse, contractsResponse] = await Promise.all([
        fetch("/api/deals"),
        fetch("/api/contracts")
      ])

      if (dealsResponse.ok) {
        const dealsData = await dealsResponse.json()
        setDeals(Array.isArray(dealsData) ? dealsData : dealsData.deals || [])
      }

      if (contractsResponse.ok) {
        const contractsData = await contractsResponse.json()
        setContracts(contractsData)
      }
    } catch (error) {
      console.error("Error loading CRM data:", error)
      toast({
        title: "Error",
        description: "Failed to load CRM data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateContract = (deal: Deal) => {
    setContractDeal(deal)
    
    // Parse engagement type from notes or event title
    let engagementType = "keynote"
    let sessionDescription = ""
    const notesLower = deal.notes.toLowerCase()
    const titleLower = deal.event_title.toLowerCase()
    
    if (notesLower.includes("workshop") || titleLower.includes("workshop")) {
      engagementType = "workshop"
    } else if (notesLower.includes("panel") || titleLower.includes("panel")) {
      engagementType = "panel"
    } else if (notesLower.includes("fireside") || titleLower.includes("fireside")) {
      engagementType = "fireside_chat"
    }
    
    // Extract topic from notes
    const topicMatch = deal.notes.match(/Topic:\s*(.+?)(?:\n|$)/i)
    if (topicMatch) {
      sessionDescription = topicMatch[1].trim()
    }
    
    // Virtual event adjustments
    const isVirtual = deal.event_type === "virtual"
    
    setContractFormData({
      speaker_name: deal.speaker_requested || "",
      speaker_email: "",
      speaker_fee: deal.deal_value.toString(),
      additional_terms: "",
      payment_terms: "Net 30 days after event completion",
      client_signer_email: deal.client_email || "",
      client_signer_name: deal.client_name || "",
      engagement_type: engagementType,
      keynote_duration: engagementType === "workshop" ? "" : "40",
      qa_duration: engagementType === "workshop" ? "" : "20",
      workshop_duration: engagementType === "workshop" ? "120" : "",
      session_description: sessionDescription || `${engagementType === "workshop" ? "Workshop" : "Keynote"} on AI and Innovation`,
      arrival_time: isVirtual ? "N/A" : "10:00 am",
      departure_time: isVirtual ? "N/A" : "12:30 pm",
      tech_check_required: true,
      alignment_meeting_required: true
    })
    setShowContractDialog(true)
  }

  const handlePreviewContract = async () => {
    if (!contractDeal) return

    try {
      setSubmitting(true)
      
      // Generate preview directly in the client
      const speakerFee = parseFloat(contractFormData.speaker_fee) || contractDeal.deal_value || 0
      const eventDate = new Date(contractDeal.event_date)
      const eventDateFormatted = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      const eventTime = "10:00 am to 12:30 pm" // Default time, should come from deal data
      
      // Generate contract reference number
      const contractRef = `#${(eventDate.getMonth() + 1).toString().padStart(2, '0')}${eventDate.getDate().toString().padStart(2, '0')}${eventDate.getFullYear().toString().slice(-2)}`
      
      // Generate engagement details based on type and virtual/in-person
      const generateEngagementDetails = () => {
        const isVirtual = contractDeal.event_type === "virtual"
        const { engagement_type, keynote_duration, qa_duration, workshop_duration, 
                session_description, arrival_time, departure_time, 
                tech_check_required, alignment_meeting_required } = contractFormData
        
        let details = ""
        
        // Main session details
        if (engagement_type === "workshop") {
          details += `A ${workshop_duration}-minute workshop on "${session_description}"\n`
        } else if (engagement_type === "panel") {
          details += `Participation in a panel discussion on "${session_description}"\n`
        } else if (engagement_type === "fireside_chat") {
          details += `A fireside chat discussion on "${session_description}"\n`
        } else {
          // Keynote (default)
          details += `A ${keynote_duration}-minute keynote on the topic of, "${session_description}"\n`
          if (qa_duration) {
            details += `A ${qa_duration}-minute Q&A\n`
          }
        }
        
        // Event attendance details
        if (!isVirtual) {
          details += `Attendance at the main event:\n`
          details += `${arrival_time} - Speaker Arrival/Load-in (Tech check TBD)\n`
          
          // Calculate times based on engagement type
          if (engagement_type === "keynote") {
            details += `10:45 am - 11:25 am: Speaker's Keynote (Exact time of keynote and Q&A TBD)\n`
            details += `11:25 am - 11:45 am: Speaker's Q&A\n`
          } else if (engagement_type === "workshop") {
            details += `Event timing: ${workshop_duration} minutes (Exact schedule TBD)\n`
          } else {
            details += `Event participation time: TBD\n`
          }
          
          details += `${departure_time}: Speaker's departure from venue (Confirmed)\n`
        } else {
          // Virtual event details
          details += `Virtual presentation via ${contractDeal.event_location.includes('Zoom') ? 'Zoom' : 'video conference platform'}\n`
          details += `Total presentation time: ${engagement_type === "workshop" ? workshop_duration : 
                       (parseInt(keynote_duration || "0") + parseInt(qa_duration || "0"))} minutes\n`
        }
        
        // Additional requirements
        if (alignment_meeting_required) {
          details += `The Speaker will also attend one 30-minute virtual alignment meeting before the event`
          if (tech_check_required) {
            details += `, and a tech-check if requested`
          }
          details += `.`
        } else if (tech_check_required) {
          details += `The Speaker will attend a tech-check session if requested.`
        }
        
        return details
      }
      
      let contractContent = `This Agreement is entered into between 
Speak About AI, a division of Strong Entertainment, LLC ("Agent" for the Speaker),
${contractFormData.speaker_name || '[Speaker Name]'} ("Speaker"), and 
${contractDeal.company} ("Client") for the purposes of engaging the Speaker for:

1. Contract details:
Event Reference: ${contractRef}
Client & Name of Event: ${contractDeal.company} / ${contractDeal.event_title} ("Event")
Date(s)/Time(s): ${eventDateFormatted} from ${eventTime}
Location(s): ${contractDeal.event_location}
The fee and any other consideration payable to the Agent: $${(speakerFee || 0).toLocaleString('en-US')} USD
${contractDeal.travel_required ? `Travel: Travel stipend of $${(contractDeal.travel_stipend || 2500).toLocaleString('en-US')}, plus ${contractDeal.hotel_required ? 'one night accommodation at a 4-star hotel of the client\'s choice nearby the venue.' : 'travel arrangements as agreed.'}` : ''}
For that fee, the Speaker will provide:
${generateEngagementDetails()}

2. Taxation - The Speaker agrees to act as an independent contractor under the terms of this agreement and assumes all responsibility for Social Security, State, and Federal Income Tax, etc., as governed by the laws of the federal government of the United States and the Speaker's state of residence. The Client is not responsible for any additional expenses or costs.

3. Deposit and Payment - A 50% Deposit is due at the time of execution/signing of this agreement. The 50% Balance Payment is due net-30 days from the Client's receipt of invoice by the Agent. If this contract is executed within 45 days of the event, the client will receive one invoice combining the deposit and balance. This agreement is entered into in good faith by all parties. However, cancellation by the client shall make the client liable for the amount of the 50% deposit. If the contract is canceled by the Speaker, the Speaker and the Agent will refund all payments made.

4. Permission to Photograph and Record - Any use of the Speaker's name, likeness, presentation content, or Recordings (as that term is defined in this section) for commercial purposes (and the section below marked "Permissible Use" is not considered to be commercial purposes) is expressly prohibited. No Trademark license is granted.

Permissible Use: All parties agree that the client may use the recorded video footage (the "Recording") of the Speaker for this Event. The Client may, without further fee or payment, use the Speaker's name and likeness for up to twelve months after the talk is delivered in marketing and promotion, but that does not suggest Speaker affiliation or endorsement. 

For example, the Client may share short snippets (up to 5-minute clips) from or about the event and talk that reference or include the Speaker. However, those snippets may not suggest endorsement by the speaker of the Client's products or the Client itself. The Recording in its entirety may be shared internally and with Event attendees via a private link for the 12 months after the initial airing date of ${eventDateFormatted}. The Client agrees that they will not use the Recording for the purpose of training artificial intelligence models or digital twins of the Speaker.




5. Cancellation - This contract is binding and may be canceled only if: 
a) there is a mutual agreement between the parties; or 
b) by force majeure; or 
c) If the Speaker is delayed by airline delay/cancellation, accident due to travel, or incapacitated due to illness; or
d) An immediate family member is stricken by serious injury, illness, or death.

6. Limitation of Liability 

6.1 EXCLUSION OF CERTAIN DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY IN THIS AGREEMENT AND TO THE FULLEST EXTENT PERMITTED UNDER APPLICABLE LAWS, IN NO EVENT WILL EITHER PARTY BE LIABLE TO THE OTHER PARTY OR TO ANY THIRD PARTY UNDER ANY TORT, CONTRACT, NEGLIGENCE, STRICT LIABILITY, OR OTHER LEGAL OR EQUITABLE THEORY FOR 
(1) INDIRECT, INCIDENTAL, CONSEQUENTIAL, EXEMPLARY, REPUTATIONAL, SPECIAL OR PUNITIVE DAMAGES OF ANY KIND; 
(2) COSTS OF PROCUREMENT, COVER, OR SUBSTITUTE SERVICES; 
(3) LOSS OF USE OR CORRUPTION OF DATA, CONTENT OR INFORMATION; OR 
(4) LOSS OF BUSINESS OPPORTUNITIES, REVENUES, PROFITS, GOODWILL, OR SAVINGS, EVEN IF THE PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH LOSS OR DAMAGES OR SUCH OR LOSS DAMAGES COULD HAVE BEEN REASONABLY FORESEEN.  

6.2 LIMITATION OF LIABILITY.  NEITHER PARTY SHALL BE LIABLE FOR CUMULATIVE, AGGREGATE DAMAGES THAT EXCEED THE AMOUNT ACTUALLY PAID OR PAYABLE BY CLIENT TO SPEAKER OR AGENCY FOR THE APPLICABLE SERVICES.

7. Miscellaneous - This agreement represents the entire understanding between all parties, and supersedes all prior negotiations, representations, and agreements made by or between parties. No alterations, amendments, or modifications to any of the terms and conditions of this agreement shall be valid unless made in writing and signed by each party. Any controversy, dispute, or claim shall be resolved at the request of any party to this Agreement by final and binding arbitration administered by Judicial Arbitration & Mediation Services, Inc., and judgment upon any award rendered by the arbitrator may be entered by any State or Federal Court having jurisdiction thereof. This Agreement shall be governed by California law without reference to its conflicts of law principles. Any such arbitration shall occur exclusively in the County of Santa Clara, California.`

      setContractPreviewContent(contractContent)
      setShowContractPreview(true)
      
    } catch (error) {
      console.error("Error generating preview:", error)
      toast({
        title: "Error",
        description: "Failed to generate preview",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitContract = async () => {
    if (!contractDeal) return

    try {
      setSubmitting(true)
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          deal_id: contractDeal.id,
          speaker_info: {
            name: contractFormData.speaker_name,
            email: contractFormData.speaker_email,
            fee: parseFloat(contractFormData.speaker_fee) || contractDeal.deal_value
          },
          client_signer_info: {
            name: contractFormData.client_signer_name || contractDeal.client_name,
            email: contractFormData.client_signer_email || contractDeal.client_email
          },
          additional_terms: contractFormData.additional_terms,
          payment_terms: contractFormData.payment_terms
        })
      })

      if (response.ok) {
        const contract = await response.json()
        toast({
          title: "Success",
          description: "Contract created successfully",
        })
        setShowContractDialog(false)
        setShowContractPreview(false)
        loadData() // Reload to show new contract
        // Open contract in new tab
        window.open(`/admin/contracts/${contract.id}`, '_blank')
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to create contract",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating contract:", error)
      toast({
        title: "Error",
        description: "Failed to create contract",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const dealData = {
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_phone: formData.clientPhone,
        company: formData.company,
        event_title: formData.eventTitle,
        event_date: formData.eventDate,
        event_location: formData.eventLocation,
        event_type: formData.eventType,
        speaker_requested: formData.speakerRequested,
        attendee_count: Number.parseInt(formData.attendeeCount) || 0,
        budget_range: formData.budgetRange,
        deal_value: Number.parseFloat(formData.dealValue) || 0,
        travel_required: formData.travelRequired,
        travel_stipend: Number.parseFloat(formData.travelStipend) || 0,
        flight_required: formData.flightRequired,
        hotel_required: formData.hotelRequired,
        travel_notes: formData.travelNotes,
        status: formData.status,
        priority: formData.priority,
        source: formData.source,
        notes: formData.notes,
        last_contact: new Date().toISOString().split("T")[0],
        next_follow_up: formData.nextFollowUp || undefined,
      }

      let response
      if (editingDeal) {
        console.log("Sending update for deal:", editingDeal.id)
        console.log("Deal data being sent:", dealData)
        response = await fetch(`/api/deals/${editingDeal.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dealData),
        })
      } else {
        response = await fetch("/api/deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dealData),
        })
      }

      if (response.ok) {
        toast({
          title: "Success",
          description: editingDeal ? "Deal updated successfully" : "Deal created successfully",
        })

        // Reset form
        handleCancelForm()
        loadData()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to save deal",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving deal:", error)
      toast({
        title: "Error",
        description: "Failed to save deal",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancelForm = () => {
    setShowCreateForm(false)
    setEditingDeal(null)
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      company: "",
      eventTitle: "",
      eventDate: "",
      eventLocation: "",
      eventType: "in-person",
      speakerRequested: "",
      attendeeCount: "",
      budgetRange: "",
      dealValue: "",
      travelRequired: false,
      travelStipend: "",
      flightRequired: false,
      hotelRequired: false,
      travelNotes: "",
      status: "lead",
      priority: "medium",
      source: "",
      notes: "",
      nextFollowUp: "",
    })
  }

  const handleEdit = (deal: Deal) => {
    // Format dates for input fields (YYYY-MM-DD format)
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return ""
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    }
    
    setFormData({
      clientName: deal.client_name,
      clientEmail: deal.client_email,
      clientPhone: deal.client_phone,
      company: deal.company,
      eventTitle: deal.event_title,
      eventDate: formatDateForInput(deal.event_date),
      eventLocation: deal.event_location,
      eventType: deal.event_type || "in-person",
      speakerRequested: deal.speaker_requested || "",
      attendeeCount: deal.attendee_count.toString(),
      budgetRange: deal.budget_range,
      dealValue: typeof deal.deal_value === 'string' ? deal.deal_value : deal.deal_value.toString(),
      travelRequired: deal.travel_required || false,
      travelStipend: deal.travel_stipend ? deal.travel_stipend.toString() : "",
      flightRequired: deal.flight_required || false,
      hotelRequired: deal.hotel_required || false,
      travelNotes: deal.travel_notes || "",
      status: deal.status,
      priority: deal.priority,
      source: deal.source,
      notes: deal.notes,
      nextFollowUp: formatDateForInput(deal.next_follow_up || ""),
    })
    setEditingDeal(deal)
    setShowCreateForm(true)
  }

  const handleSendContract = async (contractId: number) => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Contract sent successfully",
        })
        loadData() // Reload contracts
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to send contract",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error sending contract:", error)
      toast({
        title: "Error",
        description: "Failed to send contract",
        variant: "destructive"
      })
    }
  }

  const handleDeleteDeal = async (deal: Deal) => {
    if (!confirm(`Are you sure you want to delete the deal "${deal.event_title}" for ${deal.client_name}? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/deals/${deal.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Deal deleted successfully",
        })
        loadData() // Reload deals
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete deal",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error deleting deal:", error)
      toast({
        title: "Error",
        description: "Failed to delete deal",
        variant: "destructive"
      })
    }
  }

  const handleQuickStatusChange = async (dealId: number, newStatus: string, dealName: string) => {
    // If marking as lost, show the lost deal modal
    if (newStatus === 'lost') {
      setLostDealInfo({ id: dealId, name: dealName })
      setShowLostDealModal(true)
      return
    }

    // Otherwise, update the status directly
    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Deal status updated to ${newStatus}`,
        })
        loadData() // Reload deals
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to update deal status",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error updating deal status:", error)
      toast({
        title: "Error",
        description: "Failed to update deal status",
        variant: "destructive"
      })
    }
  }

  const handleLostDealSubmit = async (lostData: LostDealData) => {
    if (!lostDealInfo) return

    try {
      // Build the notes to append to the deal
      const lostNotes = `\n\n--- MARKED AS LOST ---\nDate: ${new Date().toLocaleDateString()}\nReason: ${lostData.reason}\nDetails: ${lostData.specificReason}\n${lostData.worthFollowUp ? `Follow up in: ${lostData.followUpTimeframe}` : 'No follow-up needed'}\nNext Steps: ${lostData.nextSteps}\n${lostData.competitorWon ? `Competitor won: ${lostData.competitorWon}` : ''}\n${lostData.budgetMismatch ? `Budget issue: ${lostData.budgetMismatch}` : ''}\n${lostData.otherNotes ? `Additional notes: ${lostData.otherNotes}` : ''}`

      // Find the current deal to append to existing notes
      const currentDeal = deals.find(d => d.id === lostDealInfo.id)
      const updatedNotes = (currentDeal?.notes || '') + lostNotes

      const response = await fetch(`/api/deals/${lostDealInfo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'lost',
          notes: updatedNotes,
          // Store structured data in dedicated columns
          lost_reason: lostData.reason,
          lost_details: lostData.specificReason,
          worth_follow_up: lostData.worthFollowUp,
          follow_up_date: lostData.worthFollowUp && lostData.followUpTimeframe !== 'never' 
            ? calculateFollowUpDate(lostData.followUpTimeframe) 
            : null,
          lost_competitor: lostData.competitorWon,
          lost_next_steps: lostData.nextSteps,
          closed_notes: lostData.otherNotes
        })
      })

      if (response.ok) {
        toast({
          title: "Deal marked as lost",
          description: "Lost deal information has been recorded",
        })
        setShowLostDealModal(false)
        setLostDealInfo(null)
        loadData() // Reload deals
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to update deal",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error marking deal as lost:", error)
      toast({
        title: "Error",
        description: "Failed to mark deal as lost",
        variant: "destructive"
      })
    }
  }

  const calculateFollowUpDate = (timeframe: string): string => {
    const date = new Date()
    switch (timeframe) {
      case '1month':
        date.setMonth(date.getMonth() + 1)
        break
      case '3months':
        date.setMonth(date.getMonth() + 3)
        break
      case '6months':
        date.setMonth(date.getMonth() + 6)
        break
      case '1year':
        date.setFullYear(date.getFullYear() + 1)
        break
      default:
        return ''
    }
    return date.toISOString().split('T')[0]
  }

  const handleReactivateDeal = async (deal: Deal) => {
    if (!confirm(`Are you sure you want to reactivate the deal "${deal.event_title}"? It will be moved back to the "lead" stage.`)) {
      return
    }

    try {
      const response = await fetch(`/api/deals/${deal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'lead',
          notes: deal.notes + '\n\n--- REACTIVATED ---\nReactivated on: ' + new Date().toLocaleDateString()
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Deal reactivated successfully",
        })
        loadData() // Reload deals
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to reactivate deal",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error reactivating deal:", error)
      toast({
        title: "Error", 
        description: "Failed to reactivate deal",
        variant: "destructive"
      })
    }
  }

  const filteredDeals = deals.filter((deal) => {
    // Exclude won and lost deals - they go to Past Deals tab
    if (deal.status === "won" || deal.status === "lost") return false
    
    const matchesSearch =
      deal.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.event_title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || deal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredContracts = contracts.filter((contract) => {
    return (
      contract.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.event_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contract_number.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (!isLoggedIn) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading CRM data...</span>
      </div>
    )
  }

  // Calculate statistics
  const totalDeals = deals.length
  const totalValue = deals.reduce((sum, deal) => sum + (typeof deal.deal_value === 'string' ? parseFloat(deal.deal_value) || 0 : deal.deal_value), 0)
  const wonDeals = deals.filter((d) => d.status === "won").length
  const pipelineValue = deals
    .filter((d) => !["won", "lost"].includes(d.status))
    .reduce((sum, deal) => sum + (typeof deal.deal_value === 'string' ? parseFloat(deal.deal_value) || 0 : deal.deal_value), 0)

  const totalContracts = contracts.length
  const executedContracts = contracts.filter(c => c.status === "fully_executed").length
  const pendingContracts = contracts.filter(c => ["draft", "sent", "partially_signed"].includes(c.status)).length

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-[60]">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CRM - Customer Relationship Management</h1>
              <p className="mt-2 text-gray-600">Manage deals, contracts, and client relationships</p>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Deal
              </Button>
            </div>
          </div>

          {/* Create/Edit Deal Form */}
          {showCreateForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingDeal ? "Edit Deal" : "Create New Deal"}</CardTitle>
                <CardDescription>
                  {editingDeal ? "Update the deal information below" : "Enter the information for the new deal"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Client Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Client Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="clientName">Client Name *</Label>
                        <Input
                          id="clientName"
                          value={formData.clientName}
                          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientEmail">Client Email *</Label>
                        <Input
                          id="clientEmail"
                          type="email"
                          value={formData.clientEmail}
                          onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientPhone">Phone Number</Label>
                        <Input
                          id="clientPhone"
                          type="tel"
                          value={formData.clientPhone}
                          onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company *</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Event Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Event Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="eventTitle">Event Title *</Label>
                        <Input
                          id="eventTitle"
                          value={formData.eventTitle}
                          onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="eventFormat">Event Format</Label>
                        <Select
                          value={formData.eventType}
                          onValueChange={(value) => {
                            setFormData({ 
                              ...formData, 
                              eventType: value,
                              travelRequired: value === "in-person",
                              flightRequired: false,
                              hotelRequired: false,
                              travelStipend: ""
                            })
                          }}
                        >
                          <SelectTrigger id="eventFormat">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in-person">In-Person</SelectItem>
                            <SelectItem value="virtual">Virtual</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="eventDate">Event Date</Label>
                        <Input
                          id="eventDate"
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="eventLocation">Location</Label>
                        <Input
                          id="eventLocation"
                          value={formData.eventLocation}
                          onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="attendeeCount">Expected Attendees</Label>
                        <Input
                          id="attendeeCount"
                          type="number"
                          value={formData.attendeeCount}
                          onChange={(e) => setFormData({ ...formData, attendeeCount: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="speakerRequested">Speaker Requested</Label>
                        <Input
                          id="speakerRequested"
                          value={formData.speakerRequested}
                          onChange={(e) => setFormData({ ...formData, speakerRequested: e.target.value })}
                          placeholder="Adam Cheyer, AI Expert, etc."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Travel Information */}
                  {formData.eventType === "in-person" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Travel Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="flightRequired"
                            className="rounded"
                            checked={formData.flightRequired}
                            onChange={(e) => setFormData({ ...formData, flightRequired: e.target.checked })}
                          />
                          <Label htmlFor="flightRequired">Flight Required</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="hotelRequired"
                            className="rounded"
                            checked={formData.hotelRequired}
                            onChange={(e) => setFormData({ ...formData, hotelRequired: e.target.checked })}
                          />
                          <Label htmlFor="hotelRequired">Hotel Required</Label>
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="travelStipend">Travel Stipend ($)</Label>
                          <Input
                            id="travelStipend"
                            type="number"
                            value={formData.travelStipend}
                            onChange={(e) => setFormData({ ...formData, travelStipend: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="travelNotes">Travel Notes</Label>
                          <Textarea
                            id="travelNotes"
                            value={formData.travelNotes}
                            onChange={(e) => setFormData({ ...formData, travelNotes: e.target.value })}
                            rows={3}
                            placeholder="Additional travel requirements or notes..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Deal Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Deal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budgetRange">Budget Range</Label>
                        <Input
                          id="budgetRange"
                          value={formData.budgetRange}
                          onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                          placeholder="$10,000 - $20,000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dealValue">Deal Value ($)</Label>
                        <Input
                          id="dealValue"
                          type="number"
                          value={formData.dealValue}
                          onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value: Deal["status"]) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lead">New Lead</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="proposal">Proposal Sent</SelectItem>
                            <SelectItem value="negotiation">Negotiating</SelectItem>
                            <SelectItem value="won">Won</SelectItem>
                            <SelectItem value="lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value: Deal["priority"]) => setFormData({ ...formData, priority: value })}
                        >
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
                        <Label htmlFor="source">Lead Source</Label>
                        <Input
                          id="source"
                          value={formData.source}
                          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                          placeholder="Website, LinkedIn, Referral, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="nextFollowUp">Expected Close Date</Label>
                        <Input
                          id="nextFollowUp"
                          type="date"
                          value={formData.nextFollowUp}
                          onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={4}
                      placeholder="Add any additional notes about the deal..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={submitting}>
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingDeal ? "Update Deal" : "Create Deal"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelForm}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDeals}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${new Intl.NumberFormat('en-US', { 
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0 
                  }).format(pipelineValue)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wonDeals}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalContracts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Executed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{executedContracts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingContracts}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-3xl">
              <TabsTrigger value="deals" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Deals Pipeline
              </TabsTrigger>
              <TabsTrigger value="proposals" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Proposals
              </TabsTrigger>
              <TabsTrigger value="contracts" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Contracts
              </TabsTrigger>
              <TabsTrigger value="past-deals" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Past Deals
              </TabsTrigger>
            </TabsList>

            {/* Deals Tab */}
            <TabsContent value="deals" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search deals..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="lead">New Leads</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="proposal">Proposal Sent</SelectItem>
                        <SelectItem value="negotiation">Negotiating</SelectItem>
                        <SelectItem value="won">Won</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* View Toggle */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Active Deals</h2>
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "pipeline" | "list")}>
                  <TabsList>
                    <TabsTrigger value="pipeline" className="flex items-center gap-2">
                      <Kanban className="h-4 w-4" />
                      Pipeline
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex items-center gap-2">
                      <List className="h-4 w-4" />
                      List
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Deals Content */}
              {viewMode === "pipeline" ? (
                <Card>
                  <CardContent className="p-6 overflow-x-auto">
                    <div className="min-w-[1200px]">
                      <DealsKanban />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Event</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDeals.map((deal) => (
                          <TableRow key={deal.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{deal.client_name}</div>
                                <div className="text-sm text-gray-500">{deal.company}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{deal.event_title}</div>
                                <div className="text-sm text-gray-500">{deal.event_location}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              ${new Intl.NumberFormat('en-US').format(deal.deal_value)}
                            </TableCell>
                            <TableCell>
                              <DealStatusDropdown
                                currentStatus={deal.status}
                                dealId={deal.id}
                                dealName={deal.event_title}
                                onStatusChange={handleQuickStatusChange}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Badge variant="outline" className={PRIORITY_COLORS[deal.priority]}>
                                  {deal.priority.toUpperCase()}
                                </Badge>
                                {deal.pending_tasks_count && deal.pending_tasks_count > 0 && (
                                  <Link href={`/admin/tasks?deal_id=${deal.id}`}>
                                    <Badge className={deal.overdue_tasks_count && deal.overdue_tasks_count > 0 ? "bg-red-100 text-red-800 cursor-pointer hover:bg-red-200" : "bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"}>
                                      <CheckSquare className="w-3 h-3 mr-1" />
                                      {deal.pending_tasks_count}
                                      {deal.overdue_tasks_count && deal.overdue_tasks_count > 0 && ` (${deal.overdue_tasks_count}!)`}
                                    </Badge>
                                  </Link>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(deal.event_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={() => setSelectedDeal(deal)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleEdit(deal)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleDeleteDeal(deal)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                {deal.status === "won" && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleCreateContract(deal)}
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    Contract
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Contracts Tab */}
            <TabsContent value="contracts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Management</CardTitle>
                  <CardDescription>
                    Manage contracts generated from won deals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contract #</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Generated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contracts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                            No contracts found. Create contracts from won deals.
                          </TableCell>
                        </TableRow>
                      ) : (
                        contracts.map((contract) => {
                          const StatusIcon = CONTRACT_STATUSES[contract.status as keyof typeof CONTRACT_STATUSES].icon
                          const statusColor = CONTRACT_STATUSES[contract.status as keyof typeof CONTRACT_STATUSES].color
                          
                          return (
                            <TableRow key={contract.id}>
                              <TableCell className="font-medium">{contract.contract_number}</TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{contract.client_name}</p>
                                  <p className="text-sm text-gray-500">{contract.client_company}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{contract.event_title}</p>
                                  <p className="text-sm text-gray-500">{new Date(contract.event_date).toLocaleDateString()}</p>
                                </div>
                              </TableCell>
                              <TableCell>${(contract.fee_amount || contract.speaker_fee || 0).toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge className={`${statusColor} text-white`}>
                                  <StatusIcon className="mr-1 h-3 w-3" />
                                  {CONTRACT_STATUSES[contract.status as keyof typeof CONTRACT_STATUSES].label}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(contract.generated_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push(`/admin/contracts/${contract.id}`)}
                                  >
                                    View
                                  </Button>
                                  {contract.status === 'draft' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleSendContract(contract.id)}
                                    >
                                      <Send className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Proposals Tab */}
            <TabsContent value="proposals" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Proposal Management</CardTitle>
                    <CardDescription>
                      Create and manage client proposals
                    </CardDescription>
                  </div>
                  <Button onClick={() => router.push("/admin/proposals")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Proposals
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Proposal Management</h3>
                    <p className="text-gray-500 mb-4">
                      Create professional proposals, track client views, and convert opportunities into projects.
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button onClick={() => router.push("/admin/proposals/new")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Proposal
                      </Button>
                      <Button variant="outline" onClick={() => router.push("/admin/proposals")}>
                        View All Proposals
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Past Deals Tab - Won and Lost Deals */}
            <TabsContent value="past-deals" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle>Past Deals</CardTitle>
                      <CardDescription>
                        View and analyze completed deals (won and lost)
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search past deals..."
                          value={pastDealsSearch}
                          onChange={(e) => setPastDealsSearch(e.target.value)}
                          className="pl-8 w-64"
                        />
                      </div>
                      <Select value={pastDealsFilter} onValueChange={(value: any) => setPastDealsFilter(value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Deals</SelectItem>
                          <SelectItem value="won">Won Only</SelectItem>
                          <SelectItem value="lost">Lost Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={pastDealsDateRange} onValueChange={(value: any) => setPastDealsDateRange(value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="30days">Last 30 Days</SelectItem>
                          <SelectItem value="90days">Last 90 Days</SelectItem>
                          <SelectItem value="1year">Last Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Past Deals Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Won Deals</p>
                            <p className="text-2xl font-bold">{deals.filter(d => d.status === "won").length}</p>
                          </div>
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Won Value</p>
                            <p className="text-2xl font-bold">
                              {formatCurrency(
                                deals
                                  .filter(d => d.status === "won")
                                  .reduce((sum, deal) => sum + (typeof deal.deal_value === 'string' ? parseFloat(deal.deal_value) || 0 : deal.deal_value), 0)
                              )}
                            </p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Lost Deals</p>
                            <p className="text-2xl font-bold">{deals.filter(d => d.status === "lost").length}</p>
                          </div>
                          <XCircle className="h-8 w-8 text-red-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Win Rate</p>
                            <p className="text-2xl font-bold">
                              {(() => {
                                const wonCount = deals.filter(d => d.status === "won").length
                                const lostCount = deals.filter(d => d.status === "lost").length
                                const total = wonCount + lostCount
                                return total > 0 ? `${Math.round((wonCount / total) * 100)}%` : '0%'
                              })()}
                            </p>
                          </div>
                          <BarChart3 className="h-8 w-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Past Deals Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Event Date</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Closed Date</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        // Filter past deals
                        let filteredPastDeals = deals.filter(deal => 
                          deal.status === "won" || deal.status === "lost"
                        )

                        // Apply status filter
                        if (pastDealsFilter !== "all") {
                          filteredPastDeals = filteredPastDeals.filter(deal => 
                            deal.status === pastDealsFilter
                          )
                        }

                        // Apply search filter
                        if (pastDealsSearch) {
                          const search = pastDealsSearch.toLowerCase()
                          filteredPastDeals = filteredPastDeals.filter(deal =>
                            deal.client_name.toLowerCase().includes(search) ||
                            deal.company.toLowerCase().includes(search) ||
                            deal.event_title.toLowerCase().includes(search) ||
                            (deal.lost_reason && deal.lost_reason.toLowerCase().includes(search)) ||
                            (deal.lost_details && deal.lost_details.toLowerCase().includes(search))
                          )
                        }

                        // Apply date range filter
                        if (pastDealsDateRange !== "all") {
                          const now = new Date()
                          const cutoffDate = new Date()
                          
                          switch (pastDealsDateRange) {
                            case "30days":
                              cutoffDate.setDate(now.getDate() - 30)
                              break
                            case "90days":
                              cutoffDate.setDate(now.getDate() - 90)
                              break
                            case "1year":
                              cutoffDate.setFullYear(now.getFullYear() - 1)
                              break
                          }

                          filteredPastDeals = filteredPastDeals.filter(deal => {
                            const dealDate = new Date(deal.updated_at)
                            return dealDate >= cutoffDate
                          })
                        }

                        // Sort by most recent
                        filteredPastDeals.sort((a, b) => 
                          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                        )

                        return filteredPastDeals.map((deal) => (
                          <TableRow key={deal.id}>
                            <TableCell>
                              <Badge 
                                className={deal.status === "won" 
                                  ? "bg-green-500 text-white" 
                                  : "bg-red-500 text-white"
                                }
                              >
                                {deal.status === "won" ? (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                ) : (
                                  <XCircle className="h-3 w-3 mr-1" />
                                )}
                                {deal.status.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{deal.client_name}</p>
                                <p className="text-sm text-muted-foreground">{deal.company}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{deal.event_title}</p>
                                <p className="text-sm text-muted-foreground">{deal.event_location}</p>
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(deal.event_date)}</TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(typeof deal.deal_value === 'string' ? parseFloat(deal.deal_value) || 0 : deal.deal_value)}
                            </TableCell>
                            <TableCell>
                              {formatDate(deal.status === "won" ? deal.won_date : deal.lost_date || deal.updated_at)}
                            </TableCell>
                            <TableCell>
                              {deal.status === "lost" ? (
                                <div className="text-sm">
                                  {deal.lost_reason && (
                                    <p className="font-medium">Reason: {deal.lost_reason}</p>
                                  )}
                                  {deal.worth_follow_up && (
                                    <p className="text-muted-foreground">
                                      Follow up: {deal.follow_up_date ? formatDate(deal.follow_up_date) : 'TBD'}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">Successfully closed</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => setSelectedDeal(deal)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {deal.status === "lost" && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleReactivateDeal(deal)}
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      })()}
                    </TableBody>
                  </Table>

                  {(() => {
                    const hasPastDeals = deals.some(d => d.status === "won" || d.status === "lost")
                    if (!hasPastDeals) {
                      return (
                        <div className="text-center py-12">
                          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-lg text-muted-foreground">No past deals yet</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Won and lost deals will appear here for historical tracking
                          </p>
                        </div>
                      )
                    }
                    return null
                  })()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Contract Creation Dialog */}
      {showContractDialog && contractDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Create Contract</CardTitle>
                  <CardDescription>
                    Generate a contract for: {contractDeal.event_title}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowContractDialog(false)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Event Details Summary */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700">Event Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Client:</span> {contractDeal.client_name}
                    </div>
                    <div>
                      <span className="text-gray-600">Company:</span> {contractDeal.company}
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span> {new Date(contractDeal.event_date).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span> {contractDeal.event_location}
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span> {contractDeal.event_type === "virtual" ? "Virtual Event" : "In-Person Event"}
                    </div>
                    <div>
                      <span className="text-gray-600">Attendees:</span> {contractDeal.attendee_count}
                    </div>
                  </div>
                  {contractDeal.event_type === "in-person" && contractDeal.travel_required && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <h5 className="font-semibold text-sm text-gray-700 mb-2">Travel Requirements</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Flight:</span> {contractDeal.flight_required ? "Required" : "Not Required"}
                        </div>
                        <div>
                          <span className="text-gray-600">Hotel:</span> {contractDeal.hotel_required ? "Required" : "Not Required"}
                        </div>
                        {contractDeal.travel_stipend > 0 && (
                          <div className="col-span-2">
                            <span className="text-gray-600">Travel Stipend:</span> ${contractDeal.travel_stipend}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Speaker Information */}
                <div>
                  <h4 className="font-semibold mb-4">Speaker Information</h4>
                  
                  {/* Multiple Speakers Notice */}
                  {contractDeal.speaker_requested?.includes(",") && (
                    <Alert className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Multiple Speakers Detected</AlertTitle>
                      <AlertDescription>
                        This deal includes multiple speakers: {contractDeal.speaker_requested}. 
                        Please create a separate contract for each speaker. You're currently creating a contract for one speaker.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contract-speaker-name">Speaker Name *</Label>
                      <Input
                        id="contract-speaker-name"
                        value={contractFormData.speaker_name}
                        onChange={(e) => setContractFormData({...contractFormData, speaker_name: e.target.value})}
                        placeholder="Speaker full name"
                        required
                      />
                      {contractDeal.speaker_requested?.includes(",") && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Suggested speakers: {contractDeal.speaker_requested.split(",").map(s => s.trim()).join(", ")}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="contract-speaker-email">Speaker Email *</Label>
                      <Input
                        id="contract-speaker-email"
                        type="email"
                        value={contractFormData.speaker_email}
                        onChange={(e) => setContractFormData({...contractFormData, speaker_email: e.target.value})}
                        placeholder="speaker@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Engagement Details */}
                <div>
                  <h4 className="font-semibold mb-4">Engagement Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="engagement-type">Engagement Type</Label>
                      <Select 
                        value={contractFormData.engagement_type}
                        onValueChange={(value) => setContractFormData({...contractFormData, engagement_type: value})}
                      >
                        <SelectTrigger id="engagement-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keynote">Keynote Speech</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="panel">Panel Discussion</SelectItem>
                          <SelectItem value="fireside_chat">Fireside Chat</SelectItem>
                          <SelectItem value="training">Training Session</SelectItem>
                          <SelectItem value="multiple">Multiple Sessions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="session-description">Session Topic/Description</Label>
                      <Input
                        id="session-description"
                        value={contractFormData.session_description}
                        onChange={(e) => setContractFormData({...contractFormData, session_description: e.target.value})}
                        placeholder="e.g., AI and Innovation"
                      />
                    </div>
                  </div>
                  
                  {contractFormData.engagement_type === "keynote" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="keynote-duration">Keynote Duration (minutes)</Label>
                        <Input
                          id="keynote-duration"
                          type="number"
                          value={contractFormData.keynote_duration}
                          onChange={(e) => setContractFormData({...contractFormData, keynote_duration: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="qa-duration">Q&A Duration (minutes)</Label>
                        <Input
                          id="qa-duration"
                          type="number"
                          value={contractFormData.qa_duration}
                          onChange={(e) => setContractFormData({...contractFormData, qa_duration: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                  
                  {contractFormData.engagement_type === "workshop" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="workshop-duration">Workshop Duration (minutes)</Label>
                        <Input
                          id="workshop-duration"
                          type="number"
                          value={contractFormData.workshop_duration}
                          onChange={(e) => setContractFormData({...contractFormData, workshop_duration: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                  
                  {contractDeal.event_type !== "virtual" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="arrival-time">Arrival Time</Label>
                        <Input
                          id="arrival-time"
                          value={contractFormData.arrival_time}
                          onChange={(e) => setContractFormData({...contractFormData, arrival_time: e.target.value})}
                          placeholder="e.g., 10:00 am"
                        />
                      </div>
                      <div>
                        <Label htmlFor="departure-time">Departure Time</Label>
                        <Input
                          id="departure-time"
                          value={contractFormData.departure_time}
                          onChange={(e) => setContractFormData({...contractFormData, departure_time: e.target.value})}
                          placeholder="e.g., 12:30 pm"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="tech-check"
                        checked={contractFormData.tech_check_required}
                        onChange={(e) => setContractFormData({...contractFormData, tech_check_required: e.target.checked})}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="tech-check" className="text-sm">Tech check required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="alignment-meeting"
                        checked={contractFormData.alignment_meeting_required}
                        onChange={(e) => setContractFormData({...contractFormData, alignment_meeting_required: e.target.checked})}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="alignment-meeting" className="text-sm">Pre-event alignment meeting</Label>
                    </div>
                  </div>
                </div>

                {/* Financial Terms */}
                <div>
                  <h4 className="font-semibold mb-4">Financial Terms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contract-speaker-fee">Speaker Fee ($)</Label>
                      <Input
                        id="contract-speaker-fee"
                        type="number"
                        value={contractFormData.speaker_fee}
                        onChange={(e) => setContractFormData({...contractFormData, speaker_fee: e.target.value})}
                        placeholder={contractDeal.deal_value.toString()}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contract-payment-terms">Payment Terms</Label>
                      <Select 
                        value={contractFormData.payment_terms}
                        onValueChange={(value) => setContractFormData({...contractFormData, payment_terms: value})}
                      >
                        <SelectTrigger id="contract-payment-terms">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Net 30 days after event completion">Net 30 - After Event</SelectItem>
                          <SelectItem value="50% upon signing, 50% after event">50/50 Split</SelectItem>
                          <SelectItem value="Net 15 days after event completion">Net 15 - After Event</SelectItem>
                          <SelectItem value="Due upon receipt">Due on Receipt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Client Signer Information */}
                <div>
                  <h4 className="font-semibold mb-4">Client Signer Information</h4>
                  <Alert className="mb-4">
                    <AlertDescription>
                      The contract will be sent to this person for signature. If different from the main point of contact, they'll receive a direct signing link.
                    </AlertDescription>
                  </Alert>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contract-client-signer-name">Signer Name</Label>
                      <Input
                        id="contract-client-signer-name"
                        value={contractFormData.client_signer_name}
                        onChange={(e) => setContractFormData({...contractFormData, client_signer_name: e.target.value})}
                        placeholder={contractDeal.client_name}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contract-client-signer-email">Signer Email</Label>
                      <Input
                        id="contract-client-signer-email"
                        type="email"
                        value={contractFormData.client_signer_email}
                        onChange={(e) => setContractFormData({...contractFormData, client_signer_email: e.target.value})}
                        placeholder={contractDeal.client_email}
                      />
                      {contractFormData.client_signer_email && contractFormData.client_signer_email !== contractDeal.client_email && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Will CC: {contractDeal.client_email} (main contact)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Terms */}
                <div>
                  <Label htmlFor="contract-additional-terms">Additional Terms (Optional)</Label>
                  <Textarea
                    id="contract-additional-terms"
                    value={contractFormData.additional_terms}
                    onChange={(e) => setContractFormData({...contractFormData, additional_terms: e.target.value})}
                    rows={4}
                    placeholder="Any additional terms or special conditions..."
                  />
                </div>

                {/* Contract Type Notice */}
                <Alert>
                  <AlertTitle>Contract Template</AlertTitle>
                  <AlertDescription>
                    A {contractDeal.event_type === "virtual" ? "virtual" : "in-person"} event contract template will be used based on the event type.
                    {contractDeal.event_type === "in-person" && contractDeal.travel_required && 
                      " Travel arrangements will be included in the contract terms."}
                  </AlertDescription>
                </Alert>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowContractDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePreviewContract}
                    disabled={!contractFormData.speaker_name || !contractFormData.speaker_email || submitting}
                  >
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Preview Contract
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contract Preview Dialog */}
      {showContractPreview && contractDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contract Preview</CardTitle>
                  <CardDescription>
                    Review the contract before creating and sending
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContractPreview(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6">
              {/* Contract Preview Content */}
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Modern Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-light text-gray-900 tracking-wide">
                        SPEAKER SERVICES AGREEMENT
                      </h1>
                      <p className="text-gray-600 mt-2 text-sm">Professional Speaking Engagement Contract</p>
                    </div>
                    <img 
                      src="/speak-about-ai-logo.png" 
                      alt="Speak About AI" 
                      className="h-12 w-auto"
                    />
                  </div>
                </div>

                {/* Contract Body */}
                <div className="p-10 text-gray-700" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontSize: '14px', lineHeight: '1.8' }}>
                  {/* Parse and render the contract content */}
                  {contractPreviewContent.split('\n').map((line, index) => {
                    // Skip empty first line if any
                    if (index === 0 && line.trim() === '') return null
                    
                    // Empty lines for spacing
                    if (line.trim() === '') {
                      return <div key={index} style={{ height: '10px' }}></div>
                    }
                    
                    // Function to highlight dynamic content in blue
                    const highlightDynamicContent = (text: string) => {
                      // List of all dynamic values to highlight
                      const dynamicValues = [
                        contractFormData.speaker_name,
                        contractDeal.company,
                        contractDeal.event_title,
                        contractDeal.event_location,
                        contractDeal.speaker_requested,
                        contractDeal.notes?.split('Topic:')[1]?.split('\n')[0]?.trim(),
                        `${contractFormData.speaker_name} ("Speaker")`,
                        `${contractDeal.company} ("Client")`
                      ].filter(Boolean)
                      
                      // Add patterns for dates, times, money, and reference numbers
                      const patterns = [
                        /\$[\d,]+(?:\.\d{2})?(?:\sUSD)?/g, // Money amounts
                        /#\d{6}/g, // Contract reference numbers
                        /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s[A-Z][a-z]+\s\d{1,2},\s\d{4}/g, // Dates
                        /\d{1,2}:\d{2}\s[ap]m(?:\s-\s\d{1,2}:\d{2}\s[ap]m)?/g, // Times
                        /\d{1,2}-minute/g, // Duration (e.g., "40-minute keynote")
                        /Net \d+ days/g, // Payment terms
                        /one night accommodation/g, // Travel terms
                        /Travel stipend of \$[\d,]+/g // Travel stipend
                      ]
                      
                      let result = text
                      
                      // First, replace all dynamic values
                      dynamicValues.forEach(value => {
                        if (value && result.includes(value)) {
                          const regex = new RegExp(`(${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g')
                          result = result.replace(regex, '§DYNAMIC§$1§/DYNAMIC§')
                        }
                      })
                      
                      // Then, replace pattern matches
                      patterns.forEach(pattern => {
                        result = result.replace(pattern, (match) => `§DYNAMIC§${match}§/DYNAMIC§`)
                      })
                      
                      // Split by markers and create spans
                      const parts = result.split(/§DYNAMIC§|§\/DYNAMIC§/)
                      
                      return parts.map((part, i) => {
                        if (i % 2 === 1) {
                          // This is a dynamic field
                          return <span key={i} className="text-blue-600 font-semibold bg-blue-50 px-1 rounded">{part}</span>
                        }
                        return part
                      })
                    }
                    
                    // Handle numbered sections with bold (e.g., "1. Contract details:")
                    if (line.match(/^\d+\.\s+[A-Z]/)) {
                      return (
                        <div key={index} className="font-semibold text-lg mt-8 mb-4 text-gray-900 border-b border-gray-200 pb-2">
                          {highlightDynamicContent(line)}
                        </div>
                      )
                    }
                    
                    // Handle sub-sections like "6.1 EXCLUSION"
                    if (line.match(/^\d+\.\d+\s+[A-Z]/)) {
                      return (
                        <div key={index} className="font-bold mt-2 mb-1 underline">
                          {highlightDynamicContent(line)}
                        </div>
                      )
                    }
                    
                    // Handle numbered list items in parentheses
                    if (line.match(/^\(\d+\)/)) {
                      return (
                        <div key={index} className="ml-4 mb-1">
                          {highlightDynamicContent(line)}
                        </div>
                      )
                    }
                    
                    // Handle lettered items
                    if (line.match(/^[a-d]\)/)) {
                      return (
                        <div key={index} className="ml-4 mb-1">
                          {highlightDynamicContent(line)}
                        </div>
                      )
                    }
                    
                    // Handle lines that are part of details (start with capital after colon)
                    if (line.match(/^[A-Z][^:]+:/)) {
                      const [label, ...rest] = line.split(':')
                      const content = rest.join(':')
                      return (
                        <div key={index} className="mb-2 flex flex-wrap">
                          <span className="font-medium text-gray-900 mr-1">{label}:</span>
                          <span className="text-gray-700">{highlightDynamicContent(content)}</span>
                        </div>
                      )
                    }
                    
                    // Special handling for "Permissible Use:"
                    if (line.startsWith('Permissible Use:')) {
                      return (
                        <div key={index} className="mb-1">
                          <strong>{line}</strong>
                        </div>
                      )
                    }
                    
                    // Regular paragraphs
                    return (
                      <div key={index} className="mb-3 text-gray-700">
                        {highlightDynamicContent(line)}
                      </div>
                    )
                  })}

                  {/* Signature Section */}
                  <div className="mt-16 bg-gray-50 rounded-xl p-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-8">Authorized Signatures</h3>
                    
                    <div className="grid grid-cols-1 gap-12">
                      {/* Client Signature */}
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h4 className="text-sm font-medium text-gray-600 mb-4">CLIENT</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="mb-2 text-sm text-gray-500">Signature</div>
                            <div className="border-b-2 border-gray-300 h-8"></div>
                            <div className="mt-2 text-sm font-medium text-blue-600">{contractFormData.client_signer_name || contractDeal.client_name}</div>
                          </div>
                          <div>
                            <div className="mb-2 text-sm text-gray-500">Title</div>
                            <div className="border-b-2 border-gray-300 h-8"></div>
                          </div>
                          <div>
                            <div className="mb-2 text-sm text-gray-500">Date</div>
                            <div className="border-b-2 border-gray-300 h-8"></div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-blue-600 font-medium">{contractDeal.company}</div>
                      </div>
                      
                      {/* Speaker Signature */}
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h4 className="text-sm font-medium text-gray-600 mb-4">SPEAKER</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="mb-2 text-sm text-gray-500">Signature</div>
                            <div className="border-b-2 border-gray-300 h-8"></div>
                            <div className="mt-2 text-sm font-medium text-blue-600">{contractFormData.speaker_name}</div>
                          </div>
                          <div>
                            <div className="mb-2 text-sm text-gray-500">Title</div>
                            <div className="border-b-2 border-gray-300 h-8"></div>
                          </div>
                          <div>
                            <div className="mb-2 text-sm text-gray-500">Date</div>
                            <div className="border-b-2 border-gray-300 h-8"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Agent Signature */}
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h4 className="text-sm font-medium text-gray-600 mb-4">AGENT</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="mb-2 text-sm text-gray-500">Signature</div>
                            <div className="border-b-2 border-gray-300 h-8"></div>
                            <div className="mt-2 text-sm font-medium">Robert Strong</div>
                          </div>
                          <div>
                            <div className="mb-2 text-sm text-gray-500">Title</div>
                            <div className="border-b-2 border-gray-300 h-8 flex items-end">
                              <span className="text-sm pb-1">CEO</span>
                            </div>
                          </div>
                          <div>
                            <div className="mb-2 text-sm text-gray-500">Date</div>
                            <div className="border-b-2 border-gray-300 h-8"></div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm font-medium">Speak About AI</div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Speak About AI is a division of Strong Entertainment, LLC</p>
                      <p className="text-sm text-gray-500">651 Homer Avenue, Palo Alto, CA 94301</p>
                      <p className="text-xs text-gray-400 mt-2">© {new Date().getFullYear()} Strong Entertainment, LLC. All rights reserved.</p>
                    </div>
                  </div>

                  {/* Contract Status Badge */}
                  <div className="mt-8">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">DRAFT CONTRACT</p>
                          <p className="text-xs text-gray-600">This contract has not yet been sent for signatures</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-6 pt-6 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowContractPreview(false)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Edit
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Download as PDF functionality would go here
                      toast({
                        title: "Coming Soon",
                        description: "PDF download will be available soon",
                      })
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={handleSubmitContract}
                    disabled={submitting}
                  >
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create & Send Contract
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lost Deal Modal */}
      <LostDealModal
        isOpen={showLostDealModal}
        onClose={() => {
          setShowLostDealModal(false)
          setLostDealInfo(null)
        }}
        onSubmit={handleLostDealSubmit}
        dealName={lostDealInfo?.name || ''}
      />
    </div>
  )
}