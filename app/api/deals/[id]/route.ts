import { type NextRequest, NextResponse } from "next/server"
import { updateDeal, deleteDeal } from "@/lib/deals-db"
import { createProject } from "@/lib/projects-db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid deal ID" }, { status: 400 })
    }

    const body = await request.json()
    
    // Get the original deal to check if status is changing
    const { getAllDeals } = await import("@/lib/deals-db")
    const deals = await getAllDeals()
    const originalDeal = deals.find(d => d.id === id)
    
    const deal = await updateDeal(id, body)

    if (!deal) {
      return NextResponse.json({ error: "Deal not found or failed to update" }, { status: 404 })
    }

    // If deal status changed to "won", create a project
    if (originalDeal && originalDeal.status !== "won" && deal.status === "won") {
      try {
        const projectData = {
          // Basic project fields
          project_name: deal.event_title,
          client_name: deal.client_name,
          client_email: deal.client_email,
          client_phone: deal.client_phone,
          company: deal.company,
          project_type: deal.event_type === "Workshop" ? "Workshop" : 
                       deal.event_type === "Keynote" ? "Speaking" :
                       deal.event_type === "Consulting" ? "Consulting" : "Other",
          description: `Event: ${deal.event_title}\nLocation: ${deal.event_location}\nAttendees: ${deal.attendee_count}\n\n${deal.notes}`,
          status: "2plus_months" as const,
          priority: deal.priority,
          start_date: new Date().toISOString().split('T')[0],
          deadline: deal.event_date,
          budget: deal.deal_value,
          spent: 0,
          completion_percentage: 0,
          
          // Event Overview - Billing Contact (from deal client info)
          billing_contact_name: deal.client_name,
          billing_contact_email: deal.client_email,
          billing_contact_phone: deal.client_phone,
          
          // Event Overview - Logistics Contact (same as billing for now)
          logistics_contact_name: deal.client_name,
          logistics_contact_email: deal.client_email,
          logistics_contact_phone: deal.client_phone,
          
          // Event Overview - Additional Fields
          end_client_name: deal.company,
          event_name: deal.event_title,
          event_date: deal.event_date,
          event_location: deal.event_location,
          event_type: deal.event_type,
          
          // Speaker Program Details
          requested_speaker_name: deal.speaker_requested,
          program_topic: `${deal.event_title} - ${deal.event_type}`,
          program_type: deal.event_type,
          audience_size: deal.attendee_count,
          audience_demographics: "To be determined during planning",
          
          // Financial Details
          speaker_fee: deal.deal_value,
          
          // Basic event fields (existing)
          attendee_count: deal.attendee_count,
          contact_person: deal.client_name,
          notes: `Deal ID: ${deal.id}\nSource: ${deal.source}\nBudget Range: ${deal.budget_range}\nOriginal notes: ${deal.notes}`,
          tags: [deal.event_type, deal.source],
          
          // Status tracking (initialized for new project)
          contract_signed: false,
          invoice_sent: false,
          payment_received: false,
          presentation_ready: false,
          materials_sent: false,
          
          // Event classification based on type
          event_classification: deal.event_type?.toLowerCase().includes('virtual') || deal.event_type?.toLowerCase().includes('webinar') ? 'virtual' :
                              deal.event_location?.toLowerCase().includes('remote') ? 'virtual' : 'local'
        }
        
        await createProject(projectData)
      } catch (error) {
        console.error("Error creating project from won deal:", error)
        // Don't fail the deal update if project creation fails
      }
    }

    return NextResponse.json(deal)
  } catch (error) {
    console.error("Error in PUT /api/deals/[id]:", error)
    return NextResponse.json(
      {
        error: "Failed to update deal",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid deal ID" }, { status: 400 })
    }

    const body = await request.json()
    
    // Get the original deal to check if status is changing
    const { getAllDeals } = await import("@/lib/deals-db")
    const deals = await getAllDeals()
    const originalDeal = deals.find(d => d.id === id)
    
    const deal = await updateDeal(id, body)

    if (!deal) {
      return NextResponse.json({ error: "Deal not found or failed to update" }, { status: 404 })
    }

    // If deal status changed to "won", create a project
    if (originalDeal && originalDeal.status !== "won" && deal.status === "won") {
      try {
        const projectData = {
          // Basic project fields
          project_name: deal.event_title,
          client_name: deal.client_name,
          client_email: deal.client_email,
          client_phone: deal.client_phone,
          company: deal.company,
          project_type: deal.event_type === "Workshop" ? "Workshop" : 
                       deal.event_type === "Keynote" ? "Speaking" :
                       deal.event_type === "Consulting" ? "Consulting" : "Other",
          description: `Event: ${deal.event_title}\nLocation: ${deal.event_location}\nAttendees: ${deal.attendee_count}\n\n${deal.notes}`,
          status: "2plus_months" as const,
          priority: deal.priority,
          start_date: new Date().toISOString().split('T')[0],
          deadline: deal.event_date,
          budget: deal.deal_value,
          spent: 0,
          completion_percentage: 0,
          
          // Event Overview - Billing Contact (from deal client info)
          billing_contact_name: deal.client_name,
          billing_contact_email: deal.client_email,
          billing_contact_phone: deal.client_phone,
          
          // Event Overview - Logistics Contact (same as billing for now)
          logistics_contact_name: deal.client_name,
          logistics_contact_email: deal.client_email,
          logistics_contact_phone: deal.client_phone,
          
          // Event Overview - Additional Fields
          end_client_name: deal.company,
          event_name: deal.event_title,
          event_date: deal.event_date,
          event_location: deal.event_location,
          event_type: deal.event_type,
          
          // Speaker Program Details
          requested_speaker_name: deal.speaker_requested,
          program_topic: `${deal.event_title} - ${deal.event_type}`,
          program_type: deal.event_type,
          audience_size: deal.attendee_count,
          audience_demographics: "To be determined during planning",
          
          // Financial Details
          speaker_fee: deal.deal_value,
          
          // Basic event fields (existing)
          attendee_count: deal.attendee_count,
          contact_person: deal.client_name,
          notes: `Deal ID: ${deal.id}\nSource: ${deal.source}\nBudget Range: ${deal.budget_range}\nOriginal notes: ${deal.notes}`,
          tags: [deal.event_type, deal.source],
          
          // Status tracking (initialized for new project)
          contract_signed: false,
          invoice_sent: false,
          payment_received: false,
          presentation_ready: false,
          materials_sent: false,
          
          // Event classification based on type
          event_classification: deal.event_type?.toLowerCase().includes('virtual') || deal.event_type?.toLowerCase().includes('webinar') ? 'virtual' :
                              deal.event_location?.toLowerCase().includes('remote') ? 'virtual' : 'local'
        }
        
        await createProject(projectData)
      } catch (error) {
        console.error("Error creating project from won deal:", error)
        // Don't fail the deal update if project creation fails
      }
    }

    return NextResponse.json(deal)
  } catch (error) {
    console.error("Error in PATCH /api/deals/[id]:", error)
    return NextResponse.json(
      {
        error: "Failed to update deal",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid deal ID" }, { status: 400 })
    }

    const success = await deleteDeal(id)

    if (!success) {
      return NextResponse.json({ error: "Deal not found or failed to delete" }, { status: 404 })
    }

    return NextResponse.json({ message: "Deal deleted successfully" })
  } catch (error) {
    console.error("Error in DELETE /api/deals/[id]:", error)
    return NextResponse.json(
      {
        error: "Failed to delete deal",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
