'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Users, 
  Download, 
  Search, 
  Calendar,
  TrendingUp,
  UserCheck,
  UserX,
  Clock,
  Building
} from 'lucide-react'

interface NewsletterSignup {
  id: number
  email: string
  name: string | null
  company: string | null
  subscribed_at: string
  status: string
  source: string
  ip_address: string
  unsubscribed_at: string | null
}

interface NewsletterStats {
  active_count: number
  unsubscribed_count: number
  total_count: number
  week_count: number
  month_count: number
}

export default function AdminNewsletterPage() {
  const router = useRouter()
  const [signups, setSignups] = useState<NewsletterSignup[]>([])
  const [stats, setStats] = useState<NewsletterStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchSignups()
  }, [statusFilter])

  const fetchSignups = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await fetch(`/api/admin/newsletter?${params}`)
      
      if (response.status === 401) {
        router.push('/admin')
        return
      }
      
      const data = await response.json()
      if (data.success) {
        setSignups(data.signups)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching newsletter signups:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchSignups()
  }

  const exportToCSV = async () => {
    setExporting(true)
    try {
      const response = await fetch('/api/admin/newsletter', {
        method: 'POST'
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting newsletter signups:', error)
    } finally {
      setExporting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
            <p className="text-gray-600 mt-2">Manage and track newsletter signups</p>
          </div>
          <Button
            onClick={exportToCSV}
            disabled={exporting}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="mr-2 h-4 w-4" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_count}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active_count}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unsubscribed</p>
                    <p className="text-2xl font-bold text-red-600">{stats.unsubscribed_count}</p>
                  </div>
                  <UserX className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.week_count}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.month_count}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <Input
                  type="text"
                  placeholder="Search by email, name, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('active')}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === 'unsubscribed' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('unsubscribed')}
                >
                  Unsubscribed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscribers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading subscribers...</div>
            ) : signups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No subscribers found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Company</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Source</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signups.map((signup) => (
                      <tr key={signup.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{signup.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {signup.name || <span className="text-gray-400">—</span>}
                        </td>
                        <td className="py-3 px-4">
                          {signup.company ? (
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{signup.company}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={signup.status === 'active' ? 'default' : 'secondary'}
                            className={signup.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          >
                            {signup.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">{signup.source}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {formatDate(signup.subscribed_at)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
        </div>
      </div>
    </div>
  )
}