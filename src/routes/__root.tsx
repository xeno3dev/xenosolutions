import {
  createRootRoute,
  createRoute,
  Link,
  Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'
import Header from '../components/Header'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="stylesheet" href={appCss} />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <Header />
        <Outlet />
        <Footer />
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
          ]}
        />
      </body>
    </html>
  )
}

// ─── Index Route ────────────────────────────────────────────────────────────

export const IndexRoute = createRoute({
  getParentRoute: () => Route,
  path: '/',
  component: () => import('./routes/index').then(m => ({ default: m.Home })),
})

// ─── About Route ────────────────────────────────────────────────────────────

export const AboutRoute = createRoute({
  getParentRoute: () => Route,
  path: '/about',
  component: () => import('./routes/about').then(m => ({ default: m.About })),
})

// ─── Billing Layout (Protected) ─────────────────────────────────────────────
// All routes nested here require an authenticated session.

export const BillingParentRoute = createRoute({
  getParentRoute: () => Route,
  path: '/billing',
  component: () => import('./routes/billing/_layout').then(m => ({ default: m.BillingLayout })),
})

// ─── Billing Child Routes (protected, inside sidebar layout) ────────────────

export const BillingIndexRoute = BillingParentRoute.createChild({
  path: '/',
  component: () => import('./billing/index').then(m => ({ default: m.BillingHomePage })),
})

export const BillingSubscriptionRoute = BillingParentRoute.createChild({
  path: '/subscription',
  component: () => import('./billing/subscription').then(m => ({ default: m.SubscriptionPage })),
})

export const BillingInvoicesRoute = BillingParentRoute.createChild({
  path: '/invoices',
  component: () => import('./billing/invoices').then(m => ({ default: m.InvoicesPage })),
})

export const BillingInvoiceDetailRoute = BillingParentRoute.createChild({
  path: '/invoices/$invoiceId',
  component: () => import('./billing/invoices/$invoiceId').then(m => ({ default: m.InvoiceDetailPage })),
})

export const BillingPaymentsRoute = BillingParentRoute.createChild({
  path: '/payments',
  component: () => import('./billing/payments').then(m => ({ default: m.PaymentsPage })),
})

export const BillingPaymentDetailRoute = BillingParentRoute.createChild({
  path: '/payments/$paymentId',
  component: () => import('./billing/payments/$paymentId').then(m => ({ default: m.PaymentDetailPage })),
})

export const BillingPaypalRoute = BillingParentRoute.createChild({
  path: '/paypal',
  component: () => import('./billing/paypal').then(m => ({ default: m.PayPalSetupPage })),
})

export const BillingSettingsRoute = BillingParentRoute.createChild({
  path: '/settings',
  component: () => import('./billing/settings').then(m => ({ default: m.SettingsPage })),
})

export const BillingSuccessRoute = BillingParentRoute.createChild({
  path: '/success',
  component: () => import('./billing/success').then(m => ({ default: m.BillingSuccessPage })),
})

export const BillingCancelRoute = BillingParentRoute.createChild({
  path: '/cancel',
  component: () => import('./billing/cancel').then(m => ({ default: m.BillingCancelPage })),
})

export const BillingNotFoundRoute = BillingParentRoute.createChild({
  path: '/404',
  component: () => import('./billing/404').then(m => ({ default: m.BillingNotFoundPage })),
})

// ─── Auth Routes (UNPROTECTED — outside BillingParentRoute) ────────────────
// These pages sit at /billing/* but do NOT use the sidebar layout,
// so the auth guard in _layout.tsx does not block them.

export const BillingLoginRoute = createRoute({
  getParentRoute: () => Route,
  path: '/billing/login',
  component: () => import('./billing/login').then(m => ({ default: m.BillingLoginPage })),
})

export const BillingSignupRoute = createRoute({
  getParentRoute: () => Route,
  path: '/billing/signup',
  component: () => import('./billing/signup').then(m => ({ default: m.BillingSignupPage })),
})

export const BillingForgotPasswordRoute = createRoute({
  getParentRoute: () => Route,
  path: '/billing/forgot-password',
  component: () => import('./billing/forgot-password').then(m => ({ default: m.ForgotPasswordPage })),
})

export const BillingResetPasswordRoute = createRoute({
  getParentRoute: () => Route,
  path: '/billing/reset-password',
  component: () => import('./billing/reset-password').then(m => ({ default: m.ResetPasswordPage })),
})

// ─── Global 404 Catch-All ────────────────────────────────────────────────────

export const NotFoundRoute = createRoute({
  getParentRoute: () => Route,
  path: '/404',
  component: () => import('./routes/not-found').then(m => ({ default: m.NotFoundPage })),
})

import { CreditCard, Shield, FileText, History, Settings, LogOut } from 'lucide-react'
import { cn } from '../lib/utils'

export { CreditCard, Shield, FileText, History, Settings, LogOut, cn }