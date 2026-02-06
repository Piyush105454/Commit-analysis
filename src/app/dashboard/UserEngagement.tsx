'use client'
import { useState, useEffect, useMemo } from 'react'

interface EngagementItem {
  platform: string
  value: number
  color: string
  icon: string
}

export default function UserEngagement() {
  const [animatedData, setAnimatedData] = useState<number[]>([])

  // ✅ useMemo ensures this array is stable across renders
  const engagementData: EngagementItem[] = useMemo(
    () => [
      { platform: 'Instagram', value: 85, color: '#E1306C', icon: '📷' },
      { platform: 'Facebook', value: 72, color: '#1877F2', icon: '👥' },
      { platform: 'Twitter', value: 68, color: '#1DA1F2', icon: '🐦' },
      { platform: 'LinkedIn', value: 91, color: '#0A66C2', icon: '💼' },
      { platform: 'YouTube', value: 63, color: '#FF0000', icon: '📺' }
    ],
    [] // No dependencies → runs only once
  )

  useEffect(() => {
    const animateData = () => {
      setAnimatedData(prev => {
        if (prev.length === 0) return engagementData.map(() => 0)
        return prev.map((current, index) => {
          const target = engagementData[index].value
          const diff = target - current
          if (Math.abs(diff) < 0.5) return target
          return current + diff * 0.08
        })
      })
    }

    const interval = setInterval(animateData, 50)
    return () => clearInterval(interval)
  }, [engagementData]) // ✅ stable now

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">User Engagement</h3>
        <p className="text-sm text-gray-500">Engagement across different platforms</p>
      </div>

      <div className="space-y-4">
        {engagementData.map((item, index) => {
          const animatedValue = animatedData[index] || 0
          return (
            <div key={item.platform} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-lg mr-2">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {item.platform}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {animatedValue.toFixed(0)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out relative"
                    style={{
                      width: `${animatedValue}%`,
                      backgroundColor: item.color
                    }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
                  </div>
                </div>

                {/* Engagement level indicator */}
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">
              {(
                animatedData.reduce((sum, val) => sum + val, 0) / animatedData.length || 0
              ).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500">Avg Engagement</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {animatedData.filter(val => val > 70).length}
            </div>
            <div className="text-xs text-gray-500">High Performers</div>
          </div>
        </div>
      </div>
    </div>
  )
}
