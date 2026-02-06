'use client'
import { useState, useEffect } from 'react'

// Define type for priority
type Priority = 'high' | 'medium' | 'low'

// Define the shape of each insight
interface Insight {
  id: number
  title: string
  description: string
  action: string
  priority: Priority
  icon: string
  color: string
}

export default function AIInsights() {
  const [currentInsight, setCurrentInsight] = useState<number>(0)
  const [isVisible, setIsVisible] = useState<boolean>(true)

  const insights: Insight[] = [
    {
      id: 1,
      title: 'Optimize Ad Spend',
      description:
        'Your Instagram ads are performing 23% better than industry average. Consider increasing budget.',
      action: 'View Campaign Details',
      priority: 'high',
      icon: '💰',
      color: 'bg-green-50 border-green-200 text-green-800',
    },
    {
      id: 2,
      title: 'Improve User Onboarding',
      description:
        'Users who complete onboarding are 3x more likely to convert. Streamline your signup flow.',
      action: 'Review Onboarding Funnel',
      priority: 'medium',
      icon: '🚀',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
    },
    {
      id: 3,
      title: 'Enhance Chatbot Responses',
      description:
        'Chatbot satisfaction is at 78%. Adding FAQ responses could boost it to 85%+.',
      action: 'Train Chatbot',
      priority: 'medium',
      icon: '🤖',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
    },
    {
      id: 4,
      title: 'Automate Report Generation',
      description:
        'Save 4 hours weekly by automating your monthly performance reports.',
      action: 'Set Up Automation',
      priority: 'low',
      icon: '📊',
      color: 'bg-orange-50 border-orange-200 text-orange-800',
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentInsight((prev) => (prev + 1) % insights.length)
        setIsVisible(true)
      }, 300)
    }, 5000)

    return () => clearInterval(interval)
  }, [insights.length])

  const currentInsightData = insights[currentInsight]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          <p className="text-sm text-gray-500">
            Personalized recommendations to boost your performance
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      {/* Current Insight */}
      <div
        className={`transition-all duration-300 ${
          isVisible
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform translate-y-2'
        }`}
      >
        <div className={`border rounded-lg p-4 ${currentInsightData.color}`}>
          <div className="flex items-start space-x-3">
            <div className="text-2xl">{currentInsightData.icon}</div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">
                {currentInsightData.title}
              </h4>
              <p className="text-sm mb-3 opacity-90">
                {currentInsightData.description}
              </p>
              <button className="text-sm font-medium hover:underline">
                {currentInsightData.action} →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Insight Navigation */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-1">
          {insights.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentInsight(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentInsight ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">
          {currentInsight + 1} of {insights.length}
        </span>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <span className="mr-1">🎯</span>
            Optimize
          </button>
          <button className="flex items-center justify-center px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <span className="mr-1">🤖</span>
            Automate
          </button>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
          <span>AI analyzing your data in real-time</span>
        </div>
      </div>
    </div>
  )
}
