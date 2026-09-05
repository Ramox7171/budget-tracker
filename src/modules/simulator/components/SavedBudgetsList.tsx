import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SavedBudget } from '../types'

interface Props {
  savedBudgets: SavedBudget[]
  currentBudget: number | null
  onSave: (name: string) => void
  onLoad: (snapshot: SavedBudget) => void
  onRemove: (id: string) => void
}

function snapshotRemaining(snapshot: SavedBudget) {
  return snapshot.budget - snapshot.entries.reduce((sum, entry) => sum + entry.amount, 0)
}

export function SavedBudgetsList({ savedBudgets, currentBudget, onSave, onLoad, onRemove }: Props) {
  const { t, i18n } = useTranslation('simulator')
  const [name, setName] = useState('')

  const formatMoney = (value: number) =>
    new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'PLN' }).format(value)

  const formatDate = (timestamp: number) =>
    new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' }).format(timestamp)

  const handleSave = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return

    onSave(name.trim())
    setName('')
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-ink/70 dark:text-slate-300">{t('savedTitle')}</p>

      {currentBudget !== null && (
        <form onSubmit={handleSave} className="mb-3 flex gap-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('snapshotNamePlaceholder')}
            className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-ink px-4 text-sm font-medium text-paper transition-colors hover:bg-ink/85 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
          >
            {t('saveSnapshot')}
          </button>
        </form>
      )}

      {savedBudgets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 py-8 text-center dark:border-white/15">
          <p className="text-sm text-ink/40 dark:text-slate-500">{t('noSavedBudgets')}</p>
        </div>
      ) : (
        <ul className="divide-y divide-ink/8 overflow-hidden rounded-2xl border border-ink/10 bg-white/60 dark:divide-white/5 dark:border-white/10 dark:bg-white/5">
          {savedBudgets.map((snapshot) => {
            const remaining = snapshotRemaining(snapshot)
            const isOver = remaining < 0

            return (
              <li key={snapshot.id} className="group flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{snapshot.name}</p>
                  <p className="text-xs text-ink/40 dark:text-slate-500">
                    {t('savedOn')} {formatDate(snapshot.savedAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-sm tabular ${isOver ? 'text-ledger-red' : 'text-ledger-green'}`}
                  >
                    {formatMoney(remaining)}
                  </span>
                  <button
                    onClick={() => onLoad(snapshot)}
                    className="text-xs text-ink/50 underline-offset-2 hover:text-ink/80 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    {t('loadSnapshot')}
                  </button>
                  <button
                    onClick={() => onRemove(snapshot.id)}
                    aria-label={`Usuń ${snapshot.name}`}
                    className="text-ink/25 opacity-0 transition-opacity hover:text-ledger-red group-hover:opacity-100 dark:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
