"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VendorStatusManager } from "@/components/vendor-status-manager"
import { VendorBatchProcessor } from "@/components/vendor-batch-processor"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileSpreadsheet, ClipboardList, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function VendorManagementDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("review")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/directory")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Directory
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Vendor Management Dashboard
            </h1>
            <p className="text-gray-600">
              Efficiently manage vendor applications, reviews, and batch imports
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="review" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Review Queue
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Batch Import
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="review" className="space-y-4">
            <VendorStatusManager />
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <VendorBatchProcessor />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <VendorAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function VendorAnalytics() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Analytics Dashboard
        </h3>
        <p className="text-gray-500">
          Vendor analytics and insights will be available here soon
        </p>
      </div>
    </div>
  )
}