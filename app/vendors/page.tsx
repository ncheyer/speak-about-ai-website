"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ClipboardList, FileSpreadsheet, BarChart3, 
  Building2, ArrowRight, Users, TrendingUp 
} from "lucide-react"

export default function VendorPortalPage() {
  const router = useRouter()

  const features = [
    {
      title: "Review Queue",
      description: "Efficiently review and approve pending vendor applications",
      icon: ClipboardList,
      href: "/vendors/review",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Batch Import",
      description: "Import multiple vendors at once using CSV files",
      icon: FileSpreadsheet,
      href: "/vendors/manage",
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Management Dashboard",
      description: "Complete vendor management suite with all tools",
      icon: BarChart3,
      href: "/vendors/manage",
      color: "bg-purple-50 text-purple-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-600 rounded-full">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Vendor Management Portal
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline your vendor operations with our comprehensive management tools
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => (
              <Card 
                key={feature.title}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(feature.href)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="flex justify-center mb-2">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-900">500+</p>
                  <p className="text-sm text-blue-700">Total Vendors</p>
                </div>
                <div>
                  <div className="flex justify-center mb-2">
                    <ClipboardList className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-900">24</p>
                  <p className="text-sm text-blue-700">Pending Review</p>
                </div>
                <div>
                  <div className="flex justify-center mb-2">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-900">89%</p>
                  <p className="text-sm text-blue-700">Approval Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.push("/directory")}
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Directory
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}