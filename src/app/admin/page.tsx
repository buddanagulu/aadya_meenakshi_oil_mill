import React from 'react'
import DashboardStats from '../../components/DashboardStats'
import LogsTable from '../../components/LogsTable'
import Auth from '../../components/Auth'

export default function AdminPage() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <Auth />
        </div>
        <DashboardStats />
        <div className="mt-8">
          <LogsTable />
        </div>
      </div>
    </main>
  )
}

