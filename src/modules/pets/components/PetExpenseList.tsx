import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PetExpense, PetExpenseCategory } from '../../../types/pet'

interface Props {
  expenses: PetExpense[]
  onRemove: (id: string) => void
  onUpdate: (id: string, description: string, amount: number, category: PetExpenseCategory) => void
}

const CATEGORIES: PetExpenseCategory[] = ['VET', 'FOOD', 'ACCESSORIES', 'GROOMING', 'INSURANCE', 'OTHER']

export function PetExpenseList({ expenses, onRemove, onUpdate }: Props) {
  const { t, i18n } = useTranslation(['pets', 'common'])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<PetExpenseCategory>('OTHER')

  const formatMoney = (value: number) =>
    new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'PLN' }).format(value)

  const formatDate = (timestamp: number) =>
    new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' }).format(timestamp)

  const startEdit = (expense: PetExpense) => {
    setEditingId(expense.id)
    setDescription(expense.description)
    setAmount(String(expense.amount))
    setCategory(expense.category)
  }

  const handleSave = (event: FormEvent, id: string) => {
    event.preventDefault()
    const parsed = Number(amount.replace(',', '.'))
    if (!description.trim() || Number.isNaN(parsed) || parsed <= 0) return

    onUpdate(id, description.trim(), parsed, category)
    setEditingId(null)
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/15 py-10 text-center dark:border-white/15">
        <p className="text-sm text-ink/40 dark:text-slate-500">{t('pets:noExpenses')}</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-ink/8 overflow-hidden rounded-2xl border border-ink/10 bg-white/60 dark:divide-white/5 dark:border-white/10 dark:bg-white/5">
      {expenses.map((expense) => {
        if (editingId === expense.id) {
          return (
            <li key={expense.id} className="px-4 py-3">
              <form onSubmit={(event) => handleSave(event, expense.id)} className="flex flex-wrap items-center gap-2">
                <input
                  autoFocus
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="min-w-[8rem] flex-1 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-sm outline-none focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                />
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as PetExpenseCategory)}
                  className="rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-sm outline-none focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                >
                  {CATEGORIES.map((value) => (
                    <option key={value} value={value}>
                      {t(`pets:categories.${value}`)}
                    </option>
                  ))}
                </select>
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  inputMode="decimal"
                  className="w-24 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-right font-mono text-sm tabular outline-none focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-paper hover:bg-ink/85 dark:bg-slate-100 dark:text-slate-900"
                >
                  {t('common:save')}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="text-xs text-ink/40 hover:text-ink/70 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {t('common:cancel')}
                </button>
              </form>
            </li>
          )
        }

        return (
          <li key={expense.id} className="group flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{expense.description}</p>
              <p className="text-xs text-ink/40 dark:text-slate-500">
                {t(`pets:categories.${expense.category}`)} · {formatDate(expense.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-sm tabular text-ink/80 dark:text-slate-200">
                −{formatMoney(expense.amount)}
              </span>
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
                aria-label={`Usuń ${expense.description}`}
                className="text-ink/25 opacity-0 transition-opacity hover:text-ledger-red group-hover:opacity-100 dark:text-slate-600"
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
