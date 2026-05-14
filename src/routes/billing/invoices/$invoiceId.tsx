import { useInvoiceDetail, useInvoices } from '@/lib/api'
import { EmptyState, PageHeader } from '@/lib/components'
import { FileText, ArrowLeft, Download } from 'lucide-react'
import { useSession } from '@/lib/api'
import { useParams } from '@tanstack/react-router'

export function InvoiceDetailPage() {
  const { invoiceId } = useParams({ from: '/billing/invoices/$invoiceId' })
  const { data: session } = useSession()
  const vendorId = session?.user?.vendor_id ?? undefined
  const { data: invoice, isLoading } = useInvoiceDetail(vendorId!, invoiceId)

  if (isLoading) {
    return (
      <main className="page-wrap py-6 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[var(--lagoon)] border-t-transparent rounded-full" />
      </main>
    )
  }

  if (!invoice) {
    return (
      <main className="page-wrap py-6">
        <EmptyState
          icon={<FileText className="h-12 w-12 text-[var(--sea-ink-soft)]" />}
          title="Invoice Not Found"
          description="The invoice you're looking for doesn't exist."
          action={
            <a href="/billing/invoices" className="text-[var(--lagoon-deep)] font-medium hover:underline">
              ← Back to Invoices
            </a>
          }
        />
      </main>
    )
  }

  return (
    <main className="page-wrap py-6">
      <div className="flex items-center gap-2 mb-6">
        <a href="/billing/invoices" className="text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] transition-colors">
          <ArrowLeft className="h-4 w-4 inline mr-1" />
          Back to Invoices
        </a>
      </div>

      <div className="island-shell p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Invoice #{invoice.id}</h1>
            <p className="text-sm text-[var(--sea-ink-soft)]">
              {new Date(invoice.created_at).toLocaleDateString()}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
            invoice.status === 'open' ? 'bg-blue-100 text-blue-700' :
            invoice.status === 'draft' ? 'bg-gray-100 text-gray-600' :
            'bg-red-100 text-red-700'
          }`}>
            {invoice.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="text-[var(--sea-ink-soft)]">Period</p>
            <p className="font-medium text-[var(--sea-ink)]">
              {new Date(invoice.period_start).toLocaleDateString()} — {new Date(invoice.period_end).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-[var(--sea-ink-soft)]">Amount</p>
            <p className="font-medium text-[var(--sea-ink)] text-lg">${invoice.amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[var(--sea-ink-soft)]">Currency</p>
            <p className="font-medium text-[var(--sea-ink)]">{invoice.currency.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-[var(--sea-ink-soft)]">Booking</p>
            {invoice.booking ? (
              <p className="font-medium text-[var(--sea-ink)]">
                {invoice.booking.vehicle.make} {invoice.booking.vehicle.model} ({invoice.booking.vehicle.license_plate})
              </p>
            ) : (
              <p className="font-medium text-[var(--sea-ink-soft)]">N/A</p>
            )}
          </div>
        </div>

        {invoice.lines && invoice.lines.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-[var(--sea-ink)] mb-3">Line Items</h2>
            <div className="island-shell overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-[var(--surface)] text-left text-xs text-[var(--sea-ink-soft)]">
                  <tr>
                    <th className="px-4 py-2 font-medium">Description</th>
                    <th className="px-4 py-2 font-medium">Qty</th>
                    <th className="px-4 py-2 font-medium">Unit Price</th>
                    <th className="px-4 py-2 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lines.map((line) => (
                    <tr key={line.id} className="border-t border-[var(--line)]">
                      <td className="px-4 py-2 text-sm text-[var(--sea-ink)]">{line.description}</td>
                      <td className="px-4 py-2 text-sm text-[var(--sea-ink-soft)]">{line.quantity}</td>
                      <td className="px-4 py-2 text-sm text-[var(--sea-ink)]">${line.unit_amount.toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm text-[var(--sea-ink-soft)] capitalize">{line.type.replace('_', ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {invoice.booking && invoice.booking.renter && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-[var(--sea-ink)] mb-2">Renter</h2>
            <div className="island-shell p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[var(--lagoon)] flex items-center justify-center text-white text-sm font-bold">
                {invoice.booking.renter.full_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--sea-ink)]">{invoice.booking.renter.full_name}</p>
                <p className="text-xs text-[var(--sea-ink-soft)]">{invoice.booking.renter.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[var(--lagoon)] text-white rounded-lg font-medium hover:bg-[var(--lagoon-deep)] transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>
    </main>
  )
}

import { BillingParentRoute } from '../__root'
export const Route = BillingParentRoute.createChild({
  path: '/invoices/$invoiceId',
  component: InvoiceDetailPage,
})