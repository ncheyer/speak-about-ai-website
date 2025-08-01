"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Database, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface DebugResult {
  success?: boolean
  connection?: string
  currentTime?: string
  postgresVersion?: string
  dealsTableExists?: boolean
  databaseUrl?: string
  error?: string
  details?: string
  availableEnvVars?: string[]
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
        error: "Failed to fetch debug info",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Neon Database Debug</h1>
          <p className="text-gray-600">Test your Neon database connection and configuration</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Connection Test
            </CardTitle>
            <CardDescription>Click the button below to test your Neon database connection</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testConnection} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Test Neon Connection
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Connection Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.success ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Connected
                    </Badge>
                    <span className="text-sm text-gray-600">{result.connection}</span>
                  </div>

                  {result.currentTime && (
                    <div>
                      <strong className="text-sm">Current Time:</strong>
                      <p className="text-sm text-gray-600">{result.currentTime}</p>
                    </div>
                  )}

                  {result.postgresVersion && (
                    <div>
                      <strong className="text-sm">PostgreSQL Version:</strong>
                      <p className="text-sm text-gray-600">{result.postgresVersion}</p>
                    </div>
                  )}

                  <div>
                    <strong className="text-sm">Deals Table Exists:</strong>
                    <Badge
                      variant="outline"
                      className={
                        result.dealsTableExists
                          ? "bg-green-50 text-green-700 border-green-200 ml-2"
                          : "bg-red-50 text-red-700 border-red-200 ml-2"
                      }
                    >
                      {result.dealsTableExists ? "Yes" : "No"}
                    </Badge>
                  </div>

                  {!result.dealsTableExists && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <strong className="text-sm text-yellow-800">Action Required</strong>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        The deals table doesn't exist. You need to run the create-deals-table.sql script.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Connection Failed
                    </Badge>
                  </div>

                  {result.error && (
                    <div>
                      <strong className="text-sm text-red-700">Error:</strong>
                      <p className="text-sm text-red-600">{result.error}</p>
                    </div>
                  )}

                  {result.details && (
                    <div>
                      <strong className="text-sm text-red-700">Details:</strong>
                      <p className="text-sm text-red-600 font-mono bg-red-50 p-2 rounded">{result.details}</p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <strong className="text-sm">Database URL:</strong>
                <p className="text-sm text-gray-600">{result.databaseUrl}</p>
              </div>

              {result.availableEnvVars && result.availableEnvVars.length > 0 && (
                <div>
                  <strong className="text-sm">Available Database Environment Variables:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.availableEnvVars.map((envVar) => (
                      <Badge key={envVar} variant="outline" className="text-xs">
                        {envVar}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Troubleshooting Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <strong>1. Check Environment Variables:</strong>
              <p className="text-gray-600">Make sure DATABASE_URL is set in your environment variables.</p>
            </div>
            <div>
              <strong>2. Verify Neon Connection String:</strong>
              <p className="text-gray-600">
                Should look like: postgresql://username:password@host/database?sslmode=require
              </p>
            </div>
            <div>
              <strong>3. Create Database Table:</strong>
              <p className="text-gray-600">Run the create-deals-table.sql script to create the required table.</p>
            </div>
            <div>
              <strong>4. Check Network Access:</strong>
              <p className="text-gray-600">
                Ensure your Neon database allows connections from your current environment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
