import { useEffect, useState } from 'react'
import type { BudgetState, Entry } from './types'
import { downloadBudgetFile, parseBudgetFile } from './budgetFile'
import { readJson, writeJson } from '../../lib/storage'

const STORAGE_KEY = 'budget-tracker-state'
const EMPTY_STATE: BudgetState = { budget: null, entries: [] }

export function useBudget() {
  const [state, setState] = useState<BudgetState>(() => readJson(STORAGE_KEY, EMPTY_STATE))

  useEffect(() => {
    writeJson(STORAGE_KEY, state)
  }, [state])

  const setBudget = (budget: number) => {
    setState((prev) => ({ ...prev, budget }))
  }

  const addEntry = (label: string, amount: number) => {
    const entry: Entry = {
      id: crypto.randomUUID(),
      label,
      amount,
      checked: false,
      createdAt: Date.now(),
    }
    setState((prev) => ({ ...prev, entries: [entry, ...prev.entries] }))
  }

  const removeEntry = (id: string) => {
    setState((prev) => ({
      ...prev,
      entries: prev.entries.filter((entry) => entry.id !== id),
    }))
  }

  const updateEntry = (id: string, label: string, amount: number) => {
    setState((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) => (entry.id === id ? { ...entry, label, amount } : entry)),
    }))
  }

  const toggleEntry = (id: string) => {
    setState((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) =>
        entry.id === id ? { ...entry, checked: !entry.checked } : entry,
      ),
    }))
  }

  const resetBudget = () => {
    setState({ budget: null, entries: [] })
  }

  const applySnapshot = (budget: number, entries: Entry[]) => {
    setState({ budget, entries })
  }

  const exportToFile = () => {
    downloadBudgetFile(state)
  }

  const importFromFile = async (file: File) => {
    const raw = await file.text()
    const imported = parseBudgetFile(raw)
    setState(imported)
  }

  const spent = state.entries.reduce((sum, entry) => sum + entry.amount, 0)
  const remaining = (state.budget ?? 0) - spent

  return {
    budget: state.budget,
    entries: state.entries,
    spent,
    remaining,
    setBudget,
    addEntry,
    removeEntry,
    updateEntry,
    toggleEntry,
    resetBudget,
    applySnapshot,
    exportToFile,
    importFromFile,
  }
}
