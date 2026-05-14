import { Outlet } from '@tanstack/react-router'
import { CreditCard, Settings, FileText, History, LogOut, Shield } from 'lucide-react'
import { useSession } from '@/lib/api'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { label: 'Dashboard', icon: CreditCard, to: '/billing' as const },
  { label: 'Subscription', icon: Shield, to: '/billing/subscription' as const },
  { label: 'Invoices', icon: FileText, to: '/billing/invoices' as const },
  { label: 'Payments', icon: History, to: '/billing/payments' as const },
  { label: 'PayPal Setup', icon: 'fab fa-paypal' as any, to: '/billing/paypal' as const },
  { label: 'Settings', icon: Settings, to: '/billing/settings' as const },
]

export function BillingLayout() {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  const user = session.user

  function handleLogout() {
    localStorage.removeItem('xeno_session')
    window.location.href = '/billing/login'
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      <aside className="w-64 border-r border-[var(--line)] bg-[var(--surface-strong)] flex flex-col">
        <div className="p-5 border-b border-[var(--line)]">
          <h2 className="text-lg font-bold text-[var(--sea-ink)] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
            XenoSolutions
          </h2>
          <p className="text-xs text-[var(--sea-ink-soft)] mt-1">Billing Portal</p>
        </div>

        <nav className="flex-1 py-3">
          {sidebarItems.map((item) => (
            <a
              key={item.to}
              href={item.to}
              className={cn(
                'w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors',
                window.location.pathname === item.to
                  ? 'text-[var(--lagoon-deep)] bg-[var(--hero-a)]'
                  : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] hover:bg-[var(--surface)]',
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="border-t border-[var(--line)] p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-[var(--lagoon)] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user.full_name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--sea-ink)] truncate">{user.full_name}</p>
              <p className="text-xs text-[var(--sea-ink-soft)] truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-[var(--sea-ink-soft)] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}