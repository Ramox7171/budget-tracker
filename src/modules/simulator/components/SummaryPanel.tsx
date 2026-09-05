import { useTranslation } from 'react-i18next'
import { ImportButton } from '../../../components/ImportButton'

interface Props {
  budget: number
  spent: number
  remaining: number
  onReset: () => void
  onExport: () => void
  onImport: (file: File) => void
}

export function SummaryPanel({ budget, spent, remaining, onReset, onExport, onImport }: Props) {
  const { t, i18n } = useTranslation('simulator')
  const isOver = remaining < 0
  const usedRatio = budget > 0 ? Math.min(spent / budget, 1) : 0

  const formatMoney = (value: number) =>
    new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'PLN' }).format(value)

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-6 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink/50 dark:text-slate-400">
            {isOver ? t('overBudget') : t('available')}
          </p>
          <p
            className={`mt-1 font-mono text-4xl font-semibold tabular ${
              isOver ? 'text-ledger-red' : 'text-ledger-green'
            }`}
          >
            {formatMoney(remaining)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 text-xs text-ink/40 dark:text-slate-500">
          <button
            onClick={onExport}
            className="underline-offset-2 hover:text-ink/70 hover:underline dark:hover:text-slate-300"
          >
            {t('exportFile')}
          </button>
          <ImportButton
            onImport={onImport}
            className="underline-offset-2 hover:text-ink/70 hover:underline dark:hover:text-slate-300"
          >
            {t('importFile')}
          </ImportButton>
          <button
            onClick={onReset}
            className="underline-offset-2 hover:text-ink/70 hover:underline dark:hover:text-slate-300"
          >
            {t('changeBudget')}
          </button>
        </div>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
        <div
          className={`h-full rounded-full transition-all ${isOver ? 'bg-ledger-red' : 'bg-ledger-green'}`}
          style={{ width: `${usedRatio * 100}%` }}
        />
      </div>

      <div className="mt-3 flex justify-between font-mono text-xs tabular text-ink/50 dark:text-slate-500">
        <span>
          {t('spent')} {formatMoney(spent)}
        </span>
        <span>
          {t('budgetLabel')} {formatMoney(budget)}
        </span>
      </div>
    </div>
  )
}
