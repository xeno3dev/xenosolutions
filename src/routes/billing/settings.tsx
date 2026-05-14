export function SettingsPage() {
  return (
    <main className="page-wrap py-6">
      <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-6">Settings</h1>

      <div className="island-shell p-6">
        <h2 className="text-lg font-semibold text-[var(--sea-ink)] mb-4">Account Settings</h2>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Manage your profile, notification preferences, and security settings.
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[var(--line)]">
            <div>
              <p className="font-medium text-[var(--sea-ink)]">Email Notifications</p>
              <p className="text-sm text-[var(--sea-ink-soft)]">Receive email updates about your billing activity</p>
            </div>
            <button className="px-4 py-1.5 bg-[var(--surface-strong)] border border-[var(--line)] rounded-lg text-sm font-medium text-[var(--sea-ink)] hover:bg-[var(--surface)] transition-colors">
              Configure
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[var(--line)]">
            <div>
              <p className="font-medium text-[var(--sea-ink)]">Two-Factor Authentication</p>
              <p className="text-sm text-[var(--sea-ink-soft)]">Add an extra layer of security to your account</p>
            </div>
            <button className="px-4 py-1.5 bg-[var(--surface-strong)] border border-[var(--line)] rounded-lg text-sm font-medium text-[var(--sea-ink)] hover:bg-[var(--surface)] transition-colors">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-[var(--sea-ink)]">Danger Zone</p>
              <p className="text-sm text-red-500">Deactivate or delete your account</p>
            </div>
            <button className="px-4 py-1.5 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition-colors">
              Deactivate
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

import { BillingParentRoute } from '../__root'
export const Route = BillingParentRoute.createChild({
  path: '/settings',
  component: SettingsPage,
})