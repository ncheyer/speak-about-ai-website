"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Mail,
  ExternalLink,
  Download,
  RefreshCw,
  Activity,
  Eye
} from "lucide-react"

interface PageStats {
  page_url: string
  page_title: string
  total_signups: number
  recent_signups: number
  last_signup: string
  first_signup: string
}

interface TotalStats {
  total_signups: number
  week_signups: number
  month_signups: number
  newsletter_subscribers: number
}

interface RecentSignup {
  email: string
  name: string
  company: string
  source_url: string
  landing_page_title: string
  created_at: string
}

interface DailyTrend {
  date: string
  signups: number
}

export default function SignupAnalyticsPage() {
  const [signupsByPage, setSignupsByPage] = useState<PageStats[]>([])
  const [totalStats, setTotalStats] = useState<TotalStats>({
    total_signups: 0,
    week_signups: 0,
    month_signups: 0,
    newsletter_subscribers: 0
  })
  const [recentSignups, setRecentSignups] = useState<RecentSignup[]>([])
  const [dailyTrend, setDailyTrend] = useState<DailyTrend[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/signup-analytics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setSignupsByPage(data.signupsByPage)
        setTotalStats(data.totalStats)
        setRecentSignups(data.recentSignups)
        setDailyTrend(data.dailyTrend)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAnalytics()
  }

  const exportToCSV = () => {
    const headers = ['Page URL', 'Page Title', 'Total Signups', 'Recent Signups', 'Last Signup', 'First Signup']
    const rows = signupsByPage.map(page => [
      page.page_url,
      page.page_title,
      page.total_signups,
      page.recent_signups,
      new Date(page.last_signup).toLocaleDateString(),
      new Date(page.first_signup).toLocaleDateString()
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `signup-analytics-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPageSlug = (url: string) => {
    if (!url || url === 'Direct/Unknown') return 'direct'
    try {
      const urlObj = new URL(url)
      return urlObj.pathname.split('/').pop() || 'homepage'
    } catch {
      return url.split('/').pop() || url
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Signup Analytics</h1>
          <p className="text-gray-600 mt-1">Track form submissions across all landing pages</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.total_signups}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalStats.week_signups}</div>
            <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalStats.month_signups}</div>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Newsletter Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalStats.newsletter_subscribers}</div>
            <p className="text-xs text-gray-500 mt-1">Opted in</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={timeRange === '7' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('7')}
        >
          Last 7 Days
        </Button>
        <Button
          variant={timeRange === '30' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('30')}
        >
          Last 30 Days
        </Button>
        <Button
          variant={timeRange === '90' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('90')}
        >
          Last 90 Days
        </Button>
        <Button
          variant={timeRange === '365' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('365')}
        >
          Last Year
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signups by Page */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Signups by Landing Page
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading analytics...</div>
              ) : signupsByPage.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No signups yet</div>
              ) : (
                <div className="space-y-3">
                  {signupsByPage.map((page, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{page.page_title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">
                              {getPageSlug(page.page_url)}
                            </span>
                            {page.page_url !== 'Direct/Unknown' && (
                              <a 
                                href={page.page_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{page.total_signups}</div>
                          <div className="text-xs text-gray-500">total signups</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm">
                            <strong>{page.recent_signups}</strong> in last {timeRange} days
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Last: {formatDate(page.last_signup)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Conversion bar */}
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min((page.recent_signups / page.total_signups) * 100, 100)}%` 
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {((page.recent_signups / page.total_signups) * 100).toFixed(1)}% recent activity
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Signups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : recentSignups.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No recent signups</div>
              ) : (
                <div className="space-y-3">
                  {recentSignups.map((signup, index) => (
                    <div key={index} className="border-b last:border-0 pb-3 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {signup.name || 'Anonymous'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{signup.email}</p>
                          {signup.company && (
                            <p className="text-xs text-gray-500">{signup.company}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {getPageSlug(signup.source_url)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(signup.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Trend Mini Chart */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Daily Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {dailyTrend.length > 0 && (
                <div className="flex items-end gap-1 h-20">
                  {dailyTrend.map((day, index) => {
                    const maxSignups = Math.max(...dailyTrend.map(d => d.signups))
                    const height = maxSignups > 0 ? (day.signups / maxSignups) * 100 : 0
                    return (
                      <div
                        key={index}
                        className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors relative group"
                        style={{ height: `${height}%`, minHeight: '2px' }}
                      >
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {day.signups} signups
                          <br />
                          {formatDate(day.date)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}