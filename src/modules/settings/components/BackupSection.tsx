import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImportButton } from '../../../components/ImportButton'
import { exportBackup, importBackup } from '../../../lib/backup'

export function BackupSection() {
  const { t } = useTranslation('settings')
  const [error, setError] = useState<string | null>(null)
  const [restoring, setRestoring] = useState(false)

  const handleImport = async (file: File) => {
    if (!window.confirm(t('backupImportConfirm'))) return

    setError(null)
    setRestoring(true)

    try {
      await importBackup(file)
      window.location.reload()
    } catch {
      setError(t('backupImportError'))
      setRestoring(false)
    }
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-medium">{t('backupTitle')}</p>
      <p className="mt-0.5 text-xs text-ink/50 dark:text-slate-400">{t('backupHint')}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={exportBackup}
          className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink/85 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          {t('backupExport')}
        </button>

        <ImportButton
          onImport={handleImport}
          className="rounded-lg border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-50 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/30 dark:hover:text-slate-100"
        >
          {restoring ? t('backupRestoring') : t('backupImport')}
        </ImportButton>
      </div>

      {error && <p className="mt-3 text-xs text-ledger-red">{error}</p>}
    </div>
  )
}
