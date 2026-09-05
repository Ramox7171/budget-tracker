import { useTranslation } from 'react-i18next'
import { useTheme, type ThemeMode } from '../../../theme/ThemeContext'

const OPTIONS: { mode: ThemeMode; icon: JSX.Element }[] = [
  {
    mode: 'light',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        />
      </svg>
    ),
  },
  {
    mode: 'dark',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
        />
      </svg>
    ),
  },
  {
    mode: 'system',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <rect x="3" y="4.5" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M8.5 20h7M12 16.5V20" />
      </svg>
    ),
  },
]

export function ThemeSection() {
  const { t } = useTranslation(['settings', 'theme'])
  const { mode, setMode } = useTheme()

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-medium">{t('settings:appearance')}</p>
      <p className="mt-0.5 text-xs text-ink/50 dark:text-slate-400">{t('settings:appearanceHint')}</p>

      <div className="mt-4 flex gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option.mode}
            onClick={() => setMode(option.mode)}
            className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs transition-colors ${
              mode === option.mode
                ? 'border-ledger-green bg-ledger-green/10 text-ledger-green'
                : 'border-ink/10 text-ink/60 hover:border-ink/25 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/25'
            }`}
          >
            {option.icon}
            {t(`theme:${option.mode}`)}
          </button>
        ))}
      </div>
    </div>
  )
}
