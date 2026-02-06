'use client'
import { useState, useEffect } from 'react'

interface Activity {
  id: number
  user: string
  action: string
  time: string
  avatar: string
  color: string
  icon: string
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])

  const activityData: Activity[] = [
    {
      id: 1,
      user: 'Sarah K.',
      action: 'connected her Stripe account',
      time: '2 hours ago',
      avatar: 'SK',
      color: 'bg-blue-500',
      icon: '🔗'
    },
    {
      id: 2,
      user: 'New report',
      action: '"Q3 Financial Overview" generated',
      time: '1 minute ago',
      avatar: 'R',
      color: 'bg-green-500',
      icon: '📊'
    },
    {
      id: 3,
      user: 'AI Assistant',
      action: 'provided 5 new recommendations',
      time: '5 hours ago',
      avatar: 'AI',
      color: 'bg-purple-500',
      icon: '🤖'
    },
    {
      id: 4,
      user: 'Marketing campaign',
      action: 'performance review complete',
      time: 'Yesterday',
      avatar: 'M',
      color: 'bg-orange-500',
      icon: '📈'
    },
    {
      id: 5,
      user: 'System update',
      action: 'applied successfully',
      time: '2 days ago',
      avatar: 'S',
      color: 'bg-gray-500',
      icon: '⚙️'
    }
  ]

  useEffect(() => {
    // Simulate real-time updates
    setActivities(activityData)
    
    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity: Activity = {
          id: Date.now(),
          user: 'Live Update',
          action: 'new data synchronized',
          time: 'Just now',
          avatar: 'L',
          color: 'bg-green-500',
          icon: '🔄'
        }
        return [newActivity, ...prev.slice(0, 4)]
      })
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity coming soon</h3>
          <p className="text-sm text-gray-500">Updates on your integrations and system events dummy text currently unavailable</p>
        </div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 group-hover:scale-105 transition-transform`}>
              {activity.avatar}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">{activity.icon}</span>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span>{' '}
                  <span className="text-gray-600">{activity.action}</span>
                </p>
              </div>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>

            {/* Action indicator */}
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {/* View all button */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors">
          View All Activity
        </button>
      </div>
    </div>
  )
}
