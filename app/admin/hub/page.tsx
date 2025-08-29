"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminSidebar from "@/components/admin-sidebar"
import { 
  BarChart3, 
  FileText, 
  Receipt, 
  Users, 
  TrendingUp,
  DollarSign,
  Calendar,
  CheckSquare,
  Clock,
  Briefcase,
  FileSignature
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { InvoicesSection } from "@/components/admin/invoices-section"

export default function AdminHub() {
  const [masterTab, setMasterTab] = useState<"deals" | "projects">("deals")
  const [projectsSubTab, setProjectsSubTab] = useState("dashboard")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Stats for overview
  const [stats, setStats] = useState({
    totalDeals: 0,
    activeProjects: 0,
    pendingInvoices: 0,
    executedContracts: 0,
    pipelineValue: 0,
    invoicedAmount: 0
  })

  useEffect(() => {
    // Check authentication
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    if (!adminLoggedIn) {
      window.location.href = "/admin-login"
      return
    }
    setIsLoggedIn(true)
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      // Load stats from various endpoints
      const [dealsRes, projectsRes, invoicesRes, contractsRes] = await Promise.all([
        fetch("/api/deals").catch(() => ({ ok: false })),
        fetch("/api/projects").catch(() => ({ ok: false })),
        fetch("/api/invoices").catch(() => ({ ok: false })),
        fetch("/api/contracts").catch(() => ({ ok: false }))
      ])

      let totalDeals = 0, activeProjects = 0, pendingInvoices = 0, executedContracts = 0
      let pipelineValue = 0, invoicedAmount = 0

      if (dealsRes.ok) {
        const deals = await dealsRes.json()
        totalDeals = deals.filter((d: any) => !["won", "lost"].includes(d.status)).length
        pipelineValue = deals
          .filter((d: any) => !["won", "lost"].includes(d.status))
          .reduce((sum: number, d: any) => sum + (d.deal_value || 0), 0)
      }

      if (projectsRes.ok) {
        const projects = await projectsRes.json()
        activeProjects = projects.filter((p: any) => !["completed", "cancelled"].includes(p.status)).length
      }

      if (invoicesRes.ok) {
        const invoices = await invoicesRes.json()
        pendingInvoices = invoices.filter((i: any) => i.status !== "paid").length
        invoicedAmount = invoices
          .filter((i: any) => i.status !== "paid")
          .reduce((sum: number, i: any) => sum + (i.amount || 0), 0)
      }

      if (contractsRes.ok) {
        const contracts = await contractsRes.json()
        executedContracts = contracts.filter((c: any) => c.status === "fully_executed").length
      }

      setStats({
        totalDeals,
        activeProjects,
        pendingInvoices,
        executedContracts,
        pipelineValue,
        invoicedAmount
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-[60]">
        <AdminSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-72 min-h-screen">
        <div className="p-8">
          {/* Header with Stats */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-6">Operations Hub</h1>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Deals</p>
                      <p className="text-2xl font-bold">{stats.totalDeals}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pipeline</p>
                      <p className="text-2xl font-bold">${(stats.pipelineValue / 1000).toFixed(0)}k</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Projects</p>
                      <p className="text-2xl font-bold">{stats.activeProjects}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">{stats.pendingInvoices}</p>
                    </div>
                    <Receipt className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Outstanding</p>
                      <p className="text-2xl font-bold">${(stats.invoicedAmount / 1000).toFixed(0)}k</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Contracts</p>
                      <p className="text-2xl font-bold">{stats.executedContracts}</p>
                    </div>
                    <CheckSquare className="h-8 w-8 text-indigo-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Master Tabs */}
          <Tabs value={masterTab} onValueChange={(v) => setMasterTab(v as "deals" | "projects")}>
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="deals" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Deals & CRM
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Projects & Operations
              </TabsTrigger>
            </TabsList>

            {/* Deals Tab Content - Redirect to CRM */}
            <TabsContent value="deals">
              <Card>
                <CardHeader>
                  <CardTitle>Deals & CRM Management</CardTitle>
                  <CardDescription>
                    Manage your sales pipeline, deals, proposals, and contracts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      The CRM system includes:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Deals Pipeline - Track opportunities from lead to close</li>
                      <li>Proposals - Create and send speaker proposals</li>
                      <li>Contracts - Generate and manage speaker agreements</li>
                      <li>Past Deals - Archive of won and lost opportunities</li>
                    </ul>
                    <div className="pt-4">
                      <button
                        onClick={() => window.location.href = '/admin/crm'}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Open CRM Dashboard →
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab Content with Sub-tabs */}
            <TabsContent value="projects">
              <Tabs value={projectsSubTab} onValueChange={setProjectsSubTab}>
                <TabsList className="grid w-full max-w-xl grid-cols-3 mb-6">
                  <TabsTrigger value="dashboard" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Projects Dashboard
                  </TabsTrigger>
                  <TabsTrigger value="contracts" className="flex items-center gap-2">
                    <FileSignature className="h-4 w-4" />
                    Contracts
                  </TabsTrigger>
                  <TabsTrigger value="invoices" className="flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Invoices
                  </TabsTrigger>
                </TabsList>

                {/* Projects Dashboard Sub-tab */}
                <TabsContent value="dashboard">
                  <Card>
                    <CardHeader>
                      <CardTitle>Projects Dashboard</CardTitle>
                      <CardDescription>
                        Manage active speaker engagements and track project progress
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          The Projects system includes:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          <li>Project Stages - Track from invoicing to completion</li>
                          <li>Timeline View - See upcoming events at a glance</li>
                          <li>Task Management - Track deliverables and deadlines</li>
                          <li>Logistics Coordination - Manage travel and venue details</li>
                        </ul>
                        <div className="pt-4">
                          <button
                            onClick={() => window.location.href = '/admin/projects'}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Open Projects Dashboard →
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Contracts Sub-tab */}
                <TabsContent value="contracts">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contracts Management</CardTitle>
                      <CardDescription>
                        Create, edit, and track speaker engagement contracts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          The Contracts Hub includes:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          <li>Contract Creation - Generate from templates or custom</li>
                          <li>Digital Signatures - Send and track signature status</li>
                          <li>Contract Library - Access all past and present contracts</li>
                          <li>Template Management - Create reusable contract templates</li>
                        </ul>
                        <div className="pt-4">
                          <button
                            onClick={() => window.location.href = '/admin/contracts-hub'}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            Open Contracts Hub →
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Invoices Sub-tab */}
                <TabsContent value="invoices">
                  <InvoicesSection />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}