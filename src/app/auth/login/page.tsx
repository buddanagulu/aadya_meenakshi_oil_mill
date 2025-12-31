"use client"
import React, { useState } from 'react'
import supabase from '../../../../src/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push('/admin')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <div className="flex items-center justify-between">
            <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <a className="text-sm text-blue-600" href="/auth/register">
              Register
            </a>
          </div>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          Or sign in with a magic link:
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setLoading(true)
              await supabase.auth.signInWithOtp({ email })
              setLoading(false)
              alert('Check your email for a magic link')
            }}
            className="mt-2 flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-2 py-1 border rounded"
            />
            <button className="px-3 py-1 bg-gray-200 rounded">Magic link</button>
          </form>
        </div>
      </div>
    </main>
  )
}
