export function BillingSuccessPage() {
  return (
    <main className="page-wrap flex items-center justify-center min-h-[60vh]">
      <div className="island-shell w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-2">Payment Successful</h1>
        <p className="text-[var(--sea-ink-soft)] mb-6">
          Your payment has been processed successfully. A receipt has been sent to your email.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/billing"
            className="px-6 py-2.5 bg-[var(--lagoon)] text-white rounded-lg font-semibold hover:bg-[var(--lagoon-deep)] transition-colors"
          >
            Back to Dashboard
          </a>
          <a
            href="/billing/invoices"
            className="px-6 py-2.5 bg-[var(--surface-strong)] border border-[var(--line)] text-[var(--sea-ink)] rounded-lg font-semibold hover:bg-[var(--surface)] transition-colors"
          >
            View Invoices
          </a>
        </div>
      </div>
    </main>
  )
}

import { BillingParentRoute } from '../__root'
export const Route = BillingParentRoute.createChild({
  path: '/success',
  component: BillingSuccessPage,
})