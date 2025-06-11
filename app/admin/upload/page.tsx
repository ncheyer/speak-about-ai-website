"use client"

import type React from "react"

import { useState } from "react"
import { upload } from "@vercel/blob/client"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file")
      return
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    try {
      setUploading(true)
      setError(null)

      console.log("Starting upload for file:", file.name, "Size:", file.size)

      // Upload to Vercel Blob
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      })

      console.log("Upload successful:", blob)
      setUploadedUrl(blob.url)
    } catch (err) {
      console.error("Upload error:", err)
      setError(`Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Speaker Images</h1>

      {/* Environment Check */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Environment Check:</h2>
        <p>
          BLOB_READ_WRITE_TOKEN:{" "}
          {typeof window !== "undefined"
            ? "Client-side check"
            : process.env.BLOB_READ_WRITE_TOKEN
              ? "✅ Set"
              : "❌ Not set"}
        </p>
        <p>Environment: {process.env.NODE_ENV}</p>
        <p>Vercel Environment: {process.env.VERCEL_ENV || "Not Vercel"}</p>
        {process.env.BLOB_READ_WRITE_TOKEN && (
          <p>Token starts with: {process.env.BLOB_READ_WRITE_TOKEN.substring(0, 10)}...</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">
            Select image file:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0] || null
                setFile(selectedFile)
                setError(null)
                setUploadedUrl(null)

                if (selectedFile) {
                  console.log("File selected:", {
                    name: selectedFile.name,
                    size: selectedFile.size,
                    type: selectedFile.type,
                  })
                }
              }}
              className="block w-full mt-1 border p-2"
            />
          </label>
          {file && (
            <div className="mt-2 text-sm text-gray-600">
              <p>File: {file.name}</p>
              <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <p>Type: {file.type}</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading || !file}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {uploadedUrl && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-bold">Upload Successful!</h2>

          <div className="p-4 bg-gray-100 rounded">
            <p className="font-mono text-sm break-all">{uploadedUrl}</p>
          </div>

          <div className="border p-4">
            <p className="mb-2 font-bold">Image Preview:</p>
            <img src={uploadedUrl || "/placeholder.svg"} alt="Uploaded image" className="max-w-full h-auto" />
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="font-bold">Next Steps:</p>
            <p className="mt-2">Copy this URL and paste it in your Google Sheet for the speaker's image field.</p>
          </div>
        </div>
      )}

      {/* Debug Information */}
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="font-bold mb-2">Debug Information:</h3>
        <p>Check the browser console (F12) for detailed error messages.</p>
        <p>If you see CORS errors, the API route might not be configured correctly.</p>
        <p>If you see 404 errors, make sure the /api/upload route exists.</p>
      </div>
    </div>
  )
}
