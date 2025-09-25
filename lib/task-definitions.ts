// Detailed task definitions for project management
export interface TaskDefinition {
  key: string
  name: string
  description: string
  requirements: string[]
  deliverables: string[]
  priority: 'critical' | 'high' | 'medium' | 'low'
  estimatedTime?: string // e.g., "30 min", "2 hours"
  owner?: 'sales' | 'operations' | 'speaker' | 'client'
}

export interface StageTaskDefinitions {
  [stage: string]: {
    [taskKey: string]: TaskDefinition
  }
}

export const TASK_DEFINITIONS: StageTaskDefinitions = {
  invoicing: {
    send_internal_contract: {
      key: 'send_internal_contract',
      name: 'Send Internal Contract to Speaker',
      description: 'Send the internal speaker agreement for review and signature',
      requirements: [
        'Speaker details confirmed',
        'Event details finalized',
        'Fee structure agreed',
        'Terms and conditions ready'
      ],
      deliverables: [
        'Contract sent to speaker',
        'Signature tracking initiated',
        'Follow-up reminders scheduled',
        'Signed copy received and filed'
      ],
      priority: 'critical',
      estimatedTime: '30 min',
      owner: 'operations'
    },
    initial_invoice_sent: {
      key: 'initial_invoice_sent',
      name: 'Send Initial Deposit Invoice',
      description: 'Generate and send the 50% deposit invoice to the client with Net 30 payment terms',
      requirements: [
        'Confirmed event date and location',
        'Signed contract',
        'Client billing contact information',
        'Purchase order (if required)'
      ],
      deliverables: [
        'Invoice PDF sent via email',
        'Invoice logged in system',
        'Payment tracking initiated'
      ],
      priority: 'critical',
      estimatedTime: '30 min',
      owner: 'operations'
    },
    final_invoice_sent: {
      key: 'final_invoice_sent',
      name: 'Send Final Balance Invoice',
      description: 'Generate and send the remaining 50% balance invoice, due on event date',
      requirements: [
        'Initial deposit received',
        'Event details finalized',
        'Any additional charges documented'
      ],
      deliverables: [
        'Final invoice PDF sent',
        'Payment reminder scheduled',
        'Client notified of payment terms'
      ],
      priority: 'high',
      estimatedTime: '30 min',
      owner: 'operations'
    },
    kickoff_meeting_planned: {
      key: 'kickoff_meeting_planned',
      name: 'Schedule Client Kickoff Meeting',
      description: 'Coordinate and schedule initial project kickoff call with all stakeholders',
      requirements: [
        'Client availability confirmed',
        'Internal team availability checked',
        'Meeting agenda prepared',
        'Calendar invites ready'
      ],
      deliverables: [
        'Meeting scheduled in calendars',
        'Zoom/Teams link created',
        'Agenda shared with participants',
        'Pre-meeting materials sent'
      ],
      priority: 'high',
      estimatedTime: '45 min',
      owner: 'sales'
    },
    event_details_confirmed: {
      key: 'event_details_confirmed',
      name: 'Confirm All Event Specifications',
      description: 'Verify and document all event details including venue, timing, format, and special requirements',
      requirements: [
        'Venue details obtained',
        'Event schedule reviewed',
        'Technical requirements listed',
        'Special requests noted'
      ],
      deliverables: [
        'Event specification document',
        'Confirmation email sent to client',
        'Internal checklist updated',
        'Risk factors identified'
      ],
      priority: 'critical',
      estimatedTime: '2 hours',
      owner: 'operations'
    }
  },
  
  logistics_planning: {
    details_confirmed: {
      key: 'details_confirmed',
      name: 'Final Event Details Confirmation',
      description: 'Conduct final verification of all event logistics with client and venue',
      requirements: [
        'Venue contract reviewed',
        'Run of show approved',
        'Load-in times confirmed',
        'Parking/access arranged'
      ],
      deliverables: [
        'Final confirmation document',
        'Venue communication log',
        'Updated project timeline',
        'Client approval received'
      ],
      priority: 'critical',
      estimatedTime: '2 hours',
      owner: 'operations'
    },
    av_requirements_gathered: {
      key: 'av_requirements_gathered',
      name: 'Compile A/V Technical Requirements',
      description: 'Document all audio/visual needs and coordinate with venue or AV vendor',
      requirements: [
        'Presentation format confirmed',
        'Microphone preferences noted',
        'Screen/projector specs obtained',
        'Recording requirements clarified'
      ],
      deliverables: [
        'AV requirements document',
        'Venue AV confirmation',
        'Backup plan documented',
        'Test schedule arranged'
      ],
      priority: 'high',
      estimatedTime: '1.5 hours',
      owner: 'operations'
    },
    press_pack_sent: {
      key: 'press_pack_sent',
      name: 'Deliver Speaker Press Pack',
      description: 'Send comprehensive media kit including bio, headshots, and promotional materials',
      requirements: [
        'Updated speaker bio',
        'High-resolution headshots',
        'Speaking topics/abstracts',
        'Social media links'
      ],
      deliverables: [
        'Press pack PDF created',
        'Materials sent to client',
        'Confirmation received',
        'Usage rights clarified'
      ],
      priority: 'medium',
      estimatedTime: '1 hour',
      owner: 'operations'
    },
    calendar_confirmed: {
      key: 'calendar_confirmed',
      name: 'Lock Speaker Calendar',
      description: 'Ensure speaker availability is confirmed and calendar is blocked',
      requirements: [
        'Travel dates confirmed',
        'Rehearsal time scheduled',
        'Buffer time included',
        'Time zones verified'
      ],
      deliverables: [
        'Calendar invites sent',
        'Travel itinerary drafted',
        'Conflicts resolved',
        'Backup dates identified'
      ],
      priority: 'critical',
      estimatedTime: '45 min',
      owner: 'speaker'
    },
    client_contact_obtained: {
      key: 'client_contact_obtained',
      name: 'Establish Day-of Contact Protocol',
      description: 'Set up communication plan for event day including emergency contacts',
      requirements: [
        'On-site contact identified',
        'Phone numbers verified',
        'Communication apps installed',
        'Backup contacts listed'
      ],
      deliverables: [
        'Contact sheet created',
        'WhatsApp/Slack group set up',
        'Emergency protocol defined',
        'All parties confirmed'
      ],
      priority: 'high',
      estimatedTime: '30 min',
      owner: 'operations'
    },
    speaker_materials_ready: {
      key: 'speaker_materials_ready',
      name: 'Prepare Speaker Presentation Materials',
      description: 'Finalize all presentation content and supporting materials',
      requirements: [
        'Presentation deck completed',
        'Handouts designed (if needed)',
        'Demo materials prepared',
        'Backup formats created'
      ],
      deliverables: [
        'Final presentation uploaded',
        'PDF backup created',
        'USB drive prepared',
        'Cloud backup confirmed'
      ],
      priority: 'high',
      estimatedTime: '3 hours',
      owner: 'speaker'
    },
    vendor_onboarding_complete: {
      key: 'vendor_onboarding_complete',
      name: 'Complete Vendor Onboarding Process',
      description: 'Ensure all vendor requirements are met including insurance, W9, and compliance',
      requirements: [
        'W9 form submitted',
        'Insurance certificates provided',
        'Vendor agreements signed',
        'Payment terms agreed'
      ],
      deliverables: [
        'Vendor profile completed',
        'Compliance verified',
        'Payment setup confirmed',
        'Access credentials provided'
      ],
      priority: 'medium',
      estimatedTime: '2 hours',
      owner: 'operations'
    }
  },
  
  pre_event: {
    logistics_confirmed: {
      key: 'logistics_confirmed',
      name: 'Final Logistics Verification',
      description: 'Complete final check of all logistical arrangements 48 hours before event',
      requirements: [
        'Travel confirmations printed',
        'Ground transportation arranged',
        'Hotel confirmations verified',
        'Event timing reconfirmed'
      ],
      deliverables: [
        'Final logistics checklist',
        'All confirmations documented',
        'Contingency plans ready',
        'Team briefed on changes'
      ],
      priority: 'critical',
      estimatedTime: '2 hours',
      owner: 'operations'
    },
    speaker_prepared: {
      key: 'speaker_prepared',
      name: 'Speaker Final Preparation',
      description: 'Ensure speaker is fully prepared with final briefing and materials check',
      requirements: [
        'Presentation rehearsed',
        'Content customized for audience',
        'Q&A anticipated',
        'Wardrobe confirmed'
      ],
      deliverables: [
        'Final prep call completed',
        'Presentation tested',
        'Backup plans confirmed',
        'Speaker confidence verified'
      ],
      priority: 'critical',
      estimatedTime: '2 hours',
      owner: 'speaker'
    },
    client_materials_sent: {
      key: 'client_materials_sent',
      name: 'Deliver Final Client Materials',
      description: 'Send all final materials and instructions to client team',
      requirements: [
        'Introduction script prepared',
        'Speaker requirements list',
        'Run of show finalized',
        'Promotional materials ready'
      ],
      deliverables: [
        'Final package sent',
        'Receipt confirmed',
        'Questions answered',
        'Last-minute updates handled'
      ],
      priority: 'high',
      estimatedTime: '1 hour',
      owner: 'operations'
    },
    ready_for_execution: {
      key: 'ready_for_execution',
      name: 'Event Readiness Checkpoint',
      description: 'Final go/no-go decision with all systems checked',
      requirements: [
        'All tasks completed',
        'Team availability confirmed',
        'Equipment checked',
        'Communications tested'
      ],
      deliverables: [
        'Readiness confirmed',
        'Go decision documented',
        'Final briefing completed',
        'Success metrics defined'
      ],
      priority: 'critical',
      estimatedTime: '1 hour',
      owner: 'operations'
    }
  },
  
  event_week: {
    final_preparations_complete: {
      key: 'final_preparations_complete',
      name: 'Complete Day-Before Preparations',
      description: 'Execute all day-before event tasks and final checks',
      requirements: [
        'Tech check completed',
        'Materials packed',
        'Team coordinated',
        'Timeline reviewed'
      ],
      deliverables: [
        'Pre-event checklist done',
        'All materials staged',
        'Team check-in completed',
        'Client notified of readiness'
      ],
      priority: 'critical',
      estimatedTime: '3 hours',
      owner: 'operations'
    },
    event_executed: {
      key: 'event_executed',
      name: 'Execute Event Successfully',
      description: 'Deliver the presentation and manage all on-site logistics',
      requirements: [
        'Arrive on time',
        'Technical setup completed',
        'Sound check done',
        'Client briefing conducted'
      ],
      deliverables: [
        'Presentation delivered',
        'Q&A session managed',
        'Recording captured (if applicable)',
        'Feedback collected'
      ],
      priority: 'critical',
      estimatedTime: 'Event duration',
      owner: 'speaker'
    },
    support_provided: {
      key: 'support_provided',
      name: 'Provide Real-Time Event Support',
      description: 'Manage all support needs during the event',
      requirements: [
        'On-site or remote availability',
        'Communication channels open',
        'Problem-solving ready',
        'Documentation ongoing'
      ],
      deliverables: [
        'Issues resolved quickly',
        'Client requests handled',
        'Event notes documented',
        'Success metrics tracked'
      ],
      priority: 'critical',
      estimatedTime: 'Event duration',
      owner: 'operations'
    }
  },
  
  follow_up: {
    follow_up_sent: {
      key: 'follow_up_sent',
      name: 'Send Post-Event Follow-Up',
      description: 'Send thank you and follow-up communications within 24 hours',
      requirements: [
        'Thank you message drafted',
        'Key contacts identified',
        'Materials promised noted',
        'Next steps defined'
      ],
      deliverables: [
        'Thank you email sent',
        'Promised materials delivered',
        'Recording link shared (if applicable)',
        'Future opportunities discussed'
      ],
      priority: 'high',
      estimatedTime: '1 hour',
      owner: 'operations'
    },
    client_feedback_requested: {
      key: 'client_feedback_requested',
      name: 'Request Client Feedback',
      description: 'Send formal feedback request and testimonial collection',
      requirements: [
        'Feedback form prepared',
        'Key questions identified',
        'Testimonial request drafted',
        'Survey link created'
      ],
      deliverables: [
        'Feedback request sent',
        'Survey responses collected',
        'Testimonial received',
        'Case study potential identified'
      ],
      priority: 'medium',
      estimatedTime: '30 min',
      owner: 'sales'
    },
    speaker_feedback_requested: {
      key: 'speaker_feedback_requested',
      name: 'Collect Speaker Feedback',
      description: 'Gather speaker insights on event experience and client',
      requirements: [
        'Debrief call scheduled',
        'Feedback form ready',
        'Experience documented',
        'Improvements noted'
      ],
      deliverables: [
        'Speaker feedback collected',
        'Insights documented',
        'Database updated',
        'Process improvements identified'
      ],
      priority: 'low',
      estimatedTime: '30 min',
      owner: 'operations'
    },
    lessons_documented: {
      key: 'lessons_documented',
      name: 'Document Lessons Learned',
      description: 'Create comprehensive post-mortem document for future reference',
      requirements: [
        'All feedback compiled',
        'Team input gathered',
        'Metrics analyzed',
        'Issues documented'
      ],
      deliverables: [
        'Post-mortem document created',
        'Best practices updated',
        'Process improvements logged',
        'Knowledge base updated'
      ],
      priority: 'low',
      estimatedTime: '2 hours',
      owner: 'operations'
    }
  }
}

