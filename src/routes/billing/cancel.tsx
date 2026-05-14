export function BillingCancelPage() {
  return (
    <main className="page-wrap flex items-center justify-center min-h-[60vh]">
      <div className="island-shell w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-2">Payment Cancelled</h1>
        <p className="text-[var(--sea-ink-soft)] mb-6">
          Your payment was cancelled. No charges have been made.
        </p>
        <a
          href="/billing"
          className="inline-block px-6 py-2.5 bg-[var(--lagoon)] text-white rounded-lg font-semibold hover:bg-[var(--lagoon-deep)] transition-colors"
        >
          Back to Dashboard
        </a>
      </div>
    </main>
  )
}

import { BillingParentRoute } from '../__root'
export const Route = BillingParentRoute.createChild({
  path: '/cancel',
  component: BillingCancelPage,
})