import { StatCard } from '@/lib/components'
import { CreditCard, Users, DollarSign, TrendingUp } from 'lucide-react'

export function BillingHomePage() {
  return (
    <main className="page-wrap py-6">
      <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-6">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Subscriptions" value={12} change="+2 this month" changeType="positive" icon={<CreditCard className="h-5 w-5" />} />
        <StatCard title="Total Revenue" value="$24,500" change="+12.5% vs last month" changeType="positive" icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Active Users" value={843} change="+18 this week" changeType="positive" icon={<Users className="h-5 w-5" />} />
        <StatCard title="Monthly Growth" value="8.3%" change="+1.2% vs last month" changeType="positive" icon={<TrendingUp className="h-5 w-5" />} />
      </div>
    </main>
  )
}

import { BillingParentRoute } from '../__root'
export const Route = BillingParentRoute.createChild({
  path: '/',
  component: BillingHomePage,
})