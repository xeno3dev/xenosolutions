import { useInvoices } from '@/lib/api'
import { EmptyState, PageHeader } from '@/lib/components'
import { FileText } from 'lucide-react'
import { useSession } from '@/lib/api'

export function InvoicesPage() {
  const { data: session } = useSession()
  const vendorId = session?.user?.vendor_id ?? undefined
  const { data: invoices, isLoading } = useInvoices(vendorId)

  return (
    <main className="page-wrap py-6">
      <PageHeader title="Invoices" description="View and download your invoices" />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-[var(--lagoon)] border-t-transparent rounded-full" />
        </div>
      ) : invoices && invoices.length > 0 ? (
        <div className="island-shell overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--surface)] text-left text-sm text-[var(--sea-ink-soft)]">
              <tr>
                <th className="px-5 py-3 font-medium">Invoice</th>
                <th className="px-5 py-3 font-medium">Period</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-t border-[var(--line)] hover:bg-[var(--surface)] transition-colors">
                  <td className="px-5 py-3">
                    <a
                      href={`/billing/invoices/${invoice.id}`}
                      className="text-[var(--lagoon-deep)] font-medium hover:underline text-sm"
                    >
                      {invoice.id}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-sm text-[var(--sea-ink-soft)]">
                    {new Date(invoice.period_start).toLocaleDateString()} — {new Date(invoice.period_end).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-[var(--sea-ink)]">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                      invoice.status === 'open' ? 'bg-blue-100 text-blue-700' :
                      invoice.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={<FileText className="h-12 w-12 text-[var(--sea-ink-soft)]" />}
          title="No Invoices"
          description="No invoices found for your account."
        />
      )}
    </main>
  )
}

import { BillingParentRoute } from '../__root'
export const Route = BillingParentRoute.createChild({
  path: '/invoices',
  component: InvoicesPage,
})