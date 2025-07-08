import Image from "next/image"

export default function TestFaviconPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 p-8">
      <div className="flex flex-col items-center gap-6 rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Favicon Test Page</h1>
        <p className="max-w-md text-lg text-gray-600">The image below should match the icon in your browser tab.</p>
        <Image src="/new-ai-logo.png" alt="Speak About AI Favicon" width={64} height={64} className="rounded-full" />
      </div>
    </main>
  )
}