// Helper function to get task urgency based on event date and stage
export function calculateTaskUrgency(
  stage: string,
  daysUntilEvent: number | null,
  taskKey: string
): 'critical' | 'high' | 'medium' | 'low' {
  if (daysUntilEvent === null) return 'low'
  
  // Stage-specific urgency rules
  const urgencyRules = {
    invoicing: {
      thresholds: { critical: 45, high: 60, medium: 90 },
      criticalTasks: ['send_internal_contract', 'initial_invoice_sent', 'event_details_confirmed']
    },
    logistics_planning: {
      thresholds: { critical: 21, high: 30, medium: 45 },
      criticalTasks: ['details_confirmed', 'calendar_confirmed']
    },
    pre_event: {
      thresholds: { critical: 3, high: 7, medium: 14 },
      criticalTasks: ['logistics_confirmed', 'speaker_prepared']
    },
    event_week: {
      thresholds: { critical: 0, high: 1, medium: 3 },
      criticalTasks: ['final_preparations_complete', 'event_executed']
    },
    follow_up: {
      thresholds: { critical: -7, high: -3, medium: 0 }, // Negative = days after event
      criticalTasks: ['follow_up_sent']
    }
  }
  
  const rules = urgencyRules[stage]
  if (!rules) return 'medium'
  
  // Check if this is a critical task
  if (rules.criticalTasks.includes(taskKey)) {
    if (daysUntilEvent <= rules.thresholds.critical) return 'critical'
  }
  
  // Apply standard thresholds
  if (daysUntilEvent <= rules.thresholds.critical) return 'critical'
  if (daysUntilEvent <= rules.thresholds.high) return 'high'
  if (daysUntilEvent <= rules.thresholds.medium) return 'medium'
  
  return 'low'
}

// Helper to get owner label
export function getTaskOwnerLabel(owner?: string): string {
  const ownerLabels = {
    sales: 'Sales Team',
    operations: 'Operations',
    speaker: 'Speaker',
    client: 'Client'
  }
  return owner ? ownerLabels[owner] || 'Team' : 'Team'
}

// Helper to get priority color
export function getPriorityColor(priority: string): string {
  const colors = {
    critical: 'text-red-600 bg-red-50',
    high: 'text-orange-600 bg-orange-50',
    medium: 'text-yellow-600 bg-yellow-50',
    low: 'text-gray-600 bg-gray-50'
  }
  return colors[priority] || colors.low
}