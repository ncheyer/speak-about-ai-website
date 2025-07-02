import Link from "next/link"
import { getAllLandingPages } from "@/lib/contentful-landing-page"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, CheckCircle, XCircle } from "lucide-react"

export const metadata = {
  title: "Available Landing Pages",
  robots: { index: false, follow: false },
}

export default async function LandingPageDirectory() {
  const allLandingPages = await getAllLandingPages()
  const validPages = allLandingPages.filter((page) => page.fields?.slug)
  const invalidPages = allLandingPages.filter((page) => !page.fields?.slug)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Landing Page Directory</h1>
          <p className="text-lg text-gray-600 mt-2">
            A list of all published pages with the Contentful content type:{" "}
            <code className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm">landingPage</code>
          </p>
        </header>

        {allLandingPages.length > 0 ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" /> Valid & Linkable Pages
              </h2>
              {validPages.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <ul className="divide-y divide-gray-200">
                    {validPages.map((page) => (
                      <li key={page.sys.id}>
                        <Link href={`/${page.fields.slug}`} className="block p-4 hover:bg-gray-50 transition-colors">
                          <h3 className="font-semibold text-blue-600 text-lg">
                            {page.fields.pageTitle || "Untitled Page"}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Slug: <code className="text-xs bg-gray-100 p-1 rounded">{page.fields.slug}</code>
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500">No valid pages with a slug were found.</p>
              )}
            </div>

            {invalidPages.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-3 flex items-center">
                  <XCircle className="h-6 w-6 text-red-500 mr-2" /> Invalid Pages (Missing Slug)
                </h2>
                <div className="bg-white border border-red-200 rounded-lg shadow-sm">
                  <ul className="divide-y divide-red-200">
                    {invalidPages.map((page) => (
                      <li key={page.sys.id} className="p-4">
                        <h3 className="font-semibold text-red-700 text-lg">
                          {page.fields.pageTitle || "Untitled Page"}
                        </h3>
                        <p className="text-sm text-red-600 mt-1">
                          This page cannot be linked because its 'slug' field is empty in Contentful.
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>No Landing Pages Found</AlertTitle>
            <AlertDescription>
              The application could not fetch any entries from Contentful with the content type{" "}
              <code className="text-xs bg-red-100 p-1 rounded">landingPage</code>. Please check your environment
              variables and ensure at least one entry is published.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
