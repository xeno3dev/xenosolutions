import { usePayPalAuth } from '@/lib/api'
import { useSession } from '@/lib/api'

export function PayPalSetupPage() {
  const { data: session } = useSession()
  const vendorId = session?.user?.vendor_id ?? undefined
  const { mutate: connectPayPal, isPending } = usePayPalAuth(vendorId)

  function handleConnect() {
    if (vendorId) {
      connectPayPal()
    }
  }

  return (
    <main className="page-wrap py-6">
      <div className="island-shell p-8 max-w-lg">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-2">PayPal Setup</h1>
        <p className="text-[var(--sea-ink-soft)] mb-6">
          Connect your PayPal account to accept payments from renters.
        </p>

        <button
          onClick={handleConnect}
          disabled={isPending || !vendorId}
          className="w-full py-3 bg-[#003087] hover:bg-[#001a5e] disabled:opacity-60 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-3"
        >
          {isPending ? (
            'Connecting…'
          ) : (
            <>
              <span className="fab fa-paypal text-lg" />
              Connect PayPal
            </>
          )}
        </button>

        {!vendorId && (
          <p className="mt-4 text-sm text-red-600 text-center">
            Vendor ID is required to connect PayPal.
          </p>
        )}
      </div>
    </main>
  )
}

import { BillingParentRoute } from '../__root'
export const Route = BillingParentRoute.createChild({
  path: '/paypal',
  component: PayPalSetupPage,
})