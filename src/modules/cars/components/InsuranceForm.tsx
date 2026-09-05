import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onAdd: (label: string, amount: number, date: string) => void
}

export function InsuranceForm({ onAdd }: Props) {
  const { t } = useTranslation('cars')
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const parsed = Number(amount.replace(',', '.'))
    if (!label.trim() || !date || Number.isNaN(parsed)) return

    onAdd(label.trim(), parsed, date)
    setLabel('')
    setAmount('')
    setDate('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <input
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        placeholder={t('insuranceLabelPlaceholder')}
        className="min-w-[10rem] flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
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
        {t('addInsurance')}
      </button>
    </form>
  )
}
