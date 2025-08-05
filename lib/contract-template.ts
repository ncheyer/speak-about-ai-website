import type { Deal } from "./deals-db"

export interface ContractData extends Deal {
  contract_number: string
  speaker_name?: string
  speaker_email?: string
  speaker_fee?: number
  payment_terms?: string
  additional_terms?: string
}

export interface ContractTemplate {
  version: string
  title: string
  sections: ContractSection[]
}

export interface ContractSection {
  id: string
  title: string
  content: string
  required: boolean
}

export const DEFAULT_CONTRACT_TEMPLATE: ContractTemplate = {
  version: "v1.0",
  title: "Speaker Engagement Agreement",
  sections: [
    {
      id: "parties",
      title: "Parties",
      content: `This Speaker Engagement Agreement ("Agreement") is entered into on {{contract_date}} between:

**Client:** {{client_name}} ({{client_company}})
**Address:** {{event_location}}
**Email:** {{client_email}}
**Phone:** {{client_phone}}

**Speaker:** {{speaker_name}}
**Email:** {{speaker_email}}

**Event Details:**
- **Event Title:** {{event_title}}
- **Event Date:** {{event_date}}
- **Event Location:** {{event_location}}
- **Event Type:** {{event_type}}
- **Expected Attendees:** {{attendee_count}}`,
      required: true
    },
    {
      id: "services",
      title: "Services to be Provided",
      content: `The Speaker agrees to provide the following services:

1. **Speaking Engagement:** Deliver a presentation/keynote on AI-related topics as mutually agreed upon
2. **Duration:** Standard presentation duration unless otherwise specified
3. **Format:** {{event_type}} format as appropriate for the venue and audience
4. **Preparation:** Reasonable preparation time and materials as needed for the engagement

**Specific Requirements:**
- Presentation tailored to audience of {{attendee_count}} attendees
- Topic focus aligned with {{event_type}} format
- Professional presentation materials and setup`,
      required: true
    },
    {
      id: "compensation",
      title: "Compensation and Payment Terms",
      content: `**Speaker Fee:** ${{deal_value}} USD

**Payment Terms:**
{{payment_terms}}

**Expenses:**
- Travel expenses (if applicable) to be discussed separately
- Accommodation (if required) as per mutual agreement
- Other reasonable expenses with prior approval

**Total Contract Value:** ${{deal_value}} USD`,
      required: true
    },
    {
      id: "obligations",
      title: "Speaker Obligations",
      content: `The Speaker agrees to:

1. **Preparation:** Adequately prepare for the presentation based on agreed topics and audience
2. **Punctuality:** Arrive at the venue with sufficient time for setup and sound checks
3. **Professionalism:** Maintain professional standards throughout the engagement
4. **Materials:** Provide presentation materials in advance if requested
5. **Availability:** Be available for reasonable Q&A session following the presentation
6. **Confidentiality:** Maintain confidentiality of any proprietary information shared`,
      required: true
    },
    {
      id: "client_obligations",
      title: "Client Obligations",
      content: `The Client agrees to:

1. **Venue:** Provide appropriate venue with necessary AV equipment
2. **Payment:** Make payment according to agreed terms
3. **Information:** Provide relevant event details and audience information
4. **Support:** Ensure adequate technical support during the event
5. **Promotion:** Handle event promotion and attendee management
6. **Communication:** Maintain clear communication regarding event logistics`,
      required: true
    },
    {
      id: "cancellation",
      title: "Cancellation Policy",
      content: `**Cancellation by Client:**
- More than 30 days before event: Full refund minus 10% processing fee
- 15-30 days before event: 50% of speaker fee retained
- Less than 15 days before event: Full speaker fee retained

**Cancellation by Speaker:**
- Speaker may cancel due to illness, emergency, or force majeure
- Reasonable notice must be provided
- Client entitled to full refund if alternative speaker not provided

**Force Majeure:**
Neither party shall be liable for delays or failures due to circumstances beyond their reasonable control.`,
      required: true
    },
    {
      id: "intellectual_property",
      title: "Intellectual Property",
      content: `**Speaker's IP:** Speaker retains all rights to their presentation materials, methodologies, and intellectual property.

**Usage Rights:** Client may record the presentation for internal use only, subject to prior written consent.

**Attribution:** Any use of Speaker's materials must include proper attribution.

**Confidentiality:** Both parties agree to maintain confidentiality of proprietary information shared during the engagement.`,
      required: true
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      content: `Each party's liability under this Agreement shall be limited to the total amount paid under this Agreement.

Neither party shall be liable for any indirect, incidental, or consequential damages.

Both parties agree to maintain appropriate insurance coverage for their respective activities.`,
      required: true
    },
    {
      id: "general_terms",
      title: "General Terms",
      content: `**Governing Law:** This Agreement shall be governed by the laws of the jurisdiction where the event takes place.

**Entire Agreement:** This Agreement constitutes the entire agreement between the parties.

**Amendments:** Any modifications must be in writing and signed by both parties.

**Severability:** If any provision is deemed invalid, the remainder shall remain in effect.

**Assignment:** Neither party may assign this Agreement without written consent.

**Additional Terms:**
{{additional_terms}}`,
      required: true
    },
    {
      id: "signatures",
      title: "Electronic Signatures",
      content: `By signing below, both parties agree to the terms and conditions set forth in this Agreement.

This Agreement may be executed electronically, and electronic signatures shall be deemed equivalent to original signatures.

**Contract Number:** {{contract_number}}
**Generated Date:** {{contract_date}}

**CLIENT SIGNATURE:**
_________________________________
{{client_name}}
{{client_company}}
Date: ________________

**SPEAKER SIGNATURE:**
_________________________________
{{speaker_name}}
Date: ________________`,
      required: true
    }
  ]
}

