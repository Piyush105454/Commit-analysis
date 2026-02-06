'use client'
import { useState, useEffect } from 'react'

interface ChartData {
  label: string
  value: number
  color: string
}

interface Segment extends ChartData {
  percentage: number
  startAngle: number
  endAngle: number
  value: number
}

interface Point {
  x: number
  y: number
}

export default function RevenueChart() {
  const [animatedValues, setAnimatedValues] = useState<number[]>([])

  const data: ChartData[] = [
    { label: 'Subscriptions', value: 45, color: '#3b82f6' },
    { label: 'Services', value: 30, color: '#10b981' },
    { label: 'Consulting', value: 15, color: '#f59e0b' },
    { label: 'Integrations', value: 10, color: '#8b5cf6' }
  ]

  useEffect(() => {
    const animateValues = () => {
      setAnimatedValues(prev => {
        if (prev.length === 0) return data.map(() => 0)
        return prev.map((current, index) => {
          const target = data[index].value
          const diff = target - current
          if (Math.abs(diff) < 0.5) return target
          return current + (diff * 0.1)
        })
      })
    }

    const interval = setInterval(animateValues, 50)
    return () => clearInterval(interval)
  }, [])

  const total = animatedValues.reduce((sum, val) => sum + val, 0)

  // Pie chart segments
  let currentAngle = -90
  const segments: Segment[] = animatedValues.map((value, index) => {
    const percentage = total > 0 ? (value / total) * 100 : 0
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    currentAngle += angle

    return {
      ...data[index],
      percentage,
      startAngle,
      endAngle: currentAngle,
      value: animatedValues[index] || 0
    }
  })

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ): Point => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  const createPath = (
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ): string => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle)
    const end = polarToCartesian(centerX, centerY, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ")
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue by Source</h3>
        <p className="text-sm text-gray-500">Breakdown of income streams</p>
      </div>

      <div className="flex items-center justify-between">
        {/* Pie Chart */}
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {segments.map((segment, index) => (
              <g key={index}>
                <path
                  d={createPath(100, 100, 80, segment.startAngle, segment.endAngle)}
                  fill={segment.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  style={{ filter: `drop-shadow(0 0 10px ${segment.color}30)` }}
                />
              </g>
            ))}

            {/* Center circle */}
            <circle
              cx="100"
              cy="100"
              r="45"
              fill="white"
              className="drop-shadow-sm"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {total.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 ml-6">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center group cursor-pointer">
              <div
                className="w-4 h-4 rounded-full mr-3 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: segment.color }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {segment.label}
                  </span>
                  <span className="text-sm font-bold text-gray-700 ml-2">
                    {segment.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  ${(segment.value * 1000).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              +{((animatedValues[0] || 0) * 0.15).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Growth Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              ${((total * 1000) / 12).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Monthly Avg</div>
          </div>
        </div>
      </div>
    </div>
  )
}
