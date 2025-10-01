"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Mail, User, Building, Phone, ArrowRight, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast, useToast } from "@/components/ui/use-toast"

export default function VendorDirectoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSignup, setIsSignup] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    company: "",
    phone: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/vendors/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          action: isSignup ? "signup" : "login"
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Store subscriber info in session
        sessionStorage.setItem("directorySubscriber", JSON.stringify(data.subscriber))
        
        toast({
          title: "Success!",
          description: isSignup ? "Welcome to the Vendor Directory!" : "Welcome back!",
        })

        // Redirect to vendor listings
        router.push("/vendor-directory/vendors")
      } else {
        toast({
          title: "Error",
          description: data.error || "Something went wrong",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to process your request",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Free Event Vendor Directory",
            "description": "Browse verified event vendors for catering, photography, venues, entertainment and more. Free access with transparent pricing.",
            "url": "https://speakabout.ai/vendor-directory",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://speakabout.ai"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Event Vendor Directory",
                  "item": "https://speakabout.ai/vendor-directory"
                }
              ]
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": "Event Vendor Categories",
              "description": "Browse vendors by category",
              "itemListElement": [
                { "@type": "Thing", "name": "Catering Services" },
                { "@type": "Thing", "name": "Photography & Videography" },
                { "@type": "Thing", "name": "Event Venues" },
                { "@type": "Thing", "name": "Entertainment & Music" },
                { "@type": "Thing", "name": "Event Planning" },
                { "@type": "Thing", "name": "Audio Visual Equipment" },
                { "@type": "Thing", "name": "Decor & Design" },
                { "@type": "Thing", "name": "Transportation" }
              ]
            }
          })
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-600 rounded-full">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Event Vendor Directory
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Connect with trusted vendors for your next event. 
              Find the perfect partners from our curated network of event professionals - completely free.
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Whether you're planning a wedding, corporate event, or private party, our event vendor directory 
              connects you with verified caterers, photographers, venues, and entertainment providers.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Features Section */}
            <div className="space-y-6">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    For Vendors
                  </h3>
                  <p className="text-blue-800 text-sm mb-4">
                    Want to list your business in our directory?
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    onClick={() => router.push("/admin")}
                  >
                    Apply to Join <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Signup/Login Form */}
            <Card className="shadow-xl border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {isSignup ? "Get Instant Access" : "Welcome Back"}
                </CardTitle>
                <CardDescription>
                  {isSignup 
                    ? "Sign up to browse our vendor directory" 
                    : "Log in to access the vendor directory"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {isSignup && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="John Smith"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="pl-10"
                            required={isSignup}
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="company"
                            type="text"
                            placeholder="Acme Events Inc."
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="pl-10"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="pl-10"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : (isSignup ? "Get Access" : "Log In")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    {isSignup ? "Already have access?" : "New to the directory?"}
                  </p>
                  <Button
                    variant="link"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => setIsSignup(!isSignup)}
                  >
                    {isSignup ? "Log in instead" : "Sign up for access"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SEO Content Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
              Your Complete Event Vendor Directory Solution
            </h2>
            
            <div className="prose prose-lg text-gray-600 mb-12">
              <p className="mb-4">
                Finding the right vendors for your event shouldn't be complicated. Our comprehensive event vendor directory 
                simplifies the process by connecting you directly with verified professionals who match your vision and budget. 
                From intimate gatherings to large-scale corporate events, we've curated a network of trusted vendors ready to 
                bring your ideas to life.
              </p>
              
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Wedding Planning Made Simple
              </h3>
              <p className="mb-4">
                Wedding planning can feel overwhelming, but with our event vendor directory at your fingertips, you'll find 
                everything you need in one place. Browse through photographers who capture every precious moment, caterers 
                who create unforgettable dining experiences, and venues that provide the perfect backdrop for your special day. 
                Each vendor in our directory has been verified to ensure quality and reliability.
              </p>
              
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Corporate Events & Beyond
              </h3>
              <p className="mb-4">
                Whether you're organizing a product launch, conference, or team building event, our event vendor directory 
                features specialists in corporate entertainment, audio-visual equipment, and professional event coordination. 
                Get transparent pricing, read real reviews, and connect directly with vendors who understand your business needs.
              </p>
              
              <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Why Choose Our Event Vendor Directory?
              </h3>
              <p className="mb-4">
                Unlike other platforms, we believe in complete transparency. No hidden fees, no premium listings that push 
                quality vendors to the bottom. Every vendor in our event vendor directory gets equal visibility, ensuring 
                you find the best match for your event based on merit, not marketing budgets. Plus, it's completely free 
                for event planners to browse and connect with vendors.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg mt-8">
                <h4 className="text-xl font-semibold text-blue-900 mb-3">
                  Start Planning Your Perfect Event Today
                </h4>
                <p className="text-blue-800">
                  Join thousands of event planners who trust our event vendor directory to connect them with the right 
                  professionals. From wedding planning to corporate gatherings, birthday parties to fundraising galas, 
                  we have the vendors you need to create memorable experiences.
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            <div>
              <p className="text-3xl font-bold text-blue-600">87+</p>
              <p className="text-gray-600">Verified Vendors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">10+</p>
              <p className="text-gray-600">Event Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">100%</p>
              <p className="text-gray-600">Free Access</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">24/7</p>
              <p className="text-gray-600">Available Online</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}