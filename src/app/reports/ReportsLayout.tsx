'use client'
import ProtectedRoute from '../Home/ProtectedRoute'
import Sidebar from '../dashboard/Sidebar'
import TopBar from '../dashboard/TopBar'
import { useState } from 'react'

export default function ReportsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const reportTypes = [
    { name: 'Weekly Summary', icon: '📅', status: 'Ready', color: 'green' },
    { name: 'Monthly Performance', icon: '📊', status: 'Generating', color: 'yellow' },
    { name: 'Competitor Analysis', icon: '🔍', status: 'Ready', color: 'green' },
    { name: 'Audience Insights', icon: '👥', status: 'Scheduled', color: 'blue' },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="lg:pl-64">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
              <p className="text-gray-600">Generate and download detailed performance reports</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {reportTypes.map((report, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{report.icon}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.color === 'green' ? 'bg-green-100 text-green-800' :
                      report.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {report.status}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{report.name}</h3>
                  <button className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                    {report.status === 'Ready' ? 'Download' : 'View Status'}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Custom Report Builder</h2>
              <p className="text-gray-600 mb-6">Create custom reports with the metrics that matter to you.</p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
                Create Custom Report
              </button>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}