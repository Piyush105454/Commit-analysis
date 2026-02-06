'use client'
import { useState, useEffect, useMemo } from 'react'
import { useDashboard } from '@/hooks/useDashboard'
import { useUserChannel } from '@/hooks/useUserChannel'

type Stat = {
  id: string
  title: string
  value: number
  change: string
  changeType: 'positive' | 'negative'
  subtitle: string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange' | 'pink'
}

type AnimatedValues = {
  [key: string]: number
}

export default function StatsCards() {
  const [animatedValues, setAnimatedValues] = useState<AnimatedValues>({})
  const { stats: dashboardStats, loading, error } = useDashboard()
  const { channelAnalysis, loading: channelLoading } = useUserChannel()

  // ✅ Use real user channel data if available, otherwise fallback to dashboard stats
  const stats: Stat[] = useMemo(
    () => {
      // If user has channel analysis, use real data
      if (channelAnalysis?.analysis_summary) {
        const channelStats = channelAnalysis.analysis_summary;
        return [
          {
            id: 'videos',
            title: 'Total Videos',
            value: channelStats.total_videos || 0,
            change: '+12.5%',
            changeType: 'positive',
            subtitle: 'all videos (shorts + long)',
            icon: '🎥',
            color: 'blue'
          },
          {
            id: 'views',
            title: 'Total Views',
            value: channelStats.total_views || 0,
            change: '+2.3%',
            changeType: 'positive',
            subtitle: 'across all videos',
            icon: '👁️',
            color: 'green'
          },
          {
            id: 'likes',
            title: 'Total Likes',
            value: channelStats.total_likes || 0,
            change: '+18.2%',
            changeType: 'positive',
            subtitle: 'from your audience',
            icon: '👍',
            color: 'purple'
          },
          {
            id: 'engagement',
            title: 'Engagement Rate',
            value: channelStats.avg_engagement_rate || 0,
            change: '+6.4%',
            changeType: 'positive',
            subtitle: 'average engagement',
            icon: '📊',
            color: 'orange'
          }
        ];
      }
      
      // Fallback to dashboard stats
      return [
        {
          id: 'followers',
          title: 'Total Followers',
          value: dashboardStats?.totalFollowers || 0,
          change: '+12.5%',
          changeType: 'positive',
          subtitle: 'from last month',
          icon: '👥',
          color: 'blue'
        },
        {
          id: 'engagement',
          title: 'Engagement Rate',
          value: dashboardStats?.engagement || 0,
          change: '+2.3%',
          changeType: 'positive',
          subtitle: 'from last month',
          icon: '❤️',
          color: 'pink'
        },
        {
          id: 'reach',
          title: 'Total Reach',
          value: dashboardStats?.reach || 0,
          change: '+18.2%',
          changeType: 'positive',
          subtitle: 'from last month',
          icon: '📊',
          color: 'green'
        },
        {
          id: 'impressions',
          title: 'Total Impressions',
          value: dashboardStats?.impressions || 0,
          change: '+6.4%',
          changeType: 'positive',
          subtitle: 'this month',
          icon: '📝',
          color: 'purple'
        }
      ];
    },
    [dashboardStats, channelAnalysis]
  )

  useEffect(() => {
    stats.forEach(stat => {
      const animateValue = () => {
        setAnimatedValues(prev => {
          const current = prev[stat.id] || 0
          const target = stat.value
          const diff = target - current
          if (Math.abs(diff) < 0.1) return { ...prev, [stat.id]: target }
          return { ...prev, [stat.id]: current + diff * 0.1 }
        })
      }

      const interval = setInterval(animateValue, 50)
      setTimeout(() => clearInterval(interval), 2000)
    })
  }, [stats])

  const formatValue = (id: string, value: number) => {
    const animated = animatedValues[id] || 0
    if (id === 'followers' || id === 'reach' || id === 'impressions') {
      if (animated >= 1000000) return `${(animated / 1000000).toFixed(1)}M`
      if (animated >= 1000) return `${(animated / 1000).toFixed(1)}K`
      return Math.round(animated).toLocaleString()
    }
    if (id === 'engagement') return `${animated.toFixed(1)}%`
    return Math.round(animated).toLocaleString()
  }

  const getColorClasses = (
    color: Stat['color'],
    changeType: Stat['changeType']
  ) => {
    const colors: Record<Stat['color'], string> = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
      pink: 'bg-pink-50 text-pink-600'
    }

    const changeColors: Record<Stat['changeType'], string> = {
      positive: 'text-green-600 bg-green-50',
      negative: 'text-red-600 bg-red-50'
    }

    return {
      icon: colors[color],
      change: changeColors[changeType]
    }
  }

  if (loading || channelLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading stats: {error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => {
        const colorClasses = getColorClasses(stat.color, stat.changeType)

        return (
          <div
            key={stat.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:scale-105"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-lg ${colorClasses.icon} flex items-center justify-center text-xl`}
              >
                {stat.icon}
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses.change}`}
              >
                {stat.change}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {formatValue(stat.id, stat.value)}
              </h3>
              <p className="text-sm font-medium text-gray-900">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </div>

            {/* Mini sparkline effect */}
            <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${
                  stat.changeType === 'positive'
                    ? 'from-green-400 to-green-600'
                    : 'from-red-400 to-red-600'
                } rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${Math.abs(parseFloat(stat.change))}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}