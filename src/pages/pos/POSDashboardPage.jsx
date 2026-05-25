import { useState } from 'react'
import {
  DollarSign, ShoppingBag, ChefHat, UtensilsCrossed,
  TrendingUp, ArrowUpRight, Clock,
} from 'lucide-react'
import {
  MOCK_ORDERS,
  todayRevenue, pendingCount, preparingCount, completedCount, dineInActive,
} from '../../utils/mockOrders'
import {
  HOURLY_SALES, CATEGORY_STATS,
  maxHourlyRevenue, totalTodayOrders,
} from '../../utils/posAnalytics'
import ModernPagination from '../../components/ui/ModernPagination'

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 8

// ─────────────────────────────────────────────────────────────────────────────
// STATUS / TYPE CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:   {
    label: 'Pending',
    badge: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    dot:   'bg-amber-500',
  },
  PREPARING: {
    label: 'Preparing',
    badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    dot:   'bg-blue-400',
  },
  READY:     {
    label: 'Ready',
    badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    dot:   'bg-purple-400',
  },
  COMPLETED: {
    label: 'Completed',
    badge: 'bg-green-500/10 text-green-400 border border-green-500/20',
    dot:   'bg-green-400',
  },
}

const TYPE_CONFIG = {
  PICKUP:  {
    label: 'Pick-up',
    badge: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
  },
  DINE_IN: {
    label: 'Dine-in',
    badge: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// METRIC CARD
// ─────────────────────────────────────────────────────────────────────────────
function MetricCard({ icon: Icon, label, value, sub, trend, iconBg, iconColor, accentBar }) {
  return (
    <div className={`
      group relative
      bg-amber-50 dark:bg-gray-800
      rounded-2xl p-5
      border border-amber-100 dark:border-gray-700
      shadow-md dark:shadow-sm overflow-hidden
      transition-all duration-300 ease-out
      hover:shadow-xl hover:-translate-y-1
      hover:border-amber-200 dark:hover:border-gray-600
      cursor-default
    `}>
      {/* Accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentBar}
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="flex items-start justify-between gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                         transition-transform duration-300 group-hover:scale-110 ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-green-500
                           bg-green-500/10 px-2 py-0.5 rounded-full shrink-0">
            <ArrowUpRight size={12} />
            {trend}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500
                      uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight
                      tabular-nums">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SALES OVERVIEW — Pure Tailwind CSS Bar Chart
// ─────────────────────────────────────────────────────────────────────────────
function SalesOverviewChart() {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6
                    border border-gray-100 dark:border-gray-800 shadow-sm h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base">
            Sales Overview
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Hourly revenue — today
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-400 dark:text-gray-500">Total</p>
          <p className="text-sm font-bold text-amber-500 tabular-nums">
            Rs. {HOURLY_SALES.reduce((s, h) => s + h.revenue, 0).toLocaleString('en-LK')}
          </p>
        </div>
      </div>

      {/* Chart area */}
      <div className="relative">
        {/* Y-axis guide lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
          {[100, 75, 50, 25, 0].map(pct => (
            <div key={pct} className="flex items-center gap-2">
              <span className="text-[10px] text-gray-300 dark:text-gray-700 w-8 text-right shrink-0 tabular-nums">
                {pct > 0 ? `${Math.round(maxHourlyRevenue * pct / 100 / 100) * 100}` : '0'}
              </span>
              <div className="flex-1 border-t border-dashed border-gray-100 dark:border-gray-800" />
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="flex items-end gap-1 sm:gap-1.5 pl-10 pb-8 h-52 sm:h-60">
          {HOURLY_SALES.map((h, i) => {
            const heightPct = maxHourlyRevenue > 0
              ? Math.max(4, (h.revenue / maxHourlyRevenue) * 100)
              : 4
            const isHovered = hovered === i
            const isPeak    = h.revenue === maxHourlyRevenue

            return (
              <div
                key={h.hour}
                className="flex-1 flex flex-col items-center gap-1 group/bar cursor-pointer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Tooltip */}
                <div className={`
                  absolute -translate-y-full -mt-2 z-10
                  bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg
                  px-2.5 py-1.5 whitespace-nowrap shadow-xl pointer-events-none
                  transition-all duration-150
                  ${isHovered ? 'opacity-100 -translate-y-full' : 'opacity-0 translate-y-0'}
                `}>
                  <p className="font-bold">{h.hour}</p>
                  <p className="text-amber-300">Rs. {h.revenue.toLocaleString('en-LK')}</p>
                  <p className="text-gray-400">{h.orders} orders</p>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2
                                  border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                </div>

                {/* Bar */}
                <div className="w-full flex items-end" style={{ height: '100%' }}>
                  <div
                    className={`
                      w-full rounded-t-md transition-all duration-300 ease-out
                      ${isPeak
                        ? 'bg-amber-500 shadow-lg shadow-amber-500/30'
                        : isHovered
                          ? 'bg-amber-400'
                          : 'bg-amber-200 dark:bg-amber-900/50'
                      }
                      ${isHovered ? 'scale-x-110' : ''}
                    `}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>

                {/* X-axis label */}
                <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-600
                                 font-medium whitespace-nowrap rotate-0 leading-none">
                  {h.hour.replace(' ', '')}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-amber-500" />
          <span className="text-xs text-gray-400 dark:text-gray-500">Peak hour</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-amber-200 dark:bg-amber-900/50" />
          <span className="text-xs text-gray-400 dark:text-gray-500">Regular</span>
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <TrendingUp size={12} className="text-green-500" />
          <span>{totalTodayOrders} orders today</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// POPULAR CATEGORIES — Progress Meter Rows
// ─────────────────────────────────────────────────────────────────────────────
function PopularCategories() {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6
                    border border-gray-100 dark:border-gray-800 shadow-sm h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base">
          Popular Categories
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          Sales distribution by category
        </p>
      </div>

      {/* Category rows */}
      <div className="flex flex-col gap-4">
        {CATEGORY_STATS.map((cat, i) => (
          <div
            key={cat.name}
            className="group/cat cursor-default"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Label row */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cat.color}
                                 transition-transform duration-200
                                 ${hovered === i ? 'scale-125' : ''}`} />
                <span className={`text-sm font-medium transition-colors duration-200
                                  ${hovered === i
                                    ? 'text-gray-900 dark:text-gray-100'
                                    : 'text-gray-600 dark:text-gray-400'
                                  }`}>
                  {cat.name}
                </span>
              </div>
              <span className={`text-sm font-bold tabular-nums transition-colors duration-200
                                ${cat.textColor}`}>
                {cat.pct}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${cat.color}
                             ${hovered === i ? 'opacity-100' : 'opacity-70'}`}
                style={{ width: `${cat.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Donut-style summary ring (pure CSS) */}
      <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-center gap-3">
          {/* Segmented ring using conic-gradient via inline style — only exception per RULES */}
          <div
            className="w-20 h-20 rounded-full shrink-0"
            style={{
              background: `conic-gradient(
                #F59E0B 0% 38%,
                #3B82F6 38% 64%,
                #A855F7 64% 82%,
                #14B8A6 82% 94%,
                #EC4899 94% 100%
              )`,
            }}
            aria-hidden="true"
          >
            {/* Inner hole */}
            <div className="w-full h-full rounded-full flex items-center justify-center
                            bg-white dark:bg-gray-900 scale-[0.65]">
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 text-center leading-tight">
                5<br/>cats
              </span>
            </div>
          </div>

          {/* Mini legend */}
          <div className="flex flex-col gap-1.5">
            {CATEGORY_STATS.slice(0, 3).map(cat => (
              <div key={cat.name} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full shrink-0 ${cat.color}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{cat.name}</span>
                <span className={`text-xs font-bold ml-auto pl-2 ${cat.textColor}`}>{cat.pct}%</span>
              </div>
            ))}
            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">
              +{CATEGORY_STATS.length - 3} more categories
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status]
  if (!cfg) return null
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                      text-xs font-semibold ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function TypeBadge({ type }) {
  const cfg = TYPE_CONFIG[type]
  if (!cfg) return null
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full
                      text-xs font-medium ${cfg.badge}`}>
      {cfg.label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TIME FORMATTER
// ─────────────────────────────────────────────────────────────────────────────
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-LK', {
    hour: '2-digit', minute: '2-digit',
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDER TABLE
// ─────────────────────────────────────────────────────────────────────────────
function OrderTable({ orders }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/60
                         border-b border-gray-100 dark:border-gray-800">
            {['Order', 'Time', 'Type', 'Customer', 'Items', 'Total', 'Status'].map(h => (
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
          {orders.map(order => (
            <tr key={order.id}
              className="bg-white dark:bg-gray-900
                         hover:bg-amber-50/40 dark:hover:bg-gray-800/40
                         transition-colors duration-150">
              <td className="px-4 py-3 font-bold text-amber-500 whitespace-nowrap">
                {order.orderNumber}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <Clock size={12} className="shrink-0" />
                  {formatTime(order.createdAt)}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <TypeBadge type={order.orderType} />
              </td>
              <td className="px-4 py-3">
                <p className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {order.customerName}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {order.customerPhone}
                </p>
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </td>
              <td className="px-4 py-3 font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap tabular-nums">
                Rs. {order.grandTotal.toLocaleString('en-LK')}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <StatusBadge status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function POSDashboardPage() {
  const liveOrders = MOCK_ORDERS.filter(o => o.status !== 'COMPLETED')
  const doneOrders = MOCK_ORDERS.filter(o => o.status === 'COMPLETED')
  const prepQueue  = pendingCount + preparingCount

  const [livePage, setLivePage] = useState(1)
  const [donePage, setDonePage] = useState(1)

  const liveTotalPages = Math.max(1, Math.ceil(liveOrders.length / ITEMS_PER_PAGE))
  const doneTotalPages = Math.max(1, Math.ceil(doneOrders.length / ITEMS_PER_PAGE))

  const livePageItems = liveOrders.slice((livePage - 1) * ITEMS_PER_PAGE, livePage * ITEMS_PER_PAGE)
  const donePageItems = doneOrders.slice((donePage - 1) * ITEMS_PER_PAGE, donePage * ITEMS_PER_PAGE)

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Real-time overview of today's operations
          </p>
        </div>
        {/* Live indicator */}
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20
                        px-3 py-1.5 rounded-full shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-green-500 uppercase tracking-widest">
            Live
          </span>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          icon={DollarSign}
          label="Today's Revenue"
          value={`Rs. ${todayRevenue.toLocaleString('en-LK')}`}
          sub="From paid orders"
          trend="+12%"
          iconBg="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
          accentBar="bg-gradient-to-r from-green-400 to-emerald-500"
        />
        <MetricCard
          icon={ShoppingBag}
          label="Total Orders"
          value={MOCK_ORDERS.length}
          sub={`${completedCount} completed`}
          trend="+5"
          iconBg="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-400"
          accentBar="bg-gradient-to-r from-amber-400 to-orange-500"
        />
        <MetricCard
          icon={ChefHat}
          label="Prep Queue"
          value={prepQueue}
          sub={`${pendingCount} pending · ${preparingCount} cooking`}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          accentBar="bg-gradient-to-r from-blue-400 to-indigo-500"
        />
        <MetricCard
          icon={UtensilsCrossed}
          label="Active Dine-ins"
          value={dineInActive}
          sub="Tables currently occupied"
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
          accentBar="bg-gradient-to-r from-purple-400 to-pink-500"
        />
      </div>

      {/* ── Analytics Split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Left — Sales Overview Chart */}
        <div className="lg:col-span-8">
          <SalesOverviewChart />
        </div>
        {/* Right — Popular Categories */}
        <div className="lg:col-span-4">
          <PopularCategories />
        </div>
      </div>

      {/* ── Live Incoming Web Orders ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <h2 className="font-bold text-gray-900 dark:text-gray-100">
            Live Incoming Orders
          </h2>
          <span className="text-xs font-semibold text-amber-500
                           bg-amber-500/10 border border-amber-500/20
                           px-2.5 py-0.5 rounded-full">
            {liveOrders.length} active
          </span>
        </div>

        {liveOrders.length > 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl
                          border border-gray-100 dark:border-gray-800 overflow-hidden">
            <OrderTable orders={livePageItems} />
            <ModernPagination
              currentPage={livePage}
              totalPages={liveTotalPages}
              totalItems={liveOrders.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setLivePage}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl
                          border border-gray-100 dark:border-gray-800
                          p-12 text-center">
            <TrendingUp size={32} className="mx-auto mb-3 text-gray-300 dark:text-gray-700" />
            <p className="font-medium text-gray-400 dark:text-gray-500">
              No active orders right now
            </p>
          </div>
        )}
      </div>

      {/* ── Completed Orders ── */}
      {doneOrders.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="font-bold text-gray-900 dark:text-gray-100">
              Completed Today
            </h2>
            <span className="text-xs font-semibold text-green-500
                             bg-green-500/10 border border-green-500/20
                             px-2.5 py-0.5 rounded-full">
              {doneOrders.length} orders
            </span>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl
                          border border-gray-100 dark:border-gray-800 overflow-hidden">
            <OrderTable orders={donePageItems} />
            <ModernPagination
              currentPage={donePage}
              totalPages={doneTotalPages}
              totalItems={doneOrders.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setDonePage}
            />
          </div>
        </div>
      )}

    </div>
  )
}
