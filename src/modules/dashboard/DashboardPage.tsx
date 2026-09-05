import { useTranslation } from 'react-i18next'
import { useAccounts } from '../accounts/useAccounts'
import { useBudget } from '../simulator/useBudget'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { MonthlyTrend } from './components/MonthlyTrend'

const RECENT_LIMIT = 6

export function DashboardPage() {
  const { t, i18n } = useTranslation('dashboard')
  const { accounts, transactions, totalBalance } = useAccounts()
  const { budget, remaining } = useBudget()

  const formatMoney = (value: number) =>
    new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'PLN' }).format(value)

  const formatDate = (isoDate: string) =>
    new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' }).format(new Date(isoDate))

  const accountName = (accountId: string) =>
    accounts.find((account) => account.id === accountId)?.name ?? ''

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
    .slice(0, RECENT_LIMIT)

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-lg font-semibold tracking-tight">{t('title')}</h1>
      <p className="mb-6 text-sm text-ink/50 dark:text-slate-400">{t('subtitle')}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm text-ink/50 dark:text-slate-400">{t('totalBalance')}</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular text-ink dark:text-slate-100">
            {formatMoney(totalBalance())}
          </p>
          <p className="mt-1 text-xs text-ink/40 dark:text-slate-500">
            {t('accountsCount', { count: accounts.length })}
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm text-ink/50 dark:text-slate-400">{t('budgetRemaining')}</p>
          {budget === null ? (
            <p className="mt-1 text-sm text-ink/40 dark:text-slate-500">{t('noBudget')}</p>
          ) : (
            <p
              className={`mt-1 font-mono text-2xl font-semibold tabular ${
                remaining < 0 ? 'text-ledger-red' : 'text-ledger-green'
              }`}
            >
              {formatMoney(remaining)}
            </p>
          )}
        </div>
      </div>

      <p className="mb-2 mt-6 text-sm font-medium text-ink/70 dark:text-slate-300">
        {t('recentTransactions')}
      </p>

      {recentTransactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 p-6 text-center dark:border-white/15">
          <p className="text-sm text-ink/50 dark:text-slate-400">{t('noTransactionsYet')}</p>
        </div>
      ) : (
        <ul className="divide-y divide-ink/8 overflow-hidden rounded-2xl border border-ink/10 bg-white/60 dark:divide-white/5 dark:border-white/10 dark:bg-white/5">
          {recentTransactions.map((transaction) => {
            const isExpense = transaction.amount < 0

            return (
              <li key={transaction.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{transaction.description}</p>
                  <p className="text-xs text-ink/40 dark:text-slate-500">
                    {accountName(transaction.accountId)} · {formatDate(transaction.date)}
                  </p>
                </div>
                <span
                  className={`shrink-0 font-mono text-sm tabular ${
                    isExpense ? 'text-ledger-red' : 'text-ledger-green'
                  }`}
                >
                  {isExpense ? '' : '+'}
                  {formatMoney(transaction.amount)}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <CategoryBreakdown transactions={transactions} />
        <MonthlyTrend transactions={transactions} />
      </div>
    </div>
  )
}
