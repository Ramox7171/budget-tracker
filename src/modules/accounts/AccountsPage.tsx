import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccounts } from './useAccounts'
import { AccountForm } from './components/AccountForm'
import { AccountList } from './components/AccountList'
import { CsvImportForm } from './components/CsvImportForm'
import { TransactionForm } from './components/TransactionForm'
import { TransactionList } from './components/TransactionList'
import { BANK_PARSERS } from './csv'

const PAGE_SIZE = 50

export function AccountsPage() {
  const { t } = useTranslation('accounts')
  const {
    accounts,
    addAccount,
    removeAccount,
    updateAccount,
    removeTransaction,
    updateTransaction,
    addManualTransaction,
    importTransactions,
    accountBalance,
    transactionsForAccount,
    knownCategories,
  } = useAccounts()

  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(accounts[0]?.id ?? null)
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [selectedAccountId, search])

  const handleAddAccount = (name: string, openingBalance: number) => {
    const id = addAccount(name, openingBalance)
    setSelectedAccountId(id)
  }

  const handleRemoveAccount = (accountId: string) => {
    removeAccount(accountId)
    if (accountId === selectedAccountId) setSelectedAccountId(null)
  }

  const handleImport = async (bankId: string, file: File) => {
    if (!selectedAccountId) throw new Error('no account selected')

    const parser = BANK_PARSERS.find((item) => item.id === bankId)
    if (!parser) throw new Error('unknown bank parser')

    const text = await file.text()
    const parsed = parser.parse(text)
    return importTransactions(selectedAccountId, parsed)
  }

  const allTransactions = selectedAccountId ? transactionsForAccount(selectedAccountId) : []

  const query = search.trim().toLowerCase()
  const filteredTransactions = query
    ? allTransactions.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(query) ||
          transaction.category?.toLowerCase().includes(query),
      )
    : allTransactions

  const visibleTransactions = filteredTransactions.slice(0, visibleCount)
  const remaining = filteredTransactions.length - visibleTransactions.length

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-lg font-semibold tracking-tight">{t('title')}</h1>
      <p className="mb-6 text-sm text-ink/50 dark:text-slate-400">{t('subtitle')}</p>

      <AccountForm onAdd={handleAddAccount} />

      <div className="mt-4">
        <AccountList
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onSelect={setSelectedAccountId}
          onRemove={handleRemoveAccount}
          onUpdate={updateAccount}
          balanceFor={accountBalance}
        />
      </div>

      {selectedAccountId && (
        <>
          <div className="mt-6">
            <CsvImportForm onImport={handleImport} />
          </div>

          <div className="mt-4">
            <TransactionForm
              categories={knownCategories()}
              onAdd={(description, category, amount, date) =>
                addManualTransaction(selectedAccountId, description, category, amount, date)
              }
            />
          </div>

          <div className="mb-2 mt-6 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-medium text-ink/70 dark:text-slate-300">{t('transactions')}</p>
            {filteredTransactions.length > 0 && (
              <p className="text-xs text-ink/40 dark:text-slate-500">
                {t('showingRecent', { count: visibleTransactions.length, total: filteredTransactions.length })}
              </p>
            )}
          </div>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('searchPlaceholder')}
            className="mb-3 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
          />

          {query && filteredTransactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/15 py-8 text-center dark:border-white/15">
              <p className="text-sm text-ink/40 dark:text-slate-500">{t('noSearchResults')}</p>
            </div>
          ) : (
            <>
              <TransactionList
                transactions={visibleTransactions}
                onRemove={removeTransaction}
                onUpdate={updateTransaction}
              />

              {remaining > 0 && (
                <button
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="mt-3 w-full rounded-lg border border-ink/10 py-2 text-sm font-medium text-ink/60 transition-colors hover:border-ink/25 hover:text-ink dark:border-white/10 dark:text-slate-400 dark:hover:border-white/25 dark:hover:text-slate-100"
                >
                  {t('loadMore', { count: remaining })}
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
