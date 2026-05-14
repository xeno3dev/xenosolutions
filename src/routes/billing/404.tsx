export function BillingNotFoundPage() {
  return (
    <main className="page-wrap flex items-center justify-center min-h-[60vh]">
      <div className="island-shell w-full max-w-md p-8 text-center">
        <h1 className="text-6xl font-bold text-[var(--sea-ink)] mb-2">404</h1>
        <h2 className="text-2xl font-bold text-[var(--sea-ink)] mb-2">Page Not Found</h2>
        <p className="text-[var(--sea-ink-soft)] mb-6">
          The page you're looking for doesn't exist in the billing portal.
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
  path: '/404',
  component: BillingNotFoundPage,
})