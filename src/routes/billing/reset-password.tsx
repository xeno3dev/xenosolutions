import { useState } from 'react'
import { useResetPassword } from '@/lib/api'
import { useNavigate } from '@tanstack/react-router'
import { useSearch } from '@tanstack/react-router'

export function ResetPasswordPage() {
  const { token } = useSearch()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { mutate: resetPassword } = useResetPassword()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setError('')
    setLoading(true)
    resetPassword(
      { token: token!, new_password: password },
      {
        onSuccess: () => setSuccess(true),
        onError: (err) => {
          setError(err.message || 'Failed to reset password')
          setLoading(false)
        },
      },
    )
  }

  if (success) {
    return (
      <main className="page-wrap flex items-center justify-center min-h-[60vh]">
        <div className="island-shell w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-2">Password Reset</h1>
          <p className="text-[var(--sea-ink-soft)] mb-6">
            Your password has been successfully reset.
          </p>
          <button
            onClick={() => navigate({ to: '/billing/login' })}
            className="px-6 py-2.5 bg-[var(--lagoon)] text-white rounded-lg font-semibold hover:bg-[var(--lagoon-deep)] transition-colors"
          >
            Sign In
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="page-wrap flex items-center justify-center min-h-[60vh]">
      <div className="island-shell w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-2">Set New Password</h1>
        <p className="text-sm text-[var(--sea-ink-soft)] mb-6">
          Enter your new password below.
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--sea-ink)] mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 border border-[var(--line)] rounded-lg bg-white text-[var(--sea-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--sea-ink)] mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 border border-[var(--line)] rounded-lg bg-white text-[var(--sea-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[var(--lagoon)] text-white font-semibold hover:bg-[var(--lagoon-deep)] transition-colors disabled:opacity-60"
          >
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>
      </div>
    </main>
  )
}

import { BillingParentRoute } from '../__root'
export const Route = BillingParentRoute.createChild({
  path: '/reset-password',
  component: ResetPasswordPage,
})