import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'pl', label: 'Polski' },
  { code: 'en', label: 'English' },
] as const

export function LanguageSection() {
  const { t, i18n } = useTranslation('settings')

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-medium">{t('language')}</p>
      <p className="mt-0.5 text-xs text-ink/50 dark:text-slate-400">{t('languageHint')}</p>

      <div className="mt-4 flex gap-2">
        {LANGUAGES.map((language) => (
          <button
            key={language.code}
            onClick={() => i18n.changeLanguage(language.code)}
            className={`flex-1 rounded-xl border px-3 py-3 text-sm transition-colors ${
              i18n.language === language.code
                ? 'border-ledger-green bg-ledger-green/10 text-ledger-green'
                : 'border-ink/10 text-ink/60 hover:border-ink/25 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/25'
            }`}
          >
            {language.label}
          </button>
        ))}
      </div>
    </div>
  )
}
