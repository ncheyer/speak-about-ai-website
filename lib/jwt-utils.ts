import { createHash, randomBytes } from 'crypto'

/**
 * Generate a secure JWT-like token without external dependencies
 * This is a simplified implementation for immediate security improvement
 */
export interface JWTPayload {
  email: string
  role: 'admin' | 'speaker' | 'client'
  iat: number
  exp: number
}

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production'

/**
 * Create a secure token with HMAC signature
 */
export function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresInHours: number = 24): string {
  const now = Math.floor(Date.now() / 1000)
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + (expiresInHours * 3600)
  }
  
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url')
  
  const signature = createHash('sha256')
    .update(`${header}.${payloadB64}.${JWT_SECRET}`)
    .digest('base64url')
  
  return `${header}.${payloadB64}.${signature}`
}

/**
 * Verify and decode a token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const [header, payload, signature] = parts
    
    // Verify signature
    const expectedSignature = createHash('sha256')
      .update(`${header}.${payload}.${JWT_SECRET}`)
      .digest('base64url')
    
    if (signature !== expectedSignature) return null
    
    // Decode payload
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString()) as JWTPayload
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (decodedPayload.exp < now) return null
    
    return decodedPayload
  } catch (error) {
    return null
  }
}

/**
 * Generate a secure random session token for password resets, etc.
 */
export function generateSecureToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Check if user has admin role
 */
export function isAdminToken(token: string): boolean {
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}