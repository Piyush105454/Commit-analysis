'use client'
import { useState, useEffect } from 'react'

// Define metric structure
interface Metric {
  label: string
  data: number[]
  color: string
  format: (val: number) => string
}

type MetricKey = 'revenue' | 'users' | 'engagement'

export default function PerformanceChart() {
  const [animatedData, setAnimatedData] = useState<number[]>([])
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('revenue')

  const metrics: Record<MetricKey, Metric> = {
    revenue: {
      label: 'Revenue',
      data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000],
      color: '#3b82f6',
      format: (val: number) => `$${(val / 1000).toFixed(1)}K`
    },
    users: {
      label: 'Active Users',
      data: [1200, 1900, 1500, 2500, 2200, 3000, 2800, 3500],
      color: '#10b981',
      format: (val: number) => `${(val / 1000).toFixed(1)}K`
    },
    engagement: {
      label: 'Engagement',
      data: [65, 78, 82, 75, 88, 92, 85, 95],
      color: '#8b5cf6',
      format: (val: number) => `${val}%`
    }
  }

  const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']

  useEffect(() => {
    const targetData = metrics[selectedMetric].data

    const animateData = () => {
      setAnimatedData((prev) => {
        if (prev.length === 0) return targetData.map(() => 0)
        return prev.map((current, index) => {
          const target = targetData[index]
          const diff = target - current
          if (Math.abs(diff) < 1) return target
          return current + diff * 0.1
        })
      })
    }

    const interval = setInterval(animateData, 50)
    return () => clearInterval(interval)
  }, [selectedMetric])

  const maxValue = Math.max(...metrics[selectedMetric].data)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
          <p className="text-sm text-gray-500">
            Revenue and activity over the last 8 months
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex space-x-2">
          {Object.entries(metrics).map(([key, metric]) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key as MetricKey)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedMetric === key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        {/* Grid Lines */}
        <div className="absolute inset-0">
          {[0, 25, 50, 75, 100].map((line) => (
            <div
              key={line}
              className="absolute w-full border-t border-gray-100"
              style={{ bottom: `${line}%` }}
            />
          ))}
        </div>

        {/* Bars */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 h-full">
          {animatedData.map((value, index) => {
            const height = (value / maxValue) * 100
            return (
              <div
                key={index}
                className="flex flex-col items-center flex-1 mx-1"
              >
                {/* Bar */}
                <div
                  className="w-full max-w-8 rounded-t-md transition-all duration-500 ease-out relative group cursor-pointer"
                  style={{
                    height: `${height}%`,
                    backgroundColor: metrics[selectedMetric].color,
                    boxShadow: `0 0 20px ${metrics[selectedMetric].color}20`
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {metrics[selectedMetric].format(value)}
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20 rounded-t-md" />
                </div>

                {/* Month Label */}
                <span className="text-xs text-gray-500 mt-2">{months[index]}</span>
              </div>
            )
          })}
        </div>

        {/* Trend Line */}
        {animatedData.length > 0 && (
          <svg
            className="absolute inset-0 pointer-events-none"
            viewBox="0 0 400 200"
          >
            <path
              d={animatedData
                .map((value, index) => {
                  const x = (index / (animatedData.length - 1)) * 350 + 25
                  const y = 180 - (value / maxValue) * 160
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                })
                .join(' ')}
              stroke={metrics[selectedMetric].color}
              strokeWidth="2"
              fill="none"
              strokeDasharray="4,4"
              className="opacity-60"
            />
          </svg>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: metrics[selectedMetric].color }}
          />
          <span className="text-sm text-gray-600">{metrics[selectedMetric].label}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 border-2 border-gray-300 border-dashed rounded-full mr-2" />
          <span className="text-sm text-gray-600">Trend</span>
        </div>
      </div>
    </div>
  )
}
