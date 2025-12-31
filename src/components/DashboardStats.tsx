"use client"
import React from 'react'

import React, { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'

const tableKeys = [
  'production_logs',
  'shop_inventory',
  'transactions',
  'ledgers',
  'utility_logs',
  'profiles',
]

export default function DashboardStats() {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    async function load() {
      const next: Record<string, number> = {}
      for (const t of tableKeys) {
        try {
          const res = await supabase.from(t).select('*', { count: 'exact', head: true })
          // @ts-ignore
          next[t] = res.count ?? 0
        } catch (e) {
          next[t] = 0
        }
      }
      setCounts(next)
    }
    load()
  }, [])

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tableKeys.map((k) => (
          <div key={k} className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">{k.replace('_', ' ')}</div>
            <div className="mt-2 text-2xl font-bold">{counts[k] ?? '-'}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
