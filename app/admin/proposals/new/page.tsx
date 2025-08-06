"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Save,
  Send,
  Eye,
  DollarSign,
  User,
  FileText,
  CheckSquare,
  CreditCard,
  Star,
  Briefcase,
  ChevronDown
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { Deal } from "@/lib/deals-db"
import type { Speaker as SpeakerType, Service, Deliverable, PaymentMilestone, Testimonial, CaseStudy } from "@/lib/proposals-db"
import { proposalTemplates, getTemplateById } from "@/lib/proposal-templates"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function NewProposalPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [deals, setDeals] = useState<Deal[]>([])
  const [speakers, setSpeakers] = useState<any[]>([])
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [showDealDialog, setShowDealDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [speakerSearchOpen, setSpeakerSearchOpen] = useState<{ [key: number]: boolean }>({})
  
  // Edit mode
  const editId = searchParams.get('edit')
  const isEditMode = !!editId
  const [loadingProposal, setLoadingProposal] = useState(false)
  
  console.log("Proposal form mode:", {
    editId,
    isEditMode,
    url: typeof window !== 'undefined' ? window.location.href : 'server'
  })
  
  // Form state
  const [formData, setFormData] = useState({
    deal_id: "",
    title: "",
    client_name: "",
    client_email: "",
    client_company: "",
    client_title: "",
    executive_summary: "",
    event_title: "",
    event_date: undefined as Date | undefined,
    event_location: "",
    event_type: "",
    event_format: "in-person" as "in-person" | "virtual" | "hybrid",
    attendee_count: "",
    event_description: "",
    payment_terms: "Net 30 days after event completion",
    why_us: "",
    terms_conditions: "",
    valid_days: "30"
  })

  const [proposalSpeakers, setProposalSpeakers] = useState<SpeakerType[]>([])
  const [services, setServices] = useState<Service[]>([
    { name: "Keynote Presentation", description: "60-minute keynote address", price: 0, included: true }
  ])
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { name: "Pre-event consultation", description: "Virtual meeting to align on objectives", timeline: "2 weeks before event" }
  ])
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentMilestone[]>([
    { amount: 0, percentage: 50, due_date: "Upon contract signing", description: "Initial deposit" },
    { amount: 0, percentage: 50, due_date: "Within 30 days after event", description: "Final payment" }
  ])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])

  useEffect(() => {
    fetchDeals()
    fetchSpeakers()
    
    // Load proposal data if in edit mode
    if (isEditMode && editId) {
      loadProposalForEdit(editId)
    } else {
      // Show deal dialog only for new proposals
      setShowDealDialog(true)
    }
  }, [isEditMode, editId])

  useEffect(() => {
    // Auto-calculate payment amounts based on total
    const total = calculateTotal()
    setPaymentSchedule(prev => prev.map(milestone => ({
      ...milestone,
      amount: milestone.percentage ? (total * milestone.percentage / 100) : milestone.amount
    })))
  }, [services])

  useEffect(() => {
    // Update deal with speakers when speakers are modified (debounced)
    if (formData.deal_id && proposalSpeakers.length > 0 && proposalSpeakers.some(s => s.name)) {
      const timeoutId = setTimeout(() => {
        updateDealWithSpeakers(formData.deal_id, proposalSpeakers.filter(s => s.name), "draft")
      }, 1000) // Debounce for 1 second
      
      return () => clearTimeout(timeoutId)
    }
  }, [proposalSpeakers, formData.deal_id])

  const fetchDeals = async () => {
    try {
      const response = await fetch("/api/deals")
      if (response.ok) {
        const data = await response.json()
        setDeals(data.filter((d: Deal) => ["qualified", "proposal", "negotiation"].includes(d.status)))
      }
    } catch (error) {
      console.error("Error fetching deals:", error)
    }
  }

  const fetchSpeakers = async () => {
    try {
      const response = await fetch("/api/speakers")
      if (response.ok) {
        const data = await response.json()
        console.log("Speakers API response:", data)
        // The main API returns an object with a speakers property
        const speakersList = data.speakers || []
        // Filter to only show active/listed speakers
        const activeSpeakers = speakersList.filter((s: any) => s.active !== false)
        console.log(`Found ${activeSpeakers.length} active speakers`)
        setSpeakers(activeSpeakers)
      } else {
        console.error("Failed to fetch speakers:", response.status)
        setSpeakers([])
      }
    } catch (error) {
      console.error("Error fetching speakers:", error)
      setSpeakers([])
    }
  }

  const loadProposalForEdit = async (proposalId: string) => {
    setLoadingProposal(true)
    try {
      const response = await fetch(`/api/proposals/${proposalId}`)
      if (response.ok) {
        const proposal = await response.json()
        
        // Populate form data
        setFormData({
          deal_id: proposal.deal_id || "",
          title: proposal.title || "",
          client_name: proposal.client_name || "",
          client_email: proposal.client_email || "",
          client_company: proposal.client_company || "",
          client_title: proposal.client_title || "",
          executive_summary: proposal.executive_summary || "",
          event_title: proposal.event_title || "",
          event_date: proposal.event_date ? new Date(proposal.event_date) : undefined,
          event_location: proposal.event_location || "",
          event_type: proposal.event_type || "",
          event_format: proposal.event_format || "in-person",
          attendee_count: proposal.attendee_count?.toString() || "",
          event_description: proposal.event_description || "",
          payment_terms: proposal.payment_terms || "Net 30 days after event completion",
          why_us: proposal.why_us || "",
          terms_conditions: proposal.terms_conditions || "",
          valid_days: "30"
        })
        
        // Populate speakers
        if (proposal.speakers && proposal.speakers.length > 0) {
          setProposalSpeakers(proposal.speakers)
        }
        
        // Populate services
        if (proposal.services && proposal.services.length > 0) {
          setServices(proposal.services)
        }
        
        // Populate deliverables
        if (proposal.deliverables && proposal.deliverables.length > 0) {
          setDeliverables(proposal.deliverables)
        }
        
        // Populate payment schedule
        if (proposal.payment_schedule && proposal.payment_schedule.length > 0) {
          setPaymentSchedule(proposal.payment_schedule)
        }
        
        // Populate testimonials and case studies if they exist
        if (proposal.testimonials) {
          setTestimonials(proposal.testimonials)
        }
        if (proposal.case_studies) {
          setCaseStudies(proposal.case_studies)
        }
        
        toast({
          title: "Proposal loaded",
          description: "You can now edit the proposal"
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to load proposal",
          variant: "destructive"
        })
        router.push("/admin/crm?tab=proposals")
      }
    } catch (error) {
      console.error("Error loading proposal:", error)
      toast({
        title: "Error",
        description: "Failed to load proposal",
        variant: "destructive"
      })
      router.push("/admin/crm?tab=proposals")
    } finally {
      setLoadingProposal(false)
    }
  }

  const handleDealSelect = (dealId: string) => {
    if (dealId === "none") {
      setFormData(prev => ({
        ...prev,
        deal_id: ""
      }))
      setShowDealDialog(false)
      setShowTemplateDialog(true)
      return
    }
    
    const deal = deals.find(d => d.id.toString() === dealId)
    if (deal) {
      // Generate a descriptive title
      let proposalTitle = `${deal.company}`
      if (deal.event_location) {
        proposalTitle += ` - ${deal.event_location}`
      }
      if (deal.speaker_requested) {
        proposalTitle += ` (${deal.speaker_requested})`
      }
      
      setFormData(prev => ({
        ...prev,
        deal_id: dealId,
        title: proposalTitle,
        client_name: deal.client_name,
        client_email: deal.client_email,
        client_company: deal.company,
        event_title: deal.event_title,
        event_date: deal.event_date ? new Date(deal.event_date) : undefined,
        event_location: deal.event_location,
        event_type: deal.event_type,
        attendee_count: deal.attendee_count.toString()
      }))
      
      // Set initial speaker fee if speaker is requested
      if (deal.speaker_requested && services.length > 0) {
        setServices(prev => prev.map((s, i) => 
          i === 0 ? { ...s, price: deal.deal_value } : s
        ))
      }
      
      // Auto-populate speakers if specified in deal
      if (deal.speaker_requested) {
        // Parse multiple speakers (comma-separated, semicolon-separated, or "and" separated)
        const speakerNames = deal.speaker_requested
          .split(/[,;&]+|\s+and\s+|\s+\&\s+/)
          .map(name => name.trim())
          .filter(name => name.length > 0)
        
        console.log("Parsing requested speakers:", speakerNames)
        
        const populatedSpeakers: SpeakerType[] = []
        
        speakerNames.forEach((speakerName, index) => {
          // Try to find the requested speaker in the speakers database
          const requestedSpeaker = speakers.find(s => 
            s.name.toLowerCase().includes(speakerName.toLowerCase()) ||
            speakerName.toLowerCase().includes(s.name.toLowerCase()) ||
            s.name.toLowerCase() === speakerName.toLowerCase()
          )
          
          if (requestedSpeaker) {
            // Get first video URL if available
            const firstVideo = requestedSpeaker.videos && requestedSpeaker.videos.length > 0 
              ? requestedSpeaker.videos[0] 
              : null
            
            const videoUrl = firstVideo ? (typeof firstVideo === 'string' ? firstVideo : firstVideo.url || '') : ""
            
            console.log(`Auto-populating speaker ${index + 1} from deal:`, requestedSpeaker.name)
            console.log(`Speaker ${index + 1} video URL:`, videoUrl)
            
            populatedSpeakers.push({
              name: requestedSpeaker.name,
              slug: requestedSpeaker.slug,
              title: requestedSpeaker.title || "",
              bio: requestedSpeaker.bio || requestedSpeaker.shortBio || "",
              topics: requestedSpeaker.topics || requestedSpeaker.primary_topics || [],
              fee: speakerNames.length > 1 ? Math.round((deal.deal_value || 0) / speakerNames.length) : (deal.deal_value || 0),
              availability_confirmed: false,
              video_url: videoUrl,
              image_url: requestedSpeaker.image || requestedSpeaker.headshot_url || ""
            })
          } else {
            // Speaker not found in database, create a placeholder
            console.log(`Speaker ${index + 1} not found in database, creating placeholder for:`, speakerName)
            populatedSpeakers.push({
              name: speakerName,
              title: "",
              bio: "",
              topics: [],
              fee: speakerNames.length > 1 ? Math.round((deal.deal_value || 0) / speakerNames.length) : (deal.deal_value || 0),
              availability_confirmed: false,
              video_url: ""
            })
          }
        })
        
        setProposalSpeakers(populatedSpeakers)
        console.log(`Auto-populated ${populatedSpeakers.length} speakers from deal`)
      }
      
      setShowDealDialog(false)
      setShowTemplateDialog(true)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = getTemplateById(templateId)
    if (template) {
      // Apply template defaults
      // Generate a better title if company info is available
      let proposalTitle = template.defaultData.title || formData.title
      if (formData.client_company && !formData.title) {
        proposalTitle = `${formData.client_company} - ${template.name}`
        if (formData.event_location) {
          proposalTitle = `${formData.client_company} - ${formData.event_location}`
        }
      }
      
      setFormData(prev => ({
        ...prev,
        title: proposalTitle,
        executive_summary: template.defaultData.executive_summary || prev.executive_summary,
        payment_terms: template.defaultData.payment_terms || prev.payment_terms,
        why_us: template.defaultData.why_us || prev.why_us,
        terms_conditions: template.defaultData.terms_conditions || prev.terms_conditions
      }))
      
      // Set services, deliverables, and payment schedule from template
      setServices(template.defaultData.services)
      setDeliverables(template.defaultData.deliverables)
      setPaymentSchedule(template.defaultData.payment_schedule)
      
      setSelectedTemplate(templateId)
      setShowTemplateDialog(false)
    }
  }

  const addSpeaker = () => {
    const newSpeakers = [...proposalSpeakers, {
      name: "",
      title: "",
      bio: "",
      topics: [],
      fee: 0,
      availability_confirmed: false,
      video_url: ""
    }]
    setProposalSpeakers(newSpeakers)
  }

  const updateSpeaker = (index: number, speaker: SpeakerType) => {
    setProposalSpeakers(prev => prev.map((s, i) => i === index ? speaker : s))
  }

  const removeSpeaker = (index: number) => {
    setProposalSpeakers(prev => prev.filter((_, i) => i !== index))
  }

  const addService = () => {
    setServices([...services, {
      name: "",
      description: "",
      price: 0,
      included: true
    }])
  }

  const updateService = (index: number, service: Service) => {
    setServices(prev => prev.map((s, i) => i === index ? service : s))
  }

  const removeService = (index: number) => {
    setServices(prev => prev.filter((_, i) => i !== index))
  }

  const addDeliverable = () => {
    setDeliverables([...deliverables, {
      name: "",
      description: "",
      timeline: ""
    }])
  }

  const updateDeliverable = (index: number, deliverable: Deliverable) => {
    setDeliverables(prev => prev.map((d, i) => i === index ? deliverable : d))
  }

  const removeDeliverable = (index: number) => {
    setDeliverables(prev => prev.filter((_, i) => i !== index))
  }

  const calculateTotal = () => {
    return services.reduce((sum, service) => sum + (service.included ? service.price : 0), 0)
  }

  const updateDealWithSpeakers = async (dealId: string, speakers: SpeakerType[], proposalStatus: string) => {
    if (!dealId || speakers.length === 0) return
    
    try {
      const speakerNames = speakers.map(s => s.name).join(", ")
      console.log("Updating deal with speakers:", speakerNames)
      
      const response = await fetch(`/api/deals/${dealId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          speaker_requested: speakerNames,
          status: proposalStatus === "sent" ? "proposal" : "qualified"
        })
      })
      
      if (response.ok) {
        console.log("Successfully updated deal with speakers")
      } else {
        console.warn("Failed to update deal with speakers")
      }
    } catch (error) {
      console.error("Error updating deal with speakers:", error)
    }
  }

  const handleSubmit = async (status: "draft" | "sent" = "draft") => {
    setLoading(true)

    try {
      const validUntil = new Date()
      validUntil.setDate(validUntil.getDate() + parseInt(formData.valid_days))

      const proposalData = {
        ...formData,
        status,
        event_date: formData.event_date?.toISOString().split('T')[0],
        attendee_count: parseInt(formData.attendee_count) || 0,
        speakers: proposalSpeakers,
        services,
        deliverables,
        subtotal: calculateTotal(),
        total_investment: calculateTotal(),
        payment_schedule: paymentSchedule,
        testimonials,
        case_studies: caseStudies,
        valid_until: validUntil.toISOString().split('T')[0],
        created_by: "Admin" // TODO: Get from auth
      }

      console.log(`${isEditMode ? 'Updating' : 'Creating'} proposal data:`, proposalData)

      const url = isEditMode ? `/api/proposals/${editId}` : "/api/proposals"
      const method = isEditMode ? "PUT" : "POST"
      
      console.log("Request details:", {
        url,
        method,
        editId,
        isEditMode
      })

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposalData)
      })

      if (response.ok) {
        const proposal = await response.json()
        
        // Update the associated deal with the selected speakers if deal_id exists
        if (formData.deal_id && proposalSpeakers.length > 0) {
          await updateDealWithSpeakers(formData.deal_id, proposalSpeakers, status)
        }
        
        toast({
          title: "Success",
          description: isEditMode ? "Proposal updated successfully" : "Proposal published successfully"
        })
        router.push(`/admin/proposals/${proposal.id}`)
      } else {
        let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} proposal`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
          console.error("API Error Response:", response.status, errorData)
        } catch (e) {
          const errorText = await response.text()
          console.error("API Error Response (text):", response.status, errorText)
        }
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} proposal:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'create'} proposal`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingProposal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Loading proposal...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Proposal' : 'Create Proposal'}</h1>
            <p className="text-gray-600">{isEditMode ? 'Update your proposal details' : 'Build a compelling proposal for your client'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSubmit("draft")} disabled={loading}>
            <FileText className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basics" className="space-y-4">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="speakers">Speakers</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview & Send</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="deal">Link to Deal (Optional)</Label>
                <Select value={formData.deal_id} onValueChange={handleDealSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a deal to auto-fill information" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {deals.map(deal => (
                      <SelectItem key={deal.id} value={deal.id.toString()}>
                        {deal.client_name} - {deal.event_title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Proposal Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Speaking Engagement Proposal for Annual Conference 2024"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_name">Client Name</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="client_email">Client Email</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="client_company">Company</Label>
                  <Input
                    id="client_company"
                    value={formData.client_company}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_company: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="client_title">Client Title</Label>
                  <Input
                    id="client_title"
                    value={formData.client_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_title: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Event Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="event_title">Event Title</Label>
                <Input
                  id="event_title"
                  value={formData.event_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, event_title: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.event_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.event_date ? format(formData.event_date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.event_date}
                        onSelect={(date) => setFormData(prev => ({ ...prev, event_date: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="event_format">Event Format</Label>
                  <Select 
                    value={formData.event_format} 
                    onValueChange={(value: "in-person" | "virtual" | "hybrid") => 
                      setFormData(prev => ({ ...prev, event_format: value }))
                    }
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="event_location">Location</Label>
                  <Input
                    id="event_location"
                    value={formData.event_location}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_location: e.target.value }))}
                    placeholder={formData.event_format === "virtual" ? "Virtual/Online" : "City, State/Country"}
                  />
                </div>

                <div>
                  <Label htmlFor="attendee_count">Expected Attendees</Label>
                  <Input
                    id="attendee_count"
                    type="number"
                    value={formData.attendee_count}
                    onChange={(e) => setFormData(prev => ({ ...prev, attendee_count: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="event_description">Event Description</Label>
                <Textarea
                  id="event_description"
                  value={formData.event_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, event_description: e.target.value }))}
                  rows={3}
                  placeholder="Brief description of the event, its objectives, and target audience"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="speakers" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Speakers</h2>
              <Button onClick={addSpeaker} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Speaker
              </Button>
            </div>

            {proposalSpeakers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No speakers added yet</p>
            ) : (
              <div className="space-y-4">
                {proposalSpeakers.map((speaker, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium">Speaker {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSpeaker(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Speaker Name</Label>
                        <Popover 
                          open={speakerSearchOpen[index] || false} 
                          onOpenChange={(open) => setSpeakerSearchOpen(prev => ({ ...prev, [index]: open }))}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={speakerSearchOpen[index] || false}
                              className="w-full justify-between"
                            >
                              {speaker.name || "Search speakers..."}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search speakers..." />
                              <CommandEmpty>
                                <div className="p-4 text-sm text-center">
                                  <p className="text-gray-500 mb-2">No speaker found.</p>
                                  <Button
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      const customName = document.querySelector(`[placeholder="Search speakers..."]`)?.value || ""
                                      if (customName) {
                                        updateSpeaker(index, { ...speaker, name: customName })
                                        setSpeakerSearchOpen(prev => ({ ...prev, [index]: false }))
                                      }
                                    }}
                                  >
                                    Use custom name
                                  </Button>
                                </div>
                              </CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {Array.isArray(speakers) && speakers.length > 0 ? (
                                    speakers.map((s) => (
                                      <CommandItem
                                        key={s.id}
                                        value={s.name}
                                        onSelect={() => {
                                          // Get first video URL if available
                                          const firstVideo = s.videos && s.videos.length > 0 
                                            ? s.videos[0] 
                                            : null
                                          
                                          const videoUrl = firstVideo ? (typeof firstVideo === 'string' ? firstVideo : firstVideo.url || '') : ""
                                          
                                          console.log("Selected speaker:", s.name)
                                          console.log("Speaker full data:", s)
                                          console.log("Speaker videos:", s.videos)
                                          console.log("First video:", firstVideo)
                                          console.log("Extracted video URL:", videoUrl)
                                          console.log("Image URL:", s.image || s.headshot_url)
                                          
                                          updateSpeaker(index, {
                                            ...speaker,
                                            name: s.name,
                                            slug: s.slug,
                                            title: s.title || "",
                                            bio: s.bio || s.shortBio || "",
                                            topics: s.topics || s.primary_topics || [],
                                            image_url: s.image || s.headshot_url || "",
                                            video_url: videoUrl
                                          })
                                          setSpeakerSearchOpen(prev => ({ ...prev, [index]: false }))
                                        }}
                                        className="flex items-center justify-between"
                                      >
                                        <div>
                                          <div className="font-medium">{s.name}</div>
                                          {s.title && (
                                            <div className="text-sm text-gray-500">{s.title}</div>
                                          )}
                                        </div>
                                        {s.topics && s.topics.length > 0 && (
                                          <Badge variant="secondary" className="text-xs">
                                            {s.topics[0]}
                                          </Badge>
                                        )}
                                      </CommandItem>
                                    ))
                                  ) : (
                                    <CommandItem disabled>No speakers available</CommandItem>
                                  )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <Label>Speaker Fee</Label>
                        <Input
                          type="number"
                          value={speaker.fee}
                          onChange={(e) => updateSpeaker(index, { ...speaker, fee: parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Label>Title</Label>
                        <Input
                          value={speaker.title || ""}
                          onChange={(e) => updateSpeaker(index, { ...speaker, title: e.target.value })}
                          placeholder="e.g., CEO, Author, AI Expert"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Label>Bio</Label>
                        <Textarea
                          value={speaker.bio}
                          onChange={(e) => updateSpeaker(index, { ...speaker, bio: e.target.value })}
                          rows={3}
                          placeholder="Brief speaker bio"
                        />
                      </div>
                      
                      <div className="col-span-2 flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                        <Switch
                          id={`availability-${index}`}
                          checked={speaker.availability_confirmed || false}
                          onCheckedChange={(checked) => updateSpeaker(index, { ...speaker, availability_confirmed: checked })}
                        />
                        <Label htmlFor={`availability-${index}`} className="cursor-pointer">
                          Availability Confirmed for Event Date
                        </Label>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Services & Deliverables</h2>
              <div className="flex gap-2">
                <Button onClick={addService} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
                <Button onClick={addDeliverable} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deliverable
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Services</h3>
                <div className="space-y-3">
                  {services.map((service, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <Input
                          placeholder="Service name"
                          value={service.name}
                          onChange={(e) => updateService(index, { ...service, name: e.target.value })}
                        />
                        <Input
                          placeholder="Description"
                          value={service.description}
                          onChange={(e) => updateService(index, { ...service, description: e.target.value })}
                        />
                        <Input
                          type="number"
                          placeholder="Price"
                          value={service.price}
                          onChange={(e) => updateService(index, { ...service, price: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <Switch
                        checked={service.included}
                        onCheckedChange={(checked) => updateService(index, { ...service, included: checked })}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeService(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Deliverables</h3>
                <div className="space-y-3">
                  {deliverables.map((deliverable, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <Input
                          placeholder="Deliverable name"
                          value={deliverable.name}
                          onChange={(e) => updateDeliverable(index, { ...deliverable, name: e.target.value })}
                        />
                        <Input
                          placeholder="Description"
                          value={deliverable.description}
                          onChange={(e) => updateDeliverable(index, { ...deliverable, description: e.target.value })}
                        />
                        <Input
                          placeholder="Timeline"
                          value={deliverable.timeline}
                          onChange={(e) => updateDeliverable(index, { ...deliverable, timeline: e.target.value })}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDeliverable(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="investment" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Investment & Payment Terms</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Investment</span>
                  <span className="text-2xl font-bold">${calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="payment_terms">Payment Terms</Label>
                <Textarea
                  id="payment_terms"
                  value={formData.payment_terms}
                  onChange={(e) => setFormData(prev => ({ ...prev, payment_terms: e.target.value }))}
                  rows={2}
                />
              </div>

              <div>
                <h3 className="font-medium mb-3">Payment Schedule</h3>
                <div className="space-y-3">
                  {paymentSchedule.map((milestone, index) => (
                    <div key={index} className="grid grid-cols-4 gap-3">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={milestone.amount}
                        onChange={(e) => setPaymentSchedule(prev => 
                          prev.map((m, i) => i === index ? { ...m, amount: parseFloat(e.target.value) || 0 } : m)
                        )}
                      />
                      <Input
                        type="number"
                        placeholder="Percentage"
                        value={milestone.percentage}
                        onChange={(e) => setPaymentSchedule(prev => 
                          prev.map((m, i) => i === index ? { ...m, percentage: parseFloat(e.target.value) || 0 } : m)
                        )}
                      />
                      <Input
                        placeholder="Due date"
                        value={milestone.due_date}
                        onChange={(e) => setPaymentSchedule(prev => 
                          prev.map((m, i) => i === index ? { ...m, due_date: e.target.value } : m)
                        )}
                      />
                      <Input
                        placeholder="Description"
                        value={milestone.description}
                        onChange={(e) => setPaymentSchedule(prev => 
                          prev.map((m, i) => i === index ? { ...m, description: e.target.value } : m)
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Additional Content</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="executive_summary">Executive Summary</Label>
                <Textarea
                  id="executive_summary"
                  value={formData.executive_summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, executive_summary: e.target.value }))}
                  rows={4}
                  placeholder="A brief overview of the proposal and value proposition"
                />
              </div>

              <div>
                <Label htmlFor="why_us">Why Choose Us</Label>
                <Textarea
                  id="why_us"
                  value={formData.why_us}
                  onChange={(e) => setFormData(prev => ({ ...prev, why_us: e.target.value }))}
                  rows={4}
                  placeholder="Explain why you're the best choice for this engagement"
                />
              </div>

              <div>
                <Label htmlFor="terms_conditions">Terms & Conditions</Label>
                <Textarea
                  id="terms_conditions"
                  value={formData.terms_conditions}
                  onChange={(e) => setFormData(prev => ({ ...prev, terms_conditions: e.target.value }))}
                  rows={4}
                  placeholder="Standard terms and conditions"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Proposal Settings</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="valid_days">Valid For (Days)</Label>
                <Input
                  id="valid_days"
                  type="number"
                  value={formData.valid_days}
                  onChange={(e) => setFormData(prev => ({ ...prev, valid_days: e.target.value }))}
                  min="1"
                  max="90"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Proposal will expire {formData.valid_days} days after creation
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Preview & Send</h2>
            
            {/* Preview Section */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Proposal Preview</h3>
                <p className="text-gray-600 mb-4">
                  See how your proposal will look to the client before sending.
                </p>
                
                {/* Live Preview Iframe */}
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                  <iframe 
                    src={(() => {
                      try {
                        const previewData = {
                          ...formData,
                          speakers: proposalSpeakers,
                          services,
                          deliverables,
                          payment_schedule: paymentSchedule,
                          total_investment: calculateTotal()
                        }
                        // Remove any undefined values that might cause encoding issues
                        const cleanData = JSON.parse(JSON.stringify(previewData))
                        return `/proposal/preview?data=${encodeURIComponent(JSON.stringify(cleanData))}`
                      } catch (error) {
                        console.error("Error encoding preview data:", error)
                        return `/proposal/preview?data=${encodeURIComponent(JSON.stringify({}))}`
                      }
                    })()}
                    className="w-full h-full"
                    title="Proposal Preview"
                  />
                </div>
              </div>


              {/* Send Options */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Send Proposal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Send To</Label>
                    <Input 
                      value={formData.client_email} 
                      readOnly 
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label>Additional Recipients (comma-separated)</Label>
                    <Input 
                      placeholder="cc@example.com, another@example.com"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label>Personal Message (Optional)</Label>
                  <Textarea 
                    placeholder="Add a personal note to accompany the proposal..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <Button 
                    onClick={() => handleSubmit("draft")}
                    variant="outline"
                    disabled={loading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button 
                    onClick={() => handleSubmit("draft")}
                    disabled={loading}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Publish Proposal
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      try {
                        const previewData = {
                          ...formData,
                          speakers: proposalSpeakers,
                          services,
                          deliverables,
                          payment_schedule: paymentSchedule,
                          total_investment: calculateTotal()
                        }
                        // Remove any undefined values that might cause encoding issues
                        const cleanData = JSON.parse(JSON.stringify(previewData))
                        const link = `/proposal/preview?data=${encodeURIComponent(JSON.stringify(cleanData))}`
                        window.open(link, '_blank')
                      } catch (error) {
                        console.error("Error opening preview:", error)
                        toast({
                          title: "Error",
                          description: "Failed to open preview. Please check the console for details.",
                          variant: "destructive"
                        })
                      }
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Deal Selection Dialog */}
      <Dialog open={showDealDialog} onOpenChange={setShowDealDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Link to Existing Deal</DialogTitle>
            <DialogDescription>
              Select a deal to auto-fill proposal information, or start from scratch
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[60vh] pr-2">
            <div className="space-y-3">
              <Card 
                className="p-3 cursor-pointer hover:border-blue-500 transition-colors border-2 border-dashed"
                onClick={() => handleDealSelect("none")}
              >
                <div className="text-center">
                  <h3 className="font-medium mb-1">Start from Scratch</h3>
                  <p className="text-xs text-gray-600">Create a proposal without linking to an existing deal</p>
                </div>
              </Card>
              
              {deals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {deals.map(deal => (
                    <Card 
                      key={deal.id}
                      className="p-3 cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => handleDealSelect(deal.id.toString())}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-sm leading-tight">{deal.client_name}</h3>
                          <Badge variant="secondary" className="text-xs ml-2">
                            {deal.status}
                          </Badge>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-600 font-medium">{deal.company}</p>
                          <p className="text-xs text-gray-500 mt-1">{deal.event_title}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          {deal.event_location && (
                            <span className="bg-gray-100 px-2 py-1 rounded">📍 {deal.event_location}</span>
                          )}
                          {deal.event_date && (
                            <span className="bg-gray-100 px-2 py-1 rounded">📅 {new Date(deal.event_date).toLocaleDateString()}</span>
                          )}
                        </div>
                        
                        {deal.speaker_requested && (
                          <div className="bg-blue-50 px-2 py-1 rounded text-xs">
                            🎤 {deal.speaker_requested}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">No deals available. You can still create a proposal from scratch.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Selection Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose a Proposal Template</DialogTitle>
            <DialogDescription>
              {formData.client_company ? 
                `Select a template for ${formData.client_company}, or start from scratch` :
                "Select a template to get started quickly, or start from scratch"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            {proposalTemplates.map((template) => (
              <Card 
                key={template.id}
                className="p-4 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => handleTemplateSelect(template.id)}
              >
                <h3 className="font-semibold mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {template.category}
                </Badge>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button 
              variant="ghost"
              onClick={() => setShowTemplateDialog(false)}
            >
              Start from Scratch
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}