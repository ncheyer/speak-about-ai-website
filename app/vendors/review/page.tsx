"use client"

import { VendorStatusManager } from "@/components/vendor-status-manager"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function VendorReviewPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Vendor Review Queue
        </h1>
        <p className="text-gray-600">
          Efficiently manage and review vendor applications
        </p>
      </div>

      <VendorStatusManager />
    </div>
  )
}