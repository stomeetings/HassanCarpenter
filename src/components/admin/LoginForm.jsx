import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { BUSINESS } from '../../lib/config.js'

export default function LoginForm() {
  const { signIn } = useAuth()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setPending(true)
    setError('')
    const { error } = await signIn(f.get('email'), f.get('password'))
    if (error) setError(error.message)
    setPending(false)
  }

  const input = 'mt-1 min-h-11 w-full rounded-lg border border-line px-3'
  return (
    <div className="grid min-h-svh place-items-center bg-soft px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm">
        <div className="text-center">
          <p className="text-lg font-bold">{BUSINESS.name}</p>
          <p className="text-muted">Admin Login</p>
        </div>
        <label className="block text-sm font-medium">Email
          <input name="email" type="email" required autoComplete="username" className={input} />
        </label>
        <label className="block text-sm font-medium">Password
          <input name="password" type="password" required autoComplete="current-password" className={input} />
        </label>
        <button disabled={pending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending && <Loader2 size={18} className="animate-spin" aria-hidden="true" />} Sign in
        </button>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      </form>
    </div>
  )
}
