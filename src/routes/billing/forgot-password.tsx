import { useState } from 'react'
import { useForgotPassword } from '@/lib/api'
import { useNavigate } from '@tanstack/react-router'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { mutate: forgotPassword } = useForgotPassword()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    forgotPassword(email, {
      onSuccess: () => {
        setSuccess(true)
        setLoading(false)
      },
      onError: (err) => {
        setError(err.message || 'Failed to send reset email')
        setLoading(false)
      },
    })
  }

  if (success) {
    return (
      <main className="page-wrap flex items-center justify-center min-h-[60vh]">
        <div className="island-shell w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-2">Check Your Email</h1>
          <p className="text-[var(--sea-ink-soft)]">
            We've sent a password reset link to <strong>{email}</strong>.
          </p>
          <button
            onClick={() => navigate({ to: '/billing/login' })}
            className="mt-6 px-6 py-2.5 bg-[var(--lagoon)] text-white rounded-lg font-semibold hover:bg-[var(--lagoon-deep)] transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="page-wrap flex items-center justify-center min-h-[60vh]">
      <div className="island-shell w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-2">Reset Password</h1>
        <p className="text-sm text-[var(--sea-ink-soft)] mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[var(--lagoon)] text-white font-semibold hover:bg-[var(--lagoon-deep)] transition-colors disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-[var(--sea-ink-soft)]">
          <a href="/billing/login" className="text-[var(--lagoon-deep)] font-medium hover:underline">
            Back to Sign In
          </a>
        </p>
      </div>
    </main>
  )
}