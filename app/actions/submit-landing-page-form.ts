"use server"

import { neon } from '@neondatabase/serverless'
import { headers } from 'next/headers'

interface FormData {
  name: string
  email: string
  phone?: string
  organizationName?: string
  company?: string
  specificSpeaker?: string
  eventDate?: string
  eventLocation?: string
  eventBudget?: string
  additionalInfo?: string
  message?: string
  newsletterOptOut?: boolean
  [key: string]: any // Allow additional fields from dynamic forms
}

// Initialize Resend if available
let resend: any = null
try {
  const { Resend } = require('resend')
  resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
} catch (error) {
  console.warn('Resend not available for email notifications')
}

async function sendConfirmationEmail(formData: FormData) {
  if (!resend) {
    console.log('Resend not configured - skipping email')
    return false
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@speakabout.ai'
  const adminEmails = ['human@speakabout.ai', 'noah@speakabout.ai']
  
  try {
    // Send admin notification
    await resend.emails.send({
      from: fromEmail,
      to: adminEmails,
      subject: `New Form Submission: ${formData.name || formData.email} - ${formData.organizationName || formData.company || 'N/A'}`,
      html: `
        <h2>New Landing Page Form Submission</h2>
        <h3>Contact Information</h3>
        <ul>
          <li><strong>Name:</strong> ${formData.name || 'Not provided'}</li>
          <li><strong>Email:</strong> ${formData.email}</li>
          <li><strong>Phone:</strong> ${formData.phone || 'Not provided'}</li>
          <li><strong>Organization:</strong> ${formData.organizationName || formData.company || 'Not provided'}</li>
        </ul>
        
        ${formData.eventDate || formData.eventLocation || formData.eventBudget ? `
        <h3>Event Details</h3>
        <ul>
          ${formData.specificSpeaker ? `<li><strong>Speaker Interest:</strong> ${formData.specificSpeaker}</li>` : ''}
          ${formData.eventDate ? `<li><strong>Event Date:</strong> ${formData.eventDate}</li>` : ''}
          ${formData.eventLocation ? `<li><strong>Location:</strong> ${formData.eventLocation}</li>` : ''}
          ${formData.eventBudget ? `<li><strong>Budget:</strong> ${formData.eventBudget}</li>` : ''}
        </ul>
        ` : ''}
        
        ${formData.additionalInfo || formData.message ? `
        <h3>Message</h3>
        <p>${formData.additionalInfo || formData.message}</p>
        ` : ''}
        
        <p><strong>Newsletter:</strong> ${!formData.newsletterOptOut ? 'Opted In' : 'Opted Out'}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Submitted at ${new Date().toLocaleString()}</p>
      `
    })

    // Send client confirmation
    await resend.emails.send({
      from: fromEmail,
      to: formData.email,
      subject: 'Thank you for contacting Speak About AI',
      html: `
        <h2>Thank you for your interest!</h2>
        <p>Dear ${formData.name || 'Valued Customer'},</p>
        <p>We've received your submission and will get back to you within 24 hours.</p>
        
        <h3>What you submitted:</h3>
        <ul>
          <li><strong>Name:</strong> ${formData.name || 'Not provided'}</li>
          <li><strong>Email:</strong> ${formData.email}</li>
          ${formData.organizationName || formData.company ? `<li><strong>Organization:</strong> ${formData.organizationName || formData.company}</li>` : ''}
          ${formData.message || formData.additionalInfo ? `<li><strong>Message:</strong> ${formData.message || formData.additionalInfo}</li>` : ''}
        </ul>
        
        <p>Best regards,<br>The Speak About AI Team</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Speak About AI | Leading AI Keynote Speakers<br>
          <a href="https://speakabout.ai">speakabout.ai</a>
        </p>
      `
    })

    return true
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}

export async function submitLandingPageForm(formData: FormData): Promise<{ success: boolean; message: string }> {
  console.log("[Server Action] submitLandingPageForm called with:", formData)

  try {
    // Get request headers for tracking
    let userAgent = ''
    let referer = ''
    let ip = null
    
    try {
      const headersList = await headers()
      userAgent = headersList.get('user-agent') || ''
      referer = headersList.get('referer') || ''
      const forwardedFor = headersList.get('x-forwarded-for')
      const realIp = headersList.get('x-real-ip')
      ip = forwardedFor || realIp || null
    } catch (headerError) {
      console.log('Could not get headers:', headerError)
    }

    // Database connection - must use environment variable
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not configured')
    }
    const sql = neon(databaseUrl)

    // Save to form_submissions table
    const [submission] = await sql`
      INSERT INTO form_submissions (
        submission_type,
        source_url,
        name,
        email,
        phone,
        organization_name,
        specific_speaker,
        event_date,
        event_location,
        event_budget,
        message,
        additional_info,
        form_data,
        newsletter_opt_in,
        ip_address,
        user_agent,
        referrer,
        status
      ) VALUES (
        'landing_page',
        ${referer},
        ${formData.name || 'Website Visitor'},
        ${formData.email.toLowerCase()},
        ${formData.phone || null},
        ${formData.organizationName || formData.company || null},
        ${formData.specificSpeaker || null},
        ${formData.eventDate || null},
        ${formData.eventLocation || null},
        ${formData.eventBudget || null},
        ${formData.message || null},
        ${formData.additionalInfo || null},
        ${JSON.stringify(formData)},
        ${!formData.newsletterOptOut},
        ${ip},
        ${userAgent},
        ${referer},
        'new'
      )
      RETURNING id
    `
    
    console.log('[Server Action] Form submission saved with ID:', submission.id)

    // Add to newsletter if opted in
    if (!formData.newsletterOptOut) {
      try {
        // Check if email already exists
        const existing = await sql`
          SELECT id, status FROM newsletter_signups 
          WHERE email = ${formData.email.toLowerCase()}
        `
        
        if (existing.length === 0) {
          // New subscriber
          await sql`
            INSERT INTO newsletter_signups (
              email, name, company, status, source
            ) VALUES (
              ${formData.email.toLowerCase()},
              ${formData.name || 'Website Visitor'},
              ${formData.organizationName || formData.company || null},
              'active',
              'landing_page_form'
            )
          `
          console.log('Added to newsletter')
        } else if (existing[0].status === 'unsubscribed') {
          // Reactivate unsubscribed user
          await sql`
            UPDATE newsletter_signups 
            SET status = 'active', 
                subscribed_at = CURRENT_TIMESTAMP,
                unsubscribed_at = NULL,
                name = ${formData.name || 'Website Visitor'},
                company = ${formData.organizationName || formData.company || null}
            WHERE id = ${existing[0].id}
          `
          console.log('Reactivated newsletter subscription')
        }
      } catch (error) {
        console.error('Newsletter signup error:', error)
        // Don't fail the form submission if newsletter signup fails
      }
    }

    // Send email notifications
    const emailSent = await sendConfirmationEmail(formData)
    if (!emailSent) {
      console.log('Email notifications could not be sent, but form was saved')
    }

    return { 
      success: true, 
      message: "Thank you! Your submission has been received. We'll get back to you within 24 hours." 
    }
    
  } catch (error: any) {
    console.error('[Server Action] Form submission error:', error)
    console.error('[Server Action] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return {
      success: false,
      message: "We're sorry, but there was an error processing your submission. Please try again or contact us directly."
    }
  }
}