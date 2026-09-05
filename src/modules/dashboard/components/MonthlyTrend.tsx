import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Transaction } from '../../../types/finance'

const MONTHS_SHOWN = 6

interface Props {
  transactions: Transaction[]
}

function lastMonths(count: number): string[] {
  const now = new Date()
  const keys: string[] = []

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(date.toISOString().slice(0, 7))
  }

  return keys
}

export function MonthlyTrend({ transactions }: Props) {
  const { t, i18n } = useTranslation('dashboard')

  // Zostawiamy formatMoney do wyświetlania zaokrąglonych wartości
  const formatMoney = (value: number) =>
    new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }).format(value)

  const formatMonthLabel = (monthKey: string) =>
    new Intl.DateTimeFormat(i18n.language, { month: 'short' }).format(new Date(`${monthKey}-01`))

  const months = useMemo(() => {
    const totals = new Map<string, number>()

    for (const transaction of transactions) {
      if (transaction.amount >= 0) continue
      const key = transaction.date.slice(0, 7)
      totals.set(key, (totals.get(key) ?? 0) + Math.abs(transaction.amount))
    }

    return lastMonths(MONTHS_SHOWN).map((key) => ({ key, amount: totals.get(key) ?? 0 }))
  }, [transactions])

  const maxAmount = months.reduce((max, month) => Math.max(max, month.amount), 0)
  const hasData = maxAmount > 0

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{t('monthlyTrendTitle')}</p>
        <span className="font-mono text-xs text-ink/40 dark:text-slate-500">PLN</span>
      </div>

      {!hasData ? (
        <p className="mt-4 text-sm text-ink/40 dark:text-slate-500">{t('noCategoryData')}</p>
      ) : (
        <div className="mt-6 flex h-48 items-end justify-between gap-2">
          {months.map((month) => (
            <div key={month.key} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <div className="flex h-36 w-full items-end">
                <div
                  className="w-full rounded-t-md bg-ledger-red/70"
                  style={{
                    height: month.amount > 0 ? `${Math.max((month.amount / maxAmount) * 100, 4)}%` : '0%',
                  }}
                />
              </div>
              <span className="text-[11px] font-semibold uppercase text-ink/40 dark:text-slate-500">
                {formatMonthLabel(month.key)}
              </span>
              <span className="font-mono text-[10px] tabular text-center text-ink/60 dark:text-slate-300">
                {formatMoney(month.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}