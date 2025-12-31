"use client"
import React, { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'

type TableKey =
  | 'production_logs'
  | 'shop_inventory'
  | 'transactions'
  | 'ledgers'
  | 'utility_logs'
  | 'profiles'

const tableList: TableKey[] = [
  'production_logs',
  'shop_inventory',
  'transactions',
  'ledgers',
  'utility_logs',
  'profiles',
]

export default function LogsTable() {
  const [table, setTable] = useState<TableKey>('production_logs')
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table])

  async function load() {
    setLoading(true)
    const { data, error } = await supabase.from(table).select('*').limit(200)
    if (error) {
      console.error(error)
      setRows([])
    } else {
      setRows(data ?? [])
    }
    setLoading(false)
  }

  async function handleAdd() {
    const payload = prompt('Enter JSON for new row (e.g. {"date":"2025-01-01","raw_material_kg":100})')
    if (!payload) return
    try {
      const obj = JSON.parse(payload)
      const { error } = await supabase.from(table).insert([obj])
      if (error) throw error
      await load()
    } catch (e: any) {
      alert('Error: ' + e.message)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this row?')) return
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) return alert(error.message)
    await load()
  }

  async function handleEdit(row: any) {
    const payload = prompt('Edit JSON for this row', JSON.stringify(row))
    if (!payload) return
    try {
      const obj = JSON.parse(payload)
      const { error } = await supabase.from(table).update(obj).eq('id', row.id)
      if (error) throw error
      await load()
    } catch (e: any) {
      alert('Error: ' + e.message)
    }
  }

  return (
    <section>
      <div className="flex gap-2 flex-wrap items-center">
        {tableList.map((t) => (
          <button
            key={t}
            onClick={() => setTable(t)}
            className={`px-3 py-1 rounded-md text-sm ${table === t ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
            {t.replace('_', ' ')}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button onClick={handleAdd} className="px-3 py-1 bg-green-600 text-white rounded-md text-sm">
            Add Row
          </button>
          <button onClick={load} className="px-3 py-1 bg-gray-200 rounded-md text-sm">
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg shadow-sm overflow-auto">
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-50">
              <tr>
                {rows.length > 0
                  ? Object.keys(rows[0]).map((k) => (
                      <th key={k} className="px-4 py-2 text-sm text-gray-600">
                        {k}
                      </th>
                    ))
                  : null}
                <th className="px-4 py-2 text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id ?? Math.random()} className="border-t">
                  {Object.keys(row).map((k) => (
                    <td key={k} className="px-4 py-3 text-sm text-gray-700">
                      {String((row as any)[k])}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(row)} className="px-2 py-1 bg-yellow-400 rounded-md text-xs">
                        Edit
                      </button>
                      {row.id ? (
                        <button onClick={() => handleDelete(row.id)} className="px-2 py-1 bg-red-500 text-white rounded-md text-xs">
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
