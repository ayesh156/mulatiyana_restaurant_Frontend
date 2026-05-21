import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Table2, Settings, UtensilsCrossed } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/pos/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pos/orders',    icon: ClipboardList,   label: 'Orders'    },
  { to: '/pos/tables',    icon: Table2,           label: 'Tables'    },
  { to: '/pos/settings',  icon: Settings,         label: 'Settings'  },
]

function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-gray-900 text-gray-300 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="h-16 flex items-center gap-2 px-5 border-b border-gray-700 text-white font-bold text-lg">
        <UtensilsCrossed size={20} className="text-amber-400" />
        POS System
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
               ${isActive
                 ? 'bg-amber-500 text-white'
                 : 'hover:bg-gray-800 hover:text-white'}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer hint */}
      <div className="px-5 py-4 text-xs text-gray-600 border-t border-gray-700">
        Use <kbd className="bg-gray-700 px-1 rounded">Tab</kbd> to navigate
      </div>
    </aside>
  )
}

export default function POSLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 focus:outline-none" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}
