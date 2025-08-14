"use client"

import { useEffect, useState } from "react"
import { SpeakerDashboardLayout } from "@/components/speaker-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
    profileViews: 1234,
    viewsChange: 12.5,
    requests: 8,
    requestsChange: -5.2,
    completedEvents: 47,
    eventsChange: 8.3,
    rating: 4.9,
    ratingChange: 0.1,
    earnings: 125000,
    earningsChange: 15.7,
    profileCompletion: 0
  })
  const [profile, setProfile] = useState<any>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("30days")

  // Generate engagement metrics data based on selected period
  const getEngagementData = () => {
    const now = new Date()
    const data = []
    
    if (selectedPeriod === "30days") {
      // Last 30 days - daily data
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          views: Math.floor(30 + Math.random() * 50),
          requests: Math.floor(1 + Math.random() * 5),
          bookings: Math.floor(Math.random() * 3)
        })
      }
    } else if (selectedPeriod === "3months") {
      // Last 3 months - weekly data
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - (i * 7))
        data.push({
          date: `Week ${12 - i}`,
          views: Math.floor(200 + Math.random() * 150),
          requests: Math.floor(5 + Math.random() * 15),
          bookings: Math.floor(2 + Math.random() * 8)
        })
      }
    } else {
      // Last year - monthly data
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short' }),
          views: Math.floor(800 + Math.random() * 400),
          requests: Math.floor(20 + Math.random() * 30),
          bookings: Math.floor(10 + Math.random() * 20)
        })
      }
    }
    
    return data
  }

  const engagementData = getEngagementData()

  // Fetch profile and calculate completion
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("speakerToken")
        if (!token) return

        const response = await fetch("/api/speakers/profile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
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
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }

    fetchProfile()
  }, [])

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

  const recentActivity = [
    {
      id: 1,
      type: "view",
      message: "Your profile was viewed by Microsoft",
      time: "2 hours ago",
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: 2,
      type: "request",
      message: "New speaking request from Google",
      time: "5 hours ago",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: 3,
      type: "review",
      message: "New 5-star review from Tech Summit",
      time: "1 day ago",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      id: 4,
      type: "payment",
      message: "Payment received for AI Conference",
      time: "2 days ago",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ]

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <CardTitle className="text-sm font-medium text-gray-600">Rating</CardTitle>
                <Star className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.rating}</div>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < Math.floor(stats.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">({stats.completedEvents} reviews)</span>
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
                        const maxViews = Math.max(...engagementData.map(d => d.views))
                        const viewHeight = (item.views / maxViews) * 100
                        const requestHeight = (item.requests / maxViews) * 100 * 3 // Scale up for visibility
                        const bookingHeight = (item.bookings / maxViews) * 100 * 5 // Scale up for visibility
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center gap-0.5">
                            <div className="w-full flex items-end gap-0.5" style={{ height: '160px' }}>
                              <div 
                                className="flex-1 bg-blue-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                                style={{ height: `${viewHeight}%` }}
                                title={`Views: ${item.views}`}
                              />
                              <div 
                                className="flex-1 bg-green-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                                style={{ height: `${requestHeight}%` }}
                                title={`Requests: ${item.requests}`}
                              />
                              <div 
                                className="flex-1 bg-purple-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                                style={{ height: `${bookingHeight}%` }}
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
                        {engagementData.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Total Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {engagementData.reduce((sum, item) => sum + item.requests, 0)}
                      </p>
                      <p className="text-xs text-gray-600">Total Requests</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {engagementData.reduce((sum, item) => sum + item.bookings, 0)}
                      </p>
                      <p className="text-xs text-gray-600">Confirmed Bookings</p>
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
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
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
                  })}
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