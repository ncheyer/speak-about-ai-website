"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Users,
  DollarSign,
  CheckSquare,
  FileText,
  Upload,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Activity,
  Menu,
  X,
  Heart,
  Mail,
  TrendingUp,
  FileSignature,
  Send,
  MessageSquare
} from "lucide-react"

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("adminLoggedIn")
      localStorage.removeItem("adminSessionToken")
      localStorage.removeItem("adminUser")
      router.push("/admin")
    }
  }

  const navigationItems = [
    {
      title: "Master Panel",
      href: "/admin/manage",
      icon: Settings,
      description: "Operations Hub",
      color: "text-slate-600",
      bgColor: "bg-slate-50"
    },
    {
      title: "CRM",
      href: "/admin/crm",
      icon: BarChart3,
      description: "Deals & Proposals",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Contracts Hub",
      href: "/admin/contracts-hub",
      icon: FileSignature,
      description: "Contract Management",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Project Management",
      href: "/admin/projects",
      icon: CheckSquare,
      description: "Live Projects",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Invoicing",
      href: "/admin/invoicing",
      icon: DollarSign,
      description: "Invoice Management",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Speaker Management",
      href: "/admin/speakers",
      icon: Users,
      description: "Profiles & Content",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: TrendingUp,
      description: "Website Insights",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Activity Log",
      href: "/admin/activity",
      icon: Activity,
      description: "Speaker Updates",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Newsletter",
      href: "/admin/newsletter",
      icon: Mail,
      description: "Subscriber Management",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      title: "Landing Resources",
      href: "/admin/landing-resources",
      icon: Send,
      description: "Email Resources",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50"
    },
    {
      title: "Client Portal",
      href: "/admin/clients",
      icon: Users,
      description: "Client Access",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ]

  return (
    <div className={cn(
      "flex flex-col h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-72",
      className
    )}>
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10" />
        <div className="relative flex items-center justify-between p-6 border-b border-slate-700/50">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Speak About AI</h2>
                <p className="text-sm text-slate-400 font-medium">Admin Dashboard</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-slate-400 hover:text-white hover:bg-slate-700/50 border-slate-600 transition-all duration-200"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === "/admin/dashboard" && pathname.startsWith("/admin/dashboard")) ||
            (item.href === "/admin/contracts-hub" && pathname.startsWith("/admin/contracts-hub")) ||
            (item.href === "/admin/invoicing" && pathname.startsWith("/admin/invoicing"))
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "group relative overflow-hidden rounded-xl transition-all duration-200 ease-in-out",
                  collapsed ? "p-3" : "p-4",
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform scale-105" 
                    : "hover:bg-slate-700/50 hover:transform hover:scale-102"
                )}
              >
                {/* Background gradient for active state */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl" />
                )}
                
                <div className="relative flex items-center">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-white/20 text-white shadow-md" 
                      : `${item.bgColor} ${item.color} group-hover:scale-110`
                  )}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  
                  {!collapsed && (
                    <div className="ml-4 flex-1 min-w-0">
                      <div className={cn(
                        "text-sm font-semibold transition-colors duration-200",
                        isActive ? "text-white" : "text-slate-200 group-hover:text-white"
                      )}>
                        {item.title}
                      </div>
                      <div className={cn(
                        "text-xs mt-0.5 transition-colors duration-200",
                        isActive ? "text-blue-100" : "text-slate-400 group-hover:text-slate-300"
                      )}>
                        {item.description}
                      </div>
                    </div>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && !collapsed && (
                    <div className="w-2 h-2 bg-white rounded-full shadow-lg animate-pulse" />
                  )}
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "group w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all duration-200 rounded-lg",
            collapsed ? "px-3" : "px-4 py-3"
          )}
          title={collapsed ? "Logout" : ""}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-all duration-200">
            <LogOut className="h-4 w-4" />
          </div>
          {!collapsed && (
            <span className="ml-3 font-medium">Logout</span>
          )}
        </Button>
      </div>
    </div>
  )
}