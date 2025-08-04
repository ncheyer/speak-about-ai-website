"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  LogOut,
  BarChart3,
  Users,
  CheckSquare,
  Database,
  AlertTriangle,
  FileText
} from "lucide-react"
import Link from "next/link"
import { ContractsManagement } from "@/components/contracts-management"

export default function AdminContractsPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check authentication
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
    setLoading(false)
  }, [router])

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear all authentication data
      localStorage.removeItem("adminLoggedIn")
      localStorage.removeItem("adminSessionToken")
      localStorage.removeItem("adminUser")
      router.push("/admin")
    }
  }

  if (!isLoggedIn || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              Contract Management
            </h1>
            <p className="mt-2 text-gray-600">Create, manage, and track digital contracts and signatures</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                CRM Dashboard
              </Button>
            </Link>
            <Link href="/admin/manage">
              <Button variant="outline">
                <Database className="mr-2 h-4 w-4" />
                Master Admin Panel
              </Button>
            </Link>
            <Link href="/admin/speakers">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Speaker Management
              </Button>
            </Link>
            <Link href="/admin/projects">
              <Button variant="outline">
                <CheckSquare className="mr-2 h-4 w-4" />
                Project Management
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Info Alert */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <FileText className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Contract Management System</AlertTitle>
          <AlertDescription className="text-blue-700">
            <div className="mt-2 space-y-1">
              <p>• Create contracts automatically from won deals</p>
              <p>• Generate secure signing links for clients and speakers</p>
              <p>• Track signature status and completion</p>
              <p>• Digital signature collection with audit trail</p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <ContractsManagement />
      </div>
    </div>
  )
}