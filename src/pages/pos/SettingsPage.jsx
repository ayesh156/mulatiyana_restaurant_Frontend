import { useState } from 'react'
import {
  Store, Clock3, SlidersHorizontal,
  Save, CheckCircle2,
} from 'lucide-react'
import { useTheme } from '../../utils/ThemeContext'

// ─────────────────────────────────────────────────────────────────────────────
// TAB CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'general',     label: 'General',             icon: Store            },
  { id: 'hours',       label: 'Business Hours',       icon: Clock3           },
  { id: 'preferences', label: 'System Preferences',   icon: SlidersHorizontal },
]

const DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
]

// ─────────────────────────────────────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

/** Labelled text / email / tel / url input */
function Field({ label, type = 'text', value, onChange, placeholder, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400
                        uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl text-sm
                   bg-white dark:bg-gray-800
                   border border-gray-200 dark:border-gray-700
                   text-gray-900 dark:text-gray-100
                   placeholder:text-gray-400 dark:placeholder:text-gray-600
                   focus:outline-none focus:ring-2 focus:ring-amber-400/40
                   transition-colors"
      />
      {hint && <p className="text-xs text-gray-400 dark:text-gray-600">{hint}</p>}
    </div>
  )
}

/** Textarea field */
function TextareaField({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400
                        uppercase tracking-wide">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl text-sm resize-none
                   bg-white dark:bg-gray-800
                   border border-gray-200 dark:border-gray-700
                   text-gray-900 dark:text-gray-100
                   placeholder:text-gray-400 dark:placeholder:text-gray-600
                   focus:outline-none focus:ring-2 focus:ring-amber-400/40
                   transition-colors"
      />
    </div>
  )
}

