import { useState, useMemo, useRef } from 'react'
import {
  Search, Eye, Printer, X, Plus, Pencil, Trash2, AlertTriangle,
  CheckCircle2, XCircle, UtensilsCrossed,
  SlidersHorizontal, ChevronDown,
} from 'lucide-react'
import { MOCK_ORDERS } from '../../utils/mockOrders'
import SearchableSelect from '../../components/ui/SearchableSelect'
import ModernPagination from '../../components/ui/ModernPagination'
import InvoiceFormModal from './InvoiceFormModal'

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 8

const DATE_OPTIONS = [
  { value: 'all',       label: 'All Time'      },
  { value: 'today',     label: 'Today'         },
  { value: 'yesterday', label: 'Yesterday'     },
  { value: '7days',     label: 'Last 7 Days'   },
  { value: '30days',    label: 'Last 30 Days'  },
]

const PAYMENT_OPTIONS = [
  { value: 'all',    label: 'All Payments' },
  { value: 'PAID',   label: 'Paid'         },
  { value: 'UNPAID', label: 'Unpaid'       },
]

const TYPE_OPTIONS = [
  { value: 'all',     label: 'All Types' },
  { value: 'DINE_IN', label: 'Dine-in'  },
  { value: 'PICKUP',  label: 'Pick-up'  },
]

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function invNum(orderId) { return `INV-${String(orderId).padStart(3, '0')}` }

function formatDateTime(iso) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' }),
  }
}

