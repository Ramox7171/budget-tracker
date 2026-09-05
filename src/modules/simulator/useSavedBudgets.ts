import { useState } from 'react'
import type { Entry, SavedBudget } from './types'
import { readJson, writeJson } from '../../lib/storage'

const STORAGE_KEY = 'budget-tracker-saved-budgets'

export function useSavedBudgets() {
  const [savedBudgets, setSavedBudgets] = useState<SavedBudget[]>(() => readJson(STORAGE_KEY, []))

  const persist = (next: SavedBudget[]) => {
    setSavedBudgets(next)
    writeJson(STORAGE_KEY, next)
  }

  const saveSnapshot = (name: string, budget: number, entries: Entry[]) => {
    const snapshot: SavedBudget = {
      id: crypto.randomUUID(),
      name,
      budget,
      entries,
      savedAt: Date.now(),
    }
    persist([snapshot, ...savedBudgets])
  }

  const removeSnapshot = (id: string) => {
    persist(savedBudgets.filter((snapshot) => snapshot.id !== id))
  }

  return { savedBudgets, saveSnapshot, removeSnapshot }
}
