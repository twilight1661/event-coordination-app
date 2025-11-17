import React, { useEffect, useState } from 'react'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import { supabase } from './supabaseClient'

export default function App() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    // ✅ Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // ✅ Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Event Coordination App</h1>

        {!session ? <Auth /> : <Dashboard session={session} />}
      </div>
    </div>
  )
}
