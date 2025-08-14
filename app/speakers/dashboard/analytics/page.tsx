"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Eye,
  MousePointer,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Loader2
} from "lucide-react"
import Link from "next/link"

interface AnalyticsData {
  profileViews: number
  bookingClicks: number
  conversionRate: number
  viewsByDay: Array<{ date: string; views: number }>
  topReferrers: Array<{ source: string; count: number }>
  viewsByLocation: Array<{ location: string; count: number }>
  engagementMetrics: {
    avgTimeOnProfile: string
    bounceRate: number
    repeatVisitors: number
  }
}

export default function SpeakerAnalyticsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    profileViews: 247,
    bookingClicks: 18,
    conversionRate: 7.3,
    viewsByDay: [],
    topReferrers: [
      { source: "Google Search", count: 89 },
      { source: "LinkedIn", count: 67 },
      { source: "Direct", count: 45 },
      { source: "Twitter", count: 23 },
      { source: "Email Campaign", count: 23 }
    ],
    viewsByLocation: [
      { location: "United States", count: 145 },
      { location: "United Kingdom", count: 42 },
      { location: "Canada", count: 28 },
      { location: "Australia", count: 18 },
      { location: "Germany", count: 14 }
    ],
    engagementMetrics: {
      avgTimeOnProfile: "2:34",
      bounceRate: 42.5,
      repeatVisitors: 31
    }
  })

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("speakerToken")
    if (!token) {
      router.push("/portal/speaker")
      return
    }

    // Generate mock data for the chart
    generateChartData()
    setLoading(false)
  }, [timeRange, router])

  const generateChartData = () => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const data = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: 5 + Math.floor((i * 3) % 15) // Deterministic based on index
      })
    }
    
    setAnalyticsData(prev => ({
      ...prev,
      viewsByDay: data
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/speakers/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Profile Analytics
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track your speaker profile performance and engagement
              </p>
            </div>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Eye className="h-4 w-4 mr-2 text-blue-600" />
                Profile Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.profileViews}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+12%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <MousePointer className="h-4 w-4 mr-2 text-green-600" />
                Booking Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.bookingClicks}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From "Book Speaker" button
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Views to booking clicks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Activity className="h-4 w-4 mr-2 text-orange-600" />
                Avg. Time on Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.engagementMetrics.avgTimeOnProfile}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Average session duration
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Views Over Time</CardTitle>
                <CardDescription>
                  Daily views of your speaker profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end space-x-2">
                  {analyticsData.viewsByDay.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-600 rounded-t hover:bg-blue-700 transition-colors"
                        style={{ 
                          height: `${(day.views / 20) * 100}%`,
                          minHeight: '4px'
                        }}
                        title={`${day.views} views`}
                      />
                      {index % Math.ceil(analyticsData.viewsByDay.length / 10) === 0 && (
                        <span className="text-xs text-gray-500 mt-2 rotate-45 origin-top-left">
                          {day.date}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bounce Rate</span>
                    <Badge variant={analyticsData.engagementMetrics.bounceRate < 50 ? "default" : "secondary"}>
                      {analyticsData.engagementMetrics.bounceRate}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Repeat Visitors</span>
                    <Badge variant="default">
                      {analyticsData.engagementMetrics.repeatVisitors}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Profile Completion Views</span>
                    <Badge variant="default">68%</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Sections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Videos</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                      <span className="text-xs text-gray-500">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Testimonials</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }} />
                      </div>
                      <span className="text-xs text-gray-500">72%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Speaking Topics</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }} />
                      </div>
                      <span className="text-xs text-gray-500">68%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Traffic Sources</CardTitle>
                <CardDescription>
                  Where your profile visitors are coming from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topReferrers.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          index === 0 ? 'bg-blue-600' : 
                          index === 1 ? 'bg-green-600' : 
                          index === 2 ? 'bg-purple-600' : 
                          index === 3 ? 'bg-orange-600' : 'bg-gray-400'
                        }`} />
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(source.count / analyticsData.topReferrers[0].count) * 100}%` }} 
                          />
                        </div>
                        <span className="text-sm font-semibold w-12 text-right">{source.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geography" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Views by Location</CardTitle>
                <CardDescription>
                  Geographic distribution of your profile visitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.viewsByLocation.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{location.location}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(location.count / analyticsData.viewsByLocation[0].count) * 100}%` }} 
                          />
                        </div>
                        <span className="text-sm font-semibold w-12 text-right">{location.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visitor Behavior</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">New vs Returning</span>
                      <span className="text-sm font-medium">69% / 31%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 flex overflow-hidden">
                      <div className="bg-blue-600" style={{ width: '69%' }} />
                      <div className="bg-green-600" style={{ width: '31%' }} />
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mobile vs Desktop</span>
                      <span className="text-sm font-medium">42% / 58%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 flex overflow-hidden">
                      <div className="bg-purple-600" style={{ width: '42%' }} />
                      <div className="bg-orange-600" style={{ width: '58%' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Peak Activity Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tuesday, 2-4 PM</span>
                      <Badge variant="default">High</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Wednesday, 10-12 AM</span>
                      <Badge variant="default">High</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Thursday, 3-5 PM</span>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monday, 9-11 AM</span>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}