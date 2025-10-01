"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

function VendorLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState("")

  // Check for login token in URL
  useEffect(() => {
    const token = searchParams.get("token")
    const emailParam = searchParams.get("email")
    
    if (token && emailParam) {
      verifyLoginToken(token, emailParam)
    }
  }, [searchParams])

  const verifyLoginToken = async (token: string, email: string) => {
    setVerifying(true)
    setError("")

    try {
      const response = await fetch("/api/vendors/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_login",
          token,
          email
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store vendor session
        localStorage.setItem("vendorToken", data.token)
        localStorage.setItem("vendorInfo", JSON.stringify(data.vendor))
        
        toast({
          title: "Login successful!",
          description: "Welcome to your vendor portal"
        })

        // Redirect to vendor dashboard
        router.push("/vendors/dashboard")
      } else {
        setError(data.error || "Invalid or expired login link")
        toast({
          title: "Login failed",
          description: data.error || "Please request a new login link",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Login verification error:", error)
      setError("Failed to verify login. Please try again.")
    } finally {
      setVerifying(false)
    }
  }

  const handleRequestLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/vendors/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_login",
          email
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setEmailSent(true)
        toast({
          title: "Login link sent!",
          description: "Check your email for the secure login link"
        })
      } else {
        setError(data.error || "Failed to send login link")
        toast({
          title: "Error",
          description: data.error || "Failed to send login link",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Login request error:", error)
      setError("Failed to send login link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-lg font-medium">Verifying your login...</p>
              <p className="text-sm text-gray-500">Please wait a moment</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Vendor Portal</h1>
          <p className="text-gray-600 mt-2">Secure login for approved vendors</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              We'll send a secure login link to your registered email
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              <form onSubmit={handleRequestLogin} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="vendor@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Use the email address registered with your vendor account
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Login Link
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">Check your email!</h3>
                  <p className="text-gray-600 mt-2">
                    We've sent a secure login link to:
                  </p>
                  <p className="font-medium text-gray-900 mt-1">{email}</p>
                </div>

                <Alert className="text-left">
                  <AlertDescription>
                    The login link will expire in 30 minutes for security. 
                    Check your spam folder if you don't see the email.
                  </AlertDescription>
                </Alert>

                <Button
                  variant="outline"
                  onClick={() => {
                    setEmailSent(false)
                    setEmail("")
                  }}
                  className="w-full"
                >
                  Request Another Link
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>Not a vendor yet?</p>
          <Button
            variant="link"
            onClick={() => router.push("/directory")}
            className="text-blue-600"
          >
            Apply to join our vendor network
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function VendorLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-lg font-medium">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <VendorLoginContent />
    </Suspense>
  )
}