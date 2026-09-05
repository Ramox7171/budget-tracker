import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  categories: string[]
  onAdd: (description: string, category: string | null, amount: number, date: string) => void
}

type Kind = 'expense' | 'income'

export function TransactionForm({ categories, onAdd }: Props) {
  const { t } = useTranslation('accounts')
  const [kind, setKind] = useState<Kind>('expense')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const parsed = Number(amount.replace(',', '.'))
    if (!description.trim() || !date || Number.isNaN(parsed) || parsed <= 0) return

    const signedAmount = kind === 'expense' ? -parsed : parsed
    onAdd(description.trim(), category.trim() || null, signedAmount, date)

    setDescription('')
    setCategory('')
    setAmount('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setKind('expense')}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            kind === 'expense'
              ? 'border-ledger-red bg-ledger-red/10 text-ledger-red'
              : 'border-ink/10 text-ink/60 hover:border-ink/25 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/25'
          }`}
        >
          {t('expense')}
        </button>
        <button
          type="button"
          onClick={() => setKind('income')}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            kind === 'income'
              ? 'border-ledger-green bg-ledger-green/10 text-ledger-green'
              : 'border-ink/10 text-ink/60 hover:border-ink/25 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/25'
          }`}
        >
          {t('income')}
        </button>
      </div>

      <input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder={t('transactionDescriptionPlaceholder')}
        className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
      />

      <div className="flex flex-wrap gap-2">
        <input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          list="account-categories"
          placeholder={t('category')}
          className="min-w-[8rem] flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="shrink-0 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
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
          {t('addTransaction')}
        </button>
      </div>

      <datalist id="account-categories">
        {categories.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
    </form>
  )
}
