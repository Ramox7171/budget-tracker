export interface Account {
  id: string
  name: string
  openingBalance: number
  createdAt: number
}

export type TransactionSource = 'manual' | 'import'

export interface Transaction {
  id: string
  accountId: string
  date: string
  description: string
  category: string | null
  amount: number
  source: TransactionSource
  importBatchId?: string
  createdAt: number
}
