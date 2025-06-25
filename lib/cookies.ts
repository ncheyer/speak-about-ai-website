import { cookies } from "next/headers"

export const COOKIE_CONSENT_NAME = "cookie_consent"
export const COOKIE_CONSENT_VERSION = "1.0" // Increment if categories/logic change significantly

interface CookieOptions {
  expires?: Date | number | string
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: "lax" | "strict" | "none"
  [key: string]: any // Allow other properties
}

// Client-side cookie utilities
export const clientCookies = {
  set: (name: string, value: any, options: CookieOptions = {}) => {
    const defaults: CookieOptions = {
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    }

    const cookieOptions = { ...defaults, ...options }

    let cookieString = `${name}=${encodeURIComponent(JSON.stringify(value))}; `

    Object.entries(cookieOptions).forEach(([key, val]) => {
      if (key === "expires" && val instanceof Date) {
        cookieString += `expires=${val.toUTCString()}; `
      } else if (key === "expires" && typeof val === "number") {
        const date = new Date()
        date.setTime(date.getTime() + val)
        cookieString += `expires=${date.toUTCString()}; `
      } else {
        cookieString += `${key}=${val}; `
      }
    })

    document.cookie = cookieString
  },

  get: (name: string): any | null => {
    if (typeof document === "undefined") return null

    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1]

    try {
      return value ? JSON.parse(decodeURIComponent(value)) : null
    } catch {
      // If parsing fails (e.g. cookie not JSON stringified), return raw value or null
      return value ? decodeURIComponent(value) : null
    }
  },

  delete: (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  },
}

// Server-side cookie utilities
export const serverCookies = {
  get: (name: string): any | null => {
    try {
      const cookieStore = cookies()
      const cookie = cookieStore.get(name)
      if (!cookie || !cookie.value) return null

      return JSON.parse(cookie.value) // Assumes value is JSON stringified
    } catch (error) {
      // console.error(`Error reading server cookie "${name}":`, error);
      // Attempt to return raw value if JSON parsing fails, or null
      try {
        const cookieStore = cookies()
        const cookie = cookieStore.get(name)
        return cookie ? cookie.value : null
      } catch {
        return null
      }
    }
  },
}
