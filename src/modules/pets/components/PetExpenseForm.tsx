import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PetExpenseCategory } from '../../../types/pet'

interface Props {
  onAdd: (description: string, amount: number, category: PetExpenseCategory) => void
}

const CATEGORIES: PetExpenseCategory[] = ['VET', 'FOOD', 'ACCESSORIES', 'GROOMING', 'INSURANCE', 'OTHER']

export function PetExpenseForm({ onAdd }: Props) {
  const { t } = useTranslation('pets')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<PetExpenseCategory>('FOOD')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const parsed = Number(amount.replace(',', '.'))
    if (!description.trim() || Number.isNaN(parsed) || parsed <= 0) return

    onAdd(description.trim(), parsed, category)
    setDescription('')
    setAmount('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder={t('expenseDescription')}
        className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
      />

      <div className="flex flex-wrap gap-2">
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as PetExpenseCategory)}
          className="min-w-[9rem] flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
        >
          {CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {t(`categories.${value}`)}
            </option>
          ))}
        </select>

        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          inputMode="decimal"
          placeholder={t('expenseAmount')}
          className="w-28 shrink-0 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-right font-mono text-sm tabular outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        <button
          type="submit"
          className="shrink-0 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink/85 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          {t('addExpense')}
        </button>
      </div>
    </form>
  )
}
