import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onAdd: (description: string, detail: string | null, amount: number, date: string, mileage: number | null) => void
}

export function ExpenseForm({ onAdd }: Props) {
  const { t } = useTranslation('cars')
  const [description, setDescription] = useState('')
  const [detail, setDetail] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [mileage, setMileage] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const parsedAmount = Number(amount.replace(',', '.'))
    if (!description.trim() || !date || Number.isNaN(parsedAmount)) return

    const parsedMileage = mileage.trim() ? Number(mileage.replace(/\s/g, '')) : null
    const finalMileage = parsedMileage !== null && Number.isNaN(parsedMileage) ? null : parsedMileage

    onAdd(description.trim(), detail.trim() || null, parsedAmount, date, finalMileage)

    setDescription('')
    setDetail('')
    setAmount('')
    setDate('')
    setMileage('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder={t('expenseDescriptionPlaceholder')}
        className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
      />

      <div className="flex flex-wrap gap-2">
        <input
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
          placeholder={t('expenseDetailPlaceholder')}
          className="min-w-[8rem] flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <input
          value={mileage}
          onChange={(event) => setMileage(event.target.value)}
          inputMode="numeric"
          placeholder={t('mileagePlaceholder')}
          className="w-28 shrink-0 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm tabular outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="min-w-[9rem] shrink-0 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
        />
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          inputMode="decimal"
          placeholder={t('amountPlaceholder')}
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