function isInDateRange(iso, range) {
  const now  = new Date()
  const date = new Date(iso)
  const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  if (range === 'all')       return true
  if (range === 'today')     return date >= startOf(now)
  if (range === 'yesterday') {
    const y = new Date(now); y.setDate(y.getDate() - 1)
    return date >= startOf(y) && date < startOf(now)
  }
  if (range === '7days')  { const d = new Date(now); d.setDate(d.getDate() - 7);  return date >= d }
  if (range === '30days') { const d = new Date(now); d.setDate(d.getDate() - 30); return date >= d }
  return true
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT BADGE
// ─────────────────────────────────────────────────────────────────────────────
function PaymentBadge({ status }) {
  return status === 'PAID' ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                     bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
      <CheckCircle2 size={11} /> Paid
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                     bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
      <XCircle size={11} /> Unpaid
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE CONFIRMATION MODAL
// ─────────────────────────────────────────────────────────────────────────────
function DeleteModal({ order, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]
                    flex items-center justify-center p-4">
      <div className="rounded-2xl max-w-md w-full shadow-2xl border overflow-hidden
                      bg-white dark:bg-gray-900
                      border-gray-200 dark:border-gray-700/50">
        {/* Gradient danger header */}
        <div className="p-6 border-b
                        bg-gradient-to-r from-red-100 to-red-50
                        dark:from-red-600/20 dark:to-red-500/10
                        border-red-200 dark:border-red-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                            bg-red-100 dark:bg-red-500/20">
              <AlertTriangle size={22} className="text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Invoice</h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This action cannot be undone. The invoice will be permanently removed.
          </p>
          <p className="text-sm font-semibold p-3 rounded-xl border
                        text-gray-900 dark:text-white
                        bg-gray-100 dark:bg-gray-800/50
                        border-gray-200 dark:border-gray-700/50">
            {invNum(order.id)} — {order.customerName} · Rs.{' '}
            {order.grandTotal.toLocaleString('en-LK')}
          </p>
        </div>
        <div className="p-6 border-t border-gray-200 dark:border-gray-700/50 flex gap-3">
          <button onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm text-white
                       bg-gradient-to-r from-red-600 to-red-500
                       hover:from-red-700 hover:to-red-600
                       transition-all flex items-center justify-center gap-2">
            <Trash2 size={15} /> Delete
          </button>
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm border transition-colors
                       bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700
                       text-gray-900 dark:text-white border-gray-300 dark:border-gray-600/50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// INVOICE PREVIEW MODAL
// ─────────────────────────────────────────────────────────────────────────────
function InvoiceModal({ order, onClose }) {
  const printRef = useRef(null)
  const { date, time } = formatDateTime(order.createdAt)

  function handlePrint() {
    const content = printRef.current?.innerHTML
    if (!content) return
    const win = window.open('', '_blank', 'width=700,height=900')
    win.document.write(`
      <html><head><title>Invoice ${invNum(order.id)}</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 24px; color: #111; }
        .header { text-align: center; border-bottom: 2px solid #F59E0B; padding-bottom: 16px; margin-bottom: 16px; }
        .logo { font-size: 22px; font-weight: 800; color: #D97706; }
        .sub { font-size: 12px; color: #6B7280; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; margin: 12px 0; }
        th { background: #FEF3C7; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }
        td { padding: 8px 10px; border-bottom: 1px solid #F3F4F6; font-size: 13px; }
        .totals td { border: none; padding: 4px 10px; }
        .grand { font-weight: 800; font-size: 15px; color: #D97706; }
        .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .paid { background: #D1FAE5; color: #065F46; }
        .unpaid { background: #FEE2E2; color: #991B1B; }
        .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 12px; }
      </style></head><body>${content}</body></html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 400)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50
                    flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border
                      border-gray-200 dark:border-gray-700/50
                      w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0
                        border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              Invoice {invNum(order.id)}
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {date} · {time}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable invoice body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div ref={printRef}>

            {/* Receipt header */}
            <div className="header text-center border-b-2 border-amber-400 pb-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <UtensilsCrossed size={20} className="text-amber-500" />
                <span className="logo text-xl font-extrabold text-amber-600">
                  Senari Chinese Hotel
                </span>
              </div>
              <p className="sub text-xs text-gray-500 dark:text-gray-400">
                Authentic Chinese Cuisine · Pay at Counter
              </p>
              <p className="sub text-xs text-gray-400 dark:text-gray-500 mt-1">
                Senari Chinese Hotel, Sri Lanka
              </p>
            </div>

            {/* Invoice meta */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4 text-xs">
              {[
                ['Invoice',    invNum(order.id)],
                ['Order',      order.orderNumber],
                ['Date',       date],
                ['Time',       time],
                ['Customer',   order.customerName],
                ['Phone',      order.customerPhone],
                ['Order Type', order.orderType === 'DINE_IN' ? 'Dine-in' : 'Pick-up'],
                ['Payment',    order.paymentStatus],
              ].map(([label, val]) => (
                <div key={label} className="flex gap-1">
                  <span className="text-gray-400 dark:text-gray-500 shrink-0">{label}:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">{val}</span>
                </div>
              ))}
            </div>

            {/* Items table */}
            <table className="w-full text-xs mb-3">
              <thead>
                <tr className="bg-amber-50 dark:bg-amber-900/20">
                  {['Item', 'Qty', 'Unit Price', 'Total'].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-bold text-gray-600 dark:text-gray-400
                                           uppercase tracking-wide text-[10px]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td className="px-3 py-2 font-medium text-gray-800 dark:text-gray-200">
                      {item.name}
                    </td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400 tabular-nums">
                      ×{item.quantity}
                    </td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400 tabular-nums">
                      Rs. {item.unitPrice.toLocaleString('en-LK')}
                    </td>
                    <td className="px-3 py-2 font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
                      Rs. {item.subtotal.toLocaleString('en-LK')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1.5">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="tabular-nums">Rs. {order.subtotal.toLocaleString('en-LK')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-xs text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span className="tabular-nums">− Rs. {order.discountAmount.toLocaleString('en-LK')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold
                              text-amber-600 dark:text-amber-400 pt-1
                              border-t border-dashed border-amber-200 dark:border-amber-800">
                <span>Grand Total</span>
                <span className="tabular-nums">Rs. {order.grandTotal.toLocaleString('en-LK')}</span>
              </div>
            </div>

            {/* Footer */}
            <p className="footer text-center text-xs text-gray-400 dark:text-gray-600
                          border-t border-gray-100 dark:border-gray-800 pt-3 mt-4">
              Thank you for dining with us! · © 2026 Senari Chinese Hotel
            </p>
          </div>
        </div>

        {/* Action bar */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                       bg-gradient-to-r from-amber-500 to-orange-500
                       text-white rounded-xl font-medium text-sm
                       hover:opacity-90 transition-opacity shadow-md shadow-amber-500/20"
          >
            <Printer size={15} /> Print Invoice
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-medium text-sm border transition-colors
                       bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                       text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function InvoicesPage() {
  // Local orders list — starts from mock data, new invoices prepended on save
  const [orders,              setOrders]              = useState(MOCK_ORDERS)
  const [search,              setSearch]              = useState('')
  const [dateFilter,          setDateFilter]          = useState('all')
  const [paymentFilter,       setPaymentFilter]       = useState('all')
  const [typeFilter,          setTypeFilter]          = useState('all')
  const [page,                setPage]                = useState(1)
  const [activeInvoice,       setActiveInvoice]       = useState(null)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showForm,            setShowForm]            = useState(false)
  const [editOrder,           setEditOrder]           = useState(null)   // order being edited
  const [delOrder,            setDelOrder]            = useState(null)   // order pending delete

  // Next ID = max existing id + 1
  const nextId = useMemo(() => Math.max(...orders.map(o => o.id)) + 1, [orders])

  // Create — prepend
  function handleSaveInvoice(newOrder) {
    setOrders(prev => [newOrder, ...prev])
  }

  // Update — replace in-place, preserve sort position
  function handleUpdateInvoice(updated) {
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
  }

  // Delete — remove by id, clamp page
  function handleDeleteInvoice(id) {
    setOrders(prev => prev.filter(o => o.id !== id))
    setDelOrder(null)
    resetPage()
  }

  // ── Filtered + sorted invoices (newest first) ─────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter(o => {
        const matchSearch  = !q ||
          invNum(o.id).toLowerCase().includes(q) ||
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q)
        const matchDate    = isInDateRange(o.createdAt, dateFilter)
        const matchPayment = paymentFilter === 'all' || o.paymentStatus === paymentFilter
        const matchType    = typeFilter === 'all' || o.orderType === typeFilter
        return matchSearch && matchDate && matchPayment && matchType
      })
  }, [orders, search, dateFilter, paymentFilter, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const pageItems  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function resetPage() { setPage(1) }

  const hasAdvancedFilters = dateFilter !== 'all' || typeFilter !== 'all'
  const hasAnyFilter       = search || dateFilter !== 'all' || paymentFilter !== 'all' || typeFilter !== 'all'

  function clearAll() {
    setSearch(''); setDateFilter('all'); setPaymentFilter('all')
    setTypeFilter('all'); resetPage()
  }

  // Summary stats
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'PAID')
    .reduce((s, o) => s + o.grandTotal, 0)
  const paidCount   = orders.filter(o => o.paymentStatus === 'PAID').length
  const unpaidCount = orders.filter(o => o.paymentStatus === 'UNPAID').length

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {orders.length} total · {paidCount} paid · {unpaidCount} unpaid
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Revenue summary pill */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl
                          bg-amber-500/10 border border-amber-500/20 shrink-0">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Total Revenue:
            </span>
            <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
              Rs. {totalRevenue.toLocaleString('en-LK')}
            </span>
          </div>
          {/* Add Invoice button */}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
                       bg-gradient-to-r from-orange-500 to-red-500 text-white
                       hover:opacity-90 transition-opacity shadow-md shadow-orange-500/20 shrink-0"
          >
            <Plus size={16} /> Add Invoice
          </button>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="p-3 sm:p-4 rounded-2xl border
                      bg-white dark:bg-gray-800/30
                      border-gray-200 dark:border-gray-700/50">
        <div className="flex flex-col gap-3">

          {/* ── Row 1: Search + 2 primary filters + More Options toggle ── */}
          <div className="flex flex-wrap items-center gap-2">

            {/* Search — grows to fill available space */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 min-w-[200px]
                            bg-gray-50 dark:bg-gray-800/50
                            border-gray-200 dark:border-gray-700/50">
              <Search size={15} className="text-gray-400 dark:text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="Search by Invoice ID, Order ID, or Customer…"
                value={search}
                onChange={e => { setSearch(e.target.value); resetPage() }}
                className="bg-transparent border-none outline-none flex-1 min-w-0 text-sm
                           text-gray-900 dark:text-white
                           placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              {search && (
                <button onClick={() => { setSearch(''); resetPage() }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Primary filter 1: Payment Status */}
            <SearchableSelect
              options={PAYMENT_OPTIONS}
              value={paymentFilter}
              onChange={v => { setPaymentFilter(v); resetPage() }}
              placeholder="All Payments"
              searchPlaceholder="Search status…"
              triggerClassName="w-40"
            />

            {/* Primary filter 2: Date Range */}
            <SearchableSelect
              options={DATE_OPTIONS}
              value={dateFilter}
              onChange={v => { setDateFilter(v); resetPage() }}
              placeholder="All Time"
              searchPlaceholder="Search range…"
              triggerClassName="w-36"
            />

            {/* More Options toggle */}
            <button
              onClick={() => setShowAdvancedFilters(v => !v)}
              aria-expanded={showAdvancedFilters}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                          border transition-all duration-150 shrink-0
                          ${showAdvancedFilters || hasAdvancedFilters
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700'
                          }`}
            >
              <SlidersHorizontal size={13} />
              More Options
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Clear all */}
            {hasAnyFilter && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                           bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                           text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700
                           transition-colors shrink-0"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          {/* ── Row 2: Advanced filters (animated expand) ── */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out
                        ${showAdvancedFilters ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 shrink-0">
                More filters:
              </span>

              {/* Advanced filter: Order Type */}
              <SearchableSelect
                options={TYPE_OPTIONS}
                value={typeFilter}
                onChange={v => { setTypeFilter(v); resetPage() }}
                placeholder="All Types"
                searchPlaceholder="Search type…"
                triggerClassName="w-36"
              />
            </div>
          </div>

          {/* Active filter summary */}
          {hasAnyFilter && (
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Showing {filtered.length} of {orders.length} invoices
            </p>
          )}
        </div>
      </div>

      {/* ── Data table ── */}
      <div className="rounded-2xl border overflow-hidden
                      bg-white dark:bg-gray-900
                      border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-gray-800/60
                             border-gray-200 dark:border-gray-700/50">
                {['Invoice', 'Date & Time', 'Customer', 'Type', 'Total', 'Payment', 'Actions'].map(h => (
                  <th key={h}
                    className="px-4 py-3 text-left text-[11px] font-bold
                               text-gray-400 dark:text-gray-500
                               uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center">
                    <p className="text-sm font-medium text-gray-400 dark:text-gray-600">
                      No invoices match your filters
                    </p>
                  </td>
                </tr>
              ) : pageItems.map(order => {
                const { date, time } = formatDateTime(order.createdAt)
                return (
                  <tr key={order.id}
                    className="bg-white dark:bg-gray-900
                               hover:bg-amber-50/50 dark:hover:bg-gray-800/30
                               transition-colors duration-150">
                    {/* Invoice ID */}
                    <td className="px-4 py-3">
                      <p className="font-bold text-amber-500 whitespace-nowrap">
                        {invNum(order.id)}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-600">
                        {order.orderNumber}
                      </p>
                    </td>
                    {/* Date & Time */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-gray-800 dark:text-gray-200 font-medium">{date}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{time}</p>
                    </td>
                    {/* Customer */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {order.customerPhone}
                      </p>
                    </td>
                    {/* Type */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full
                                        text-xs font-medium border
                                        ${order.orderType === 'DINE_IN'
                                          ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                                        }`}>
                        {order.orderType === 'DINE_IN' ? 'Dine-in' : 'Pick-up'}
                      </span>
                    </td>
                    {/* Total */}
                    <td className="px-4 py-3 font-bold tabular-nums whitespace-nowrap
                                   text-gray-900 dark:text-gray-100">
                      Rs. {order.grandTotal.toLocaleString('en-LK')}
                    </td>
                    {/* Payment */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <PaymentBadge status={order.paymentStatus} />
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* View / Print */}
                        <button
                          onClick={() => setActiveInvoice(order)}
                          aria-label={`View invoice ${invNum(order.id)}`}
                          title="View / Print"
                          className="p-2 rounded-xl transition-colors
                                     text-gray-400 dark:text-gray-500
                                     hover:text-amber-600 dark:hover:text-amber-400
                                     hover:bg-amber-50 dark:hover:bg-amber-500/10"
                        >
                          <Eye size={15} />
                        </button>
                        {/* Edit */}
                        <button
                          onClick={() => setEditOrder(order)}
                          aria-label={`Edit invoice ${invNum(order.id)}`}
                          title="Edit"
                          className="p-2 rounded-xl transition-colors
                                     text-gray-400 dark:text-gray-500
                                     hover:text-blue-600 dark:hover:text-blue-400
                                     hover:bg-blue-50 dark:hover:bg-blue-500/10"
                        >
                          <Pencil size={15} />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => setDelOrder(order)}
                          aria-label={`Delete invoice ${invNum(order.id)}`}
                          title="Delete"
                          className="p-2 rounded-xl transition-colors
                                     text-gray-400 dark:text-gray-500
                                     hover:text-red-600 dark:hover:text-red-400
                                     hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Modern Pagination ── */}
        <ModernPagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={PAGE_SIZE}
          onPageChange={p => setPage(p)}
        />
      </div>

      {/* ── Invoice Preview Modal ── */}
      {activeInvoice && (
        <InvoiceModal
          order={activeInvoice}
          onClose={() => setActiveInvoice(null)}
        />
      )}

      {/* ── Add Invoice Wizard ── */}
      {showForm && (
        <InvoiceFormModal
          nextId={nextId}
          onClose={() => setShowForm(false)}
          onSave={handleSaveInvoice}
        />
      )}

      {/* ── Edit Invoice Wizard ── */}
      {editOrder && (
        <InvoiceFormModal
          initialOrder={editOrder}
          nextId={nextId}
          onClose={() => setEditOrder(null)}
          onSave={handleUpdateInvoice}
        />
      )}

      {/* ── Delete Confirmation ── */}
      {delOrder && (
        <DeleteModal
          order={delOrder}
          onConfirm={() => handleDeleteInvoice(delOrder.id)}
          onCancel={() => setDelOrder(null)}
        />
      )}
    </div>
  )
}
