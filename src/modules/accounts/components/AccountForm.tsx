import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  onAdd: (name: string, openingBalance: number) => void
}

export function AccountForm({ onAdd }: Props) {
  const { t } = useTranslation('accounts')
  const [name, setName] = useState('')
  const [openingBalance, setOpeningBalance] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return

    const parsed = Number(openingBalance.replace(',', '.'))
    onAdd(name.trim(), Number.isNaN(parsed) ? 0 : parsed)
    setName('')
    setOpeningBalance('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={t('accountNamePlaceholder')}
        className="min-w-[10rem] flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      <input
        value={openingBalance}
        onChange={(event) => setOpeningBalance(event.target.value)}
        inputMode="decimal"
        placeholder={t('openingBalancePlaceholder')}
        className="w-32 shrink-0 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-right font-mono text-sm tabular outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink/85 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
      >
        {t('addAccount')}
      </button>
    </form>
  )
}
