// Keylo API Client & Auth for XenoSolutions Billing Portal
import { useQuery, useMutation } from '@tanstack/react-query'

const KEYLO_API_BASE = import.meta.env.VITE_KEYLO_API_URL || 'http://localhost:5000'

// ─── Auth & Session ───────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  full_name: string
  role: 'vendor' | 'renter'
  vendor_id: string | null
  avatar_url: string | null
  two_fa_enabled: boolean
}

export interface Session {
  session: {
    access_token: string
  }
  user: User
}

// Load session from localStorage
export function getSession(): Session | null {
  try {
    const stored = localStorage.getItem('xeno_session')
    if (!stored) return null
    const parsed = JSON.parse(stored)
    // Check token expiry
    if (parsed.session?.access_token) {
      const payload = JSON.parse(atob(parsed.session.access_token.split('.')[1]))
      if (payload.exp * 1000 < Date.now()) {
        clearSession()
        return null
      }
    }
    return parsed
  } catch {
    return null
  }
}

export function saveSession(session: Session) {
  localStorage.setItem('xeno_session', JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem('xeno_session')
}

// ─── API Client ───────────────────────────────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const session = getSession()
  return session?.session?.access_token
    ? { Authorization: `Bearer ${session.session.access_token}` }
    : {}
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${KEYLO_API_BASE}${path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(options.headers as Record<string, string>),
  }

  const response = await fetch(url, { ...options, headers })

  if (response.status === 401) {
    clearSession()
    window.location.href = '/billing/login'
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(error.error || error.message || 'API request failed')
  }

  return response.json() as Promise<T>
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string
  password: string
  vendor_id?: string
  registration_mode?: 'self' | 'vendor'
}

export interface SignupData {
  email: string
  password: string
  full_name: string
  phone?: string
  business_name?: string
  registration_mode?: 'self' | 'vendor'
  vendor_id?: string
  redirect_url?: string
}

export async function login(credentials: LoginCredentials): Promise<Session> {
  const response = await fetch(`${KEYLO_API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Login failed' }))
    throw new Error(error.error || 'Login failed')
  }

  const data = await response.json()
  saveSession(data)
  return data
}

export async function signup(data: SignupData): Promise<Session> {
  const endpoint = data.registration_mode === 'vendor'
    ? '/api/auth/signup'
    : '/api/auth/renters/signup'

  const response = await fetch(`${KEYLO_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Signup failed' }))
    throw new Error(error.error || 'Signup failed')
  }

  const result = await response.json()
  saveSession(result)
  return result
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' })
  } catch {
    // Ignore errors on logout
  }
  clearSession()
}

