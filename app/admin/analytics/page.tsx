"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart3,
  Users,
  Eye,
  TrendingUp,
  Globe,
  Monitor,
  Smartphone,
  AlertTriangle,
  RefreshCw,
  Calendar,
  MousePointer,
  Clock,
  Loader2
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useToast } from "@/hooks/use-toast"

interface AnalyticsData {
  totalPageViews: number
  uniqueVisitors: number
  bounceRate: number
  avgSessionDuration: number
  topPages: Array<{ page: string; views: number }>
  topReferrers: Array<{ referrer: string; count: number }>
  deviceBreakdown: Array<{ device: string; count: number }>
  browserBreakdown?: Array<{ browser: string; count: number }>
  countryBreakdown?: Array<{ country: string; count: number }>
  dailyStats: Array<{
    date: string
    page_views: number
    unique_visitors: number
    bounce_rate: number
  }>
  recentEvents: Array<{
    event_name: string
    page_path: string
    created_at: string
    metadata: any
  }>
  totalSessions?: number
  averageTime?: number
  period?: {
    start: string
    end: string
    days: number
  }
}

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)
    loadAnalytics()
  }, [router, timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      // Try Umami API first, fallback to legacy API
      const response = await fetch(`/api/analytics/umami?days=${timeRange}`, {
        headers: {
          'x-admin-request': 'true'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        // Fallback to legacy analytics API
        const fallbackResponse = await fetch(`/api/analytics?days=${timeRange}`)
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json()
          setAnalytics(data)
        } else {
          const errorData = await response.json()
          toast({
            title: "Analytics Setup Required",
            description: "Please ensure Umami Analytics is properly configured",
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      console.error("Error loading analytics:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-[60]">
        <AdminSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-72 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Website Analytics</h1>
              <p className="mt-2 text-gray-600">Powered by Umami Analytics - Track visitor behavior and website performance</p>
            </div>
            <div className="flex gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last 24 hours</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={loadAnalytics} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {!analytics ? (
            <Alert className="mb-8 border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Analytics Setup Required</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Umami Analytics is being configured. Please ensure the UMAMI_API_KEY is set in your environment variables.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalPageViews.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.bounceRate.toFixed(1)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.floor(analytics.avgSessionDuration / 60)}m {Math.floor(analytics.avgSessionDuration % 60)}s
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Top Pages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Pages</CardTitle>
                    <CardDescription>Most visited pages on your website</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Page</TableHead>
                          <TableHead className="text-right">Views</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analytics.topPages.map((page, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{page.page}</TableCell>
                            <TableCell className="text-right">{page.views.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Top Referrers */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Referrers</CardTitle>
                    <CardDescription>Sources driving traffic to your site</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Source</TableHead>
                          <TableHead className="text-right">Visits</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analytics.topReferrers.map((referrer, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {referrer.referrer || "Direct"}
                            </TableCell>
                            <TableCell className="text-right">{referrer.count.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Device Breakdown */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                  <CardDescription>Visitor device types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analytics.deviceBreakdown.map((device, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {device.device === "desktop" && <Monitor className="h-5 w-5 text-gray-600" />}
                          {device.device === "mobile" && <Smartphone className="h-5 w-5 text-gray-600" />}
                          {device.device === "tablet" && <Monitor className="h-5 w-5 text-gray-600" />}
                          <span className="font-medium capitalize">{device.device}</span>
                        </div>
                        <Badge variant="secondary">{device.count.toLocaleString()}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Browser Breakdown */}
              {analytics.browserBreakdown && analytics.browserBreakdown.length > 0 && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Browser Distribution</CardTitle>
                    <CardDescription>Top browsers used by visitors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.browserBreakdown.map((browser, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="font-medium">{browser.browser}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ 
                                  width: `${(browser.count / analytics.totalPageViews * 100).toFixed(1)}%` 
                                }}
                              />
                            </div>
                            <Badge variant="secondary">{browser.count.toLocaleString()}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Country Breakdown */}
              {analytics.countryBreakdown && analytics.countryBreakdown.length > 0 && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                    <CardDescription>Top countries by visitor count</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Country</TableHead>
                          <TableHead className="text-right">Visitors</TableHead>
                          <TableHead className="text-right">Percentage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analytics.countryBreakdown.map((country, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-gray-400" />
                                {country.country}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{country.count.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline">
                                {((country.count / analytics.totalPageViews) * 100).toFixed(1)}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Recent Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                  <CardDescription>Latest user interactions and conversions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Page</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analytics.recentEvents.map((event, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{event.event_name}</TableCell>
                          <TableCell>{event.page_path}</TableCell>
                          <TableCell>
                            {new Date(event.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {event.metadata && (
                              <Badge variant="outline">
                                {JSON.stringify(event.metadata).substring(0, 50)}...
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}