/** Pill toggle switch */
function Toggle({ checked, onChange, label, sub }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3
                    border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-amber-400/40
                    ${checked ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-700'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow
                          transition-transform duration-200
                          ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

/** Section card wrapper */
function Section({ title, sub, children }) {
  return (
    <div className="bg-amber-50 dark:bg-gray-800
                    rounded-2xl border border-amber-100 dark:border-gray-700
                    shadow-md dark:shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-amber-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{title}</h3>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  )
}

/** Save button with transient success state */
function SaveButton({ onSave, saved }) {
  return (
    <button
      onClick={onSave}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
                  shadow-md transition-all duration-200
                  ${saved
                    ? 'bg-green-500 text-white shadow-green-500/20'
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                  }`}
    >
      {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
      {saved ? 'Saved!' : 'Save Changes'}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: GENERAL
// ─────────────────────────────────────────────────────────────────────────────
function GeneralTab() {
  const [form, setForm] = useState({
    name:    'Mulatiyana Restaurant',
    phone:   '+94 77 123 4567',
    email:   'hello@mulatiyana.lk',
    address: '42 Galle Road, Mulatiyana, Southern Province, Sri Lanka',
    tagline: 'Authentic Sri Lankan Flavours',
  })
  const [saved, setSaved] = useState(false)

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }))

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex flex-col gap-5">
      <Section title="Restaurant Identity" sub="Basic information shown to customers">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Restaurant Name" value={form.name}    onChange={set('name')}    placeholder="e.g. Mulatiyana Restaurant" />
            <Field label="Tagline"         value={form.tagline} onChange={set('tagline')} placeholder="e.g. Authentic Sri Lankan Flavours" />
          </div>
          <TextareaField label="Address" value={form.address} onChange={set('address')} placeholder="Full address…" rows={2} />
        </div>
      </Section>

      <Section title="Contact Details" sub="Used for customer communications">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone"  type="tel"   value={form.phone} onChange={set('phone')} placeholder="+94 77 000 0000" />
          <Field label="Email"  type="email" value={form.email} onChange={set('email')} placeholder="hello@restaurant.lk" />
        </div>
      </Section>

      <div className="flex justify-end">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: BUSINESS HOURS
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_HOURS = DAYS.map(day => ({
  day,
  open:  !['Sunday'].includes(day),
  from:  '08:00',
  to:    '21:00',
}))

function BusinessHoursTab() {
  const [hours, setHours] = useState(DEFAULT_HOURS)
  const [saved, setSaved] = useState(false)

  function toggleDay(idx) {
    setHours(prev => prev.map((h, i) => i === idx ? { ...h, open: !h.open } : h))
  }
  function setTime(idx, key, val) {
    setHours(prev => prev.map((h, i) => i === idx ? { ...h, [key]: val } : h))
  }
  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  // Shared time input classes
  const timeCls = `px-3 py-2 rounded-xl text-sm w-28
                   bg-white dark:bg-gray-900
                   border border-gray-200 dark:border-gray-700
                   text-gray-900 dark:text-gray-100
                   dark:[color-scheme:dark]
                   focus:outline-none focus:ring-2 focus:ring-amber-400/40
                   transition-colors disabled:opacity-40 disabled:cursor-not-allowed`

  return (
    <div className="flex flex-col gap-5">
      <Section
        title="Weekly Schedule"
        sub="Set opening and closing times for each day"
      >
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700/60">
          {hours.map((h, idx) => (
            <div key={h.day}
              className="flex flex-wrap items-center gap-3 py-3
                         first:pt-0 last:pb-0">
              {/* Day + toggle */}
              <div className="flex items-center gap-3 w-36 shrink-0">
                <button
                  role="switch"
                  aria-checked={h.open}
                  onClick={() => toggleDay(idx)}
                  className={`relative w-9 h-5 rounded-full shrink-0 transition-colors duration-200
                              focus:outline-none focus:ring-2 focus:ring-amber-400/40
                              ${h.open ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow
                                    transition-transform duration-200
                                    ${h.open ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <span className={`text-sm font-medium transition-colors
                                  ${h.open
                                    ? 'text-gray-900 dark:text-gray-100'
                                    : 'text-gray-400 dark:text-gray-600'
                                  }`}>
                  {h.day}
                </span>
              </div>

              {/* Time range */}
              {h.open ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="time"
                    value={h.from}
                    onChange={e => setTime(idx, 'from', e.target.value)}
                    className={timeCls}
                  />
                  <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">to</span>
                  <input
                    type="time"
                    value={h.to}
                    onChange={e => setTime(idx, 'to', e.target.value)}
                    className={timeCls}
                  />
                </div>
              ) : (
                <span className="text-xs font-semibold text-red-400 dark:text-red-500
                                 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full
                                 border border-red-200 dark:border-red-800">
                  Closed
                </span>
              )}
            </div>
          ))}
        </div>
      </Section>

      <div className="flex justify-end">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: SYSTEM PREFERENCES
// ─────────────────────────────────────────────────────────────────────────────
function SystemPreferencesTab() {
  const { theme, toggleTheme } = useTheme()
  const [prefs, setPrefs] = useState({
    autoAccept:  false,
    orderSound:  true,
    emailAlerts: true,
    compactView: false,
  })
  const [saved, setSaved] = useState(false)

  const set = (key) => (val) => setPrefs(f => ({ ...f, [key]: val }))

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <div className="flex flex-col gap-5">
      <Section title="Order Management" sub="Control how new orders are handled">
        <div className="flex flex-col">
          <Toggle
            checked={prefs.autoAccept}
            onChange={set('autoAccept')}
            label="Auto-accept new online orders"
            sub="Orders will move to Preparing immediately without manual confirmation"
          />
          <Toggle
            checked={prefs.orderSound}
            onChange={set('orderSound')}
            label="Play sound on new order"
            sub="An audio alert plays when a new order arrives"
          />
          <Toggle
            checked={prefs.emailAlerts}
            onChange={set('emailAlerts')}
            label="Email alerts for new orders"
            sub="Send a notification email to the admin address"
          />
        </div>
      </Section>

      <Section title="Display" sub="Appearance and layout preferences">
        <div className="flex flex-col">
          {/* Dark mode — wired to real ThemeContext */}
          <Toggle
            checked={isDark}
            onChange={toggleTheme}
            label="Dark Mode"
            sub="Toggle between light and dark interface themes"
          />
          <Toggle
            checked={prefs.compactView}
            onChange={set('compactView')}
            label="Compact table view"
            sub="Reduce row height in order and menu tables"
          />
        </div>
      </Section>

      <Section title="Data & Privacy" sub="Manage local data">
        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Cart and session data is stored locally in your browser.
            Clearing it will not affect orders already submitted.
          </p>
          <button
            className="self-start px-4 py-2 rounded-xl text-xs font-semibold
                       text-red-600 dark:text-red-400
                       bg-red-50 dark:bg-red-900/20
                       border border-red-200 dark:border-red-800
                       hover:bg-red-100 dark:hover:bg-red-900/40
                       transition-colors"
          >
            Clear Local Cache
          </button>
        </div>
      </Section>

      <div className="flex justify-end">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

  const CONTENT = {
    general:     <GeneralTab />,
    hours:       <BusinessHoursTab />,
    preferences: <SystemPreferencesTab />,
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
          Manage your restaurant configuration and preferences
        </p>
      </div>

      {/* ── Layout: tab rail (left) + content (right) ── */}
      <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-start">

        {/* ── Tab rail ── */}
        <nav className="w-full md:w-52 shrink-0 flex flex-row md:flex-col gap-1
                        bg-amber-50 dark:bg-gray-800
                        rounded-2xl border border-amber-100 dark:border-gray-700
                        shadow-md dark:shadow-sm p-2
                        overflow-x-auto md:overflow-x-visible hide-scrollbar">
          {TABS.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                  text-sm font-medium whitespace-nowrap
                  transition-all duration-150 w-full text-left shrink-0
                  ${active
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : `text-gray-600 dark:text-gray-400
                       hover:bg-white dark:hover:bg-gray-700
                       hover:text-gray-900 dark:hover:text-white`
                  }
                `}
              >
                <Icon size={16} className="shrink-0" />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* ── Content area ── */}
        <div className="flex-1 min-w-0">
          {CONTENT[activeTab]}
        </div>
      </div>
    </div>
  )
}
