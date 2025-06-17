import { contentfulClient } from "@/lib/contentful"

export default async function DebugContentfulPage() {
  const debugInfo = {
    envVars: {
      spaceId: !!process.env.CONTENTFUL_SPACE_ID,
      accessToken: !!process.env.CONTENTFUL_ACCESS_TOKEN,
      spaceIdValue: process.env.CONTENTFUL_SPACE_ID?.substring(0, 8) + "...",
      accessTokenValue: process.env.CONTENTFUL_ACCESS_TOKEN?.substring(0, 8) + "...",
      spaceIdLength: process.env.CONTENTFUL_SPACE_ID?.length || 0,
      accessTokenLength: process.env.CONTENTFUL_ACCESS_TOKEN?.length || 0,
    },
    connectionTest: null as any,
    rawError: null as string | null,
  }

  // Test basic connection first
  try {
    console.log("Testing basic Contentful connection...")

    // Try the most basic call possible
    const space = await contentfulClient.getSpace()
    debugInfo.connectionTest = {
      success: true,
      spaceName: space.name,
      spaceId: space.sys.id,
    }
  } catch (error: any) {
    debugInfo.connectionTest = {
      success: false,
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    }
    debugInfo.rawError = JSON.stringify(error, null, 2)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Contentful Connection Debug</h1>

      {/* Environment Variables */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Environment Variables</h2>
        <div className="bg-gray-50 border rounded-lg p-4">
          <div className="space-y-2">
            <div>
              <strong>CONTENTFUL_SPACE_ID:</strong>
              <span className={debugInfo.envVars.spaceId ? "text-green-600" : "text-red-600"}>
                {debugInfo.envVars.spaceId
                  ? ` ✅ Set (${debugInfo.envVars.spaceIdLength} chars) - ${debugInfo.envVars.spaceIdValue}`
                  : " ❌ Missing"}
              </span>
            </div>
            <div>
              <strong>CONTENTFUL_ACCESS_TOKEN:</strong>
              <span className={debugInfo.envVars.accessToken ? "text-green-600" : "text-red-600"}>
                {debugInfo.envVars.accessToken
                  ? ` ✅ Set (${debugInfo.envVars.accessTokenLength} chars) - ${debugInfo.envVars.accessTokenValue}`
                  : " ❌ Missing"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Test */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Connection Test</h2>
        <div className="bg-gray-50 border rounded-lg p-4">
          {debugInfo.connectionTest?.success ? (
            <div className="text-green-600">
              <p>✅ Successfully connected to Contentful!</p>
              <p>
                <strong>Space Name:</strong> {debugInfo.connectionTest.spaceName}
              </p>
              <p>
                <strong>Space ID:</strong> {debugInfo.connectionTest.spaceId}
              </p>
            </div>
          ) : (
            <div className="text-red-600">
              <p>❌ Failed to connect to Contentful</p>
              {debugInfo.connectionTest?.error && (
                <div className="mt-2">
                  <p>
                    <strong>Error:</strong> {debugInfo.connectionTest.error}
                  </p>
                  {debugInfo.connectionTest.status && (
                    <p>
                      <strong>HTTP Status:</strong> {debugInfo.connectionTest.status} -{" "}
                      {debugInfo.connectionTest.statusText}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Raw Error Details */}
      {debugInfo.rawError && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Raw Error Details</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <pre className="text-xs text-red-800 overflow-auto whitespace-pre-wrap">{debugInfo.rawError}</pre>
          </div>
        </div>
      )}

      {/* Troubleshooting Guide */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting Steps</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-blue-800">1. Check Environment Variables</h3>
              <ul className="text-sm text-blue-700 ml-4 list-disc">
                <li>Space ID should be around 12 characters long</li>
                <li>Access Token should be much longer (64+ characters)</li>
                <li>Make sure there are no extra spaces or quotes</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-blue-800">2. Verify Contentful Credentials</h3>
              <ul className="text-sm text-blue-700 ml-4 list-disc">
                <li>Go to Contentful → Settings → API keys</li>
                <li>Use the "Content Delivery API" token (not Preview API)</li>
                <li>Make sure the API key is not disabled</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-blue-800">3. Common Error Codes</h3>
              <ul className="text-sm text-blue-700 ml-4 list-disc">
                <li>
                  <strong>401 Unauthorized:</strong> Wrong access token
                </li>
                <li>
                  <strong>404 Not Found:</strong> Wrong space ID
                </li>
                <li>
                  <strong>403 Forbidden:</strong> API key doesn't have access to this space
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Setup Instructions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Environment Setup</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 mb-2">
            Add these to your <code>.env.local</code> file:
          </p>
          <pre className="bg-yellow-100 p-2 rounded text-sm">
            {`CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here`}
          </pre>
          <p className="text-yellow-700 text-sm mt-2">
            After updating, restart your development server with <code>npm run dev</code>
          </p>
        </div>
      </div>
    </div>
  )
}
