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
  AlertCircle
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
    profileCompletion: 85
  })

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
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white/60 text-sm">Current Ranking</p>
                <p className="text-2xl font-bold flex items-center">
                  #12 <TrendingUp className="h-5 w-5 ml-2" />
                </p>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-right">
                <p className="text-white/60 text-sm">Speaker Score</p>
                <p className="text-2xl font-bold">98/100</p>
              </div>
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
                  <CardTitle className="text-lg font-semibold">Performance Overview</CardTitle>
                  <select className="text-sm border rounded-lg px-3 py-1">
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last year</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Performance chart will be displayed here</p>
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
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Basic Information</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Profile Photo</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Speaking Topics</span>
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600">Video Samples</span>
                    </div>
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-gray-300 mr-2" />
                      <span className="text-sm text-gray-600">Testimonials</span>
                    </div>
                  </div>
                  <Link href="/speakers/dashboard/profile">
                    <Button className="w-full">Complete Profile</Button>
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