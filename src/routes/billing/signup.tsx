import { useState } from 'react'
import { useSignup } from '@/lib/api'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export function BillingSignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { mutate: signup } = useSignup()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    signup(
      { email, password, full_name: fullName },
      {
        onSuccess: () => navigate({ to: '/billing' }),
        onError: (err) => setError(err.message || 'Signup failed'),
        onSettled: () => setLoading(false),
      },
    )
  }

  return (
    <main className="page-wrap flex items-center justify-center min-h-[60vh]">
      <div className="island-shell w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-2">Create Account</h1>
        <p className="text-sm text-[var(--sea-ink-soft)] mb-6">
          Sign up for a XenoSolutions billing account.
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-[var(--sea-ink)] mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-[var(--line)] rounded-lg bg-white text-[var(--sea-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--sea-ink)] mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-[var(--line)] rounded-lg bg-white text-[var(--sea-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--sea-ink)] mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-[var(--line)] rounded-lg bg-white text-[var(--sea-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full py-2.5 rounded-lg text-white font-semibold transition-colors',
              loading ? 'bg-[var(--lagoon)]/60 cursor-not-allowed' : 'bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)]',
            )}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-[var(--sea-ink-soft)]">
          Already have an account?{' '}
          <a href="/billing/login" className="text-[var(--lagoon-deep)] font-medium hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </main>
  )
}

import { BillingParentRoute } from '../__root'
export const Route = BillingParentRoute.createChild({
  path: '/signup',
  component: BillingSignupPage,
})