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

    try {
      setUploading(true)
      setError(null)

      // Generate a unique filename with speaker name prefix if needed
      const filename = file.name

      // Upload to Vercel Blob
      const blob = await upload(filename, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      })

      setUploadedUrl(blob.url)
    } catch (err) {
      console.error(err)
      setError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Speaker Images</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">
            Select image file:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full mt-1 border p-2"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={uploading || !file}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

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
    </div>
  )
}
