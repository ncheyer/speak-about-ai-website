import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, isAdminToken } from './jwt-utils'

/**
 * Authentication middleware for admin routes
 */
export function requireAdminAuth(request: NextRequest): NextResponse | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization')
  let token: string | null = null
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  } else {
    // Fallback to cookie
    const cookieToken = request.cookies.get('adminSessionToken')?.value
    if (cookieToken) {
      token = cookieToken
    }
  }
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'NO_TOKEN' }, 
      { status: 401 }
    )
  }
  
  if (!isAdminToken(token)) {
    return NextResponse.json(
      { error: 'Invalid or expired token', code: 'INVALID_TOKEN' }, 
      { status: 401 }
    )
  }
  
  return null // No error, auth successful
}

/**
 * Authentication middleware for speaker routes
 */
export function requireSpeakerAuth(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get('authorization')
  let token: string | null = null
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  } else {
    const cookieToken = request.cookies.get('speakerSessionToken')?.value
    if (cookieToken) {
      token = cookieToken
    }
  }
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'NO_TOKEN' }, 
      { status: 401 }
    )
  }
  
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'speaker') {
    return NextResponse.json(
      { error: 'Invalid or expired token', code: 'INVALID_TOKEN' }, 
      { status: 401 }
    )
  }
  
  return null // No error, auth successful
}

/**
 * Get the authenticated user from token
 */
export function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  let token: string | null = null
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  } else {
    // Try different cookie names based on user type
    const adminToken = request.cookies.get('adminSessionToken')?.value
    const speakerToken = request.cookies.get('speakerSessionToken')?.value
    const clientToken = request.cookies.get('clientSessionToken')?.value
    
    token = adminToken || speakerToken || clientToken || null
  }
  
  if (!token) return null
  
  return verifyToken(token)
}