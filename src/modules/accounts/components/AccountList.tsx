import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Account } from '../../../types/finance'

interface Props {
  accounts: Account[]
  selectedAccountId: string | null
  onSelect: (accountId: string) => void
  onRemove: (accountId: string) => void
  onUpdate: (accountId: string, name: string, openingBalance: number) => void
  balanceFor: (accountId: string) => number
}

export function AccountList({ accounts, selectedAccountId, onSelect, onRemove, onUpdate, balanceFor }: Props) {
  const { t, i18n } = useTranslation(['accounts', 'common'])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [openingBalance, setOpeningBalance] = useState('')

  const formatMoney = (value: number) =>
    new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'PLN' }).format(value)

  const startEdit = (account: Account) => {
    setEditingId(account.id)
    setName(account.name)
    setOpeningBalance(String(account.openingBalance))
  }

  const handleSave = (event: FormEvent, id: string) => {
    event.preventDefault()
    if (!name.trim()) return

    const parsed = Number(openingBalance.replace(',', '.'))
    onUpdate(id, name.trim(), Number.isNaN(parsed) ? 0 : parsed)
    setEditingId(null)
  }

  if (accounts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/15 py-8 text-center dark:border-white/15">
        <p className="text-sm text-ink/40 dark:text-slate-500">{t('accounts:noAccounts')}</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-ink/8 overflow-hidden rounded-2xl border border-ink/10 bg-white/60 dark:divide-white/5 dark:border-white/10 dark:bg-white/5">
      {accounts.map((account) => {
        if (editingId === account.id) {
          return (
            <li key={account.id} className="px-4 py-3">
              <form onSubmit={(event) => handleSave(event, account.id)} className="flex flex-wrap items-center gap-2">
                <input
                  autoFocus
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="min-w-[8rem] flex-1 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-sm outline-none focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                />
                <input
                  value={openingBalance}
                  onChange={(event) => setOpeningBalance(event.target.value)}
                  inputMode="decimal"
                  className="w-28 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-right font-mono text-sm tabular outline-none focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
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

        const balance = balanceFor(account.id)
        const isActive = account.id === selectedAccountId

        return (
          <li
            key={account.id}
            className={`group flex items-center justify-between gap-3 px-4 py-3 transition-colors ${
              isActive ? 'bg-ledger-green/10' : 'hover:bg-ink/5 dark:hover:bg-white/5'
            }`}
          >
            <button onClick={() => onSelect(account.id)} className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-medium">{account.name}</p>
              <p
                className={`font-mono text-sm tabular ${
                  balance < 0 ? 'text-ledger-red' : 'text-ink/70 dark:text-slate-300'
                }`}
              >
                {formatMoney(balance)}
              </p>
            </button>
            <button
              onClick={() => startEdit(account)}
              aria-label={t('common:edit')}
              className="shrink-0 text-ink/25 opacity-0 transition-opacity hover:text-ink group-hover:opacity-100 dark:text-slate-600 dark:hover:text-slate-300"
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
              onClick={() => onRemove(account.id)}
              aria-label={`Usuń ${account.name}`}
              className="shrink-0 text-ink/25 opacity-0 transition-opacity hover:text-ledger-red group-hover:opacity-100 dark:text-slate-600"
            >
              ✕
            </button>
          </li>
        )
      })}
    </ul>
  )
}
