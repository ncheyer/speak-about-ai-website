import Link from "next/link"
import { getAllLandingPages } from "@/lib/contentful-landing-page"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export const metadata = {
  title: "Available Landing Pages",
  robots: {
    index: false, // Prevents this debug page from being indexed by search engines
    follow: false,
  },
}

export default async function LandingPageDirectory() {
  const landingPages = await getAllLandingPages()

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Landing Page Directory</h1>
          <p className="text-lg text-gray-600 mt-2">
            A list of all pages with the Contentful content type:{" "}
            <code className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm">landingPage</code>
          </p>
        </header>

        {landingPages.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <ul className="divide-y divide-gray-200">
              {landingPages.map((page) => (
                <li key={page.sys.id}>
                  <Link href={`/${page.fields.slug}`} className="block p-4 hover:bg-gray-50 transition-colors">
                    <h2 className="font-semibold text-blue-600 text-lg">{page.fields.pageTitle || "Untitled Page"}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Slug: <code className="text-xs bg-gray-100 p-1 rounded">{page.fields.slug}</code>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>No Landing Pages Found</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                The application could not fetch any entries from Contentful with the content type{" "}
                <code className="text-xs bg-red-100 p-1 rounded">landingPage</code>.
              </p>
              <h3 className="font-semibold mt-4 mb-2">Troubleshooting Steps:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  <strong>Check Environment Variables:</strong> Ensure `CONTENTFUL_SPACE_ID` and
                  `CONTENTFUL_ACCESS_TOKEN` are correctly set in your Vercel project.
                </li>
                <li>
                  <strong>Verify Content Type ID:</strong> Make sure the ID in Contentful exactly matches `landingPage`.
                </li>
                <li>
                  <strong>Publish Your Content:</strong> Ensure at least one entry of this content type is{" "}
                  <strong>published</strong> in Contentful. Drafts will not appear.
                </li>
                <li>
                  <strong>Check Field Names:</strong> Confirm that your entries have a `slug` and `pageTitle` field.
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
