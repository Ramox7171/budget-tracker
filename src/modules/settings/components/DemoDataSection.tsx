import { useTranslation } from 'react-i18next'
import { clearAllData, seedDemoData } from '../../../lib/demoData'

export function DemoDataSection() {
  const { t } = useTranslation('settings')

  const handleSeed = () => {
    if (!window.confirm(t('demoSeedConfirm'))) return
    seedDemoData()
    window.location.reload()
  }

  const handleClear = () => {
    if (!window.confirm(t('demoClearConfirm'))) return
    clearAllData()
    window.location.reload()
  }

  return (
    <div className="rounded-2xl border border-dashed border-ink/20 bg-white/40 p-5 dark:border-white/20 dark:bg-white/5">
      <p className="text-sm font-medium">{t('demoTitle')}</p>
      <p className="mt-0.5 text-xs text-ink/50 dark:text-slate-400">{t('demoHint')}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={handleSeed}
          className="rounded-lg border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:border-ink/30 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/30"
        >
          {t('demoSeed')}
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-ledger-red/30 px-4 py-2.5 text-sm font-medium text-ledger-red transition-colors hover:border-ledger-red/60"
        >
          {t('demoClear')}
        </button>
      </div>
    </div>
  )
}
