"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Mic, Users, ArrowRight, Building2, Award, FileText, BarChart } from "lucide-react"

export default function PortalHome() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to the Event Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select your role to access your personalized dashboard
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Client Card */}
          <Card className="relative overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group" 
                onClick={() => router.push("/portal/client")}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 rounded-full -ml-12 -mb-12 group-hover:scale-110 transition-transform" />
            
            <CardHeader className="relative z-10">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">I'm an Event Organizer</CardTitle>
              <CardDescription className="text-base">
                Access your booked speakers and event details
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Event Management</p>
                    <p className="text-sm text-gray-600">View all your upcoming speaking events</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Speaker Information</p>
                    <p className="text-sm text-gray-600">Access speaker bios, headshots, and requirements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Event Logistics</p>
                    <p className="text-sm text-gray-600">Track contracts, invoices, and event status</p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:translate-x-1 transition-transform">
                Access Client Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Speaker Card */}
          <Card className="relative overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => router.push("/portal/speaker")}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-50 rounded-full -ml-12 -mb-12 group-hover:scale-110 transition-transform" />
            
            <CardHeader className="relative z-10">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">I'm a Speaker</CardTitle>
              <CardDescription className="text-base">
                Manage your profile and speaking engagements
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Profile Management</p>
                    <p className="text-sm text-gray-600">Update your bio, headshot, and topics</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Booking Calendar</p>
                    <p className="text-sm text-gray-600">View your upcoming speaking events</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Event Requirements</p>
                    <p className="text-sm text-gray-600">Manage your travel and technical needs</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 group-hover:translate-x-1 transition-transform">
                  Access Speaker Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                  onClick={() => router.push("/portal/speaker-register")}
                >
                  New Speaker? Register Here
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-600">
          <p>Need help? Contact your event coordinator or account manager</p>
        </div>
      </div>
    </div>
  )
}