'use client'
import ProtectedRoute from '../Home/ProtectedRoute'
import Sidebar from '../dashboard/Sidebar'
import TopBar from '../dashboard/TopBar'
import { useState } from 'react'
import type { JSX } from 'react'

interface Platform {
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  followers: string;
}

const platforms: Platform[] = [
  { name: 'Instagram', icon: '📷', color: 'bg-pink-500', connected: true, followers: '12.5K' },
  { name: 'Facebook', icon: '👥', color: 'bg-blue-600', connected: true, followers: '8.2K' },
  { name: 'Twitter', icon: '🐦', color: 'bg-sky-500', connected: false, followers: '0' },
  { name: 'LinkedIn', icon: '💼', color: 'bg-blue-700', connected: true, followers: '3.1K' },
  { name: 'TikTok', icon: '🎵', color: 'bg-black', connected: false, followers: '0' },
  { name: 'YouTube', icon: '📺', color: 'bg-red-600', connected: true, followers: '1.8K' },
]

export default function AccountsLayout(): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onCollapseChange={setIsCollapsed} />
        
        <div className={`lg:pl-${isCollapsed ? '16' : '64'} transition-all duration-300`}>
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Accounts</h1>
              <p className="text-gray-600">Link your social media accounts to start tracking performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map((platform, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center text-white text-xl mr-3`}>
                        {platform.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                        <p className="text-sm text-gray-500">
                          {platform.connected ? `${platform.followers} followers` : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${platform.connected ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                  
                  {platform.connected ? (
                    <div className="space-y-2">
                      <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        View Analytics
                      </button>
                      <button className="w-full text-red-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
                      Connect Account
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account</p>
                  <button className="bg-green-50 text-green-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                    Enable 2FA
                  </button>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">API Access</h3>
                  <p className="text-sm text-gray-600 mb-3">Generate API keys for custom integrations</p>
                  <button className="bg-blue-50 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                    Manage API Keys
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
