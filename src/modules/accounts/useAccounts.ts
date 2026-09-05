import { useState } from 'react'
import type { Account, Transaction } from '../../types/finance'
import { readJson, writeJson } from '../../lib/storage'
import type { ParsedTransaction } from './csv/types'

interface AccountsState {
  accounts: Account[]
  transactions: Transaction[]
}

const STORAGE_KEY = 'accounts-state'
const EMPTY_STATE: AccountsState = { accounts: [], transactions: [] }

function fingerprint(transaction: Pick<Transaction, 'accountId' | 'date' | 'description' | 'amount'>) {
  return `${transaction.accountId}|${transaction.date}|${transaction.description}|${transaction.amount}`
}

export function useAccounts() {
  const [state, setState] = useState<AccountsState>(() => readJson(STORAGE_KEY, EMPTY_STATE))

  const persist = (next: AccountsState) => {
    setState(next)
    writeJson(STORAGE_KEY, next)
  }

  const addAccount = (name: string, openingBalance: number) => {
    const account: Account = {
      id: crypto.randomUUID(),
      name,
      openingBalance,
      createdAt: Date.now(),
    }
    persist({ ...state, accounts: [...state.accounts, account] })
    return account.id
  }

  const removeAccount = (accountId: string) => {
    persist({
      accounts: state.accounts.filter((account) => account.id !== accountId),
      transactions: state.transactions.filter((transaction) => transaction.accountId !== accountId),
    })
  }

  const updateAccount = (accountId: string, name: string, openingBalance: number) => {
    persist({
      ...state,
      accounts: state.accounts.map((account) =>
        account.id === accountId ? { ...account, name, openingBalance } : account,
      ),
    })
  }

  const removeTransaction = (transactionId: string) => {
    persist({
      ...state,
      transactions: state.transactions.filter((transaction) => transaction.id !== transactionId),
    })
  }

  const addManualTransaction = (
    accountId: string,
    description: string,
    category: string | null,
    amount: number,
    date: string,
  ) => {
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      accountId,
      date,
      description,
      category,
      amount,
      source: 'manual',
      createdAt: Date.now(),
    }
    persist({ ...state, transactions: [transaction, ...state.transactions] })
  }

  const updateTransaction = (
    transactionId: string,
    description: string,
    category: string | null,
    amount: number,
    date: string,
  ) => {
    persist({
      ...state,
      transactions: state.transactions.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, description, category, amount, date }
          : transaction,
      ),
    })
  }

  const importTransactions = (accountId: string, parsed: ParsedTransaction[]) => {
    const existingFingerprints = new Set(
      state.transactions
        .filter((transaction) => transaction.accountId === accountId)
        .map(fingerprint),
    )

    const batchId = crypto.randomUUID()
    const imported: Transaction[] = []
    let skipped = 0

    for (const row of parsed) {
      const key = fingerprint({ accountId, date: row.date, description: row.description, amount: row.amount })

      if (existingFingerprints.has(key)) {
        skipped++
        continue
      }

      existingFingerprints.add(key)
      imported.push({
        id: crypto.randomUUID(),
        accountId,
        date: row.date,
        description: row.description,
        category: row.category,
        amount: row.amount,
        source: 'import',
        importBatchId: batchId,
        createdAt: Date.now(),
      })
    }

    persist({ ...state, transactions: [...imported, ...state.transactions] })

    return { imported: imported.length, skipped }
  }

  const accountBalance = (accountId: string) => {
    const account = state.accounts.find((item) => item.id === accountId)
    if (!account) return 0

    const sum = state.transactions
      .filter((transaction) => transaction.accountId === accountId)
      .reduce((total, transaction) => total + transaction.amount, 0)

    return account.openingBalance + sum
  }

  const transactionsForAccount = (accountId: string) =>
    state.transactions
      .filter((transaction) => transaction.accountId === accountId)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)

  const totalBalance = () =>
    state.accounts.reduce((sum, account) => sum + accountBalance(account.id), 0)

  const knownCategories = () => {
    const set = new Set<string>()
    for (const transaction of state.transactions) {
      if (transaction.category) set.add(transaction.category)
    }
    return [...set].sort((a, b) => a.localeCompare(b))
  }

  return {
    accounts: state.accounts,
    transactions: state.transactions,
    addAccount,
    removeAccount,
    updateAccount,
    removeTransaction,
    updateTransaction,
    addManualTransaction,
    importTransactions,
    accountBalance,
    transactionsForAccount,
    totalBalance,
    knownCategories,
  }
}
