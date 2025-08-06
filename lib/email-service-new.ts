// Resend email service configuration
import { Deal, DealFormData } from './deals-utils'

// Initialize Resend client - optional dependency
let resend: any = null
if (typeof window === 'undefined') { // Only on server side
  try {
    // Dynamically import Resend only if installed
    const { Resend } = require('resend')
    resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
  } catch (error) {
    console.warn('Resend not installed. Run: npm install resend')
  }
}

/**
 * Send email notification for new deal submission
 */
export async function sendNewInquiryEmail(deal: Deal, formData: DealFormData): Promise<boolean> {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@speakabout.ai'
  const adminEmails = ['human@speakabout.ai', 'noah@speakabout.ai']
  
  if (!resend) {
    console.warn('Resend not configured - skipping email notification')
    return false
  }

  try {
    // Send admin notification
    const adminEmail = await resend.emails.send({
      from: fromEmail,
      to: adminEmails,
      subject: `New Speaker Inquiry: ${deal.clientName} - ${deal.organizationName || 'N/A'}`,
      html: generateAdminEmailHtml(deal, formData),
      text: generateAdminEmailText(deal, formData)
    })

    console.log('✅ Admin notification sent:', adminEmail)

    // Send client confirmation
    const clientEmail = await resend.emails.send({
      from: fromEmail,
      to: deal.clientEmail,
      subject: 'Thank you for your speaker inquiry - Speak About AI',
      html: generateClientConfirmationHtml(deal, formData),
      text: generateClientConfirmationText(deal, formData)
    })

    console.log('✅ Client confirmation sent:', clientEmail)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

/**
 * Generate HTML email for admin notification
 */
export function generateAdminEmailHtml(deal: Deal, formData: DealFormData): string {
  const speakersList = formData.specificSpeaker 
    ? `<p><strong>Requested Speakers:</strong> ${formData.specificSpeaker}</p>`
    : ''

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: 600; color: #666; }
          .value { color: #000; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
          .button { display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎤 New Speaker Inquiry Received</h2>
            <p style="margin: 0; color: #666;">Submitted on ${new Date().toLocaleString()}</p>
          </div>
          
          <h3>Contact Information</h3>
          <div class="field">
            <span class="label">Name:</span> <span class="value">${deal.clientName}</span>
          </div>
          <div class="field">
            <span class="label">Email:</span> <span class="value"><a href="mailto:${deal.clientEmail}">${deal.clientEmail}</a></span>
          </div>
          ${deal.phone ? `<div class="field"><span class="label">Phone:</span> <span class="value">${deal.phone}</span></div>` : ''}
          ${deal.organizationName ? `<div class="field"><span class="label">Organization:</span> <span class="value">${deal.organizationName}</span></div>` : ''}
          
          <h3>Event Details</h3>
          ${deal.eventDate ? `<div class="field"><span class="label">Event Date:</span> <span class="value">${new Date(deal.eventDate).toLocaleDateString()}</span></div>` : ''}
          ${deal.eventLocation ? `<div class="field"><span class="label">Location:</span> <span class="value">${deal.eventLocation}</span></div>` : ''}
          ${deal.eventBudget ? `<div class="field"><span class="label">Budget:</span> <span class="value">${formatBudget(deal.eventBudget)}</span></div>` : ''}
          
          ${speakersList}
          
          ${deal.additionalInfo ? `
            <h3>Additional Information</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
              ${deal.additionalInfo.replace(/\n/g, '<br>')}
            </div>
          ` : ''}
          
          <div style="margin-top: 30px;">
            <a href="https://speakabout.ai/admin/deals" class="button">View in CRM →</a>
          </div>
          
          <div class="footer">
            <p>This inquiry was submitted through the contact form on speakabout.ai</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Generate plain text email for admin notification
 */
export function generateAdminEmailText(deal: Deal, formData: DealFormData): string {
  return `
New Speaker Inquiry Received
=============================

CONTACT INFORMATION
Name: ${deal.clientName}
Email: ${deal.clientEmail}
${deal.phone ? `Phone: ${deal.phone}` : ''}
${deal.organizationName ? `Organization: ${deal.organizationName}` : ''}

EVENT DETAILS
${deal.eventDate ? `Event Date: ${new Date(deal.eventDate).toLocaleDateString()}` : ''}
${deal.eventLocation ? `Location: ${deal.eventLocation}` : ''}
${deal.eventBudget ? `Budget: ${formatBudget(deal.eventBudget)}` : ''}

${formData.specificSpeaker ? `Requested Speakers: ${formData.specificSpeaker}` : ''}

${deal.additionalInfo ? `ADDITIONAL INFORMATION\n${deal.additionalInfo}` : ''}

---
View in CRM: https://speakabout.ai/admin/deals
  `.trim()
}

/**
 * Generate HTML email for client confirmation
 */
export function generateClientConfirmationHtml(deal: Deal, formData: DealFormData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Thank You for Your Inquiry!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">We've received your speaker request</p>
          </div>
          
          <div class="content">
            <p>Dear ${deal.clientName},</p>
            
            <p>Thank you for your interest in booking an AI keynote speaker through Speak About AI. We've received your inquiry and are excited to help you find the perfect speaker for your event.</p>
            
            <h3>What Happens Next?</h3>
            <ol>
              <li><strong>Review:</strong> Our team will review your requirements and event details</li>
              <li><strong>Recommendations:</strong> We'll prepare personalized speaker recommendations based on your needs</li>
              <li><strong>Contact:</strong> We'll reach out within 24 hours with our suggestions and availability</li>
            </ol>
            
            <h3>Your Inquiry Summary</h3>
            <div style="background: #f9fafb; padding: 15px; border-radius: 5px; margin: 15px 0;">
              ${deal.organizationName ? `<p><strong>Organization:</strong> ${deal.organizationName}</p>` : ''}
              ${deal.eventDate ? `<p><strong>Event Date:</strong> ${new Date(deal.eventDate).toLocaleDateString()}</p>` : ''}
              ${deal.eventLocation ? `<p><strong>Location:</strong> ${deal.eventLocation}</p>` : ''}
              ${formData.specificSpeaker ? `<p><strong>Speakers of Interest:</strong> ${formData.specificSpeaker}</p>` : ''}
            </div>
            
            <p>If you have any immediate questions or need to provide additional information, please don't hesitate to reach out:</p>
            
            <p>
              📞 Call: (510) 435-3947<br>
              ✉️ Email: human@speakabout.ai
            </p>
            
            <p>We look forward to helping make your event a success!</p>
            
            <p>Best regards,<br>
            The Speak About AI Team</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Speak About AI. All rights reserved.</p>
            <p>You're receiving this email because you submitted an inquiry on our website.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Generate plain text email for client confirmation
 */
export function generateClientConfirmationText(deal: Deal, formData: DealFormData): string {
  return `
Dear ${deal.clientName},

Thank you for your interest in booking an AI keynote speaker through Speak About AI. We've received your inquiry and are excited to help you find the perfect speaker for your event.

WHAT HAPPENS NEXT?
1. Review: Our team will review your requirements and event details
2. Recommendations: We'll prepare personalized speaker recommendations based on your needs
3. Contact: We'll reach out within 24 hours with our suggestions and availability

YOUR INQUIRY SUMMARY
${deal.organizationName ? `Organization: ${deal.organizationName}` : ''}
${deal.eventDate ? `Event Date: ${new Date(deal.eventDate).toLocaleDateString()}` : ''}
${deal.eventLocation ? `Location: ${deal.eventLocation}` : ''}
${formData.specificSpeaker ? `Speakers of Interest: ${formData.specificSpeaker}` : ''}

If you have any immediate questions or need to provide additional information, please don't hesitate to reach out:

📞 Call: (510) 435-3947
✉️ Email: human@speakabout.ai

We look forward to helping make your event a success!

Best regards,
The Speak About AI Team

---
© ${new Date().getFullYear()} Speak About AI. All rights reserved.
  `.trim()
}

/**
 * Format budget for display
 */
function formatBudget(budget: string): string {
  const budgetMap: Record<string, string> = {
    'under-10k': 'Under $10,000',
    '10k-25k': '$10,000 - $25,000',
    '25k-50k': '$25,000 - $50,000',
    '50k-100k': '$50,000 - $100,000',
    'over-100k': 'Over $100,000',
    'discuss': "Let's discuss"
  }
  return budgetMap[budget] || budget
}