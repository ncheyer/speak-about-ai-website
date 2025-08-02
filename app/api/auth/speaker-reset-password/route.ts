import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { generateSecureToken, hashPassword, validatePassword } from '@/lib/password-utils'

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL!)

// Request password reset
export async function POST(request: NextRequest) {
  try {
    const { email, resetToken, newPassword } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // If this is a password reset request (no resetToken provided)
    if (!resetToken) {
      // Find speaker by email
      const speakers = await sql`
        SELECT id, email, name, active
        FROM speakers
        WHERE email = ${email.toLowerCase()} AND active = true
        LIMIT 1
      `

      if (speakers.length === 0) {
        // Don't reveal if email exists or not for security
        return NextResponse.json({
          success: true,
          message: 'If an account with this email exists, you will receive a password reset link.'
        })
      }

      const speaker = speakers[0]

      // Generate reset token (expires in 1 hour)
      const resetToken = generateSecureToken()
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

      // Store reset token
      await sql`
        UPDATE speakers
        SET 
          reset_token = ${resetToken},
          reset_token_expires = ${expiresAt.toISOString()},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${speaker.id}
      `

      // In a real application, send email with reset link here
      const response: any = {
        success: true,
        message: 'Password reset link sent to your email address.'
      }

      // In development, include reset token for testing
      if (process.env.NODE_ENV === 'development') {
        response.resetToken = resetToken
        response.resetUrl = `/portal/speaker-reset-password?token=${resetToken}`
      }

      return NextResponse.json(response)
    }

    // If this is a password reset completion (resetToken and newPassword provided)
    if (!newPassword) {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      )
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      )
    }

    // Find speaker with valid reset token
    const speakers = await sql`
      SELECT id, email, name, reset_token_expires
      FROM speakers
      WHERE reset_token = ${resetToken} 
        AND active = true 
        AND reset_token_expires > NOW()
      LIMIT 1
    `

    if (speakers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    const speaker = speakers[0]

    // Hash new password
    const passwordHash = hashPassword(newPassword)

    // Update password and clear reset token
    await sql`
      UPDATE speakers
      SET 
        password_hash = ${passwordHash},
        reset_token = NULL,
        reset_token_expires = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${speaker.id}
    `

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
      speaker: {
        id: speaker.id,
        email: speaker.email,
        name: speaker.name
      }
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Failed to process password reset. Please try again.' },
      { status: 500 }
    )
  }
}