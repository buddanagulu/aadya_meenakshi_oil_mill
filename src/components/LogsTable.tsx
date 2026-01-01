"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

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

interface LogsTableProps {
  initialTable?: TableKey
  showTabs?: boolean
}

export default function LogsTable({ initialTable = 'production_logs', showTabs = true }: LogsTableProps) {
  const [table, setTable] = useState<TableKey>(initialTable)
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [modalContent, setModalContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    setTable(initialTable)
  }, [initialTable])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table])

  async function getAccessToken() {
    try {
      const { data } = await supabase.auth.getSession()
      return data?.session?.access_token ?? null
    } catch {
      return null
    }
  }

  async function load() {
    setLoading(true)
    const token = await getAccessToken()
    try {
      const res = await fetch(`/api/admin/${table}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to fetch')
      }
      const json = await res.json()
      setRows(json.data ?? [])
    } catch (e: unknown) {
      console.error(e)
      setRows([])
    }
    setLoading(false)
  }

  async function handleAdd() {
    setModalMode('add')
    setModalContent('{}')
    setEditingId(null)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this row?')) return
    try {
      const token = await getAccessToken()
      const res = await fetch(`/api/admin/${table}/${id}`, {
        method: 'DELETE',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      })
      if (!res.ok) {
        throw new Error((await res.text()) || 'Failed to delete')
      }
      await load()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      alert('Error: ' + msg)
    }
  }

  async function handleEdit(row: Record<string, unknown>) {
    setModalMode('edit')
    setModalContent(JSON.stringify(row, null, 2))
    setEditingId(String(row.id))
    setModalOpen(true)
  }

  async function handleModalSave() {
    try {
      const obj = JSON.parse(modalContent)
      const token = await getAccessToken()
      if (modalMode === 'add') {
        const res = await fetch(`/api/admin/${table}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(obj),
        })
        if (!res.ok) throw new Error(await res.text())
      } else if (modalMode === 'edit' && editingId) {
        const res = await fetch(`/api/admin/${table}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(obj),
        })
        if (!res.ok) throw new Error(await res.text())
      }
      setModalOpen(false)
      await load()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      alert('Error: ' + msg)
    }
  }

  return (
    <section>
      <div className="flex gap-2 flex-wrap items-center">
        {showTabs && tableList.map((t) => (
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
                <tr key={String(row.id) ?? Math.random()} className="border-t">
                  {Object.keys(row).map((k) => (
                    <td key={k} className="px-4 py-3 text-sm text-gray-700">
                      {String(row[k])}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(row)} className="px-2 py-1 bg-yellow-400 rounded-md text-xs">
                        Edit
                      </button>
                      {row.id ? (
                        <button onClick={() => handleDelete(String(row.id))} className="px-2 py-1 bg-red-500 text-white rounded-md text-xs">
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-full max-w-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">{modalMode === 'add' ? 'Add Row' : 'Edit Row'}</h3>
              <div className="flex gap-2">
                <button onClick={() => setModalOpen(false)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                <button onClick={handleModalSave} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
              </div>
            </div>
            <textarea value={modalContent} onChange={(e) => setModalContent(e.target.value)} rows={12} className="w-full p-2 border rounded text-sm font-mono" />
          </div>
        </div>
      )}
    </section>
  )
}
