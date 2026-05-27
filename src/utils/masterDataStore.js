/**
 * Centralized lookup data for POS (categories, units).
 * Persisted to localStorage — edit via Master Data page.
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MENU_ITEMS, CATEGORIES } from './menuData'
import { INVENTORY_ITEMS } from './inventoryData'

const SEED_UNITS = [
  'kg', 'g', 'liters', 'L', 'ml',
  'packets', 'trays', 'bottles', 'bunches', 'cans', 'blocks',
  'portions', 'pcs',
]

function seedFoodCategories() {
  const fromMenu = MENU_ITEMS.map(i => i.category)
  const fromSeed = CATEGORIES.filter(c => c !== 'All')
  return [...new Set([...fromMenu, ...fromSeed])].sort((a, b) => a.localeCompare(b))
}

function seedInventoryCategories() {
  const fromItems = INVENTORY_ITEMS.map(i => i.category)
  const fromSeed = ['Meat', 'Seafood', 'Vegetables', 'Groceries', 'Dairy', 'Spices', 'Oils']
  return [...new Set([...fromItems, ...fromSeed])].sort((a, b) => a.localeCompare(b))
}

function normalize(name) {
  return name.trim().toLowerCase()
}

function listReducer(list, action) {
  switch (action.type) {
    case 'add': {
      const trimmed = action.name.trim()
      if (!trimmed || list.some(i => normalize(i) === normalize(trimmed))) return list
      return [...list, trimmed].sort((a, b) => a.localeCompare(b))
    }
    case 'rename': {
      const trimmed = action.newName.trim()
      if (!trimmed || list.some(i => i !== action.oldName && normalize(i) === normalize(trimmed))) {
        return list
      }
      return list.map(i => i === action.oldName ? trimmed : i).sort((a, b) => a.localeCompare(b))
    }
    case 'delete':
      return list.filter(i => i !== action.name)
    default:
      return list
  }
}

function canAdd(list, name) {
  const trimmed = name?.trim()
  if (!trimmed) return false
  return !list.some(i => normalize(i) === normalize(trimmed))
}

function canRename(list, oldName, newName) {
  const trimmed = newName?.trim()
  if (!trimmed) return false
  return !list.some(i => i !== oldName && normalize(i) === normalize(trimmed))
}

export const useMasterDataStore = create(
  persist(
    (set, get) => ({
      foodCategories:      seedFoodCategories(),
      inventoryCategories: seedInventoryCategories(),
      units:               [...SEED_UNITS],

      addFoodCategory: (name) => {
        if (!canAdd(get().foodCategories, name)) return false
        set(s => ({ foodCategories: listReducer(s.foodCategories, { type: 'add', name }) }))
        return true
      },
      renameFoodCategory: (oldName, newName) => {
        if (!canRename(get().foodCategories, oldName, newName)) return false
        set(s => ({ foodCategories: listReducer(s.foodCategories, { type: 'rename', oldName, newName }) }))
        return true
      },
      deleteFoodCategory: (name) =>
        set(s => ({ foodCategories: listReducer(s.foodCategories, { type: 'delete', name }) })),

      addInventoryCategory: (name) => {
        if (!canAdd(get().inventoryCategories, name)) return false
        set(s => ({ inventoryCategories: listReducer(s.inventoryCategories, { type: 'add', name }) }))
        return true
      },
      renameInventoryCategory: (oldName, newName) => {
        if (!canRename(get().inventoryCategories, oldName, newName)) return false
        set(s => ({ inventoryCategories: listReducer(s.inventoryCategories, { type: 'rename', oldName, newName }) }))
        return true
      },
      deleteInventoryCategory: (name) =>
        set(s => ({ inventoryCategories: listReducer(s.inventoryCategories, { type: 'delete', name }) })),

      addUnit: (name) => {
        if (!canAdd(get().units, name)) return false
        set(s => ({ units: listReducer(s.units, { type: 'add', name }) }))
        return true
      },
      renameUnit: (oldName, newName) => {
        if (!canRename(get().units, oldName, newName)) return false
        set(s => ({ units: listReducer(s.units, { type: 'rename', oldName, newName }) }))
        return true
      },
      deleteUnit: (name) =>
        set(s => ({ units: listReducer(s.units, { type: 'delete', name }) })),
    }),
    {
      name:    'pos-master-data',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

/** Food filter dropdown: All + categories */
export function buildFoodCategoryFilterOptions(categories) {
  return [
    { value: 'All', label: 'All Categories' },
    ...categories.map(c => ({ value: c, label: c })),
  ]
}

export function buildSelectOptions(list) {
  return list.map(v => ({ value: v, label: v }))
}
