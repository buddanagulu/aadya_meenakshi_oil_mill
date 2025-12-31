"use client"
import React from 'react'
import { Button } from './ui/button'
import supabase from '../lib/supabaseClient'

const items = [
  { id: 'production_logs', label: 'Production Logs' },
  { id: 'shop_inventory', label: 'Shop Inventory' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'ledgers', label: 'Ledgers' },
  { id: 'utility_logs', label: 'Utility Logs' },
  { id: 'profiles', label: 'Profiles' },
]

export default function Sidebar({ onSelect }: { onSelect?: (id: string) => void }) {
  async function signOut() {
    try {
      await supabase.auth.signOut()
      window.location.reload()
    } catch (e) {
      // ignore
    }
  }

  return (
    <aside className="w-64 hidden md:flex flex-col bg-indigo-900 text-white p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">🛢️ Mill Manager</h2>
        <p className="text-indigo-300 text-sm mt-1">Admin Control</p>
      </div>
      <nav className="flex-1 space-y-2">
        {items.map(i => (
          <button key={i.id} onClick={() => onSelect?.(i.id)} className="w-full text-left px-3 py-2 rounded-md hover:bg-indigo-800">{i.label}</button>
        ))}
      </nav>
      <div className="pt-2">
        <Button variant="outline" onClick={signOut}>Sign out</Button>
      </div>
    </aside>
  )
}
