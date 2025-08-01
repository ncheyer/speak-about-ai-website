"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Database, RefreshCw } from "lucide-react"

interface DebugResult {
  success: boolean
  connection?: string
  database?: string
  user?: string
  version?: string
  tableExists?: boolean
  rowCount?: number
  message?: string
  error?: string
  details?: string
}

export default function DebugNeonPage() {
  const [result, setResult] = useState<DebugResult | null>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug-neon")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to connect to API",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Neon Database Debug</h1>
          <p className="text-muted-foreground">Test your Neon database connection and verify the deals table setup</p>
        </div>

        <div className="grid gap-6">
          {/* Connection Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Connection Status
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testConnection}
                  disabled={loading}
                  className="ml-auto bg-transparent"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  {loading ? "Testing..." : "Refresh"}
                </Button>
              </CardTitle>
              <CardDescription>Current status of your Neon database connection</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Testing database connection...
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "Connected" : "Connection Failed"}
                    </Badge>
                  </div>

                  {result.success && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Database:</strong> {result.database}
                      </div>
                      <div>
                        <strong>User:</strong> {result.user}
                      </div>
                      <div className="md:col-span-2">
                        <strong>Version:</strong> {result.version}
                      </div>
                    </div>
                  )}

                  {result.error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">Error Details:</h4>
                      <p className="text-red-700 mb-2">{result.error}</p>
                      {result.details && <p className="text-red-600 text-sm">{result.details}</p>}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground">Click refresh to test the connection</div>
              )}
            </CardContent>
          </Card>

          {/* Table Status Card */}
          {result && result.success && (
            <Card>
              <CardHeader>
                <CardTitle>Deals Table Status</CardTitle>
                <CardDescription>Information about the deals table in your database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {result.tableExists ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <Badge variant={result.tableExists ? "default" : "secondary"}>
                      {result.tableExists ? "Table Exists" : "Table Missing"}
                    </Badge>
                  </div>

                  {result.tableExists && (
                    <div className="text-sm">
                      <strong>Row Count:</strong> {result.rowCount} deals
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">{result.message}</p>

                  {!result.tableExists && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Next Steps:</h4>
                      <ol className="text-yellow-700 text-sm space-y-1 list-decimal list-inside">
                        <li>
                          Run the <code className="bg-yellow-100 px-1 rounded">create-deals-table.sql</code> script
                        </li>
                        <li>
                          Optionally run <code className="bg-yellow-100 px-1 rounded">seed-deals-data.sql</code> for
                          sample data
                        </li>
                        <li>Refresh this page to verify the setup</li>
                      </ol>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Environment Variables Card */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Check which Neon-related environment variables are available</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span>DATABASE_URL:</span>
                  <Badge variant={process.env.DATABASE_URL ? "default" : "destructive"}>
                    {typeof window === "undefined" && process.env.DATABASE_URL ? "✓ Set" : "✗ Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>POSTGRES_URL:</span>
                  <Badge variant={process.env.POSTGRES_URL ? "default" : "secondary"}>
                    {typeof window === "undefined" && process.env.POSTGRES_URL ? "✓ Set" : "✗ Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>NEON_PROJECT_ID:</span>
                  <Badge variant={process.env.NEON_PROJECT_ID ? "default" : "secondary"}>
                    {typeof window === "undefined" && process.env.NEON_PROJECT_ID ? "✓ Set" : "✗ Missing"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
