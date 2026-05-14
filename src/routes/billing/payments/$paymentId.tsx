import { usePayment } from '@/lib/api'
import { EmptyState, PageHeader } from '@/lib/components'
import { History, ArrowLeft } from 'lucide-react'
import { useSession } from '@/lib/api'
import { useParams } from '@tanstack/react-router'

export function PaymentDetailPage() {
  const { paymentId } = useParams({ from: '/billing/payments/$paymentId' })
  const { data: session } = useSession()
  const vendorId = session?.user?.vendor_id ?? undefined
  const { data: payment, isLoading } = usePayment(vendorId!, paymentId)

  if (isLoading) {
    return (
      <main className="page-wrap py-6 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[var(--lagoon)] border-t-transparent rounded-full" />
      </main>
    )
  }

  if (!payment) {
    return (
      <main className="page-wrap py-6">
        <EmptyState
          icon={<History className="h-12 w-12 text-[var(--sea-ink-soft)]" />}
          title="Payment Not Found"
          description="The payment you're looking for doesn't exist."
          action={
            <a href="/billing/payments" className="text-[var(--lagoon-deep)] font-medium hover:underline">
              ← Back to Payments
            </a>
          }
        />
      </main>
    )
  }

  return (
    <main className="page-wrap py-6">
      <div className="flex items-center gap-2 mb-6">
        <a href="/billing/payments" className="text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] transition-colors">
          <ArrowLeft className="h-4 w-4 inline mr-1" />
          Back to Payments
        </a>
      </div>

      <div className="island-shell p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Payment #{payment.id}</h1>
            <p className="text-sm text-[var(--sea-ink-soft)]">
              {new Date(payment.created_at).toLocaleDateString()}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            payment.status === 'paid' ? 'bg-green-100 text-green-700' :
            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            payment.status === 'failed' ? 'bg-red-100 text-red-700' :
            payment.status === 'refunded' ? 'bg-gray-100 text-gray-600' :
            'bg-blue-100 text-blue-700'
          }`}>
            {payment.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="text-[var(--sea-ink-soft)]">Amount</p>
            <p className="font-medium text-[var(--sea-ink)] text-lg">${payment.amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[var(--sea-ink-soft)]">Currency</p>
            <p className="font-medium text-[var(--sea-ink)]">{payment.currency.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-[var(--sea-ink-soft)]">Provider</p>
            <p className="font-medium text-[var(--sea-ink)] capitalize">{payment.provider}</p>
          </div>
          <div>
            <p className="text-[var(--sea-ink-soft)]">Method</p>
            <p className="font-medium text-[var(--sea-ink)]">{payment.method}</p>
          </div>
          {payment.booking && (
            <>
              <div>
                <p className="text-[var(--sea-ink-soft)]">Booking Vehicle</p>
                <p className="font-medium text-[var(--sea-ink)]">
                  {payment.booking.vehicle.make} {payment.booking.vehicle.model} ({payment.booking.vehicle.license_plate})
                </p>
              </div>
              <div>
                <p className="text-[var(--sea-ink-soft)]">Renter</p>
                <p className="font-medium text-[var(--sea-ink)]">{payment.booking.renter.full_name}</p>
              </div>
              <div>
                <p className="text-[var(--sea-ink-soft)]">Booking Period</p>
                <p className="font-medium text-[var(--sea-ink)] text-sm">
                  {new Date(payment.booking.start_date).toLocaleDateString()} — {new Date(payment.booking.end_date).toLocaleDateString()}
                </p>
              </div>
            </>
          )}
          {payment.refund_amount != null && (
            <div>
              <p className="text-[var(--sea-ink-soft)]">Refund Amount</p>
              <p className="font-medium text-red-600">-${payment.refund_amount.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

import { BillingParentRoute } from '../__root'
export const Route = BillingParentRoute.createChild({
  path: '/payments/$paymentId',
  component: PaymentDetailPage,
})