import type { BudgetState, Entry } from './types'

type LegacyEntry = Omit<Entry, 'checked'> & { checked?: boolean }

function isLegacyEntry(value: unknown): value is LegacyEntry {
  if (typeof value !== 'object' || value === null) return false
  const entry = value as Record<string, unknown>
  return (
    typeof entry.id === 'string' &&
    typeof entry.label === 'string' &&
    typeof entry.amount === 'number' &&
    typeof entry.createdAt === 'number'
  )
}

export function parseBudgetFile(raw: string): BudgetState {
  const parsed = JSON.parse(raw) as Record<string, unknown>

  const budget = typeof parsed.budget === 'number' ? parsed.budget : null
  const entries: Entry[] = Array.isArray(parsed.entries)
    ? parsed.entries.filter(isLegacyEntry).map((entry) => ({ ...entry, checked: entry.checked ?? false }))
    : []

  if (budget === null) {
    throw new Error('Plik nie zawiera prawidłowej kwoty budżetu.')
  }

  return { budget, entries }
}

export function downloadBudgetFile(state: BudgetState) {
  const payload = JSON.stringify(state, null, 2)
  const blob = new Blob([payload], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const date = new Date().toISOString().slice(0, 10)

  const link = document.createElement('a')
  link.href = url
  link.download = `budzet-${date}.json`
  link.click()

  URL.revokeObjectURL(url)
}
