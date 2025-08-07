"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mic, Mail, ArrowRight, ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"

export default function SpeakerPortalLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("speakerToken")
    if (token) {
      router.push("/speakers/dashboard")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/speakers/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store auth token using new system
        localStorage.setItem("speakerToken", data.token)
        localStorage.setItem("speakerEmail", data.email)
        localStorage.setItem("speakerId", data.speakerId)
        localStorage.setItem("speakerName", data.speakerName)
        
        // Also keep old storage for backward compatibility
        localStorage.setItem("speakerLoggedIn", "true")
        localStorage.setItem("speakerSessionToken", data.token)
        
        router.push("/speakers/dashboard")
      } else {
        setError(data.error || "Invalid email or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Connection error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/portal">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portal Home
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <Mic className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Speaker Portal</h1>
          <p className="text-gray-600">Manage your speaker profile and bookings</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle>Speaker Login</CardTitle>
            <CardDescription>
              Sign in to access your speaker profile and event information
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="speaker@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 pl-10"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-purple-600 hover:bg-purple-700" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            {/* Registration Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-3">Don't have a speaker account?</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/apply")}
                >
                  Apply to Speak
                </Button>
              </div>
            </div>

            {/* Forgot Password - TODO: Implement password reset */}
            {/* <div className="mt-4 text-center">
              <Link href="/speakers/forgot-password">
                <Button
                  variant="link"
                  className="text-sm text-gray-600 hover:text-purple-600"
                >
                  Forgot your password?
                </Button>
              </Link>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}