export function generateContractContent(contractData: ContractData, template: ContractTemplate = DEFAULT_CONTRACT_TEMPLATE): string {
  // Create template variables for substitution
  const templateVars = {
    contract_number: contractData.contract_number,
    contract_date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    
    // Client information
    client_name: contractData.client_name,
    client_email: contractData.client_email,
    client_phone: contractData.client_phone || 'N/A',
    client_company: contractData.company || contractData.client_name,
    
    // Event information  
    event_title: contractData.event_title,
    event_date: new Date(contractData.event_date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    event_location: contractData.event_location,
    event_type: contractData.event_type || 'Speaking Engagement',
    attendee_count: contractData.attendee_count?.toString() || 'TBD',
    
    // Speaker information
    speaker_name: contractData.speaker_name || contractData.speaker_requested || 'TBD',
    speaker_email: contractData.speaker_email || 'TBD',
    speaker_fee: contractData.speaker_fee?.toLocaleString('en-US') || contractData.deal_value.toLocaleString('en-US'),
    
    // Financial terms
    deal_value: contractData.deal_value.toLocaleString('en-US'),
    payment_terms: contractData.payment_terms || 'Payment due within 30 days of event completion',
    
    // Additional terms
    additional_terms: contractData.additional_terms || 'No additional terms specified'
  }

  // Generate the complete contract content
  let contractContent = `# ${template.title}\n\n`
  
  template.sections.forEach((section) => {
    contractContent += `## ${section.title}\n\n`
    
    // Replace template variables in section content
    let sectionContent = section.content
    Object.entries(templateVars).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      sectionContent = sectionContent.replace(regex, value)
    })
    
    contractContent += sectionContent + '\n\n'
  })
  
  return contractContent
}

export function generateContractHTML(contractData: ContractData, template: ContractTemplate = DEFAULT_CONTRACT_TEMPLATE): string {
  const markdownContent = generateContractContent(contractData, template)
  
  // Convert markdown to HTML (simple conversion)
  let htmlContent = markdownContent
    .replace(/^# (.+)$/gm, '<h1 class="contract-title">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="section-title">$1</h2>')
    .replace(/^\*\*(.+):\*\*(.+)$/gm, '<div class="contract-item"><strong>$1:</strong>$2</div>')
    .replace(/^\*\*(.+)\*\*$/gm, '<div class="contract-header"><strong>$1</strong></div>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
  
  // Wrap in proper HTML structure with styling
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contract - ${contractData.contract_number}</title>
    <style>
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #fff;
        }
        
        .contract-title {
            text-align: center;
            color: #1E68C6;
            border-bottom: 3px solid #1E68C6;
            padding-bottom: 20px;
            margin-bottom: 40px;
            font-size: 28px;
        }
        
        .section-title {
            color: #1E68C6;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 10px;
            margin-top: 40px;
            margin-bottom: 20px;
            font-size: 20px;
        }
        
        .contract-item {
            margin: 10px 0;
            padding: 5px 0;
        }
        
        .contract-header {
            font-weight: bold;
            margin: 15px 0 10px 0;
            color: #2c3e50;
        }
        
        p {
            margin: 12px 0;
            text-align: justify;
        }
        
        li {
            margin: 8px 0;
            margin-left: 20px;
        }
        
        .signature-section {
            margin-top: 60px;
            border-top: 2px solid #1E68C6;
            padding-top: 40px;
        }
        
        .signature-block {
            margin: 40px 0;
            padding: 20px;
            border: 1px solid #ddd;
            background: #f9f9f9;
        }
        
        .signature-line {
            border-bottom: 1px solid #333;
            width: 300px;
            height: 50px;
            margin: 20px 0;
            display: inline-block;
        }
        
        @media print {
            body { margin: 0; padding: 20px; }
            .signature-block { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`
}

export function validateContractData(contractData: Partial<ContractData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Required fields validation
  if (!contractData.client_name) errors.push('Client name is required')
  if (!contractData.client_email) errors.push('Client email is required')
  if (!contractData.event_title) errors.push('Event title is required')
  if (!contractData.event_date) errors.push('Event date is required')
  if (!contractData.event_location) errors.push('Event location is required')
  if (!contractData.deal_value || contractData.deal_value <= 0) errors.push('Deal value must be greater than 0')
  
  // Email validation
  if (contractData.client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contractData.client_email)) {
    errors.push('Valid client email is required')
  }
  
  if (contractData.speaker_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contractData.speaker_email)) {
    errors.push('Valid speaker email is required')
  }
  
  // Date validation
  if (contractData.event_date) {
    const eventDate = new Date(contractData.event_date)
    if (eventDate < new Date()) {
      errors.push('Event date cannot be in the past')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}