import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Entry } from '../types'

interface Props {
  entries: Entry[]
  onRemove: (id: string) => void
  onUpdate: (id: string, label: string, amount: number) => void
  onToggle: (id: string) => void
}

export function EntryList({ entries, onRemove, onUpdate, onToggle }: Props) {
  const { t, i18n } = useTranslation(['simulator', 'common'])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')

  const formatMoney = (value: number) =>
    new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'PLN' }).format(value)

  const formatDate = (timestamp: number) =>
    new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' }).format(timestamp)

  const startEdit = (entry: Entry) => {
    setEditingId(entry.id)
    setLabel(entry.label)
    setAmount(String(entry.amount))
  }

  const cancelEdit = () => setEditingId(null)

  const handleSave = (event: FormEvent, id: string) => {
    event.preventDefault()
    const parsed = Number(amount.replace(',', '.'))
    if (!label.trim() || Number.isNaN(parsed) || parsed <= 0) return

    onUpdate(id, label.trim(), parsed)
    setEditingId(null)
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/15 py-10 text-center dark:border-white/15">
        <p className="text-sm text-ink/40 dark:text-slate-500">{t('simulator:emptyList')}</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-ink/8 overflow-hidden rounded-2xl border border-ink/10 bg-white/60 dark:divide-white/5 dark:border-white/10 dark:bg-white/5">
      {entries.map((entry) => {
        if (editingId === entry.id) {
          return (
            <li key={entry.id} className="px-4 py-3">
              <form onSubmit={(event) => handleSave(event, entry.id)} className="flex flex-wrap items-center gap-2">
                <input
                  autoFocus
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-sm outline-none focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                />
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
                  onClick={cancelEdit}
                  className="text-xs text-ink/40 hover:text-ink/70 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {t('common:cancel')}
                </button>
              </form>
            </li>
          )
        }

        return (
          <li key={entry.id} className="group flex items-center justify-between gap-3 px-4 py-3">
            <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={Boolean(entry.checked)}
                onChange={() => onToggle(entry.id)}
                className="h-4 w-4 shrink-0 rounded border-ink/25 text-ledger-green accent-ledger-green focus:ring-ledger-green dark:border-white/25"
              />
              <span className="min-w-0">
                <p
                  className={`truncate text-sm font-medium ${
                    entry.checked ? 'text-ink/35 line-through dark:text-slate-600' : ''
                  }`}
                >
                  {entry.label}
                </p>
                <p className="text-xs text-ink/40 dark:text-slate-500">{formatDate(entry.createdAt)}</p>
              </span>
            </label>

            <div className="flex items-center gap-3">
              <span
                className={`font-mono text-sm tabular ${
                  entry.checked ? 'text-ink/35 line-through dark:text-slate-600' : 'text-ink/80 dark:text-slate-200'
                }`}
              >
                −{formatMoney(entry.amount)}
              </span>
              <button
                onClick={() => startEdit(entry)}
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
                onClick={() => onRemove(entry.id)}
                aria-label={`Usuń ${entry.label}`}
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
