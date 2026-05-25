import { useState, useMemo } from 'react'
import {
  TrendingUp, ShoppingBag, DollarSign, Star,
  ArrowUpRight, ArrowDownRight, Clock, Users,
  UtensilsCrossed, BarChart2,
} from 'lucide-react'
import {
  HOURLY_SALES, WEEKLY_REVENUE, CATEGORY_STATS,
  maxHourlyRevenue, totalTodayRevenue, totalTodayOrders, peakHour,
} from '../../utils/posAnalytics'
import { MOCK_ORDERS } from '../../utils/mockOrders'

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtRs  = (n) => `Rs. ${Number(n).toLocaleString('en-LK')}`
const fmtNum = (n) => Number(n).toLocaleString('en-LK')

// ── Derived analytics from MOCK_ORDERS ───────────────────────────────────────
const paidOrders   = MOCK_ORDERS.filter(o => o.paymentStatus === 'PAID')
const avgOrderVal  = paidOrders.length
  ? Math.round(paidOrders.reduce((s, o) => s + o.grandTotal, 0) / paidOrders.length)
  : 0

// Top items by quantity sold (from all orders)
const itemSalesMap = {}
MOCK_ORDERS.forEach(order => {
  order.items.forEach(item => {
    if (!itemSalesMap[item.name]) {
      itemSalesMap[item.name] = { name: item.name, category: item.category, qty: 0, revenue: 0 }
    }
    itemSalesMap[item.name].qty     += item.quantity
    itemSalesMap[item.name].revenue += item.subtotal
  })
})
const TOP_ITEMS = Object.values(itemSalesMap)
  .sort((a, b) => b.qty - a.qty)
  .slice(0, 8)

const maxItemQty = Math.max(...TOP_ITEMS.map(i => i.qty))

// Order type split
const dineInCount  = MOCK_ORDERS.filter(o => o.orderType === 'DINE_IN').length
const pickupCount  = MOCK_ORDERS.filter(o => o.orderType === 'PICKUP').length
const totalOrders  = MOCK_ORDERS.length

// Weekly max for bar scaling
const maxWeeklyRev = Math.max(...WEEKLY_REVENUE.map(d => d.revenue))

