import { ChangeEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BANK_PARSERS } from '../csv'

interface Props {
  onImport: (bankId: string, file: File) => Promise<{ imported: number; skipped: number }>
}

export function CsvImportForm({ onImport }: Props) {
  const { t } = useTranslation('accounts')
  const [bankId, setBankId] = useState(BANK_PARSERS[0].id)
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const outcome = await onImport(bankId, file)
      setResult(outcome)
      setError(null)
    } catch {
      setError(t('importError'))
      setResult(null)
    }
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-medium">{t('importTitle')}</p>
      <p className="mt-0.5 text-xs text-ink/50 dark:text-slate-400">{t('importHint')}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <select
          value={bankId}
          onChange={(event) => setBankId(event.target.value)}
          className="min-w-[10rem] flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
        >
          {BANK_PARSERS.map((parser) => (
            <option key={parser.id} value={parser.id}>
              {parser.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="shrink-0 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink/85 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          {t('importButton')}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {result && (
        <p className="mt-3 text-xs text-ledger-green">
          {t('importSummary', { imported: result.imported, skipped: result.skipped })}
        </p>
      )}
      {error && <p className="mt-3 text-xs text-ledger-red">{error}</p>}
    </div>
  )
}
