import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Constructs a full URL for an image path from the backend.
 * - If the path is already a full URL, it's returned as is.
 * - If the path is relative (starts with '/'), it prepends the backend URL.
 * @param imagePath The path to the image from the Payload API.
 * @returns The full, absolute URL to the image or null if the path is invalid.
 */
export function getImageUrl(imagePath?: string | null): string | null {
  const backendUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL

  if (!imagePath) {
    return null
  }

  // If it's already a full URL, return it directly
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }

  // If it's a relative path, prepend the backend URL
  if (imagePath.startsWith("/")) {
    if (!backendUrl) {
      console.warn("NEXT_PUBLIC_PAYLOAD_URL is not set, but a relative image path was provided.")
      return imagePath // Return the relative path as a fallback
    }
    return `${backendUrl}${imagePath}`
  }

  // Fallback for any other case (though less common)
  return imagePath
}
