import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CarExpense } from '../../../types/car'

interface Props {
  expenses: CarExpense[]
  onRemove: (id: string) => void
  onUpdate: (id: string, description: string, detail: string | null, amount: number, date: string, mileage: number | null) => void
}

export function ExpenseList({ expenses, onRemove, onUpdate }: Props) {
  const { t, i18n } = useTranslation(['cars', 'common'])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [detail, setDetail] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [mileage, setMileage] = useState('')

  const formatMoney = (value: number) =>
    new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'PLN' }).format(value)

  const formatDate = (isoDate: string) =>
    new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' }).format(
      new Date(isoDate),
    )

  const startEdit = (expense: CarExpense) => {
    setEditingId(expense.id)
    setDescription(expense.description)
    setDetail(expense.detail ?? '')
    setAmount(String(expense.amount))
    setDate(expense.date)
    setMileage(expense.mileage !== null ? String(expense.mileage) : '')
  }

  const handleSave = (event: FormEvent, id: string) => {
    event.preventDefault()
    const parsedAmount = Number(amount.replace(',', '.'))
    if (!description.trim() || !date || Number.isNaN(parsedAmount)) return

    const parsedMileage = mileage.trim() ? Number(mileage.replace(/\s/g, '')) : null
    const finalMileage = parsedMileage !== null && Number.isNaN(parsedMileage) ? null : parsedMileage

    onUpdate(id, description.trim(), detail.trim() || null, parsedAmount, date, finalMileage)
    setEditingId(null)
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/15 py-8 text-center dark:border-white/15">
        <p className="text-sm text-ink/40 dark:text-slate-500">{t('cars:noExpenses')}</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-ink/8 overflow-hidden rounded-2xl border border-ink/10 bg-white/60 dark:divide-white/5 dark:border-white/10 dark:bg-white/5">
      {expenses.map((expense) => {
        if (editingId === expense.id) {
          return (
            <li key={expense.id} className="space-y-2 px-4 py-3">
              <form onSubmit={(event) => handleSave(event, expense.id)} className="space-y-2">
                <input
                  autoFocus
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="w-full rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-sm outline-none focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                />
                <div className="flex flex-wrap gap-2">
                  <input
                    value={detail}
                    onChange={(event) => setDetail(event.target.value)}
                    placeholder={t('cars:expenseDetailPlaceholder')}
                    className="min-w-[7rem] flex-1 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-sm outline-none focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                  />
                  <input
                    value={mileage}
                    onChange={(event) => setMileage(event.target.value)}
                    inputMode="numeric"
                    placeholder={t('cars:mileagePlaceholder')}
                    className="w-24 shrink-0 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-sm tabular outline-none focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                  />
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="shrink-0 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-sm outline-none focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                  />
                  <input
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    inputMode="decimal"
                    className="w-24 shrink-0 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-right font-mono text-sm tabular outline-none focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-paper hover:bg-ink/85 dark:bg-slate-100 dark:text-slate-900"
                  >
                    {t('common:save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="shrink-0 text-xs text-ink/40 hover:text-ink/70 dark:text-slate-500 dark:hover:text-slate-300"
                  >
                    {t('common:cancel')}
                  </button>
                </div>
              </form>
            </li>
          )
        }

        return (
          <li key={expense.id} className="group flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{expense.description}</p>
              <p className="text-xs text-ink/40 dark:text-slate-500">
                {formatDate(expense.date)}
                {expense.detail ? ` · ${expense.detail}` : ''}
                {expense.mileage !== null ? ` · ${expense.mileage.toLocaleString(i18n.language)} km` : ''}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="font-mono text-sm tabular text-ledger-red">{formatMoney(expense.amount)}</span>
              <button
                onClick={() => startEdit(expense)}
                aria-label={t('common:edit')}
                className="text-ink/25 opacity-0 transition-opacity hover:text-ink group-hover:opacity-100 dark:text-slate-600 dark:hover:text-slate-300"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                  <path
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.5 4.5 3 3L8 19H5v-3L16.5 4.5Z"
                  />
                </svg>
              </button>
              <button
                onClick={() => onRemove(expense.id)}
                className="text-ink/25 opacity-0 transition-opacity hover:text-ledger-red group-hover:opacity-100 dark:text-slate-600"
                aria-label={t('cars:removeExpense')}
              >
                ✕
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
