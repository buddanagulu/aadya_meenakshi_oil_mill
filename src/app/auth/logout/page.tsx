"use client"
import React, { useEffect } from 'react'
import { supabase } from '../../../../src/lib/supabaseClient';
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      await supabase.auth.signOut()
      router.push('/')
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <div className="text-center">Signing out...</div>
      </div>
    </main>
  )
}
