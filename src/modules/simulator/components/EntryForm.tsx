import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onAdd: (label: string, amount: number) => void
}

export function EntryForm({ onAdd }: Props) {
  const { t } = useTranslation('simulator')
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const parsed = Number(amount.replace(',', '.'))

    if (!label.trim() || Number.isNaN(parsed) || parsed <= 0) return

    onAdd(label.trim(), parsed)
    setLabel('')
    setAmount('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        placeholder={t('itemPlaceholder')}
        className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      <input
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        inputMode="decimal"
        placeholder={t('amountPlaceholder')}
        className="w-24 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-right font-mono text-sm tabular outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-ink px-4 text-sm font-medium text-paper transition-colors hover:bg-ink/85 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
      >
        {t('addItem')}
      </button>
    </form>
  )
}
