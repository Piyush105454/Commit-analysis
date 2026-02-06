'use client'
import { useState, useEffect } from 'react'
import type { JSX } from 'react'

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const features: Feature[] = [
  {
    id: 'analytics',
    title: 'Real-time Analytics',
    description: 'Track your social media performance with live data updates and comprehensive metrics.',
    icon: '📊',
    color: 'blue'
  },
  {
    id: 'insights',
    title: 'AI-Powered Insights',
    description: 'Get intelligent recommendations to boost your engagement and grow your audience.',
    icon: '🤖',
    color: 'purple'
  },
  {
    id: 'management',
    title: 'Content Management',
    description: 'Plan, schedule, and manage your content across all social media platforms.',
    icon: '📝',
    color: 'green'
  },
  {
    id: 'reporting',
    title: 'Advanced Reporting',
    description: 'Generate detailed reports with custom metrics and automated insights.',
    icon: '📋',
    color: 'orange'
  }
]

export default function FeaturesSection(): JSX.Element {
  const [activeFeature, setActiveFeature] = useState<number>(0)
  const [treeAnimated, setTreeAnimated] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => setTreeAnimated(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="features-section" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Social Media Success
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to analyze, optimize, and grow your social media presence
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Tree Animation */}
          <div className="relative">
            <div className="relative max-w-md mx-auto">
              {/* Tree Structure */}
              <div className="relative">
                {/* Main trunk */}
                <div className={`w-1 bg-gradient-to-b from-green-600 to-green-800 mx-auto transition-all duration-1000 ${treeAnimated ? 'h-80' : 'h-0'
                  }`} />

                {/* Feature branches */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
                  {features.map((feature, index) => {
                    const isActive = activeFeature === index
                    const delay = index * 200

                    return (
                      <div
                        key={feature.id}
                        className={`absolute flex items-center transition-all duration-500 ${index % 2 === 0 ? 'left-0 flex-row' : 'right-0 flex-row-reverse'
                          }`}
                        style={{
                          top: `${60 + index * 60}px`,
                          animationDelay: `${delay}ms`
                        }}
                      >
                        {/* Branch line */}
                        <div className={`h-0.5 bg-gradient-to-r transition-all duration-700 ${treeAnimated ? 'w-24' : 'w-0'
                          } ${feature.color === 'blue' ? 'from-blue-400 to-blue-600' :
                            feature.color === 'purple' ? 'from-purple-400 to-purple-600' :
                              feature.color === 'green' ? 'from-green-400 to-green-600' :
                                'from-orange-400 to-orange-600'
                          }`} style={{ animationDelay: `${delay + 500}ms` }} />

                        {/* Feature node */}
                        <div className={`relative transition-all duration-500 ${treeAnimated ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                          }`} style={{ animationDelay: `${delay + 700}ms` }}>
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg cursor-pointer transform transition-all duration-300 ${isActive ? 'scale-110 shadow-xl' : 'hover:scale-105'
                            } ${feature.color === 'blue' ? 'bg-blue-500 text-white' :
                              feature.color === 'purple' ? 'bg-purple-500 text-white' :
                                feature.color === 'green' ? 'bg-green-500 text-white' :
                                  'bg-orange-500 text-white'
                            }`}
                            onClick={() => setActiveFeature(index)}
                          >
                            {feature.icon}
                          </div>

                          {/* Feature tooltip */}
                          <div className={`absolute ${index % 2 === 0 ? 'left-20' : 'right-20'
                            } top-1/2 transform -translate-y-1/2 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}>
                            <div className="bg-white rounded-lg shadow-xl p-4 border border-gray-200 max-w-xs">
                              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                              <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                
               
              </div>
            </div>
          </div>

          {/* Right Side - Real Dashboard Preview */}
          <div className="relative">
            <div className="bg-gray-50 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-lg mx-auto">
              {/* Sidebar Preview */}
              <div className="flex">
                {/* Mini Sidebar */}
                <div className="w-16 bg-white border-r border-gray-200 p-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xs">N</span>
                  </div>
                  <div className="space-y-2">
                    {['📊', '📈', '📝', '👥', '🔍', '📋'].map((icon, index) => (
                      <div key={index} className={`w-10 h-8 rounded-lg flex items-center justify-center text-sm ${
                        index === 0 ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'
                      }`}>
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-3">
                  {/* Header */}
                  <div className="bg-white border-b border-gray-200 p-3 mb-3 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Social Media Dashboard</h3>
                        <p className="text-xs text-gray-500">Track your performance</p>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { icon: '👥', label: 'Total Followers', value: '25.6K', change: '+12.5%', color: 'blue' },
                      { icon: '❤️', label: 'Engagement Rate', value: '8.7%', change: '+2.3%', color: 'pink' },
                      { icon: '📊', label: 'Total Reach', value: '156.8K', change: '+18.2%', color: 'green' },
                      { icon: '📝', label: 'Posts Published', value: '47', change: '+6.4%', color: 'purple' }
                    ].map((stat, index) => (
                      <div key={index} className="bg-white rounded-lg p-2 border border-gray-200">
                        <div className="flex items-center justify-between mb-1">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                            stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                            stat.color === 'pink' ? 'bg-pink-50 text-pink-600' :
                            stat.color === 'green' ? 'bg-green-50 text-green-600' :
                            'bg-purple-50 text-purple-600'
                          }`}>
                            {stat.icon}
                          </div>
                          <div className="px-1 py-0.5 rounded-full text-xs font-medium text-green-600 bg-green-50">
                            {stat.change}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {/* Performance Chart */}
                    <div className="bg-white rounded-lg p-2 border border-gray-200">
                      <div className="text-xs font-semibold text-gray-900 mb-2">Monthly Performance</div>
                      <div className="flex items-end justify-between h-12">
                        {[40, 65, 45, 80, 60, 90, 75, 85].map((height, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-t from-blue-400 to-blue-600 rounded-t w-1.5 transition-all duration-1000 ease-out"
                            style={{ 
                              height: `${height}%`,
                              animationDelay: `${index * 100}ms`
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Engagement Chart */}
                    <div className="bg-white rounded-lg p-2 border border-gray-200">
                      <div className="text-xs font-semibold text-gray-900 mb-2">User Engagement</div>
                      <div className="space-y-1">
                        {[
                          { platform: 'Instagram', value: 85, color: 'bg-pink-500' },
                          { platform: 'LinkedIn', value: 91, color: 'bg-blue-700' },
                          { platform: 'Twitter', value: 68, color: 'bg-sky-500' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div className="text-xs w-8 text-gray-600">{item.platform.slice(0,2)}</div>
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5 mx-1">
                              <div 
                                className={`h-1.5 rounded-full transition-all duration-700 ${item.color}`}
                                style={{ width: `${item.value}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-600 w-6">{item.value}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Platform Overview */}
                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                    <div className="text-xs font-semibold text-gray-900 mb-2">Platform Overview</div>
                    <div className="grid grid-cols-6 gap-1">
                      {[
                        { icon: '📷', name: 'IG', followers: '12.5K', color: 'bg-pink-500' },
                        { icon: '👥', name: 'FB', followers: '8.2K', color: 'bg-blue-600' },
                        { icon: '🐦', name: 'TW', followers: '3.1K', color: 'bg-sky-500' },
                        { icon: '💼', name: 'LI', followers: '2.8K', color: 'bg-blue-700' },
                        { icon: '🎵', name: 'TT', followers: '15.2K', color: 'bg-black' },
                        { icon: '📺', name: 'YT', followers: '1.8K', color: 'bg-red-600' }
                      ].map((platform, index) => (
                        <div key={index} className="text-center">
                          <div className={`w-6 h-6 ${platform.color} rounded-lg flex items-center justify-center text-white text-xs mx-auto mb-1`}>
                            {platform.icon}
                          </div>
                          <div className="text-xs text-gray-600">{platform.followers}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature details */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto">
            {features[activeFeature] && (
              <>
                <div className="text-4xl mb-4">{features[activeFeature].icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{features[activeFeature].title}</h3>
                <p className="text-gray-600 mb-6">{features[activeFeature].description}</p>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
                  Learn More
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
