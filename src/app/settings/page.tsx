'use client'
import { useState } from 'react'
import Sidebar from '../dashboard/Sidebar'

export default function SettingsPage() {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onCollapseChange={(collapsedState: boolean) => setSidebarCollapsed(collapsedState)}
            />

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
                    }`}
            >
                <main className="min-h-screen p-6">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between mb-4 lg:hidden">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
                        <p className="text-gray-600 mb-4">
                            Application settings and preferences.
                        </p>
                        <div className="p-4 bg-gray-50 text-gray-700 rounded-lg border border-gray-200">
                            Settings module is under construction.
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
