import { useTranslation } from 'react-i18next'
import { ThemeSection } from './components/ThemeSection'
import { LanguageSection } from './components/LanguageSection'
import { BackupSection } from './components/BackupSection'
import { PinSection } from './components/PinSection'
import { DemoDataSection } from './components/DemoDataSection'

export function SettingsPage() {
  const { t } = useTranslation('settings')

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-1 text-lg font-semibold tracking-tight">{t('title')}</h1>
      <p className="mb-6 text-sm text-ink/50 dark:text-slate-400">{t('subtitle')}</p>

      <div className="space-y-4">
        <ThemeSection />
        <LanguageSection />
        <PinSection />
        <BackupSection />
        <DemoDataSection />
      </div>
    </div>
  )
}
