"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { User } from '@supabase/supabase-js'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      if (data?.session?.user) setUser(data.session.user)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  async function signIn() {
    if (!email) return
    await supabase.auth.signInWithOtp({ email })
    alert('Check your email for a magic link')
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <div className="text-sm">Signed in as {user.email}</div>
          <button onClick={signOut} className="px-3 py-1 bg-red-600 text-white rounded-md text-sm">
            Sign out
          </button>
        </>
      ) : (
        <div className="flex gap-2 items-center">
          <input
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-2 py-1 border rounded-md text-sm"
          />
          <button onClick={signIn} className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
            Sign in
          </button>
        </div>
      )}
    </div>
  )
}
