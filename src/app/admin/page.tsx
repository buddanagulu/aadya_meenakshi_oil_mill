import React from 'react'
import Dashboard from '../../components/Dashboard'
import LogsTable from '../../components/LogsTable'
import Auth from '../../components/Auth'
import Sidebar from '../../components/Sidebar'
import { dataService } from '../../services/dataService'

export default async function AdminPage() {
  const production = await dataService.getProduction()
  const inventory = await dataService.getInventory()
  const transactions = await dataService.getTransactions()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex gap-8">
          <Sidebar />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
              <Auth />
            </div>
            <Dashboard production={production} inventory={inventory} transactions={transactions} />
            <div className="mt-8">
              <LogsTable />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

