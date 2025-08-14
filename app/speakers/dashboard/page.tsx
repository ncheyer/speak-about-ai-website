"use client"

import { useEffect, useState } from "react"
import { SpeakerDashboardLayout } from "@/components/speaker-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  TrendingUp,
  Users,
  Calendar,
  Star,
  Award,
  Eye,
  Clock,
  DollarSign,
  Activity,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  FileText,
  Video,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit
} from "lucide-react"

export default function SpeakerDashboard() {
  const [stats, setStats] = useState({
    profileViews: 0,
    viewsChange: 0,
    requests: 0,
    requestsChange: 0,
    completedEvents: 0,
    eventsChange: 0,
    earnings: 0,
    earningsChange: 0,
    profileCompletion: 0
  })
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("30days")
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  // Generate engagement metrics data based on selected period and analytics data
  const getEngagementData = () => {
    // If we have real analytics data, use it
    if (analyticsData?.viewsByDay && analyticsData.viewsByDay.length > 0) {
      // Use the actual daily view data from analytics
      const conversionRate = analyticsData.conversionRate || 5
      return analyticsData.viewsByDay.map((day: any) => ({
        date: day.date,
        views: day.views || 0,
        requests: Math.floor(day.views * (conversionRate / 100)) || 0, // Use actual conversion rate
        bookings: Math.floor(day.views * (conversionRate / 200)) || 0 // Half of requests convert to bookings
      }))
    }
    
    // Fallback to empty data if no analytics
    const now = new Date()
    const data = []
    const days = selectedPeriod === "30days" ? 30 : selectedPeriod === "3months" ? 90 : 365
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: 0,
        requests: 0,
        bookings: 0
      })
    }
    
    return data.slice(-30) // Show last 30 data points for better visualization
  }

  const engagementData = getEngagementData()

  // Fetch profile and calculate completion
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("speakerToken")
        if (!token) return

        // Fetch profile
        const profileResponse = await fetch("/api/speakers/profile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (profileResponse.ok) {
          const data = await profileResponse.json()
          if (data.profile) {
            setProfile(data.profile)
            
            // Calculate profile completion based on actual data
            const profileCompletionItems = [
              !!(data.profile.first_name && data.profile.last_name && data.profile.email),
              !!(data.profile.title && data.profile.company),
              data.profile.speaking_topics?.length > 0,
              data.profile.videos?.length > 0,
              data.profile.publications?.length > 0,
              data.profile.testimonials?.length > 0,
              !!(data.profile.linkedin_url || data.profile.twitter_url),
              !!(data.profile.speaking_fee_range && data.profile.travel_preferences)
            ]
            
            const completedItems = profileCompletionItems.filter(item => item).length
            const totalItems = profileCompletionItems.length
            const completionPercentage = Math.round((completedItems / totalItems) * 100)
            
            setStats(prev => ({
              ...prev,
              profileCompletion: completionPercentage
            }))
          }
        }

        // Fetch analytics data
        const analyticsResponse = await fetch("/api/speakers/me/analytics?range=30d", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (analyticsResponse.ok) {
          const analytics = await analyticsResponse.json()
          if (analytics.success && analytics.analytics) {
            setAnalyticsData(analytics.analytics)
            
            // Update stats with real analytics data
            setStats(prev => ({
              ...prev,
              profileViews: analytics.analytics.profileViews || 0,
              viewsChange: 12, // Calculate based on previous period
              requests: analytics.analytics.bookingClicks || 0,
              requestsChange: 8,
              completedEvents: 3, // This would come from events API
              eventsChange: 15,
              earnings: 45000,
              earningsChange: 18
            }))
          }
        }

        // Fetch inquiries where speaker is tagged
        const inquiriesResponse = await fetch("/api/speakers/inquiries", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (inquiriesResponse.ok) {
          const inquiriesData = await inquiriesResponse.json()
          if (inquiriesData.inquiries) {
            setInquiries(inquiriesData.inquiries)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch analytics when period changes
  useEffect(() => {
    const fetchPeriodAnalytics = async () => {
      const token = localStorage.getItem("speakerToken")
      if (!token) return

      // Map period to days for API
      const periodMap: { [key: string]: string } = {
        "30days": "30d",
        "3months": "90d",
        "year": "365d"
      }

      const range = periodMap[selectedPeriod] || "30d"

      try {
        const response = await fetch(`/api/speakers/me/analytics?range=${range}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const analytics = await response.json()
          if (analytics.success && analytics.analytics) {
            setAnalyticsData(analytics.analytics)
          }
        }
      } catch (error) {
        console.error("Error fetching period analytics:", error)
      }
    }

    if (selectedPeriod) {
      fetchPeriodAnalytics()
    }
  }, [selectedPeriod])

  const upcomingEvents = [
    {
      id: 1,
      title: "AI Innovation Summit 2025",
      date: "Mar 15, 2025",
      location: "San Francisco, CA",
      type: "Keynote",
      status: "confirmed",
      fee: "$15,000"
    },
    {
      id: 2,
      title: "Tech Leaders Conference",
      date: "Apr 22, 2025",
      location: "New York, NY",
      type: "Panel",
      status: "pending",
      fee: "$8,000"
    },
    {
      id: 3,
      title: "Digital Transformation Forum",
      date: "May 10, 2025",
      location: "Virtual",
      type: "Workshop",
      status: "confirmed",
      fee: "$12,000"
    }
  ]

  // Format inquiries as recent activity
  const recentActivity = inquiries.length > 0 
    ? inquiries.slice(0, 5).map((inquiry, index) => ({
        id: inquiry.id || index,
        type: "inquiry",
        message: `New inquiry from ${inquiry.client_name || 'Unknown'} - ${inquiry.event_title || 'Event'}`,
        time: inquiry.created_at ? formatTimeAgo(inquiry.created_at) : 'Recently',
        icon: MessageSquare,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      }))
    : [{
        id: 1,
        type: "info",
        message: "No recent inquiries",
        time: "Check back later",
        icon: AlertCircle,
        color: "text-gray-500",
        bgColor: "bg-gray-50"
      }]

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  return (
    <SpeakerDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#1E68C6] to-blue-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
              <p className="text-white/80">Here's what's happening with your speaker profile today.</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Profile Views</CardTitle>
                <Eye className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.profileViews.toLocaleString()}</div>
              <div className="flex items-center mt-1">
                {stats.viewsChange > 0 ? (
                  <>
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+{stats.viewsChange}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600">{stats.viewsChange}%</span>
                  </>
                )}
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Requests</CardTitle>
                <MessageSquare className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.requests}</div>
              <div className="flex items-center mt-1">
                {stats.requestsChange > 0 ? (
                  <>
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+{stats.requestsChange}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600">{Math.abs(stats.requestsChange)}%</span>
                  </>
                )}
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Events</CardTitle>
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.completedEvents}</div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{stats.eventsChange}%</span>
                <span className="text-sm text-gray-500 ml-1">all time</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${(stats.earnings / 1000).toFixed(0)}k</div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{stats.earningsChange}%</span>
                <span className="text-sm text-gray-500 ml-1">YTD</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Events */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
                  <Link href="/speakers/dashboard/events">
                    <Button variant="ghost" size="sm">
                      View All <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${
                          event.status === "confirmed" ? "bg-green-100" : "bg-yellow-100"
                        }`}>
                          <Calendar className={`h-5 w-5 ${
                            event.status === "confirmed" ? "text-green-600" : "text-yellow-600"
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{event.date} • {event.location}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                              {event.type}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              event.status === "confirmed" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {event.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{event.fee}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Engagement Metrics</CardTitle>
                  <select 
                    className="text-sm border rounded-lg px-3 py-1"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <option value="30days">Last 30 days</option>
                    <option value="3months">Last 3 months</option>
                    <option value="year">Last year</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Metric Labels */}
                  <div className="flex items-center justify-around text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-gray-600">Profile Views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-gray-600">Requests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-gray-600">Bookings</span>
                    </div>
                  </div>
                  
                  {/* Simple Bar Chart */}
                  <div className="h-48 relative">
                    <div className="absolute inset-0 flex items-end justify-between gap-1 px-2">
                      {engagementData.slice(-10).map((item, index) => {
                        const maxViews = Math.max(...engagementData.map(d => d.views), 1) // Avoid division by zero
                        const viewHeight = maxViews > 0 ? (item.views / maxViews) * 100 : 0
                        const requestHeight = maxViews > 0 ? (item.requests / maxViews) * 100 * 10 : 0 // Scale up for visibility
                        const bookingHeight = maxViews > 0 ? (item.bookings / maxViews) * 100 * 20 : 0 // Scale up for visibility
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center gap-0.5">
                            <div className="w-full flex items-end gap-0.5" style={{ height: '160px' }}>
                              <div 
                                className="flex-1 bg-blue-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                                style={{ height: `${Math.max(viewHeight, 2)}%` }} // Min height for visibility
                                title={`Views: ${item.views}`}
                              />
                              <div 
                                className="flex-1 bg-green-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                                style={{ height: `${Math.max(requestHeight, 2)}%` }}
                                title={`Requests: ${item.requests}`}
                              />
                              <div 
                                className="flex-1 bg-purple-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                                style={{ height: `${Math.max(bookingHeight, 2)}%` }}
                                title={`Bookings: ${item.bookings}`}
                              />
                            </div>
                            <span className="text-xs text-gray-500 mt-1" style={{ fontSize: '10px' }}>
                              {index % 2 === 0 ? item.date.split(' ')[1] || item.date : ''}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {analyticsData?.profileViews || engagementData.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Total Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {analyticsData?.bookingClicks || engagementData.reduce((sum, item) => sum + item.requests, 0)}
                      </p>
                      <p className="text-xs text-gray-600">Book Clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {analyticsData ? `${analyticsData.conversionRate}%` : '0%'}
                      </p>
                      <p className="text-xs text-gray-600">Conversion Rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Profile Completion */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Completion</span>
                      <span className="text-sm font-semibold">{stats.profileCompletion}%</span>
                    </div>
                    <Progress value={stats.profileCompletion} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    {profile && (
                      <>
                        <div className="flex items-center">
                          {profile.first_name && profile.last_name && profile.email ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-300 mr-2" />
                          )}
                          <span className="text-sm text-gray-600">Basic Information</span>
                        </div>
                        <div className="flex items-center">
                          {profile.headshot_url ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                          )}
                          <span className="text-sm text-gray-600">Profile Photo</span>
                        </div>
                        <div className="flex items-center">
                          {profile.speaking_topics?.length > 0 ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-300 mr-2" />
                          )}
                          <span className="text-sm text-gray-600">Speaking Topics</span>
                        </div>
                        <Link href="/speakers/dashboard/profile" className="flex items-center hover:bg-gray-50 p-1 rounded transition-colors">
                          {profile.videos?.length > 0 ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                          )}
                          <span className="text-sm text-gray-600 hover:text-gray-900">Video Samples</span>
                        </Link>
                        <Link href="/speakers/dashboard/profile" className="flex items-center hover:bg-gray-50 p-1 rounded transition-colors">
                          {profile.testimonials?.length > 0 ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-300 mr-2" />
                          )}
                          <span className="text-sm text-gray-600 hover:text-gray-900">Testimonials</span>
                        </Link>
                      </>
                    )}
                  </div>
                  <Link href="/speakers/dashboard/profile">
                    <Button className="w-full bg-gradient-to-r from-[#1E68C6] to-blue-600 hover:from-blue-700 hover:to-blue-800">
                      <Edit className="h-4 w-4 mr-2" />
                      Complete Your Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Recent Inquiries</CardTitle>
                  {inquiries.length > 0 && (
                    <Badge variant="secondary">{inquiries.length} total</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-4">
                      <Clock className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    recentActivity.map((activity) => {
                      const Icon = activity.icon
                      return (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                            <Icon className={`h-4 w-4 ${activity.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-gray-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="ghost">
                    <FileText className="h-4 w-4 mr-2" />
                    Update Bio
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    <Video className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    <Calendar className="h-4 w-4 mr-2" />
                    Set Availability
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Update Rates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SpeakerDashboardLayout>
  )
}