export interface Entry {
  id: string
  label: string
  amount: number
  checked: boolean
  createdAt: number
}

export interface BudgetState {
  budget: number | null
  entries: Entry[]
}

export interface SavedBudget {
  id: string
  name: string
  budget: number
  entries: Entry[]
  savedAt: number
}
