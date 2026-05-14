import { cn } from '@/lib/utils'

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
}

export function StatCard({ title, value, change, changeType = 'neutral', icon }: StatCardProps) {
  return (
    <div className="island-shell p-5 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[var(--sea-ink-soft)]">{title}</span>
        {icon && <span className="h-5 w-5 text-[var(--lagoon)]">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-[var(--sea-ink)]">{value}</div>
      {change && (
        <div className={cn(
          'text-xs mt-1',
          changeType === 'positive' ? 'text-green-600' :
          changeType === 'negative' ? 'text-red-600' :
          'text-[var(--sea-ink-soft)]'
        )}>
          {change}
        </div>
      )}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  const styles = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    neutral: 'bg-gray-100 text-gray-600 border-gray-200',
  }

  return (
    <span className={cn(
      'text-xs font-medium px-2.5 py-1 rounded-full border capitalize',
      styles[variant],
      className
    )}>
      {children}
    </span>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  headerAction?: React.ReactNode
}

export function Card({ title, description, children, className, headerAction }: CardProps) {
  return (
    <div className={cn('island-shell rise-in p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--sea-ink)]">{title}</h3>
          {description && (
            <p className="text-sm text-[var(--sea-ink-soft)] mt-1">{description}</p>
          )}
        </div>
        {headerAction}
      </div>
      {children}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && <div className="h-12 w-12 text-[var(--sea-ink-soft)] mx-auto mb-4 opacity-50">{icon}</div>}
      <p className="text-[var(--sea-ink)] font-medium">{title}</p>
      {description && (
        <p className="text-sm text-[var(--sea-ink-soft)] mt-1">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ─── Page Header ──────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">{title}</h1>
        {description && (
          <p className="text-[var(--sea-ink-soft)] mt-1">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}