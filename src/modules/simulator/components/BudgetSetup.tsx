import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImportButton } from '../../../components/ImportButton'

interface Props {
  onSubmit: (budget: number) => void
  onImport: (file: File) => void
}

export function BudgetSetup({ onSubmit, onImport }: Props) {
  const { t } = useTranslation('simulator')
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const parsed = Number(value.replace(',', '.'))

    if (!value || Number.isNaN(parsed) || parsed <= 0) {
      setError(true)
      return
    }

    onSubmit(parsed)
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-6 dark:border-white/10 dark:bg-white/5">
      <p className="mb-1 text-sm text-ink/50 dark:text-slate-400">{t('intro')}</p>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">{t('question')}</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="relative">
          <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 font-mono text-2xl text-ink/30 dark:text-slate-600">
            zł
          </span>
          <input
            autoFocus
            inputMode="decimal"
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              setError(false)
            }}
            placeholder="0"
            className="w-full border-b-2 border-ink/15 bg-transparent py-2 pl-8 font-mono text-2xl tabular outline-none transition-colors focus:border-ledger-green dark:border-white/15 dark:text-slate-100"
          />
        </div>

        {error && <p className="mt-2 text-sm text-ledger-red">{t('invalidAmount')}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-ink py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/85 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          {t('setBudget')}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-ink/40 dark:text-slate-500">
        {t('orImport')}{' '}
        <ImportButton
          onImport={onImport}
          className="underline underline-offset-2 hover:text-ink/70 dark:hover:text-slate-300"
        >
          {t('importFile')}
        </ImportButton>
      </p>
    </div>
  )
}
