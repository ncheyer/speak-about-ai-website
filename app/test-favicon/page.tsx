export default function TestFaviconPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-800">Favicon Test Page</h1>

      <p className="max-w-md text-center text-lg text-gray-600">
        Look at the browser tab. You should see the circular Speak&nbsp;About&nbsp;AI logo.
      </p>

      <p className="max-w-md text-center text-sm text-gray-500">
        If that logo appears, your favicon is correctly configured site-wide.
      </p>
    </main>
  )
}
