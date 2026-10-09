import { useCallback, useEffect, useState } from 'react'
import { Loader2, LogOut, Plus } from 'lucide-react'
import { AuthProvider, useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'
import { BUSINESS } from '../lib/config.js'
import LoginForm from '../components/admin/LoginForm.jsx'
import ProjectList from '../components/admin/ProjectList.jsx'
import ProjectForm from '../components/admin/ProjectForm.jsx'
import ReviewsAdmin from '../components/admin/ReviewsAdmin.jsx'

export default function AdminPage() {
  return (
    <AuthProvider>
      <Guard />
    </AuthProvider>
  )
}

function Guard() {
  const { session, loading, isAdmin, signOut } = useAuth()
  if (loading) return <div className="grid min-h-svh place-items-center"><Loader2 className="animate-spin" /></div>
  if (!session) return <LoginForm />
  if (!isAdmin) {
    return (
      <div className="grid min-h-svh place-items-center bg-soft px-4 text-center">
        <div>
          <p className="mb-4">Not authorized.</p>
          <button onClick={signOut} className="min-h-11 rounded-lg border border-line bg-white px-5 font-semibold">Sign out</button>
        </div>
      </div>
    )
  }
  return <Dashboard />
}

function Dashboard() {
  const { signOut } = useAuth()
  const [projects, setProjects] = useState([])
  const [editing, setEditing] = useState(null) // null closed, {} new, row edit
  const [error, setError] = useState('')
  const [tab, setTab] = useState('projects')

  const reload = useCallback(async () => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else { setProjects(data); setError('') }
  }, [])

  useEffect(() => { reload() }, [reload])

  return (
    <div className="min-h-svh bg-soft">
      <header className="bg-navy text-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <span className="font-bold">{BUSINESS.name} · Admin</span>
          <div className="flex items-center gap-4">
            <a href="/" className="text-white/80 hover:text-white">View site ↗</a>
            <button onClick={signOut} className="inline-flex min-h-11 items-center gap-2 hover:text-white/80"><LogOut size={18} aria-hidden="true" /> Log out</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        <div role="tablist" className="mb-4 flex gap-2">
          {[['projects', 'Projects'], ['reviews', 'Reviews']].map(([v, label]) => (
            <button key={v} type="button" role="tab" aria-selected={tab === v} onClick={() => setTab(v)}
              className={`min-h-11 rounded-full px-5 font-semibold ${tab === v ? 'bg-brand text-white' : 'border border-line bg-white'}`}>
              {label}
            </button>
          ))}
        </div>
        {tab === 'reviews' ? <ReviewsAdmin /> : <>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Projects ({projects.length})</h1>
          <button onClick={() => setEditing({})} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-5 font-semibold text-white hover:bg-brand-dark">
            <Plus size={18} aria-hidden="true" /> Add project
          </button>
        </div>
        {error && <p role="alert" className="mb-3 text-danger">{error}</p>}
        <ProjectList projects={projects} onEdit={setEditing} onChanged={reload} />
        </>}
      </main>
      <ProjectForm
        project={editing}
        onClose={() => setEditing(null)}
        onSaved={() => { setEditing(null); reload() }}
      />
    </div>
  )
}
