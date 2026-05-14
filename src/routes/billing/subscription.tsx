import { useSubscription } from '@/lib/api'
import { BillingParentRoute } from '../__root'
import { EmptyState } from '@/lib/components'
import { Shield } from 'lucide-react'

export function SubscriptionPage() {
  const { data: session } = useSession()
  const vendorId = session?.user?.vendor_id ?? undefined
  const { data: subscription, isLoading } = useSubscription(vendorId)

  return (
    <main className="page-wrap py-6">
      <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-6">Subscription</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-[var(--lagoon)] border-t-transparent rounded-full" />
        </div>
      ) : subscription ? (
        <div className="space-y-6">
          <div className="island-shell p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--sea-ink)]">{subscription.plan_name}</h2>
                <p className="text-sm text-[var(--sea-ink-soft)]">
                  Status: <span className={`capitalize font-medium ${
                    subscription.status === 'active' ? 'text-green-600' :
                    subscription.status === 'past_due' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {subscription.status}
                  </span>
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                subscription.status === 'active' ? 'bg-green-100 text-green-700' :
                subscription.status === 'past_due' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {subscription.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[var(--sea-ink-soft)]">Current Period</p>
                <p className="font-medium text-[var(--sea-ink)]">
                  {new Date(subscription.current_period_start).toLocaleDateString()} — {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-[var(--sea-ink-soft)]">Plan ID</p>
                <p className="font-medium text-[var(--sea-ink)]">{subscription.plan_id}</p>
              </div>
              <div>
                <p className="text-[var(--sea-ink-soft)]">Renews At Period End</p>
                <p className="font-medium text-[var(--sea-ink)]">
                  {subscription.cancel_at_period_end ? 'Yes' : 'No'}
                </p>
              </div>
              {subscription.metadata?.external_id && (
                <div>
                  <p className="text-[var(--sea-ink-soft)]">External ID</p>
                  <p className="font-medium text-[var(--sea-ink)] font-mono text-sm">{subscription.metadata.external_id}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<Shield className="h-12 w-12 text-[var(--sea-ink-soft)]" />}
          title="No Subscription Found"
          description="You don't have an active subscription yet."
        />
      )}
    </main>
  )
}

import { useSession } from '@/lib/api'
import { BillingParentRoute } from '../__root'
export const Route = BillingParentRoute.createChild({
  path: '/subscription',
  component: SubscriptionPage,
})