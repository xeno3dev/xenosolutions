import { usePayments } from '@/lib/api'
import { PageHeader, EmptyState } from '@/lib/components'
import { History } from 'lucide-react'
import { useSession } from '@/lib/api'

export function PaymentsPage() {
  const { data: session } = useSession()
  const vendorId = session?.user?.vendor_id ?? undefined
  const { data: payments, isLoading } = usePayments(vendorId)

  return (
    <main className="page-wrap py-6">
      <PageHeader title="Payments" description="View and track your payments" />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-[var(--lagoon)] border-t-transparent rounded-full" />
        </div>
      ) : payments && payments.length > 0 ? (
        <div className="island-shell overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--surface)] text-left text-sm text-[var(--sea-ink-soft)]">
              <tr>
                <th className="px-5 py-3 font-medium">Payment ID</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Provider</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-t border-[var(--line)] hover:bg-[var(--surface)] transition-colors">
                  <td className="px-5 py-3">
                    <a
                      href={`/billing/payments/${payment.id}`}
                      className="text-[var(--lagoon-deep)] font-medium hover:underline text-sm"
                    >
                      {payment.id}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-[var(--sea-ink)]">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                      payment.status === 'paid' ? 'bg-green-100 text-green-700' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                      payment.status === 'refunded' ? 'bg-gray-100 text-gray-600' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-[var(--sea-ink)] capitalize">{payment.provider}</td>
                  <td className="px-5 py-3 text-sm text-[var(--sea-ink-soft)]">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={<History className="h-12 w-12 text-[var(--sea-ink-soft)]" />}
          title="No Payments"
          description="No payments found for your account."
        />
      )}
    </main>
  )
}

import { BillingParentRoute } from '../__root'
export const Route = BillingParentRoute.createChild({
  path: '/payments',
  component: PaymentsPage,
})