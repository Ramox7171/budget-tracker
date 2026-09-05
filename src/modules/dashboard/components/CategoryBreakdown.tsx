import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Transaction } from '../../../types/finance'

type Period = 'month' | 'quarter' | 'all'

const TOP_CATEGORIES = 6

interface Props {
  transactions: Transaction[]
}

function periodStart(period: Period): string | null {
  const now = new Date()
  if (period === 'all') return null
  if (period === 'month') return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)

  const start = new Date(now)
  start.setMonth(start.getMonth() - 3)
  return start.toISOString().slice(0, 10)
}

export function CategoryBreakdown({ transactions }: Props) {
  const { t, i18n } = useTranslation('dashboard')
  const [period, setPeriod] = useState<Period>('all')

  const formatMoney = (value: number) =>
    new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'PLN' }).format(value)

  const categories = useMemo(() => {
    const cutoff = periodStart(period)
    const totals = new Map<string, number>()

    for (const transaction of transactions) {
      if (transaction.amount >= 0) continue
      if (cutoff && transaction.date < cutoff) continue

      const key = transaction.category ?? t('uncategorized')
      totals.set(key, (totals.get(key) ?? 0) + Math.abs(transaction.amount))
    }

    const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1])
    const top = sorted.slice(0, TOP_CATEGORIES)
    const restSum = sorted.slice(TOP_CATEGORIES).reduce((sum, [, value]) => sum + value, 0)

    if (restSum > 0) top.push([t('otherCategories'), restSum])

    return top
  }, [transactions, period, t])

  const maxAmount = categories.reduce((max, [, value]) => Math.max(max, value), 0)

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="inline-flex items-center overflow-hidden rounded-lg border border-ink/10 dark:border-white/10">
  {(['month', 'quarter', 'all'] as Period[]).map((option) => (
    <button
      key={option}
      onClick={() => setPeriod(option)}
      className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors leading-none flex items-center justify-center ${
        period === option
          ? 'bg-ink text-paper dark:bg-slate-100 dark:text-slate-900'
          : 'text-ink/50 hover:text-ink dark:text-slate-400 dark:hover:text-slate-100'
      }`}
    >
      {t(`period${option.charAt(0).toUpperCase()}${option.slice(1)}`)}
    </button>
  ))}
</div>

      {categories.length === 0 ? (
        <p className="mt-4 text-sm text-ink/40 dark:text-slate-500">{t('noCategoryData')}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {categories.map(([name, amount]) => (
            <div key={name}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-ink/80 dark:text-slate-200">{name}</span>
                <span className="shrink-0 font-mono tabular text-ink/60 dark:text-slate-400">
                  {formatMoney(amount)}
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-ledger-red/70"
                  style={{ width: maxAmount > 0 ? `${(amount / maxAmount) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