export async function forgotPassword(email: string): Promise<void> {
  await apiRequest('/api/auth/password-reset/request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function resetPassword(token: string, new_password: string): Promise<void> {
  await apiRequest('/api/auth/password-reset/confirm', {
    method: 'POST',
    body: JSON.stringify({ token, new_password }),
  })
}

// ─── User API ─────────────────────────────────────────────────────────────────

export function getMe() {
  return apiRequest<{ user: User }>('/api/auth/me')
}

// ─── Vendor Billing API ──────────────────────────────────────────────────────

export interface Subscription {
  id: string
  vendor_id: string
  plan_id: string
  plan_name: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
  metadata: Record<string, any>
}

export interface Invoice {
  id: string
  vendor_id: string
  subscription_id: string
  amount: number
  currency: string
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void'
  period_start: string
  period_end: string
  created_at: string
  updated_at: string
  lines: InvoiceLine[]
}

export interface InvoiceLine {
  id: string
  description: string
  amount: number
  quantity: number
  unit_amount: number
  type: 'recurring' | 'one_time' | 'usage'
}

export interface Payment {
  id: string
  vendor_id: string
  booking_id: string | null
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  provider: 'paypal' | 'square' | 'stripe'
  paypal_payment_id: string | null
  method: string
  created_at: string
  refund_amount?: number
  booking?: {
    start_date: string
    end_date: string
    vehicle: {
      make: string
      model: string
      license_plate: string
    }
    renter: {
      full_name: string
      email: string
    }
  }
}

export interface PayPalAuth {
  auth_url: string
}

export interface BillingPortal {
  url: string
}

// Get subscription for current vendor
export function getSubscription(vendorId: string) {
  return apiRequest<Subscription>(`/api/vendors/${vendorId}/billing/subscription`)
}

// Open billing portal for subscription management
export function openBillingPortal(vendorId: string) {
  return apiRequest<BillingPortal>(`/api/vendors/${vendorId}/billing/portal`, {
    method: 'POST',
  })
}

// List invoices
export function listInvoices(vendorId: string) {
  return apiRequest<Invoice[]>(`/api/vendors/${vendorId}/invoices`)
}

// Get single invoice
export function getInvoice(vendorId: string, invoiceId: string) {
  return apiRequest<Invoice>(`/api/vendors/${vendorId}/invoices/${invoiceId}`)
}

// List payments
export function listPayments(vendorId: string) {
  return apiRequest<Payment[]>(`/api/vendors/${vendorId}/payments`)
}

// Get single payment
export function getPayment(vendorId: string, paymentId: string) {
  return apiRequest<Payment>(`/api/vendors/${vendorId}/payments/${paymentId}`)
}

// Refund a payment
export function refundPayment(vendorId: string, paymentId: string, amount: number, reason: string) {
  return apiRequest<Payment>(`/api/vendors/${vendorId}/payments/${paymentId}/refund`, {
    method: 'POST',
    body: JSON.stringify({ amount, reason }),
  })
}

// PayPal OAuth connect
export function paypalOAuthConnect(vendorId: string) {
  return apiRequest<PayPalAuth>(`/api/vendors/${vendorId}/paypal/oauth/connect`)
}

// ─── React Query Hooks ───────────────────────────────────────────────────────

export function useSession() {
  return useQuery({
    queryKey: ['session'] as const,
    queryFn: getSession,
    staleTime: Infinity,
  })
}

export function useMe() {
  return useQuery({
    queryKey: ['me'] as const,
    queryFn: getMe,
    enabled: !!getSession(),
  })
}

export function useSubscription(vendorId: string | undefined) {
  return useQuery({
    queryKey: ['subscription', vendorId] as const,
    queryFn: () => getSubscription(vendorId!),
    enabled: !!vendorId,
  })
}

export function useInvoices(vendorId: string | undefined) {
  return useQuery({
    queryKey: ['invoices', vendorId] as const,
    queryFn: () => listInvoices(vendorId!),
    enabled: !!vendorId,
  })
}

export function usePayments(vendorId: string | undefined) {
  return useQuery({
    queryKey: ['payments', vendorId] as const,
    queryFn: () => listPayments(vendorId!),
    enabled: !!vendorId,
  })
}

export function usePayment(vendorId: string | undefined, paymentId: string | undefined) {
  return useQuery({
    queryKey: ['payment', vendorId, paymentId] as const,
    queryFn: () => getPayment(vendorId!, paymentId!),
    enabled: !!vendorId && !!paymentId,
  })
}

export function useInvoiceDetail(vendorId: string | undefined, invoiceId: string | undefined) {
  return useQuery({
    queryKey: ['invoice', vendorId, invoiceId] as const,
    queryFn: () => getInvoice(vendorId!, invoiceId!),
    enabled: !!vendorId && !!invoiceId,
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupData) => signup(data),
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, new_password }: { token: string; new_password: string }) =>
      resetPassword(token, new_password),
  })
}

export function usePayPalAuth(vendorId: string | undefined) {
  return useMutation({
    mutationFn: () => paypalOAuthConnect(vendorId!),
  })
}

export function useRefundPayment(vendorId: string | undefined) {
  return useMutation({
    mutationFn: ({ paymentId, amount, reason }: { paymentId: string; amount: number; reason: string }) =>
      refundPayment(vendorId!, paymentId, amount, reason),
  })
}