// ── Period tabs ───────────────────────────────────────────────────────────────
const PERIODS = ['Today', 'This Week', 'This Month']

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KPICard({ icon: Icon, label, value, sub, trend, trendUp, iconBg, iconColor, accentColor }) {
  return (
    <div className={`
      group relative
      bg-white dark:bg-gray-900
      rounded-2xl p-5
      border border-gray-100 dark:border-gray-800
      shadow-sm hover:shadow-lg hover:-translate-y-0.5
      transition-all duration-200 cursor-default overflow-hidden
    `}>
      {/* Accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentColor}
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="flex items-start justify-between gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                         transition-transform duration-300 group-hover:scale-110 ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0
                            ${trendUp
                              ? 'text-green-600 bg-green-500/10'
                              : 'text-red-500 bg-red-500/10'
                            }`}>
            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500
                      uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100
                      leading-tight tabular-nums">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
        )}
      </div>
    </div>
  )
}

// ── Weekly Revenue Bar Chart ──────────────────────────────────────────────────
function WeeklyChart() {
  const [hovered, setHovered] = useState(null)
  const maxRev = maxWeeklyRev

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5
                    border border-gray-100 dark:border-gray-800 shadow-sm h-full">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base">
            Weekly Revenue
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Mon – Sun · this week
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-400 dark:text-gray-500">Total</p>
          <p className="text-sm font-bold text-amber-500 tabular-nums">
            {fmtRs(WEEKLY_REVENUE.reduce((s, d) => s + d.revenue, 0))}
          </p>
        </div>
      </div>

      <div className="flex items-end gap-2 h-44">
        {WEEKLY_REVENUE.map((d, i) => {
          const pct       = maxRev > 0 ? Math.max(6, (d.revenue / maxRev) * 100) : 6
          const isHovered = hovered === i
          const isPeak    = d.revenue === maxRev
          return (
            <div
              key={d.day}
              className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group/bar"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -translate-y-full -mt-2 z-10
                                bg-gray-900 dark:bg-gray-700 text-white text-xs
                                rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl pointer-events-none">
                  <p className="font-bold">{d.day}</p>
                  <p className="text-amber-300">{fmtRs(d.revenue)}</p>
                </div>
              )}
              <div className="w-full flex items-end" style={{ height: '100%' }}>
                <div
                  className={`
                    w-full rounded-t-lg transition-all duration-300
                    ${isPeak
                      ? 'bg-amber-500 shadow-lg shadow-amber-500/30'
                      : isHovered
                        ? 'bg-amber-400'
                        : 'bg-amber-200 dark:bg-amber-900/50'
                    }
                  `}
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-600 font-medium">
                {d.day}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Hourly Heatmap ────────────────────────────────────────────────────────────
function HourlyHeatmap() {
  const max = maxHourlyRevenue

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5
                    border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base">
            Today's Hourly Activity
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Revenue intensity by hour
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 shrink-0">
          <Clock size={12} />
          Peak: <span className="font-bold text-amber-500">{peakHour.hour}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {HOURLY_SALES.map((h) => {
          const intensity = max > 0 ? h.revenue / max : 0
          // Map intensity to opacity class
          const bg = intensity > 0.85
            ? 'bg-amber-500 text-white'
            : intensity > 0.65
              ? 'bg-amber-400 text-white'
              : intensity > 0.45
                ? 'bg-amber-300 text-amber-900'
                : intensity > 0.25
                  ? 'bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'

          return (
            <div
              key={h.hour}
              title={`${h.hour}: ${fmtRs(h.revenue)} · ${h.orders} orders`}
              className={`
                flex flex-col items-center justify-center
                rounded-xl px-2 py-2 min-w-[52px] flex-1
                transition-transform duration-150 hover:scale-105 cursor-default
                ${bg}
              `}
            >
              <span className="text-[10px] font-bold leading-none">{h.hour}</span>
              <span className="text-[9px] mt-0.5 opacity-80 leading-none">{h.orders}×</span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <span className="text-[10px] text-gray-400 dark:text-gray-600">Low</span>
        <div className="flex gap-1 flex-1">
          {['bg-amber-100', 'bg-amber-200', 'bg-amber-300', 'bg-amber-400', 'bg-amber-500'].map(c => (
            <div key={c} className={`flex-1 h-2 rounded-sm ${c}`} />
          ))}
        </div>
        <span className="text-[10px] text-gray-400 dark:text-gray-600">High</span>
      </div>
    </div>
  )
}

// ── Top Items Table ───────────────────────────────────────────────────────────
function TopItemsTable() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl
                    border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base">
          Top Selling Items
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          Ranked by quantity sold today
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60
                           border-b border-gray-100 dark:border-gray-800">
              {['#', 'Item', 'Category', 'Qty Sold', 'Revenue', 'Share'].map(h => (
                <th key={h}
                  className="px-4 py-3 text-left text-[10px] font-bold
                             text-gray-400 dark:text-gray-500
                             uppercase tracking-widest whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {TOP_ITEMS.map((item, idx) => {
              const barPct = maxItemQty > 0 ? (item.qty / maxItemQty) * 100 : 0
              return (
                <tr key={item.name}
                  className="bg-white dark:bg-gray-900
                             hover:bg-amber-50/40 dark:hover:bg-gray-800/40
                             transition-colors duration-150">
                  <td className="px-4 py-3 text-xs font-bold text-gray-400 dark:text-gray-600 w-8">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full
                                     bg-amber-500/10 text-amber-600 dark:text-amber-400
                                     border border-amber-500/20 whitespace-nowrap">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                    {fmtNum(item.qty)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 tabular-nums whitespace-nowrap">
                    {fmtRs(item.revenue)}
                  </td>
                  <td className="px-4 py-3 w-32">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-600 tabular-nums w-8 text-right">
                        {Math.round(barPct)}%
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Order Type Split ──────────────────────────────────────────────────────────
function OrderTypeSplit() {
  const dineInPct  = totalOrders > 0 ? Math.round((dineInCount  / totalOrders) * 100) : 0
  const pickupPct  = totalOrders > 0 ? Math.round((pickupCount  / totalOrders) * 100) : 0

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5
                    border border-gray-100 dark:border-gray-800 shadow-sm h-full">
      <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
        Order Type Split
      </h2>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
        Dine-in vs Pick-up · all orders
      </p>

      {/* Visual donut via conic-gradient */}
      <div className="flex items-center justify-center mb-5">
        <div
          className="w-28 h-28 rounded-full"
          style={{
            background: `conic-gradient(
              #F59E0B 0% ${dineInPct}%,
              #6B7280 ${dineInPct}% 100%
            )`,
          }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full flex items-center justify-center
                          bg-white dark:bg-gray-900 scale-[0.62]">
            <div className="text-center">
              <p className="text-lg font-extrabold text-gray-900 dark:text-gray-100 leading-none">
                {totalOrders}
              </p>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                orders
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend rows */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Dine-in</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">
              {dineInCount}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1.5">
              ({dineInPct}%)
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-600 shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Pick-up</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">
              {pickupCount}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1.5">
              ({pickupPct}%)
            </span>
          </div>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="mt-4 h-2 rounded-full overflow-hidden flex">
        <div
          className="bg-amber-500 h-full transition-all duration-700"
          style={{ width: `${dineInPct}%` }}
        />
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-full" />
      </div>
    </div>
  )
}

// ── Category Revenue Breakdown ────────────────────────────────────────────────
function CategoryBreakdown() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5
                    border border-gray-100 dark:border-gray-800 shadow-sm h-full">
      <h2 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1">
        Sales by Category
      </h2>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
        Revenue distribution
      </p>

      <div className="flex flex-col gap-3.5">
        {CATEGORY_STATS.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cat.color}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {cat.name}
                </span>
              </div>
              <span className={`text-sm font-bold tabular-nums ${cat.textColor}`}>
                {cat.pct}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${cat.color}`}
                style={{ width: `${cat.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [activePeriod, setActivePeriod] = useState('Today')

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
            Reports
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Sales analytics and performance overview
          </p>
        </div>

        {/* Period selector */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 self-start sm:self-auto">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
                ${activePeriod === p
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }
              `}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          icon={DollarSign}
          label="Today's Revenue"
          value={fmtRs(totalTodayRevenue)}
          sub={`${totalTodayOrders} orders processed`}
          trend="+12%"
          trendUp={true}
          iconBg="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
          accentColor="bg-gradient-to-r from-green-400 to-emerald-500"
        />
        <KPICard
          icon={ShoppingBag}
          label="Total Orders"
          value={fmtNum(totalOrders)}
          sub={`${paidOrders.length} paid · ${totalOrders - paidOrders.length} pending`}
          trend="+5"
          trendUp={true}
          iconBg="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-400"
          accentColor="bg-gradient-to-r from-amber-400 to-orange-500"
        />
        <KPICard
          icon={TrendingUp}
          label="Avg Order Value"
          value={fmtRs(avgOrderVal)}
          sub="Per paid order"
          trend="+8%"
          trendUp={true}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          accentColor="bg-gradient-to-r from-blue-400 to-indigo-500"
        />
        <KPICard
          icon={Star}
          label="Peak Hour"
          value={peakHour.hour}
          sub={`${fmtRs(peakHour.revenue)} · ${peakHour.orders} orders`}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
          accentColor="bg-gradient-to-r from-purple-400 to-pink-500"
        />
      </div>

      {/* ── Weekly Chart + Order Type Split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-8">
          <WeeklyChart />
        </div>
        <div className="lg:col-span-4">
          <OrderTypeSplit />
        </div>
      </div>

      {/* ── Hourly Heatmap ── */}
      <HourlyHeatmap />

      {/* ── Top Items + Category Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-8">
          <TopItemsTable />
        </div>
        <div className="lg:col-span-4">
          <CategoryBreakdown />
        </div>
      </div>

    </div>
  )
}
