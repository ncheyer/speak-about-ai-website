'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Target, Award, Search, BarChart3 } from 'lucide-react'

interface SemrushData {
  overview: {
    Domain: string
    Rank: string
    'Organic Keywords': string
    'Organic Traffic': string
    'Organic Cost': string
    'Adwords Keywords': string
    'Adwords Traffic': string
  }
  keywords: Array<{
    Keyword: string
    Position: string
    'Search Volume': string
    CPC: string
    Url: string
    'Traffic (%)': string
    Competition: string
  }>
  analysis: {
    lowHangingFruit: any[]
    highValueOpportunities: any[]
    topKeywords: any[]
    positionRanges: {
      top3: number
      top10: number
      top20: number
      top50: number
      top100: number
    }
    topics: Array<{
      topic: string
      count: number
      volume: number
      keywords: string[]
    }>
    totalVolume: number
  }
  totalKeywords: number
}

export default function SEOAnalysisPage() {
  const [data, setData] = useState<SemrushData | null>(null)
  const [competitorData, setCompetitorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [competitorLoading, setCompetitorLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch main SEO data
    fetch('/api/seo/analyze')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setData(data)
        }
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load SEO data')
        setLoading(false)
      })

    // Fetch competitor data
    fetch('/api/seo/competitors')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setCompetitorData(data)
        }
        setCompetitorLoading(false)
      })
      .catch(err => {
        console.error('Failed to load competitor data:', err)
        setCompetitorLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Error Loading SEO Data</CardTitle>
              <CardDescription className="text-red-700">{error || 'Unknown error'}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  const { overview, analysis, totalKeywords } = data

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">SEO Analysis Dashboard</h1>
          <p className="text-gray-600">Powered by Semrush API · Data for speakabout.ai</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Domain Rank</CardDescription>
              <CardTitle className="text-3xl">{parseInt(overview.Rank).toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Global ranking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Organic Keywords</CardDescription>
              <CardTitle className="text-3xl">{overview['Organic Keywords']}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Total ranking keywords</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Monthly Traffic</CardDescription>
              <CardTitle className="text-3xl">{overview['Organic Traffic']}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Estimated visits/month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Traffic Value</CardDescription>
              <CardTitle className="text-3xl">${overview['Organic Cost']}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Estimated monthly value</p>
            </CardContent>
          </Card>
        </div>

        {/* Position Ranges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Keyword Position Distribution
            </CardTitle>
            <CardDescription>Number of keywords in each position range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{analysis.positionRanges.top3}</div>
                <div className="text-sm text-gray-600">Top 3</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{analysis.positionRanges.top10}</div>
                <div className="text-sm text-gray-600">Top 10</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{analysis.positionRanges.top20}</div>
                <div className="text-sm text-gray-600">Top 20</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{analysis.positionRanges.top50}</div>
                <div className="text-sm text-gray-600">Top 50</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{analysis.positionRanges.top100}</div>
                <div className="text-sm text-gray-600">Top 100</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="low-hanging">Low-Hanging Fruit</TabsTrigger>
            <TabsTrigger value="high-value">High-Value</TabsTrigger>
            <TabsTrigger value="top-keywords">Top Keywords</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            {competitorLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Analyzing competitors and generating recommendations...</p>
                  </div>
                </CardContent>
              </Card>
            ) : competitorData?.recommendations ? (
              <div className="space-y-4">
                {competitorData.recommendations.map((rec: any, i: number) => (
                  <Card key={i} className={rec.priority === 'high' ? 'border-l-4 border-l-orange-500' : 'border-l-4 border-l-blue-500'}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          {rec.competitor && (
                            <CardDescription className="mt-1">
                              Based on analysis of {rec.competitor}
                            </CardDescription>
                          )}
                        </div>
                        <Badge className={rec.priority === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}>
                          {rec.priority === 'high' ? '🔥 High Priority' : '📊 Medium Priority'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{rec.action}</p>

                      {rec.keywords && rec.keywords.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-sm text-gray-900 mb-2">Target Keywords:</h4>
                          <div className="space-y-2">
                            {rec.keywords.map((kw: any, j: number) => (
                              <div key={j} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                <span className="font-medium">{kw.keyword}</span>
                                <div className="flex gap-3 text-sm text-gray-600">
                                  <span>{parseInt(kw.volume).toLocaleString()} searches/mo</span>
                                  {kw.position && <span>Competitor: #{kw.position}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {rec.metrics && (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded">
                            <div className="text-sm text-gray-600">Monthly Traffic</div>
                            <div className="text-2xl font-bold text-blue-900">{rec.metrics.traffic.toLocaleString()}</div>
                          </div>
                          <div className="bg-green-50 p-3 rounded">
                            <div className="text-sm text-gray-600">Total Keywords</div>
                            <div className="text-2xl font-bold text-green-900">{rec.metrics.keywords.toLocaleString()}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-600">No recommendations available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Competitors Tab */}
          <TabsContent value="competitors">
            {competitorLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Analyzing competitors...</p>
                  </div>
                </CardContent>
              </Card>
            ) : competitorData?.detailedAnalysis ? (
              <div className="space-y-6">
                {competitorData.detailedAnalysis.map((comp: any, i: number) => (
                  comp.error ? (
                    <Card key={i} className="border-red-200">
                      <CardHeader>
                        <CardTitle>{comp.domain}</CardTitle>
                        <CardDescription className="text-red-600">Failed to analyze competitor</CardDescription>
                      </CardHeader>
                    </Card>
                  ) : (
                    <Card key={i}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">{comp.domain}</CardTitle>
                            <CardDescription>Competitive Analysis</CardDescription>
                          </div>
                          <Badge variant="outline">#{i + 1} Competitor</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Overview Stats */}
                        {comp.overview && (
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded">
                              <div className="text-sm text-gray-600">Monthly Traffic</div>
                              <div className="text-2xl font-bold">{comp.overview['Organic Traffic'] || comp.overview.Ot}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded">
                              <div className="text-sm text-gray-600">Total Keywords</div>
                              <div className="text-2xl font-bold">{comp.overview['Organic Keywords'] || comp.overview.Or}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded">
                              <div className="text-sm text-gray-600">Traffic Value</div>
                              <div className="text-2xl font-bold">${comp.overview['Organic Cost'] || comp.overview.Oc}</div>
                            </div>
                          </div>
                        )}

                        {/* Their best keywords */}
                        {comp.bestKeywords && comp.bestKeywords.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3">🏆 Their Top Performing Keywords (Position 1-3)</h4>
                            <div className="space-y-2">
                              {comp.bestKeywords.slice(0, 5).map((kw: any, j: number) => (
                                <div key={j} className="flex items-center justify-between bg-green-50 p-3 rounded">
                                  <span className="font-medium">{kw.Ph || kw.Keyword}</span>
                                  <div className="flex gap-3 text-sm">
                                    <Badge className="bg-green-600">#{kw.Po || kw.Position}</Badge>
                                    <span className="text-gray-600">{parseInt(kw.Nq || kw['Search Volume'] || 0).toLocaleString()} searches/mo</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Keyword gaps - opportunities */}
                        {comp.keywordGap && comp.keywordGap.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3">💡 Keywords They Rank For (That You Don't)</h4>
                            <div className="space-y-2">
                              {comp.keywordGap.slice(0, 10).map((kw: any, j: number) => (
                                <div key={j} className="flex items-center justify-between bg-orange-50 p-3 rounded">
                                  <span className="font-medium">{kw.Ph || kw.Keyword}</span>
                                  <div className="flex gap-3 text-sm">
                                    <span className="text-gray-600">Their position: #{kw.Po || kw.Position}</span>
                                    <span className="text-gray-600">{parseInt(kw.Nq || kw['Search Volume'] || 0).toLocaleString()} searches/mo</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-600">No competitor data available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Low-Hanging Fruit */}
          <TabsContent value="low-hanging">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  Low-Hanging Fruit (Position 4-20)
                </CardTitle>
                <CardDescription>
                  {analysis.lowHangingFruit.length} keywords on page 1-2 that can be optimized to reach top 3
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.lowHangingFruit.slice(0, 20).map((kw, i) => (
                    <div key={i} className="flex items-start justify-between border-b pb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{kw.Keyword}</span>
                          <Badge variant="outline">Position {kw.Position}</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{kw.Url}</div>
                        <div className="flex gap-4 text-sm">
                          <span className="text-gray-600">
                            <Search className="w-4 h-4 inline mr-1" />
                            {parseInt(kw['Search Volume']).toLocaleString()} searches/mo
                          </span>
                          {parseFloat(kw.CPC) > 0 && (
                            <span className="text-gray-600">CPC: ${kw.CPC}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-orange-100 text-orange-800">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Quick Win
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* High-Value Opportunities */}
          <TabsContent value="high-value">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  High-Value Opportunities (Position 11-30, Volume 100+)
                </CardTitle>
                <CardDescription>
                  {analysis.highValueOpportunities.length} high-volume keywords on page 2-3
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.highValueOpportunities.map((kw, i) => (
                    <div key={i} className="flex items-start justify-between border-b pb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{kw.Keyword}</span>
                          <Badge variant="outline">Position {kw.Position}</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{kw.Url}</div>
                        <div className="flex gap-4 text-sm">
                          <span className="text-gray-600">
                            <Search className="w-4 h-4 inline mr-1" />
                            {parseInt(kw['Search Volume']).toLocaleString()} searches/mo
                          </span>
                          {parseFloat(kw.CPC) > 0 && (
                            <span className="text-gray-600">CPC: ${kw.CPC}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-blue-100 text-blue-800">
                          High Volume
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Keywords */}
          <TabsContent value="top-keywords">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-500" />
                  Top Performing Keywords (Position 1-3)
                </CardTitle>
                <CardDescription>
                  {analysis.topKeywords.length} keywords ranking in top 3 positions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.topKeywords.map((kw, i) => (
                    <div key={i} className="flex items-start justify-between border-b pb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{kw.Keyword}</span>
                          <Badge className="bg-green-100 text-green-800">
                            #{kw.Position}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{kw.Url}</div>
                        <div className="flex gap-4 text-sm">
                          <span className="text-gray-600">
                            <Search className="w-4 h-4 inline mr-1" />
                            {parseInt(kw['Search Volume']).toLocaleString()} searches/mo
                          </span>
                          {parseFloat(kw.CPC) > 0 && (
                            <span className="text-gray-600">CPC: ${kw.CPC}</span>
                          )}
                          <span className="text-green-600 font-medium">
                            {kw['Traffic (%)']}% of traffic
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Topics */}
          <TabsContent value="topics">
            <Card>
              <CardHeader>
                <CardTitle>Keyword Topics</CardTitle>
                <CardDescription>Common themes across your ranking keywords</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysis.topics.map((topic, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg capitalize">{topic.topic}</h3>
                        <Badge>{topic.count} keywords</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        Total search volume: {topic.volume.toLocaleString()}/month
                      </div>
                      <div className="space-y-1">
                        {topic.keywords.slice(0, 5).map((kw, j) => (
                          <div key={j} className="text-sm text-gray-700">• {kw}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
