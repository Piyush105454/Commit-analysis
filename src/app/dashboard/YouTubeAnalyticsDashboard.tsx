'use client'
import { useState, useEffect } from 'react'
import { youtubeAPI } from '@/services/api'
import {
  ChannelPerformanceChart,
  EngagementTrendChart,
  ChannelGrowthChart,
  VideoCategoriesChart
} from '@/app/charts/YouTubeCharts'

interface ChannelAnalysis {
  channel_info: {
    channel_id: string
    title: string
    description: string
    thumbnail: string
  }
  analysis_summary: {
    total_videos: number
    total_views: number
    total_likes: number
    total_comments: number
    avg_engagement_rate: number
    avg_views_per_video: number
  }
  recent_performance: {
    recent_videos_count: number
    recent_total_views: number
    recent_avg_views: number
    recent_engagement: number
  }
  top_performers: {
    by_views: any[]
    by_engagement: any[]
  }
}

export default function YouTubeAnalyticsDashboard() {
  const [channelName, setChannelName] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<ChannelAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastAnalyzed, setLastAnalyzed] = useState<string | null>(null)

  // Auto-refresh every 5 minutes if we have analysis
  useEffect(() => {
    if (analysis && channelName) {
      const interval = setInterval(() => {
        refreshAnalysis()
      }, 5 * 60 * 1000) // 5 minutes

      return () => clearInterval(interval)
    }
  }, [analysis, channelName])

  const analyzeChannel = async () => {
    if (!channelName.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await youtubeAPI.analyzeChannel({
        channelName: channelName.trim(),
        maxVideos: 500
      })

      if (response.success) {
        setAnalysis(response.data)
        setLastAnalyzed(new Date().toLocaleString())
      } else {
        setError(response.message)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze channel')
    } finally {
      setLoading(false)
    }
  }

  const refreshAnalysis = async () => {
    if (!channelName.trim()) return

    try {
      const response = await youtubeAPI.analyzeChannel({
        channelName: channelName.trim(),
        maxVideos: 500
      })

      if (response.success) {
        setAnalysis(response.data)
        setLastAnalyzed(new Date().toLocaleString())
      }
    } catch (err) {
      console.error('Auto-refresh failed:', err)
    }
  }

  const formatNumber = (num: number | undefined | null) => {
    // Handle undefined, null, or non-number values
    if (num === undefined || num === null || isNaN(num)) return '0'
    
    // Convert to number if it's a string
    const numValue = typeof num === 'string' ? parseFloat(num) : num
    
    if (numValue >= 1000000) return `${(numValue / 1000000).toFixed(1)}M`
    if (numValue >= 1000) return `${(numValue / 1000).toFixed(1)}K`
    return numValue.toLocaleString()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-time YouTube Analytics</h2>
          <p className="text-gray-600">Enter any YouTube channel name for instant analysis</p>
        </div>
        {lastAnalyzed && (
          <div className="text-right">
            <div className="flex items-center space-x-2">
              {analysis?.data_source === 'Mock Data (API Quota Exceeded)' ? (
                <>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-600">Demo Data</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live Data</span>
                </>
              )}
            </div>
            <div className="text-xs text-gray-500">Last updated: {lastAnalyzed}</div>
            {analysis?.data_source === 'Mock Data (API Quota Exceeded)' && (
              <div className="text-xs text-yellow-600 mt-1">⚠️ API quota exceeded - showing demo data</div>
            )}
          </div>
        )}
      </div>

      {/* Channel Input */}
      <div className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Enter YouTube channel name (e.g., MrBeast, PewDiePie, etc.)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            onKeyPress={(e) => e.key === 'Enter' && analyzeChannel()}
          />
          <button
            onClick={analyzeChannel}
            disabled={loading || !channelName.trim()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Analyze</span>
              </>
            )}
          </button>
          {analysis && (
            <button
              onClick={refreshAnalysis}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              title="Refresh Analysis"
            >
              🔄
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing channel with AI models...</p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Channel Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={analysis.channel_info.thumbnail}
              alt={analysis.channel_info.title}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{analysis.channel_info.title}</h3>
              <p className="text-gray-600 text-sm">{analysis.channel_info.description.substring(0, 100)}...</p>
              <p className="text-xs text-gray-500">Channel ID: {analysis.channel_info.channel_id}</p>
            </div>
          </div>

          {/* Main Analytics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analysis.analysis_summary.total_videos}</div>
              <div className="text-sm text-gray-600">Total Videos</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatNumber(analysis.analysis_summary.total_views)}</div>
              <div className="text-sm text-gray-600">Total Views</div>
              <div className="text-xs text-gray-500">Avg: {formatNumber(analysis.analysis_summary.avg_views_per_video)}/video</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{formatNumber(analysis.analysis_summary.total_likes)}</div>
              <div className="text-sm text-gray-600">Total Likes</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{analysis.analysis_summary.avg_engagement_rate}%</div>
              <div className="text-sm text-gray-600">Engagement Rate</div>
            </div>
          </div>

          {/* Recent Performance */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Performance (Last 30 Days)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xl font-bold text-blue-600">{analysis.recent_performance.recent_videos_count}</div>
                <div className="text-sm text-gray-600">New Videos</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-600">{formatNumber(analysis.recent_performance.recent_total_views)}</div>
                <div className="text-sm text-gray-600">Recent Views</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-600">{formatNumber(analysis.recent_performance.recent_avg_views)}</div>
                <div className="text-sm text-gray-600">Avg Views</div>
              </div>
              <div>
                <div className="text-xl font-bold text-orange-600">{(analysis.recent_performance.recent_engagement * 100).toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Recent Engagement</div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <ChannelPerformanceChart videos={analysis.all_videos} />
            <EngagementTrendChart videos={analysis.all_videos} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <ChannelGrowthChart videos={analysis.all_videos} />
            <VideoCategoriesChart videos={analysis.all_videos} />
          </div>

          {/* Top Performing Videos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Views */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">🔥 Top Videos by Views</h4>
              <div className="space-y-2">
                {analysis.top_performers.by_views.slice(0, 5).map((video, index) => (
                  <div key={video.video_id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{video.title}</p>
                      <div className="flex space-x-3 text-xs text-gray-500">
                        <span>👁 {formatNumber(video.view_count || 0)}</span>
                        <span>👍 {formatNumber(video.like_count || 0)}</span>
                        <span>💬 {formatNumber(video.comment_count || 0)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Engagement */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">⚡ Top Videos by Engagement</h4>
              <div className="space-y-2">
                {analysis.top_performers.by_engagement.slice(0, 5).map((video, index) => (
                  <div key={video.video_id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{video.title}</p>
                      <div className="flex space-x-3 text-xs text-gray-500">
                        <span>📊 {(video.engagement_ratio * 100).toFixed(2)}%</span>
                        <span>👁 {formatNumber(video.view_count || 0)}</span>
                        <span>👍 {formatNumber(video.like_count || 0)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}